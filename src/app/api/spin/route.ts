import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import { User } from '@/models/User';
import { Transaction } from '@/models/Transaction';
import { getAuth } from '@/utils/auth';
import { spin, payout } from '@/utils/slot';
import redis from '@/lib/redis';

export async function POST(req: NextRequest) {
    await dbConnect();
    const { id } = getAuth(req);
    const body = await req.json();
    const wager = Number(body.wager);
    const user = await User.findById(id);
    if (!user || wager <= 0 || wager > user.balance)
        return NextResponse.json({ error: 'Bad wager' }, { status: 400 });

    const reels = spin();
    const win = payout(reels, wager);
    const net = win - wager;
    user.balance += net;
    await user.save();
    await Transaction.create({ user: id, reels, wager, payout: win, net });
    await redis.del('leaderboard:7'); // simple cache bust
    return NextResponse.json({ reels, payout: win, balance: user.balance });
}
