/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

/**
 * SecuX Device Credentials
 *
 * Handles authentication and connection configuration for SecuX hardware wallets.
 * Supports multiple device models and connection types including USB HID,
 * Bluetooth, WebUSB, and SecuXess Bridge.
 */
export class SecuXDevice implements ICredentialType {
  name = 'secuXDevice';
  displayName = 'SecuX Device';
  documentationUrl = 'https://github.com/Velocity-BPA/n8n-nodes-secux';

  properties: INodeProperties[] = [
    {
      displayName: 'Device Model',
      name: 'deviceModel',
      type: 'options',
      options: [
        {
          name: 'SecuX V20 (Premium - Bluetooth + USB)',
          value: 'v20',
          description: 'Premium model with large touchscreen, Bluetooth and USB connectivity',
        },
        {
          name: 'SecuX W20 (Mid-Range - Bluetooth + USB)',
          value: 'w20',
          description: 'Mid-range model with Bluetooth and USB connectivity',
        },
        {
          name: 'SecuX W10 (Entry - USB Only)',
          value: 'w10',
          description: 'Entry-level model with USB connectivity only',
        },
        {
          name: 'SecuX Nifty (NFT-Focused)',
          value: 'nifty',
          description: 'NFT-focused hardware wallet with display capabilities',
        },
        {
          name: 'SecuX Shield (Mobile/Card)',
          value: 'shield',
          description: 'Mobile-friendly card-form hardware wallet',
        },
      ],
      default: 'v20',
      description: 'The SecuX hardware wallet model you are connecting to',
    },
    {
      displayName: 'Connection Type',
      name: 'connectionType',
      type: 'options',
      options: [
        {
          name: 'USB HID',
          value: 'usb',
          description: 'Direct USB Human Interface Device connection',
        },
        {
          name: 'Bluetooth',
          value: 'bluetooth',
          description: 'Bluetooth Low Energy connection (V20/W20 only)',
        },
        {
          name: 'WebUSB',
          value: 'webusb',
          description: 'WebUSB API connection for browser-based access',
        },
        {
          name: 'SecuXess Bridge',
          value: 'bridge',
          description: 'Connection through SecuXess Bridge application',
        },
      ],
      default: 'usb',
      description: 'The connection method to use for communicating with the device',
    },
    {
      displayName: 'Device ID / Path',
      name: 'devicePath',
      type: 'string',
      default: '',
      placeholder: '/dev/hidraw0 or device-uuid',
      description:
        'The system path or unique identifier for the device. Leave empty for auto-detection.',
    },
    {
      displayName: 'Bluetooth MAC Address',
      name: 'bluetoothMac',
      type: 'string',
      default: '',
      placeholder: 'AA:BB:CC:DD:EE:FF',
      displayOptions: {
        show: {
          connectionType: ['bluetooth'],
          deviceModel: ['v20', 'w20'],
        },
      },
      description: 'The Bluetooth MAC address of the SecuX device',
    },
    {
      displayName: 'Bridge URL',
      name: 'bridgeUrl',
      type: 'string',
      default: 'http://localhost:21326',
      displayOptions: {
        show: {
          connectionType: ['bridge'],
        },
      },
      description: 'The URL of the SecuXess Bridge application',
    },
    {
      displayName: 'Connection Timeout (ms)',
      name: 'timeout',
      type: 'number',
      default: 30000,
      description: 'Maximum time to wait for device connection in milliseconds',
    },
    {
      displayName: 'Auto-Reconnect',
      name: 'autoReconnect',
      type: 'boolean',
      default: true,
      description: 'Whether to automatically attempt reconnection on connection loss',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {},
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: '={{$credentials.bridgeUrl || "http://localhost:21326"}}',
      url: '/health',
      method: 'GET',
      skipSslCertificateValidation: true,
    },
  };
}
