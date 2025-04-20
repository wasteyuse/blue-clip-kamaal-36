
import { ReactNode } from "react";
import { AdminNavbar } from "./AdminNavbar";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <AdminNavbar />
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
