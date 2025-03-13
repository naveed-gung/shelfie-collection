
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBooks } from "@/context/BookContext";
import { v4 as uuidv4 } from "uuid";
import { Book, BookFormData, ReadStatus } from "@/types/book";
import Header from "@/components/Header";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import StarRating from "@/components/StarRating";
import { sampleGenres } from "@/lib/sample-data";
import { convertFileToBase64 } from "@/utils/storage";
import { useToast } from "@/hooks/use-toast";

const defaultCoverImage = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=500&h=750";

const BookFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getBookById, addBook, updateBook } = useBooks();
  const { toast } = useToast();
  const isEditMode = Boolean(id);
  
  const [title, setTitle] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [coverImage, setCoverImage] = useState(defaultCoverImage);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [publicationDate, setPublicationDate] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [readStatus, setReadStatus] = useState<ReadStatus>("want-to-read");
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  
  useEffect(() => {
    if (isEditMode && id) {
      const book = getBookById(id);
      
      if (book) {
        setTitle(book.title);
        setAuthorName(book.authors.map(author => author.name).join(", "));
        setCoverImage(book.coverImage);
        setCoverPreview(book.coverImage);
        setSelectedGenres(book.genres.map(genre => genre.id));
        setPublicationDate(book.publicationDate);
        setPageCount(book.pageCount);
        setReadStatus(book.readStatus);
        setRating(book.rating);
        setDescription(book.description);
      }
    }
  }, [id, isEditMode, getBookById]);

  const handleCoverImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      try {
        setCoverPreview(URL.createObjectURL(file));
        
        const base64 = await convertFileToBase64(file);
        setCoverImage(base64);
      } catch (error) {
        console.error("Error processing image:", error);
        toast({
          title: "Error",
          description: "Failed to process the cover image",
          variant: "destructive",
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const authors = authorName
        .split(",")
        .map(name => name.trim())
        .filter(name => name !== "")
        .map(name => ({ id: uuidv4(), name }));
      
      const genres = selectedGenres.map(genreId => {
        const genre = sampleGenres.find(g => g.id === genreId);
        return genre ? { id: genre.id, name: genre.name } : { id: genreId, name: genreId };
      });
      
      const bookData: BookFormData = {
        title,
        authors,
        coverImage,
        genres,
        publicationDate,
        pageCount,
        readStatus,
        rating,
        description,
      };
      
      if (isEditMode && id) {
        updateBook(id, bookData);
        toast({
          title: "Book updated",
          description: `"${title}" has been updated successfully`,
        });
      } else {
        addBook(bookData);
        toast({
          title: "Book added",
          description: `"${title}" has been added to your library`,
        });
      }
      
      navigate("/");
    } catch (error) {
      console.error("Error saving book:", error);
      toast({
        title: "Error",
        description: "There was a problem saving the book",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container max-w-4xl px-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6 -ml-2 text-muted-foreground"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back
          </Button>
          
          <h1 className="text-3xl font-serif font-bold mb-8">
            {isEditMode ? "Edit Book" : "Add New Book"}
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-base">Title *</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Book title"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="author" className="text-base">Author(s) *</Label>
                    <Input
                      id="author"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="Author names (comma separated)"
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      For multiple authors, separate with commas
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="publicationDate" className="text-base">Publication Date</Label>
                    <Input
                      id="publicationDate"
                      type="date"
                      value={publicationDate}
                      onChange={(e) => setPublicationDate(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="pageCount" className="text-base">Page Count</Label>
                    <Input
                      id="pageCount"
                      type="number"
                      min={0}
                      value={pageCount || ""}
                      onChange={(e) => setPageCount(parseInt(e.target.value) || 0)}
                      placeholder="Number of pages"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="coverImage" className="text-base">Cover Image</Label>
                    <div className="flex flex-col items-center">
                      <div className="relative aspect-[2/3] w-40 overflow-hidden rounded-md mb-4">
                        <img
                          src={coverPreview || coverImage}
                          alt="Book cover preview"
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      </div>
                      <Input
                        id="coverImage"
                        type="file"
                        accept="image/*"
                        onChange={handleCoverImageChange}
                        className="w-full"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Recommended size: 500x750 pixels
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="readStatus" className="text-base">Reading Status</Label>
                    <Select
                      value={readStatus}
                      onValueChange={(value) => setReadStatus(value as ReadStatus)}
                    >
                      <SelectTrigger id="readStatus">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="read">Read</SelectItem>
                        <SelectItem value="reading">Currently Reading</SelectItem>
                        <SelectItem value="want-to-read">Want to Read</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-base">Your Rating</Label>
                    <div className="mt-2">
                      <StarRating
                        value={rating}
                        onChange={setRating}
                        size="lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <Label className="text-base">Genres</Label>
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                {sampleGenres.map((genre) => (
                  <div key={genre.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`genre-${genre.id}`}
                      checked={selectedGenres.includes(genre.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedGenres([...selectedGenres, genre.id]);
                        } else {
                          setSelectedGenres(
                            selectedGenres.filter((id) => id !== genre.id)
                          );
                        }
                      }}
                    />
                    <Label
                      htmlFor={`genre-${genre.id}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {genre.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Label htmlFor="description" className="text-base">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Book description or your notes"
                rows={6}
                className="mt-1 resize-none"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !title || !authorName}
                className="flex-1"
              >
                {loading ? "Saving..." : isEditMode ? "Update Book" : "Add Book"}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default BookFormPage;
