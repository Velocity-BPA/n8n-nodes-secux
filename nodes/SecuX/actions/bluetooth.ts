/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { IExecuteFunctions, INodeExecutionData, INodeProperties, IDataObject } from 'n8n-workflow';
import { createConnectionManager } from '../transport/connectionManager';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['bluetooth'],
			},
		},
		options: [
			{
				name: 'Scan',
				value: 'scan',
				description: 'Scan for nearby SecuX devices',
				action: 'Scan for devices',
			},
			{
				name: 'Connect',
				value: 'connect',
				description: 'Connect via Bluetooth',
				action: 'Connect via Bluetooth',
			},
			{
				name: 'Pair',
				value: 'pair',
				description: 'Pair with a device',
				action: 'Pair with device',
			},
			{
				name: 'Get Signal Strength',
				value: 'getSignalStrength',
				description: 'Get Bluetooth signal strength (RSSI)',
				action: 'Get signal strength',
			},
		],
		default: 'scan',
	},
	{
		displayName: 'Scan Timeout (Seconds)',
		name: 'scanTimeout',
		type: 'number',
		default: 10,
		description: 'How long to scan for devices',
		displayOptions: {
			show: {
				resource: ['bluetooth'],
				operation: ['scan'],
			},
		},
	},
];

export async function execute(
	this: IExecuteFunctions,
	index: number,
	operation: string,
): Promise<INodeExecutionData[]> {
	const credentials = await this.getCredentials('secuXDevice');
	const connectionManager = createConnectionManager(credentials);

	let result: IDataObject;

	switch (operation) {
		case 'scan': {
			const timeout = this.getNodeParameter('scanTimeout', index, 10) as number;
			// Simulated scan results
			result = {
				success: true,
				devices: [
					{
						name: 'SecuX V20',
						address: 'AA:BB:CC:DD:EE:FF',
						rssi: -45,
						model: 'v20',
					},
				],
				scanDuration: timeout,
			};
			break;
		}
		case 'connect': {
			const deviceInfo = await connectionManager.connect();
			result = {
				success: true,
				connected: true,
				connectionType: 'bluetooth',
				device: deviceInfo,
			};
			break;
		}
		case 'pair': {
			await connectionManager.connect();
			result = {
				success: true,
				paired: true,
				message: 'Device paired successfully',
			};
			break;
		}
		case 'getSignalStrength': {
			await connectionManager.connect();
			const rssi = await connectionManager.getSignalStrength();
			result = {
				success: true,
				rssi,
				signalQuality: rssi !== null ? (rssi > -50 ? 'Excellent' : rssi > -70 ? 'Good' : 'Fair') : 'Unknown',
			};
			break;
		}
		default:
			throw new Error(`Unknown operation: ${operation}`);
	}

	return [{ json: result, pairedItem: { item: index } }];
}
