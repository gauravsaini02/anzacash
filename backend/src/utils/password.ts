import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  console.log("the password is :", password)
  console.log("the hash is :", hash)
  console.log("password length:", password.length)
  console.log("hash length:", hash.length)
  console.log("hash starts with $2b$ or $2a$?", hash.startsWith('$2') ? 'Yes' : 'No')

  const result = await bcrypt.compare(password, hash);
  console.log("bcrypt.compare result:", result)
  return result;
}