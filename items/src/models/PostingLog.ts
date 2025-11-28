import mongoose, { Schema, Document } from 'mongoose';

export interface IPostingLog extends Document {
  userId: string;
  username: string;
  raw: string;
  itemId?: string;
  parsedItemHRU?: string;
  success: boolean;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PostingLogSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
      index: true,
    },
    raw: {
      type: String,
      required: true,
    },
    itemId: {
      type: String,
      trim: true,
    },
    parsedItemHRU: {
      type: String,
      trim: true,
    },
    success: {
      type: Boolean,
      required: true,
      default: false,
    },
    error: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

PostingLogSchema.index({ createdAt: -1 });
PostingLogSchema.index({ userId: 1, createdAt: -1 });
PostingLogSchema.index({ username: 1, createdAt: -1 });

if (mongoose.models.PostingLog) {
  delete mongoose.models.PostingLog;
}

export default mongoose.model<IPostingLog>('PostingLog', PostingLogSchema);
