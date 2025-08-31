export interface NodeField {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'dateTime' | 'options' | 'collection';
  required: boolean;
  description: string;
  options?: Array<{ name: string; value: string }>;
  default?: any;
}

export interface Operation {
  id: string;
  name: string;
  value: string;
  description: string;
  action: string;
  routing: {
    request: {
      method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
      url: string;
      qs?: Record<string, string>;
      headers?: Record<string, string>;
      body?: Record<string, any>;
    };
  };
  fields: NodeField[];
}

export interface Resource {
  id: string;
  name: string;
  value: string;
  description: string;
  operations: Operation[];
}

export interface AuthConfig {
  type: 'none' | 'apiKey' | 'oauth2';
  fields: NodeField[];
}

export interface NodeConfig {
  name: string;
  displayName: string;
  description: string;
  version: string;
  icon: string;
  resources: Resource[];
  authentication: AuthConfig;
  additionalFields: NodeField[];
  metadata: {
    author: string;
    license: string;
    repository: string;
    keywords: string[];
  };
}

export type WizardStep = 'details' | 'resources' | 'operations' | 'auth' | 'fields' | 'metadata';