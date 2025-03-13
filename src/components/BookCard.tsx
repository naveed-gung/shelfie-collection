import { Book } from "@/types/book";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, BookOpen, BookMarked, BookPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface BookCardProps {
  book: Book;
  isNew?: boolean;
}

const BookCard: React.FC<BookCardProps> = ({ book, isNew = false }) => {
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
    <Link to={`/book/${book.id}`}>
      <motion.div
        initial={isNew ? { scale: 0.8, opacity: 0, y: 50, rotate: -5 } : false}
        animate={isNew ? { scale: 1, opacity: 1, y: 0, rotate: 0 } : false}
        transition={isNew ? {
          type: "spring",
          stiffness: 100,
          damping: 15,
          duration: 0.6
        } : undefined}
      >
        <Card className={`book-card h-full overflow-hidden border-2 hover:border-primary/50 ${isNew ? 'book-card-new' : ''}`}>
          <div className="book-spine" aria-hidden="true"></div>
          <div className="relative pb-[150%]">
            <img
              src={book.coverImage}
              alt={`Cover of ${book.title}`}
              className="absolute inset-0 h-full w-full object-cover"
            />
            
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
              <h3 className="font-serif font-bold text-lg line-clamp-2">{book.title}</h3>
              <p className="text-sm text-gray-200 line-clamp-1">
                {book.authors.map(author => author.name).join(", ")}
              </p>
            </div>
            
            <div className="absolute top-2 right-2 flex flex-col gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                {getReadStatusIcon()}
                <span className="sr-only">{getReadStatusText()}</span>
              </Badge>
              
              {book.rating > 0 && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>{book.rating}</span>
                </Badge>
              )}
            </div>
          </div>
          
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-1 mt-2">
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
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
};

export default BookCard;
