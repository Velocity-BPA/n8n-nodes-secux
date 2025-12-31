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
} from 'n8n-workflow';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['terra'],
			},
		},
		options: [
			{
				name: 'Get Address',
				value: 'getAddress',
				description: 'Get Terra address from device',
				action: 'Get terra address',
			},
			{
				name: 'Sign Transaction',
				value: 'signTransaction',
				description: 'Sign a Terra transaction',
				action: 'Sign terra transaction',
			},
			{
				name: 'Get Balance',
				value: 'getBalance',
				description: 'Get LUNA balance',
				action: 'Get terra balance',
			},
		],
		default: 'getAddress',
	},
	{
		displayName: 'Account Index',
		name: 'accountIndex',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['terra'],
			},
		},
		default: 0,
		description: 'Account index for address derivation',
	},
	{
		displayName: 'Display On Device',
		name: 'displayOnDevice',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['terra'],
				operation: ['getAddress'],
			},
		},
		default: true,
		description: 'Whether to display the address on the device for verification',
	},
	{
		displayName: 'Address',
		name: 'address',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['terra'],
				operation: ['getBalance'],
			},
		},
		default: '',
		placeholder: 'terra1...',
		description: 'Terra address to check balance',
	},
	{
		displayName: 'Transaction Data',
		name: 'transactionData',
		type: 'json',
		displayOptions: {
			show: {
				resource: ['terra'],
				operation: ['signTransaction'],
			},
		},
		default: '{}',
		description: 'Terra transaction data in JSON format',
	},
];

export async function execute(
	this: IExecuteFunctions,
	index: number,
	operation: string,
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	if (operation === 'getAddress') {
		const accountIndex = this.getNodeParameter('accountIndex', index) as number;
		const displayOnDevice = this.getNodeParameter('displayOnDevice', index) as boolean;

		// Simulated Terra address derivation
		const path = `m/44'/330'/${accountIndex}'/0/0`;
		const address = `terra1${Buffer.from(`secux_terra_${accountIndex}`).toString('hex').slice(0, 38)}`;

		returnData.push({
			json: {
				success: true,
				address,
				path,
				displayedOnDevice: displayOnDevice,
				network: 'terra',
			},
			pairedItem: { item: index },
		});
	} else if (operation === 'getBalance') {
		const address = this.getNodeParameter('address', index) as string;

		// Simulated balance check
		returnData.push({
			json: {
				success: true,
				address,
				balance: '0',
				balanceFormatted: '0 LUNA',
				network: 'terra',
			},
			pairedItem: { item: index },
		});
	} else if (operation === 'signTransaction') {
		const accountIndex = this.getNodeParameter('accountIndex', index) as number;
		const transactionData = this.getNodeParameter('transactionData', index) as string;

		const path = `m/44'/330'/${accountIndex}'/0/0`;
		const txData = JSON.parse(transactionData);

		// Simulated transaction signing
		returnData.push({
			json: {
				success: true,
				signedTransaction: {
					signature: Buffer.from(`terra_sig_${Date.now()}`).toString('hex'),
					publicKey: Buffer.from(`terra_pubkey_${accountIndex}`).toString('hex'),
				},
				path,
				transactionData: txData,
			},
			pairedItem: { item: index },
		});
	}

	return returnData;
}
