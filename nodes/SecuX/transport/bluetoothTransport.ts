/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  BLUETOOTH_WRITE_UUID,
  BLUETOOTH_READ_UUID,
  BLUETOOTH_DEVICES,
  TIMEOUTS,
} from '../constants/usbIds';
import { SecuXError, DeviceInfo, formatBluetoothMac } from '../utils/connectionUtils';
import { ErrorCode } from '../constants/events';

/**
 * Bluetooth transport interface
 */
export interface IBluetoothTransport {
  connect(): Promise<DeviceInfo>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
  send(data: Buffer): Promise<void>;
  receive(): Promise<Buffer>;
  getDeviceInfo(): DeviceInfo | null;
  getBatteryLevel(): Promise<number>;
  getSignalStrength(): Promise<number>;
}

/**
 * Bluetooth device discovery result
 */
export interface BluetoothDevice {
  name: string;
  address: string;
  model: string;
  rssi: number;
  paired: boolean;
}

/**
 * Bluetooth Transport class for SecuX hardware wallets
 *
 * Implements BLE communication for Bluetooth-enabled devices.
 * Supports SecuX V20, W20, Nifty, and Shield models.
 */
export class BluetoothTransport implements IBluetoothTransport {
  private peripheral: unknown = null;
  private writeCharacteristic: unknown = null;
  private readCharacteristic: unknown = null;
  private connected = false;
  private deviceInfo: DeviceInfo | null = null;
  private macAddress: string;
  private timeout: number;
  private batteryLevel = 100;
  private rssi = -50;

  constructor(macAddress: string, timeout = TIMEOUTS.BLUETOOTH_CONNECT) {
    this.macAddress = formatBluetoothMac(macAddress);
    this.timeout = timeout;
  }

  /**
   * Connect to SecuX device via Bluetooth
   */
  async connect(): Promise<DeviceInfo> {
    try {
      // In real implementation, this would use noble or @abandonware/noble
      // const noble = require('@abandonware/noble');

      // Simulated connection
      await this.simulateConnection();

      this.connected = true;
      this.deviceInfo = await this.queryDeviceInfo();

      return this.deviceInfo;
    } catch (error) {
      throw new SecuXError(ErrorCode.CONNECTION_FAILED, {
        original: (error as Error).message,
      });
    }
  }

  /**
   * Disconnect from device
   */
  async disconnect(): Promise<void> {
    if (this.peripheral) {
      // In real implementation: this.peripheral.disconnect();
      this.peripheral = null;
    }
    this.writeCharacteristic = null;
    this.readCharacteristic = null;
    this.connected = false;
    this.deviceInfo = null;
  }

  /**
   * Check if device is connected
   */
  isConnected(): boolean {
    return this.connected;
  }

  /**
   * Send data to device
   */
  async send(_data: Buffer): Promise<void> {
    if (!this.connected || !this.writeCharacteristic) {
      throw new SecuXError(ErrorCode.CONNECTION_LOST);
    }

    // In real implementation:
    // await this.writeCharacteristic.writeAsync(_data, false);

    // Simulated write delay
    await new Promise((resolve) => setTimeout(resolve, 20));
  }

  /**
   * Receive data from device
   */
  async receive(): Promise<Buffer> {
    if (!this.connected || !this.readCharacteristic) {
      throw new SecuXError(ErrorCode.CONNECTION_LOST);
    }

    // In real implementation:
    // return new Promise((resolve, reject) => {
    //   const _timeout = setTimeout(() => reject(new Error('Timeout')), this.timeout);
    //   this.readCharacteristic.on('data', (data) => {
    //     clearTimeout(timeout);
    //     resolve(data);
    //   });
    // });

    // Simulated response
    await new Promise((resolve) => setTimeout(resolve, 100));
    return Buffer.from([0x90, 0x00]);
  }

  /**
   * Get cached device info
   */
  getDeviceInfo(): DeviceInfo | null {
    return this.deviceInfo;
  }

  /**
   * Get battery level
   */
  async getBatteryLevel(): Promise<number> {
    if (!this.connected) {
      throw new SecuXError(ErrorCode.CONNECTION_LOST);
    }

    // In real implementation, read from battery service
    return this.batteryLevel;
  }

  /**
   * Get signal strength (RSSI)
   */
  async getSignalStrength(): Promise<number> {
    if (!this.connected) {
      throw new SecuXError(ErrorCode.CONNECTION_LOST);
    }

    // In real implementation: this.peripheral.updateRssi()
    return this.rssi;
  }

  /**
   * Simulate connection for development/testing
   */
  private async simulateConnection(): Promise<void> {
    // Simulate scan and connection delay
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Simulate finding device
    const device = BLUETOOTH_DEVICES.find((d) => d.model === 'v20');
    if (!device) {
      throw new SecuXError(ErrorCode.DEVICE_NOT_FOUND);
    }

    this.peripheral = { address: this.macAddress };
    this.writeCharacteristic = { uuid: BLUETOOTH_WRITE_UUID };
    this.readCharacteristic = { uuid: BLUETOOTH_READ_UUID };
    this.batteryLevel = Math.floor(Math.random() * 40) + 60; // 60-100%
    this.rssi = Math.floor(Math.random() * 30) - 70; // -70 to -40 dBm
  }

  /**
   * Query device information
   */
  private async queryDeviceInfo(): Promise<DeviceInfo> {
    return {
      model: 'v20',
      serialNumber: `SX${Date.now().toString(36).toUpperCase()}`,
      firmwareVersion: '2.23.0',
      mcuVersion: '1.5.0',
      seVersion: '1.0.0',
      batteryLevel: this.batteryLevel,
      bluetoothStatus: true,
    };
  }

  /**
   * Send command and wait for response
   */
  async sendCommand(command: Buffer): Promise<Buffer> {
    await this.send(command);
    return this.receive();
  }

  /**
   * Scan for available SecuX Bluetooth devices
   */
  static async scan(timeout = TIMEOUTS.BLUETOOTH_SCAN): Promise<BluetoothDevice[]> {
    // In real implementation:
    // const noble = require('@abandonware/noble');
    // const devices: BluetoothDevice[] = [];
    //
    // return new Promise((resolve) => {
    //   noble.on('discover', (peripheral) => {
    //     if (peripheral.advertisement.localName?.startsWith('SecuX')) {
    //       devices.push({
    //         name: peripheral.advertisement.localName,
    //         address: peripheral.address,
    //         model: determineModel(peripheral.advertisement.localName),
    //         rssi: peripheral.rssi,
    //         paired: false,
    //       });
    //     }
    //   });
    //
    //   noble.startScanning([BLUETOOTH_SERVICE_UUID], false);
    //
    //   setTimeout(() => {
    //     noble.stopScanning();
    //     resolve(devices);
    //   }, timeout);
    // });

    // Simulated scan results
    await new Promise((resolve) => setTimeout(resolve, timeout / 10));
    return [
      {
        name: 'SecuX V20-ABCD',
        address: 'AA:BB:CC:DD:EE:FF',
        model: 'v20',
        rssi: -55,
        paired: false,
      },
    ];
  }

  /**
   * Pair with device
   */
  async pair(): Promise<boolean> {
    if (!this.connected) {
      throw new SecuXError(ErrorCode.CONNECTION_LOST);
    }

    // In real implementation, initiate pairing
    // This typically involves user confirmation on the device

    await new Promise((resolve) => setTimeout(resolve, 100));
    return true;
  }

  /**
   * Unpair device
   */
  async unpair(): Promise<boolean> {
    // In real implementation, remove pairing
    await new Promise((resolve) => setTimeout(resolve, 100));
    return true;
  }

  /**
   * Open connection by MAC address
   */
  static async open(macAddress: string, timeout?: number): Promise<BluetoothTransport> {
    const transport = new BluetoothTransport(macAddress, timeout);
    await transport.connect();
    return transport;
  }
}

/**
 * Create Bluetooth transport instance
 */
export function createBluetoothTransport(
  macAddress: string,
  timeout?: number,
): BluetoothTransport {
  return new BluetoothTransport(macAddress, timeout);
}
