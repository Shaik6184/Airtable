import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import { authRouter } from './routes/auth.js';
import { airtableRouter } from './routes/airtable.js';
import { formsRouter } from './routes/forms.js';
import { uploadRouter } from './routes/upload.js';

dotenv.config();

const app = express();
app.use(cors({ origin: [process.env.CLIENT_ORIGIN || 'http://127.0.0.1:3001', 'http://localhost:3001', 'http://localhost:3000', 'http://127.0.0.1:3000', 'http://127.0.0.1:5173', 'http://localhost:5173', 'https://airtableforms.vercel.app'], credentials: true }));
app.use(express.json({ limit: '5mb' }));
app.use(cookieParser());

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api/auth', authRouter);
app.use('/api/airtable', airtableRouter);
app.use('/api/forms', formsRouter);
app.use('/api/upload', uploadRouter);

const requiredEnv = ['MONGODB_URI', 'JWT_SECRET'];
for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.warn(`Missing env ${key}`);
  }
}

const PORT = process.env.PORT || 4000;

// MongoDB connection with serverless optimization
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  try {
    // Use MongoDB Atlas connection string with correct password
    const mongoUri = 'mongodb+srv://shaiksajid:Shaik%406184@cluster0.2y6fb7l.mongodb.net/air_forms?retryWrites=true&w=majority&appName=Cluster0';
    
    const connection = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    cachedDb = connection;
    console.log('✅ MongoDB Atlas connected successfully');
    return connection;
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    console.log('⚠️  Starting server without database connection...');
    return null;
  }
}

async function start() {
  try {
    // Connect to MongoDB
    await connectToDatabase();
  } catch (err) {
    console.error('❌ Database connection failed:', err);
  }
  
  // For Vercel, we don't need to listen on a port
  if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`✅ Backend listening on http://localhost:${PORT}`));
  }
}

start().catch((err) => {
  console.error('❌ Server startup failed:', err);
});

// Export for Vercel
export default app;
