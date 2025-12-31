/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { ICredentialDataDecryptedObject } from 'n8n-workflow';
import { USBTransport, IUSBTransport } from './usbTransport';
import { BluetoothTransport, IBluetoothTransport } from './bluetoothTransport';
import { WebUSBTransport, IWebUSBTransport } from './webUsbTransport';
import {
  SecuXError,
  DeviceInfo,
  ConnectionStatus,
  validateCredentials,
  withRetry,
} from '../utils/connectionUtils';
import { ErrorCode } from '../constants/events';
import { DEVICE_MODELS } from '../constants/devices';
import { TIMEOUTS } from '../constants/usbIds';

/**
 * Transport union type
 */
type Transport = IUSBTransport | IBluetoothTransport | IWebUSBTransport;

/**
 * Connection event types
 */
export enum ConnectionEvent {
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  DISCONNECTING = 'disconnecting',
  DISCONNECTED = 'disconnected',
  ERROR = 'error',
  RECONNECTING = 'reconnecting',
}

/**
 * Connection event listener
 */
export type ConnectionEventListener = (
  event: ConnectionEvent,
  data?: unknown,
) => void;

/**
 * Connection manager options
 */
export interface ConnectionManagerOptions {
  autoReconnect?: boolean;
  reconnectAttempts?: number;
  reconnectDelay?: number;
  timeout?: number;
}

/**
 * Connection Manager for SecuX hardware wallets
 *
 * Provides a unified interface for managing device connections across
 * different transport protocols (USB, Bluetooth, WebUSB, Bridge).
 *
 * Features:
 * - Automatic transport selection based on credentials
 * - Connection state management
 * - Auto-reconnection support
 * - Event notifications
 * - Command queuing and execution
 */
export class ConnectionManager {
  private transport: Transport | null = null;
  private credentials: ICredentialDataDecryptedObject;
  private options: Required<ConnectionManagerOptions>;
  private connected = false;
  private connecting = false;
  private deviceInfo: DeviceInfo | null = null;
  private lastConnected: Date | null = null;
  private listeners: Set<ConnectionEventListener> = new Set();

  constructor(
    credentials: ICredentialDataDecryptedObject,
    options: ConnectionManagerOptions = {},
  ) {
    validateCredentials(credentials);

    this.credentials = credentials;
    this.options = {
      autoReconnect: options.autoReconnect ?? true,
      reconnectAttempts: options.reconnectAttempts ?? 3,
      reconnectDelay: options.reconnectDelay ?? 1000,
      timeout: options.timeout ?? TIMEOUTS.CONNECTION,
    };
  }

  /**
   * Connect to the device
   */
  async connect(): Promise<DeviceInfo> {
    if (this.connected) {
      return this.deviceInfo!;
    }

    if (this.connecting) {
      throw new SecuXError(ErrorCode.DEVICE_BUSY);
    }

    this.connecting = true;
    this.emit(ConnectionEvent.CONNECTING);

    try {
      this.transport = this.createTransport();
      this.deviceInfo = await this.transport.connect();
      this.connected = true;
      this.lastConnected = new Date();

      this.emit(ConnectionEvent.CONNECTED, this.deviceInfo);

      return this.deviceInfo;
    } catch (error) {
      this.emit(ConnectionEvent.ERROR, error);
      throw error;
    } finally {
      this.connecting = false;
    }
  }

  /**
   * Disconnect from the device
   */
  async disconnect(): Promise<void> {
    if (!this.connected || !this.transport) {
      return;
    }

    this.emit(ConnectionEvent.DISCONNECTING);

    try {
      await this.transport.disconnect();
    } finally {
      this.connected = false;
      this.transport = null;
      this.deviceInfo = null;
      this.emit(ConnectionEvent.DISCONNECTED);
    }
  }

  /**
   * Check if device is connected
   */
  isConnected(): boolean {
    return this.connected && (this.transport?.isConnected() ?? false);
  }

  /**
   * Get current connection status
   */
  getStatus(): ConnectionStatus {
    const { deviceModel, connectionType, devicePath, bluetoothMac } = this.credentials;

    return {
      connected: this.connected,
      connectionType: connectionType as string,
      deviceModel: deviceModel as string,
      deviceId: devicePath as string,
      bluetoothMac: bluetoothMac as string,
      firmwareVersion: this.deviceInfo?.firmwareVersion,
      batteryLevel: this.deviceInfo?.batteryLevel,
      lastConnected: this.lastConnected ?? undefined,
    };
  }

  /**
   * Get device info
   */
  getDeviceInfo(): DeviceInfo | null {
    return this.deviceInfo;
  }

  /**
   * Send command to device
   */
  async sendCommand(command: Buffer): Promise<Buffer> {
    if (!this.connected || !this.transport) {
      if (this.options.autoReconnect) {
        await this.reconnect();
      } else {
        throw new SecuXError(ErrorCode.CONNECTION_LOST);
      }
    }

    try {
      await this.transport!.send(command);
      return await this.transport!.receive();
    } catch (error) {
      if (this.options.autoReconnect) {
        return this.handleCommandError(command, error as Error);
      }
      throw error;
    }
  }

  /**
   * Execute operation with automatic connection management
   */
  async execute<T>(operation: (manager: ConnectionManager) => Promise<T>): Promise<T> {
    const _wasConnected = this.connected;

    try {
      if (!this.connected) {
        await this.connect();
      }

      return await operation(this);
    } finally {
      // Optionally disconnect if we connected just for this operation
      // For now, keep connection open for efficiency
    }
  }

  /**
   * Add event listener
   */
  on(listener: ConnectionEventListener): void {
    this.listeners.add(listener);
  }

  /**
   * Remove event listener
   */
  off(listener: ConnectionEventListener): void {
    this.listeners.delete(listener);
  }

  /**
   * Create transport based on connection type
   */
  private createTransport(): Transport {
    const { connectionType, devicePath, bluetoothMac, bridgeUrl } = this.credentials;

    switch (connectionType) {
      case 'usb':
        return new USBTransport(devicePath as string, this.options.timeout);

      case 'bluetooth':
        if (!bluetoothMac) {
          throw new SecuXError(ErrorCode.INVALID_PARAMETER, { field: 'bluetoothMac' });
        }
        return new BluetoothTransport(bluetoothMac as string, this.options.timeout);

      case 'webusb':
        return new WebUSBTransport(this.options.timeout);

      case 'bridge':
        // Bridge uses HTTP transport (simplified to USB for this implementation)
        return new USBTransport(devicePath as string, this.options.timeout);

      default:
        throw new SecuXError(ErrorCode.NOT_SUPPORTED, { connectionType });
    }
  }

  /**
   * Attempt to reconnect
   */
  private async reconnect(): Promise<void> {
    this.emit(ConnectionEvent.RECONNECTING);

    await withRetry(
      async () => {
        this.transport = null;
        this.connected = false;
        await this.connect();
      },
      this.options.reconnectAttempts,
      this.options.reconnectDelay,
    );
  }

  /**
   * Handle command error with potential reconnection
   */
  private async handleCommandError(command: Buffer, error: Error): Promise<Buffer> {
    try {
      await this.reconnect();
      await this.transport!.send(command);
      return await this.transport!.receive();
    } catch {
      throw error;
    }
  }

  /**
   * Emit event to all listeners
   */
  private emit(event: ConnectionEvent, data?: unknown): void {
    for (const listener of this.listeners) {
      try {
        listener(event, data);
      } catch {
        // Ignore listener errors
      }
    }
  }

  /**
   * Get battery level (Bluetooth devices only)
   */
  async getBatteryLevel(): Promise<number | null> {
    if (!this.connected) {
      return null;
    }

    const { connectionType } = this.credentials;
    if (connectionType === 'bluetooth' && this.transport) {
      const btTransport = this.transport as BluetoothTransport;
      return btTransport.getBatteryLevel();
    }

    return this.deviceInfo?.batteryLevel ?? null;
  }

  /**
   * Get signal strength (Bluetooth devices only)
   */
  async getSignalStrength(): Promise<number | null> {
    if (!this.connected) {
      return null;
    }

    const { connectionType } = this.credentials;
    if (connectionType === 'bluetooth' && this.transport) {
      const btTransport = this.transport as BluetoothTransport;
      return btTransport.getSignalStrength();
    }

    return null;
  }

  /**
   * Check if device model supports specific feature
   */
  supportsFeature(feature: 'bluetooth' | 'nft' | 'touchscreen' | 'battery'): boolean {
    const { deviceModel } = this.credentials;
    const model = DEVICE_MODELS[deviceModel as string];

    if (!model) return false;

    switch (feature) {
      case 'bluetooth':
        return model.capabilities.bluetooth;
      case 'nft':
        return model.capabilities.nftDisplay;
      case 'touchscreen':
        return model.capabilities.touchscreen;
      case 'battery':
        return model.capabilities.batteryPowered;
      default:
        return false;
    }
  }
}

/**
 * Create connection manager from credentials
 */
export function createConnectionManager(
  credentials: ICredentialDataDecryptedObject,
  options?: ConnectionManagerOptions,
): ConnectionManager {
  return new ConnectionManager(credentials, options);
}

/**
 * Get a connected connection manager
 */
export async function getConnectedManager(
  credentials: ICredentialDataDecryptedObject,
  options?: ConnectionManagerOptions,
): Promise<ConnectionManager> {
  const manager = createConnectionManager(credentials, options);
  await manager.connect();
  return manager;
}
