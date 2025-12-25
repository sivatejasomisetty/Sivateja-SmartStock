// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import {
//   BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
// } from "recharts";

// export default function CityDashboard() {
//   const [cities, setCities] = useState([]);
//   const [search, setSearch] = useState("");
//   const navigate = useNavigate();

//   // useEffect(() => {
//   //   axios
//   //     .get("http://localhost:8000/api/sales/cities/summary")
//   //     .then(res => setCities(res.data));
//   // }, []);

//   /* SEARCH */
//   const filteredCities = cities.filter(city =>
//     city.city.toLowerCase().includes(search.toLowerCase())
//   );

//   /* KPI CALCULATIONS */
//   const totalCities = cities.length;
//   const totalStores = cities.reduce((sum, c) => sum + c.totalStores, 0);
//   const totalUnitsSold = cities.reduce((sum, c) => sum + c.totalUnitsSold, 0);
//   const totalInventory = cities.reduce((sum, c) => sum + c.totalInventory, 0);

//   /* STOCK STATUS */
//   const stockStatus = (inventory, sold) => {
//     if (inventory < sold * 0.7) return "bg-red-100 text-red-700";
//     if (inventory > sold * 1.5) return "bg-yellow-100 text-yellow-700";
//     return "bg-green-100 text-green-700";
//   };

//   return (
//     <div className="p-6 space-y-8">

//       {/* ================= KPI CARDS ================= */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
//         <KPI title="Cities" value={totalCities} />
//         <KPI title="Stores" value={totalStores} />
//         <KPI title="Units Sold" value={totalUnitsSold} />
//         <KPI title="Inventory" value={totalInventory} />
//       </div>

//       {/* ================= BAR CHART ================= */}
//       <div className="bg-white p-6 rounded-xl shadow">
//         <h2 className="text-xl font-bold mb-4">City vs Units Sold</h2>

//         <ResponsiveContainer width="100%" height={300}>
//           <BarChart data={cities}>
//             <XAxis dataKey="city" />
//             <YAxis />
//             <Tooltip />
//             <Bar dataKey="totalUnitsSold" />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>

//       {/* ================= SEARCH ================= */}
//       <input
//         type="text"
//         placeholder="Search city..."
//         className="p-3 border rounded w-full md:w-1/3"
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//       />

//       {/* ================= CITY CARDS ================= */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {filteredCities.map(city => (
//           <div
//             key={city.city}
//             onClick={() => navigate(`/stores/${city.city}`)}
//             className={`cursor-pointer p-5 rounded-xl shadow hover:shadow-lg 
//               ${stockStatus(city.totalInventory, city.totalUnitsSold)}`}
//           >
//             <h2 className="text-xl font-bold">{city.city}</h2>
//             <p>Stores: {city.totalStores}</p>
//             <p>Units Sold: {city.totalUnitsSold}</p>
//             <p>Inventory: {city.totalInventory}</p>
//           </div>
//         ))}
//       </div>

//     </div>
//   );
// }

// /* ================= KPI COMPONENT ================= */
// function KPI({ title, value }) {
//   return (
//     <div className="bg-white p-5 rounded-xl shadow">
//       <h3 className="text-gray-500">{title}</h3>
//       <p className="text-2xl font-bold">{value}</p>
//     </div>
//   );
// }

















































import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function CityDashboard() {
  const [cities, setCities] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  /* ================= REAL DATA ================= */
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/city-dashboard"
        );
        setCities(res.data);
      } catch (err) {
        console.error("Failed to load city dashboard", err);
      }
    };

    fetchCities();
  }, []);

  /* ================= SEARCH ================= */
  const filteredCities = cities.filter((city) =>
    city.city.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= KPI CALCULATIONS ================= */
  const totalCities = cities.length;
  const totalStores = cities.reduce((sum, c) => sum + c.totalStores, 0);
  const totalUnitsSold = cities.reduce(
    (sum, c) => sum + c.totalUnitsSold,
    0
  );
  const totalInventory = cities.reduce(
    (sum, c) => sum + c.totalInventory,
    0
  );

  /* ================= STOCK STATUS ================= */
  const stockStatus = (inventory, sold) => {
    if (inventory < sold * 0.7) return "bg-red-100 text-red-700";
    if (inventory > sold * 1.5) return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-700";
  };

  return (
    <div className="p-6 space-y-8">
      {/* ================= KPI CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <KPI title="Cities" value={totalCities} />
        <KPI title="Stores" value={totalStores} />
        <KPI title="Units Sold" value={totalUnitsSold} />
        <KPI title="Inventory" value={totalInventory} />
      </div>

      {/* ================= BAR CHART ================= */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">City vs Units Sold (Last 30 Days)</h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={cities}>
            <XAxis dataKey="city" />
            <YAxis />
            <Tooltip />
            <Bar
                dataKey={(d) => Math.round(d.totalUnitsSold / 1000)}
                name="Units Sold (in thousands)"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ================= SEARCH ================= */}
      <input
        type="text"
        placeholder="Search city..."
        className="p-3 border rounded w-full md:w-1/3"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* ================= CITY CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredCities.map((city) => (
          <div
            key={city.city}
            onClick={() => navigate(`/stores/${city.city}`)}
            className={`cursor-pointer p-5 rounded-xl shadow hover:shadow-lg 
              ${stockStatus(
                city.totalInventory,
                city.totalUnitsSold
              )}`}
          >
            <h2 className="text-xl font-bold">{city.city}</h2>
            <p>Stores: {city.totalStores}</p>
            <p>Units Sold: {city.totalUnitsSold}</p>
            <p>Inventory: {city.totalInventory}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= KPI COMPONENT ================= */
function KPI({ title, value }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <h3 className="text-gray-500">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
