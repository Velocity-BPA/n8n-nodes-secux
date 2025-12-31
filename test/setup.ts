/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

// Jest setup file for n8n-nodes-secux tests

// Make this a module
export {};

// Declare global type for mockExecuteFunctions
declare global {
	// eslint-disable-next-line no-var
	var mockExecuteFunctions: () => Record<string, jest.Mock>;
}

// Mock n8n-workflow module
jest.mock('n8n-workflow', () => ({
	NodeConnectionType: {
		Main: 'main',
	},
}));

// Increase timeout for integration tests
jest.setTimeout(30000);

// Global test utilities
globalThis.mockExecuteFunctions = () => ({
	getInputData: jest.fn().mockReturnValue([{ json: {} }]),
	getNodeParameter: jest.fn(),
	getCredentials: jest.fn(),
	continueOnFail: jest.fn().mockReturnValue(false),
	getWorkflowStaticData: jest.fn().mockReturnValue({}),
});

// Clean up after each test
afterEach(() => {
	jest.clearAllMocks();
});
