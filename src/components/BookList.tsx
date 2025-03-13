import { Book } from "@/types/book";
import BookListItem from "./BookListItem";
import { useBooks } from "@/context/BookContext";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface BookListProps {
  books: Book[];
  loading: boolean;
}

const BookList: React.FC<BookListProps> = ({ books, loading }) => {
  const { sortKey, sortDirection, setSortKey, setSortDirection } = useBooks();

  const handleSort = (key: "title" | "author" | "pageCount" | "rating" | "dateAdded") => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const getSortIndicator = (key: string) => {
    if (sortKey === key) {
      return sortDirection === "asc" ? " ↑" : " ↓";
    }
    return "";
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (loading) {
    return (
      <div className="w-full">
        <div className="grid grid-cols-12 gap-4 p-4 bg-accent/50">
          <div className="col-span-2 sm:col-span-1 font-medium">Cover</div>
          <div className="col-span-10 sm:col-span-11 grid grid-cols-1 sm:grid-cols-3">
            <div className="font-medium">Title/Author</div>
            <div className="font-medium hidden sm:block">Details</div>
            <div className="font-medium hidden sm:block">Status</div>
          </div>
        </div>
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="animate-pulse grid grid-cols-12 gap-4 p-4 border-b">
            <div className="col-span-2 sm:col-span-1">
              <div className="aspect-[2/3] bg-muted rounded"></div>
            </div>
            <div className="col-span-10 sm:col-span-11 grid grid-cols-1 sm:grid-cols-3">
              <div>
                <div className="h-5 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
              <div className="hidden sm:block">
                <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/3"></div>
              </div>
              <div className="hidden sm:block">
                <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center py-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <h2 className="text-2xl font-serif font-bold">No books found</h2>
          <p className="text-muted-foreground mt-2">
            Try adjusting your filters or add some books to your library.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="w-full">
      <motion.div 
        className="sticky top-16 z-10 grid grid-cols-12 gap-4 p-4 bg-accent/50 backdrop-blur-sm border-y"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="col-span-2 sm:col-span-1 font-medium">Cover</div>
        <div className="col-span-10 sm:col-span-11 flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleSort("title")}
            className="flex items-center gap-1"
          >
            Title{getSortIndicator("title")}
            <ArrowUpDown className="ml-1 h-3 w-3" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleSort("author")}
            className="ml-4 hidden sm:flex items-center gap-1"
          >
            Author{getSortIndicator("author")}
            <ArrowUpDown className="ml-1 h-3 w-3" />
          </Button>
          <div className="flex-grow"></div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleSort("pageCount")}
            className="hidden sm:flex items-center gap-1"
          >
            Pages{getSortIndicator("pageCount")}
            <ArrowUpDown className="ml-1 h-3 w-3" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleSort("rating")}
            className="ml-4 flex items-center gap-1"
          >
            Rating{getSortIndicator("rating")}
            <ArrowUpDown className="ml-1 h-3 w-3" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleSort("dateAdded")}
            className="ml-4 hidden sm:flex items-center gap-1"
          >
            Added{getSortIndicator("dateAdded")}
            <ArrowUpDown className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="divide-y divide-border"
      >
        {books.map((book, index) => (
          <motion.div
            key={book.id}
            variants={{
              hidden: { 
                opacity: 0, 
                y: 20,
                transition: { duration: 0.3 }
              },
              visible: { 
                opacity: 1, 
                y: 0,
                transition: {
                  duration: 0.5,
                  ease: [0.25, 0.1, 0.25, 1.0],
                  delay: index * 0.1
                }
              }
            }}
            viewport={{ once: true, margin: "-100px" }}
            whileHover={{ 
              scale: 1.01,
              transition: { duration: 0.2 }
            }}
          >
            <BookListItem book={book} index={index} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default BookList;
