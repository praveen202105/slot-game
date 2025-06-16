// /app/api/leaderboard/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectToDb from '@/lib/db';
import Transaction from '@/models/Transaction';
import redis from '@/lib/redis';
import User from '@/models/User';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const days = parseInt(searchParams.get('days') || '7');
        const cacheKey = `leaderboard:${days}`;

        const cached = await redis.get(cacheKey);
        if (cached) return NextResponse.json(JSON.parse(cached));

        await connectToDb();
        const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

        const leaderboard = await Transaction.aggregate([
            { $match: { createdAt: { $gte: since } } },
            {
                $group: {
                    _id: '$userId',
                    netWin: { $sum: { $subtract: ['$winAmount', '$wager'] } }
                }
            },
            { $sort: { netWin: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            {
                $project: {
                    _id: 0,
                    userId: '$_id',
                    username: '$user.username',
                    netWin: 1
                }
            }
        ]);

        await redis.set(cacheKey, JSON.stringify(leaderboard), 'EX', 120); // 2 min TTL
        return NextResponse.json(leaderboard);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
