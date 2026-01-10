




// import React, { useState, useContext } from "react";
// import axios from "axios";
// import { ThemeContext } from "../context/ThemeContext";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// const ALERTS_API = "http://127.0.0.1:8000/alerts";


// // Weekly distribution (sum = 1)
// const WEEK_SPLIT = [
//   { day: "Mon", weight: 0.12 },
//   { day: "Tue", weight: 0.14 },
//   { day: "Wed", weight: 0.15 },
//   { day: "Thu", weight: 0.16 },
//   { day: "Fri", weight: 0.18 },
//   { day: "Sat", weight: 0.15 },
//   { day: "Sun", weight: 0.10 },
// ];

// export default function Predictions() {
//   const { theme } = useContext(ThemeContext);

//   // INPUT STATES
//   const [storeId, setStoreId] = useState("");
//   const [productId, setProductId] = useState("");

//   // DATA STATES
//   const [inventoryLevel, setInventoryLevel] = useState(null);
//   const [predictedWeekly, setPredictedWeekly] = useState(null);
//   const [predictedDaily, setPredictedDaily] = useState(null);
//   const [suggestion, setSuggestion] = useState("");
//   const [status, setStatus] = useState("");

//   // UI STATES
//   const [chartData, setChartData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

// const getPrediction = async () => {
//   if (!storeId.trim() || !productId.trim()) {
//     setError("Please enter Store ID and Product ID");
//     return;
//   }

//   setLoading(true);
//   setError("");
//   setChartData([]);

//   try {
//     const res = await axios.get(ALERTS_API);

//     const record = res.data.find(
//       (item) =>
//         item.store_id.trim().toUpperCase() === storeId.trim().toUpperCase() &&
//         item.product_id.trim().toUpperCase() === productId.trim().toUpperCase()
//     );

//     if (!record) {
//       setError("No prediction data found for this product");
//       return;
//     }

//     // ✅ SAFETY: avoid negative predictions
//     const weekly = Math.max(0, Math.round(record.predicted_weekly_sales));
//     const daily = Math.round(weekly / 7);

//     setInventoryLevel(record.inventory_level);
//     setPredictedWeekly(weekly);
//     setPredictedDaily(daily);
//     setSuggestion(record.suggestion);
//     setStatus(record.status);

//     const graphData = WEEK_SPLIT.map((d) => ({
//       day: d.day,
//       demand: Math.round(weekly * d.weight),
//     }));

//     setChartData(graphData);
//   } catch (err) {
//     console.error(err);
//     setError("Failed to load prediction data");
//   } finally {
//     setLoading(false);
//   }
// };


//   return (
//     <div
//       className={`p-6 min-h-screen ${
//         theme === "dark"
//           ? "bg-gray-900 text-white"
//           : "bg-gray-100 text-gray-900"
//       }`}
//     >
//       <h1 className="text-3xl font-bold mb-6">Demand Prediction</h1>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* LEFT SIDE */}
//         <div className="flex flex-col gap-6">
//           {/* INPUT CARD */}
//           <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
//             <div className="mb-4">
//               <label className="block mb-1 font-medium">Store ID</label>
//               <input
//                 value={storeId}
//                 onChange={(e) => setStoreId(e.target.value)}
//                 className="w-full p-3 rounded border dark:bg-gray-700"
//                 placeholder="Ex: CHE-S01"
//               />
//             </div>

//             <div className="mb-4">
//               <label className="block mb-1 font-medium">Product ID</label>
//               <input
//                 value={productId}
//                 onChange={(e) => setProductId(e.target.value)}
//                 className="w-full p-3 rounded border dark:bg-gray-700"
//                 placeholder="Ex: P0010"
//               />
//             </div>

//             <button
//               onClick={getPrediction}
//               disabled={loading}
//               className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
//             >
//               {loading ? "Loading..." : "Get Prediction"}
//             </button>

//             {error && <p className="mt-3 text-red-500 text-sm">{error}</p>}
//           </div>

//           {/* KPI CARDS */}
//           {predictedWeekly !== null && (
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow">
//                 <p className="text-sm text-gray-500">Predicted Daily Sales</p>
//                 <p className="text-3xl font-bold text-blue-600">
//                   {predictedDaily}
//                 </p>
//               </div>

//               <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow">
//                 <p className="text-sm text-gray-500">Predicted Weekly Sales</p>
//                 <p className="text-3xl font-bold text-green-600">
//                   {predictedWeekly}
//                 </p>
//               </div>

//               <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow">
//                 <p className="text-sm text-gray-500">Inventory Level</p>
//                 <p className="text-3xl font-bold text-yellow-500">
//                   {inventoryLevel}
//                 </p>
//               </div>

//               <div
//                 // className={`p-5 rounded-xl shadow ${
//                 //   status.includes("CRITICAL")
//                 //     ? "bg-red-100 dark:bg-red-900/30"
//                 //     : status.includes("OVERSTOCK")
//                 //     ? "bg-yellow-100 dark:bg-yellow-900/30"
//                 //     : "bg-green-100 dark:bg-green-900/30"
//                 // }`}

//               className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow"
               
//               >
//                 <p className="text-sm text-gray-600">Suggestion</p>
//                 <p className="font-semibold mt-2">{suggestion}</p>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* RIGHT SIDE: CHART */}
//         {chartData.length > 0 && (
//           <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
//             <h2 className="text-xl font-semibold mb-4">
//               Predicted Sales Distribution (7 Days)
//             </h2>

//             <div style={{ width: "100%", height: 360 }}>
//               <ResponsiveContainer>
//                 <LineChart data={chartData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="day" />
//                   <YAxis />
//                   <Tooltip />
//                   <Line
//                     type="monotone"
//                     dataKey="demand"
//                     stroke="#2563eb"
//                     strokeWidth={3}
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }






























import React, { useState, useContext, useEffect } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios"; // ✅ interceptor
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ALERTS_API = "/alerts";

// Weekly split (sum = 1)
const WEEK_SPLIT = [
  { day: "Mon", weight: 0.12 },
  { day: "Tue", weight: 0.14 },
  { day: "Wed", weight: 0.15 },
  { day: "Thu", weight: 0.16 },
  { day: "Fri", weight: 0.18 },
  { day: "Sat", weight: 0.15 },
  { day: "Sun", weight: 0.10 },
];

export default function Predictions() {
  const { theme } = useContext(ThemeContext);
  const { user } = useAuth(); // 🔐 role + store

  // INPUTS
  const [storeId, setStoreId] = useState("");
  const [productId, setProductId] = useState("");

  // DATA
  const [inventoryLevel, setInventoryLevel] = useState(null);
  const [predictedWeekly, setPredictedWeekly] = useState(null);
  const [predictedDaily, setPredictedDaily] = useState(null);
  const [suggestion, setSuggestion] = useState("");
  const [status, setStatus] = useState("");
  const [chartData, setChartData] = useState([]);

  // UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= AUTO STORE FOR MANAGER ================= */
  useEffect(() => {
    if (user?.role === "manager") {
      setStoreId(user.store_id); // 🔥 force own store
    }
  }, [user]);

  /* ================= GET PREDICTION ================= */
  const getPrediction = async () => {
    if (!productId.trim()) {
      setError("Please enter Product ID");
      return;
    }

    if (user?.role === "admin" && !storeId.trim()) {
      setError("Please enter Store ID");
      return;
    }

    setLoading(true);
    setError("");
    setChartData([]);

    try {
      // ✅ NEW API
      const res = await api.get(ALERTS_API);

      const record = res.data.find(
        (item) =>
          item.store_id.toUpperCase() === storeId.toUpperCase() &&
          item.product_id.toUpperCase() === productId.toUpperCase()
           //(user.role === "admin" || item.store_id === user.store_id)
      );

      if (!record) {
        setError("No prediction data found");
        return;
      }

      const weekly = Math.max(0, Math.round(record.predicted_weekly_sales));
      const daily = Math.round(weekly / 7);

      setInventoryLevel(record.inventory_level);
      setPredictedWeekly(weekly);
      setPredictedDaily(daily);
      setSuggestion(record.suggestion);
      setStatus(record.status);

      const graph = WEEK_SPLIT.map((d) => ({
        day: d.day,
        demand: Math.round(weekly * d.weight),
      }));

      setChartData(graph);
    } catch (err) {
      console.error(err);
      setError("Failed to load prediction data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`p-6 min-h-screen ${
        theme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-gray-100 text-gray-900"
      }`}
    >
      <h1 className="text-3xl font-bold mb-6">Demand Prediction</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT */}
        <div className="flex flex-col gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            {/* STORE ID */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">Store ID</label>
              <input
                value={storeId}
                disabled={user?.role === "manager"} // 🔐 lock for manager
                onChange={(e) => setStoreId(e.target.value)}
                className="w-full p-3 rounded border dark:bg-gray-700 disabled:opacity-70"
                placeholder="Ex: HYD-S01"
              />
            </div>

            {/* PRODUCT ID */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">Product ID</label>
              <input
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="w-full p-3 rounded border dark:bg-gray-700"
                placeholder="Ex: P0010"
              />
            </div>

            <button
              onClick={getPrediction}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
            >
              {loading ? "Loading..." : "Get Prediction"}
            </button>

            {error && <p className="mt-3 text-red-500 text-sm">{error}</p>}
          </div>

          {/* KPI CARDS */}
          {predictedWeekly !== null && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <KPI title="Predicted Daily Sales" value={predictedDaily} color="text-blue-600" />
              <KPI title="Predicted Weekly Sales" value={predictedWeekly} color="text-green-600" />
              <KPI title="Inventory Level" value={inventoryLevel} color="text-yellow-500" />
              <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow">
                <p className="text-sm text-gray-600">Suggestion</p>
                <p className="font-semibold mt-2">{suggestion}</p>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT CHART */}
        {chartData.length > 0 && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">
              Predicted Sales (7 Days)
            </h2>

            <ResponsiveContainer width="100%" height={360}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="demand"
                  stroke="#2563eb"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= KPI ================= */
function KPI({ title, value, color }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
