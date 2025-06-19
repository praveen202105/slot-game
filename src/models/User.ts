import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    imageUrl?: string; // Optional field for storing image URLs
    balance: number;
    bonusSpinCount: number; // ✅ New field for bonus tracking
}

const UserSchema: Schema = new Schema(
    {
        name: { type: String },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        imageUrl: { type: String, default: '' },
        balance: { type: Number, default: 1000 },
        bonusSpinCount: { type: Number, default: 0 }, // ✅ Added here
    },
    { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
