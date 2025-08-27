import { useState } from "react";
import { Link } from "react-router";

const handleLogout = () => {
  localStorage.removeItem("AuthToken");
  window.location.href = "/";
};

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(false); // submenu desktop
  const [submenuMobileOpen, setSubmenuMobileOpen] = useState(false); // submenu mobile

  const toggleMenu = () => setOpen(!open);

  return (
    <div className="text-white">
      {/* Navbar para md y lg */}
      <nav className="hidden md:flex bg-principal px-6 py-3 justify-between items-center shadow">
        <div className="font-bold text-lg">Gestor de Mensajes</div>
        <div className="flex gap-6 items-center relative">
          <Link
            to="/home"
            className={`hover:text-gray-200 transition ${
              location.pathname === "/home" ? "underline" : ""
            }`}
          >
            Inicio
          </Link>

          {/* Submenu desktop */}
          <div className="relative">
            <button
              onClick={() => setSubmenuOpen(!submenuOpen)}
              className="hover:text-gray-200 transition flex items-center gap-1"
            >
              Enviar Mensajes ▾
            </button>
            {submenuOpen && (
              <div className="absolute top-full left-0 bg-white text-black shadow-lg rounded-md mt-2 w-48">
                <Link
                  to="/SendMessage"
                  className="block px-4 py-2 hover:text-[#3e50b5]"
                  onClick={() => setSubmenuOpen(false)}
                >
                  Hacer por filtros
                </Link>
                <Link
                  to="/SendMessageById"
                  className="block px-4 py-2 hover:text-[#3e50b5]"
                  onClick={() => setSubmenuOpen(false)}
                >
                  Buscar a una persona
                </Link>
              </div>
            )}
          </div>

          <Link
            to="/reports"
            className={`hover:text-gray-200 transition ${
              location.pathname === "/reports" ? "underline" : ""
            }`}
          >
            Reportes
          </Link>
          <Link
            to="/lock"
            className={`hover:text-gray-200 transition ${
              location.pathname === "/lock" ? "underline" : ""
            }`}
          >
            Actividad
          </Link>
          <button
            onClick={handleLogout}
            className="hover:text-gray-200 transition"
          >
            Cerrar Sesión
          </button>
        </div>
      </nav>

      {/* Barra superior en móvil */}
      <div className="flex md:hidden bg-principal px-4 py-3 justify-between items-center shadow">
        <div className="font-bold text-lg">Gestor de Mensajes</div>
        <button onClick={toggleMenu}>☰</button>
      </div>

      {/* Sidebar en móvil */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-principal transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:hidden z-50`}
      >
        <div className="flex justify-between items-center p-4 bg-principal">
          <span className="font-bold text-lg">Menú</span>
        </div>
        <nav className="flex flex-col p-4 gap-4">
          <Link
            to="/home"
            onClick={() => setOpen(false)}
            className={`hover:text-gray-200 transition ${
              location.pathname === "/home" ? "underline" : ""
            }`}
          >
            Inicio
          </Link>

          {/* Submenu móvil */}
          <div>
            <button
              onClick={() => setSubmenuMobileOpen(!submenuMobileOpen)}
              className="w-full text-left hover:text-gray-200 transition flex justify-between"
            >
              Enviar Mensajes {submenuMobileOpen ? "▾" : "▸"}
            </button>
            {submenuMobileOpen && (
              <div className="ml-4 mt-2 flex flex-col gap-2">
                <Link
                  to="/SendMessage"
                  onClick={() => {
                    setOpen(false);
                    setSubmenuMobileOpen(false);
                  }}
                  className="hover:text-black transition"
                >
                  Hacer por filtros
                </Link>
                <Link
                  to="/SendMessageById"
                  onClick={() => {
                    setOpen(false);
                    setSubmenuMobileOpen(false);
                  }}
                  className="hover:text-black transition"
                >
                  Buscar a una persona
                </Link>
              </div>
            )}
          </div>

          <Link
            to="/reports"
            onClick={() => setOpen(false)}
            className={`hover:text-gray-200 transition ${
              location.pathname === "/reports" ? "underline" : ""
            }`}
          >
            Reportes
          </Link>
          <Link
            to="/lock"
            onClick={() => setOpen(false)}
            className={`hover:text-gray-200 transition ${
              location.pathname === "/lock" ? "underline" : ""
            }`}
          >
            Actividad
          </Link>
          <button
            onClick={handleLogout}
            className="text-left hover:text-gray-200 transition"
          >
            Cerrar Sesión
          </button>
        </nav>
      </div>

      {/* Overlay para cerrar sidebar */}
      {open && (
        <div
          className="fixed inset-0 bg-black/20 bg-opacity-50 md:hidden"
          onClick={toggleMenu}
        />
      )}
    </div>
  );
}
