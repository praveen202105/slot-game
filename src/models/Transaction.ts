import { Schema, model, models, Types } from 'mongoose';

const txSchema = new Schema(
    {
        user: { type: Types.ObjectId, ref: 'User', required: true },
        reels: [{ type: String, required: true }],
        wager: { type: Number, required: true },
        payout: { type: Number, required: true },
        net: { type: Number, required: true },
    },
    { timestamps: true }
);

txSchema.index({ user: 1, createdAt: -1 });

export const Transaction = models.Transaction || model('Transaction', txSchema);
