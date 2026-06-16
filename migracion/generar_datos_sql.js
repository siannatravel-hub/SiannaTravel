// Genera 03_datos.sql con los datos reales descargados de Supabase.
// Uso:  node migracion/generar_datos_sql.js   (desde la carpeta siannatravel)
const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const OUT = path.resolve(DIR, '..', 'sql', '03_datos.sql');

const packages  = require(path.join(DIR, 'packages.json'));
const featured  = require(path.join(DIR, 'featured_packages.json'));
const blog       = require(path.join(DIR, 'blog_posts.json'));

// --- helpers de formato SQL ---
const q = (v) => {
  if (v === null || v === undefined) return 'NULL';
  if (typeof v === 'boolean') return v ? 'true' : 'false';
  if (typeof v === 'number') return String(v);
  return "'" + String(v).replace(/'/g, "''") + "'";
};
const jb = (v) => (v === null || v === undefined)
  ? "'[]'::jsonb"
  : "'" + JSON.stringify(v).replace(/'/g, "''") + "'::jsonb";

function insertRows(table, cols, rows, jsonCols = []) {
  if (!rows.length) return `-- (sin filas para ${table})\n`;
  const colList = cols.join(', ');
  const values = rows.map(r => {
    const vals = cols.map(c => jsonCols.includes(c) ? jb(r[c]) : q(r[c]));
    return '  (' + vals.join(', ') + ')';
  }).join(',\n');
  return `INSERT INTO ${table} (${colList}) OVERRIDING SYSTEM VALUE VALUES\n${values}\nON CONFLICT (id) DO NOTHING;\n`;
}

const pkgCols = ['id','slug','title','destination','country','region','description','price','original_price','discount','currency','duration','nights','image','gallery','category','rating','reviews_count','includes','highlights','is_active','is_featured','order_index','airline','flight_type','service_type','persons','hotel_name','hotel_stars','room_type','accommodation_type','itinerary_pdf','dates','contact_whatsapp','cancellation_policy','flight_includes','transfers_included','itinerary','important_info','terms_conditions','payment_options','created_at','updated_at'];
const pkgJson = ['gallery','includes','highlights','flight_includes','transfers_included','itinerary','important_info','terms_conditions','payment_options'];

const featCols = ['id','title','destination','price','original_price','discount','image','tag','nights','rating','link','order_index','itinerary_pdf','created_at','updated_at'];

const blogCols = ['id','title','slug','excerpt','cover_image','content','author','is_published','published_at','created_at','updated_at'];

let out = `-- ============================================================
--  SIANNA TRAVEL — Datos reales migrados desde Supabase
--  Generado automáticamente. Ejecutar DESPUÉS de 01_schema.sql.
-- ============================================================

`;
out += '-- ---------- packages ----------\n' + insertRows('packages', pkgCols, packages, pkgJson) + '\n';
out += '-- ---------- featured_packages ----------\n' + insertRows('featured_packages', featCols, featured) + '\n';
out += '-- ---------- blog_posts ----------\n' + insertRows('blog_posts', blogCols, blog) + '\n';

// Reajustar las secuencias de identidad para que los próximos INSERT no choquen.
out += `-- ---------- Reajustar secuencias de identidad ----------
SELECT setval(pg_get_serial_sequence('packages','id'),          (SELECT COALESCE(MAX(id),1) FROM packages));
SELECT setval(pg_get_serial_sequence('featured_packages','id'), (SELECT COALESCE(MAX(id),1) FROM featured_packages));
SELECT setval(pg_get_serial_sequence('blog_posts','id'),        (SELECT COALESCE(MAX(id),1) FROM blog_posts));
`;

fs.writeFileSync(OUT, out, 'utf8');
console.log('Escrito:', OUT);
console.log('packages:', packages.length, '| featured:', featured.length, '| blog:', blog.length);
