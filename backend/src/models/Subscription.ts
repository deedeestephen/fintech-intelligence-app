import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscription extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  amount: number;
  currency: string;
  category: string;
  billingCycle: 'monthly' | 'yearly' | 'weekly';
  nextBillingDate: Date;
  status: 'active' | 'cancelled';
  source?: string;
  isAutoDetected: boolean;
}

const SubscriptionSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    category: { type: String, required: true },
    billingCycle: { type: String, enum: ['monthly', 'yearly', 'weekly'], default: 'monthly' },
    nextBillingDate: { type: Date, required: true },
    status: { type: String, enum: ['active', 'cancelled'], default: 'active' },
    source: { type: String }, // e.g., 'Google Play', 'PayPal'
    isAutoDetected: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model<ISubscription>('Subscription', SubscriptionSchema);
