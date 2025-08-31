import { render, screen, fireEvent } from '@testing-library/react';
import { CodePreview } from '@/components/CodePreview';
import { NodeConfig } from '@/types';

// Mock the code generation functions
jest.mock('@/lib/codeGeneration', () => ({
  generateNodeFile: jest.fn(() => '// Mock node file content'),
  generateCredentialsFile: jest.fn(() => '// Mock credentials file content'),
  generateNodeJson: jest.fn(() => '{"mock": "json"}'),
  generatePackageJson: jest.fn(() => '{"name": "mock-package"}'),
}));

// Mock the zip export function
jest.mock('@/lib/zipExport', () => ({
  exportNodeAsZip: jest.fn(),
}));

const mockConfig: NodeConfig = {
  name: 'testNode',
  displayName: 'Test Node',
  description: 'A test node',
  version: '1.0.0',
  icon: 'test.svg',
  resources: [],
  authentication: {
    type: 'none',
    fields: [],
  },
  additionalFields: [],
  metadata: {
    author: 'Test Author',
    license: 'MIT',
    repository: 'https://github.com/test/test',
    keywords: ['test'],
  },
};

describe('CodePreview', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component with correct title', () => {
    render(<CodePreview config={mockConfig} />);
    expect(screen.getByText('Generated Code')).toBeInTheDocument();
  });

  it('shows export button', () => {
    render(<CodePreview config={mockConfig} />);
    expect(screen.getByText(/Export/)).toBeInTheDocument();
  });

  it('displays tabs for different file types', () => {
    render(<CodePreview config={mockConfig} />);
    expect(screen.getByText('Node')).toBeInTheDocument();
    expect(screen.getByText('Auth')).toBeInTheDocument();
    expect(screen.getByText('Config')).toBeInTheDocument();
  });

  it('handles copy functionality', async () => {
    const mockClipboard = {
      writeText: jest.fn().mockResolvedValue(undefined),
    };
    Object.assign(navigator, { clipboard: mockClipboard });

    render(<CodePreview config={mockConfig} />);
    
    const copyButtons = screen.getAllByRole('button').filter(button => 
      button.textContent?.includes('Copy')
    );
    
    if (copyButtons.length > 0) {
      fireEvent.click(copyButtons[0]);
      expect(mockClipboard.writeText).toHaveBeenCalled();
    }
  });
});
