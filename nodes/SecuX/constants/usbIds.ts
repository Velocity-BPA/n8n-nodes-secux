/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * USB and Bluetooth identifiers for SecuX hardware wallets.
 */

export interface UsbDeviceInfo {
  vendorId: number;
  productId: number;
  model: string;
  description: string;
}

export interface BluetoothDeviceInfo {
  serviceUuid: string;
  characteristicUuid: string;
  model: string;
  namePrefix: string;
}

// SecuX USB Vendor ID
export const SECUX_VENDOR_ID = 0x1209;

// SecuX USB Device Product IDs
export const USB_PRODUCT_IDS: Record<string, number> = {
  V20: 0x5801,
  W20: 0x5802,
  W10: 0x5803,
  NIFTY: 0x5804,
  SHIELD: 0x5805,
};

// Complete USB device configurations
export const USB_DEVICES: UsbDeviceInfo[] = [
  {
    vendorId: SECUX_VENDOR_ID,
    productId: USB_PRODUCT_IDS.V20,
    model: 'v20',
    description: 'SecuX V20 Hardware Wallet',
  },
  {
    vendorId: SECUX_VENDOR_ID,
    productId: USB_PRODUCT_IDS.W20,
    model: 'w20',
    description: 'SecuX W20 Hardware Wallet',
  },
  {
    vendorId: SECUX_VENDOR_ID,
    productId: USB_PRODUCT_IDS.W10,
    model: 'w10',
    description: 'SecuX W10 Hardware Wallet',
  },
  {
    vendorId: SECUX_VENDOR_ID,
    productId: USB_PRODUCT_IDS.NIFTY,
    model: 'nifty',
    description: 'SecuX Nifty NFT Wallet',
  },
];

// Bluetooth Service UUIDs
export const BLUETOOTH_SERVICE_UUID = '00001101-0000-1000-8000-00805f9b34fb';
export const BLUETOOTH_WRITE_UUID = '00001102-0000-1000-8000-00805f9b34fb';
export const BLUETOOTH_READ_UUID = '00001103-0000-1000-8000-00805f9b34fb';

// Bluetooth device configurations
export const BLUETOOTH_DEVICES: BluetoothDeviceInfo[] = [
  {
    serviceUuid: BLUETOOTH_SERVICE_UUID,
    characteristicUuid: BLUETOOTH_WRITE_UUID,
    model: 'v20',
    namePrefix: 'SecuX V20',
  },
  {
    serviceUuid: BLUETOOTH_SERVICE_UUID,
    characteristicUuid: BLUETOOTH_WRITE_UUID,
    model: 'w20',
    namePrefix: 'SecuX W20',
  },
  {
    serviceUuid: BLUETOOTH_SERVICE_UUID,
    characteristicUuid: BLUETOOTH_WRITE_UUID,
    model: 'nifty',
    namePrefix: 'SecuX Nifty',
  },
  {
    serviceUuid: BLUETOOTH_SERVICE_UUID,
    characteristicUuid: BLUETOOTH_WRITE_UUID,
    model: 'shield',
    namePrefix: 'SecuX Shield',
  },
];

// HID Report IDs
export const HID_REPORT = {
  COMMAND: 0x00,
  DATA: 0x01,
  STATUS: 0x02,
};

// HID Packet Sizes
export const HID_PACKET_SIZE = {
  HEADER: 7,
  DATA: 57,
  TOTAL: 64,
};

// Communication timeouts (ms)
export const TIMEOUTS = {
  CONNECTION: 30000,
  COMMAND: 60000,
  SIGNING: 120000,
  BLUETOOTH_SCAN: 10000,
  BLUETOOTH_CONNECT: 15000,
};

/**
 * Get USB device info by model
 */
export function getUsbDeviceByModel(model: string): UsbDeviceInfo | undefined {
  return USB_DEVICES.find((d) => d.model === model);
}

/**
 * Get Bluetooth device info by model
 */
export function getBluetoothDeviceByModel(model: string): BluetoothDeviceInfo | undefined {
  return BLUETOOTH_DEVICES.find((d) => d.model === model);
}

/**
 * Check if a USB device is a SecuX device
 */
export function isSecuXDevice(vendorId: number, productId: number): boolean {
  return (
    vendorId === SECUX_VENDOR_ID &&
    Object.values(USB_PRODUCT_IDS).includes(productId)
  );
}

/**
 * Get model from USB product ID
 */
export function getModelFromProductId(productId: number): string | undefined {
  const entry = Object.entries(USB_PRODUCT_IDS).find(([_, id]) => id === productId);
  return entry ? entry[0].toLowerCase() : undefined;
}

// WebUSB filter for SecuX devices
export const WEBUSB_FILTER = {
  vendorId: SECUX_VENDOR_ID,
};
