import { NodeConfig, Operation } from '@/types';

export function generateNodeFile(config: NodeConfig): string {
  const { name, displayName, description, version, resources } = config;
  
  const operations = resources.flatMap(resource => 
    resource.operations.map(op => ({
      ...op,
      resourceName: resource.value
    }))
  );

  const nodeClass = `${name.charAt(0).toUpperCase()}${name.slice(1)}`;

  return `import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeConnectionType,
  NodeOperationError,
} from 'n8n-workflow';

export class ${nodeClass} implements INodeType {
  description: INodeTypeDescription = {
    displayName: '${displayName}',
    name: '${name}',
    icon: 'file:${name}.svg',
    group: ['transform'],
    version: ${version},
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: '${description}',
    defaults: {
      name: '${displayName}',
    },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    credentials: [
      {
        name: '${name}Api',
        required: ${config.authentication.type !== 'none'},
      },
    ],
    requestDefaults: {
      baseURL: 'https://api.example.com',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
${resources.map(resource => `          {
            name: '${resource.name}',
            value: '${resource.value}',
            description: '${resource.description}',
          }`).join(',\n')}
        ],
        default: '${resources[0]?.value || ''}',
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['${resources[0]?.value || ''}'],
          },
        },
        options: [
${resources[0]?.operations.map(op => `          {
            name: '${op.name}',
            value: '${op.value}',
            description: '${op.description}',
            action: '${op.action}',
            routing: ${JSON.stringify(op.routing, null, 12)},
          }`).join(',\n') || ''}
        ],
        default: '${resources[0]?.operations[0]?.value || ''}',
      },
${generateFieldsForOperations(operations)}
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      try {
        const resource = this.getNodeParameter('resource', i) as string;
        const operation = this.getNodeParameter('operation', i) as string;

        let responseData;

        if (resource === '${resources[0]?.value || ''}') {
          if (operation === '${resources[0]?.operations[0]?.value || ''}') {
            responseData = await this.makeRoutingRequest({
              itemIndex: i,
              additionalKeys: {},
            });
          }
        }

        const executionData = this.helpers.constructExecutionMetaData(
          this.helpers.returnJsonArray(responseData as any),
          { itemData: { item: i } }
        );

        returnData.push(...executionData);
      } catch (error) {
        if (this.continueOnFail()) {
          const executionErrorData = this.helpers.constructExecutionMetaData(
            this.helpers.returnJsonArray({ error: error.message }),
            { itemData: { item: i } }
          );
          returnData.push(...executionErrorData);
        } else {
          throw error;
        }
      }
    }

    return [returnData];
  }
}`;
}

function generateFieldsForOperations(operations: Array<Operation & { resourceName: string }>): string {
  return operations.map(op => 
    (op.fields || []).map(field => `      {
        displayName: '${field.name}',
        name: '${field.name.toLowerCase().replace(/\s+/g, '_')}',
        type: '${field.type}',
        required: ${field.required},
        description: '${field.description}',
        displayOptions: {
          show: {
            resource: ['${op.resourceName}'],
            operation: ['${op.value}'],
          },
        },${field.type === 'options' && field.options ? `
        options: [
${field.options.map(opt => `          { name: '${opt.name}', value: '${opt.value}' }`).join(',\n')}
        ],` : ''}${field.default !== undefined ? `
        default: ${typeof field.default === 'string' ? `'${field.default}'` : field.default},` : ''}
      }`).join(',\n')
  ).join(',\n');
}

export function generateCredentialsFile(config: NodeConfig): string {
  const { name, authentication } = config;
  
  if (authentication.type === 'none') {
    return `// No credentials required for this node`;
  }

  const credentialClass = `${name.charAt(0).toUpperCase()}${name.slice(1)}Api`;

  return `import {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class ${credentialClass} implements ICredentialType {
  name = '${name}Api';
  displayName = '${config.displayName} API';
  documentationUrl = 'https://docs.example.com';
  properties: INodeProperties[] = [
${(authentication.fields || []).map(field => `    {
      displayName: '${field.name}',
      name: '${field.name.toLowerCase().replace(/\s+/g, '_')}',
      type: '${field.type}',
      description: '${field.description}',
      required: ${field.required},
    }`).join(',\n')}
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
${authentication.type === 'apiKey' ? `        Authorization: '=Bearer {{$credentials.api_key}}',` : ''}
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: 'https://api.example.com',
      url: '/test',
      method: 'GET',
    },
  };
}`;
}

export function generateNodeJson(config: NodeConfig): string {
  return JSON.stringify({
    nodes: [
      `dist/nodes/${config.name}/${config.name.charAt(0).toUpperCase()}${config.name.slice(1)}.node.js`
    ],
    credentials: config.authentication.type !== 'none' ? [
      `dist/credentials/${config.name.charAt(0).toUpperCase()}${config.name.slice(1)}Api.credentials.js`
    ] : undefined
  }, null, 2);
}

export function generatePackageJson(config: NodeConfig): string {
  const { name, description, version, metadata } = config;
  
  return JSON.stringify({
    name: `n8n-nodes-${name.toLowerCase()}`,
    version: version,
    description: description,
    keywords: ['n8n-community-node-package', ...(metadata.keywords || [])],
    license: metadata.license,
    homepage: metadata.repository,
    author: {
      name: metadata.author,
      email: 'example@example.com',
    },
    repository: {
      type: 'git',
      url: metadata.repository,
    },
    engines: {
      node: '>=18.10',
      pnpm: '>=9.1',
    },
    packageManager: 'pnpm@9.1.4',
    main: 'index.js',
    scripts: {
      build: 'tsc && gulp build:icons',
      dev: 'tsc --watch',
      format: 'prettier nodes credentials --write',
      lint: 'eslint nodes credentials package.json',
      'lint:fix': 'eslint nodes credentials package.json --fix',
      prepack: 'npm run build && npm run lint -c .eslintrc.prepack.js nodes credentials && npm run format',
    },
    files: ['dist'],
    n8n: JSON.parse(generateNodeJson(config)),
    devDependencies: {
      '@typescript-eslint/parser': '^7.15.0',
      eslint: '^8.56.0',
      'eslint-plugin-n8n-nodes-base': '^1.16.1',
      gulp: '^4.0.2',
      'n8n-workflow': '*',
      prettier: '^3.3.2',
      typescript: '^5.5.3',
    },
    peerDependencies: {
      'n8n-workflow': '*',
    },
  }, null, 2);
}