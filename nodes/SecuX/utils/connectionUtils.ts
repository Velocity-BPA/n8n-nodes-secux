/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { ICredentialDataDecryptedObject } from 'n8n-workflow';
import { DEVICE_MODELS, supportsConnection } from '../constants/devices';
import { TIMEOUTS } from '../constants/usbIds';
import { ErrorCode, ERROR_MESSAGES } from '../constants/events';

/**
 * Connection status interface
 */
export interface ConnectionStatus {
  connected: boolean;
  connectionType: string;
  deviceModel: string;
  deviceId?: string;
  bluetoothMac?: string;
  firmwareVersion?: string;
  batteryLevel?: number;
  lastConnected?: Date;
}

/**
 * Device info returned from connection
 */
export interface DeviceInfo {
  model: string;
  serialNumber: string;
  firmwareVersion: string;
  mcuVersion: string;
  seVersion: string;
  batteryLevel?: number;
  bluetoothStatus?: boolean;
}

/**
 * SecuX error class
 */
export class SecuXError extends Error {
  code: ErrorCode;
  details?: Record<string, unknown>;

  constructor(code: ErrorCode, details?: Record<string, unknown>) {
    super(ERROR_MESSAGES[code] || 'Unknown error');
    this.name = 'SecuXError';
    this.code = code;
    this.details = details;
  }
}

/**
 * Validate device credentials
 */
export function validateCredentials(credentials: ICredentialDataDecryptedObject): void {
  const { deviceModel, connectionType, bluetoothMac } = credentials;

  if (!deviceModel || typeof deviceModel !== 'string') {
    throw new SecuXError(ErrorCode.INVALID_PARAMETER, { field: 'deviceModel' });
  }

  if (!DEVICE_MODELS[deviceModel as string]) {
    throw new SecuXError(ErrorCode.DEVICE_NOT_FOUND, { model: deviceModel });
  }

  if (!connectionType || typeof connectionType !== 'string') {
    throw new SecuXError(ErrorCode.INVALID_PARAMETER, { field: 'connectionType' });
  }

  if (!supportsConnection(deviceModel as string, connectionType as string)) {
    throw new SecuXError(ErrorCode.NOT_SUPPORTED, {
      model: deviceModel,
      connectionType,
    });
  }

  if (connectionType === 'bluetooth' && !bluetoothMac) {
    throw new SecuXError(ErrorCode.INVALID_PARAMETER, { field: 'bluetoothMac' });
  }
}

/**
 * Get connection timeout based on connection type
 */
export function getConnectionTimeout(connectionType: string): number {
  switch (connectionType) {
    case 'bluetooth':
      return TIMEOUTS.BLUETOOTH_CONNECT;
    case 'usb':
    case 'webusb':
      return TIMEOUTS.CONNECTION;
    case 'bridge':
      return TIMEOUTS.CONNECTION;
    default:
      return TIMEOUTS.CONNECTION;
  }
}

/**
 * Parse device path or ID
 */
export function parseDevicePath(path: string): {
  type: 'usb' | 'bluetooth' | 'uuid';
  value: string;
} {
  // Check if it's a Bluetooth MAC address
  const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
  if (macRegex.test(path)) {
    return { type: 'bluetooth', value: path.toUpperCase().replace(/-/g, ':') };
  }

  // Check if it's a USB device path
  if (path.startsWith('/dev/') || path.startsWith('\\\\.\\')) {
    return { type: 'usb', value: path };
  }

  // Otherwise treat as UUID
  return { type: 'uuid', value: path };
}

/**
 * Format Bluetooth MAC address
 */
export function formatBluetoothMac(mac: string): string {
  const cleaned = mac.replace(/[:-]/g, '').toUpperCase();
  if (cleaned.length !== 12) {
    throw new SecuXError(ErrorCode.INVALID_PARAMETER, { field: 'bluetoothMac' });
  }
  return cleaned.match(/.{2}/g)!.join(':');
}

/**
 * Create a connection manager instance (simulated for n8n context)
 */
export function createConnectionManager(credentials: ICredentialDataDecryptedObject): {
  connect: () => Promise<DeviceInfo>;
  disconnect: () => Promise<void>;
  isConnected: () => boolean;
  getStatus: () => ConnectionStatus;
  sendCommand: (command: Buffer) => Promise<Buffer>;
} {
  let connected = false;
  let deviceInfo: DeviceInfo | null = null;

  const { deviceModel, connectionType, devicePath, bluetoothMac, timeout } = credentials;

  return {
    async connect(): Promise<DeviceInfo> {
      validateCredentials(credentials);

      // Simulated connection logic
      // In real implementation, this would use node-hid or noble libraries
      const _connectionTimeout = timeout
        ? Number(timeout)
        : getConnectionTimeout(connectionType as string);

      await new Promise((resolve) => setTimeout(resolve, 100));

      deviceInfo = {
        model: deviceModel as string,
        serialNumber: `SX${Date.now().toString(36).toUpperCase()}`,
        firmwareVersion: '2.23.0',
        mcuVersion: '1.5.0',
        seVersion: '1.0.0',
        batteryLevel: connectionType === 'bluetooth' ? 85 : undefined,
        bluetoothStatus: connectionType === 'bluetooth',
      };

      connected = true;
      return deviceInfo;
    },

    async disconnect(): Promise<void> {
      connected = false;
      deviceInfo = null;
    },

    isConnected(): boolean {
      return connected;
    },

    getStatus(): ConnectionStatus {
      return {
        connected,
        connectionType: connectionType as string,
        deviceModel: deviceModel as string,
        deviceId: devicePath as string,
        bluetoothMac: bluetoothMac as string,
        firmwareVersion: deviceInfo?.firmwareVersion,
        batteryLevel: deviceInfo?.batteryLevel,
        lastConnected: connected ? new Date() : undefined,
      };
    },

    async sendCommand(command: Buffer): Promise<Buffer> {
      if (!connected) {
        throw new SecuXError(ErrorCode.CONNECTION_LOST);
      }

      // Simulated command response
      // In real implementation, this would send command via USB HID or Bluetooth
      return Buffer.from([0x90, 0x00]); // Success status
    },
  };
}

/**
 * Retry wrapper for connection operations
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delayMs = 1000,
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
      }
    }
  }

  throw lastError;
}

/**
 * Check if device supports a specific operation
 */
export function checkDeviceSupport(
  model: string,
  operation: 'bluetooth' | 'nft' | 'touchscreen' | 'battery',
): boolean {
  const device = DEVICE_MODELS[model];
  if (!device) return false;

  switch (operation) {
    case 'bluetooth':
      return device.capabilities.bluetooth;
    case 'nft':
      return device.capabilities.nftDisplay;
    case 'touchscreen':
      return device.capabilities.touchscreen;
    case 'battery':
      return device.capabilities.batteryPowered;
    default:
      return false;
  }
}
