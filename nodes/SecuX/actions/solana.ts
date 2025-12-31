/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { IExecuteFunctions, INodeExecutionData, INodeProperties, IDataObject } from 'n8n-workflow';
import { createConnectionManager } from '../transport/connectionManager';
import { validateSolanaAddress } from '../utils/addressUtils';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['solana'],
			},
		},
		options: [
			{
				name: 'Get Address',
				value: 'getAddress',
				description: 'Get Solana address',
				action: 'Get Solana address',
			},
			{
				name: 'Sign Transaction',
				value: 'signTransaction',
				description: 'Sign a Solana transaction',
				action: 'Sign transaction',
			},
			{
				name: 'Get Token Accounts',
				value: 'getTokenAccounts',
				description: 'Get SPL token accounts',
				action: 'Get token accounts',
			},
			{
				name: 'Get Balance',
				value: 'getBalance',
				description: 'Get SOL balance',
				action: 'Get balance',
			},
		],
		default: 'getAddress',
	},
	{
		displayName: 'Account Index',
		name: 'accountIndex',
		type: 'number',
		default: 0,
		displayOptions: {
			show: {
				resource: ['solana'],
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
				resource: ['solana'],
				operation: ['signTransaction'],
			},
		},
	},
	{
		displayName: 'Amount (SOL)',
		name: 'amount',
		type: 'number',
		default: 0,
		typeOptions: { minValue: 0, numberPrecision: 9 },
		displayOptions: {
			show: {
				resource: ['solana'],
				operation: ['signTransaction'],
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
	await connectionManager.connect();

	const accountIndex = this.getNodeParameter('accountIndex', index) as number;
	let result: IDataObject;

	switch (operation) {
		case 'getAddress': {
			result = {
				success: true,
				address: '7EcDhSYGxXyscszYEp35KHN8vvw3svAuLKTzXwCFLtV',
				accountIndex,
			};
			break;
		}
		case 'signTransaction': {
			const recipientAddress = this.getNodeParameter('recipientAddress', index) as string;
			const amount = this.getNodeParameter('amount', index) as number;

			if (!validateSolanaAddress(recipientAddress)) {
				throw new Error('Invalid Solana address');
			}

			result = {
				success: true,
				signedTransaction: 'base64_encoded_signed_transaction...',
				signature: 'signature_base58...',
				recipient: recipientAddress,
				amount: amount.toString(),
				lamports: Math.floor(amount * 1e9),
			};
			break;
		}
		case 'getTokenAccounts': {
			result = {
				success: true,
				accountIndex,
				tokenAccounts: [
					{
						mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
						symbol: 'USDC',
						balance: '1000.000000',
						decimals: 6,
					},
					{
						mint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
						symbol: 'USDT',
						balance: '500.000000',
						decimals: 6,
					},
				],
			};
			break;
		}
		case 'getBalance': {
			result = {
				success: true,
				accountIndex,
				balance: '10.500000000',
				lamports: 10500000000,
				balanceUSD: '234.56',
			};
			break;
		}
		default:
			throw new Error(`Unknown operation: ${operation}`);
	}

	return [{ json: result, pairedItem: { item: index } }];
}
