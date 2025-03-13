
import { Book, BookGenre, ReadStatus } from "@/types/book";

export const sampleGenres: BookGenre[] = [
  { id: "fiction", name: "Fiction" },
  { id: "non-fiction", name: "Non-Fiction" },
  { id: "sci-fi", name: "Science Fiction" },
  { id: "fantasy", name: "Fantasy" },
  { id: "mystery", name: "Mystery" },
  { id: "thriller", name: "Thriller" },
  { id: "romance", name: "Romance" },
  { id: "biography", name: "Biography" },
  { id: "history", name: "History" },
  { id: "self-help", name: "Self-Help" },
  { id: "business", name: "Business" },
  { id: "technology", name: "Technology" }
];

const getSampleCoverUrl = (index: number): string => {
  const imageIds = [
    "photo-1649972904349-6e44c42644a7",
    "photo-1488590528505-98d2b5aba04b",
    "photo-1518770660439-4636190af475",
    "photo-1461749280684-dccba630e2f6",
    "photo-1486312338219-ce68d2c6f44d"
  ];
  
  const id = imageIds[index % imageIds.length];
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=500&h=750`;
};

export const sampleBooks: Book[] = [
  {
    id: "1",
    title: "The Art of Programming",
    authors: [{ id: "1", name: "Jane Smith" }],
    coverImage: getSampleCoverUrl(0),
    genres: [
      { id: "technology", name: "Technology" },
      { id: "non-fiction", name: "Non-Fiction" }
    ],
    publicationDate: "2021-05-15",
    pageCount: 456,
    readStatus: "read" as ReadStatus,
    rating: 5,
    description: "A comprehensive guide to modern programming techniques and practices. This book covers everything from basic algorithms to advanced software architecture.",
    dateAdded: "2023-01-15T12:00:00Z",
    lastModified: "2023-01-15T12:00:00Z"
  },
  {
    id: "2",
    title: "Digital Horizons",
    authors: [{ id: "2", name: "Alexander Johnson" }],
    coverImage: getSampleCoverUrl(1),
    genres: [
      { id: "sci-fi", name: "Science Fiction" },
      { id: "fiction", name: "Fiction" }
    ],
    publicationDate: "2020-09-22",
    pageCount: 328,
    readStatus: "reading" as ReadStatus,
    rating: 4,
    description: "In a world where virtual reality has become indistinguishable from actual reality, one programmer discovers a glitch that threatens to unravel the fabric of society.",
    dateAdded: "2023-02-10T15:30:00Z",
    lastModified: "2023-02-10T15:30:00Z"
  },
  {
    id: "3",
    title: "The Cloud Atlas",
    authors: [{ id: "3", name: "David Mitchell" }],
    coverImage: getSampleCoverUrl(2),
    genres: [
      { id: "fiction", name: "Fiction" },
      { id: "fantasy", name: "Fantasy" }
    ],
    publicationDate: "2004-03-09",
    pageCount: 509,
    readStatus: "want-to-read" as ReadStatus,
    rating: 0,
    description: "A postmodern novel consisting of six nested stories that take the reader from the remote South Pacific in the nineteenth century to a distant, post-apocalyptic future.",
    dateAdded: "2023-03-05T09:45:00Z",
    lastModified: "2023-03-05T09:45:00Z"
  },
  {
    id: "4",
    title: "Code Complete",
    authors: [{ id: "4", name: "Steve McConnell" }],
    coverImage: getSampleCoverUrl(3),
    genres: [
      { id: "technology", name: "Technology" },
      { id: "non-fiction", name: "Non-Fiction" }
    ],
    publicationDate: "2004-06-09",
    pageCount: 960,
    readStatus: "read" as ReadStatus,
    rating: 5,
    description: "A practical handbook of software construction that has been cited more than 900 times and regarded as one of the leading practical guides to programming.",
    dateAdded: "2023-01-08T14:20:00Z",
    lastModified: "2023-01-08T14:20:00Z"
  },
  {
    id: "5",
    title: "The Pragmatic Programmer",
    authors: [
      { id: "5a", name: "Andrew Hunt" },
      { id: "5b", name: "David Thomas" }
    ],
    coverImage: getSampleCoverUrl(4),
    genres: [
      { id: "technology", name: "Technology" },
      { id: "non-fiction", name: "Non-Fiction" }
    ],
    publicationDate: "1999-10-30",
    pageCount: 352,
    readStatus: "reading" as ReadStatus,
    rating: 4,
    description: "A collection of tips to improve the programming process. It addresses core process including individual philosophy, pragmatic approaches, and team-centric techniques.",
    dateAdded: "2023-02-22T11:10:00Z",
    lastModified: "2023-02-22T11:10:00Z"
  }
];
