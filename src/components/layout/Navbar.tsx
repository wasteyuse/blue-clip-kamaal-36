
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export function Navbar() {
  const { user, signOut } = useAuth();
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
        
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/" className="text-sm font-medium hover:text-primary px-4 py-2">
                Home
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
              <NavigationMenuContent className="bg-white p-4 rounded-md shadow-lg min-w-[200px]">
                <div className="grid gap-2">
                  <Link 
                    to="/dashboard/assets" 
                    className="text-sm hover:bg-gray-100 p-2 rounded-md"
                  >
                    Assets Library
                  </Link>
                  <Link 
                    to="/dashboard/content" 
                    className="text-sm hover:bg-gray-100 p-2 rounded-md"
                  >
                    Content
                  </Link>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Earnings</NavigationMenuTrigger>
              <NavigationMenuContent className="bg-white p-4 rounded-md shadow-lg min-w-[200px]">
                <div className="grid gap-2">
                  <Link 
                    to="/dashboard/earnings" 
                    className="text-sm hover:bg-gray-100 p-2 rounded-md"
                  >
                    My Earnings
                  </Link>
                  <Link 
                    to="/dashboard/payouts" 
                    className="text-sm hover:bg-gray-100 p-2 rounded-md"
                  >
                    Payouts
                  </Link>
                  <Link 
                    to="/dashboard/affiliate" 
                    className="text-sm hover:bg-gray-100 p-2 rounded-md"
                  >
                    Affiliate Program
                  </Link>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link to="/apply" className="text-sm font-medium hover:text-primary px-4 py-2">
                Apply Now
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/dashboard')}
              >
                Dashboard
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarImage src="/placeholder.svg" alt={user.email || 'User'} />
                    <AvatarFallback>{user.email?.[0].toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => navigate('/dashboard/profile')}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => navigate('/dashboard/settings')}>
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={signOut}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
