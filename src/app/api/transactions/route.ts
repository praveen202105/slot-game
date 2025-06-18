import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectToDb from '@/lib/db';
import Transaction from '@/models/Transaction';

export async function GET(req: NextRequest) {
    try {
        const token = req.headers.get('authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
        await connectToDb();

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        // Get total count for pagination
        const totalCount = await Transaction.countDocuments({ userId: decoded.id });

        const transactions = await Transaction.find({ userId: decoded.id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        return NextResponse.json({
            page,
            limit,
            totalPages: Math.ceil(totalCount / limit),
            totalCount,
            transactions
        });
    } catch (err) {
        console.error('Error fetching transactions:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
