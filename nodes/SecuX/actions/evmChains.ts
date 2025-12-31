/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { IExecuteFunctions, INodeExecutionData, INodeProperties, IDataObject } from 'n8n-workflow';
import { createConnectionManager } from '../transport/connectionManager';
import { validateEthereumAddress } from '../utils/addressUtils';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['evmChains'],
			},
		},
		options: [
			{
				name: 'Get Address',
				value: 'getAddress',
				description: 'Get address for EVM chain',
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
				description: 'Get native token balance',
				action: 'Get balance',
			},
		],
		default: 'getAddress',
	},
	{
		displayName: 'Chain',
		name: 'chain',
		type: 'options',
		options: [
			{ name: 'BNB Smart Chain', value: 'BNB' },
			{ name: 'Polygon', value: 'MATIC' },
			{ name: 'Avalanche C-Chain', value: 'AVAX' },
			{ name: 'Arbitrum One', value: 'ARB' },
			{ name: 'Optimism', value: 'OP' },
			{ name: 'Fantom', value: 'FTM' },
			{ name: 'Cronos', value: 'CRO' },
			{ name: 'Base', value: 'BASE' },
			{ name: 'Gnosis', value: 'GNOSIS' },
		],
		default: 'MATIC',
		displayOptions: {
			show: {
				resource: ['evmChains'],
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
				resource: ['evmChains'],
			},
		},
	},
	{
		displayName: 'To Address',
		name: 'toAddress',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['evmChains'],
				operation: ['signTransaction'],
			},
		},
	},
	{
		displayName: 'Amount',
		name: 'amount',
		type: 'number',
		default: 0,
		typeOptions: { minValue: 0, numberPrecision: 18 },
		displayOptions: {
			show: {
				resource: ['evmChains'],
				operation: ['signTransaction'],
			},
		},
	},
	{
		displayName: 'Gas Limit',
		name: 'gasLimit',
		type: 'number',
		default: 21000,
		displayOptions: {
			show: {
				resource: ['evmChains'],
				operation: ['signTransaction'],
			},
		},
	},
];

const CHAIN_IDS: Record<string, number> = {
	BNB: 56,
	MATIC: 137,
	AVAX: 43114,
	ARB: 42161,
	OP: 10,
	FTM: 250,
	CRO: 25,
	BASE: 8453,
	GNOSIS: 100,
};

export async function execute(
	this: IExecuteFunctions,
	index: number,
	operation: string,
): Promise<INodeExecutionData[]> {
	const credentials = await this.getCredentials('secuXDevice');
	const connectionManager = createConnectionManager(credentials);
	await connectionManager.connect();

	const chain = this.getNodeParameter('chain', index) as string;
	const accountIndex = this.getNodeParameter('accountIndex', index) as number;
	const chainId = CHAIN_IDS[chain];
	let result: IDataObject;

	switch (operation) {
		case 'getAddress': {
			result = {
				success: true,
				chain,
				chainId,
				address: '0x742d35Cc6634C0532925a3b844Bc9e7595f8e9Ab',
				accountIndex,
			};
			break;
		}
		case 'signTransaction': {
			const toAddress = this.getNodeParameter('toAddress', index) as string;
			const amount = this.getNodeParameter('amount', index) as number;
			const gasLimit = this.getNodeParameter('gasLimit', index) as number;

			if (!validateEthereumAddress(toAddress)) {
				throw new Error('Invalid address');
			}

			result = {
				success: true,
				chain,
				chainId,
				signedTransaction: '0x02...signed...',
				txHash: '0x' + 'a'.repeat(64),
				to: toAddress,
				amount: amount.toString(),
				gasLimit,
			};
			break;
		}
		case 'getBalance': {
			result = {
				success: true,
				chain,
				chainId,
				accountIndex,
				balance: '100.500000000000000000',
				balanceUSD: '234.56',
			};
			break;
		}
		default:
			throw new Error(`Unknown operation: ${operation}`);
	}

	return [{ json: result, pairedItem: { item: index } }];
}
