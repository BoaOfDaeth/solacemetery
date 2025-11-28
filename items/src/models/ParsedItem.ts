import mongoose, { Schema, Document } from 'mongoose';

export interface IParsedItem extends Document {
  name: string;
  hru: string; // Human readable URL
  level: number;
  type?: string; // Item type extracted from "is armor", "is weapon", etc.
  slot?: string; // Equipment slot for wearable items (e.g., 'head', 'body', 'arms', 'hands', 'legs', 'feet', 'finger', 'wrist', 'neck')
  raw: string; // Original raw text
  roomHistory: string[]; // Array of rooms where this item was found
  hidden: boolean;
  createdBy?: string; // Username of the user who first created this parsed item
  visibleAfter?: Date; // When item becomes visible to non-admin users (for API posts)
}

const ParsedItemSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    hru: {
      type: String,
      required: true,
      trim: true,
      unique: true, // Ensures unique parsed items by hru
    },
    level: {
      type: Number,
      required: true,
      min: 1,
    },
    type: {
      type: String,
      trim: true,
    },
    slot: {
      type: String,
      trim: true,
    },
    raw: {
      type: String,
      required: true,
      trim: true,
    },
    roomHistory: {
      type: [String],
      default: [],
    },
    hidden: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: String,
      trim: true,
      index: true,
    },
    visibleAfter: {
      type: Date,
      index: true, // Index for efficient queries
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient querying
ParsedItemSchema.index({ level: 1 });
ParsedItemSchema.index({ type: 1 });
ParsedItemSchema.index({ slot: 1 });
// Note: hru field already has unique index from schema definition

// Ensure model picks up schema changes during dev hot-reload
if (mongoose.models.ParsedItem) {
  delete mongoose.models.ParsedItem;
}

export default mongoose.model<IParsedItem>('ParsedItem', ParsedItemSchema);
