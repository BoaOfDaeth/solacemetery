import { formatDate } from '@/utils/date';
import { ItemData } from '@/types/item';

interface LastTimeItFoundProps {
  item: ItemData;
}

export default function LastTimeItFound({ item }: LastTimeItFoundProps) {
  return (
    <div className="text-xs sm:text-sm text-gray-600 leading-tight">
      {item.by && item.room ? (
        <p className="m-0">
          by <span className="font-bold">{item.by}</span> at{' '}
          <span className="font-bold">{item.room}</span> at{' '}
          {formatDate(item.createdAt)}
        </p>
      ) : item.by ? (
        <p className="m-0">
          by <span className="font-bold">{item.by}</span> at{' '}
          {formatDate(item.createdAt)}
        </p>
      ) : item.room ? (
        <p className="m-0">
          at <span className="font-bold">{item.room}</span> at{' '}
          {formatDate(item.createdAt)}
        </p>
      ) : (
        <p className="m-0">at {formatDate(item.createdAt)}</p>
      )}
    </div>
  );
}
