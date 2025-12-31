/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Event types for SecuX device operations and triggers.
 */

export enum DeviceEvent {
  CONNECTED = 'device.connected',
  DISCONNECTED = 'device.disconnected',
  BLUETOOTH_CONNECTED = 'device.bluetooth.connected',
  BLUETOOTH_DISCONNECTED = 'device.bluetooth.disconnected',
  BATTERY_LOW = 'device.battery.low',
  BATTERY_CRITICAL = 'device.battery.critical',
  FIRMWARE_UPDATE_AVAILABLE = 'device.firmware.update_available',
  ERROR = 'device.error',
}

export enum TransactionEvent {
  SIGNED = 'transaction.signed',
  REJECTED = 'transaction.rejected',
  BROADCAST = 'transaction.broadcast',
  CONFIRMED = 'transaction.confirmed',
  FAILED = 'transaction.failed',
  PENDING = 'transaction.pending',
}

export enum SigningEvent {
  REQUEST = 'signing.request',
  COMPLETE = 'signing.complete',
  CANCELLED = 'signing.cancelled',
  TIMEOUT = 'signing.timeout',
  ERROR = 'signing.error',
}

export enum AccountEvent {
  CREATED = 'account.created',
  BALANCE_CHANGED = 'account.balance.changed',
  TRANSACTION_RECEIVED = 'account.transaction.received',
  SYNCED = 'account.synced',
}

export enum SecurityEvent {
  PIN_CHANGED = 'security.pin.changed',
  DEVICE_LOCKED = 'security.device.locked',
  DEVICE_UNLOCKED = 'security.device.unlocked',
  TAMPER_ALERT = 'security.tamper.alert',
  DEVICE_WIPED = 'security.device.wiped',
  AUTHENTICITY_VERIFIED = 'security.authenticity.verified',
  AUTHENTICITY_FAILED = 'security.authenticity.failed',
}

export const ALL_EVENTS = {
  ...DeviceEvent,
  ...TransactionEvent,
  ...SigningEvent,
  ...AccountEvent,
  ...SecurityEvent,
};

export const DEVICE_EVENT_OPTIONS = [
  { name: 'Device Connected', value: DeviceEvent.CONNECTED },
  { name: 'Device Disconnected', value: DeviceEvent.DISCONNECTED },
  { name: 'Bluetooth Connected', value: DeviceEvent.BLUETOOTH_CONNECTED },
  { name: 'Bluetooth Disconnected', value: DeviceEvent.BLUETOOTH_DISCONNECTED },
  { name: 'Battery Low', value: DeviceEvent.BATTERY_LOW },
  { name: 'Battery Critical', value: DeviceEvent.BATTERY_CRITICAL },
  { name: 'Firmware Update Available', value: DeviceEvent.FIRMWARE_UPDATE_AVAILABLE },
  { name: 'Device Error', value: DeviceEvent.ERROR },
];

export const TRANSACTION_EVENT_OPTIONS = [
  { name: 'Transaction Signed', value: TransactionEvent.SIGNED },
  { name: 'Transaction Rejected', value: TransactionEvent.REJECTED },
  { name: 'Transaction Broadcast', value: TransactionEvent.BROADCAST },
  { name: 'Transaction Confirmed', value: TransactionEvent.CONFIRMED },
  { name: 'Transaction Failed', value: TransactionEvent.FAILED },
  { name: 'Transaction Pending', value: TransactionEvent.PENDING },
];

export const SIGNING_EVENT_OPTIONS = [
  { name: 'Sign Request', value: SigningEvent.REQUEST },
  { name: 'Signature Complete', value: SigningEvent.COMPLETE },
  { name: 'Signing Cancelled', value: SigningEvent.CANCELLED },
  { name: 'Signing Timeout', value: SigningEvent.TIMEOUT },
  { name: 'Signing Error', value: SigningEvent.ERROR },
];

export const ACCOUNT_EVENT_OPTIONS = [
  { name: 'Account Created', value: AccountEvent.CREATED },
  { name: 'Balance Changed', value: AccountEvent.BALANCE_CHANGED },
  { name: 'Transaction Received', value: AccountEvent.TRANSACTION_RECEIVED },
  { name: 'Account Synced', value: AccountEvent.SYNCED },
];

export const SECURITY_EVENT_OPTIONS = [
  { name: 'PIN Changed', value: SecurityEvent.PIN_CHANGED },
  { name: 'Device Locked', value: SecurityEvent.DEVICE_LOCKED },
  { name: 'Device Unlocked', value: SecurityEvent.DEVICE_UNLOCKED },
  { name: 'Tamper Alert', value: SecurityEvent.TAMPER_ALERT },
  { name: 'Device Wiped', value: SecurityEvent.DEVICE_WIPED },
  { name: 'Authenticity Verified', value: SecurityEvent.AUTHENTICITY_VERIFIED },
  { name: 'Authenticity Failed', value: SecurityEvent.AUTHENTICITY_FAILED },
];

export const ALL_EVENT_OPTIONS = [
  ...DEVICE_EVENT_OPTIONS,
  ...TRANSACTION_EVENT_OPTIONS,
  ...SIGNING_EVENT_OPTIONS,
  ...ACCOUNT_EVENT_OPTIONS,
  ...SECURITY_EVENT_OPTIONS,
];

// Error codes
export enum ErrorCode {
  // Connection errors (1xxx)
  CONNECTION_FAILED = 1001,
  CONNECTION_TIMEOUT = 1002,
  CONNECTION_LOST = 1003,
  DEVICE_NOT_FOUND = 1004,
  DEVICE_BUSY = 1005,
  BLUETOOTH_NOT_SUPPORTED = 1006,
  USB_NOT_SUPPORTED = 1007,

  // Authentication errors (2xxx)
  PIN_REQUIRED = 2001,
  PIN_INVALID = 2002,
  PIN_LOCKED = 2003,
  DEVICE_LOCKED = 2004,

  // Transaction errors (3xxx)
  TRANSACTION_REJECTED = 3001,
  TRANSACTION_TIMEOUT = 3002,
  TRANSACTION_INVALID = 3003,
  INSUFFICIENT_FUNDS = 3004,
  INVALID_ADDRESS = 3005,
  INVALID_AMOUNT = 3006,

  // Signing errors (4xxx)
  SIGNING_REJECTED = 4001,
  SIGNING_TIMEOUT = 4002,
  SIGNING_CANCELLED = 4003,
  INVALID_MESSAGE = 4004,
  INVALID_DATA = 4005,

  // Device errors (5xxx)
  DEVICE_ERROR = 5001,
  FIRMWARE_ERROR = 5002,
  SECURE_ELEMENT_ERROR = 5003,
  BATTERY_ERROR = 5004,
  TAMPER_DETECTED = 5005,

  // Protocol errors (6xxx)
  PROTOCOL_ERROR = 6001,
  INVALID_RESPONSE = 6002,
  CHECKSUM_ERROR = 6003,
  PACKET_ERROR = 6004,

  // General errors (9xxx)
  UNKNOWN_ERROR = 9001,
  NOT_SUPPORTED = 9002,
  INVALID_PARAMETER = 9003,
  OPERATION_CANCELLED = 9004,
}

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.CONNECTION_FAILED]: 'Failed to connect to the device',
  [ErrorCode.CONNECTION_TIMEOUT]: 'Connection timed out',
  [ErrorCode.CONNECTION_LOST]: 'Connection to device lost',
  [ErrorCode.DEVICE_NOT_FOUND]: 'Device not found',
  [ErrorCode.DEVICE_BUSY]: 'Device is busy',
  [ErrorCode.BLUETOOTH_NOT_SUPPORTED]: 'Bluetooth is not supported on this device',
  [ErrorCode.USB_NOT_SUPPORTED]: 'USB is not supported on this device',
  [ErrorCode.PIN_REQUIRED]: 'PIN is required',
  [ErrorCode.PIN_INVALID]: 'Invalid PIN',
  [ErrorCode.PIN_LOCKED]: 'PIN is locked due to too many failed attempts',
  [ErrorCode.DEVICE_LOCKED]: 'Device is locked',
  [ErrorCode.TRANSACTION_REJECTED]: 'Transaction was rejected by user',
  [ErrorCode.TRANSACTION_TIMEOUT]: 'Transaction timed out',
  [ErrorCode.TRANSACTION_INVALID]: 'Invalid transaction data',
  [ErrorCode.INSUFFICIENT_FUNDS]: 'Insufficient funds',
  [ErrorCode.INVALID_ADDRESS]: 'Invalid address',
  [ErrorCode.INVALID_AMOUNT]: 'Invalid amount',
  [ErrorCode.SIGNING_REJECTED]: 'Signing was rejected by user',
  [ErrorCode.SIGNING_TIMEOUT]: 'Signing timed out',
  [ErrorCode.SIGNING_CANCELLED]: 'Signing was cancelled',
  [ErrorCode.INVALID_MESSAGE]: 'Invalid message to sign',
  [ErrorCode.INVALID_DATA]: 'Invalid data',
  [ErrorCode.DEVICE_ERROR]: 'Device error occurred',
  [ErrorCode.FIRMWARE_ERROR]: 'Firmware error',
  [ErrorCode.SECURE_ELEMENT_ERROR]: 'Secure element error',
  [ErrorCode.BATTERY_ERROR]: 'Battery error',
  [ErrorCode.TAMPER_DETECTED]: 'Tamper detected',
  [ErrorCode.PROTOCOL_ERROR]: 'Protocol error',
  [ErrorCode.INVALID_RESPONSE]: 'Invalid response from device',
  [ErrorCode.CHECKSUM_ERROR]: 'Checksum error',
  [ErrorCode.PACKET_ERROR]: 'Packet error',
  [ErrorCode.UNKNOWN_ERROR]: 'Unknown error occurred',
  [ErrorCode.NOT_SUPPORTED]: 'Operation not supported',
  [ErrorCode.INVALID_PARAMETER]: 'Invalid parameter',
  [ErrorCode.OPERATION_CANCELLED]: 'Operation was cancelled',
};
