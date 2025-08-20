# Air - Airtable Forms Builder

A powerful form builder application that seamlessly integrates with Airtable, allowing you to create dynamic forms with conditional logic and real-time validation.

## 🚀 Live Demo

**Production URL:** [https://shaikformspro.vercel.app](https://shaikformspro.vercel.app)

## ✨ Features

### 🔗 Airtable Integration
- **Seamless Connection**: Connect to your existing Airtable bases and tables
- **Personal Access Token**: Secure authentication using Airtable PAT
- **Real-time Sync**: Forms automatically sync with your Airtable data

### 📝 Dynamic Forms
- **Intelligent Forms**: Create forms with conditional logic and real-time validation
- **Field Selection**: Choose which Airtable fields to include in your forms
- **Custom Validation**: Built-in validation rules for form submissions

### 🔒 Security & Reliability
- **Enterprise-grade Security**: OAuth 2.0 and encrypted data transmission
- **JWT Authentication**: Secure user sessions and API access
- **MongoDB Integration**: Robust data storage and management

### 👥 Team Collaboration
- **User Management**: Multiple user support with role-based access
- **Form Sharing**: Share forms across your team
- **Response Tracking**: Monitor form submissions and analytics

## 🖼️ Screenshots

### Dashboard
![Dashboard](screenshots/dashboard.png)
*Main dashboard showing form statistics and Airtable connection status*

### Form Builder
![Form Builder](screenshots/form-builder.png)
*Form creation interface with Airtable base and table selection*

### Login Interface
![Login](screenshots/login.png)
*Secure login with Airtable Personal Access Token*

### Airtable Integration
![Airtable](screenshots/airtable-integration.png)
*Seamless integration with Airtable bases and tables*

## 🛠️ Tech Stack

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Database**: MongoDB (MongoDB Atlas)
- **Authentication**: JWT + Airtable PAT
- **Deployment**: Vercel
- **File Upload**: Cloudinary
- **State Management**: Zustand

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB Atlas account
- Airtable account with Personal Access Token
- Vercel account (for deployment)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/Shaik6184/Airtable.git
cd Air
```

### 2. Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Environment Setup

#### Backend (.env)
```bash
cd ../backend
cp env.example .env
```

Edit `.env` with your configuration:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your_jwt_secret_here
CLOUDINARY_URL=your_cloudinary_url
CLIENT_ORIGIN=http://localhost:3000
```

#### Frontend (.env)
```bash
cd ../frontend
cp env.example .env
```

Edit `.env` with your configuration:
```env
VITE_API_URL=http://localhost:4000/api
```

### 4. Start Development Servers

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
```
Backend will run on: http://localhost:4000

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```
Frontend will run on: http://localhost:3000

### 5. Access the Application
Open your browser and navigate to: http://localhost:3000

## 🔐 Airtable Setup

### 1. Create Personal Access Token
1. Go to [Airtable.com](https://airtable.com)
2. Navigate to Account → Personal Access Tokens
3. Click "Create new token"
4. Give it a name (e.g., "Air Forms Builder")
5. Set permissions to "data.records:read" and "data.records:write"
6. Copy the generated token

### 2. Connect in the App
1. Open the application
2. Click "Connect with Airtable"
3. Paste your Personal Access Token
4. Click "Connect"

### 3. Select Base and Table
1. Choose your Airtable base from the dropdown
2. Select the table you want to create forms for
3. Choose which fields to include in your form

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**
```bash
git add .
git commit -m "Your commit message"
git push origin main
```

2. **Connect to Vercel**
- Go to [vercel.com](https://vercel.com)
- Click "New Project"
- Import your GitHub repository
- Choose a unique project name

3. **Environment Variables**
Set these in Vercel:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your_jwt_secret_here
NODE_ENV=production
CLIENT_ORIGIN=https://your-project-name.vercel.app
AIRTABLE_PAT=your_airtable_personal_access_token
```

4. **Deploy**
- Click "Deploy"
- Wait for build to complete
- Your app will be live at `https://your-project-name.vercel.app`

## 📱 Usage

### Creating Forms
1. **Login** with your Airtable Personal Access Token
2. **Click** "+ Create New Form" on the dashboard
3. **Enter** form details (name, description)
4. **Select** Airtable base and table
5. **Choose** fields to include
6. **Configure** conditional logic (if applicable)
7. **Save** and publish your form

### Managing Forms
- View all your forms on the dashboard
- Edit existing forms
- Monitor form responses
- Export data to Airtable

## 🔧 Configuration

### MongoDB Connection
The app uses MongoDB Atlas for production. Ensure your connection string includes:
- Username and password (URL-encoded)
- Cluster information
- Database name
- Connection options

### CORS Settings
CORS is configured to allow:
- Local development (localhost:3000, localhost:3001)
- Production domain (your-vercel-app.vercel.app)

### File Upload
Cloudinary integration for file uploads:
- Configure `CLOUDINARY_URL` in environment variables
- Supports image and document uploads
- Automatic optimization and CDN delivery

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check your connection string
   - Ensure network access is enabled in MongoDB Atlas
   - Verify username/password are correct

2. **Airtable Authentication Failed**
   - Verify your Personal Access Token is valid
   - Check token permissions
   - Ensure token hasn't expired

3. **Build Errors on Vercel**
   - Check environment variables are set correctly
   - Verify `vercel.json` configuration
   - Check build logs for specific errors

4. **CORS Issues**
   - Verify `CLIENT_ORIGIN` is set correctly
   - Check that your domain is included in CORS origins

### Getting Help
- Check the deployment logs in Vercel
- Review browser console for frontend errors
- Check backend logs for API errors
- Ensure all environment variables are set

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Airtable](https://airtable.com) for their powerful API
- [Vercel](https://vercel.com) for seamless deployment
- [MongoDB Atlas](https://mongodb.com/atlas) for database hosting
- [React](https://reactjs.org) and [Node.js](https://nodejs.org) communities

## 📞 Support

For support and questions:
- Create an issue in this repository
- Check the troubleshooting section above
- Review the deployment logs in Vercel

---

**Built with ❤️ by Shaik Sameer**
