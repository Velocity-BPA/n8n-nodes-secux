/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * BIP-44/49/84 derivation paths for supported cryptocurrencies.
 * Path format: m / purpose' / coin_type' / account' / change / address_index
 */

export interface DerivationPath {
  purpose: number;
  coinType: number;
  standard: string;
  description: string;
  pathTemplate: string;
}

export const DERIVATION_PATHS: Record<string, DerivationPath[]> = {
  BTC: [
    {
      purpose: 84,
      coinType: 0,
      standard: 'BIP84',
      description: 'Native SegWit (bech32)',
      pathTemplate: "m/84'/0'/{account}'/0/{index}",
    },
    {
      purpose: 49,
      coinType: 0,
      standard: 'BIP49',
      description: 'SegWit (P2SH-P2WPKH)',
      pathTemplate: "m/49'/0'/{account}'/0/{index}",
    },
    {
      purpose: 44,
      coinType: 0,
      standard: 'BIP44',
      description: 'Legacy (P2PKH)',
      pathTemplate: "m/44'/0'/{account}'/0/{index}",
    },
  ],
  BCH: [
    {
      purpose: 44,
      coinType: 145,
      standard: 'BIP44',
      description: 'Bitcoin Cash standard',
      pathTemplate: "m/44'/145'/{account}'/0/{index}",
    },
  ],
  LTC: [
    {
      purpose: 84,
      coinType: 2,
      standard: 'BIP84',
      description: 'Native SegWit',
      pathTemplate: "m/84'/2'/{account}'/0/{index}",
    },
    {
      purpose: 49,
      coinType: 2,
      standard: 'BIP49',
      description: 'SegWit',
      pathTemplate: "m/49'/2'/{account}'/0/{index}",
    },
    {
      purpose: 44,
      coinType: 2,
      standard: 'BIP44',
      description: 'Legacy',
      pathTemplate: "m/44'/2'/{account}'/0/{index}",
    },
  ],
  DASH: [
    {
      purpose: 44,
      coinType: 5,
      standard: 'BIP44',
      description: 'Dash standard',
      pathTemplate: "m/44'/5'/{account}'/0/{index}",
    },
  ],
  DOGE: [
    {
      purpose: 44,
      coinType: 3,
      standard: 'BIP44',
      description: 'Dogecoin standard',
      pathTemplate: "m/44'/3'/{account}'/0/{index}",
    },
  ],
  DGB: [
    {
      purpose: 84,
      coinType: 20,
      standard: 'BIP84',
      description: 'Native SegWit',
      pathTemplate: "m/84'/20'/{account}'/0/{index}",
    },
    {
      purpose: 44,
      coinType: 20,
      standard: 'BIP44',
      description: 'Legacy',
      pathTemplate: "m/44'/20'/{account}'/0/{index}",
    },
  ],
  GRS: [
    {
      purpose: 84,
      coinType: 17,
      standard: 'BIP84',
      description: 'Native SegWit',
      pathTemplate: "m/84'/17'/{account}'/0/{index}",
    },
    {
      purpose: 44,
      coinType: 17,
      standard: 'BIP44',
      description: 'Legacy',
      pathTemplate: "m/44'/17'/{account}'/0/{index}",
    },
  ],
  ETH: [
    {
      purpose: 44,
      coinType: 60,
      standard: 'BIP44',
      description: 'Ethereum standard',
      pathTemplate: "m/44'/60'/{account}'/0/{index}",
    },
  ],
  BNB: [
    {
      purpose: 44,
      coinType: 60,
      standard: 'BIP44',
      description: 'BNB Chain (EVM)',
      pathTemplate: "m/44'/60'/{account}'/0/{index}",
    },
  ],
  MATIC: [
    {
      purpose: 44,
      coinType: 60,
      standard: 'BIP44',
      description: 'Polygon (EVM)',
      pathTemplate: "m/44'/60'/{account}'/0/{index}",
    },
  ],
  AVAX: [
    {
      purpose: 44,
      coinType: 60,
      standard: 'BIP44',
      description: 'Avalanche C-Chain (EVM)',
      pathTemplate: "m/44'/60'/{account}'/0/{index}",
    },
  ],
  SOL: [
    {
      purpose: 44,
      coinType: 501,
      standard: 'BIP44',
      description: 'Solana standard',
      pathTemplate: "m/44'/501'/{account}'/0'",
    },
  ],
  XRP: [
    {
      purpose: 44,
      coinType: 144,
      standard: 'BIP44',
      description: 'XRP Ledger standard',
      pathTemplate: "m/44'/144'/{account}'/0/{index}",
    },
  ],
  ATOM: [
    {
      purpose: 44,
      coinType: 118,
      standard: 'BIP44',
      description: 'Cosmos standard',
      pathTemplate: "m/44'/118'/{account}'/0/{index}",
    },
  ],
  TRX: [
    {
      purpose: 44,
      coinType: 195,
      standard: 'BIP44',
      description: 'Tron standard',
      pathTemplate: "m/44'/195'/{account}'/0/{index}",
    },
  ],
  ADA: [
    {
      purpose: 1852,
      coinType: 1815,
      standard: 'CIP-1852',
      description: 'Cardano Shelley era',
      pathTemplate: "m/1852'/1815'/{account}'/0/{index}",
    },
  ],
  XLM: [
    {
      purpose: 44,
      coinType: 148,
      standard: 'BIP44',
      description: 'Stellar standard',
      pathTemplate: "m/44'/148'/{account}'",
    },
  ],
  LUNA: [
    {
      purpose: 44,
      coinType: 330,
      standard: 'BIP44',
      description: 'Terra standard',
      pathTemplate: "m/44'/330'/{account}'/0/{index}",
    },
  ],
};

/**
 * Get derivation path for a specific coin and purpose
 */
export function getDerivationPath(
  coin: string,
  purpose?: number,
  account = 0,
  index = 0,
): string {
  const paths = DERIVATION_PATHS[coin];
  if (!paths || paths.length === 0) {
    throw new Error(`No derivation path found for coin: ${coin}`);
  }

  const pathConfig = purpose ? paths.find((p) => p.purpose === purpose) : paths[0];

  if (!pathConfig) {
    throw new Error(`No derivation path with purpose ${purpose} found for coin: ${coin}`);
  }

  return pathConfig.pathTemplate.replace('{account}', account.toString()).replace('{index}', index.toString());
}

/**
 * Get all available derivation paths for a coin
 */
export function getAvailablePaths(coin: string): DerivationPath[] {
  return DERIVATION_PATHS[coin] || [];
}

/**
 * Parse a derivation path string into components
 */
export function parsePath(path: string): {
  purpose: number;
  coinType: number;
  account: number;
  change: number;
  index: number;
} {
  const regex = /^m\/(\d+)'\/(\d+)'\/(\d+)'\/(\d+)\/(\d+)$/;
  const match = path.match(regex);

  if (!match) {
    throw new Error(`Invalid derivation path format: ${path}`);
  }

  return {
    purpose: parseInt(match[1], 10),
    coinType: parseInt(match[2], 10),
    account: parseInt(match[3], 10),
    change: parseInt(match[4], 10),
    index: parseInt(match[5], 10),
  };
}

/**
 * Validate if a path is valid for a given coin
 */
export function isValidPath(coin: string, path: string): boolean {
  const paths = DERIVATION_PATHS[coin];
  if (!paths) return false;

  try {
    const parsed = parsePath(path);
    return paths.some(
      (p) => p.purpose === parsed.purpose && p.coinType === parsed.coinType,
    );
  } catch {
    return false;
  }
}

export const PATH_PURPOSE_OPTIONS = [
  { name: 'BIP44 (Legacy)', value: 44 },
  { name: 'BIP49 (SegWit)', value: 49 },
  { name: 'BIP84 (Native SegWit)', value: 84 },
  { name: 'CIP-1852 (Cardano)', value: 1852 },
];
