import { Outlet } from "react-router";

export default function LayoutAuth() {
  return (
    <div className="min-h-screen bg-gray-100">
        <main className="p-4 w-full">
          <Outlet />
        </main>
    </div>
  );
}
