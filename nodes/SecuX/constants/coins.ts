/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Supported coins and their configurations for SecuX hardware wallets.
 */

export interface CoinConfig {
  name: string;
  symbol: string;
  coinType: number;
  network: string;
  decimals: number;
  addressPrefix?: string;
  isEvm?: boolean;
  chainId?: number;
  explorerUrl?: string;
}

export const SUPPORTED_COINS: Record<string, CoinConfig> = {
  // Bitcoin and Bitcoin-like coins
  BTC: {
    name: 'Bitcoin',
    symbol: 'BTC',
    coinType: 0,
    network: 'bitcoin',
    decimals: 8,
    explorerUrl: 'https://blockchair.com/bitcoin',
  },
  BCH: {
    name: 'Bitcoin Cash',
    symbol: 'BCH',
    coinType: 145,
    network: 'bitcoincash',
    decimals: 8,
    explorerUrl: 'https://blockchair.com/bitcoin-cash',
  },
  LTC: {
    name: 'Litecoin',
    symbol: 'LTC',
    coinType: 2,
    network: 'litecoin',
    decimals: 8,
    addressPrefix: 'L',
    explorerUrl: 'https://blockchair.com/litecoin',
  },
  DASH: {
    name: 'Dash',
    symbol: 'DASH',
    coinType: 5,
    network: 'dash',
    decimals: 8,
    addressPrefix: 'X',
    explorerUrl: 'https://blockchair.com/dash',
  },
  DOGE: {
    name: 'Dogecoin',
    symbol: 'DOGE',
    coinType: 3,
    network: 'dogecoin',
    decimals: 8,
    addressPrefix: 'D',
    explorerUrl: 'https://blockchair.com/dogecoin',
  },
  DGB: {
    name: 'DigiByte',
    symbol: 'DGB',
    coinType: 20,
    network: 'digibyte',
    decimals: 8,
    explorerUrl: 'https://digiexplorer.info',
  },
  GRS: {
    name: 'Groestlcoin',
    symbol: 'GRS',
    coinType: 17,
    network: 'groestlcoin',
    decimals: 8,
    explorerUrl: 'https://blockchair.com/groestlcoin',
  },

  // Ethereum and EVM chains
  ETH: {
    name: 'Ethereum',
    symbol: 'ETH',
    coinType: 60,
    network: 'ethereum',
    decimals: 18,
    isEvm: true,
    chainId: 1,
    explorerUrl: 'https://etherscan.io',
  },
  BNB: {
    name: 'BNB Chain',
    symbol: 'BNB',
    coinType: 60,
    network: 'bnb',
    decimals: 18,
    isEvm: true,
    chainId: 56,
    explorerUrl: 'https://bscscan.com',
  },
  MATIC: {
    name: 'Polygon',
    symbol: 'MATIC',
    coinType: 60,
    network: 'polygon',
    decimals: 18,
    isEvm: true,
    chainId: 137,
    explorerUrl: 'https://polygonscan.com',
  },
  AVAX: {
    name: 'Avalanche C-Chain',
    symbol: 'AVAX',
    coinType: 60,
    network: 'avalanche',
    decimals: 18,
    isEvm: true,
    chainId: 43114,
    explorerUrl: 'https://snowtrace.io',
  },
  ARB: {
    name: 'Arbitrum',
    symbol: 'ETH',
    coinType: 60,
    network: 'arbitrum',
    decimals: 18,
    isEvm: true,
    chainId: 42161,
    explorerUrl: 'https://arbiscan.io',
  },
  OP: {
    name: 'Optimism',
    symbol: 'ETH',
    coinType: 60,
    network: 'optimism',
    decimals: 18,
    isEvm: true,
    chainId: 10,
    explorerUrl: 'https://optimistic.etherscan.io',
  },
  FTM: {
    name: 'Fantom',
    symbol: 'FTM',
    coinType: 60,
    network: 'fantom',
    decimals: 18,
    isEvm: true,
    chainId: 250,
    explorerUrl: 'https://ftmscan.com',
  },
  CRO: {
    name: 'Cronos',
    symbol: 'CRO',
    coinType: 60,
    network: 'cronos',
    decimals: 18,
    isEvm: true,
    chainId: 25,
    explorerUrl: 'https://cronoscan.com',
  },
  BASE: {
    name: 'Base',
    symbol: 'ETH',
    coinType: 60,
    network: 'base',
    decimals: 18,
    isEvm: true,
    chainId: 8453,
    explorerUrl: 'https://basescan.org',
  },
  GNOSIS: {
    name: 'Gnosis Chain',
    symbol: 'xDAI',
    coinType: 60,
    network: 'gnosis',
    decimals: 18,
    isEvm: true,
    chainId: 100,
    explorerUrl: 'https://gnosisscan.io',
  },

  // Other chains
  SOL: {
    name: 'Solana',
    symbol: 'SOL',
    coinType: 501,
    network: 'solana',
    decimals: 9,
    explorerUrl: 'https://solscan.io',
  },
  XRP: {
    name: 'XRP Ledger',
    symbol: 'XRP',
    coinType: 144,
    network: 'xrp',
    decimals: 6,
    addressPrefix: 'r',
    explorerUrl: 'https://xrpscan.com',
  },
  ATOM: {
    name: 'Cosmos',
    symbol: 'ATOM',
    coinType: 118,
    network: 'cosmos',
    decimals: 6,
    addressPrefix: 'cosmos',
    explorerUrl: 'https://www.mintscan.io/cosmos',
  },
  TRX: {
    name: 'Tron',
    symbol: 'TRX',
    coinType: 195,
    network: 'tron',
    decimals: 6,
    addressPrefix: 'T',
    explorerUrl: 'https://tronscan.org',
  },
  ADA: {
    name: 'Cardano',
    symbol: 'ADA',
    coinType: 1815,
    network: 'cardano',
    decimals: 6,
    addressPrefix: 'addr',
    explorerUrl: 'https://cardanoscan.io',
  },
  XLM: {
    name: 'Stellar',
    symbol: 'XLM',
    coinType: 148,
    network: 'stellar',
    decimals: 7,
    addressPrefix: 'G',
    explorerUrl: 'https://stellarchain.io',
  },
  LUNA: {
    name: 'Terra',
    symbol: 'LUNA',
    coinType: 330,
    network: 'terra',
    decimals: 6,
    addressPrefix: 'terra',
    explorerUrl: 'https://finder.terra.money',
  },
};

export const BITCOIN_LIKE_COINS = ['BTC', 'BCH', 'LTC', 'DASH', 'DOGE', 'DGB', 'GRS'];

export const EVM_CHAINS = [
  'ETH',
  'BNB',
  'MATIC',
  'AVAX',
  'ARB',
  'OP',
  'FTM',
  'CRO',
  'BASE',
  'GNOSIS',
];

export const COIN_OPTIONS = Object.entries(SUPPORTED_COINS).map(([value, config]) => ({
  name: `${config.name} (${config.symbol})`,
  value,
  description: `${config.name} - ${config.network}`,
}));

export const EVM_CHAIN_OPTIONS = EVM_CHAINS.map((symbol) => {
  const config = SUPPORTED_COINS[symbol];
  return {
    name: `${config.name} (Chain ID: ${config.chainId})`,
    value: symbol,
    description: `${config.name} - EVM Compatible`,
  };
});

export const BITCOIN_LIKE_OPTIONS = BITCOIN_LIKE_COINS.map((symbol) => {
  const config = SUPPORTED_COINS[symbol];
  return {
    name: `${config.name} (${config.symbol})`,
    value: symbol,
    description: config.name,
  };
});
