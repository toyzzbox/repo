import bcrypt from 'bcryptjs';
import { headers } from 'next/headers';

// Şifre hashleme
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// Şifre doğrulama
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Server Component'ten IP adresini al
export async function getClientIPFromHeaders(): Promise<string> {
  const headersList = await headers();
  const forwarded = headersList.get('x-forwarded-for');
  const realIP = headersList.get('x-real-ip');
  const cfIP = headersList.get('cf-connecting-ip');
  
  return (forwarded?.split(',')[0] || realIP || cfIP || 'unknown').trim();
}

// User Agent al
export async function getUserAgentFromHeaders(): Promise<string> {
  const headersList = await headers();
  return headersList.get('user-agent') || 'Unknown';
}