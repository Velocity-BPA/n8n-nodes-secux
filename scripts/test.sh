#!/bin/bash
# [Velocity BPA Licensing Notice]
#
# This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
#
# Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
#
# For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

set -e

echo "🧪 Running n8n-nodes-secux tests..."

# Run linting
echo "🔍 Running ESLint..."
npm run lint

# Run unit tests
echo "🔬 Running unit tests..."
npm test

# Run build to verify compilation
echo "🏗️ Verifying build..."
npm run build

echo "✅ All tests passed!"
