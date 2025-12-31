/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { SUPPORTED_COINS as _SUPPORTED_COINS } from '../constants/coins';

/**
 * Transaction types
 */
export enum TransactionType {
  TRANSFER = 'transfer',
  TOKEN_TRANSFER = 'token_transfer',
  NFT_TRANSFER = 'nft_transfer',
  CONTRACT_CALL = 'contract_call',
  SWAP = 'swap',
  STAKE = 'stake',
  UNSTAKE = 'unstake',
}

/**
 * Transaction status
 */
export enum TransactionStatus {
  PENDING = 'pending',
  SIGNED = 'signed',
  BROADCAST = 'broadcast',
  CONFIRMED = 'confirmed',
  FAILED = 'failed',
  REJECTED = 'rejected',
}

/**
 * UTXO interface for Bitcoin-like transactions
 */
export interface UTXO {
  txHash: string;
  outputIndex: number;
  value: bigint;
  script: string;
  address: string;
  path: string;
}

/**
 * Bitcoin transaction input
 */
export interface BitcoinInput {
  utxo: UTXO;
  sequence?: number;
}

/**
 * Bitcoin transaction output
 */
export interface BitcoinOutput {
  address: string;
  value: bigint;
  isChange?: boolean;
}

/**
 * Bitcoin transaction data
 */
export interface BitcoinTransaction {
  inputs: BitcoinInput[];
  outputs: BitcoinOutput[];
  fee: bigint;
  locktime?: number;
  version?: number;
}

/**
 * EVM transaction data
 */
export interface EVMTransaction {
  to: string;
  value: bigint;
  data?: string;
  nonce: number;
  gasLimit: bigint;
  gasPrice?: bigint; // Legacy
  maxFeePerGas?: bigint; // EIP-1559
  maxPriorityFeePerGas?: bigint; // EIP-1559
  chainId: number;
  type?: 0 | 2; // 0 = Legacy, 2 = EIP-1559
}

/**
 * Token transfer data (ERC-20/BEP-20)
 */
export interface TokenTransfer {
  contractAddress: string;
  to: string;
  amount: bigint;
  decimals: number;
  symbol?: string;
}

/**
 * NFT transfer data (ERC-721/ERC-1155)
 */
export interface NFTTransfer {
  contractAddress: string;
  from: string;
  to: string;
  tokenId: string;
  amount?: number; // For ERC-1155
  standard: 'ERC721' | 'ERC1155';
}

/**
 * Signed transaction result
 */
export interface SignedTransaction {
  rawTransaction: string;
  hash: string;
  signature: {
    r: string;
    s: string;
    v: number;
  };
}

/**
 * Fee estimation result
 */
export interface FeeEstimate {
  slow: bigint;
  medium: bigint;
  fast: bigint;
  estimatedTime: {
    slow: number; // minutes
    medium: number;
    fast: number;
  };
}

/**
 * Convert satoshis to BTC
 */
export function satoshisToBtc(satoshis: bigint): string {
  const btc = Number(satoshis) / 100000000;
  return btc.toFixed(8);
}

/**
 * Convert BTC to satoshis
 */
export function btcToSatoshis(btc: string | number): bigint {
  const satoshis = Math.round(Number(btc) * 100000000);
  return BigInt(satoshis);
}

/**
 * Convert wei to ETH
 */
export function weiToEth(wei: bigint): string {
  const eth = Number(wei) / 1e18;
  return eth.toFixed(18).replace(/\.?0+$/, '');
}

/**
 * Convert ETH to wei
 */
export function ethToWei(eth: string | number): bigint {
  const wei = Number(eth) * 1e18;
  return BigInt(Math.round(wei));
}

/**
 * Convert token amount with decimals
 */
export function toTokenAmount(amount: string | number, decimals: number): bigint {
  const value = Number(amount) * Math.pow(10, decimals);
  return BigInt(Math.round(value));
}

/**
 * Convert from token amount with decimals
 */
export function fromTokenAmount(amount: bigint, decimals: number): string {
  const value = Number(amount) / Math.pow(10, decimals);
  return value.toFixed(decimals).replace(/\.?0+$/, '');
}

/**
 * Calculate total input value from UTXOs
 */
export function calculateTotalInput(utxos: UTXO[]): bigint {
  return utxos.reduce((sum, utxo) => sum + utxo.value, BigInt(0));
}

/**
 * Calculate total output value
 */
export function calculateTotalOutput(outputs: BitcoinOutput[]): bigint {
  return outputs.reduce((sum, output) => sum + output.value, BigInt(0));
}

/**
 * Estimate Bitcoin transaction size in vBytes
 */
export function estimateBitcoinTxSize(
  inputCount: number,
  outputCount: number,
  isSegwit = true,
): number {
  if (isSegwit) {
    // SegWit transaction size estimation
    const overhead = 10.5; // Version + locktime + marker + flag
    const inputSize = 68; // Per input
    const outputSize = 31; // Per output
    return Math.ceil(overhead + inputCount * inputSize + outputCount * outputSize);
  } else {
    // Legacy transaction size estimation
    const overhead = 10; // Version + locktime
    const inputSize = 148; // Per input
    const outputSize = 34; // Per output
    return Math.ceil(overhead + inputCount * inputSize + outputCount * outputSize);
  }
}

/**
 * Calculate required fee for Bitcoin transaction
 */
export function calculateBitcoinFee(
  inputCount: number,
  outputCount: number,
  feeRate: number, // sat/vB
  isSegwit = true,
): bigint {
  const size = estimateBitcoinTxSize(inputCount, outputCount, isSegwit);
  return BigInt(Math.ceil(size * feeRate));
}

/**
 * Select UTXOs for transaction (simple greedy algorithm)
 */
export function selectUtxos(
  availableUtxos: UTXO[],
  targetAmount: bigint,
  feeRate: number,
): { selected: UTXO[]; fee: bigint; change: bigint } | null {
  // Sort UTXOs by value (descending)
  const sorted = [...availableUtxos].sort((a, b) =>
    Number(b.value - a.value),
  );

  const selected: UTXO[] = [];
  let totalInput = BigInt(0);

  for (const utxo of sorted) {
    selected.push(utxo);
    totalInput += utxo.value;

    // Estimate fee with current selection
    const fee = calculateBitcoinFee(selected.length, 2, feeRate); // 2 outputs: target + change
    const needed = targetAmount + fee;

    if (totalInput >= needed) {
      const change = totalInput - targetAmount - fee;
      return { selected, fee, change };
    }
  }

  return null; // Insufficient funds
}

/**
 * Encode ERC-20 transfer data
 */
export function encodeERC20Transfer(to: string, amount: bigint): string {
  // transfer(address,uint256) selector: 0xa9059cbb
  const selector = 'a9059cbb';
  const paddedTo = to.slice(2).padStart(64, '0');
  const paddedAmount = amount.toString(16).padStart(64, '0');
  return `0x${selector}${paddedTo}${paddedAmount}`;
}

/**
 * Encode ERC-20 approve data
 */
export function encodeERC20Approve(spender: string, amount: bigint): string {
  // approve(address,uint256) selector: 0x095ea7b3
  const selector = '095ea7b3';
  const paddedSpender = spender.slice(2).padStart(64, '0');
  const paddedAmount = amount.toString(16).padStart(64, '0');
  return `0x${selector}${paddedSpender}${paddedAmount}`;
}

/**
 * Encode ERC-721 transferFrom data
 */
export function encodeERC721Transfer(
  from: string,
  to: string,
  tokenId: string,
): string {
  // transferFrom(address,address,uint256) selector: 0x23b872dd
  const selector = '23b872dd';
  const paddedFrom = from.slice(2).padStart(64, '0');
  const paddedTo = to.slice(2).padStart(64, '0');
  const paddedTokenId = BigInt(tokenId).toString(16).padStart(64, '0');
  return `0x${selector}${paddedFrom}${paddedTo}${paddedTokenId}`;
}

/**
 * Validate transaction before signing
 */
export function validateTransaction(
  type: 'bitcoin' | 'evm' | 'solana',
  transaction: unknown,
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (type === 'bitcoin') {
    const tx = transaction as BitcoinTransaction;
    if (!tx.inputs || tx.inputs.length === 0) {
      errors.push('Transaction must have at least one input');
    }
    if (!tx.outputs || tx.outputs.length === 0) {
      errors.push('Transaction must have at least one output');
    }
    if (tx.fee <= BigInt(0)) {
      errors.push('Fee must be positive');
    }
  } else if (type === 'evm') {
    const tx = transaction as EVMTransaction;
    if (!tx.to || tx.to.length !== 42) {
      errors.push('Invalid recipient address');
    }
    if (tx.nonce < 0) {
      errors.push('Nonce must be non-negative');
    }
    if (tx.gasLimit <= BigInt(0)) {
      errors.push('Gas limit must be positive');
    }
    if (!tx.chainId || tx.chainId <= 0) {
      errors.push('Invalid chain ID');
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Format transaction for display
 */
export function formatTransactionSummary(
  type: 'bitcoin' | 'evm',
  transaction: BitcoinTransaction | EVMTransaction,
): Record<string, string> {
  if (type === 'bitcoin') {
    const tx = transaction as BitcoinTransaction;
    return {
      type: 'Bitcoin Transfer',
      inputs: tx.inputs.length.toString(),
      outputs: tx.outputs.length.toString(),
      fee: `${satoshisToBtc(tx.fee)} BTC`,
    };
  } else {
    const tx = transaction as EVMTransaction;
    return {
      type: tx.type === 2 ? 'EIP-1559 Transaction' : 'Legacy Transaction',
      to: tx.to,
      value: `${weiToEth(tx.value)} ETH`,
      gasLimit: tx.gasLimit.toString(),
      nonce: tx.nonce.toString(),
    };
  }
}
