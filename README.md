---
contentType: tutorial
---

# n8n Node Builder

A visual builder for creating custom n8n nodes with a declarative approach. This application provides an intuitive interface to generate production-ready n8n node packages with TypeScript, credentials, and proper structure.

## Overview

The n8n Node Builder is a web-based tool that simplifies the process of creating custom n8n nodes. Instead of manually writing TypeScript code, you can use a visual interface to define your node's resources, operations, authentication, and metadata. The builder then generates all the necessary files for a complete n8n node package.

## Features

- **Visual Node Builder**: Intuitive step-by-step wizard for creating n8n nodes
- **Declarative Approach**: Define resources, operations, and fields without writing code
- **Real-time Code Preview**: See generated TypeScript code as you build
- **Authentication Support**: Configure API key, OAuth2, or no authentication
- **Export Functionality**: Download complete node packages as ZIP files
- **Modern UI**: Beautiful, responsive interface with dark/light theme support
- **TypeScript Generation**: Automatically generates properly typed n8n node files

## Prerequisites

You need the following installed on your development machine:

- Node.js (version 18.0.0 or higher)
- npm (version 9.0.0 or higher) or bun
- Git

You need some understanding of:

- JavaScript/TypeScript
- REST APIs
- n8n workflow automation
- Git

## Quick Start

### Step 1: Clone the repository

```bash
git clone https://github.com/jongan69/n8n-node-builder.git
cd n8n-node-builder
```

### Step 2: Install dependencies

Using npm:
```bash
npm install
```

Or using bun:
```bash
bun install
```

### Step 3: Start the development server

```bash
npm run dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Building Your Node

The n8n Node Builder guides you through a 6-step process to create your custom node:

### Step 1: Node Details

Define the basic information about your node:
- **Display Name**: The name shown in the n8n editor
- **Node Name**: The internal identifier (camelCase)
- **Description**: What your node does
- **Version**: Node version number
- **Icon**: SVG icon file name

### Step 2: Resources

Define the API resources your node will interact with:
- **Resource Name**: Human-readable name
- **Resource Value**: Internal identifier
- **Description**: What this resource represents

For example, if you're building a node for a CRM API, you might have resources like:
- "Contacts" (contacts)
- "Deals" (deals)
- "Companies" (companies)

### Step 3: Operations

For each resource, define the available operations:
- **Operation Name**: Human-readable name
- **Operation Value**: Internal identifier
- **Description**: What this operation does
- **HTTP Method**: GET, POST, PUT, DELETE, PATCH
- **URL**: API endpoint path
- **Query Parameters**: URL parameters
- **Headers**: Request headers
- **Body**: Request body (for POST/PUT/PATCH)

### Step 4: Authentication

Configure how your node authenticates with the API:
- **No Authentication**: For public APIs
- **API Key**: Simple API key authentication
- **OAuth2**: OAuth2 flow authentication

### Step 5: Additional Fields

Define optional fields that users can configure:
- **Field Name**: Display name
- **Field Type**: string, number, boolean, dateTime, options, collection
- **Required**: Whether the field is mandatory
- **Description**: Field description
- **Options**: For option fields, define available choices

### Step 6: Metadata

Set package metadata:
- **Author**: Your name or organization
- **License**: MIT, Apache, etc.
- **Repository**: Git repository URL
- **Keywords**: npm package keywords

## Generated Files

The builder generates the following files for your n8n node:

### Node File (`YourNode.node.ts`)
The main TypeScript file containing your node's implementation with:
- Resource and operation definitions
- Request routing configuration
- Field definitions
- Execute method implementation

### Credentials File (`YourNodeApi.credentials.ts`)
Authentication configuration with:
- Credential type definition
- Authentication properties
- Test request configuration

### Node Configuration (`YourNode.node.json`)
Metadata about your node including:
- Node version
- Categories
- Documentation links

### Package Configuration (`package.json`)
Complete npm package configuration with:
- Dependencies
- Build scripts
- n8n-specific configuration

## Example: NASA API Node

Let's walk through creating a node for the NASA API as an example:

### Step 1: Node Details
- Display Name: "NASA Pics"
- Node Name: "nasaPics"
- Description: "Get data from NASA's API"
- Version: "1.0.0"
- Icon: "nasapics.svg"

### Step 2: Resources
Add two resources:
1. **Astronomy Picture of the Day** (astronomyPictureOfTheDay)
2. **Mars Rover Photos** (marsRoverPhotos)

### Step 3: Operations
For "Astronomy Picture of the Day":
- Operation: "Get" (get)
- Method: GET
- URL: "/planetary/apod"

For "Mars Rover Photos":
- Operation: "Get" (get)
- Method: GET
- URL: "/mars-photos/api/v1/rovers/{rover}/photos"
- Add field: "Rover Name" (roverName) - options type with Curiosity, Opportunity, etc.
- Add field: "Date" (marsRoverDate) - dateTime type

### Step 4: Authentication
- Type: API Key
- Field: "API Key" (apiKey) - string type

### Step 5: Additional Fields
For APOD operation:
- Field: "Date" (apodDate) - dateTime type, optional

### Step 6: Metadata
- Author: "Your Name"
- License: "MIT"
- Repository: "https://github.com/your-org/n8n-nodes-nasapics"
- Keywords: ["nasa", "space", "astronomy"]

## Development

### Project Structure

```
n8n-node-builder/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── steps/            # Wizard step components
│   ├── ui/               # UI components (shadcn/ui)
│   └── ...               # Other components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── types/                # TypeScript type definitions
└── ...                   # Configuration files
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run test` - Run tests
- `npm run test:coverage` - Run tests with coverage

### Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI)
- **Forms**: React Hook Form with Zod validation
- **Code Editor**: Monaco Editor
- **File Export**: JSZip for ZIP file generation

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- **Netlify**: Use the Next.js build command
- **Railway**: Connect your GitHub repository
- **Docker**: Use the provided Dockerfile

### Environment Variables

No environment variables are required for basic functionality. The application works entirely in the browser.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write tests for new features
- Update documentation for API changes

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Documentation**: [n8n Node Builder Docs](https://docs.n8n.io)
- **Issues**: [GitHub Issues](https://github.com/your-org/n8n-node-builder/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/n8n-node-builder/discussions)

## Related Links

- [n8n Documentation](https://docs.n8n.io)
- [n8n Community](https://community.n8n.io)
- [n8n GitHub](https://github.com/n8n-io/n8n)
- [Creating Custom Nodes](https://docs.n8n.io/integrations/creating-nodes/)

## Acknowledgments

- Built with [n8n](https://n8n.io) - The workflow automation platform
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)
# n8n-node-builder
