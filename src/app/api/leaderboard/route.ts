// /app/api/leaderboard/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectToDb from '@/lib/db';
import Transaction from '@/models/Transaction';
import redis from '@/lib/redis';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const days = parseInt(searchParams.get("days") || "7");
        const cacheKey = `leaderboard:${days}`;

        const cached = await redis.get(cacheKey);
        if (cached) return NextResponse.json(JSON.parse(cached));

        await connectToDb();
        const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

        const leaderboardRaw = await Transaction.aggregate([
            { $match: { createdAt: { $gte: since } } },
            {
                $group: {
                    _id: "$userId",
                    netWin: { $sum: { $subtract: ["$winAmount", "$wager"] } },
                    totalSpins: { $sum: 1 },
                },
            },
            { $sort: { netWin: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "user",
                },
            },
            { $unwind: "$user" },
            {
                $project: {
                    _id: 0,
                    userId: "$_id",
                    username: "$user.username",
                    email: "$user.email",
                    netWin: 1,
                    totalSpins: 1,
                },
            },
        ]);

        // ➕ Add rank based on array index
        const leaderboardWithRank = leaderboardRaw.map((entry, index) => ({
            rank: index + 1,
            ...entry,
        }));


        await redis.set(cacheKey, JSON.stringify(leaderboardWithRank), {
            EX: 120, // expires after 120 seconds (2 minutes)
        });

        return NextResponse.json(leaderboardWithRank);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

