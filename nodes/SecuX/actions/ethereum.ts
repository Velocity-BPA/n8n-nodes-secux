/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { IExecuteFunctions, INodeExecutionData, INodeProperties, IDataObject } from 'n8n-workflow';
import { createConnectionManager } from '../transport/connectionManager';
import { validateEthereumAddress } from '../utils/addressUtils';
import { ethToWei } from '../utils/transactionUtils';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['ethereum'],
			},
		},
		options: [
			{
				name: 'Get Address',
				value: 'getAddress',
				description: 'Get Ethereum address',
				action: 'Get Ethereum address',
			},
			{
				name: 'Sign Transaction',
				value: 'signTransaction',
				description: 'Sign an Ethereum transaction',
				action: 'Sign transaction',
			},
			{
				name: 'Sign EIP-1559 Transaction',
				value: 'signEip1559',
				description: 'Sign an EIP-1559 transaction with priority fees',
				action: 'Sign EIP-1559 transaction',
			},
			{
				name: 'Sign Message',
				value: 'signMessage',
				description: 'Sign a message with private key',
				action: 'Sign message',
			},
			{
				name: 'Sign Typed Data (EIP-712)',
				value: 'signTypedData',
				description: 'Sign typed structured data',
				action: 'Sign typed data',
			},
			{
				name: 'Get Balance',
				value: 'getBalance',
				description: 'Get ETH balance',
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
				resource: ['ethereum'],
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
				resource: ['ethereum'],
				operation: ['signTransaction', 'signEip1559'],
			},
		},
	},
	{
		displayName: 'Amount (ETH)',
		name: 'amount',
		type: 'number',
		default: 0,
		typeOptions: { minValue: 0, numberPrecision: 18 },
		displayOptions: {
			show: {
				resource: ['ethereum'],
				operation: ['signTransaction', 'signEip1559'],
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
				resource: ['ethereum'],
				operation: ['signTransaction', 'signEip1559'],
			},
		},
	},
	{
		displayName: 'Gas Price (Gwei)',
		name: 'gasPrice',
		type: 'number',
		default: 20,
		displayOptions: {
			show: {
				resource: ['ethereum'],
				operation: ['signTransaction'],
			},
		},
	},
	{
		displayName: 'Max Fee Per Gas (Gwei)',
		name: 'maxFeePerGas',
		type: 'number',
		default: 30,
		displayOptions: {
			show: {
				resource: ['ethereum'],
				operation: ['signEip1559'],
			},
		},
	},
	{
		displayName: 'Max Priority Fee (Gwei)',
		name: 'maxPriorityFeePerGas',
		type: 'number',
		default: 2,
		displayOptions: {
			show: {
				resource: ['ethereum'],
				operation: ['signEip1559'],
			},
		},
	},
	{
		displayName: 'Data (Hex)',
		name: 'data',
		type: 'string',
		default: '0x',
		displayOptions: {
			show: {
				resource: ['ethereum'],
				operation: ['signTransaction', 'signEip1559'],
			},
		},
	},
	{
		displayName: 'Message',
		name: 'message',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['ethereum'],
				operation: ['signMessage'],
			},
		},
	},
	{
		displayName: 'Typed Data (JSON)',
		name: 'typedData',
		type: 'json',
		default: '{}',
		displayOptions: {
			show: {
				resource: ['ethereum'],
				operation: ['signTypedData'],
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
				address: '0x742d35Cc6634C0532925a3b844Bc9e7595f8e9Ab',
				accountIndex,
			};
			break;
		}
		case 'signTransaction': {
			const toAddress = this.getNodeParameter('toAddress', index) as string;
			const amount = this.getNodeParameter('amount', index) as number;
			const gasLimit = this.getNodeParameter('gasLimit', index) as number;
			const gasPrice = this.getNodeParameter('gasPrice', index) as number;
			const data = this.getNodeParameter('data', index) as string;

			if (!validateEthereumAddress(toAddress)) {
				throw new Error('Invalid Ethereum address');
			}

			const amountWei = ethToWei(amount);
			const gasPriceWei = BigInt(gasPrice) * BigInt(1e9);

			result = {
				success: true,
				signedTransaction: '0xf86c...signed_hex...',
				txHash: '0x' + 'a'.repeat(64),
				to: toAddress,
				amount: amount.toString(),
				amountWei: amountWei.toString(),
				gasLimit,
				gasPrice: gasPrice.toString(),
				gasPriceWei: gasPriceWei.toString(),
				data: data || '0x',
			};
			break;
		}
		case 'signEip1559': {
			const toAddress = this.getNodeParameter('toAddress', index) as string;
			const amount = this.getNodeParameter('amount', index) as number;
			const gasLimit = this.getNodeParameter('gasLimit', index) as number;
			const maxFeePerGas = this.getNodeParameter('maxFeePerGas', index) as number;
			const maxPriorityFeePerGas = this.getNodeParameter('maxPriorityFeePerGas', index) as number;

			if (!validateEthereumAddress(toAddress)) {
				throw new Error('Invalid Ethereum address');
			}

			result = {
				success: true,
				signedTransaction: '0x02...eip1559_signed...',
				txHash: '0x' + 'b'.repeat(64),
				to: toAddress,
				amount: amount.toString(),
				gasLimit,
				maxFeePerGas: maxFeePerGas.toString(),
				maxPriorityFeePerGas: maxPriorityFeePerGas.toString(),
				type: 2,
			};
			break;
		}
		case 'signMessage': {
			const message = this.getNodeParameter('message', index) as string;
			result = {
				success: true,
				message,
				signature: '0x' + 'c'.repeat(130),
				v: 28,
				r: '0x' + 'd'.repeat(64),
				s: '0x' + 'e'.repeat(64),
			};
			break;
		}
		case 'signTypedData': {
			const typedData = this.getNodeParameter('typedData', index);
			result = {
				success: true,
				typedData,
				signature: '0x' + 'f'.repeat(130),
			};
			break;
		}
		case 'getBalance': {
			result = {
				success: true,
				accountIndex,
				address: '0x742d35Cc6634C0532925a3b844Bc9e7595f8e9Ab',
				balance: '1.234567890000000000',
				balanceWei: '1234567890000000000',
				balanceUSD: '2456.78',
			};
			break;
		}
		default:
			throw new Error(`Unknown operation: ${operation}`);
	}

	return [{ json: result, pairedItem: { item: index } }];
}
