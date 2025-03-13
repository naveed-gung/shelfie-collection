
import { useState } from "react";
import { useBooks } from "@/context/BookContext";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from "lucide-react";
import Header from "@/components/Header";
import BookGrid from "@/components/BookGrid";
import BookList from "@/components/BookList";
import SearchFilterBar from "@/components/SearchFilterBar";

const HomePage = () => {
  const { 
    filteredBooks, 
    loading, 
    viewMode, 
    setViewMode,
    filterOptions,
    resetFilters
  } = useBooks();

  const hasActiveFilters = 
    filterOptions.genres.length > 0 || 
    filterOptions.readStatus !== null || 
    filterOptions.rating !== null || 
    filterOptions.searchQuery !== "";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex flex-col">
        <SearchFilterBar />
        
        <div className="container mx-auto px-4 flex items-center justify-between py-4">
          <div>
            <h1 className="text-2xl font-serif font-bold">
              {hasActiveFilters ? "Filtered Books" : "Your Library"}
            </h1>
            <p className="text-muted-foreground">
              {filteredBooks.length} {filteredBooks.length === 1 ? "book" : "books"} 
              {hasActiveFilters ? " matching your filters" : " in your collection"}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={resetFilters}
              >
                Clear Filters
              </Button>
            )}
            
            <div className="bg-accent rounded-md flex p-1">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-sm"
                aria-label="Grid view"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-sm"
                aria-label="List view"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex-1">
          {viewMode === "grid" ? (
            <BookGrid books={filteredBooks} loading={loading} />
          ) : (
            <BookList books={filteredBooks} loading={loading} />
          )}
        </div>
      </main>
    </div>
  );
};

export default HomePage;
