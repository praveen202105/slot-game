import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import { Transaction } from '@/models/Transaction';
import redis from '@/lib/redis';

export async function GET(req: NextRequest) {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const days = Number(searchParams.get('days') ?? 7);
    const key = `leaderboard:${days}`;
    const cached = await redis.get(key);
    if (cached) return NextResponse.json(JSON.parse(cached));

    const since = new Date(Date.now() - days * 86400 * 1000);
    const data = await Transaction.aggregate([
        { $match: { createdAt: { $gte: since } } },
        { $group: { _id: '$user', net: { $sum: '$net' } } },
        { $sort: { net: -1 } },
        { $limit: 10 },
        {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'user',
            },
        },
        { $unwind: '$user' },
        { $project: { _id: 0, username: '$user.username', net: 1 } },
    ]);

    await redis.set(key, JSON.stringify(data), 'EX', 120);
    return NextResponse.json(data);
}
