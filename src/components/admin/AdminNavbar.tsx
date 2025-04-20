
import { Link, useLocation } from "react-router-dom";
import { Settings, Users, Package, Check, DollarSign, Handshake, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

const adminLinks = [
  { title: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { title: 'Users', path: '/admin/users', icon: Users },
  { title: 'Assets', path: '/admin/assets', icon: Package },
  { title: 'Approvals', path: '/admin/approvals', icon: Check },
  { title: 'Payouts', path: '/admin/payouts', icon: DollarSign },
  { title: 'Affiliates', path: '/admin/affiliates', icon: Handshake },
  { title: 'Settings', path: '/admin/settings', icon: Settings },
];

export function AdminNavbar() {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/admin/dashboard" className="mr-6 flex items-center space-x-2">
            <Settings className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              Admin Panel
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {adminLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  location.pathname === link.path 
                    ? "text-foreground font-semibold" 
                    : "text-foreground/60"
                )}
              >
                <span className="hidden md:flex items-center gap-2">
                  <link.icon className="h-4 w-4" />
                  {link.title}
                </span>
                <link.icon className="h-4 w-4 md:hidden" />
              </Link>
            ))}
          </nav>
        </div>
        
        {/* Mobile Menu */}
        <div className="flex md:hidden">
          <nav className="flex items-center">
            <Link to="/admin/dashboard" className="mr-6 flex items-center space-x-2">
              <Settings className="h-6 w-6" />
              <span className="font-bold">Admin</span>
            </Link>
          </nav>
          <nav className="flex overflow-auto pb-2">
            {adminLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "flex items-center px-4",
                  "transition-colors hover:text-foreground/80",
                  location.pathname === link.path 
                    ? "text-foreground font-semibold" 
                    : "text-foreground/60"
                )}
              >
                <link.icon className="h-4 w-4" />
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </nav>
  );
}

