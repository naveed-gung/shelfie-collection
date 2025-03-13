import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBooks } from "@/context/BookContext";
import Header from "@/components/Header";
import { Book as BookIcon, Pencil, Trash2, ChevronLeft, Calendar, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StarRating from "@/components/StarRating";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { motion } from "framer-motion";

const BookDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getBookById, deleteBook } = useBooks();
  const [book, setBook] = useState(id ? getBookById(id) : undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const foundBook = getBookById(id);
      setBook(foundBook);
    }
    setLoading(false);
  }, [id, getBookById]);

  const handleDelete = () => {
    if (id) {
      deleteBook(id);
      navigate("/");
    }
  };

  const getReadStatusLabel = () => {
    if (!book) return "";
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin">
            <BookIcon className="h-8 w-8 text-primary" />
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-serif font-bold">Book Not Found</h1>
          <p className="text-muted-foreground mt-2">
            The book you're looking for doesn't exist or has been removed.
          </p>
          <Button 
            variant="default" 
            onClick={() => navigate("/")}
            className="mt-4"
          >
            Return to Library
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-6 -ml-2 text-muted-foreground"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Library
          </Button>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <motion.div 
                className="relative aspect-[2/3] w-full max-w-[300px] mx-auto md:mx-0 overflow-hidden rounded-md shadow-lg"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <img
                  src={book.coverImage}
                  alt={`Cover of ${book.title}`}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </motion.div>
              
              <motion.div 
                className="mt-6 flex flex-wrap gap-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                {book.genres.map((genre) => (
                  <Badge key={genre.id} variant="outline">
                    {genre.name}
                  </Badge>
                ))}
              </motion.div>
            </div>
            
            <div className="md:col-span-2">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-3xl md:text-4xl font-serif font-bold">{book.title}</h1>
                <div className="mt-2 text-xl text-muted-foreground">
                  {book.authors.map((author) => author.name).join(", ")}
                </div>
              </motion.div>
              
              <motion.div 
                className="mt-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <h2 className="text-xl font-serif font-bold mb-4">Description</h2>
                <div className="prose dark:prose-invert max-w-none">
                  {book.description.split("\n").map((paragraph, index) => (
                    <p key={index} className="mb-4 leading-relaxed">{paragraph}</p>
                  ))}
                </div>
              </motion.div>

              <motion.div 
                className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Reading Status</div>
                      <div className="font-medium">{getReadStatusLabel()}</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Your Rating</div>
                    <StarRating value={book.rating} readonly size="lg" />
                  </div>

                  <div className="flex items-center gap-2">
                    <BookIcon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Page Count</div>
                      <div className="font-medium">{book.pageCount} pages</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Publication Date</div>
                      <div className="font-medium">{format(new Date(book.publicationDate), "MMMM d, yyyy")}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Added to Library</div>
                      <div className="font-medium">{format(new Date(book.dateAdded), "MMMM d, yyyy")}</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="mt-8 flex flex-col sm:flex-row gap-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => navigate(`/edit/${book.id}`)}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Book Details
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="destructive" 
                      className="flex-1"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove from Library
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete "{book.title}" from your library.
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookDetailPage;
