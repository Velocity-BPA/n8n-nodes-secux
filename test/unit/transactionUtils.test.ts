/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
	btcToSatoshis,
	satoshisToBtc,
	ethToWei,
	weiToEth,
	estimateBitcoinTxSize,
	calculateBitcoinFee,
	toTokenAmount,
	fromTokenAmount,
	validateTransaction,
	TransactionType,
} from '../../nodes/SecuX/utils/transactionUtils';

describe('Transaction Utils', () => {
	describe('BTC Conversion', () => {
		it('should convert BTC to satoshis', () => {
			expect(btcToSatoshis(1)).toBe(BigInt(100000000));
			expect(btcToSatoshis(0.5)).toBe(BigInt(50000000));
			expect(btcToSatoshis('0.00000001')).toBe(BigInt(1));
		});

		it('should convert satoshis to BTC', () => {
			expect(satoshisToBtc(BigInt(100000000))).toBe('1.00000000');
			expect(satoshisToBtc(BigInt(50000000))).toBe('0.50000000');
			expect(satoshisToBtc(BigInt(1))).toBe('0.00000001');
		});
	});

	describe('ETH Conversion', () => {
		it('should convert ETH to wei', () => {
			expect(ethToWei(1)).toBe(BigInt('1000000000000000000'));
			expect(ethToWei(0.5)).toBe(BigInt('500000000000000000'));
		});

		it('should convert wei to ETH', () => {
			expect(weiToEth(BigInt('1000000000000000000'))).toBe('1');
			expect(weiToEth(BigInt('500000000000000000'))).toBe('0.5');
		});
	});

	describe('Token Amount Conversion', () => {
		it('should convert to token amount with decimals', () => {
			expect(toTokenAmount('1', 18)).toBe(BigInt('1000000000000000000'));
			expect(toTokenAmount('1', 6)).toBe(BigInt('1000000'));
		});

		it('should convert from token amount with decimals', () => {
			expect(fromTokenAmount(BigInt('1000000000000000000'), 18)).toBe('1');
			expect(fromTokenAmount(BigInt('1000000'), 6)).toBe('1');
		});
	});

	describe('Bitcoin Transaction Size Estimation', () => {
		it('should estimate SegWit transaction size', () => {
			const size = estimateBitcoinTxSize(2, 2, true);
			expect(size).toBeGreaterThan(0);
			expect(size).toBeLessThan(500);
		});

		it('should estimate legacy transaction size', () => {
			const size = estimateBitcoinTxSize(2, 2, false);
			expect(size).toBeGreaterThan(0);
			expect(size).toBeGreaterThan(estimateBitcoinTxSize(2, 2, true));
		});
	});

	describe('Bitcoin Fee Calculation', () => {
		it('should calculate fee based on inputs, outputs, and fee rate', () => {
			const fee = calculateBitcoinFee(2, 2, 10, true);
			expect(fee).toBeGreaterThan(BigInt(0));
		});
	});

	describe('Transaction Validation', () => {
		it('should validate a valid EVM transaction', () => {
			const tx = {
				to: '0x742d35Cc6634C0532925a3b844Bc9e7595f8e9Ab',
				value: BigInt('1000000000000000000'),
				nonce: 0,
				gasLimit: BigInt(21000),
				chainId: 1,
			};
			const result = validateTransaction('evm', tx);
			expect(result.valid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it('should reject transaction with invalid to address', () => {
			const tx = {
				to: 'invalid',
				value: BigInt('1000000000000000000'),
				nonce: 0,
				gasLimit: BigInt(21000),
				chainId: 1,
			};
			const result = validateTransaction('evm', tx);
			expect(result.valid).toBe(false);
			expect(result.errors.length).toBeGreaterThan(0);
		});
	});

	describe('TransactionType enum', () => {
		it('should have expected values', () => {
			expect(TransactionType.TRANSFER).toBeDefined();
			expect(TransactionType.CONTRACT_CALL).toBeDefined();
			expect(TransactionType.TOKEN_TRANSFER).toBeDefined();
		});
	});
});
