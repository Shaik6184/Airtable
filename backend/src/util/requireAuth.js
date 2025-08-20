import jwt from 'jsonwebtoken';

export function requireAuth(req, res, next) {
  const token = req.cookies.app_token || (req.headers.authorization || '').replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev');
    req.userId = payload.uid;
    next();
  } catch (_e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}


