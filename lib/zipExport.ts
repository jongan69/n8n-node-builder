import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { NodeConfig } from '@/types';
import { generateNodeFile, generateCredentialsFile, generateNodeJson, generatePackageJson } from './codeGeneration';

export async function exportNodeAsZip(config: NodeConfig) {
  const zip = new JSZip();
  
  // Create folder structure
  const nodesFolder = zip.folder('nodes');
  const nodeFolder = nodesFolder?.folder(config.name);
  const credentialsFolder = zip.folder('credentials');
  
  // Generate and add files
  const nodeClass = `${config.name.charAt(0).toUpperCase()}${config.name.slice(1)}`;
  
  // Node files
  nodeFolder?.file(`${nodeClass}.node.ts`, generateNodeFile(config));
  nodeFolder?.file(`${nodeClass}.node.json`, generateNodeJson(config));
  
  // Credentials file (if authentication is configured)
  if (config.authentication.type !== 'none') {
    credentialsFolder?.file(`${nodeClass}Api.credentials.ts`, generateCredentialsFile(config));
  }
  
  // Package.json
  zip.file('package.json', generatePackageJson(config));
  
  // README.md
  zip.file('README.md', generateReadme(config));
  
  // tsconfig.json
  zip.file('tsconfig.json', JSON.stringify({
    extends: 'n8n-workflow/tsconfig.json',
    compilerOptions: {
      outDir: 'dist',
    },
    include: ['nodes/**/*', 'credentials/**/*'],
  }, null, 2));
  
  // gulpfile.js
  zip.file('gulpfile.js', `const { task, src, dest } = require('gulp');

task('build:icons', () => {
  return src('nodes/**/*.svg').pipe(dest('dist/nodes'));
});`);
  
  // Generate and download zip
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  saveAs(zipBlob, `n8n-nodes-${config.name.toLowerCase()}.zip`);
}

function generateReadme(config: NodeConfig): string {
  return `# n8n-nodes-${config.name.toLowerCase()}

${config.description}

## Installation

To install this n8n community node:

1. Go to **Settings** > **Community Nodes** in your n8n instance
2. Click **Install** and enter: \`n8n-nodes-${config.name.toLowerCase()}\`

For manual installation:

\`\`\`bash
npm install n8n-nodes-${config.name.toLowerCase()}
\`\`\`

## Development

\`\`\`bash
git clone ${config.metadata.repository}
cd n8n-nodes-${config.name.toLowerCase()}
npm install
npm run build
\`\`\`

## Usage

This node provides the following operations:

${config.resources.map(resource => `
### ${resource.name}
${resource.description}

**Operations:**
${resource.operations.map(op => `- **${op.name}**: ${op.description}`).join('\n')}
`).join('\n')}

## Credentials

${config.authentication.type === 'none' 
  ? 'No authentication required.' 
  : `This node requires ${config.authentication.type} authentication.`}

## License

${config.metadata.license}

## Author

${config.metadata.author}
`;
}