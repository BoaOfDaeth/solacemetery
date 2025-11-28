interface RoomHistoryProps {
  roomHistory: string[];
}

export default function RoomHistory({ roomHistory }: RoomHistoryProps) {
  if (!roomHistory || roomHistory.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">
        Seen at {roomHistory.length} location
        {roomHistory.length !== 1 ? 's' : ''}
      </h3>
      <div className="flex flex-wrap gap-1">
        {roomHistory.map((room, index) => (
          <span
            key={index}
            className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded border"
          >
            {room}
          </span>
        ))}
      </div>
    </div>
  );
}
