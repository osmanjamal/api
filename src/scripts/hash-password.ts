import * as bcrypt from 'bcryptjs';

async function hashPassword() {
  const password = 'admin';
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log('Hashed password:', hashedPassword);
}

hashPassword();