export interface ParsedItemData {
  _id: string;
  name: string;
  hru: string;
  level: number;
  type?: string;
  slot?: string;
  raw: string;
  roomHistory: string[];
  createdAt: string;
  updatedAt: string;
  hidden?: boolean;
}

export interface ItemData {
  _id: string;
  raw: string;
  room?: string;
  by?: string;
  parsedId?: string;
  parsedItem?: ParsedItemData;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  totalItems: number;
}
