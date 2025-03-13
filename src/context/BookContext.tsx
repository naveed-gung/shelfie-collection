import React, { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Book, BookFormData, BookView, BookFilterOptions, BookSortKey } from "@/types/book";
import { 
  loadBooks, 
  saveBook, 
  deleteBook as deleteBookFromDb, 
  saveBooks, 
  uploadCoverImage 
} from "@/utils/storage";
import { sampleBooks } from "@/lib/sample-data";
import { useToast } from "@/hooks/use-toast";

interface BookContextType {
  books: Book[];
  filteredBooks: Book[];
  loading: boolean;
  viewMode: BookView;
  filterOptions: BookFilterOptions;
  sortKey: BookSortKey;
  sortDirection: "asc" | "desc";
  addBook: (book: BookFormData) => Promise<void>;
  updateBook: (id: string, book: Partial<BookFormData>) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  getBookById: (id: string) => Book | undefined;
  setViewMode: (mode: BookView) => void;
  setSortKey: (key: BookSortKey) => void;
  setSortDirection: (direction: "asc" | "desc") => void;
  updateFilterOptions: (options: Partial<BookFilterOptions>) => void;
  resetFilters: () => void;
  exportLibrary: () => void;
  importLibrary: (jsonData: string) => Promise<void>;
  clearLibrary: () => Promise<void>;
}

const defaultFilterOptions: BookFilterOptions = {
  genres: [],
  readStatus: null,
  rating: null,
  searchQuery: "",
};

const BookContext = createContext<BookContextType | undefined>(undefined);

export const BookProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<BookView>("grid");
  const [filterOptions, setFilterOptions] = useState<BookFilterOptions>(defaultFilterOptions);
  const [sortKey, setSortKey] = useState<BookSortKey>("dateAdded");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const { toast } = useToast();

  useEffect(() => {
    const initializeBooks = async () => {
      setLoading(true);
      try {
        let loadedBooks = await loadBooks();
        
        if (loadedBooks.length === 0) {
          loadedBooks = sampleBooks;
          await saveBooks(loadedBooks);
        }
        
        setBooks(loadedBooks);
      } catch (error) {
        console.error("Error initializing books:", error);
        toast({
          title: "Error loading books",
          description: "There was a problem loading your library",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    initializeBooks();
  }, []);

  useEffect(() => {
    let result = [...books];
    
    if (filterOptions.genres.length > 0) {
      result = result.filter(book => 
        book.genres.some(genre => filterOptions.genres.includes(genre.id))
      );
    }
    
    if (filterOptions.readStatus) {
      result = result.filter(book => book.readStatus === filterOptions.readStatus);
    }
    
    if (filterOptions.rating) {
      result = result.filter(book => book.rating === filterOptions.rating);
    }
    
    if (filterOptions.searchQuery) {
      const query = filterOptions.searchQuery.toLowerCase();
      result = result.filter(book => 
        book.title.toLowerCase().includes(query) || 
        book.authors.some(author => author.name.toLowerCase().includes(query)) ||
        book.description.toLowerCase().includes(query)
      );
    }
    
    result.sort((a, b) => {
      let valueA: any;
      let valueB: any;
      
      switch (sortKey) {
        case "title":
          valueA = a.title.toLowerCase();
          valueB = b.title.toLowerCase();
          break;
        case "author":
          valueA = a.authors[0]?.name.toLowerCase() || "";
          valueB = b.authors[0]?.name.toLowerCase() || "";
          break;
        case "publicationDate":
          valueA = new Date(a.publicationDate).getTime();
          valueB = new Date(b.publicationDate).getTime();
          break;
        case "pageCount":
          valueA = a.pageCount;
          valueB = b.pageCount;
          break;
        case "rating":
          valueA = a.rating;
          valueB = b.rating;
          break;
        case "dateAdded":
        default:
          valueA = new Date(a.dateAdded).getTime();
          valueB = new Date(b.dateAdded).getTime();
          break;
      }
      
      if (sortDirection === "asc") {
        return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      } else {
        return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
      }
    });
    
    setFilteredBooks(result);
  }, [books, filterOptions, sortKey, sortDirection]);

  const addBook = async (bookData: BookFormData) => {
    try {
      const timestamp = new Date().toISOString();
      
      // If the book has a coverImage that's a base64 string, upload it to Firebase Storage
      let coverImageUrl = bookData.coverImage;
      if (coverImageUrl && coverImageUrl.startsWith('data:')) {
        const bookId = uuidv4();
        coverImageUrl = await uploadCoverImage(coverImageUrl, bookId);
        
        const newBook: Book = {
          ...bookData,
          id: bookId,
          coverImage: coverImageUrl,
          dateAdded: timestamp,
          lastModified: timestamp,
        };
        
        await saveBook(newBook);
        setBooks(prevBooks => [...prevBooks, newBook]);
        
        toast({
          title: "Book added",
          description: `"${newBook.title}" has been added to your library`,
        });
      } else {
        // Handle case where coverImage is already a URL or doesn't exist
        const newBook: Book = {
          ...bookData,
          id: uuidv4(),
          dateAdded: timestamp,
          lastModified: timestamp,
        };
        
        await saveBook(newBook);
        setBooks(prevBooks => [...prevBooks, newBook]);
        
        toast({
          title: "Book added",
          description: `"${newBook.title}" has been added to your library`,
        });
      }
    } catch (error) {
      console.error("Error adding book:", error);
      toast({
        title: "Error adding book",
        description: "There was a problem adding the book",
        variant: "destructive",
      });
    }
  };

  const updateBook = async (id: string, bookData: Partial<BookFormData>) => {
    try {
      const existingBook = books.find(book => book.id === id);
      
      if (!existingBook) {
        throw new Error(`Book with ID ${id} not found`);
      }
      
      // Check if the cover image has changed and is a base64 string
      let coverImageUrl = bookData.coverImage;
      if (coverImageUrl && coverImageUrl.startsWith('data:') && coverImageUrl !== existingBook.coverImage) {
        coverImageUrl = await uploadCoverImage(coverImageUrl, id);
      }
      
      const updatedBook: Book = {
        ...existingBook,
        ...bookData,
        coverImage: coverImageUrl || existingBook.coverImage,
        lastModified: new Date().toISOString(),
      };
      
      await saveBook(updatedBook);
      
      setBooks(prevBooks => 
        prevBooks.map(book => book.id === id ? updatedBook : book)
      );
      
      toast({
        title: "Book updated",
        description: `"${updatedBook.title}" has been updated`,
      });
    } catch (error) {
      console.error("Error updating book:", error);
      toast({
        title: "Error updating book",
        description: "There was a problem updating the book",
        variant: "destructive",
      });
    }
  };

  const deleteBook = async (id: string) => {
    try {
      const bookToDelete = books.find(book => book.id === id);
      
      if (!bookToDelete) {
        throw new Error(`Book with ID ${id} not found`);
      }
      
      await deleteBookFromDb(id);
      setBooks(prevBooks => prevBooks.filter(book => book.id !== id));
      
      toast({
        title: "Book deleted",
        description: `"${bookToDelete.title}" has been removed from your library`,
      });
    } catch (error) {
      console.error("Error deleting book:", error);
      toast({
        title: "Error deleting book",
        description: "There was a problem deleting the book",
        variant: "destructive",
      });
    }
  };

  const getBookById = (id: string) => {
    return books.find(book => book.id === id);
  };

  const updateFilterOptions = (options: Partial<BookFilterOptions>) => {
    setFilterOptions(prev => ({ ...prev, ...options }));
  };

  const resetFilters = () => {
    setFilterOptions(defaultFilterOptions);
    setSortKey("dateAdded");
    setSortDirection("desc");
  };

  const exportLibrary = () => {
    try {
      const booksData = JSON.stringify(books, null, 2);
      const blob = new Blob([booksData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement("a");
      a.href = url;
      a.download = `book-library-export-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting library:", error);
      throw error;
    }
  };

  const importLibrary = async (jsonData: string) => {
    try {
      const importedBooks = JSON.parse(jsonData) as Book[];
      
      if (!Array.isArray(importedBooks) || !importedBooks.every(book => 
        book.id && book.title && book.authors && book.coverImage)) {
        throw new Error("Invalid book data format");
      }
      
      await saveBooks(importedBooks);
      setBooks(importedBooks);
    } catch (error) {
      console.error("Error importing library:", error);
      throw error;
    }
  };

  const clearLibrary = async () => {
    try {
      // Delete all books from Firestore
      for (const book of books) {
        await deleteBookFromDb(book.id);
      }
      setBooks([]);
    } catch (error) {
      console.error("Error clearing library:", error);
      throw error;
    }
  };

  const value: BookContextType = {
    books,
    filteredBooks,
    loading,
    viewMode,
    filterOptions,
    sortKey,
    sortDirection,
    addBook,
    updateBook,
    deleteBook,
    getBookById,
    setViewMode,
    setSortKey,
    setSortDirection,
    updateFilterOptions,
    resetFilters,
    exportLibrary,
    importLibrary,
    clearLibrary,
  };

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
};

export const useBooks = () => {
  const context = useContext(BookContext);
  
  if (context === undefined) {
    throw new Error("useBooks must be used within a BookProvider");
  }
  
  return context;
};
