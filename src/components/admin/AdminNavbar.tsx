
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
    <nav className="sticky top-0 z-50 w-full bg-blue-800 text-white shadow-md">
      <div className="container flex h-14 items-center">
        <div className="flex items-center gap-6">
          <Link to="/admin/dashboard" className="flex items-center space-x-2">
            <Settings className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              Admin Panel
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm">
            {adminLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "flex items-center gap-2 transition-colors hover:text-blue-200",
                  location.pathname === link.path 
                    ? "text-white font-semibold" 
                    : "text-blue-100"
                )}
              >
                <link.icon className="h-4 w-4" />
                <span>{link.title}</span>
              </Link>
            ))}
          </nav>
        </div>
        
        {/* Mobile Menu */}
        <div className="flex md:hidden ml-auto">
          <nav className="flex overflow-auto pb-2">
            {adminLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "flex items-center px-4",
                  "transition-colors hover:text-blue-200",
                  location.pathname === link.path 
                    ? "text-white" 
                    : "text-blue-100"
                )}
              >
                <link.icon className="h-5 w-5" />
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </nav>
  );
}
