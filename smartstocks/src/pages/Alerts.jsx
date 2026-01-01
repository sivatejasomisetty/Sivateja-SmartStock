// // src/pages/Alerts.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { FiAlertTriangle, FiArrowDownCircle, FiArrowUpCircle } from "react-icons/fi";

// export default function Alerts() {
//   const [inventory, setInventory] = useState([]);
//   const reorderDefault = 10;

//   useEffect(() => {
//     axios.get("http://localhost:5000/api/products/all")
//       .then((res) => setInventory(res.data.products || []))
//       .catch((err) => {
//         console.error("Failed to load products for alerts", err);
//         setInventory([]);
//       });
//   }, []);

//   const processed = inventory.map((it) => ({
//     ...it,
//     quantity: Number(it.quantity ?? 0),
//     reorder: Number(it.reorderLevel ?? reorderDefault),
//   }));

//   const understock = processed.filter((p) => p.quantity <= p.reorder);
//   const overstock = processed.filter((p) => p.quantity > p.reorder * 2);

//   return (
//     <div className="max-w-6xl mx-auto">
//       <div className="flex items-center gap-3 mb-6">
//         <FiAlertTriangle className="text-2xl text-yellow-600 dark:text-yellow-400" />
//         <h2 className="text-2xl font-semibold">Stock Alerts</h2>
//       </div>

//       <div className="grid md:grid-cols-2 gap-6">
//         <section className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow">
//           <div className="flex items-center justify-between mb-3">
//             <div className="flex items-center gap-2">
//               <FiArrowDownCircle className="text-xl text-red-600 dark:text-red-300" />
//               <h3 className="font-medium">Understock</h3>
//             </div>
//             <div className="text-sm text-gray-500 dark:text-gray-300">{understock.length} items</div>
//           </div>

//           {understock.length === 0 ? (
//             <div className="text-sm text-gray-600 dark:text-gray-300">No understock items. All good 📦</div>
//           ) : (
//             <ul className="space-y-3">
//               {understock.map((item) => (
//                 <li key={item._id} className="p-3 rounded border border-red-100 dark:border-red-700 bg-red-50 dark:bg-red-900/30 flex justify-between items-center">
//                   <div>
//                     <div className="font-semibold">{item.name}</div>
//                     <div className="text-sm text-gray-600 dark:text-gray-300">SKU: {item.sku ?? "-"}</div>
//                     <div className="text-sm text-gray-600 dark:text-gray-300">Qty: {item.quantity} — Reorder: {item.reorder}</div>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </section>

//         <section className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow">
//           <div className="flex items-center justify-between mb-3">
//             <div className="flex items-center gap-2">
//               <FiArrowUpCircle className="text-xl text-green-600 dark:text-green-300" />
//               <h3 className="font-medium">Overstock</h3>
//             </div>
//             <div className="text-sm text-gray-500 dark:text-gray-300">{overstock.length} items</div>
//           </div>

//           {overstock.length === 0 ? (
//             <div className="text-sm text-gray-600 dark:text-gray-300">No overstock items.</div>
//           ) : (
//             <ul className="space-y-3">
//               {overstock.map((item) => (
//                 <li key={item._id} className="p-3 rounded border border-green-100 dark:border-green-700 bg-green-50 dark:bg-green-900/20 flex justify-between items-center">
//                   <div>
//                     <div className="font-semibold">{item.name}</div>
//                     <div className="text-sm text-gray-600 dark:text-gray-300">SKU: {item.sku ?? "-"}</div>
//                     <div className="text-sm text-gray-600 dark:text-gray-300">Qty: {item.quantity} — Reorder: {item.reorder}</div>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </section>
//       </div>
//     </div>
//   );
// }







//------------------- Working---------------------------------
// import React, { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import { ThemeContext } from "../context/ThemeContext";

// const API_URL = "http://127.0.0.1:8000/alerts";

// export default function Alerts() {
//   const { theme } = useContext(ThemeContext);

//   const [alerts, setAlerts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const fetchAlerts = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(API_URL);
//       setAlerts(res.data || []);
//     } catch (err) {
//       console.error("Alerts fetch error:", err);
//       setError("Failed to load alerts from server");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAlerts();
//   }, []);

//   return (
//     <div
//       className={`p-6 min-h-screen ${
//         theme === "dark"
//           ? "bg-gray-900 text-white"
//           : "bg-gray-100 text-gray-900"
//       }`}
//     >
//       <h1 className="text-3xl font-bold mb-6">Inventory Alerts</h1>

//       {/* LOADING */}
//       {loading && <p>Loading alerts...</p>}

//       {/* ERROR */}
//       {error && <p className="text-red-500">{error}</p>}

//       {/* EMPTY STATE */}
//       {!loading && alerts.length === 0 && (
//         <p className="text-gray-500">No alerts at the moment 🎉</p>
//       )}

//       {/* ALERTS TABLE */}
//       {!loading && alerts.length > 0 && (
//         <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow">
//           <table className="min-w-full">
//             <thead className="bg-gray-200 dark:bg-gray-700">
//               <tr>
//                 <th className="px-4 py-3 text-left">Product ID</th>
//                 <th className="px-4 py-3 text-left">Category</th>
//                 <th className="px-4 py-3 text-left">Stock Qty</th>
//                 <th className="px-4 py-3 text-left">Status</th>
//                 <th className="px-4 py-3 text-left">Suggestion</th>
//               </tr>
//             </thead>
//             <tbody>
//               {alerts.map((alert, index) => (
//                 <tr
//                   key={index}
//                   className="border-t dark:border-gray-700"
//                 >
//                   <td className="px-4 py-3">{alert.product_id}</td>
//                   <td className="px-4 py-3">{alert.category}</td>
//                   <td className="px-4 py-3">{alert.inventory_level}</td>
//                   <td className="px-4 py-3">
//                     <span
//                       className={`px-3 py-1 rounded-full text-sm font-medium ${
//                         alert.status === "Low Stock"
//                           ? "bg-red-100 text-red-600"
//                           : alert.status === "Overstock"
//                           ? " text-yellow-600"                 /*bg-yellow-100*/
//                           : " text-green-600"                  /*bg-green-100*/
//                       }`}
//                     >
//                       {alert.status}
//                     </span>
//                   </td>
//                   <td className="px-4 py-3">
//                     {alert.suggestion}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }


















import React, { useEffect, useState, useContext, useMemo } from "react";
import api from "../api/axios";
import { ThemeContext } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

export default function Alerts() {
  const { theme } = useContext(ThemeContext);
  const { user } = useAuth();

  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ALERTS ================= */
  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await api.get("/alerts");
      setAlerts(res.data || []);
    } catch (err) {
      console.error("Failed to load alerts", err);
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= ROLE FILTER ================= */
  const roleFilteredAlerts = useMemo(() => {
    if (!user) return [];

    // 🔐 Manager → only own store alerts
    if (user.role === "manager") {
      return alerts.filter(
        (a) =>
          String(a.store_id).trim().toUpperCase() ===
          String(user.store_id).trim().toUpperCase()
      );
    }

    // 👑 Admin → all alerts
    return alerts;
  }, [alerts, user]);

  if (loading) {
    return <div className="p-6 text-gray-900 dark:text-white ">Loading alerts...</div>;
  }

  return (
    <div
      className={`p-6 min-h-screen ${
        theme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-gray-100 text-gray-900"
      }`}
    >
      <h1 className="text-3xl font-bold mb-6">Inventory Alerts</h1>

      {roleFilteredAlerts.length === 0 ? (
        <p className="text-gray-500">
          No alerts available for your store.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roleFilteredAlerts.map((alert, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-xl shadow border-l-4 ${
                alert.status.includes("CRITICAL")
                  ? "border-red-600 bg-red-50 dark:bg-red-900/30"
                  : alert.status.includes("UNDERSTOCK")
                  ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/30"
                  : "border-green-500 bg-green-50 dark:bg-green-900/30"
              }`}
            >
              <h2 className="text-lg font-semibold mb-1">
                Store: {alert.store_id}
              </h2>

              <p className="text-sm text-gray-600 dark:text-gray-300">
                Product: <strong>{alert.product_id}</strong>
              </p>

              <p className="mt-2">
                <strong>Status:</strong> {alert.status}
              </p>

              <p>
                <strong>Inventory:</strong> {alert.inventory_level}
              </p>

              <p>
                <strong>Predicted Weekly Sales:</strong>{" "}
                {alert.predicted_weekly_sales}
              </p>

              <p className="mt-2 text-sm italic">
                {alert.suggestion}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


