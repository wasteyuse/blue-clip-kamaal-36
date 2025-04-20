
import { Outlet } from "react-router-dom";
import { AdminNavbar } from "./AdminNavbar";

export function AdminLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <AdminNavbar />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
