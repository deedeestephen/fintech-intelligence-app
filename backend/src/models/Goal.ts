import mongoose, { Schema, Document } from 'mongoose';

export interface IGoal extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  targetDate?: Date;
  status: 'in_progress' | 'completed';
}

const GoalSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    targetAmount: { type: Number, required: true },
    currentAmount: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
    targetDate: { type: Date },
    status: { type: String, enum: ['in_progress', 'completed'], default: 'in_progress' }
  },
  { timestamps: true }
);

export default mongoose.model<IGoal>('Goal', GoalSchema);
