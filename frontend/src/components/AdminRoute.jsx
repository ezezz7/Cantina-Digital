import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!user || user.role !== "admin") {
    return <Navigate to="/menu" replace />;
  }

  return children;
}

export default AdminRoute;
