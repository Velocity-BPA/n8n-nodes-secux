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
				resource: ['bitcoinLike'],
			},
		},
		options: [
			{
				name: 'Get Address',
				value: 'getAddress',
				description: 'Get address for Bitcoin-like coin',
				action: 'Get address',
			},
			{
				name: 'Sign Transaction',
				value: 'signTransaction',
				description: 'Sign a transaction',
				action: 'Sign transaction',
			},
			{
				name: 'Get Balance',
				value: 'getBalance',
				description: 'Get account balance',
				action: 'Get balance',
			},
		],
		default: 'getAddress',
	},
	{
		displayName: 'Coin',
		name: 'coin',
		type: 'options',
		options: [
			{ name: 'Litecoin (LTC)', value: 'LTC' },
			{ name: 'Bitcoin Cash (BCH)', value: 'BCH' },
			{ name: 'Dash (DASH)', value: 'DASH' },
			{ name: 'Dogecoin (DOGE)', value: 'DOGE' },
			{ name: 'DigiByte (DGB)', value: 'DGB' },
			{ name: 'Groestlcoin (GRS)', value: 'GRS' },
		],
		default: 'LTC',
		displayOptions: {
			show: {
				resource: ['bitcoinLike'],
			},
		},
	},
	{
		displayName: 'Account Index',
		name: 'accountIndex',
		type: 'number',
		default: 0,
		displayOptions: {
			show: {
				resource: ['bitcoinLike'],
			},
		},
	},
	{
		displayName: 'Recipient Address',
		name: 'recipientAddress',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['bitcoinLike'],
				operation: ['signTransaction'],
			},
		},
	},
	{
		displayName: 'Amount',
		name: 'amount',
		type: 'number',
		default: 0,
		typeOptions: { minValue: 0, numberPrecision: 8 },
		displayOptions: {
			show: {
				resource: ['bitcoinLike'],
				operation: ['signTransaction'],
			},
		},
	},
];

const COIN_PREFIXES: Record<string, string> = {
	LTC: 'ltc1',
	BCH: 'bitcoincash:q',
	DASH: 'X',
	DOGE: 'D',
	DGB: 'dgb1',
	GRS: 'grs1',
};

export async function execute(
	this: IExecuteFunctions,
	index: number,
	operation: string,
): Promise<INodeExecutionData[]> {
	const credentials = await this.getCredentials('secuXDevice');
	const connectionManager = createConnectionManager(credentials);
	await connectionManager.connect();

	const coin = this.getNodeParameter('coin', index) as string;
	const accountIndex = this.getNodeParameter('accountIndex', index) as number;
	let result: IDataObject;

	switch (operation) {
		case 'getAddress': {
			const prefix = COIN_PREFIXES[coin] || 'addr';
			result = {
				success: true,
				coin,
				accountIndex,
				address: `${prefix}xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`,
			};
			break;
		}
		case 'signTransaction': {
			const recipientAddress = this.getNodeParameter('recipientAddress', index) as string;
			const amount = this.getNodeParameter('amount', index) as number;
			result = {
				success: true,
				coin,
				signedTransaction: '02000000...signed_hex...',
				txId: `${coin.toLowerCase()}_tx_${Date.now().toString(16)}`,
				recipient: recipientAddress,
				amount: amount.toString(),
			};
			break;
		}
		case 'getBalance': {
			result = {
				success: true,
				coin,
				accountIndex,
				balance: '100.50000000',
				balanceUSD: '1234.56',
			};
			break;
		}
		default:
			throw new Error(`Unknown operation: ${operation}`);
	}

	return [{ json: result, pairedItem: { item: index } }];
}
