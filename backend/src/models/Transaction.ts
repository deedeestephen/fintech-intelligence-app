import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  date: Date;
  source: 'bank' | 'mobile_money' | 'virtual_card' | 'manual';
  sourceId?: string; // Account or wallet ID
  isSubscription: boolean;
}

const TransactionSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    type: { type: String, enum: ['income', 'expense'], required: true },
    category: { type: String, required: true },
    description: { type: String },
    date: { type: Date, default: Date.now },
    source: { type: String, enum: ['bank', 'mobile_money', 'virtual_card', 'manual'], default: 'manual' },
    sourceId: { type: String },
    isSubscription: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
