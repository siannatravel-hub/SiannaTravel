import 'dotenv/config';

const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  isProd: process.env.NODE_ENV === 'production',

  // Postgres (Easypanel). En Easypanel usar el host INTERNO del servicio, ej:
  //   postgres://sianna_app:PASS@<servicio-pg>:5432/sianna
  databaseUrl: process.env.DATABASE_URL || '',

  // Auth del admin
  jwtSecret: process.env.JWT_SECRET || 'cambia-este-secreto-en-produccion',
  cookieName: 'sianna_admin',
  // 1 = cookie segura (HTTPS). En local con http, déjalo en '0'.
  cookieSecure: process.env.COOKIE_SECURE !== '0',

  // CORS: orígenes permitidos (separados por coma). En prod, el admin se sirve
  // desde el mismo origen, así que normalmente no hace falta.
  corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:5173')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),

  // Subida de imágenes. En Easypanel montar un VOLUMEN en esta ruta para que
  // las imágenes sobrevivan a los redeploys. Se sirven en /images/uploads.
  uploadDir: process.env.UPLOAD_DIR || './uploads',

  // Carpeta del build del cliente (React/Vite) para servir el sitio + admin.
  clientDist: process.env.CLIENT_DIST || '../client/dist',
};

if (!config.databaseUrl) {
  console.warn('[config] ⚠️  DATABASE_URL no está configurada. La API no podrá leer/escribir en Postgres.');
}

export default config;
