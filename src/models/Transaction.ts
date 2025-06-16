import mongoose, { Document, Schema } from 'mongoose';

interface ITransaction extends Document {
    userId: mongoose.Types.ObjectId;
    spinResult: string[];
    wager: number;
    winAmount: number;
    createdAt: Date;
}

const TransactionSchema = new Schema<ITransaction>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    spinResult: { type: [String], required: true },
    wager: { type: Number, required: true },
    winAmount: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Transaction ||
    mongoose.model<ITransaction>('Transaction', TransactionSchema);
