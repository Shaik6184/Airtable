# 🚀 Airtable Form Builder

A powerful web application that allows users to create custom forms that submit data directly to Airtable bases. Built with Node.js, Express, React, and MongoDB.

## ✨ Features

- **OAuth Authentication** with Airtable
- **Dynamic Form Builder** - Create forms by mapping Airtable fields
- **Real-time Preview** - See your form as you build it
- **Conditional Logic** - Show/hide questions based on previous answers
- **File Uploads** - Support for multiple file attachments via Cloudinary
- **Responsive Design** - Works on desktop and mobile devices
- **Direct Airtable Integration** - Data flows directly to your Airtable bases

## 🏗️ Architecture

- **Backend**: Node.js + Express + MongoDB
- **Frontend**: React + Vite
- **Authentication**: JWT + Airtable OAuth
- **File Storage**: Cloudinary
- **Database**: MongoDB with Mongoose

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- MongoDB instance (local or cloud)
- Airtable account with API access
- Cloudinary account (for file uploads)

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd Air

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Configuration

#### Backend (.env)
```bash
cd backend
cp env.example .env
```

Edit `.env` with your configuration:
```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/air_forms

# JWT Secret for authentication
JWT_SECRET=your-super-secret-jwt-key-here

# Airtable OAuth Configuration
AIRTABLE_CLIENT_ID=your_airtable_client_id
AIRTABLE_CLIENT_SECRET=your_airtable_client_secret
AIRTABLE_REDIRECT_URI=http://localhost:4000/api/auth/airtable/callback

# Cloudinary Configuration (for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server Configuration
PORT=4000
CLIENT_ORIGIN=http://localhost:5173
```

#### Frontend (.env)
```bash
cd frontend
cp env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:4000
```

### 3. Airtable OAuth Setup

1. Go to [Airtable Developers](https://airtable.com/developers)
2. Create a new app
3. Set the redirect URI to: `http://localhost:4000/api/auth/airtable/callback`
4. Copy your Client ID and Client Secret to your `.env` file

### 4. Cloudinary Setup

1. Create a [Cloudinary account](https://cloudinary.com/)
2. Get your Cloud Name, API Key, and API Secret
3. Add them to your backend `.env` file

### 5. Start the Application

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

### 6. Access the Application

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:4000

## 📖 Usage

### 1. Authentication
- Click "Login with Airtable" on the homepage
- Authorize the application to access your Airtable account
- You'll be redirected to the dashboard

### 2. Creating Forms
- Click "Create New Form" from the dashboard
- Select your Airtable base and table
- Choose which fields to include in your form
- Customize question labels and requirements
- Add conditional logic if needed
- Save your form

### 3. Sharing Forms
- Copy the form URL from your dashboard
- Share with others - they can submit responses without logging in
- Responses are automatically saved to your Airtable base

## 🔧 API Endpoints

### Authentication
- `GET /api/auth/airtable/login` - Initiate Airtable OAuth
- `GET /api/auth/airtable/callback` - OAuth callback handler
- `POST /api/auth/logout` - Logout user

### Airtable Integration
- `GET /api/airtable/bases` - Get user's Airtable bases
- `GET /api/airtable/bases/:baseId/tables` - Get tables in a base

### Forms
- `POST /api/forms` - Create a new form
- `GET /api/forms` - Get user's forms
- `GET /api/forms/:id` - Get a specific form
- `POST /api/forms/:id/submit` - Submit form responses

### File Uploads
- `POST /api/upload/attachments` - Upload files to Cloudinary

## 🛠️ Development

### Project Structure
```
Air/
├── backend/                 # Express.js server
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   ├── schema/         # MongoDB schemas
│   │   ├── util/           # Utility functions
│   │   └── index.js        # Server entry point
│   └── package.json
├── frontend/                # React application
│   ├── src/
│   │   ├── pages/          # Page components
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # App entry point
│   └── package.json
└── README.md
```

### Available Scripts

#### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

#### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Build and deploy to your preferred hosting service
3. Ensure MongoDB connection is accessible
4. Update CORS origins for production domain

### Frontend Deployment
1. Update `VITE_API_URL` to point to your production backend
2. Build the application: `npm run build`
3. Deploy the `dist` folder to your hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check the environment configuration
2. Verify Airtable OAuth settings
3. Check MongoDB connection
4. Review server logs for errors

## 🔮 Roadmap

- [ ] Form templates and themes
- [ ] Advanced conditional logic
- [ ] Form analytics and insights
- [ ] Multi-language support
- [ ] Email notifications
- [ ] Form validation rules
- [ ] API rate limiting
- [ ] User management dashboard
