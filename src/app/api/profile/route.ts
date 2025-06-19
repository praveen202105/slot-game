import { NextRequest, NextResponse } from 'next/server';
import connectToDb from '@/lib/db';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';

export async function GET(req: NextRequest) {
    try {
        const token = req.headers.get('authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded = verifyToken(token);

        await connectToDb();

        const user = await User.findById(decoded.id).select('email balance');
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            email: user.email,
            balance: user.balance
        });
    } catch (err) {
        console.error('Profile error:', err);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}
