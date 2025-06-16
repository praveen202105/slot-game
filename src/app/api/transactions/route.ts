import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import { Transaction } from '@/models/Transaction';
import { getAuth } from '@/utils/auth';

export async function GET(req: NextRequest) {
    await dbConnect();
    const { id } = getAuth(req);
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get('page') ?? 1);
    const limit = Number(searchParams.get('limit') ?? 10);
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
        Transaction.find({ user: id }).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Transaction.countDocuments({ user: id }),
    ]);
    return NextResponse.json({ items, total, page, limit });
}
