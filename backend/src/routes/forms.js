import express from 'express';
import { requireAuth } from '../util/requireAuth.js';

export const formsRouter = express.Router();

// Get all forms (mock data for local testing)
formsRouter.get('/', requireAuth, async (req, res) => {
  try {
    // Return mock forms data for local testing
    const mockForms = [
      {
        id: '1',
        title: 'Sample Form 1',
        description: 'This is a sample form for testing',
        createdAt: new Date().toISOString(),
        responses: 5
      },
      {
        id: '2', 
        title: 'Sample Form 2',
        description: 'Another sample form for testing',
        createdAt: new Date().toISOString(),
        responses: 3
      }
    ];

    res.json({ 
      success: true, 
      forms: mockForms,
      message: 'Mock forms data (local testing)'
    });
  } catch (error) {
    console.error('Forms error:', error);
    res.status(500).json({ error: 'Failed to fetch forms' });
  }
});

// Create new form
formsRouter.post('/', requireAuth, async (req, res) => {
  try {
    const { title, description } = req.body;
    
    const newForm = {
      id: Date.now().toString(),
      title: title || 'Untitled Form',
      description: description || 'No description',
      createdAt: new Date().toISOString(),
      responses: 0
    };

    res.json({ 
      success: true, 
      form: newForm,
      message: 'Form created successfully'
    });
  } catch (error) {
    console.error('Create form error:', error);
    res.status(500).json({ error: 'Failed to create form' });
  }
});


