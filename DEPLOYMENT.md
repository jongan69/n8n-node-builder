# Deployment Guide

This guide covers different ways to deploy the n8n Node Builder application.

## Quick Deploy Options

### Vercel (Recommended)

1. **Fork/Clone the repository**
2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect it's a Next.js project

3. **Deploy**:
   - Vercel will automatically build and deploy your application
   - Your app will be available at `https://your-project.vercel.app`

### Netlify

1. **Build Command**: `npm run build`
2. **Publish Directory**: `.next`
3. **Environment Variables**: None required

### Railway

1. **Connect your GitHub repository**
2. **Railway will automatically detect the Next.js project**
3. **Deploy automatically on every push**

## Docker Deployment

### Local Docker

```bash
# Build the image
docker build -t n8n-node-builder .

# Run the container
docker run -p 3000:3000 n8n-node-builder
```

### Docker Compose

```bash
# Start the application
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down
```

### Production Docker

```bash
# Build for production
docker build -t n8n-node-builder:latest .

# Run with environment variables
docker run -d \
  --name n8n-node-builder \
  -p 3000:3000 \
  -e NODE_ENV=production \
  n8n-node-builder:latest
```

## Environment Variables

The application works without any environment variables, but you can configure:

- `NODE_ENV`: Set to `production` for production builds
- `NEXT_TELEMETRY_DISABLED`: Set to `1` to disable Next.js telemetry

## Health Check

The application includes a health check endpoint at `/api/health` that returns:

```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0",
  "environment": "production"
}
```

## Performance Optimization

### Build Optimization

The application is already optimized with:

- **Standalone Output**: For Docker deployments
- **Static Generation**: Where possible
- **Code Splitting**: Automatic with Next.js
- **Image Optimization**: Disabled for static export compatibility

### Caching

For production deployments, consider:

- **CDN**: Use a CDN for static assets
- **Caching Headers**: Already configured in `next.config.js`
- **Database**: Not required (stateless application)

## Monitoring

### Health Checks

Use the `/api/health` endpoint for:

- Load balancer health checks
- Container orchestration health checks
- Monitoring system checks

### Logs

The application logs to stdout/stderr for container environments.

### Metrics

Consider adding monitoring for:

- Response times
- Error rates
- Memory usage
- CPU usage

## Security

The application includes security headers:

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: origin-when-cross-origin`

## Troubleshooting

### Build Issues

1. **Node Version**: Ensure you're using Node.js 18+ or 20+
2. **Dependencies**: Run `npm install` to ensure all dependencies are installed
3. **TypeScript Errors**: Run `npm run type-check` to identify issues

### Runtime Issues

1. **Port Conflicts**: Ensure port 3000 is available
2. **Memory Issues**: The application is lightweight, but monitor memory usage
3. **Network Issues**: Check firewall settings for Docker deployments

### Common Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run tests
npm test

# Type checking
npm run type-check

# Linting
npm run lint
```
