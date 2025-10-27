import { useState } from "react";
import { login } from "../../service/Auth.service";
import { useNavigate } from "react-router";
import { showToast } from "../../utils/toastUtils";

export default function LoginView() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await login({ Nombre: usuario, Clave: password });
     if (response) {
        showToast("success", "Inicio de sesión exitoso");
        setTimeout(() => navigate("/home"), 2000);
      }
    } catch (err: any) {
      showToast(
        "error",
        "Error de autenticación",
        err.response?.data?.message ||
          "Credenciales inválidas, intenta de nuevo."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[525px] w-2/3 lg:w-[500px] p-2 bg-white/60 backdrop-blur-md rounded-2xl shadow-xl flex items-center justify-center">
      
      <div className="w-full max-w-md">
        <div className="text-center mb-2">
          <h1 className="text-3xl font-bold">Inicio de sesion</h1>
          <p className="text-gray-800">Ingresa tus credenciales para acceder</p>
        </div>

        <div className=" p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-800">
                Nombre de usuario
              </label>
              <div className="relative group">
                <input
                  type="text"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  placeholder="Sofia..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-white 
                             focus:border-principal focus:ring-2 focus:ring-principal/20
                             text-gray-900 placeholder-gray-400 outline-none transition"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-800">
                Contraseña
              </label>
              <div className="relative group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-white 
                             focus:border-principal focus:ring-2 focus:ring-principal/20
                             text-gray-900 placeholder-gray-400 outline-none transition"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-principal hover:bg-principal/90 
                         text-white font-medium py-3 px-4 rounded-lg transition 
                         focus:outline-none focus:ring-2 focus:ring-principal/40 
                         disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 
                      1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Iniciando...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
