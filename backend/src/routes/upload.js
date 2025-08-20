import express from 'express';
import multer from 'multer';
import { requireAuth } from '../util/requireAuth.js';
import { configureCloudinary, uploadBufferToCloudinary } from '../util/cloudinary.js';

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const uploadRouter = express.Router();

configureCloudinary();

uploadRouter.post('/attachments', requireAuth, upload.array('files', 10), async (req, res) => {
  try {
    const folder = req.query.folder || 'air-form-uploads';
    const results = [];
    for (const file of req.files || []) {
      const result = await uploadBufferToCloudinary(file.buffer, folder, file.originalname.replace(/\.[^.]+$/, ''));
      results.push({ url: result.secure_url, public_id: result.public_id, bytes: result.bytes, format: result.format });
    }
    res.json({ files: results });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


