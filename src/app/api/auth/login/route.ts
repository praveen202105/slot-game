
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import connectToDatabase from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { createToken } from '@/lib/jwt';

export async function POST(req: NextRequest) {
    await connectToDatabase();
    const { email, password } = await req.json();
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    const token = createToken({ id: user._id });


    return NextResponse.json({ token });
}