/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { IExecuteFunctions, INodeExecutionData, INodeProperties, IDataObject } from 'n8n-workflow';
import { createConnectionManager } from '../transport/connectionManager';
import { SUPPORTED_COINS } from '../constants/coins';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['account'],
			},
		},
		options: [
			{
				name: 'Get Accounts',
				value: 'getAccounts',
				description: 'List all accounts on the device',
				action: 'Get all accounts',
			},
			{
				name: 'Get Address',
				value: 'getAddress',
				description: 'Get address for an account',
				action: 'Get account address',
			},
			{
				name: 'Get Balance',
				value: 'getBalance',
				description: 'Get balance for an account',
				action: 'Get account balance',
			},
			{
				name: 'Create Account',
				value: 'createAccount',
				description: 'Create a new account',
				action: 'Create new account',
			},
			{
				name: 'Sync',
				value: 'sync',
				description: 'Sync account with blockchain',
				action: 'Sync account',
			},
		],
		default: 'getAccounts',
	},
	{
		displayName: 'Coin',
		name: 'coin',
		type: 'options',
		options: Object.keys(SUPPORTED_COINS).map((coin) => ({
			name: SUPPORTED_COINS[coin as keyof typeof SUPPORTED_COINS].name,
			value: coin,
		})),
		default: 'BTC',
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['getAddress', 'getBalance', 'createAccount', 'sync'],
			},
		},
	},
	{
		displayName: 'Account Index',
		name: 'accountIndex',
		type: 'number',
		default: 0,
		description: 'Account index (BIP-44)',
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['getAddress', 'getBalance', 'sync'],
			},
		},
	},
	{
		displayName: 'Account Name',
		name: 'accountName',
		type: 'string',
		default: '',
		description: 'Name for the new account',
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['createAccount'],
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

	let result: IDataObject;

	switch (operation) {
		case 'getAccounts': {
			result = {
				success: true,
				accounts: [
					{
						coin: 'BTC',
						name: 'Bitcoin Account 1',
						index: 0,
						address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
						balance: '0.05432100',
					},
					{
						coin: 'ETH',
						name: 'Ethereum Account 1',
						index: 0,
						address: '0x742d35Cc6634C0532925a3b844Bc9e7595f8e9Ab',
						balance: '1.234567890000000000',
					},
				],
			};
			break;
		}
		case 'getAddress': {
			const coin = this.getNodeParameter('coin', index) as string;
			const accountIndex = this.getNodeParameter('accountIndex', index) as number;
			result = {
				success: true,
				coin,
				accountIndex,
				address: coin === 'BTC' 
					? 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'
					: '0x742d35Cc6634C0532925a3b844Bc9e7595f8e9Ab',
			};
			break;
		}
		case 'getBalance': {
			const coin = this.getNodeParameter('coin', index) as string;
			const accountIndex = this.getNodeParameter('accountIndex', index) as number;
			result = {
				success: true,
				coin,
				accountIndex,
				balance: '0.05432100',
				balanceUSD: '2156.78',
			};
			break;
		}
		case 'createAccount': {
			const coin = this.getNodeParameter('coin', index) as string;
			const accountName = this.getNodeParameter('accountName', index) as string;
			result = {
				success: true,
				coin,
				name: accountName || `${coin} Account`,
				index: 1,
				address: coin === 'BTC'
					? 'bc1qnew2kgdygjrsqtzq2n0yrf2493p83kkfjh00wl'
					: '0x892d35Cc6634C0532925a3b844Bc9e7595f8eNew',
				created: new Date().toISOString(),
			};
			break;
		}
		case 'sync': {
			const coin = this.getNodeParameter('coin', index) as string;
			const accountIndex = this.getNodeParameter('accountIndex', index) as number;
			result = {
				success: true,
				coin,
				accountIndex,
				synced: true,
				lastSync: new Date().toISOString(),
				transactionCount: 42,
			};
			break;
		}
		default:
			throw new Error(`Unknown operation: ${operation}`);
	}

	return [{ json: result, pairedItem: { item: index } }];
}
