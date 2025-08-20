import express from 'express';
import axios from 'axios';
import { requireAuth } from '../util/requireAuth.js';
import { User } from '../schema/User.js';

export const airtableRouter = express.Router();

const META_BASES_URL = 'https://api.airtable.com/v0/meta/bases';

airtableRouter.get('/bases', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    console.log("Calling Airtable API for bases...");
    console.log("User access token:", user.accessToken);
    const { data } = await axios.get(META_BASES_URL, {
      headers: { Authorization: `Bearer ${user.accessToken.trim()}` },
    });
    console.log("Airtable API response:", data);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.response?.data || e.message });
  }
});

airtableRouter.get('/bases/:baseId/tables', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const { baseId } = req.params;
    const url = `https://api.airtable.com/v0/meta/bases/${baseId}/tables`;
    const { data } = await axios.get(url, {
      headers: { Authorization: `Bearer ${user.accessToken.trim()}` },
    });
    console.log("Airtable API response:", data);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.response?.data || e.message });
  }
});


