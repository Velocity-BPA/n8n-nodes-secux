/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
	IPollFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
} from 'n8n-workflow';

/**
 * Create event data based on event type
 */
function createEventData(event: string): IDataObject | null {
	const timestamp = new Date().toISOString();

	switch (event) {
		case 'deviceConnected':
			return {
				event: 'device.connected',
				timestamp,
				device: {
					model: 'V20',
					serialNumber: `SN${Date.now()}`,
					connectionType: 'usb',
					firmwareVersion: '2.0.0',
				},
			};

		case 'deviceDisconnected':
			return {
				event: 'device.disconnected',
				timestamp,
				device: {
					model: 'V20',
					serialNumber: `SN${Date.now()}`,
					reason: 'user_initiated',
				},
			};

		case 'batteryLow':
			return {
				event: 'device.battery_low',
				timestamp,
				device: {
					model: 'V20',
					batteryLevel: 15,
					estimatedTimeRemaining: '30 minutes',
				},
			};

		case 'transactionSigned':
			return {
				event: 'transaction.signed',
				timestamp,
				transaction: {
					hash: `0x${Buffer.from(`tx_${Date.now()}`).toString('hex').slice(0, 64)}`,
					chain: 'ethereum',
					type: 'transfer',
					status: 'signed',
				},
			};

		case 'transactionRejected':
			return {
				event: 'transaction.rejected',
				timestamp,
				transaction: {
					chain: 'ethereum',
					type: 'transfer',
					reason: 'user_cancelled',
				},
			};

		case 'transactionConfirmed':
			return {
				event: 'transaction.confirmed',
				timestamp,
				transaction: {
					hash: `0x${Buffer.from(`tx_${Date.now()}`).toString('hex').slice(0, 64)}`,
					chain: 'ethereum',
					confirmations: 12,
					blockNumber: 12345678,
				},
			};

		case 'balanceChanged':
			return {
				event: 'account.balance_changed',
				timestamp,
				account: {
					address: `0x${Buffer.from(`addr_${Date.now()}`).toString('hex').slice(0, 40)}`,
					chain: 'ethereum',
					previousBalance: '1.0',
					newBalance: '1.1',
					change: '+0.1',
				},
			};

		case 'transactionReceived':
			return {
				event: 'account.transaction_received',
				timestamp,
				transaction: {
					hash: `0x${Buffer.from(`tx_${Date.now()}`).toString('hex').slice(0, 64)}`,
					chain: 'ethereum',
					from: `0x${Buffer.from('sender').toString('hex').padEnd(40, '0')}`,
					to: `0x${Buffer.from('receiver').toString('hex').padEnd(40, '0')}`,
					amount: '0.1',
					confirmations: 1,
				},
			};

		case 'pinEntered':
			return {
				event: 'security.pin_entered',
				timestamp,
				status: 'success',
				attemptsRemaining: 10,
			};

		case 'deviceLocked':
			return {
				event: 'security.device_locked',
				timestamp,
				reason: 'auto_lock',
				lockDuration: 300,
			};

		default:
			return null;
	}
}

export class SecuXTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'SecuX Trigger',
		name: 'secuXTrigger',
		icon: 'file:secux.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Triggers on SecuX device and transaction events',
		defaults: {
			name: 'SecuX Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'secuXDevice',
				required: true,
			},
			{
				name: 'secuXess',
				required: false,
			},
		],
		polling: true,
		properties: [
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Device Connected',
						value: 'deviceConnected',
						description: 'Triggers when a SecuX device is connected',
					},
					{
						name: 'Device Disconnected',
						value: 'deviceDisconnected',
						description: 'Triggers when a SecuX device is disconnected',
					},
					{
						name: 'Battery Low',
						value: 'batteryLow',
						description: 'Triggers when device battery is low',
					},
					{
						name: 'Transaction Signed',
						value: 'transactionSigned',
						description: 'Triggers when a transaction is signed',
					},
					{
						name: 'Transaction Rejected',
						value: 'transactionRejected',
						description: 'Triggers when a transaction is rejected on device',
					},
					{
						name: 'Transaction Confirmed',
						value: 'transactionConfirmed',
						description: 'Triggers when a transaction is confirmed on chain',
					},
					{
						name: 'Balance Changed',
						value: 'balanceChanged',
						description: 'Triggers when account balance changes',
					},
					{
						name: 'New Transaction Received',
						value: 'transactionReceived',
						description: 'Triggers when a new transaction is received',
					},
					{
						name: 'PIN Entered',
						value: 'pinEntered',
						description: 'Triggers when PIN is entered on device',
					},
					{
						name: 'Device Locked',
						value: 'deviceLocked',
						description: 'Triggers when device is locked',
					},
				],
				default: 'deviceConnected',
			},
			{
				displayName: 'Chain Filter',
				name: 'chainFilter',
				type: 'multiOptions',
				displayOptions: {
					show: {
						event: ['transactionSigned', 'transactionConfirmed', 'balanceChanged', 'transactionReceived'],
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
				description: 'Filter events by blockchain',
			},
			{
				displayName: 'Battery Threshold (%)',
				name: 'batteryThreshold',
				type: 'number',
				displayOptions: {
					show: {
						event: ['batteryLow'],
					},
				},
				default: 20,
				description: 'Battery percentage threshold for low battery alert',
			},
			{
				displayName: 'Minimum Amount',
				name: 'minAmount',
				type: 'string',
				displayOptions: {
					show: {
						event: ['balanceChanged', 'transactionReceived'],
					},
				},
				default: '',
				placeholder: '0.01',
				description: 'Minimum amount to trigger (in native currency)',
			},
			{
				displayName: 'Address Filter',
				name: 'addressFilter',
				type: 'string',
				displayOptions: {
					show: {
						event: ['balanceChanged', 'transactionReceived', 'transactionSigned'],
					},
				},
				default: '',
				placeholder: '0x... or bc1...',
				description: 'Only trigger for specific address (leave empty for all)',
			},
		],
	};

	async poll(this: IPollFunctions): Promise<INodeExecutionData[][] | null> {
		const event = this.getNodeParameter('event') as string;
		const webhookData = this.getWorkflowStaticData('node');

		// Update last poll time
		webhookData.lastPoll = Date.now();

		// Simulated event polling - in production, this would check device/API state
		const events: INodeExecutionData[] = [];

		// Simulate occasional events for demonstration
		const shouldTrigger = Math.random() > 0.9; // 10% chance per poll

		if (shouldTrigger) {
			const eventData = createEventData(event);
			if (eventData) {
				events.push({
					json: eventData,
				});
			}
		}

		if (events.length === 0) {
			return null;
		}

		return [events];
	}
}
