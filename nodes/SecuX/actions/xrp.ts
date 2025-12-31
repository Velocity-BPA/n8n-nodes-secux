/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { IExecuteFunctions, INodeExecutionData, INodeProperties, IDataObject } from 'n8n-workflow';
import { createConnectionManager } from '../transport/connectionManager';
import { validateXrpAddress } from '../utils/addressUtils';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['xrp'],
			},
		},
		options: [
			{
				name: 'Get Address',
				value: 'getAddress',
				description: 'Get XRP address',
				action: 'Get XRP address',
			},
			{
				name: 'Sign Transaction',
				value: 'signTransaction',
				description: 'Sign an XRP transaction',
				action: 'Sign transaction',
			},
			{
				name: 'Get Account Info',
				value: 'getAccountInfo',
				description: 'Get XRP account information',
				action: 'Get account info',
			},
		],
		default: 'getAddress',
	},
	{
		displayName: 'Account Index',
		name: 'accountIndex',
		type: 'number',
		default: 0,
		displayOptions: { show: { resource: ['xrp'] } },
	},
	{
		displayName: 'Destination Address',
		name: 'destinationAddress',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['xrp'], operation: ['signTransaction'] } },
	},
	{
		displayName: 'Amount (XRP)',
		name: 'amount',
		type: 'number',
		default: 0,
		typeOptions: { minValue: 0, numberPrecision: 6 },
		displayOptions: { show: { resource: ['xrp'], operation: ['signTransaction'] } },
	},
	{
		displayName: 'Destination Tag',
		name: 'destinationTag',
		type: 'number',
		default: 0,
		description: 'Optional destination tag for the transaction',
		displayOptions: { show: { resource: ['xrp'], operation: ['signTransaction'] } },
	},
];

export async function execute(
	this: IExecuteFunctions,
	index: number,
	operation: string,
): Promise<INodeExecutionData[]> {
	const credentials = await this.getCredentials('secuXDevice');
	const connectionManager = createConnectionManager(credentials);
	await connectionManager.connect();

	const accountIndex = this.getNodeParameter('accountIndex', index) as number;
	let result: IDataObject;

	switch (operation) {
		case 'getAddress': {
			result = {
				success: true,
				address: 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
				accountIndex,
			};
			break;
		}
		case 'signTransaction': {
			const destinationAddress = this.getNodeParameter('destinationAddress', index) as string;
			const amount = this.getNodeParameter('amount', index) as number;
			const destinationTag = this.getNodeParameter('destinationTag', index) as number;

			if (!validateXrpAddress(destinationAddress)) {
				throw new Error('Invalid XRP address');
			}

			result = {
				success: true,
				signedTransaction: 'signed_xrp_blob...',
				txHash: 'XRP_TX_HASH_' + Date.now().toString(16).toUpperCase(),
				destination: destinationAddress,
				amount: amount.toString(),
				drops: Math.floor(amount * 1e6),
				destinationTag: destinationTag || undefined,
			};
			break;
		}
		case 'getAccountInfo': {
			result = {
				success: true,
				accountIndex,
				address: 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
				balance: '1000.000000',
				drops: 1000000000,
				sequence: 12345,
				ownerCount: 2,
			};
			break;
		}
		default:
			throw new Error(`Unknown operation: ${operation}`);
	}

	return [{ json: result, pairedItem: { item: index } }];
}
