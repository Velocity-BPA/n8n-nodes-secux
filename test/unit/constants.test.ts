/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { SUPPORTED_COINS } from '../../nodes/SecuX/constants/coins';
import { DEVICE_MODELS } from '../../nodes/SecuX/constants/devices';
import { getDerivationPath, isValidPath } from '../../nodes/SecuX/constants/derivationPaths';
import { SECUX_VENDOR_ID, TIMEOUTS } from '../../nodes/SecuX/constants/usbIds';
import { ErrorCode } from '../../nodes/SecuX/constants/events';

describe('Constants', () => {
	describe('Supported Coins', () => {
		it('should have Bitcoin defined', () => {
			expect(SUPPORTED_COINS.BTC).toBeDefined();
			expect(SUPPORTED_COINS.BTC.symbol).toBe('BTC');
		});

		it('should have Ethereum defined', () => {
			expect(SUPPORTED_COINS.ETH).toBeDefined();
			expect(SUPPORTED_COINS.ETH.symbol).toBe('ETH');
		});

		it('should have multiple coins', () => {
			expect(Object.keys(SUPPORTED_COINS).length).toBeGreaterThan(10);
		});
	});

	describe('Device Models', () => {
		it('should have v20 defined', () => {
			expect(DEVICE_MODELS.v20).toBeDefined();
			expect(DEVICE_MODELS.v20.name).toContain('V20');
		});

		it('should have w20 defined', () => {
			expect(DEVICE_MODELS.w20).toBeDefined();
		});

		it('should have multiple models', () => {
			expect(Object.keys(DEVICE_MODELS).length).toBeGreaterThan(0);
		});
	});

	describe('Derivation Paths', () => {
		it('should generate BTC derivation path', () => {
			const path = getDerivationPath('BTC', 0, 0, 0);
			expect(path).toContain("m/84'/0'");
		});

		it('should generate ETH derivation path', () => {
			const path = getDerivationPath('ETH', 0, 0, 0);
			expect(path).toContain("m/44'/60'");
		});

		it('should validate correct paths', () => {
			expect(isValidPath('BTC', "m/84'/0'/0'/0/0")).toBe(true);
			expect(isValidPath('ETH', "m/44'/60'/0'/0/0")).toBe(true);
		});

		it('should reject invalid paths', () => {
			expect(isValidPath('BTC', 'invalid')).toBe(false);
		});
	});

	describe('USB IDs', () => {
		it('should have vendor ID defined', () => {
			expect(SECUX_VENDOR_ID).toBeDefined();
			expect(typeof SECUX_VENDOR_ID).toBe('number');
		});

		it('should have timeouts defined', () => {
			expect(TIMEOUTS).toBeDefined();
			expect(TIMEOUTS.CONNECTION).toBeGreaterThan(0);
		});
	});

	describe('Events', () => {
		it('should have error codes defined', () => {
			expect(ErrorCode).toBeDefined();
			expect(ErrorCode.CONNECTION_FAILED).toBeDefined();
			expect(ErrorCode.DEVICE_NOT_FOUND).toBeDefined();
		});
	});
});
