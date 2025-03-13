
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useBooks } from "@/context/BookContext";

const SettingsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { exportLibrary, importLibrary, clearLibrary } = useBooks();
  
  const handleExport = () => {
    try {
      exportLibrary();
      toast({
        title: "Library exported",
        description: "Your library has been exported successfully",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was a problem exporting your library",
        variant: "destructive",
      });
    }
  };
  
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        if (typeof event.target?.result === "string") {
          importLibrary(event.target.result);
          toast({
            title: "Library imported",
            description: "Your library has been imported successfully",
          });
        }
      } catch (error) {
        toast({
          title: "Import failed",
          description: "There was a problem importing your library",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    
    e.target.value = "";
  };
  
  const handleClearLibrary = () => {
    if (window.confirm("Are you sure you want to clear your entire library? This action cannot be undone.")) {
      clearLibrary();
      toast({
        title: "Library cleared",
        description: "Your library has been cleared successfully",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container max-w-3xl px-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6 -ml-2 text-muted-foreground"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back
          </Button>
          
          <h1 className="text-3xl font-serif font-bold mb-8">Settings</h1>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                  Customize how the application looks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Toggle between light and dark theme
                    </p>
                  </div>
                  {/* Dark mode toggle is handled by ThemeToggle component in the header */}
                  <div className="text-muted-foreground">
                    Managed in header
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="animations">Animations</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable or disable animations
                    </p>
                  </div>
                  <Switch id="animations" defaultChecked />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>
                  Import, export, or clear your library data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-4">
                  <Button variant="outline" onClick={handleExport}>
                    Export Library
                  </Button>
                  
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById("import-file")?.click()}
                    >
                      Import Library
                    </Button>
                    <input
                      id="import-file"
                      type="file"
                      accept=".json"
                      onChange={handleImport}
                      className="hidden"
                    />
                    <p className="text-xs text-muted-foreground">
                      Import must be a valid JSON file previously exported from this application
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="destructive"
                  onClick={handleClearLibrary}
                  className="w-full"
                >
                  Clear Library
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
                <CardDescription>
                  Information about this application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Book Library App
                  <br />
                  Version 1.0.0
                  <br />
                  <br />
                  A personal book library management application.
                  <br />
                  This app allows you to manage your book collection, track your reading
                  progress, and organize your library.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
