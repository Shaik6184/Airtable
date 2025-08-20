import express from 'express';
import axios from 'axios';
import { requireAuth } from '../util/requireAuth.js';
import { Form } from '../schema/Form.js';
import { User } from '../schema/User.js';

export const formsRouter = express.Router();

formsRouter.post('/', requireAuth, async (req, res) => {
  try {
    const form = await Form.create({ ...req.body, ownerUserId: req.userId });
    res.json(form);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

formsRouter.get('/', requireAuth, async (req, res) => {
  const forms = await Form.find({ ownerUserId: req.userId }).sort({ createdAt: -1 });
  res.json(forms);
});

formsRouter.get('/:id', async (req, res) => {
  const form = await Form.findById(req.params.id);
  if (!form) return res.status(404).json({ error: 'Not found' });
  res.json(form);
});

formsRouter.post('/:id/submit', async (req, res) => {
  const form = await Form.findById(req.params.id);
  if (!form) return res.status(404).json({ error: 'Not found' });

  try {
    const owner = await User.findById(form.ownerUserId);
    const url = `https://api.airtable.com/v0/${form.airtable.baseId}/${encodeURIComponent(form.airtable.tableName || form.airtable.tableId)}`;
    const fields = req.body.fields || {};

    const { data } = await axios.post(
      url,
      { fields },
      { headers: { Authorization: `Bearer ${owner.accessToken}`, 'Content-Type': 'application/json' } }
    );
    res.json({ ok: true, record: data });
  } catch (e) {
    res.status(500).json({ error: e.response?.data || e.message });
  }
});


