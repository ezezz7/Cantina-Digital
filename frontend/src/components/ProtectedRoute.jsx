import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Se ainda tiver carregando dados do localStorage
  if (loading) {
    return <div>Carregando...</div>;
  }

  // Se não tiver logado, manda para login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Se tiver logado, libera acesso
  return children;
}

export default ProtectedRoute;
