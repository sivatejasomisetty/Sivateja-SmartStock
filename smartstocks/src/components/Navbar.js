// import React from "react";
// import { useTheme } from "../context/ThemeContext";

// const Navbar = ({ setSidebarOpen, onLogout }) => {
//   const { theme, toggleTheme } = useTheme();

//   return (
//     <nav className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 shadow">
      
//       {/* Sidebar Toggle */}
//       <button
//         onClick={() => setSidebarOpen(prev => !prev)}
//         className="text-xl"
//       >
//         ☰
//       </button>

//       <div className="flex items-center gap-4">

//         {/* Theme Switch */}
//         <button 
//           onClick={toggleTheme}
//           className="px-3 py-1 bg-blue-600 text-white rounded"
//         >
//           {theme === "dark" ? "Light" : "Dark"}
//         </button>

//         {/* Logout */}
//         <button
//           onClick={onLogout}   // 🔥 this works now
//           className="px-3 py-1 bg-red-600 text-white rounded"
//         >
//           Logout
//         </button>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;









// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { useTheme } from "../context/ThemeContext";
// import { useAuth } from "../context/AuthContext";

// const Navbar = ({ setSidebarOpen }) => {
//   const { theme, toggleTheme } = useTheme();
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//     window.location.reload();
//   };

//   return (
//     <nav className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 shadow">
      
//       {/* Sidebar Toggle */}
//       <button
//         onClick={() => setSidebarOpen(prev => !prev)}
//         className="text-xl"
//       >
//         ☰
//       </button>

//       <div className="flex items-center gap-4">

//         {/* Role indicator (optional, helpful) */}
//         {user && (
//           <span className="text-sm text-gray-600 dark:text-gray-300">
//             {user.role === "admin" ? "Admin" : "Store Manager"}
//           </span>
//         )}

//         {/* Theme Switch */}
//         <button 
//           onClick={toggleTheme}
//           className="px-3 py-1 bg-blue-600 text-white rounded"
//         >
//           {theme === "dark" ? "Light" : "Dark"}
//         </button>

//         {/* Logout */}
//         <button
//           onClick={handleLogout}
//           className="px-3 py-1 bg-red-600 text-white rounded"
//         >
//           Logout
//         </button>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


















import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ setSidebarOpen }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();   // 🔥 use logout from context
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();                              // ✅ clear auth state properly
    navigate("/login", { replace: true }); // ✅ force route reset
  };

  return (
    <nav className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 shadow">
      
      {/* Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(prev => !prev)}
        className="text-xl"
      >
        ☰
      </button>

      <div className="flex items-center gap-4">

        {/* Role indicator */}
        {user && (
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {user.role === "admin" ? "Admin" : "Store Manager"}
          </span>
        )}

        {/* Theme Switch */}
        <button 
          onClick={toggleTheme}
          className="px-3 py-1 bg-blue-600 text-white rounded"
        >
          {theme === "dark" ? "Light" : "Dark"}
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="px-3 py-1 bg-red-600 text-white rounded"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
