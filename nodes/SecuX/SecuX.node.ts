/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import * as device from './actions/device';
import * as bluetooth from './actions/bluetooth';
import * as account from './actions/account';
import * as bitcoin from './actions/bitcoin';
import * as bitcoinLike from './actions/bitcoinLike';
import * as ethereum from './actions/ethereum';
import * as evmChains from './actions/evmChains';
import * as solana from './actions/solana';
import * as xrp from './actions/xrp';
import * as cosmos from './actions/cosmos';
import * as tron from './actions/tron';
import * as cardano from './actions/cardano';
import * as stellar from './actions/stellar';
import * as terra from './actions/terra';
import * as multiChain from './actions/multiChain';
import * as token from './actions/token';
import * as nft from './actions/nft';
import * as transaction from './actions/transaction';
import * as signing from './actions/signing';
import * as address from './actions/address';
import * as secuxess from './actions/secuxess';
import * as pin from './actions/pin';
import * as security from './actions/security';
import * as backup from './actions/backup';
import * as firmware from './actions/firmware';
import * as utility from './actions/utility';

export class SecuX implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'SecuX',
		name: 'secuX',
		icon: 'file:secux.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with SecuX hardware wallets for secure cryptocurrency operations',
		defaults: {
			name: 'SecuX',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'secuXDevice',
				required: true,
			},
			{
				name: 'secuXess',
				required: false,
				displayOptions: {
					show: {
						resource: ['secuxess'],
					},
				},
			},
			{
				name: 'secuXNetwork',
				required: false,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Account',
						value: 'account',
						description: 'Manage wallet accounts',
					},
					{
						name: 'Address',
						value: 'address',
						description: 'Address operations',
					},
					{
						name: 'Backup',
						value: 'backup',
						description: 'Backup and recovery operations',
					},
					{
						name: 'Bitcoin',
						value: 'bitcoin',
						description: 'Bitcoin operations',
					},
					{
						name: 'Bitcoin-Like',
						value: 'bitcoinLike',
						description: 'Bitcoin-like coin operations (LTC, BCH, etc.)',
					},
					{
						name: 'Bluetooth',
						value: 'bluetooth',
						description: 'Bluetooth connection management',
					},
					{
						name: 'Cardano',
						value: 'cardano',
						description: 'Cardano (ADA) operations',
					},
					{
						name: 'Cosmos',
						value: 'cosmos',
						description: 'Cosmos (ATOM) operations',
					},
					{
						name: 'Device',
						value: 'device',
						description: 'Device management operations',
					},
					{
						name: 'Ethereum',
						value: 'ethereum',
						description: 'Ethereum operations',
					},
					{
						name: 'EVM Chains',
						value: 'evmChains',
						description: 'EVM-compatible chain operations',
					},
					{
						name: 'Firmware',
						value: 'firmware',
						description: 'Firmware management',
					},
					{
						name: 'Multi-Chain',
						value: 'multiChain',
						description: 'Cross-chain operations',
					},
					{
						name: 'NFT',
						value: 'nft',
						description: 'NFT operations',
					},
					{
						name: 'PIN',
						value: 'pin',
						description: 'PIN management',
					},
					{
						name: 'SecuXess',
						value: 'secuxess',
						description: 'SecuXess portfolio integration',
					},
					{
						name: 'Security',
						value: 'security',
						description: 'Security operations',
					},
					{
						name: 'Signing',
						value: 'signing',
						description: 'Transaction and message signing',
					},
					{
						name: 'Solana',
						value: 'solana',
						description: 'Solana (SOL) operations',
					},
					{
						name: 'Stellar',
						value: 'stellar',
						description: 'Stellar (XLM) operations',
					},
					{
						name: 'Terra',
						value: 'terra',
						description: 'Terra (LUNA) operations',
					},
					{
						name: 'Token',
						value: 'token',
						description: 'Token operations (ERC-20, BEP-20, etc.)',
					},
					{
						name: 'Transaction',
						value: 'transaction',
						description: 'Transaction operations',
					},
					{
						name: 'Tron',
						value: 'tron',
						description: 'Tron (TRX) operations',
					},
					{
						name: 'Utility',
						value: 'utility',
						description: 'Utility functions',
					},
					{
						name: 'XRP',
						value: 'xrp',
						description: 'XRP Ledger operations',
					},
				],
				default: 'device',
			},
			// Device operations
			...device.description,
			// Bluetooth operations
			...bluetooth.description,
			// Account operations
			...account.description,
			// Bitcoin operations
			...bitcoin.description,
			// Bitcoin-like operations
			...bitcoinLike.description,
			// Ethereum operations
			...ethereum.description,
			// EVM chains operations
			...evmChains.description,
			// Solana operations
			...solana.description,
			// XRP operations
			...xrp.description,
			// Cosmos operations
			...cosmos.description,
			// Tron operations
			...tron.description,
			// Cardano operations
			...cardano.description,
			// Stellar operations
			...stellar.description,
			// Terra operations
			...terra.description,
			// Multi-chain operations
			...multiChain.description,
			// Token operations
			...token.description,
			// NFT operations
			...nft.description,
			// Transaction operations
			...transaction.description,
			// Signing operations
			...signing.description,
			// Address operations
			...address.description,
			// SecuXess operations
			...secuxess.description,
			// PIN operations
			...pin.description,
			// Security operations
			...security.description,
			// Backup operations
			...backup.description,
			// Firmware operations
			...firmware.description,
			// Utility operations
			...utility.description,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let result: INodeExecutionData[] = [];

				switch (resource) {
					case 'device':
						result = await device.execute.call(this, i, operation);
						break;
					case 'bluetooth':
						result = await bluetooth.execute.call(this, i, operation);
						break;
					case 'account':
						result = await account.execute.call(this, i, operation);
						break;
					case 'bitcoin':
						result = await bitcoin.execute.call(this, i, operation);
						break;
					case 'bitcoinLike':
						result = await bitcoinLike.execute.call(this, i, operation);
						break;
					case 'ethereum':
						result = await ethereum.execute.call(this, i, operation);
						break;
					case 'evmChains':
						result = await evmChains.execute.call(this, i, operation);
						break;
					case 'solana':
						result = await solana.execute.call(this, i, operation);
						break;
					case 'xrp':
						result = await xrp.execute.call(this, i, operation);
						break;
					case 'cosmos':
						result = await cosmos.execute.call(this, i, operation);
						break;
					case 'tron':
						result = await tron.execute.call(this, i, operation);
						break;
					case 'cardano':
						result = await cardano.execute.call(this, i, operation);
						break;
					case 'stellar':
						result = await stellar.execute.call(this, i, operation);
						break;
					case 'terra':
						result = await terra.execute.call(this, i, operation);
						break;
					case 'multiChain':
						result = await multiChain.execute.call(this, i, operation);
						break;
					case 'token':
						result = await token.execute.call(this, i, operation);
						break;
					case 'nft':
						result = await nft.execute.call(this, i, operation);
						break;
					case 'transaction':
						result = await transaction.execute.call(this, i, operation);
						break;
					case 'signing':
						result = await signing.execute.call(this, i, operation);
						break;
					case 'address':
						result = await address.execute.call(this, i, operation);
						break;
					case 'secuxess':
						result = await secuxess.execute.call(this, i, operation);
						break;
					case 'pin':
						result = await pin.execute.call(this, i, operation);
						break;
					case 'security':
						result = await security.execute.call(this, i, operation);
						break;
					case 'backup':
						result = await backup.execute.call(this, i, operation);
						break;
					case 'firmware':
						result = await firmware.execute.call(this, i, operation);
						break;
					case 'utility':
						result = await utility.execute.call(this, i, operation);
						break;
					default:
						throw new Error(`Unknown resource: ${resource}`);
				}

				returnData.push(...result);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: (error as Error).message,
						},
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
