import mongoose, { Schema, Document } from 'mongoose';

export interface IGameLog extends Document {
  author: string;
  title: string;
  createdAt: Date;
  text: string;
  html: string;
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
    createdAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: false,
  }
);

if (mongoose.models.GameLog) {
  delete mongoose.models.GameLog;
}

export default mongoose.model<IGameLog>('GameLog', GameLogSchema);
