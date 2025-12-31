/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

/**
 * SecuX Network Credentials
 *
 * Configuration for blockchain network connections used with SecuX wallets.
 * Supports mainnet/testnet selection and custom RPC endpoints for various chains.
 */
export class SecuXNetwork implements ICredentialType {
  name = 'secuXNetwork';
  displayName = 'SecuX Network';
  documentationUrl = 'https://github.com/Velocity-BPA/n8n-nodes-secux';

  properties: INodeProperties[] = [
    {
      displayName: 'Blockchain Network',
      name: 'blockchain',
      type: 'options',
      options: [
        { name: 'Bitcoin', value: 'bitcoin' },
        { name: 'Ethereum', value: 'ethereum' },
        { name: 'BNB Chain', value: 'bnb' },
        { name: 'Polygon', value: 'polygon' },
        { name: 'Avalanche C-Chain', value: 'avalanche' },
        { name: 'Arbitrum', value: 'arbitrum' },
        { name: 'Optimism', value: 'optimism' },
        { name: 'Fantom', value: 'fantom' },
        { name: 'Cronos', value: 'cronos' },
        { name: 'Base', value: 'base' },
        { name: 'Gnosis Chain', value: 'gnosis' },
        { name: 'Solana', value: 'solana' },
        { name: 'XRP Ledger', value: 'xrp' },
        { name: 'Cosmos', value: 'cosmos' },
        { name: 'Tron', value: 'tron' },
        { name: 'Cardano', value: 'cardano' },
        { name: 'Stellar', value: 'stellar' },
        { name: 'Terra', value: 'terra' },
        { name: 'Litecoin', value: 'litecoin' },
        { name: 'Dogecoin', value: 'dogecoin' },
        { name: 'Bitcoin Cash', value: 'bitcoincash' },
        { name: 'Dash', value: 'dash' },
        { name: 'DigiByte', value: 'digibyte' },
        { name: 'Groestlcoin', value: 'groestlcoin' },
        { name: 'Custom EVM', value: 'custom' },
      ],
      default: 'ethereum',
      description: 'The blockchain network to connect to',
    },
    {
      displayName: 'Network Type',
      name: 'networkType',
      type: 'options',
      options: [
        { name: 'Mainnet', value: 'mainnet' },
        { name: 'Testnet', value: 'testnet' },
      ],
      default: 'mainnet',
      description: 'Whether to use mainnet or testnet',
    },
    {
      displayName: 'RPC Endpoint URL',
      name: 'rpcUrl',
      type: 'string',
      default: '',
      placeholder: 'https://mainnet.infura.io/v3/YOUR-PROJECT-ID',
      description:
        'Custom RPC endpoint URL. Leave empty to use default public endpoints.',
    },
    {
      displayName: 'Block Explorer URL',
      name: 'explorerUrl',
      type: 'string',
      default: '',
      placeholder: 'https://etherscan.io',
      description: 'Block explorer URL for transaction verification',
    },
    {
      displayName: 'Chain ID',
      name: 'chainId',
      type: 'number',
      default: 1,
      displayOptions: {
        show: {
          blockchain: [
            'ethereum',
            'bnb',
            'polygon',
            'avalanche',
            'arbitrum',
            'optimism',
            'fantom',
            'cronos',
            'base',
            'gnosis',
            'custom',
          ],
        },
      },
      description: 'The chain ID for EVM-compatible networks',
    },
    {
      displayName: 'Network Name',
      name: 'networkName',
      type: 'string',
      default: '',
      displayOptions: {
        show: {
          blockchain: ['custom'],
        },
      },
      description: 'Custom network name for display purposes',
    },
    {
      displayName: 'Currency Symbol',
      name: 'currencySymbol',
      type: 'string',
      default: 'ETH',
      displayOptions: {
        show: {
          blockchain: ['custom'],
        },
      },
      description: 'Native currency symbol (e.g., ETH, BNB)',
    },
    {
      displayName: 'Currency Decimals',
      name: 'currencyDecimals',
      type: 'number',
      default: 18,
      displayOptions: {
        show: {
          blockchain: ['custom'],
        },
      },
      description: 'Number of decimal places for the native currency',
    },
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      description: 'API key for RPC provider (if required)',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {},
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: '={{$credentials.rpcUrl || "https://eth.llamarpc.com"}}',
      url: '',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_chainId',
        params: [],
        id: 1,
      }),
    },
  };
}
