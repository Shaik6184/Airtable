#!/bin/bash

echo "🚀 Deploying Air Form Builder to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Build frontend
echo "🔨 Building frontend..."
cd frontend
npm run build
cd ..

# Deploy to Vercel
echo "📤 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "🌐 Your app is now live on Vercel!"
echo ""
echo "📝 Next steps:"
echo "1. Set environment variables in Vercel dashboard"
echo "2. Configure your custom domain (optional)"
echo "3. Test your deployed application"
