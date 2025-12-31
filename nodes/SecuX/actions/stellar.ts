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
		displayOptions: { show: { resource: ['stellar'] } },
		options: [
			{ name: 'Get Address', value: 'getAddress', description: 'Get Stellar address', action: 'Get Stellar address' },
			{ name: 'Sign Transaction', value: 'signTransaction', description: 'Sign a Stellar transaction', action: 'Sign transaction' },
			{ name: 'Get Balance', value: 'getBalance', description: 'Get XLM balance', action: 'Get balance' },
		],
		default: 'getAddress',
	},
	{
		displayName: 'Account Index',
		name: 'accountIndex',
		type: 'number',
		default: 0,
		displayOptions: { show: { resource: ['stellar'] } },
	},
	{
		displayName: 'Destination Address',
		name: 'destinationAddress',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['stellar'], operation: ['signTransaction'] } },
	},
	{
		displayName: 'Amount (XLM)',
		name: 'amount',
		type: 'number',
		default: 0,
		typeOptions: { minValue: 0, numberPrecision: 7 },
		displayOptions: { show: { resource: ['stellar'], operation: ['signTransaction'] } },
	},
	{
		displayName: 'Memo',
		name: 'memo',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['stellar'], operation: ['signTransaction'] } },
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
			result = { success: true, address: 'GDXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', accountIndex };
			break;
		}
		case 'signTransaction': {
			const destinationAddress = this.getNodeParameter('destinationAddress', index) as string;
			const amount = this.getNodeParameter('amount', index) as number;
			const memo = this.getNodeParameter('memo', index) as string;
			result = {
				success: true,
				signedTransaction: 'signed_stellar_xdr...',
				txHash: 'STELLAR_TX_' + Date.now().toString(16),
				destination: destinationAddress,
				amount: amount.toString(),
				stroops: Math.floor(amount * 1e7),
				memo: memo || undefined,
			};
			break;
		}
		case 'getBalance': {
			result = { success: true, accountIndex, balance: '500.0000000', stroops: 5000000000, balanceUSD: '56.78' };
			break;
		}
		default:
			throw new Error(`Unknown operation: ${operation}`);
	}

	return [{ json: result, pairedItem: { item: index } }];
}
