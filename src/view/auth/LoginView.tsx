import { useState } from "react";
import { useNavigate } from 'react-router';
import { login } from "../../service/LoginService";

export default function LoginView() {
    const [usuario, setUsuario] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await login({ correo: usuario, password });
            localStorage.setItem("AuthToken", response.token);
            navigate("/home");
        } catch (err: any) {
            setError(err.response?.data?.message || "Error en login");
        }
    };

    return (
        <div className="flex mt-17 justify-center items-center">
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-lg rounded-xl p-8 w-full max-w-sm space-y-6"
            >
                <h1 className="text-2xl font-bold text-center text-principal">
                    Iniciar Sesión
                </h1>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Usuario</label>
                    <input
                        type="text"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                        placeholder="Ingresa tu correo"
                        className="mt-1 w-full p-2 border rounded-md"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Ingresa tu contraseña"
                        className="mt-1 w-full p-2 border rounded-md"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-principal text-white py-2 rounded-md hover:bg-blue-700 transition"
                >
                    Ingresar
                </button>

                {error && <p className="text-red-500 text-center text-sm">{error}</p>}

            </form>
        </div>
    );
}
