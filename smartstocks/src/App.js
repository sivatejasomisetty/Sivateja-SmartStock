// import React, { useState } from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import { ThemeProvider } from "./context/ThemeContext";
// import MainLayout from "./layouts/MainLayout";
// import Login from "./pages/Login";
// import Dashboard from "./pages/Dashboard";
// import Products from "./pages/Products";
// import AddProduct from "./pages/AddProduct";
// import EditProduct from "./pages/EditProduct";
// import Predictions from "./pages/Predictions";
// import Alerts from "./pages/Alerts";
// import StoreDashboard from "./pages/StoreDashboard";
// import CityDashboard from "./pages/CityDashboard";

// function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   return (
//     <ThemeProvider>
//       <Router>
//         <Routes>

//           {/* LOGIN */}
//           <Route
//             path="/login"
//             element={
//               isLoggedIn ? <Navigate to="/dashboard" /> : <Login onLogin={() => setIsLoggedIn(true)} />
//             }
//           />

//           {/* PROTECTED ROUTES */}
//           {isLoggedIn && (
//             <Route path="/" element={<MainLayout onLogout={() => setIsLoggedIn(false)} />}>
//               <Route index element={<Navigate to="dashboard" />} />
//               <Route path="dashboard" element={<Dashboard />} />
//               <Route path="products" element={<Products />} />
//               <Route path="add-product" element={<AddProduct />} />
//               <Route path="edit-product/:id" element={<EditProduct />} />
//               <Route path="predictions" element={<Predictions />} />
//               <Route path="alerts" element={<Alerts />} />
//               <Route path="cities" element={<CityDashboard />} />
//               <Route path="stores/:city" element={<StoreDashboard />} />
//             </Route>
//           )}

//           {/* FALLBACK */}
//           <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />

//         </Routes>
//       </Router>
//     </ThemeProvider>
//   );
// }

// export default App;





import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import Predictions from "./pages/Predictions";
import Alerts from "./pages/Alerts";
import CityDashboard from "./pages/CityDashboard";
import StoreDashboard from "./pages/StoreDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />

        {/* PROTECTED APP */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["admin", "manager"]}>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/edit-product/:id" element={<EditProduct />} />
          <Route path="/predictions" element={<Predictions />} />
          <Route path="/alerts" element={<Alerts />} />

          {/* ADMIN ONLY */}
          <Route
            path="/cities"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <CityDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/stores/:city" element={<StoreDashboard />} />
        </Route>

        {/* ROOT */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}
