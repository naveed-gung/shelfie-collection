import { Book } from "@/types/book";
import { db, storage } from "@/config/firebase";
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  deleteDoc, 
  query, 
  orderBy 
} from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

const BOOKS_COLLECTION = "books";

export const loadBooks = async (): Promise<Book[]> => {
  try {
    const booksQuery = query(collection(db, BOOKS_COLLECTION), orderBy('dateAdded', 'desc'));
    const snapshot = await getDocs(booksQuery);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Book));
  } catch (error) {
    console.error('Error loading books:', error);
    throw error;
  }
};

export const saveBooks = async (books: Book[]): Promise<void> => {
  try {
    const batch = books.map(book => saveBook(book));
    await Promise.all(batch);
  } catch (error) {
    console.error('Error saving books:', error);
    throw error;
  }
};

export const loadBookById = async (id: string): Promise<Book | undefined> => {
  try {
    const bookDoc = await getDoc(doc(db, BOOKS_COLLECTION, id));
    if (bookDoc.exists()) {
      return bookDoc.data() as Book;
    }
    return undefined;
  } catch (error) {
    console.error(`Error loading book with ID ${id} from Firestore:`, error);
    return undefined;
  }
};

export const saveBook = async (book: Book): Promise<void> => {
  try {
    const bookRef = doc(db, BOOKS_COLLECTION, book.id);
    await setDoc(bookRef, book);
  } catch (error) {
    console.error('Error saving book:', error);
    throw error;
  }
};

export const deleteBook = async (id: string): Promise<void> => {
  try {
    const bookRef = doc(db, BOOKS_COLLECTION, id);
    await deleteDoc(bookRef);
  } catch (error) {
    console.error('Error deleting book:', error);
    throw error;
  }
};

export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const uploadCoverImage = async (base64Image: string, bookId: string): Promise<string> => {
  // Since we're storing the base64 image directly in Firestore, we just return it
  return base64Image;
};
