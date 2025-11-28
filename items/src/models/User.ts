import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  discordId: string;
  username: string;
  discriminator?: string;
  globalName?: string;
  avatar: string | null;
  email?: string;
  isAdmin: boolean;
  score: number;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    discordId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    discriminator: {
      type: String,
      trim: true,
    },
    globalName: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      trim: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    score: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastLoginAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure model picks up schema changes during dev hot-reload
if (mongoose.models.User) {
  delete mongoose.models.User;
}

export default mongoose.model<IUser>('User', UserSchema);
