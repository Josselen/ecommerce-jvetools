// src/components/RutaProtegida.jsx
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function RutaProtegida({ children }) {
  const { usuario } = useAuth();

  if (!usuario || usuario.rol !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return children;
}
