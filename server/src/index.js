import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { existsSync } from 'fs';
import { resolve } from 'path';
import config from './config.js';

import { authRouter, requireAuth } from './auth.js';
import { publicPackagesRouter, adminPackagesRouter } from './routes/packages.js';
import { publicFeaturedRouter, adminFeaturedRouter } from './routes/featured.js';
import { publicBlogRouter, adminBlogRouter } from './routes/blog.js';
import { adminFaqRouter } from './routes/faq.js';
import { adminLinksRouter, publicLinksRouter } from './routes/links.js';
import { adminSolicitudesRouter } from './routes/solicitudes.js';
import { uploadRouter } from './routes/upload.js';
import { botRouter } from './routes/bot.js';

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());
app.use(cors({ origin: config.corsOrigins, credentials: true }));

app.use('/api', rateLimit({ windowMs: 60 * 1000, max: 120, standardHeaders: true, legacyHeaders: false }));

// ---------- Salud ----------
app.get('/api/health', (_req, res) => res.json({ status: 'ok', db: !!config.databaseUrl, ts: new Date().toISOString() }));

// ---------- Auth admin ----------
app.use('/api/admin', authRouter);

// ---------- Público (solo lectura) ----------
app.use('/api/packages', publicPackagesRouter);
app.use('/api/featured', publicFeaturedRouter);
app.use('/api/blog', publicBlogRouter);
app.use('/api/links', publicLinksRouter);
app.use('/api/bot', botRouter);

// ---------- Admin (protegido) ----------
app.use('/api/admin/packages', requireAuth, adminPackagesRouter);
app.use('/api/admin/featured', requireAuth, adminFeaturedRouter);
app.use('/api/admin/blog', requireAuth, adminBlogRouter);
app.use('/api/admin/faq', requireAuth, adminFaqRouter);
app.use('/api/admin/links', requireAuth, adminLinksRouter);
app.use('/api/admin/solicitudes', requireAuth, adminSolicitudesRouter);
app.use('/api/admin/upload', requireAuth, uploadRouter);

// ---------- Imágenes subidas ----------
app.use('/images/uploads', express.static(resolve(config.uploadDir)));

// ---------- Sitio + admin (build de React) ----------
const clientDist = resolve(config.clientDist);
if (existsSync(clientDist)) {
  app.use(express.static(clientDist));
  // SPA fallback: cualquier ruta no-API devuelve index.html
  app.get(/^\/(?!api\/).*/, (_req, res) => res.sendFile(resolve(clientDist, 'index.html')));
} else {
  console.warn(`[server] No se encontró el build del cliente en ${clientDist} (corre "npm run build:client").`);
}

app.listen(config.port, () => {
  console.log(`[server] Sianna API en puerto ${config.port} (${config.nodeEnv})`);
});

export default app;
