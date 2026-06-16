import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from './db.js';
import config from './config.js';

// Middleware: exige sesión válida (cookie httpOnly con JWT).
export function requireAuth(req, res, next) {
  const token = req.cookies?.[config.cookieName];
  if (!token) return res.status(401).json({ error: 'No autenticado' });
  try {
    req.admin = jwt.verify(token, config.jwtSecret);
    next();
  } catch {
    res.status(401).json({ error: 'Sesión inválida o expirada' });
  }
}

const cookieOpts = {
  httpOnly: true,
  secure: config.cookieSecure,
  sameSite: config.cookieSecure ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
};

export const authRouter = Router();

// POST /api/admin/login  { email, password }
authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Faltan credenciales' });

    const { rows } = await query(
      'SELECT id, email, nombre, password_hash, activo FROM admin_users WHERE lower(email) = lower($1)',
      [email]
    );
    const user = rows[0];
    if (!user || !user.activo) return res.status(401).json({ error: 'Credenciales inválidas' });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Credenciales inválidas' });

    const payload = { id: user.id, email: user.email, nombre: user.nombre };
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '7d' });
    res.cookie(config.cookieName, token, cookieOpts);
    res.json({ user: payload });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/admin/me  → sesión actual
authRouter.get('/me', requireAuth, (req, res) => {
  res.json({ user: { id: req.admin.id, email: req.admin.email, nombre: req.admin.nombre } });
});

// POST /api/admin/logout
authRouter.post('/logout', (_req, res) => {
  res.clearCookie(config.cookieName, { ...cookieOpts, maxAge: undefined });
  res.json({ ok: true });
});
