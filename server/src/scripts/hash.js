// Genera el hash bcrypt de una contraseña.
// Uso:  node src/scripts/hash.js "MiContraseñaFuerte"
import bcrypt from 'bcryptjs';

const pwd = process.argv[2];
if (!pwd) {
  console.error('Uso: node src/scripts/hash.js "contraseña"');
  process.exit(1);
}
console.log(bcrypt.hashSync(pwd, 10));
