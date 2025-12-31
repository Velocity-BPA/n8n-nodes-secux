#!/bin/bash
# [Velocity BPA Licensing Notice]
#
# This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
#
# Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
#
# For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

set -e

echo "📦 Installing n8n-nodes-secux locally..."

# Build the project
./scripts/build.sh

# Create n8n custom directory if it doesn't exist
mkdir -p ~/.n8n/custom

# Remove existing symlink if present
rm -f ~/.n8n/custom/n8n-nodes-secux

# Create symlink
ln -s "$(pwd)" ~/.n8n/custom/n8n-nodes-secux

echo "✅ Installation complete!"
echo "🔄 Please restart n8n to load the new node."
