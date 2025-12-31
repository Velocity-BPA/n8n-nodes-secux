/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
	validateBitcoinAddress,
	validateEthereumAddress,
	formatAddressForDisplay,
	BitcoinAddressType,
} from '../../nodes/SecuX/utils/addressUtils';

describe('Address Utils', () => {
	describe('validateBitcoinAddress', () => {
		it('should validate native segwit addresses', () => {
			const result = validateBitcoinAddress('bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4');
			expect(result).toBe(true);
		});

		it('should validate legacy addresses', () => {
			const result = validateBitcoinAddress('1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2');
			expect(result).toBe(true);
		});

		it('should validate segwit addresses', () => {
			const result = validateBitcoinAddress('3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy');
			expect(result).toBe(true);
		});

		it('should reject invalid addresses', () => {
			const result = validateBitcoinAddress('invalidaddress');
			expect(result).toBe(false);
		});
	});

	describe('validateEthereumAddress', () => {
		it('should validate valid Ethereum addresses', () => {
			const result = validateEthereumAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f8e9Ab');
			expect(result).toBe(true);
		});

		it('should reject invalid Ethereum addresses', () => {
			const result = validateEthereumAddress('invalid');
			expect(result).toBe(false);
		});

		it('should reject addresses without 0x prefix', () => {
			const result = validateEthereumAddress('742d35Cc6634C0532925a3b844Bc9e7595f8e9Ab');
			expect(result).toBe(false);
		});
	});

	describe('formatAddressForDisplay', () => {
		it('should truncate long addresses', () => {
			const address = '0x742d35Cc6634C0532925a3b844Bc9e7595f8e9Ab';
			const formatted = formatAddressForDisplay(address, 14);
			expect(formatted.length).toBeLessThan(address.length);
			expect(formatted).toContain('...');
		});

		it('should not truncate short addresses', () => {
			const address = '0x1234567890';
			const formatted = formatAddressForDisplay(address);
			expect(formatted).toBe(address);
		});
	});

	describe('BitcoinAddressType enum', () => {
		it('should have expected values', () => {
			expect(BitcoinAddressType.LEGACY).toBeDefined();
			expect(BitcoinAddressType.SEGWIT).toBeDefined();
			expect(BitcoinAddressType.NATIVE_SEGWIT).toBeDefined();
			expect(BitcoinAddressType.TAPROOT).toBeDefined();
		});
	});
});
