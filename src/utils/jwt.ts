import jwt from 'jsonwebtoken';

export interface JwtPayload { id: string; username: string }
const secret = process.env.JWT_SECRET!;

export const sign = (p: JwtPayload) => jwt.sign(p, secret, { expiresIn: '7d' });
export const verify = (t: string) => jwt.verify(t, secret) as JwtPayload;
