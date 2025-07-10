import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { FcGoogle } from 'react-icons/fc'; // ícono de Google sin fondo

export default function Login() {
  const { usuario, login, logout } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error('Login fallido');

      const data = await res.json();
      login(data);
      navigate(data.rol === 'admin' ? '/admin' : '/');
    } catch (error) {
      alert('Correo o contraseña incorrectos');
      console.error('Error en login:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const { displayName, email, uid } = result.user;

      const requestBody = { nombre: displayName, email, googleId: uid };

      const response = await fetch('http://localhost:3001/api/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error del servidor: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      login(data);
      navigate(data.rol === 'admin' ? '/admin' : '/');
    } catch (error) {
      alert(`Error: ${error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-6">
      <h1 className="text-3xl font-bold text-teal-700 mb-8">
        {usuario ? `Hola, ${usuario.nombre}` : 'Iniciar sesión'}
      </h1>

      {usuario ? (
        <button
          onClick={() => {
            logout();
            navigate('/');
          }}
          className="px-6 py-3 bg-teal-700 text-white rounded-md hover:bg-teal-800 transition"
        >
          Cerrar sesión
        </button>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4 mb-6">
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="p-3 rounded-md border border-gray-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-300 transition disabled:bg-gray-200"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="p-3 rounded-md border border-gray-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-300 transition disabled:bg-gray-200"
            />
            <button
              type="submit"
              disabled={loading}
              className={`py-3 rounded-md text-white font-semibold transition ${
                loading
                  ? 'bg-teal-400 cursor-not-allowed'
                  : 'bg-teal-700 hover:bg-teal-800 cursor-pointer'
              }`}
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>

          <Link
            to="/register"
            className="mb-6 text-teal-700 hover:text-teal-900 font-semibold inline-block"
          >
            ¿No tienes cuenta? Regístrate aquí
          </Link>

          <hr className="w-full max-w-sm border-gray-300 mb-6" />

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className={`w-full max-w-sm py-3 rounded-md font-semibold transition flex items-center justify-center gap-2 ${
              loading
                ? 'bg-red-300 cursor-not-allowed text-white'
                : 'bg-white border border-gray-300 hover:bg-gray-100 text-gray-700'
            }`}
          >
            <FcGoogle className="text-2xl" />
            {loading ? 'Conectando con Google...' : 'Iniciar sesión con Google'}
          </button>
        </>
      )}
    </div>
  );
}
