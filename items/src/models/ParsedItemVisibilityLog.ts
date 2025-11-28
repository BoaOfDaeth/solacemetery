import mongoose, { Schema, Document } from 'mongoose';

export type VisibilityActionType = 'hide' | 'restore';

export interface IParsedItemVisibilityLog extends Document {
  hru: string;
  action: VisibilityActionType;
  performedBy: string;
  performedByUsername: string;
  createdAt: Date;
  updatedAt: Date;
}

const ParsedItemVisibilityLogSchema: Schema = new Schema(
  {
    hru: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    action: {
      type: String,
      enum: ['hide', 'restore'],
      required: true,
    },
    performedBy: {
      type: String,
      required: true,
    },
    performedByUsername: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

ParsedItemVisibilityLogSchema.index({ createdAt: 1 });

if (mongoose.models.ParsedItemVisibilityLog) {
  delete mongoose.models.ParsedItemVisibilityLog;
}

export default mongoose.model<IParsedItemVisibilityLog>(
  'ParsedItemVisibilityLog',
  ParsedItemVisibilityLogSchema
);
