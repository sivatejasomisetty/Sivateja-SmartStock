// import React, { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";
// import { ThemeContext } from "../context/ThemeContext";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Cell,
// } from "recharts";

// export default function Dashboard() {
//   /* ===================== AUTH ===================== */
//   const { user, loading: authLoading } = useAuth();

//   /* ===================== THEME ===================== */
//   const { theme } = useContext(ThemeContext);

//   /* ===================== STATE ===================== */
//   const [products, setProducts] = useState([]);
//   const [dataLoading, setDataLoading] = useState(true);

//   const CATEGORIES = [
//     "Groceries",
//     "Toys",
//     "Electronics",
//     "Furniture",
//     "Clothing",
//   ];

//   /* ===================== EFFECT ===================== */
//   useEffect(() => {
//     if (authLoading) return;
//     fetchDashboardData();
//   }, [authLoading]);

//   /* ===================== API ===================== */
//   const fetchDashboardData = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       const res = await axios.get(
//         "http://localhost:8000/api/products/all",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setProducts(res.data.products || []);
//     } catch (err) {
//       console.error("Error loading dashboard:", err);
//     } finally {
//       setDataLoading(false);
//     }
//   };

//   /* ===================== LOADING STATES ===================== */
//   if (authLoading) {
//     return <div className="p-6">Checking authentication...</div>;
//   }

//   if (dataLoading) {
//     return <div className="p-6">Loading SmartStock Dashboard...</div>;
//   }

//   console.log("AUTH USER:", user);

//   /* ===================== STATS ===================== */
//   const totalProducts = products.length;
//   const lowStock = products.filter(
//     (p) => (p.inventory_level ?? 0) <= 70
//   ).length;
//   const overstock = products.filter(
//     (p) => (p.inventory_level ?? 0) >= 400
//   ).length;

//   /* ===================== CHART DATA ===================== */
//   const categoryStock = CATEGORIES.map((cat) => {
//     const items = products.filter((p) => p.category === cat);
//     return {
//       category: cat,
//       totalQty: items.reduce(
//         (sum, p) => sum + (p.inventory_level || 0),
//         0
//       ),
//     };
//   });

//   /* ===================== UI ===================== */
//   return (
//     <div
//       className={`p-6 min-h-screen ${
//         theme === "dark"
//           ? "bg-gray-900 text-white"
//           : "bg-gray-100 text-black"
//       }`}
//     >
//       {/* ROLE DEBUG (TEMP) */}
//       <div className="mb-4 p-3 bg-gray-200 rounded">
//         <p>
//           <strong>Role:</strong> {user?.role}
//         </p>
//         <p>
//           <strong>Store:</strong> {user?.store_id || "ALL STORES"}
//         </p>
//       </div>

//       {/* HEADER */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold">Inventory Dashboard</h1>
//       </div>

//       {/* STATS */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow">
//           <div className="text-sm text-gray-500 uppercase">
//             Total Products
//           </div>
//           <div className="text-3xl font-bold">{totalProducts}</div>
//         </div>

//         <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow">
//           <div className="text-sm text-gray-500 uppercase">
//             Low Stock Items
//           </div>
//           <div className="text-3xl font-bold text-red-500">
//             {lowStock}
//           </div>
//         </div>

//         <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow">
//           <div className="text-sm text-gray-500 uppercase">
//             Overstock Items
//           </div>
//           <div className="text-3xl font-bold text-yellow-500">
//             {overstock}
//           </div>
//         </div>
//       </div>

//       {/* CHART */}
//       <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
//         <h2 className="text-xl font-semibold mb-4">
//           Stock Levels by Category
//         </h2>

//         <div className="h-80">
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart data={categoryStock}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="category" />
//               <YAxis />
//               <Tooltip />
//               <Bar dataKey="totalQty">
//                 {categoryStock.map((entry, index) => (
//                   <Cell
//                     key={index}
//                     fill={entry.totalQty < 50 ? "#ef4444" : "#3b82f6"}
//                   />
//                 ))}
//               </Bar>
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       <p className="mt-4 text-sm text-gray-400">
//         Note: Predictions are generated via XGBoost based on historical MySQL
//         data.
//       </p>
//     </div>
//   );
// }





import React, { useEffect, useState, useContext, useMemo } from "react";
import api from "../api/axios";
import { ThemeContext } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function Dashboard() {
  const { theme } = useContext(ThemeContext);
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const CATEGORIES = [
    "Groceries",
    "Toys",
    "Electronics",
    "Furniture",
    "Clothing",
  ];

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/api/products/all");
      setProducts(res.data.products || []);
    } catch (err) {
      console.error("Dashboard fetch failed", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= ROLE-BASED FILTER ================= */
  const roleFilteredProducts = useMemo(() => {
    if (!user || products.length === 0) return [];

    // 🔐 Store Manager → only own store
    if (user.role === "manager") {
      return products.filter(
        (p) =>
          String(p.store_id).trim().toUpperCase() ===
          String(user.store_id).trim().toUpperCase()
      );
    }

    // 👑 Admin → all stores
    return products;
  }, [products, user]);

  /* ================= UNIQUE PRODUCT COUNT ================= */
  const totalProducts = useMemo(() => {
    if (!roleFilteredProducts || roleFilteredProducts.length === 0) {
      return 0;
    }

    return new Set(
      roleFilteredProducts
        .map((p) => p.product_id)
        .filter((id) => id && id.trim() !== "")
    ).size;
  }, [roleFilteredProducts]);

  /* ================= KPI CALCULATIONS ================= */
  const lowStock = roleFilteredProducts.filter(
    (p) => (p.inventory_level ?? 0) <= 70
  ).length;

  const overStock = roleFilteredProducts.filter(
    (p) => (p.inventory_level ?? 0) >= 400
  ).length;

  const totalInventory = roleFilteredProducts.reduce(
    (sum, p) => sum + (p.inventory_level ?? 0),
    0
  );

  /* ================= CATEGORY CHART ================= */
  const categoryStock = useMemo(() => {
    return CATEGORIES.map((cat) => {
      const items = roleFilteredProducts.filter(
        (p) => p.category === cat
      );

      return {
        category: cat,
        totalQty: items.reduce(
          (s, p) => s + (p.inventory_level ?? 0),
          0
        ),
      };
    });
  }, [roleFilteredProducts]);

  if (loading) {
    return (
      <div className="p-6">
        Loading SmartStock Dashboard...
      </div>
    );
  }

  return (
    <div
      className={`p-6 min-h-screen ${
        theme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* ROLE INFO */}
      <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <p>
          <strong>Role:</strong>{" "}
          {user?.role === "admin" ? "Admin" : "Store Manager"}
        </p>
        <p>
          <strong>Store:</strong>{" "}
          {user?.role === "admin"
            ? "All Stores"
            : user?.store_id}
        </p>
      </div>

      <h1 className="text-3xl font-bold mb-6">
        Inventory Dashboard
      </h1>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
        {/* <KPI title="Total Products" value={totalProducts} color="text-white-500"/> */}
        <KPI title="Low Stock Items" value={lowStock} color="text-red-500" />
        <KPI title="Overstock Items" value={overStock} color="text-yellow-500" />
        <KPI title="Total Inventory" value={totalInventory} color="text-blue-600" />
      </div>

      {/* CATEGORY CHART */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">
          Stock Levels by Category
        </h2>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryStock}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="totalQty" radius={[4, 4, 0, 0]}>
                {categoryStock.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={
                      entry.totalQty < 100
                        ? "#ef4444"
                        : "#3b82f6"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <p className="mt-4 text-sm text-gray-400">
        KPIs are calculated using unique products based on user role.
      </p>
    </div>
  );
}

/* ================= KPI CARD ================= */
function KPI({ title, value, color = "text-gray-800" }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <p className={`text-3xl font-bold ${color}`}>
        {value ?? 0}
      </p>
    </div>
  );
}
