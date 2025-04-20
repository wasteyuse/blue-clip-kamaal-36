
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

export function Navbar() {
  const isLoggedIn = false; // Will connect to auth later
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-700 to-blue-500 w-8 h-8 rounded-md flex items-center justify-center">
              <span className="font-bold text-white">BH</span>
            </div>
            <span className="font-bold text-xl hidden md:inline-block bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
              BlueHustle
            </span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-primary">
            Home
          </Link>
          <Link to="/how-it-works" className="text-sm font-medium hover:text-primary">
            How It Works
          </Link>
          <Link to="/creators" className="text-sm font-medium hover:text-primary">
            Creators
          </Link>
        </nav>
        
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/dashboard')}
              >
                Dashboard
              </Button>
              <Avatar className="h-8 w-8 cursor-pointer" onClick={() => navigate('/profile')}>
                <AvatarImage src="/placeholder.svg" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={() => navigate('/register')}
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
