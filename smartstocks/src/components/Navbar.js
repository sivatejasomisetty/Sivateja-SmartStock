import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ setSidebarOpen }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 shadow">
      
      {/* LEFT SECTION */}
      <div className="flex items-center gap-3">
        {/* Mobile Sidebar Toggle */}
        <button
          onClick={() => setSidebarOpen(prev => !prev)}
          className="text-xl text-gray-700 dark:text-gray-200 lg:hidden"
        >
          ☰
        </button>

        {/* BRAND */}
        <h1 className="text-xl font-bold tracking-wide text-gray-800 dark:text-white">
          SmartStock
        </h1>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-4">

        {/* ROLE BADGE */}
        {user && (
          <span className="px-3 py-1 text-sm rounded-full
            bg-gray-200 text-gray-700
            dark:bg-gray-700 dark:text-gray-200">
            {user.role === "admin" ? "Admin" : "Store Manager"}
          </span>
        )}

        {/* THEME TOGGLE */}
        <button
          onClick={toggleTheme}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {theme === "dark" ? "Light" : "Dark"}
        </button>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
