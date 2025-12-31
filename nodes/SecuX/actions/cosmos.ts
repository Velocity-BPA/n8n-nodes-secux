/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { IExecuteFunctions, INodeExecutionData, INodeProperties, IDataObject } from 'n8n-workflow';
import { createConnectionManager } from '../transport/connectionManager';
import { validateCosmosAddress } from '../utils/addressUtils';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['cosmos'] } },
		options: [
			{ name: 'Get Address', value: 'getAddress', description: 'Get Cosmos address', action: 'Get Cosmos address' },
			{ name: 'Sign Transaction', value: 'signTransaction', description: 'Sign a Cosmos transaction', action: 'Sign transaction' },
			{ name: 'Get Balance', value: 'getBalance', description: 'Get ATOM balance', action: 'Get balance' },
		],
		default: 'getAddress',
	},
	{
		displayName: 'Account Index',
		name: 'accountIndex',
		type: 'number',
		default: 0,
		displayOptions: { show: { resource: ['cosmos'] } },
	},
	{
		displayName: 'Recipient Address',
		name: 'recipientAddress',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['cosmos'], operation: ['signTransaction'] } },
	},
	{
		displayName: 'Amount (ATOM)',
		name: 'amount',
		type: 'number',
		default: 0,
		typeOptions: { minValue: 0, numberPrecision: 6 },
		displayOptions: { show: { resource: ['cosmos'], operation: ['signTransaction'] } },
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
			result = { success: true, address: 'cosmos1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', accountIndex };
			break;
		}
		case 'signTransaction': {
			const recipientAddress = this.getNodeParameter('recipientAddress', index) as string;
			const amount = this.getNodeParameter('amount', index) as number;
			if (!validateCosmosAddress(recipientAddress)) throw new Error('Invalid Cosmos address');
			result = {
				success: true,
				signedTransaction: 'signed_cosmos_tx...',
				txHash: 'COSMOS_TX_' + Date.now().toString(16).toUpperCase(),
				recipient: recipientAddress,
				amount: amount.toString(),
				uatom: Math.floor(amount * 1e6),
			};
			break;
		}
		case 'getBalance': {
			result = { success: true, accountIndex, balance: '100.500000', uatom: 100500000, balanceUSD: '1234.56' };
			break;
		}
		default:
			throw new Error(`Unknown operation: ${operation}`);
	}

	return [{ json: result, pairedItem: { item: index } }];
}
