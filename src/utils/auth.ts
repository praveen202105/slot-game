import { NextRequest } from 'next/server';
import { verify } from './jwt';

export function getAuth(req: NextRequest) {
    const header = req.headers.get('authorization') || '';
    const token = header.split(' ')[1];
    if (!token) throw new Error('Unauthorized');
    return verify(token);
}