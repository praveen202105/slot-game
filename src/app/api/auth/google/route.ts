import User from '@/models/User';
import connectToDatabase from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { createToken } from '@/lib/jwt';

export async function POST(req: NextRequest) {
    await connectToDatabase();

    try {
        const { name, email, picture } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name,
                email,
                imageUrl: picture,
                password: Math.random().toString(36).slice(-8), // random temp password
                balance: 1000
            });
        }

        const token = createToken({ id: user._id });


        return NextResponse.json({
            user: {
                name,
                email,
                profilePic: picture,
            },
            token,
        });
    } catch (error) {
        console.error('Error during Google login:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
