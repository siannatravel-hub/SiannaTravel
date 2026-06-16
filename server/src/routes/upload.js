import { Router } from 'express';
import multer from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { resolve, extname } from 'path';
import config from '../config.js';

// Carpeta de subidas (en Easypanel: montar un VOLUMEN aquí).
const UPLOAD_DIR = resolve(config.uploadDir);
if (!existsSync(UPLOAD_DIR)) mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = (extname(file.originalname) || '.jpg').toLowerCase();
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) =>
    ALLOWED.includes(file.mimetype) ? cb(null, true) : cb(new Error('Tipo de archivo no permitido')),
});

export const uploadRouter = Router();

// POST /api/admin/upload  (campo "file") → { url, path }
uploadRouter.post('/', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No se recibió archivo' });
  const publicUrl = `/images/uploads/${req.file.filename}`;
  res.json({ url: publicUrl, path: publicUrl });
});
