
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BookProvider } from "./context/BookContext";
import { Toaster } from "./components/ui/toaster";
import HomePage from "./pages/HomePage";
import BookDetailPage from "./pages/BookDetailPage";
import BookFormPage from "./pages/BookFormPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BookProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/book/:id" element={<BookDetailPage />} />
            <Route path="/add" element={<BookFormPage />} />
            <Route path="/edit/:id" element={<BookFormPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </Router>
      </BookProvider>
    </QueryClientProvider>
  );
}

export default App;
