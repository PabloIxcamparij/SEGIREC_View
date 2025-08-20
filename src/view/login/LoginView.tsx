import { useState } from "react";
import { useNavigate } from 'react-router';

export default function LoginView() {
    const [usuario, setUsuario] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Usuario:", usuario);
        console.log("Contraseña:", password);
        navigate("/home");
    };

    return (
        <div className="flex items-center justify-center">
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-lg rounded-xl p-8 w-full max-w-sm space-y-6"
            >
                <h1 className="text-2xl font-bold text-center text-blue-600">
                    Iniciar Sesión
                </h1>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Usuario
                    </label>
                    <input
                        type="text"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                        placeholder="Ingresa tu usuario"
                        className="mt-1 w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Contraseña
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Ingresa tu contraseña"
                        className="mt-1 w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                >
                    Ingresar
                </button>
            </form>
        </div>
    );
}
