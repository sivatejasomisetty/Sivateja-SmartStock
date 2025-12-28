// import { Navigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// /**
//  * ProtectedRoute
//  * ----------------
//  * @param {ReactNode} children - Component to render
//  * @param {Array} allowedRoles - Roles allowed to access this route
//  *
//  * Usage:
//  * <ProtectedRoute allowedRoles={["admin"]}>
//  *    <CityDashboard />
//  * </ProtectedRoute>
//  *
//  * <ProtectedRoute allowedRoles={["admin", "manager"]}>
//  *    <Dashboard />
//  * </ProtectedRoute>
//  */

// export default function ProtectedRoute({ children, allowedRoles }) {
//   const { user, loading } = useAuth();

//   // Still checking auth from backend
//   if (loading) {
//     return <div style={{ padding: "1rem" }}>Checking permissions...</div>;
//   }

//   // Not logged in
//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   // Logged in but role not allowed
//   if (allowedRoles && !allowedRoles.includes(user.role)) {
//     return <Navigate to="/dashboard" replace />;
//   }

//   // Allowed
//   return children;
// }









//--------------------- Working but not login------------------------------
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-6">Loading...</div>;

  if (!user) return <Navigate to="/login" />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}
