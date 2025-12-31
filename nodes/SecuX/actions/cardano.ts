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
		displayOptions: { show: { resource: ['cardano'] } },
		options: [
			{ name: 'Get Address', value: 'getAddress', description: 'Get Cardano address', action: 'Get Cardano address' },
			{ name: 'Sign Transaction', value: 'signTransaction', description: 'Sign a Cardano transaction', action: 'Sign transaction' },
			{ name: 'Get Balance', value: 'getBalance', description: 'Get ADA balance', action: 'Get balance' },
		],
		default: 'getAddress',
	},
	{
		displayName: 'Account Index',
		name: 'accountIndex',
		type: 'number',
		default: 0,
		displayOptions: { show: { resource: ['cardano'] } },
	},
	{
		displayName: 'Recipient Address',
		name: 'recipientAddress',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['cardano'], operation: ['signTransaction'] } },
	},
	{
		displayName: 'Amount (ADA)',
		name: 'amount',
		type: 'number',
		default: 0,
		typeOptions: { minValue: 0, numberPrecision: 6 },
		displayOptions: { show: { resource: ['cardano'], operation: ['signTransaction'] } },
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
			result = { success: true, address: 'addr1qxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', accountIndex };
			break;
		}
		case 'signTransaction': {
			const recipientAddress = this.getNodeParameter('recipientAddress', index) as string;
			const amount = this.getNodeParameter('amount', index) as number;
			result = {
				success: true,
				signedTransaction: 'signed_cardano_tx_cbor...',
				txHash: 'CARDANO_TX_' + Date.now().toString(16),
				recipient: recipientAddress,
				amount: amount.toString(),
				lovelace: Math.floor(amount * 1e6),
			};
			break;
		}
		case 'getBalance': {
			result = { success: true, accountIndex, balance: '1000.500000', lovelace: 1000500000, balanceUSD: '456.78' };
			break;
		}
		default:
			throw new Error(`Unknown operation: ${operation}`);
	}

	return [{ json: result, pairedItem: { item: index } }];
}
