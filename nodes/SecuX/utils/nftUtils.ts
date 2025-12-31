/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * NFT token standards
 */
export enum NFTStandard {
  ERC721 = 'ERC721',
  ERC1155 = 'ERC1155',
  SPL = 'SPL', // Solana
  TRC721 = 'TRC721', // Tron
}

/**
 * NFT metadata interface
 */
export interface NFTMetadata {
  name: string;
  description?: string;
  image?: string;
  animationUrl?: string;
  externalUrl?: string;
  backgroundColor?: string;
  attributes?: NFTAttribute[];
}

/**
 * NFT attribute interface
 */
export interface NFTAttribute {
  traitType: string;
  value: string | number;
  displayType?: 'number' | 'boost_number' | 'boost_percentage' | 'date';
  maxValue?: number;
}

/**
 * NFT collection interface
 */
export interface NFTCollection {
  address: string;
  name: string;
  symbol?: string;
  description?: string;
  imageUrl?: string;
  standard: NFTStandard;
  totalSupply?: number;
  floorPrice?: string;
  chain: string;
}

/**
 * NFT token interface
 */
export interface NFTToken {
  contractAddress: string;
  tokenId: string;
  standard: NFTStandard;
  owner: string;
  metadata?: NFTMetadata;
  collection?: NFTCollection;
  balance?: number; // For ERC-1155
  chainId: number;
}

/**
 * NFT display data for SecuX Nifty
 */
export interface NFTDisplayData {
  tokenId: string;
  contractAddress: string;
  imageUrl?: string;
  name?: string;
  collection?: string;
  displayFormat: 'image' | 'animation' | 'icon';
  width: number;
  height: number;
}

/**
 * Supported NFT standards per chain
 */
export const SUPPORTED_NFT_STANDARDS: Record<string, NFTStandard[]> = {
  ethereum: [NFTStandard.ERC721, NFTStandard.ERC1155],
  polygon: [NFTStandard.ERC721, NFTStandard.ERC1155],
  bnb: [NFTStandard.ERC721, NFTStandard.ERC1155],
  avalanche: [NFTStandard.ERC721, NFTStandard.ERC1155],
  arbitrum: [NFTStandard.ERC721, NFTStandard.ERC1155],
  optimism: [NFTStandard.ERC721, NFTStandard.ERC1155],
  base: [NFTStandard.ERC721, NFTStandard.ERC1155],
  solana: [NFTStandard.SPL],
  tron: [NFTStandard.TRC721],
};

/**
 * Validate NFT contract address
 */
export function validateNFTContract(address: string, chain: string): boolean {
  // EVM chains use standard Ethereum address format
  const evmChains = [
    'ethereum',
    'polygon',
    'bnb',
    'avalanche',
    'arbitrum',
    'optimism',
    'base',
  ];

  if (evmChains.includes(chain)) {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  if (chain === 'solana') {
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
  }

  if (chain === 'tron') {
    return /^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(address);
  }

  return false;
}

/**
 * Validate token ID
 */
export function validateTokenId(tokenId: string): boolean {
  // Token IDs can be numeric strings or hex strings
  if (/^\d+$/.test(tokenId)) {
    return true;
  }
  if (/^0x[a-fA-F0-9]+$/.test(tokenId)) {
    return true;
  }
  return false;
}

/**
 * Parse token URI to get metadata URL
 */
export function parseTokenUri(uri: string): string {
  // Handle IPFS URIs
  if (uri.startsWith('ipfs://')) {
    return `https://ipfs.io/ipfs/${uri.slice(7)}`;
  }

  // Handle Arweave URIs
  if (uri.startsWith('ar://')) {
    return `https://arweave.net/${uri.slice(5)}`;
  }

  // Handle data URIs (return as-is)
  if (uri.startsWith('data:')) {
    return uri;
  }

  return uri;
}

/**
 * Parse NFT metadata from JSON
 */
export function parseNFTMetadata(json: unknown): NFTMetadata | null {
  if (!json || typeof json !== 'object') {
    return null;
  }

  const data = json as Record<string, unknown>;

  const metadata: NFTMetadata = {
    name: String(data.name || 'Unknown'),
    description: data.description ? String(data.description) : undefined,
    image: data.image ? parseTokenUri(String(data.image)) : undefined,
    animationUrl: data.animation_url
      ? parseTokenUri(String(data.animation_url))
      : undefined,
    externalUrl: data.external_url ? String(data.external_url) : undefined,
    backgroundColor: data.background_color
      ? String(data.background_color)
      : undefined,
  };

  // Parse attributes
  if (Array.isArray(data.attributes)) {
    metadata.attributes = data.attributes
      .filter(
        (attr): attr is Record<string, unknown> =>
          attr && typeof attr === 'object',
      )
      .map((attr) => ({
        traitType: String(attr.trait_type || attr.traitType || ''),
        value: attr.value as string | number,
        displayType: attr.display_type as NFTAttribute['displayType'],
        maxValue: typeof attr.max_value === 'number' ? attr.max_value : undefined,
      }));
  }

  return metadata;
}

/**
 * Encode ERC721 safeTransferFrom data
 */
export function encodeERC721SafeTransfer(
  from: string,
  to: string,
  tokenId: string,
): string {
  // safeTransferFrom(address,address,uint256) selector: 0x42842e0e
  const selector = '42842e0e';
  const paddedFrom = from.slice(2).padStart(64, '0');
  const paddedTo = to.slice(2).padStart(64, '0');
  const paddedTokenId = BigInt(tokenId).toString(16).padStart(64, '0');
  return `0x${selector}${paddedFrom}${paddedTo}${paddedTokenId}`;
}

/**
 * Encode ERC1155 safeTransferFrom data
 */
export function encodeERC1155SafeTransfer(
  from: string,
  to: string,
  tokenId: string,
  amount: number,
  _data = '0x',
): string {
  // safeTransferFrom(address,address,uint256,uint256,bytes) selector: 0xf242432a
  const selector = 'f242432a';
  const paddedFrom = from.slice(2).padStart(64, '0');
  const paddedTo = to.slice(2).padStart(64, '0');
  const paddedTokenId = BigInt(tokenId).toString(16).padStart(64, '0');
  const paddedAmount = BigInt(amount).toString(16).padStart(64, '0');
  // Simplified: assuming empty data
  const dataOffset = '00000000000000000000000000000000000000000000000000000000000000a0';
  const dataLength = '0000000000000000000000000000000000000000000000000000000000000000';
  return `0x${selector}${paddedFrom}${paddedTo}${paddedTokenId}${paddedAmount}${dataOffset}${dataLength}`;
}

/**
 * Encode setApprovalForAll data
 */
export function encodeSetApprovalForAll(
  operator: string,
  approved: boolean,
): string {
  // setApprovalForAll(address,bool) selector: 0xa22cb465
  const selector = 'a22cb465';
  const paddedOperator = operator.slice(2).padStart(64, '0');
  const paddedApproved = approved ? '1'.padStart(64, '0') : '0'.padStart(64, '0');
  return `0x${selector}${paddedOperator}${paddedApproved}`;
}

/**
 * Format NFT for device display (SecuX Nifty)
 */
export function formatNFTForDisplay(
  nft: NFTToken,
  maxWidth = 240,
  maxHeight = 240,
): NFTDisplayData {
  let displayFormat: NFTDisplayData['displayFormat'] = 'icon';

  if (nft.metadata?.animationUrl) {
    displayFormat = 'animation';
  } else if (nft.metadata?.image) {
    displayFormat = 'image';
  }

  return {
    tokenId: nft.tokenId,
    contractAddress: nft.contractAddress,
    imageUrl: nft.metadata?.image || nft.metadata?.animationUrl,
    name: nft.metadata?.name,
    collection: nft.collection?.name,
    displayFormat,
    width: maxWidth,
    height: maxHeight,
  };
}

/**
 * Get NFT standard display name
 */
export function getNFTStandardName(standard: NFTStandard): string {
  switch (standard) {
    case NFTStandard.ERC721:
      return 'ERC-721 (Single Edition)';
    case NFTStandard.ERC1155:
      return 'ERC-1155 (Multi Edition)';
    case NFTStandard.SPL:
      return 'SPL Token (Solana)';
    case NFTStandard.TRC721:
      return 'TRC-721 (Tron)';
    default:
      return 'Unknown Standard';
  }
}

/**
 * NFT standard options for n8n UI
 */
export const NFT_STANDARD_OPTIONS = [
  { name: 'ERC-721 (Single Edition)', value: NFTStandard.ERC721 },
  { name: 'ERC-1155 (Multi Edition)', value: NFTStandard.ERC1155 },
  { name: 'SPL Token (Solana)', value: NFTStandard.SPL },
  { name: 'TRC-721 (Tron)', value: NFTStandard.TRC721 },
];

/**
 * Supported chains for NFT operations
 */
export const NFT_SUPPORTED_CHAINS = [
  { name: 'Ethereum', value: 'ethereum' },
  { name: 'Polygon', value: 'polygon' },
  { name: 'BNB Chain', value: 'bnb' },
  { name: 'Avalanche', value: 'avalanche' },
  { name: 'Arbitrum', value: 'arbitrum' },
  { name: 'Optimism', value: 'optimism' },
  { name: 'Base', value: 'base' },
  { name: 'Solana', value: 'solana' },
];
