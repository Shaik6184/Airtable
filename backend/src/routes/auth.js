import express from 'express';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { User } from '../schema/User.js';

export const authRouter = express.Router();

const AIRTABLE_WHOAMI_URL = 'https://api.airtable.com/v0/meta/whoami';

// Test route
authRouter.get('/test', (req, res) => {
  res.json({ message: 'Auth router working' });
});

// Simple login with Personal Access Token
authRouter.post('/login', async (req, res) => {
  console.log('=== LOGIN ATTEMPT ===');
  console.log('Request body:', req.body);
  console.log('Personal Access Token:', req.body.personalAccessToken);
  
  try {
    const { personalAccessToken } = req.body;
    
    if (!personalAccessToken) {
      console.log('No token provided');
      return res.status(400).json({ error: 'Personal Access Token is required' });
    }

    console.log('Token received, calling Airtable API...');
    console.log('Token length:', personalAccessToken.length);
    console.log('Token trimmed length:', personalAccessToken.trim().length);
    console.log('Authorization header:', `Bearer ${personalAccessToken.trim()}`);
    
    // Verify the token by calling Airtable API
    const who = await axios.get(AIRTABLE_WHOAMI_URL, {
      headers: { Authorization: `Bearer ${personalAccessToken.trim()}` },
    });

    console.log('Airtable API response:', who.data);

    const profile = who.data || {};
    
    if (!profile?.id) {
      console.log('No user ID in profile');
      return res.status(401).json({ error: 'Invalid Personal Access Token' });
    }

    console.log('User profile found:', profile);

    try {
      // Try to find or create user in MongoDB
      let user = await User.findOne({ airtableUserId: profile.id });
      if (!user) {
        user = await User.create({
          airtableUserId: profile.id,
          email: profile.email || 'no-email@example.com',
          name: profile.name || 'Airtable User',
          accessToken: personalAccessToken,
          tokenType: 'personal_access_token',
        });
        console.log('New user created:', user._id);
      } else {
        user.accessToken = personalAccessToken;
        user.tokenType = 'personal_access_token';
        await user.save();
        console.log('Existing user updated:', user._id);
      }

      // Generate JWT token
      const appToken = jwt.sign({ uid: user._id.toString() }, process.env.JWT_SECRET || 'dev', {
        expiresIn: '7d',
      });

      res.cookie("app_token", appToken, { httpOnly: true, sameSite: "lax", secure: false });
      res.json({ 
        success: true, 
        user: { 
          id: user._id, 
          name: user.name, 
          email: user.email 
        } 
      });
    } catch (dbError) {
      console.log('Database error, creating mock user response:', dbError.message);
      
      // If database fails, create a mock response for testing
      const mockUserId = `mock_${profile.id}`;
      const appToken = jwt.sign({ uid: mockUserId }, process.env.JWT_SECRET || 'dev', {
        expiresIn: '7d',
      });

      res.cookie("app_token", appToken, { httpOnly: true, sameSite: "lax", secure: false });
      res.json({ 
        success: true, 
        user: { 
          id: mockUserId, 
          name: profile.name || 'Airtable User', 
          email: profile.email || 'no-email@example.com'
        },
        message: 'Mock user created (database unavailable)'
      });
    }
  } catch (e) {
    console.error('=== LOGIN ERROR ===');
    console.error('Error type:', e.constructor.name);
    console.error('Error message:', e.message);
    if (e.response) {
      console.error('Response status:', e.response.status);
      console.error('Response data:', e.response.data);
    }
    console.error('Full error:', e);
    res.status(401).json({ error: 'Invalid Personal Access Token' });
  }
});

// Keep OAuth for reference but mark as deprecated
authRouter.get('/airtable/login', (req, res) => {
  res.status(400).json({ 
    error: 'OAuth deprecated. Use Personal Access Token instead.',
    message: 'Send POST to /api/auth/login with { "personalAccessToken": "your_token" }'
  });
});

authRouter.get('/airtable/callback', (req, res) => {
  res.status(400).json({ 
    error: 'OAuth deprecated. Use Personal Access Token instead.',
    message: 'Send POST to /api/auth/login with { "personalAccessToken": "your_token" }'
  });
});

authRouter.post('/logout', (_req, res) => {
  res.clearCookie('app_token');
  res.json({ ok: true });
});

// Get current user info
authRouter.get('/me', async (req, res) => {
  try {
    const token = req.cookies.app_token;
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev');
    const user = await User.findById(decoded.uid);
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    res.json({ 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email 
      } 
    });
  } catch (error) {
    console.error('Auth check error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});
