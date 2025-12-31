/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * SecuX device models and their capabilities.
 */

export interface DeviceCapabilities {
  bluetooth: boolean;
  usb: boolean;
  webusb: boolean;
  touchscreen: boolean;
  nftDisplay: boolean;
  batteryPowered: boolean;
  mobileSupport: boolean;
  maxAccounts: number;
  supportedCoins: string[];
}

export interface DeviceModel {
  id: string;
  name: string;
  description: string;
  capabilities: DeviceCapabilities;
  secureElement: string;
  firmwarePrefix: string;
}

export const DEVICE_MODELS: Record<string, DeviceModel> = {
  v20: {
    id: 'v20',
    name: 'SecuX V20',
    description: 'Premium hardware wallet with large touchscreen, Bluetooth and USB',
    capabilities: {
      bluetooth: true,
      usb: true,
      webusb: true,
      touchscreen: true,
      nftDisplay: true,
      batteryPowered: true,
      mobileSupport: true,
      maxAccounts: 500,
      supportedCoins: [
        'BTC',
        'ETH',
        'BNB',
        'MATIC',
        'AVAX',
        'ARB',
        'OP',
        'FTM',
        'CRO',
        'BASE',
        'GNOSIS',
        'SOL',
        'XRP',
        'ATOM',
        'TRX',
        'ADA',
        'XLM',
        'LUNA',
        'LTC',
        'DOGE',
        'BCH',
        'DASH',
        'DGB',
        'GRS',
      ],
    },
    secureElement: 'Infineon SLE Solid Flash CC EAL5+',
    firmwarePrefix: 'V20',
  },
  w20: {
    id: 'w20',
    name: 'SecuX W20',
    description: 'Mid-range hardware wallet with Bluetooth and USB connectivity',
    capabilities: {
      bluetooth: true,
      usb: true,
      webusb: true,
      touchscreen: true,
      nftDisplay: false,
      batteryPowered: true,
      mobileSupport: true,
      maxAccounts: 200,
      supportedCoins: [
        'BTC',
        'ETH',
        'BNB',
        'MATIC',
        'AVAX',
        'ARB',
        'OP',
        'FTM',
        'CRO',
        'BASE',
        'GNOSIS',
        'SOL',
        'XRP',
        'ATOM',
        'TRX',
        'ADA',
        'XLM',
        'LUNA',
        'LTC',
        'DOGE',
        'BCH',
        'DASH',
        'DGB',
        'GRS',
      ],
    },
    secureElement: 'Infineon SLE Solid Flash CC EAL5+',
    firmwarePrefix: 'W20',
  },
  w10: {
    id: 'w10',
    name: 'SecuX W10',
    description: 'Entry-level hardware wallet with USB connectivity only',
    capabilities: {
      bluetooth: false,
      usb: true,
      webusb: true,
      touchscreen: true,
      nftDisplay: false,
      batteryPowered: false,
      mobileSupport: false,
      maxAccounts: 100,
      supportedCoins: [
        'BTC',
        'ETH',
        'BNB',
        'MATIC',
        'SOL',
        'XRP',
        'ATOM',
        'TRX',
        'ADA',
        'LTC',
        'DOGE',
        'BCH',
      ],
    },
    secureElement: 'Infineon SLE Solid Flash CC EAL5+',
    firmwarePrefix: 'W10',
  },
  nifty: {
    id: 'nifty',
    name: 'SecuX Nifty',
    description: 'NFT-focused hardware wallet with display capabilities',
    capabilities: {
      bluetooth: true,
      usb: true,
      webusb: true,
      touchscreen: true,
      nftDisplay: true,
      batteryPowered: true,
      mobileSupport: true,
      maxAccounts: 200,
      supportedCoins: ['ETH', 'BNB', 'MATIC', 'AVAX', 'ARB', 'OP', 'BASE', 'SOL'],
    },
    secureElement: 'Infineon SLE Solid Flash CC EAL5+',
    firmwarePrefix: 'NFT',
  },
  shield: {
    id: 'shield',
    name: 'SecuX Shield',
    description: 'Mobile-friendly card-form hardware wallet',
    capabilities: {
      bluetooth: true,
      usb: false,
      webusb: false,
      touchscreen: false,
      nftDisplay: false,
      batteryPowered: true,
      mobileSupport: true,
      maxAccounts: 50,
      supportedCoins: ['BTC', 'ETH', 'BNB', 'MATIC', 'SOL', 'XRP', 'LTC', 'DOGE'],
    },
    secureElement: 'Infineon SLE Solid Flash CC EAL5+',
    firmwarePrefix: 'SHD',
  },
};

export const DEVICE_MODEL_OPTIONS = Object.entries(DEVICE_MODELS).map(([value, model]) => ({
  name: model.name,
  value,
  description: model.description,
}));

export const CONNECTION_TYPES = {
  usb: {
    name: 'USB HID',
    value: 'usb',
    description: 'Direct USB Human Interface Device connection',
  },
  bluetooth: {
    name: 'Bluetooth',
    value: 'bluetooth',
    description: 'Bluetooth Low Energy connection',
  },
  webusb: {
    name: 'WebUSB',
    value: 'webusb',
    description: 'WebUSB API connection',
  },
  bridge: {
    name: 'SecuXess Bridge',
    value: 'bridge',
    description: 'Connection through SecuXess Bridge application',
  },
};

export const CONNECTION_TYPE_OPTIONS = Object.values(CONNECTION_TYPES);

export function getDeviceCapabilities(modelId: string): DeviceCapabilities | undefined {
  return DEVICE_MODELS[modelId]?.capabilities;
}

export function supportsConnection(modelId: string, connectionType: string): boolean {
  const capabilities = getDeviceCapabilities(modelId);
  if (!capabilities) return false;

  switch (connectionType) {
    case 'usb':
      return capabilities.usb;
    case 'bluetooth':
      return capabilities.bluetooth;
    case 'webusb':
      return capabilities.webusb;
    case 'bridge':
      return capabilities.usb || capabilities.bluetooth;
    default:
      return false;
  }
}

export function supportsCoin(modelId: string, coinSymbol: string): boolean {
  const capabilities = getDeviceCapabilities(modelId);
  return capabilities?.supportedCoins.includes(coinSymbol) ?? false;
}
