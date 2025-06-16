import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    imageUrl?: string; // Optional field for storing image URLs
    balance: number;

}

const UserSchema: Schema = new Schema(
    {
        name: { type: String },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        imageUrl: { type: String, default: '' }, // Field to store image URL,
        balance: { type: Number, default: 1000 },
    },
    { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
