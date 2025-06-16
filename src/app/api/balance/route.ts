import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import { User } from '@/models/User';
import { getAuth } from '@/utils/auth';

export async function GET(req: NextRequest) {
    await dbConnect();
    const { id } = getAuth(req);
    const user = await User.findById(id);
    return NextResponse.json({ balance: user?.balance ?? 0 });
}
