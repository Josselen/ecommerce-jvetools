import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


export default function Register() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al registrar');
      }

      alert('Usuario registrado con éxito');
      navigate('/login');
    } catch (error) {
      console.error('Error al registrar:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Registrarse</h2>
      <form onSubmit={handleRegister} className="login-form">
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>
    </div>
  );
}
