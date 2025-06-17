import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectToDb from '@/lib/db';
import User from '@/models/User';

export async function GET(req: NextRequest) {
    try {
        const token = req.headers.get('authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
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
