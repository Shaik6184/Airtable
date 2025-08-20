# 🚀 Vercel Deployment Guide for Air Form Builder

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Vercel CLI**: Install globally with `npm install -g vercel`
3. **GitHub Account**: Your project should be in a GitHub repository

## 🔧 Pre-Deployment Setup

### 1. Environment Variables

Create these environment variables in your Vercel dashboard:

**Backend Environment Variables:**
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/air_forms
JWT_SECRET=your-super-secure-jwt-secret-key
AIRTABLE_CLIENT_ID=your_airtable_client_id
AIRTABLE_CLIENT_SECRET=your_airtable_client_secret
AIRTABLE_REDIRECT_URI=https://your-project.vercel.app/api/auth/airtable/callback
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_ORIGIN=https://your-project.vercel.app
```

**Frontend Environment Variables:**
```bash
VITE_API_URL=https://your-project.vercel.app/api
```

### 2. Database Setup

- **MongoDB Atlas**: Create a free cluster and get connection string
- **Local MongoDB**: Not recommended for production

## 🚀 Deployment Steps

### **Option 1: Using Deployment Script (Recommended)**

```bash
# Make script executable (if not already done)
chmod +x deploy-vercel.sh

# Run deployment
./deploy-vercel.sh
```

### **Option 2: Manual Deployment**

#### **Step 1: Build Frontend**
```bash
cd frontend
npm run build
cd ..
```

#### **Step 2: Deploy to Vercel**
```bash
# Login to Vercel (first time only)
vercel login

# Deploy
vercel --prod
```

#### **Step 3: Configure Environment Variables**
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to Settings → Environment Variables
4. Add all required environment variables

## 🌐 Project Structure on Vercel

```
your-project.vercel.app/
├── /                    → Frontend (React app)
├── /api/*              → Backend (Node.js API)
├── /api/auth/*         → Authentication endpoints
├── /api/forms/*        → Form management
├── /api/upload/*       → File uploads
└── /api/airtable/*     → Airtable integration
```

## 🔧 Configuration Files

### **Root vercel.json**
Routes API calls to backend and serves frontend

### **Frontend vercel.json**
Handles React routing and SPA behavior

### **Backend vercel.json**
Configures Node.js serverless functions

## 📱 Testing Your Deployment

1. **Frontend**: Visit your Vercel URL
2. **Backend Health Check**: `https://your-project.vercel.app/api/health`
3. **API Endpoints**: Test all `/api/*` routes

## 🚨 Common Issues & Solutions

### **Issue: API routes not working**
- Check environment variables are set correctly
- Verify CORS configuration allows your domain
- Check Vercel function logs

### **Issue: Frontend routing problems**
- Ensure `vercel.json` has proper rewrites
- Check if `base` path is correct in Vite config

### **Issue: Database connection failed**
- Verify MongoDB Atlas connection string
- Check network access settings
- Ensure IP whitelist includes Vercel

## 🔒 Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **JWT Secret**: Use strong, unique secrets
3. **CORS**: Restrict to your Vercel domain
4. **HTTPS**: Vercel provides this automatically

## 📊 Monitoring & Analytics

1. **Vercel Analytics**: Built-in performance monitoring
2. **Function Logs**: Check API performance
3. **Error Tracking**: Monitor for issues

## 🎯 Post-Deployment Checklist

- [ ] All API endpoints responding
- [ ] Frontend routing working
- [ ] Authentication flows functional
- [ ] File uploads working
- [ ] Database connections stable
- [ ] Environment variables configured
- [ ] Custom domain set (optional)

## 🔄 Updating Your Deployment

```bash
# Make changes to your code
git add .
git commit -m "Update message"
git push

# Vercel will auto-deploy on push to main branch
# Or manually deploy:
vercel --prod
```

## 💰 Vercel Pricing

- **Hobby Plan**: Free (perfect for personal projects)
- **Pro Plan**: $20/month (for teams and advanced features)
- **Enterprise**: Custom pricing

## 🆘 Getting Help

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Vercel Support**: Available in dashboard
- **Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)

---

**🎉 Congratulations!** Your Air Form Builder is now deployed on Vercel!
