import { Outlet } from "react-router";

export default function LayoutAuth() {
  return (
    <div className="min-h-screen bg-principal">
        <main className="w-screen h-screen flex items-center justify-center">
          <Outlet />
        </main>
    </div>
  );
}
