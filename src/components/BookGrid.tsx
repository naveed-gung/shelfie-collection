import { useState } from "react";
import { Book as BookType } from "@/types/book";
import BookCard from "./BookCard";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface BookGridProps {
  books: BookType[];
  loading: boolean;
}

const BookGrid: React.FC<BookGridProps> = ({ books, loading }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { 
      scale: 0.8,
      y: 50,
      opacity: 0,
      rotate: -5,
    },
    visible: {
      scale: 1,
      y: 0,
      opacity: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.6,
      },
    },
    hover: {
      y: -10,
      scale: 1.05,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-6">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-muted rounded-md aspect-[2/3]"></div>
            <div className="mt-2 bg-muted h-4 rounded w-3/4"></div>
            <div className="mt-1 bg-muted h-3 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-center">
          <h2 className="text-2xl font-serif font-bold">No books found</h2>
          <p className="text-muted-foreground mt-2">
            Try adjusting your filters or add some books to your library.
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 p-6"
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      {books.map((book, index) => (
        <motion.div
          key={book.id}
          variants={cardVariants}
          whileHover="hover"
          layout
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          className="book-card-container"
        >
          <BookCard book={book} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default BookGrid;
