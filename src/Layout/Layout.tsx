import { Outlet } from "react-router";
import NavBar from "../components/NavBar";

export default function Layout() {
  return (
    <>
    <NavBar />
      <main className="mt-10 p-4 w-full">
        <Outlet />
      </main>
    </>
  );
}
