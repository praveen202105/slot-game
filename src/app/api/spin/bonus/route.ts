import { NextRequest, NextResponse } from 'next/server';
import connectToDb from '@/lib/db';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';

export async function POST(req: NextRequest) {
    try {
        const token = req.headers.get('authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded = verifyToken(token);

        await connectToDb();
        const user = await User.findById(decoded.id);

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (user.balance === 0 || user.bonusSpinCount >= 5) {
            user.balance += 100;
            user.bonusSpinCount = 0;
            await user.save();
            return NextResponse.json({ message: 'Bonus 100 coins added', balance: user.balance });
        }

        // ✅ Return response when not eligible
        return NextResponse.json({ error: 'Not eligible for bonus' }, { status: 403 });

    } catch (err) {
        console.error('Bonus API error:', err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
