import { Book } from "@/types/book";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Star, BookOpen, BookMarked, BookPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface BookListItemProps {
  book: Book;
  index: number;
}

const BookListItem: React.FC<BookListItemProps> = ({ book, index }) => {
  const getReadStatusIcon = () => {
    switch (book.readStatus) {
      case "read":
        return <BookMarked className="h-4 w-4" />;
      case "reading":
        return <BookOpen className="h-4 w-4" />;
      case "want-to-read":
        return <BookPlus className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getReadStatusText = () => {
    switch (book.readStatus) {
      case "read":
        return "Read";
      case "reading":
        return "Currently Reading";
      case "want-to-read":
        return "Want to Read";
      default:
        return "";
    }
  };

  return (
    <Link 
      to={`/book/${book.id}`}
      className="group grid grid-cols-12 gap-4 p-4 hover:bg-accent/50 transition-colors"
    >
      <div className="col-span-2 sm:col-span-1">
        <motion.div 
          className="relative aspect-[2/3] w-full overflow-hidden rounded-sm shadow-md transition-all group-hover:shadow-lg"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <img 
            src={book.coverImage} 
            alt={`Cover of ${book.title}`}
            className="absolute inset-0 h-full w-full object-cover" 
          />
        </motion.div>
      </div>
      
      <div className="col-span-10 sm:col-span-11 flex flex-col sm:flex-row sm:items-center">
        <div className="flex-1">
          <motion.h3 
            className="font-serif font-bold text-base sm:text-lg line-clamp-1 group-hover:text-primary transition-colors"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.2 }}
          >
            {book.title}
          </motion.h3>
          
          <motion.p 
            className="text-sm text-muted-foreground line-clamp-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.3 }}
          >
            {book.authors.map(author => author.name).join(", ")}
          </motion.p>
          
          <motion.div 
            className="hidden sm:flex flex-wrap gap-1 mt-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.4 }}
          >
            {book.genres.slice(0, 2).map(genre => (
              <Badge key={genre.id} variant="outline" className="text-xs">
                {genre.name}
              </Badge>
            ))}
            {book.genres.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{book.genres.length - 2}
              </Badge>
            )}
          </motion.div>
        </div>
        
        <motion.div 
          className="flex items-center gap-4 mt-2 sm:mt-0"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 + 0.5 }}
        >
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span className="hidden sm:inline">{book.pageCount} pages</span>
            <span className="sm:hidden">{book.pageCount} pg</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Badge 
              variant="secondary" 
              className="flex items-center gap-1"
            >
              {getReadStatusIcon()}
              <span className="hidden sm:inline">{getReadStatusText()}</span>
            </Badge>
          </div>
          
          {book.rating > 0 && (
            <motion.div 
              className="flex items-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ 
                delay: index * 0.1 + 0.6,
                type: "spring",
                stiffness: 300,
                damping: 20
              }}
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-4 w-4 ${i < book.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-gray-600"}`} 
                />
              ))}
            </motion.div>
          )}
          
          <div className="hidden sm:block text-xs text-muted-foreground">
            Added {formatDistanceToNow(new Date(book.dateAdded), { addSuffix: true })}
          </div>
        </motion.div>
      </div>
    </Link>
  );
};

export default BookListItem;
