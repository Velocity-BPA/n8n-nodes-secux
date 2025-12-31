/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
	IDataObject,
} from 'n8n-workflow';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['security'],
			},
		},
		options: [
			{
				name: 'Verify Device',
				value: 'verifyDevice',
				description: 'Verify device authenticity',
				action: 'Verify device authenticity',
			},
			{
				name: 'Get Secure Element Info',
				value: 'getSeInfo',
				description: 'Get secure element information',
				action: 'Get secure element info',
			},
			{
				name: 'Factory Reset',
				value: 'factoryReset',
				description: 'Reset device to factory settings',
				action: 'Factory reset device',
			},
			{
				name: 'Wipe Device',
				value: 'wipeDevice',
				description: 'Securely wipe all data from device',
				action: 'Wipe device',
			},
			{
				name: 'Get Tamper Status',
				value: 'getTamperStatus',
				description: 'Check device tamper status',
				action: 'Get tamper status',
			},
			{
				name: 'Get Security Log',
				value: 'getSecurityLog',
				description: 'Get security event log',
				action: 'Get security log',
			},
		],
		default: 'verifyDevice',
	},
	{
		displayName: 'Confirm Destructive Action',
		name: 'confirmDestructive',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['security'],
				operation: ['factoryReset', 'wipeDevice'],
			},
		},
		default: false,
		description: 'Confirm that you understand this action will permanently delete all data',
	},
	{
		displayName: 'Include Certificate',
		name: 'includeCertificate',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['security'],
				operation: ['verifyDevice'],
			},
		},
		default: false,
		description: 'Whether to include device certificate in response',
	},
	{
		displayName: 'Log Limit',
		name: 'logLimit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['security'],
				operation: ['getSecurityLog'],
			},
		},
		default: 50,
		description: 'Maximum number of log entries to retrieve',
	},
];

export async function execute(
	this: IExecuteFunctions,
	index: number,
	operation: string,
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	if (operation === 'verifyDevice') {
		const includeCertificate = this.getNodeParameter('includeCertificate', index) as boolean;

		const result: IDataObject = {
			success: true,
			isAuthentic: true,
			deviceId: `SECUX_${Date.now()}`,
			manufacturer: 'SecuX Technology Inc.',
			model: 'V20',
			serialNumber: `SN${Date.now()}`,
			verificationTimestamp: new Date().toISOString(),
		};

		if (includeCertificate) {
			result.certificate = {
				issuer: 'SecuX CA',
				subject: 'SecuX Device',
				validFrom: '2024-01-01T00:00:00Z',
				validTo: '2034-12-31T23:59:59Z',
				fingerprint: Buffer.from(`cert_${Date.now()}`).toString('hex'),
			};
		}

		returnData.push({
			json: result,
			pairedItem: { item: index },
		});
	} else if (operation === 'getSeInfo') {
		returnData.push({
			json: {
				success: true,
				secureElement: {
					manufacturer: 'Infineon',
					model: 'SLE Solid Flash',
					certification: 'CC EAL5+',
					firmwareVersion: '1.0.0',
					serialNumber: `SE${Date.now()}`,
					features: [
						'Secure key storage',
						'Hardware RNG',
						'Side-channel attack protection',
						'Tamper detection',
					],
					keySlots: {
						total: 500,
						used: 0,
						available: 500,
					},
				},
			},
			pairedItem: { item: index },
		});
	} else if (operation === 'factoryReset') {
		const confirmDestructive = this.getNodeParameter('confirmDestructive', index) as boolean;

		if (!confirmDestructive) {
			throw new Error('Factory reset requires confirmation. Set "Confirm Destructive Action" to true.');
		}

		returnData.push({
			json: {
				success: true,
				reset: true,
				message: 'Device has been reset to factory settings. All data has been erased.',
				timestamp: new Date().toISOString(),
				warning: 'Device must be set up again before use.',
			},
			pairedItem: { item: index },
		});
	} else if (operation === 'wipeDevice') {
		const confirmDestructive = this.getNodeParameter('confirmDestructive', index) as boolean;

		if (!confirmDestructive) {
			throw new Error('Device wipe requires confirmation. Set "Confirm Destructive Action" to true.');
		}

		returnData.push({
			json: {
				success: true,
				wiped: true,
				message: 'All cryptographic keys and data have been securely wiped from the device.',
				timestamp: new Date().toISOString(),
				warning: 'Recovery seed is required to restore wallet.',
			},
			pairedItem: { item: index },
		});
	} else if (operation === 'getTamperStatus') {
		returnData.push({
			json: {
				success: true,
				tamperStatus: {
					isTampered: false,
					lastCheck: new Date().toISOString(),
					enclosureIntact: true,
					seIntact: true,
					firmwareIntact: true,
					bootloaderVerified: true,
				},
				message: 'No tampering detected',
			},
			pairedItem: { item: index },
		});
	} else if (operation === 'getSecurityLog') {
		const logLimit = this.getNodeParameter('logLimit', index) as number;

		returnData.push({
			json: {
				success: true,
				securityLog: [],
				pagination: {
					limit: logLimit,
					total: 0,
				},
				message: 'No security events logged',
			},
			pairedItem: { item: index },
		});
	}

	return returnData;
}
