import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useBooks } from "@/context/BookContext";
import { BookFormData } from "@/types/book";
import { CustomInput } from "@/components/ui/custom-input";
import { Button } from "@/components/ui/button";
import { convertFileToBase64 } from "@/utils/storage";
import { motion } from "framer-motion";

const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  authors: z.string().min(1, "Author is required"),
  description: z.string().optional(),
  genre: z.string().optional(),
  isbn: z.string().optional(),
  pageCount: z.number().positive().optional(),
  publishedDate: z.string().optional(),
  publisher: z.string().optional(),
  readStatus: z.enum(["read", "reading", "to-read"]).optional(),
  rating: z.number().min(0).max(5).optional(),
  notes: z.string().optional(),
});

type BookFormProps = {
  initialData?: Partial<BookFormData>;
  onSubmit: (data: BookFormData) => Promise<void>;
  onCancel: () => void;
};

const BookForm: React.FC<BookFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [coverImage, setCoverImage] = useState<string | undefined>(
    initialData?.coverImage
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: initialData || {},
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const base64 = await convertFileToBase64(e.target.files[0]);
        setCoverImage(base64);
      } catch (error) {
        console.error("Error converting image:", error);
      }
    }
  };

  const handleFormSubmit = async (data: BookFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit({ ...data, coverImage });
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants for form elements
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-6">
        {/* Cover Image Upload */}
        <div className="w-full md:w-1/3">
          <div 
            className="relative h-64 w-full border-2 border-dashed border-book-brown rounded-md flex items-center justify-center overflow-hidden group"
            style={{ background: coverImage ? 'transparent' : '#f8f9fa' }}
          >
            {coverImage ? (
              <img
                src={coverImage}
                alt="Book cover"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="text-center p-4">
                <p className="text-book-brown mb-2">Upload Cover Image</p>
                <p className="text-sm text-gray-500">Click or drag an image here</p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="absolute inset-0 bg-book-brown opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          </div>
        </div>

        {/* Book Details */}
        <div className="w-full md:w-2/3 space-y-4">
          <motion.div variants={itemVariants}>
            <CustomInput
              label="Title"
              {...register("title")}
              error={errors.title?.message}
              placeholder="Book title"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <CustomInput
              label="Author(s)"
              {...register("authors")}
              error={errors.authors?.message}
              placeholder="Author names (comma separated)"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <CustomInput
              label="Genre"
              {...register("genre")}
              error={errors.genre?.message}
              placeholder="Book genre"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomInput
              label="ISBN"
              {...register("isbn")}
              error={errors.isbn?.message}
              placeholder="ISBN"
            />
            <CustomInput
              label="Page Count"
              type="number"
              {...register("pageCount", { valueAsNumber: true })}
              error={errors.pageCount?.message}
              placeholder="Number of pages"
            />
          </motion.div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          {...register("description")}
          rows={4}
          className="w-full px-4 py-2 rounded-md outline-none transition-all duration-300 ring-1 ring-book-brown focus:ring-2 hover:ring-opacity-80"
          placeholder="Book description"
        />
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reading Status
          </label>
          <select
            {...register("readStatus")}
            className="w-full px-4 py-2 rounded-md outline-none transition-all duration-300 ring-1 ring-book-brown focus:ring-2 hover:ring-opacity-80"
          >
            <option value="">Select status</option>
            <option value="read">Read</option>
            <option value="reading">Currently Reading</option>
            <option value="to-read">To Read</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating
          </label>
          <select
            {...register("rating", { valueAsNumber: true })}
            className="w-full px-4 py-2 rounded-md outline-none transition-all duration-300 ring-1 ring-book-brown focus:ring-2 hover:ring-opacity-80"
          >
            <option value="">Select rating</option>
            <option value="1">1 Star</option>
            <option value="2">2 Stars</option>
            <option value="3">3 Stars</option>
            <option value="4">4 Stars</option>
            <option value="5">5 Stars</option>
          </select>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CustomInput
          label="Publisher"
          {...register("publisher")}
          error={errors.publisher?.message}
          placeholder="Publisher name"
        />
        <CustomInput
          label="Published Date"
          type="date"
          {...register("publishedDate")}
          error={errors.publishedDate?.message}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes
        </label>
        <textarea
          {...register("notes")}
          rows={3}
          className="w-full px-4 py-2 rounded-md outline-none transition-all duration-300 ring-1 ring-book-brown focus:ring-2 hover:ring-opacity-80"
          placeholder="Your notes about this book"
        />
      </motion.div>

      <motion.div 
        variants={itemVariants}
        className="flex justify-end space-x-4"
      >
        <Button
          type="button"
          onClick={onCancel}
          variant="outline"
          className="border-book-brown text-book-brown hover:bg-book-brown/10"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-book-brown hover:bg-book-brown/90 text-white"
        >
          {isSubmitting ? "Saving..." : initialData?.id ? "Update Book" : "Add Book"}
        </Button>
      </motion.div>
    </motion.form>
  );
};

export default BookForm;
