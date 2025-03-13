
import { useState, useEffect, useRef } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useBooks } from "@/context/BookContext";
import { sampleGenres } from "@/lib/sample-data";
import { ReadStatus } from "@/types/book";

const SearchFilterBar = () => {
  const { 
    filterOptions, 
    updateFilterOptions, 
    resetFilters, 
    books 
  } = useBooks();
  
  const [searchQuery, setSearchQuery] = useState(filterOptions.searchQuery);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const lastScrollY = useRef(0);
  
  // Update local state when filter options change
  useEffect(() => {
    setSearchQuery(filterOptions.searchQuery);
  }, [filterOptions.searchQuery]);
  
  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      updateFilterOptions({ searchQuery });
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery, updateFilterOptions]);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
      
      lastScrollY.current = currentScrollY;
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Get unique genres from actual books
  const availableGenres = Array.from(
    new Set(books.flatMap(book => book.genres.map(genre => genre.id)))
  );
  
  // Filter sample genres to only include those in the current books
  const activeGenres = sampleGenres.filter(genre => 
    availableGenres.includes(genre.id)
  );

  const handleResetFilters = () => {
    resetFilters();
    setSearchQuery("");
    setIsFiltersOpen(false);
  };

  return (
    <div 
      className={`${
        isSticky 
          ? "sticky top-16 z-20 bg-background/80 backdrop-blur-sm shadow-md" 
          : "relative bg-background"
      } p-4 border-b transition-all duration-200`}
    >
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, author or description..."
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1 h-8 w-8"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <Popover open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline"
              className="flex items-center gap-2 min-w-[120px]"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters</span>
              {(filterOptions.genres.length > 0 || 
                filterOptions.readStatus || 
                filterOptions.rating) && (
                <span className="ml-1 rounded-full bg-primary w-2 h-2" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-background/95 backdrop-blur-sm">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Filters</h4>
                <p className="text-sm text-muted-foreground">
                  Narrow down your book collection
                </p>
              </div>
              <Separator />
              
              <div className="space-y-2">
                <h5 className="font-medium text-sm">Reading Status</h5>
                <RadioGroup 
                  value={filterOptions.readStatus || ""}
                  onValueChange={(value) => 
                    updateFilterOptions({ 
                      readStatus: value ? value as ReadStatus : null 
                    })
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="" id="status-all" />
                    <Label htmlFor="status-all">All</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="read" id="status-read" />
                    <Label htmlFor="status-read">Read</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="reading" id="status-reading" />
                    <Label htmlFor="status-reading">Currently Reading</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="want-to-read" id="status-want" />
                    <Label htmlFor="status-want">Want to Read</Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />
              
              <div className="space-y-2">
                <h5 className="font-medium text-sm">Rating</h5>
                <RadioGroup 
                  value={filterOptions.rating?.toString() || ""}
                  onValueChange={(value) => 
                    updateFilterOptions({ 
                      rating: value ? parseInt(value) : null 
                    })
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="" id="rating-all" />
                    <Label htmlFor="rating-all">All Ratings</Label>
                  </div>
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div 
                      key={rating} 
                      className="flex items-center space-x-2"
                    >
                      <RadioGroupItem 
                        value={rating.toString()} 
                        id={`rating-${rating}`} 
                      />
                      <Label htmlFor={`rating-${rating}`}>
                        {rating} Star{rating !== 1 ? "s" : ""}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <Separator />
              
              <div className="space-y-2">
                <h5 className="font-medium text-sm">Genres</h5>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                  {activeGenres.map((genre) => (
                    <div 
                      key={genre.id} 
                      className="flex items-center space-x-2"
                    >
                      <Checkbox 
                        id={`genre-${genre.id}`}
                        checked={filterOptions.genres.includes(genre.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateFilterOptions({
                              genres: [...filterOptions.genres, genre.id]
                            });
                          } else {
                            updateFilterOptions({
                              genres: filterOptions.genres.filter(
                                (id) => id !== genre.id
                              )
                            });
                          }
                        }}
                      />
                      <Label htmlFor={`genre-${genre.id}`} className="text-sm">
                        {genre.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                variant="outline" 
                onClick={handleResetFilters}
                className="w-full"
              >
                Reset All Filters
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default SearchFilterBar;
