import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectToDb from '@/lib/db';
import User from '@/models/User';
import Transaction from '@/models/Transaction';
import { spinReels, calculateWin } from '@/lib/spinLogic';

interface DecodedToken {
    id: string;
    username: string;
    iat: number;
    exp: number;
}

export async function POST(req: NextRequest) {
    try {
        const token = req.headers.get('authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
        const { wager } = await req.json();

        await connectToDb();
        const user = await User.findById(decoded.id);

        if (!user || user.balance < wager) {
            return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
        }

        const result = spinReels();
        const win = calculateWin(result);
        const net = (win * wager) - wager;

        user.balance += net;
        await user.save();

        const newTransaction = new Transaction({
            userId: user._id,
            spinResult: result,
            wager,
            winAmount: (win * wager),
            createdAt: new Date()
        });

        await newTransaction.save();

        return NextResponse.json({
            result,
            win: win * wager,
            updatedBalance: user.balance // 👈 Include updated balance
        });
    } catch (error) {
        console.error('Spin error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
