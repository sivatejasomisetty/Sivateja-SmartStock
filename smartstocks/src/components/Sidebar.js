// import React from "react";
// import { Link, useLocation } from "react-router-dom";
// import { X } from "lucide-react";

// const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
//   const { pathname } = useLocation();

//   return (
//     <>
//       {/* MOBILE BACKDROP */}
//       <div
//         className={`fixed inset-0 bg-black/40 z-20 lg:hidden transition-opacity 
//         ${sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
//         onClick={() => setSidebarOpen(false)}
//       ></div>

//       {/* SIDEBAR */}
//       <aside
//         className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-800 shadow-md w-64 
//         z-30 transform transition-transform duration-300
//         ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
//       >
//         {/* Mobile Close Button */}
//         <button
//           className="lg:hidden absolute top-4 right-4"
//           onClick={() => setSidebarOpen(false)}
//         >
//           <X className="text-gray-600 dark:text-gray-200" size={26} />
//         </button>

//         <nav className="mt-16 p-4 space-y-4">
//           <Link
//             className={`block px-4 py-2 rounded-lg font-medium transition-colors text-gray-700 dark:text-gray-200 hover:bg-gray-200 
//               hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white
//               ${pathname === "/dashboard" ? "bg-blue-600 text-white dark:bg-blue-500 dark:text-white" : ""} `}
//                to="/dashboard" >
//             Dashboard
//           </Link>

//           <Link
//             className={`block px-4 py-2 rounded-lg font-medium transition-colors text-gray-700 dark:text-gray-200 hover:bg-gray-200 
//               hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white
//               ${pathname === "/products" ? "bg-blue-600 text-white dark:bg-blue-500 dark:text-white" : ""} `}
//                to="/products" >
//             Products
//           </Link>

//           <Link
//             className={`block px-4 py-2 rounded-lg font-medium transition-colors text-gray-700 dark:text-gray-200 hover:bg-gray-200 
//               hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white
//               ${pathname === "/predictions" ? "bg-blue-600 text-white dark:bg-blue-500 dark:text-white" : ""} `}
//                to="/predictions" >
//             Predictions
//           </Link>

//           <Link
//             className={`block px-4 py-2 rounded-lg font-medium transition-colors text-gray-700 dark:text-gray-200 hover:bg-gray-200 
//               hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white
//               ${pathname === "/alerts" ? "bg-blue-600 text-white dark:bg-blue-500 dark:text-white" : ""} `}
//                to="/alerts" >
//             Alerts
//           </Link>

//           <Link
//             className={`block px-4 py-2 rounded-lg font-medium transition-colors text-gray-700 dark:text-gray-200 hover:bg-gray-200 
//               hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white
//               ${pathname === "/cities" ? "bg-blue-600 text-white dark:bg-blue-500 dark:text-white" : ""} `}
//                to="/cities" >
//            City Dashboard
//           </Link>

//           <Link
//   className={`block px-4 py-2 text-white rounded-lg font-medium transition-colors
//   ${pathname.startsWith("/stores") ? "bg-blue-600 text-white" : ""}`}
//   to="/stores/Chennai"
// >
//   Store Dashboard
// </Link>

//         </nav>
//       </aside>
//     </>
//   );
// };

// export default Sidebar;













import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload();
  };

  const linkClass = (path) =>
    `block px-4 py-2 rounded-lg font-medium transition-colors
     text-gray-700 dark:text-gray-200 hover:bg-gray-200 hover:text-gray-900
     dark:hover:bg-gray-700 dark:hover:text-white
     ${pathname === path ? "bg-blue-600 text-white dark:bg-blue-500" : ""}`;

  return (
    <>
      {/* MOBILE BACKDROP */}
      <div
        className={`fixed inset-0 bg-black/40 z-20 lg:hidden transition-opacity
        ${sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-800 shadow-md w-64
        z-30 transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* MOBILE CLOSE */}
        <button
          className="lg:hidden absolute top-4 right-4"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="text-gray-600 dark:text-gray-200" size={26} />
        </button>

        <nav className="mt-16 p-4 space-y-4">
          <Link className={linkClass("/dashboard")} to="/dashboard">
            Dashboard
          </Link>

          <Link className={linkClass("/products")} to="/products">
            Products
          </Link>

          <Link className={linkClass("/predictions")} to="/predictions">
            Predictions
          </Link>

          <Link className={linkClass("/alerts")} to="/alerts">
            Alerts
          </Link>

          {/* ADMIN ONLY */}
          {user?.role === "admin" && (
            <Link className={linkClass("/cities")} to="/cities">
              City Dashboard
            </Link>
          )}

          {/* STORE DASHBOARD (DYNAMIC) */}
          {user?.role === "manager" && user?.store_id && (
            <Link
              className={`block px-4 py-2 rounded-lg font-medium transition-colors
              ${pathname.startsWith("/stores") ? "bg-blue-600 text-white" : ""}
              text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700`}
              to={`/stores/${encodeURIComponent(user.store_id.split("-")[0])}`}
            >
              Store Dashboard
            </Link>
          )}

          {/* LOGOUT */}
          <button
            onClick={logout}
            className="mt-6 w-full text-left px-4 py-2 rounded-lg
            bg-red-600 text-white hover:bg-red-700"
          >
            Logout
          </button>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
