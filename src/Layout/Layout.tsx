import { Outlet } from "react-router";

export default function Layout() {
  return (
    <>
      <main className="mt-10">
        <Outlet />
      </main>
    </>
  );
}
