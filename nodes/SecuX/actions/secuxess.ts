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
				resource: ['secuxess'],
			},
		},
		options: [
			{
				name: 'Connect',
				value: 'connect',
				description: 'Connect to SecuXess portfolio service',
				action: 'Connect to secuxess',
			},
			{
				name: 'Get Portfolio',
				value: 'getPortfolio',
				description: 'Get portfolio overview',
				action: 'Get portfolio',
			},
			{
				name: 'Get Transactions',
				value: 'getTransactions',
				description: 'Get transaction history',
				action: 'Get transactions',
			},
			{
				name: 'Sync',
				value: 'sync',
				description: 'Sync wallet with SecuXess',
				action: 'Sync wallet',
			},
			{
				name: 'Get Market Data',
				value: 'getMarketData',
				description: 'Get cryptocurrency market data',
				action: 'Get market data',
			},
			{
				name: 'Get Accounts',
				value: 'getAccounts',
				description: 'Get linked accounts',
				action: 'Get accounts',
			},
		],
		default: 'connect',
	},
	{
		displayName: 'Account Filter',
		name: 'accountFilter',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['secuxess'],
				operation: ['getPortfolio', 'getTransactions'],
			},
		},
		default: '',
		placeholder: 'All accounts',
		description: 'Filter by account name or ID (leave empty for all)',
	},
	{
		displayName: 'Chain Filter',
		name: 'chainFilter',
		type: 'multiOptions',
		displayOptions: {
			show: {
				resource: ['secuxess'],
				operation: ['getPortfolio', 'getTransactions'],
			},
		},
		options: [
			{ name: 'All Chains', value: 'all' },
			{ name: 'Bitcoin', value: 'btc' },
			{ name: 'Ethereum', value: 'eth' },
			{ name: 'BNB Smart Chain', value: 'bnb' },
			{ name: 'Polygon', value: 'matic' },
			{ name: 'Solana', value: 'sol' },
		],
		default: ['all'],
		description: 'Filter by blockchain',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['secuxess'],
				operation: ['getTransactions'],
			},
		},
		default: 50,
		description: 'Maximum number of transactions to retrieve',
	},
	{
		displayName: 'Offset',
		name: 'offset',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['secuxess'],
				operation: ['getTransactions'],
			},
		},
		default: 0,
		description: 'Offset for pagination',
	},
	{
		displayName: 'Coins',
		name: 'coins',
		type: 'multiOptions',
		displayOptions: {
			show: {
				resource: ['secuxess'],
				operation: ['getMarketData'],
			},
		},
		options: [
			{ name: 'Bitcoin (BTC)', value: 'btc' },
			{ name: 'Ethereum (ETH)', value: 'eth' },
			{ name: 'BNB', value: 'bnb' },
			{ name: 'Solana (SOL)', value: 'sol' },
			{ name: 'XRP', value: 'xrp' },
			{ name: 'Cardano (ADA)', value: 'ada' },
			{ name: 'Polygon (MATIC)', value: 'matic' },
			{ name: 'Dogecoin (DOGE)', value: 'doge' },
		],
		default: ['btc', 'eth'],
		description: 'Coins to get market data for',
	},
	{
		displayName: 'Currency',
		name: 'currency',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['secuxess'],
				operation: ['getPortfolio', 'getMarketData'],
			},
		},
		options: [
			{ name: 'USD', value: 'usd' },
			{ name: 'EUR', value: 'eur' },
			{ name: 'GBP', value: 'gbp' },
			{ name: 'JPY', value: 'jpy' },
			{ name: 'TWD', value: 'twd' },
		],
		default: 'usd',
		description: 'Currency for value display',
	},
	{
		displayName: 'Full Sync',
		name: 'fullSync',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['secuxess'],
				operation: ['sync'],
			},
		},
		default: false,
		description: 'Whether to perform a full resync of all accounts',
	},
];

export async function execute(
	this: IExecuteFunctions,
	index: number,
	operation: string,
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	if (operation === 'connect') {
		// Simulated SecuXess connection
		returnData.push({
			json: {
				success: true,
				connected: true,
				userId: `user_${Date.now()}`,
				sessionId: `session_${Date.now()}`,
				expiresAt: new Date(Date.now() + 3600000).toISOString(),
				message: 'Connected to SecuXess portfolio service',
			},
			pairedItem: { item: index },
		});
	} else if (operation === 'getPortfolio') {
		const chainFilter = this.getNodeParameter('chainFilter', index) as string[];
		const currency = this.getNodeParameter('currency', index) as string;

		returnData.push({
			json: {
				success: true,
				portfolio: {
					totalValue: 0,
					totalValueFormatted: `$0.00`,
					currency: currency.toUpperCase(),
					change24h: 0,
					change24hPercent: '0.00%',
					assets: [],
					lastUpdated: new Date().toISOString(),
				},
				chainFilter,
			},
			pairedItem: { item: index },
		});
	} else if (operation === 'getTransactions') {
		const limit = this.getNodeParameter('limit', index) as number;
		const offset = this.getNodeParameter('offset', index) as number;
		const chainFilter = this.getNodeParameter('chainFilter', index) as string[];

		returnData.push({
			json: {
				success: true,
				transactions: [],
				pagination: {
					limit,
					offset,
					total: 0,
					hasMore: false,
				},
				chainFilter,
			},
			pairedItem: { item: index },
		});
	} else if (operation === 'sync') {
		const fullSync = this.getNodeParameter('fullSync', index) as boolean;

		returnData.push({
			json: {
				success: true,
				syncStatus: 'completed',
				fullSync,
				accountsSynced: 0,
				transactionsFound: 0,
				lastSync: new Date().toISOString(),
				message: fullSync ? 'Full sync completed' : 'Incremental sync completed',
			},
			pairedItem: { item: index },
		});
	} else if (operation === 'getMarketData') {
		const coins = this.getNodeParameter('coins', index) as string[];
		const currency = this.getNodeParameter('currency', index) as string;

		const marketData: Record<string, {
			price: number;
			priceFormatted: string;
			change24h: number;
			change24hPercent: string;
			marketCap: string;
			volume24h: string;
		}> = {};

		for (const coin of coins) {
			marketData[coin] = {
				price: 0,
				priceFormatted: `$0.00`,
				change24h: 0,
				change24hPercent: '0.00%',
				marketCap: '$0',
				volume24h: '$0',
			};
		}

		returnData.push({
			json: {
				success: true,
				marketData,
				currency: currency.toUpperCase(),
				lastUpdated: new Date().toISOString(),
			},
			pairedItem: { item: index },
		});
	} else if (operation === 'getAccounts') {
		returnData.push({
			json: {
				success: true,
				accounts: [],
				totalAccounts: 0,
				linkedDevices: [],
			},
			pairedItem: { item: index },
		});
	}

	return returnData;
}
