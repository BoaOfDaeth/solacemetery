import mongoose, { Schema, Document } from 'mongoose';

export interface IGameLog extends Document {
  author: string;
  title: string;
  text: string;
  html: string;
  createdAt: Date;
  updatedAt: Date;
}

const GameLogSchema: Schema = new Schema(
  {
    author: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    text: {
      type: String,
      required: true,
    },
    html: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

if (mongoose.models.GameLog) {
  delete mongoose.models.GameLog;
}

export default mongoose.model<IGameLog>('GameLog', GameLogSchema);
