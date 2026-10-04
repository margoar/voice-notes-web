export interface Draft {
  id: string;
  bookId: string;
  content: string;
  status: DraftStatus;
  createdAt: string;
  updatedAt: string;
}

export type DraftStatus =
  | 'draft'
  | 'approved'
  | 'published';