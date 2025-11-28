import ItemCard from './ItemCard';
import { ItemData } from '@/types/item';

interface ItemCardBorderProps {
  item: ItemData;
  cardStyle?: React.CSSProperties;
}

export default function ItemCardBorder({
  item,
  cardStyle,
}: ItemCardBorderProps) {
  return (
    <div
      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border-1"
      style={cardStyle}
    >
      <ItemCard item={item} />
    </div>
  );
}
