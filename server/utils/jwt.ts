import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'atelier_luxe_super_secret_jwt_key_2026';

export interface TokenPayload {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}
