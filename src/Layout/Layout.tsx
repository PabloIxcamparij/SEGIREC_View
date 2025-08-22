import { Outlet } from "react-router";
import NavBar from "../components/NavBar";

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <main className="p-4 w-full">
        <Outlet />
      </main>
    </div>
  );
}
