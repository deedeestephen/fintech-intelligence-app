import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  biometricKey?: string;
  pinHash?: string;
  themePreference: 'light' | 'dark' | 'system';
  baseCurrency: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    biometricKey: { type: String },
    pinHash: { type: String },
    themePreference: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
    baseCurrency: { type: String, default: 'USD' }
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
