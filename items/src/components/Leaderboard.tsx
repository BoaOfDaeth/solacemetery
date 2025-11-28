import { getUserScores } from '@/services/scoringService';

export const dynamic = 'force-dynamic';

export default async function Leaderboard() {
  try {
    const scores = await getUserScores(10);

    if (scores.length === 0) {
      return null;
    }

    return (
      <p className="text-xs text-gray-600">
        <span className="font-semibold text-gray-700">Top Contributors:</span>{' '}
        {scores.map((user, index) => (
          <span key={user.username}>
            {user.username} ({user.score}){index < scores.length - 1 && ', '}
          </span>
        ))}
      </p>
    );
  } catch (error) {
    console.error('Leaderboard error:', error);
    return null;
  }
}
