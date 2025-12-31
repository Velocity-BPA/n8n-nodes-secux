/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { SUPPORTED_COINS, CoinConfig } from '../constants/coins';
import { getDerivationPath } from '../constants/derivationPaths';

/**
 * Address types for Bitcoin-like coins
 */
export enum BitcoinAddressType {
  LEGACY = 'legacy', // P2PKH - starts with 1
  SEGWIT = 'segwit', // P2SH-P2WPKH - starts with 3
  NATIVE_SEGWIT = 'native_segwit', // P2WPKH - starts with bc1
  TAPROOT = 'taproot', // P2TR - starts with bc1p
}

/**
 * Address format configuration
 */
export interface AddressFormat {
  type: BitcoinAddressType;
  purpose: number;
  prefix: string;
  description: string;
}

/**
 * Bitcoin address formats
 */
export const BITCOIN_ADDRESS_FORMATS: AddressFormat[] = [
  {
    type: BitcoinAddressType.NATIVE_SEGWIT,
    purpose: 84,
    prefix: 'bc1q',
    description: 'Native SegWit (Bech32)',
  },
  {
    type: BitcoinAddressType.SEGWIT,
    purpose: 49,
    prefix: '3',
    description: 'SegWit (P2SH)',
  },
  {
    type: BitcoinAddressType.LEGACY,
    purpose: 44,
    prefix: '1',
    description: 'Legacy (P2PKH)',
  },
  {
    type: BitcoinAddressType.TAPROOT,
    purpose: 86,
    prefix: 'bc1p',
    description: 'Taproot (P2TR)',
  },
];

/**
 * Validate a cryptocurrency address
 */
export function validateAddress(address: string, coin: string): boolean {
  const coinConfig = SUPPORTED_COINS[coin];
  if (!coinConfig) {
    return false;
  }

  switch (coin) {
    case 'BTC':
      return validateBitcoinAddress(address);
    case 'ETH':
    case 'BNB':
    case 'MATIC':
    case 'AVAX':
    case 'ARB':
    case 'OP':
    case 'FTM':
    case 'CRO':
    case 'BASE':
    case 'GNOSIS':
      return validateEthereumAddress(address);
    case 'SOL':
      return validateSolanaAddress(address);
    case 'XRP':
      return validateXrpAddress(address);
    case 'ATOM':
      return validateCosmosAddress(address);
    case 'TRX':
      return validateTronAddress(address);
    case 'ADA':
      return validateCardanoAddress(address);
    case 'XLM':
      return validateStellarAddress(address);
    default:
      // For other coins, do basic validation
      return address.length > 10;
  }
}

/**
 * Validate Bitcoin address
 */
export function validateBitcoinAddress(address: string): boolean {
  // Native SegWit (bech32)
  if (address.startsWith('bc1q') || address.startsWith('bc1p')) {
    return /^bc1[a-zA-HJ-NP-Z0-9]{25,89}$/.test(address);
  }
  // SegWit (P2SH) - starts with 3
  if (address.startsWith('3')) {
    return /^3[a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(address);
  }
  // Legacy (P2PKH) - starts with 1
  if (address.startsWith('1')) {
    return /^1[a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(address);
  }
  return false;
}

/**
 * Validate Ethereum address
 */
export function validateEthereumAddress(address: string): boolean {
  // Check if it's a valid hex address
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return false;
  }

  // If it's all lowercase or all uppercase, it's valid
  const cleanAddress = address.slice(2);
  if (
    cleanAddress === cleanAddress.toLowerCase() ||
    cleanAddress === cleanAddress.toUpperCase()
  ) {
    return true;
  }

  // Otherwise, validate EIP-55 checksum
  return validateEIP55Checksum(address);
}

/**
 * Validate EIP-55 checksum
 */
function validateEIP55Checksum(address: string): boolean {
  // This is a simplified validation - in production, use a proper library
  const cleanAddress = address.slice(2);
  return cleanAddress.length === 40;
}

/**
 * Validate Solana address
 */
export function validateSolanaAddress(address: string): boolean {
  // Solana addresses are base58 encoded and 32-44 characters
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
}

/**
 * Validate XRP address
 */
export function validateXrpAddress(address: string): boolean {
  // XRP addresses start with 'r' and are base58 encoded
  return /^r[1-9A-HJ-NP-Za-km-z]{24,34}$/.test(address);
}

/**
 * Validate Cosmos address
 */
export function validateCosmosAddress(address: string): boolean {
  // Cosmos addresses start with 'cosmos' and are bech32 encoded
  return /^cosmos1[a-z0-9]{38}$/.test(address);
}

/**
 * Validate Tron address
 */
export function validateTronAddress(address: string): boolean {
  // Tron addresses start with 'T' and are base58 encoded
  return /^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(address);
}

/**
 * Validate Cardano address
 */
export function validateCardanoAddress(address: string): boolean {
  // Cardano Shelley addresses start with 'addr'
  return /^addr1[a-z0-9]{50,100}$/.test(address);
}

/**
 * Validate Stellar address
 */
export function validateStellarAddress(address: string): boolean {
  // Stellar addresses start with 'G' and are 56 characters
  return /^G[A-Z2-7]{55}$/.test(address);
}

/**
 * Get address prefix for a coin
 */
export function getAddressPrefix(coin: string): string {
  const coinConfig = SUPPORTED_COINS[coin];
  return coinConfig?.addressPrefix || '';
}

/**
 * Format address for display (truncate middle)
 */
export function formatAddressForDisplay(address: string, chars = 6): string {
  if (address.length <= chars * 2 + 3) {
    return address;
  }
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

/**
 * Get derivation path for address generation
 */
export function getAddressDerivationPath(
  coin: string,
  addressType?: BitcoinAddressType,
  account = 0,
  index = 0,
): string {
  let purpose: number | undefined;

  if (addressType) {
    const format = BITCOIN_ADDRESS_FORMATS.find((f) => f.type === addressType);
    purpose = format?.purpose;
  }

  return getDerivationPath(coin, purpose, account, index);
}

/**
 * Get address type from Bitcoin address
 */
export function getBitcoinAddressType(address: string): BitcoinAddressType | undefined {
  if (address.startsWith('bc1p')) {
    return BitcoinAddressType.TAPROOT;
  }
  if (address.startsWith('bc1q')) {
    return BitcoinAddressType.NATIVE_SEGWIT;
  }
  if (address.startsWith('3')) {
    return BitcoinAddressType.SEGWIT;
  }
  if (address.startsWith('1')) {
    return BitcoinAddressType.LEGACY;
  }
  return undefined;
}

/**
 * Check if address is a contract address (for EVM chains)
 */
export async function isContractAddress(
  address: string,
  rpcUrl: string,
): Promise<boolean> {
  // This would require making an RPC call to check code at address
  // Simplified implementation - in production, use ethers.js
  return false;
}

/**
 * Generate multiple addresses for batch operations
 */
export function generateAddressRange(
  coin: string,
  startIndex: number,
  count: number,
  account = 0,
  addressType?: BitcoinAddressType,
): string[] {
  const paths: string[] = [];
  for (let i = startIndex; i < startIndex + count; i++) {
    paths.push(getAddressDerivationPath(coin, addressType, account, i));
  }
  return paths;
}

/**
 * Address options for n8n UI
 */
export const ADDRESS_TYPE_OPTIONS = [
  { name: 'Native SegWit (bc1...)', value: BitcoinAddressType.NATIVE_SEGWIT },
  { name: 'SegWit (3...)', value: BitcoinAddressType.SEGWIT },
  { name: 'Legacy (1...)', value: BitcoinAddressType.LEGACY },
  { name: 'Taproot (bc1p...)', value: BitcoinAddressType.TAPROOT },
];
