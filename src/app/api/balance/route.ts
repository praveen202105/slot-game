import { NextRequest, NextResponse } from 'next/server';
import connectToDb from '@/lib/db';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';

export async function GET(req: NextRequest) {
    try {
        const token = req.headers.get('authorization')?.split(' ')[1];
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const decoded = verifyToken(token);

        await connectToDb();

        const user = await User.findById(decoded.id);
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        return NextResponse.json({ balance: user.balance });
    } catch {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
