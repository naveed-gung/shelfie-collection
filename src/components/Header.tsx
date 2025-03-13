
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Book, Library, Plus, Settings, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "./ThemeToggle";
import { useBooks } from "@/context/BookContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { books } = useBooks();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path ? "bg-accent text-accent-foreground" : "";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
            <Book className="h-6 w-6 text-primary" />
            <span className="text-xl font-serif font-bold">Shelfie</span>
          </Link>
          <span className="hidden md:block text-muted-foreground">|</span>
          <span className="hidden md:block text-sm text-muted-foreground">
            {books.length} {books.length === 1 ? "book" : "books"} in your library
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/">
            <Button variant="ghost" className={`flex items-center gap-2 ${isActive("/")}`}>
              <Library className="h-4 w-4" />
              <span>Library</span>
            </Button>
          </Link>
          <Link to="/add">
            <Button variant="ghost" className={`flex items-center gap-2 ${isActive("/add")}`}>
              <Plus className="h-4 w-4" />
              <span>Add Book</span>
            </Button>
          </Link>
          <Link to="/settings">
            <Button variant="ghost" className={`flex items-center gap-2 ${isActive("/settings")}`}>
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Button>
          </Link>
          <ThemeToggle />
        </nav>

        {/* Mobile Navigation Toggle */}
        <div className="flex md:hidden items-center gap-4">
          <ThemeToggle />
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleMenu} 
            aria-label="Toggle menu" 
            className="relative p-2 rounded-full hover:bg-accent focus:bg-accent"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5 transition-transform duration-200" />
            ) : (
              <Menu className="h-5 w-5 transition-transform duration-200" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 bg-background/95 backdrop-blur-sm md:hidden animate-in fade-in slide-in-from-top-5 duration-300">
          <nav className="container flex flex-col p-6 gap-4">
            <Link to="/" onClick={closeMenu}>
              <Button 
                variant="ghost" 
                className={`w-full justify-start text-lg py-4 ${isActive("/")}`}
              >
                <Library className="mr-3 h-5 w-5" />
                Library
              </Button>
            </Link>
            <Link to="/add" onClick={closeMenu}>
              <Button 
                variant="ghost" 
                className={`w-full justify-start text-lg py-4 ${isActive("/add")}`}
              >
                <Plus className="mr-3 h-5 w-5" />
                Add Book
              </Button>
            </Link>
            <Link to="/settings" onClick={closeMenu}>
              <Button 
                variant="ghost" 
                className={`w-full justify-start text-lg py-4 ${isActive("/settings")}`}
              >
                <Settings className="mr-3 h-5 w-5" />
                Settings
              </Button>
            </Link>
            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-muted-foreground">
                {books.length} {books.length === 1 ? "book" : "books"} in your library
              </p>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
