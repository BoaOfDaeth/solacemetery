import mongoose, { Schema, Document } from 'mongoose';

export interface IItem extends Document {
  raw: string;
  room?: string;
  by?: string;
  parsedId?: string; // Link to parsed item via hru
  createdAt: Date;
  updatedAt: Date;
}

const ItemSchema: Schema = new Schema(
  {
    raw: {
      type: String,
      required: true,
      trim: true,
    },
    room: {
      type: String,
      trim: true,
    },
    by: {
      type: String,
      trim: true,
    },
    parsedId: {
      type: String,
      ref: 'ParsedItem',
    },
  },
  {
    timestamps: true,
  }
);

// Ensure model picks up schema changes during dev hot-reload
if (mongoose.models.Item) {
  delete mongoose.models.Item;
}

export default mongoose.model<IItem>('Item', ItemSchema);
