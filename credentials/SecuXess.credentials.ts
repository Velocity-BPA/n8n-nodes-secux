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
 * SecuXess Credentials
 *
 * Handles authentication for SecuXess web portfolio application integration.
 * SecuXess provides portfolio management, transaction history, and market data.
 */
export class SecuXess implements ICredentialType {
  name = 'secuXess';
  displayName = 'SecuXess';
  documentationUrl = 'https://github.com/Velocity-BPA/n8n-nodes-secux';

  properties: INodeProperties[] = [
    {
      displayName: 'SecuXess Endpoint',
      name: 'endpoint',
      type: 'string',
      default: 'https://secuxess.com/api',
      placeholder: 'https://secuxess.com/api',
      description: 'The SecuXess API endpoint URL',
    },
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      description: 'Your SecuXess API key (if applicable)',
    },
    {
      displayName: 'Session Token',
      name: 'sessionToken',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      description: 'Active session token for authenticated requests',
    },
    {
      displayName: 'Refresh Token',
      name: 'refreshToken',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      description: 'Token used to refresh expired session tokens',
    },
    {
      displayName: 'User ID',
      name: 'userId',
      type: 'string',
      default: '',
      description: 'Your SecuXess user identifier',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        Authorization: '=Bearer {{$credentials.sessionToken}}',
        'X-API-Key': '={{$credentials.apiKey}}',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: '={{$credentials.endpoint}}',
      url: '/v1/user/profile',
      method: 'GET',
    },
  };
}
