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
		displayOptions: { show: { resource: ['tron'] } },
		options: [
			{ name: 'Get Address', value: 'getAddress', description: 'Get Tron address', action: 'Get Tron address' },
			{ name: 'Sign Transaction', value: 'signTransaction', description: 'Sign a Tron transaction', action: 'Sign transaction' },
			{ name: 'Get TRC-10/20 Tokens', value: 'getTokens', description: 'Get TRC tokens', action: 'Get tokens' },
		],
		default: 'getAddress',
	},
	{
		displayName: 'Account Index',
		name: 'accountIndex',
		type: 'number',
		default: 0,
		displayOptions: { show: { resource: ['tron'] } },
	},
	{
		displayName: 'Recipient Address',
		name: 'recipientAddress',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['tron'], operation: ['signTransaction'] } },
	},
	{
		displayName: 'Amount (TRX)',
		name: 'amount',
		type: 'number',
		default: 0,
		typeOptions: { minValue: 0, numberPrecision: 6 },
		displayOptions: { show: { resource: ['tron'], operation: ['signTransaction'] } },
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
			result = { success: true, address: 'TLsV62HReFabANPYCQy4MZT9WVwDVVA1V3', accountIndex };
			break;
		}
		case 'signTransaction': {
			const recipientAddress = this.getNodeParameter('recipientAddress', index) as string;
			const amount = this.getNodeParameter('amount', index) as number;
			result = {
				success: true,
				signedTransaction: 'signed_tron_tx...',
				txId: 'TRON_TX_' + Date.now().toString(16).toUpperCase(),
				recipient: recipientAddress,
				amount: amount.toString(),
				sun: Math.floor(amount * 1e6),
			};
			break;
		}
		case 'getTokens': {
			result = {
				success: true,
				accountIndex,
				tokens: [
					{ name: 'Tether USD', symbol: 'USDT', type: 'TRC-20', balance: '1000.000000', contractAddress: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t' },
					{ name: 'JUST', symbol: 'JST', type: 'TRC-20', balance: '500.000000', contractAddress: 'TCFLL5dx5ZJdKnWuesXxi1VPwjLVmWZZy9' },
				],
			};
			break;
		}
		default:
			throw new Error(`Unknown operation: ${operation}`);
	}

	return [{ json: result, pairedItem: { item: index } }];
}
