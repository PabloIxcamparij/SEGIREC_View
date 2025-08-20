import { useState } from "react";
import { Link, useLocation } from "react-router";

const links = [
    { path: "/home", label: "Inicio" },
    { path: "/SendMessage", label: "Enviar Mensajes" },
    { path: "/reports", label: "Reportes" },
    { path: "/lock", label: "Actividad" },
    { path: "/", label: "Cerrar Sesión" },
];



export default function NavBar() {
    
    const [open, setOpen] = useState(false);
    const location = useLocation();
    
    if (location.pathname === "/") return null;

    const toggleMenu = () => setOpen(!open);

    return (
        <>
            {/* Navbar para md y lg */}
            <nav className="hidden md:flex bg-blue-600 text-white px-6 py-3 justify-between items-center shadow">
                <div className="font-bold text-lg">MiApp</div>
                <div className="flex gap-6">
                    {links.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`hover:text-gray-200 transition ${location.pathname === link.path ? "underline" : ""
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </nav>

            {/* Barra superior en móvil */}
            <div className="flex md:hidden bg-blue-600 text-white px-4 py-3 justify-between items-center shadow">
                <div className="font-bold text-lg">MiApp</div>
                <button onClick={toggleMenu}>
                    ☰
                </button>
            </div>

            {/* Sidebar en móvil */}
            <div
                className={`fixed top-0 left-0 h-full w-64 bg-blue-700 text-white transform ${open ? "translate-x-0" : "-translate-x-full"
                    } transition-transform duration-300 ease-in-out md:hidden z-50`}
            >
                <div className="flex justify-between items-center p-4 border-b border-blue-500">
                    <span className="font-bold text-lg">Menú</span>
                    <button onClick={toggleMenu}>
                       X
                    </button>
                </div>
                <nav className="flex flex-col p-4 gap-4">
                    {links.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            onClick={() => setOpen(false)} // cerrar sidebar al navegar
                            className={`hover:text-gray-200 transition ${location.pathname === link.path ? "underline" : ""
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Overlay para cerrar sidebar */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/20 bg-opacity-50 md:hidden"
                    onClick={toggleMenu}
                />
            )}
        </>
    );
}
