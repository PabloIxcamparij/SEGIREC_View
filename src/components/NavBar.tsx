import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { logout } from "../service/LoginService";
import { showToast } from "../utils/toastUtils";

const handleLogout = async () => {
  const response = await logout();
  if (response) {
    showToast("info", "Cerrando sesión", "Hasta pronto!");
    setTimeout(() => {
      window.location.href = "/";
    }, 2000);
  }
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
    { href: "/propiedades", label: "Buscar por propiedades" },
    { href: "/morosidad", label: "Buscar por morosidad" },
    { href: "/envioMasivo", label: "Envio masivo de mensajes" },
  ];

  const submenuRef = useRef<HTMLDivElement | null>(null);

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
    <div className="text-principal mt-5 mr-15 ml-15">
      {/* Navbar para md y lg */}

      <nav className="hidden lg:flex w-full h-18 bg-white border-principal border-2 justify-between px-5 items-center shadow rounded-2xl">
        <h1 className="font-bold text-lg">Gestor de Mensajes</h1>
        <div className="flex gap-6 items-center relative mr-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setOpen(false)}
              className="hover:text-black transition"
            >
              {item.label}
            </Link>
          ))}

          {/* Submenu desktop */}
          <div className="relative" ref={submenuRef}>
            <button
              onClick={() => setSubmenuOpen(!submenuOpen)}
              className="hover:text-black transition flex items-center gap-1"
            >
              Enviar Mensajes ▾
            </button>
            {submenuOpen && (
              <div className="absolute top-full left-0 bg-white text-black border-2 rounded-2xl mt-7 w-81.5 z-50">
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
            className="font-bold text-red-500 hover:text-red-300 transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      </nav>

      {/* Barra superior en móvil */}
      <div className="flex lg:hidden h-18 bg-white border-principal border-2 px-6 py-3 justify-between items-center shadow rounded-2xl">
        <div className="font-bold text-lg">Gestor de Mensajes</div>
        <button
          className="text-2xl hover:text-gray-300"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {/* Sidebar en móvil */}
      <div
        className={`fixed top-0 left-0 h-full w-64 py-4 bg-white transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:hidden z-50`}
      >
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg p-4">Menú</span>
          <button
            onClick={() => setOpen(false)}
            className="text-lg font-extrabold text-red-500 px-10 hover:text-red-300 transition-colors"
          >
            X
          </button>
        </div>

        <nav className="flex flex-col p-4 gap-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setOpen(false)}
              className="hover:text-black"
            >
              {item.label}
            </Link>
          ))}

          {/* Submenu móvil */}
          <div className="border-t border-slate-700 pt-4">
            <div className="text-sm font-medium mb-3">Enviar Mensajes</div>

            <div className="ml-4 flex flex-col gap-3">
              {submenuItemsSendMessage.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => {
                    setOpen(false);
                  }}
                  className=" hover:text-black transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="text-left text-red-500 hover:text-red-200 transition-colors mt-4 pt-4 border-t border-slate-700"
          >
            Cerrar Sesión
          </button>
        </nav>
      </div>

      {/* Overlay para cerrar sidebar */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 bg-opacity-50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  );
}
