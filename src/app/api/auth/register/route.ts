import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';




import { createToken } from '@/lib/jwt';

export async function POST(req: NextRequest) {
    await connectToDatabase();
    const { email, password, name, imageUrl, role = 'user' } = await req.json();

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: 'Email already exists' }, { status: 400 });
        }

        const user = await User.create({
            email,
            password: hashedPassword,
            name,
            imageUrl,
            role,
            balance: 1000,
        });

        const token = createToken({ id: user._id, role: user.role });


        return NextResponse.json({ message: 'User created', user, token });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
    }
}
