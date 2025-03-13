
export type ReadStatus = "read" | "reading" | "want-to-read";

export interface BookGenre {
  id: string;
  name: string;
}

export interface BookAuthor {
  id: string;
  name: string;
}

export interface Book {
  id: string;
  title: string;
  authors: BookAuthor[];
  coverImage: string;
  genres: BookGenre[];
  publicationDate: string;
  pageCount: number;
  readStatus: ReadStatus;
  rating: number;
  description: string;
  dateAdded: string;
  lastModified: string;
}

export type BookFormData = Omit<Book, "id" | "dateAdded" | "lastModified">;

export type BookView = "grid" | "list";

export type BookSortKey = "title" | "author" | "publicationDate" | "pageCount" | "rating" | "dateAdded";

export interface BookFilterOptions {
  genres: string[];
  readStatus: ReadStatus | null;
  rating: number | null;
  searchQuery: string;
}
