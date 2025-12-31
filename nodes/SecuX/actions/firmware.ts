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
				resource: ['firmware'],
			},
		},
		options: [
			{
				name: 'Get Version',
				value: 'getVersion',
				description: 'Get current firmware version',
				action: 'Get firmware version',
			},
			{
				name: 'Check Updates',
				value: 'checkUpdates',
				description: 'Check for available firmware updates',
				action: 'Check for updates',
			},
			{
				name: 'Get Update History',
				value: 'getUpdateHistory',
				description: 'Get firmware update history',
				action: 'Get update history',
			},
			{
				name: 'Get Changelog',
				value: 'getChangelog',
				description: 'Get firmware changelog',
				action: 'Get changelog',
			},
		],
		default: 'getVersion',
	},
	{
		displayName: 'Include Beta',
		name: 'includeBeta',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['firmware'],
				operation: ['checkUpdates'],
			},
		},
		default: false,
		description: 'Whether to include beta firmware versions',
	},
	{
		displayName: 'Version',
		name: 'version',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['firmware'],
				operation: ['getChangelog'],
			},
		},
		default: '',
		placeholder: '2.0.0',
		description: 'Firmware version to get changelog for (leave empty for latest)',
	},
];

export async function execute(
	this: IExecuteFunctions,
	index: number,
	operation: string,
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	if (operation === 'getVersion') {
		returnData.push({
			json: {
				success: true,
				firmware: {
					version: '2.0.0',
					buildNumber: '20240101',
					releaseDate: '2024-01-01',
					bootloaderVersion: '1.5.0',
					seVersion: '1.0.0',
				},
				device: {
					model: 'V20',
					serialNumber: `SN${Date.now()}`,
				},
			},
			pairedItem: { item: index },
		});
	} else if (operation === 'checkUpdates') {
		const includeBeta = this.getNodeParameter('includeBeta', index) as boolean;

		returnData.push({
			json: {
				success: true,
				currentVersion: '2.0.0',
				latestVersion: '2.0.0',
				updateAvailable: false,
				includeBeta,
				updates: [],
				message: 'Firmware is up to date',
			},
			pairedItem: { item: index },
		});
	} else if (operation === 'getUpdateHistory') {
		returnData.push({
			json: {
				success: true,
				updateHistory: [
					{
						version: '2.0.0',
						installedAt: '2024-01-01T00:00:00Z',
						previousVersion: '1.9.5',
						status: 'success',
					},
					{
						version: '1.9.5',
						installedAt: '2023-10-15T00:00:00Z',
						previousVersion: '1.9.0',
						status: 'success',
					},
				],
				totalUpdates: 2,
			},
			pairedItem: { item: index },
		});
	} else if (operation === 'getChangelog') {
		const version = this.getNodeParameter('version', index) as string;

		returnData.push({
			json: {
				success: true,
				version: version || '2.0.0',
				releaseDate: '2024-01-01',
				changelog: {
					features: [
						'Added support for new cryptocurrencies',
						'Improved Bluetooth connectivity',
						'Enhanced NFT display capabilities',
					],
					improvements: [
						'Faster transaction signing',
						'Better battery management',
						'UI/UX improvements',
					],
					bugFixes: [
						'Fixed address display issue',
						'Resolved connection timeout bug',
					],
					security: [
						'Security enhancements',
						'Updated cryptographic libraries',
					],
				},
			},
			pairedItem: { item: index },
		});
	}

	return returnData;
}
