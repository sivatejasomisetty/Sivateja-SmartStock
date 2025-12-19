// // src/pages/Predictions.jsx
// import React, { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import { ThemeContext } from "../context/ThemeContext";
// import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

// const defaultData = [
//   { date: "Mon", actual: 120, predicted: 110 },
//   { date: "Tue", actual: 150, predicted: 140 },
//   { date: "Wed", actual: 170, predicted: 160 },
//   { date: "Thu", actual: 110, predicted: 130 },
//   { date: "Fri", actual: 200, predicted: 190 }
// ];

// export default function Predictions() {
//   const { theme } = useContext(ThemeContext);
//   const [productName, setProductName] = useState("");
//   const [overview, setOverview] = useState(defaultData);
//   const [prediction, setPrediction] = useState([]);

//   useEffect(() => {
//     axios.get("http://localhost:5000/api/predict")
//       .then((res) => { if (res.data) setOverview(res.data); })
//       .catch(() => setOverview(defaultData));
//   }, []);

//   const getPrediction = async () => {
//     if (!productName.trim()) return alert("Enter product name");
//     try {
//       const res = await axios.post("http://localhost:5000/predict", { product: productName });
//       if (Array.isArray(res.data.prediction)) setPrediction(res.data.prediction);
//       else alert("Invalid prediction result");
//     } catch (e) {
//       alert("Prediction failed");
//     }
//   };

//   return (
//     <div className={`p-6 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
//       <h1 className="text-3xl font-bold mb-4">Predictions</h1>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow">
//           <h2 className="font-semibold mb-3">Actual vs Predicted (overview)</h2>
//           <div style={{ width: "100%", height: 300 }}>
//             <ResponsiveContainer>
//               <LineChart data={overview}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="date" />
//                 <YAxis />
//                 <Tooltip />
//                 <Line type="monotone" dataKey="actual" stroke="#06b6d4" strokeWidth={2} />
//                 <Line type="monotone" dataKey="predicted" stroke="#f97316" strokeWidth={2} strokeDasharray="4 4" />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         <div className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow">
//           <h2 className="font-semibold mb-3">Predict for a Product</h2>
//           <input
//             className="w-full p-3 rounded border mb-3 bg-white dark:bg-gray-700"
//             placeholder="Product name (ex: Milk 1L)"
//             value={productName}
//             onChange={(e) => setProductName(e.target.value)}
//           />
//           <button onClick={getPrediction} className="bg-blue-600 text-white px-4 py-2 rounded">Get Prediction</button>

//           {prediction.length > 0 && (
//             <div className="mt-4">
//               <h3 className="font-semibold mb-2">Prediction (next days)</h3>
//               <div style={{ width: "100%", height: 220 }}>
//                 <ResponsiveContainer>
//                   <LineChart data={prediction}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="day" />
//                     <YAxis />
//                     <Tooltip />
//                     <Line type="monotone" dataKey="demand" stroke="#4ade80" strokeWidth={2} />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }









//---------------------------------------------------------------------------------
// No Graph
//---------------------------------------------------------------------------------
// import React, { useState, useContext } from "react";
// import axios from "axios";
// import { ThemeContext } from "../context/ThemeContext";

// const API_URL = "http://127.0.0.1:8000/predict";

// export default function Predictions() {
//   const { theme } = useContext(ThemeContext);

//   const [storeId, setStoreId] = useState("S001");
//   const [productId, setProductId] = useState("");
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const getPrediction = async () => {
//     if (!productId.trim()) {
//       setError("Please enter a Product ID");
//       return;
//     }

//     setLoading(true);
//     setError("");
//     setResult(null);

//     try {
//       const res = await axios.get(API_URL, {
//         params: {
//           store_id: storeId.trim(),
//           product_id: productId.trim(),
//         },
//       });

//       // ML may return { error: "Not enough historical data" }
//       if (res.data?.error) {
//         setError(res.data.error);
//       } else {
//         setResult(res.data);
//       }
//     } catch (err) {
//       console.error("Prediction error:", err);
//       setError(
//         err.response?.data?.detail ||
//         err.response?.data?.error ||
//         "Prediction failed. Please check Store ID / Product ID."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       className={`p-6 min-h-screen ${
//         theme === "dark"
//           ? "bg-gray-900 text-white"
//           : "bg-gray-100 text-gray-900"
//       }`}
//     >
//       <h1 className="text-3xl font-bold mb-6">Demand Prediction</h1>

//       {/* INPUT CARD */}
//       <div className="max-w-md bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
//         {/* STORE ID */}
//         <div className="mb-4">
//           <label className="block mb-1 font-medium">Store ID</label>
//           <input
//             value={storeId}
//             onChange={(e) => setStoreId(e.target.value)}
//             className="w-full p-3 rounded border dark:bg-gray-700 dark:border-gray-600"
//             placeholder="Ex: S001"
//           />
//         </div>

//         {/* PRODUCT ID */}
//         <div className="mb-4">
//           <label className="block mb-1 font-medium">Product ID</label>
//           <input
//             placeholder="Ex: P0001"
//             value={productId}
//             onChange={(e) => setProductId(e.target.value)}
//             className="w-full p-3 rounded border dark:bg-gray-700 dark:border-gray-600"
//           />
//         </div>

//         {/* BUTTON */}
//         <button
//           onClick={getPrediction}
//           disabled={loading || !productId.trim()}
//           className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg transition"
//         >
//           {loading ? "Predicting..." : "Get Prediction"}
//         </button>

//         {/* ERROR */}
//         {error && (
//           <p className="mt-3 text-red-500 text-sm">{error}</p>
//         )}
//       </div>

//       {/* RESULT CARD */}
//       {result && (
//         <div className="mt-6 max-w-md bg-green-100 dark:bg-green-900/40 p-6 rounded-xl shadow">
//           <h2 className="text-xl font-semibold mb-3">
//             Prediction Result
//           </h2>

//           <p className="mb-1">
//             <b>Predicted Daily Units:</b>{" "}
//             {result.predicted_units}
//           </p>

//           <p>
//             <b>Predicted Weekly Sales:</b>{" "}
//             {result.predicted_weekly_sales}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }






















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

// const API_URL = "http://127.0.0.1:8000/predict";

// // Weekly distribution (must sum to 1)
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

//   const [storeId, setStoreId] = useState("S001");
//   const [productId, setProductId] = useState("");
//   const [chartData, setChartData] = useState([]);
//   const [summary, setSummary] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const getPrediction = async () => {
//     if (!productId.trim()) {
//       setError("Please enter a Product ID");
//       return;
//     }

//     setLoading(true);
//     setError("");
//     setChartData([]);
//     setSummary(null);

//     try {
//       const res = await axios.get(API_URL, {
//         params: {
//           store_id: storeId.trim(),
//           product_id: productId.trim(),
//         },
//       });

//       if (res.data?.error) {
//         setError(res.data.error);
//         return;
//       }

//       const weeklySales = res.data.predicted_weekly_sales;
//       const dailyUnits = res.data.predicted_units;

//       // 🔹 Convert weekly sales → 7-day forecast
//       const graphData = WEEK_SPLIT.map((d) => ({
//         day: d.day,
//         demand: Math.round(weeklySales * d.weight),
//       }));

//       setChartData(graphData);
//       setSummary({
//         dailyUnits,
//         weeklySales,
//       });
//     } catch (err) {
//       console.error("Prediction error:", err);
//       setError(
//         err.response?.data?.detail ||
//         err.response?.data?.error ||
//         "Prediction failed. Check Store ID / Product ID."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       className={`p-6 min-h-screen ${
//         theme === "dark"
//           ? "bg-gray-900 text-white"
//           : "bg-gray-100 text-gray-900"
//       }`}
//     >
//       <h1 className="text-3xl font-bold mb-6">Demand Prediction</h1>

//       {/* INPUT CARD */}
//       <div className="max-w-md bg-white dark:bg-gray-800 p-6 rounded-xl shadow mb-6">
//         <div className="mb-4">
//           <label className="block mb-1 font-medium">Store ID</label>
//           <input
//             value={storeId}
//             onChange={(e) => setStoreId(e.target.value)}
//             className="w-full p-3 rounded border dark:bg-gray-700"
//             placeholder="Ex: S001"
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block mb-1 font-medium">Product ID</label>
//           <input
//             value={productId}
//             onChange={(e) => setProductId(e.target.value)}
//             className="w-full p-3 rounded border dark:bg-gray-700"
//             placeholder="Ex: P0001"
//           />
//         </div>

//         <button
//           onClick={getPrediction}
//           disabled={loading || !productId.trim()}
//           className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg"
//         >
//           {loading ? "Predicting..." : "Get Prediction"}
//         </button>

//         {error && (
//           <p className="mt-3 text-red-500 text-sm">{error}</p>
//         )}
//       </div>

//       {/* GRAPH */}
//       {chartData.length > 0 && (
//         <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow mb-6">
//           <h2 className="text-xl font-semibold mb-4">
//             Predicted Sales Distribution (7 Days)
//           </h2>

//           <div style={{ width: "100%", height: 320 }}>
//             <ResponsiveContainer>
//               <LineChart data={chartData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="day" />
//                 <YAxis />
//                 <Tooltip />
//                 <Line
//                   type="monotone"
//                   dataKey="demand"
//                   stroke="#2563eb"
//                   strokeWidth={3}
//                   dot={{ r: 4 }}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       )}

//       {/* SUMMARY */}
//       {summary && (
//         <div className="max-w-md bg-green-100 dark:bg-green-900/40 p-6 rounded-xl shadow">
//           <h2 className="text-xl font-semibold mb-3">
//             Prediction Summary
//           </h2>
//           <p>
//             <b>Predicted Daily Units:</b> {summary.dailyUnits}
//           </p>
//           <p>
//             <b>Predicted Weekly Sales:</b> {summary.weeklySales}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }






























import React, { useState, useContext } from "react";
import axios from "axios";
import { ThemeContext } from "../context/ThemeContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const API_URL = "http://127.0.0.1:8000/predict";

// Weekly distribution (must sum to 1)
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

  const [storeId, setStoreId] = useState("S001");
  const [productId, setProductId] = useState("");
  const [chartData, setChartData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getPrediction = async () => {
    if (!productId.trim()) {
      setError("Please enter a Product ID");
      return;
    }

    setLoading(true);
    setError("");
    setChartData([]);
    setSummary(null);

    try {
      const res = await axios.get(API_URL, {
        params: {
          store_id: storeId.trim(),
          product_id: productId.trim(),
        },
      });

      if (res.data?.error) {
        setError(res.data.error);
        return;
      }

      const weeklySales = res.data.predicted_weekly_sales;
      const dailyUnits = res.data.predicted_units;

      // Convert weekly sales into 7-day distribution
      const graphData = WEEK_SPLIT.map((d) => ({
        day: d.day,
        demand: Math.round(weeklySales * d.weight),
      }));

      setChartData(graphData);
      setSummary({
        dailyUnits,
        weeklySales,
      });
    } catch (err) {
      console.error("Prediction error:", err);
      setError(
        err.response?.data?.detail ||
          err.response?.data?.error ||
          "Prediction failed. Check Store ID / Product ID."
      );
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

      {/* TOP SECTION: INPUT + CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* LEFT SIDE: INPUT + KPI NUMBERS */}
        <div className="flex flex-col gap-6">
          {/* INPUT CARD */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <div className="mb-4">
              <label className="block mb-1 font-medium">Store ID</label>
              <input
                value={storeId}
                onChange={(e) => setStoreId(e.target.value)}
                className="w-full p-3 rounded border dark:bg-gray-700"
                placeholder="Ex: S001"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium">Product ID</label>
              <input
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="w-full p-3 rounded border dark:bg-gray-700"
                placeholder="Ex: P0001"
              />
            </div>

            <button
              onClick={getPrediction}
              disabled={loading || !productId.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg"
            >
              {loading ? "Predicting..." : "Get Prediction"}
            </button>

            {error && (
              <p className="mt-3 text-red-500 text-sm">{error}</p>
            )}
          </div>

          {/* KPI NUMBERS BELOW INPUT */}
          {summary && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* DAILY */}
              <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Predicted Daily Sales
                </p>
                <p className="text-3xl font-bold text-blue-600 mt-1">
                  {summary.dailyUnits}
                </p>
                <p className="text-xs text-gray-400">units / day</p>
              </div>

              {/* WEEKLY */}
              <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Predicted Weekly Sales
                </p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {summary.weeklySales}
                </p>
                <p className="text-xs text-gray-400">units / week</p>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SIDE: CHART */}
        {chartData.length > 0 && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">
              Predicted Sales Distribution (7 Days)
            </h2>

            <div style={{ width: "100%", height: 360 }}>
              <ResponsiveContainer>
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
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
