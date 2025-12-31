/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { SecuX } from '../../nodes/SecuX/SecuX.node';
import { SecuXTrigger } from '../../nodes/SecuX/SecuXTrigger.node';

describe('SecuX Node Integration', () => {
	describe('SecuX Node', () => {
		let secuXNode: SecuX;

		beforeEach(() => {
			secuXNode = new SecuX();
		});

		it('should have a description', () => {
			expect(secuXNode.description).toBeDefined();
			expect(secuXNode.description.displayName).toBe('SecuX');
			expect(secuXNode.description.name).toBe('secuX');
		});

		it('should have required properties', () => {
			const { description } = secuXNode;
			expect(description.icon).toBe('file:secux.svg');
			expect(description.group).toContain('transform');
			expect(description.version).toBe(1);
		});

		it('should have inputs and outputs', () => {
			const { description } = secuXNode;
			expect(description.inputs).toEqual(['main']);
			expect(description.outputs).toEqual(['main']);
		});

		it('should have credentials defined', () => {
			const { credentials } = secuXNode.description;
			expect(credentials).toBeDefined();
			expect(credentials!.length).toBeGreaterThan(0);
			expect(credentials!.find(c => c.name === 'secuXDevice')).toBeDefined();
		});

		it('should have properties defined', () => {
			const { properties } = secuXNode.description;
			expect(properties).toBeDefined();
			expect(properties!.length).toBeGreaterThan(0);
		});

		it('should have resource property', () => {
			const { properties } = secuXNode.description;
			const resourceProp = properties!.find(p => p.name === 'resource');
			expect(resourceProp).toBeDefined();
			expect(resourceProp!.type).toBe('options');
		});

		it('should have execute method', () => {
			expect(typeof secuXNode.execute).toBe('function');
		});
	});

	describe('SecuX Trigger Node', () => {
		let triggerNode: SecuXTrigger;

		beforeEach(() => {
			triggerNode = new SecuXTrigger();
		});

		it('should have a description', () => {
			expect(triggerNode.description).toBeDefined();
			expect(triggerNode.description.displayName).toBe('SecuX Trigger');
			expect(triggerNode.description.name).toBe('secuXTrigger');
		});

		it('should be a polling trigger', () => {
			expect(triggerNode.description.polling).toBe(true);
		});

		it('should have no inputs (trigger)', () => {
			expect(triggerNode.description.inputs).toEqual([]);
		});

		it('should have outputs', () => {
			expect(triggerNode.description.outputs).toEqual(['main']);
		});

		it('should have event property', () => {
			const { properties } = triggerNode.description;
			const eventProp = properties!.find(p => p.name === 'event');
			expect(eventProp).toBeDefined();
			expect(eventProp!.type).toBe('options');
		});

		it('should have poll method', () => {
			expect(typeof triggerNode.poll).toBe('function');
		});
	});
});
