import { Link, useLocation, useNavigate } from "react-router-dom";

export default function MainLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Products", path: "/products" },
    { name: "Predictions", path: "/predictions"},
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white shadow-lg px-4 py-6 hidden md:block">
        <h1 className="text-2xl font-bold text-blue-600 mb-10">
          SmartStock
        </h1>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-4 py-2 rounded-lg text-gray-700 font-medium
                ${location.pathname === item.path ? "bg-blue-500 text-white" : "hover:bg-blue-100"}`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col">

        {/* TOP NAVBAR */}
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-700">
            Welcome, User 👋
          </h2>

          <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600" onClick={() => navigate('/login')}>
            Logout
          </button>
        </header>

        {/* PAGE CONTENT */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
