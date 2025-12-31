# n8n-nodes-secux

> [Velocity BPA Licensing Notice]
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for SecuX hardware wallet integration providing 26 resources and 150+ operations for multi-chain cryptocurrency management, transaction signing, NFT handling, and device management.

![n8n](https://img.shields.io/badge/n8n-community--node-orange)
![SecuX](https://img.shields.io/badge/SecuX-Hardware%20Wallet-teal)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)
![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-green)

## Features

- **Multi-Chain Support**: Bitcoin, Ethereum, Solana, XRP, Cardano, Cosmos, Stellar, Tron, Terra, and EVM-compatible chains
- **Transaction Signing**: Secure transaction signing with on-device verification
- **NFT Management**: ERC-721 and ERC-1155 token operations
- **Token Operations**: ERC-20, BEP-20, and SPL token transfers and approvals
- **Device Management**: Connection, PIN, security, backup, and firmware operations
- **SecuXess Integration**: Portfolio tracking and market data integration
- **Multiple Connection Types**: USB HID, WebUSB, and Bluetooth support
- **Trigger Node**: Event-based automation for device and transaction events

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** > **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-secux`
5. Click **Install**

### Manual Installation

```bash
# Navigate to your n8n installation
cd ~/.n8n

# Install the node
npm install n8n-nodes-secux

# Restart n8n
```

### Development Installation

```bash
# Clone the repository
git clone https://github.com/Velocity-BPA/n8n-nodes-secux.git
cd n8n-nodes-secux

# Install dependencies
npm install

# Build the project
npm run build

# Link for local development
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-secux

# Restart n8n
```

## Credentials Setup

### SecuX Device (Required)

| Field | Description |
|-------|-------------|
| Connection Type | USB HID, WebUSB, or Bluetooth |
| Device Serial | Optional device serial number |
| Timeout | Connection timeout in milliseconds |
| Auto Reconnect | Enable automatic reconnection |

### SecuXess (Optional)

| Field | Description |
|-------|-------------|
| API Key | SecuXess API key |
| Environment | Production or Sandbox |

### SecuX Network (Optional)

| Field | Description |
|-------|-------------|
| Network Type | Mainnet or Testnet |
| Bitcoin RPC | Custom Bitcoin RPC endpoint |
| Ethereum RPC | Custom Ethereum RPC endpoint |
| Custom Chain ID | Custom EVM chain ID |

## Resources & Operations

### Device Management
- **Device**: Get info, get version, check status, list connected, disconnect
- **PIN**: Get status, verify, change, lock, unlock, get attempts
- **Security**: Verify device, get SE info, factory reset, wipe device, get tamper status, get security log
- **Backup**: Get status, verify recovery words, check integrity, get seed length
- **Firmware**: Get version, check updates, get update history, get changelog

### Blockchain Operations

#### Bitcoin
- Get address, sign transaction, get balance, sign PSBT, get UTXO, verify address

#### Ethereum
- Get address, sign transaction, sign message, get balance, sign typed data, get nonce

#### Solana
- Get address, sign transaction, get balance, sign message

#### XRP
- Get address, sign transaction, get balance, get account info

#### Cardano
- Get address, sign transaction, get balance

#### Cosmos
- Get address, sign transaction, get balance

#### Stellar
- Get address, sign transaction, get balance

#### Tron
- Get address, sign transaction, get balance

#### Terra
- Get address, sign transaction, get balance

### Multi-Chain Operations
- **Multi-Chain**: Get all addresses, get portfolio balance, get transaction history
- **EVM Chains**: BSC, Polygon, Avalanche, Arbitrum, Optimism operations
- **Bitcoin-Like**: Litecoin, Dogecoin, Bitcoin Cash operations

### Token & NFT Operations
- **Token**: Get balance, sign transfer, sign approval, get allowance, get token info
- **NFT**: Get NFTs, sign transfer, display on device, get collections, get metadata

### Transaction Management
- **Transaction**: Create, sign, broadcast, get status, estimate fee, decode
- **Signing**: Sign transaction, sign message, sign typed data, sign PSBT, batch sign, verify signature

### Address Operations
- Get address, display on device, verify, get multiple, get public key

### Portfolio Integration
- **SecuXess**: Connect, get portfolio, get transactions, sync, get market data, get accounts

### Utilities
- Get supported coins, validate address, test connection, get SDK version, convert units, generate QR code
- **Bluetooth**: Scan devices, connect, disconnect, get paired devices

## Trigger Node

The SecuX Trigger node enables event-based automation with the following events:

| Event | Description |
|-------|-------------|
| Device Connected | Triggered when a device connects |
| Device Disconnected | Triggered when a device disconnects |
| Battery Low | Triggered when battery falls below threshold |
| Transaction Signed | Triggered when a transaction is signed |
| Transaction Rejected | Triggered when user rejects a transaction |
| Transaction Confirmed | Triggered when a transaction is confirmed on-chain |
| Balance Changed | Triggered when wallet balance changes |
| Transaction Received | Triggered when a transaction is received |
| PIN Entered | Triggered when PIN is entered |
| Device Locked | Triggered when device is locked |

### Trigger Configuration

- **Chain Filter**: Filter events by specific blockchain
- **Battery Threshold**: Set minimum battery level for alerts
- **Minimum Amount**: Set minimum amount for transaction events
- **Address Filter**: Filter by specific wallet address
- **Poll Interval**: Set polling frequency (default: 60 seconds)

## Usage Examples

### Get Bitcoin Address

```json
{
  "nodes": [
    {
      "name": "SecuX",
      "type": "n8n-nodes-secux.secuX",
      "parameters": {
        "resource": "bitcoin",
        "operation": "getAddress",
        "addressType": "nativeSegwit",
        "accountIndex": 0,
        "displayOnDevice": true
      }
    }
  ]
}
```

### Sign Ethereum Transaction

```json
{
  "nodes": [
    {
      "name": "SecuX",
      "type": "n8n-nodes-secux.secuX",
      "parameters": {
        "resource": "ethereum",
        "operation": "signTransaction",
        "to": "0x742d35Cc6634C0532925a3b844Bc9e7595f5bE2",
        "value": "0.1",
        "chainId": 1
      }
    }
  ]
}
```

### Monitor Wallet Balance

```json
{
  "nodes": [
    {
      "name": "SecuX Trigger",
      "type": "n8n-nodes-secux.secuXTrigger",
      "parameters": {
        "eventType": "balanceChanged",
        "chainFilter": "ethereum",
        "minimumAmount": "0.01"
      }
    }
  ]
}
```

## SecuX Device Concepts

### Supported Devices

| Device | Connection Types | Features |
|--------|-----------------|----------|
| SecuX V20 | USB, Bluetooth | Touchscreen, Bluetooth 5.0 |
| SecuX W20 | USB, Bluetooth | Compact, Bluetooth 5.0 |
| SecuX W10 | USB | Entry-level, USB only |
| SecuX Shield Bio | USB, Bluetooth | Fingerprint, Bluetooth 5.0 |

### Derivation Paths

The node supports standard BIP-44 derivation paths:

| Coin | Path | Standard |
|------|------|----------|
| Bitcoin | m/84'/0'/0' | BIP-84 (Native SegWit) |
| Bitcoin Legacy | m/44'/0'/0' | BIP-44 |
| Ethereum | m/44'/60'/0' | BIP-44 |
| Solana | m/44'/501'/0' | BIP-44 |
| Cardano | m/1852'/1815'/0' | CIP-1852 |

### Security Features

- **Secure Element**: All private keys stored in certified secure element
- **On-Device Verification**: Transaction details displayed on device screen
- **PIN Protection**: Customizable PIN with attempt limits
- **Tamper Detection**: Hardware tamper detection and response

## Networks

### Mainnet Networks

| Network | Chain ID | Native Token |
|---------|----------|--------------|
| Ethereum | 1 | ETH |
| BNB Smart Chain | 56 | BNB |
| Polygon | 137 | MATIC |
| Avalanche C-Chain | 43114 | AVAX |
| Arbitrum One | 42161 | ETH |
| Optimism | 10 | ETH |

### Testnet Networks

| Network | Chain ID | Native Token |
|---------|----------|--------------|
| Goerli | 5 | ETH |
| Sepolia | 11155111 | ETH |
| BNB Testnet | 97 | tBNB |
| Mumbai | 80001 | MATIC |

## Error Handling

The node implements comprehensive error handling:

| Error Type | Description | Resolution |
|------------|-------------|------------|
| Connection Error | Device not connected | Check USB/Bluetooth connection |
| Timeout Error | Operation timed out | Increase timeout or retry |
| User Rejected | User rejected on device | User must approve on device |
| Invalid Address | Address validation failed | Check address format |
| Insufficient Funds | Not enough balance | Check wallet balance |

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "DEVICE_NOT_CONNECTED",
    "message": "No SecuX device connected",
    "details": {}
  }
}
```

## Security Best Practices

1. **Always verify transactions on device screen** before approving
2. **Use strong PIN** with maximum allowed length
3. **Keep firmware updated** for latest security patches
4. **Secure your recovery phrase** offline and never share it
5. **Enable auto-lock** to protect unattended devices
6. **Use testnet** for development and testing
7. **Implement proper error handling** in workflows

## Development

### Build Commands

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Watch mode for development
npm run dev
```

### Project Structure

```
n8n-nodes-secux/
├── credentials/
│   ├── SecuXDevice.credentials.ts
│   ├── SecuXess.credentials.ts
│   └── SecuXNetwork.credentials.ts
├── nodes/
│   └── SecuX/
│       ├── SecuX.node.ts
│       ├── SecuXTrigger.node.ts
│       ├── actions/
│       ├── constants/
│       ├── transport/
│       └── utils/
├── test/
│   ├── unit/
│   └── integration/
└── scripts/
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service,
or paid automation offering requires a commercial license.

For licensing inquiries:
**licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -am 'Add my feature'`
4. Push to branch: `git push origin feature/my-feature`
5. Submit a pull request

Please ensure your code:
- Passes all tests (`npm test`)
- Follows the linting rules (`npm run lint`)
- Includes appropriate documentation
- Respects the BSL 1.1 license terms

## Support

- **Documentation**: [GitHub Wiki](https://github.com/Velocity-BPA/n8n-nodes-secux/wiki)
- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-secux/issues)
- **SecuX Documentation**: [SecuX Official](https://secuxtech.com)
- **n8n Documentation**: [n8n Docs](https://docs.n8n.io)

## Acknowledgments

- [SecuX](https://secuxtech.com) for their hardware wallet technology
- [n8n](https://n8n.io) for the workflow automation platform
- The open-source cryptocurrency development community
