import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export interface UserScore {
  username: string;
  score: number;
}

export async function getUserScores(limit: number = 10): Promise<UserScore[]> {
  await connectDB();

  const users = await User.find({ score: { $gt: 0 } })
    .select('username globalName score')
    .sort({ score: -1 })
    .limit(limit)
    .lean<Array<{ username: string; globalName?: string; score: number }>>();

  return users.map(user => ({
    username: user.globalName || user.username, // Use globalName if available, fallback to username
    score: user.score,
  }));
}

export async function getUserScore(username: string): Promise<number> {
  await connectDB();

  const user = await User.findOne({ username })
    .select('score')
    .lean<{ score: number } | null>();

  return user?.score ?? 0;
}
