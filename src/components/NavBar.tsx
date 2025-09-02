import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { showToast } from "../utils/toastUtils";

const handleLogout = () => {
  showToast("info", "Cerrando sesión");

  setTimeout(() => {
    localStorage.removeItem("AuthToken");
    window.location.href = "/";
  }, 2000);
};

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(false);

  const navItems = [
    { href: "/home", label: "Inicio" },
    { href: "/reports", label: "Reportes" },
    { href: "/lock", label: "Actividad" },
  ];

  const submenuItemsSendMessage = [
    { href: "/SendMessage", label: "Hacer por filtros" },
    { href: "/SendMessageById", label: "Buscar a una persona" },
    { href: "/SendMessageByArchive", label: "Buscar por archivo" },
  ];

  const submenuRef = useRef<HTMLDivElement | null>(null);

  const toggleMenu = () => setOpen(!open);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        submenuRef.current &&
        !submenuRef.current.contains(event.target as Node)
      ) {
        setSubmenuOpen(false);
      }
    };

    if (submenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [submenuOpen]);

  return (
    <div className="text-white">
      {/* Navbar para md y lg */}
      <nav className="hidden md:flex h-16 bg-principal px-6 py-3 justify-between items-center shadow">
        <div className="font-bold text-lg">Gestor de Mensajes</div>

        <div className="flex gap-6 items-center relative">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setOpen(false)}
              className="hover:text-gray-200 transition"
            >
              {item.label}
            </Link>
          ))}

          {/* Submenu desktop */}
          <div className="relative" ref={submenuRef}>
            <button
              onClick={() => setSubmenuOpen(!submenuOpen)}
              className="hover:text-gray-200 transition flex items-center gap-1"
            >
              Enviar Mensajes ▾
            </button>
            {submenuOpen && (
              <div className="absolute top-full left-0 bg-white text-black shadow-lg rounded-md mt-2 w-58 z-50">
                {submenuItemsSendMessage.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setSubmenuOpen(false)}
                    className="block px-4 py-2 hover:text-[#3e50b5]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="text-left text-red-300 hover:text-red-200 transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      </nav>

      {/* Barra superior en móvil */}
      <div className="flex md:hidden h-16 bg-principal px-4 py-3 justify-between items-center shadow">
        <div className="font-bold text-lg">Gestor de Mensajes</div>
        <button className="text-2xl hover:text-gray-300" onClick={toggleMenu}>
          ☰
        </button>
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
          {navItems.map((item) => (
            <Link key={item.href} to={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}

          {/* Submenu móvil */}
          <div className="border-t border-slate-700 pt-4">
            <div className="text-sm font-medium text-gray-300 mb-3">
              Enviar Mensajes
            </div>
            <div className="ml-4 flex flex-col gap-3">
              {submenuItemsSendMessage.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => {
                    setOpen(false);
                  }}
                  className="text-gray-200 hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="text-left text-red-300 hover:text-red-200 transition-colors mt-4 pt-4 border-t border-slate-700"
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
