//Testing version for products page fix
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // ✅ wait until auth check finishes
  if (loading) {
    return <div className="p-6">Checking authentication...</div>;
  }

  // ✅ only one redirect rule
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
