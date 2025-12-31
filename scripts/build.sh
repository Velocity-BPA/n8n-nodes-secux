#!/bin/bash
# [Velocity BPA Licensing Notice]
#
# This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
#
# Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
#
# For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

set -e

echo "🏗️ Building n8n-nodes-secux..."

# Clean previous build
rm -rf dist/

# Install dependencies
npm install

# Run build
npm run build

echo "✅ Build complete!"
