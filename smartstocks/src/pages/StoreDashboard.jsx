// //------------------- Working---------------------------
// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";

// const STORES_API = "http://127.0.0.1:8000/stores-by-city";

// export default function StoreDashboard() {
//   const { city } = useParams();
//   const [stores, setStores] = useState([]);

//   /* ================= FETCH REAL DATA ================= */
//   useEffect(() => {
//     const fetchStores = async () => {
//       try {
//         const res = await axios.get(STORES_API, {
//           params: { city },
//         });
//         setStores(res.data);
//       } catch (err) {
//         console.error("Failed to load stores", err);
//         setStores([]);
//       }
//     };

//     fetchStores();
//   }, [city]);

//   /* ================= STOCK STATUS ================= */
//   const getStockStatus = (inventory, sold) => {
//     if (inventory < sold * 0.5) return "Understock 🔴";
//     if (inventory > sold * 1.5) return "Overstock 🟡";
//     return "Balanced 🟢";
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-5 text-white">
//         {city} Stores
//       </h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//         {stores.map((store) => (
//           <div
//             key={store.StoreID}
//             className="bg-white p-5 rounded-xl shadow"
//           >
//             <h2 className="text-lg font-semibold">
//               {store.storeName || store.StoreID}
//             </h2>
//             <p>Units Sold: {store.totalUnitsSold}</p>
//             <p>Inventory: {store.totalInventory}</p>
//             <p className="font-semibold">
//               {getStockStatus(
//                 store.totalInventory,
//                 store.totalUnitsSold
//               )}
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }




















import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
import api from "../api/axios";


export default function StoreDashboard() {
  const { city } = useParams();
  const navigate = useNavigate();

  const decodedCity = city ? decodeURIComponent(city) : null;

  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    if (!decodedCity) return;

    const fetchStores = async () => {
      try {
        //For running Locally
       // const token = localStorage.getItem("token");
        // const res = await axios.get(
        //   `http://localhost:8000/api/sales/city/${decodedCity}/stores`,
        //   {
        //     headers: {
        //       Authorization: `Bearer ${token}`,
        //     },
        //   }
        // );

        //For Deployment
        const res = await api.get(`/api/sales/city/${decodedCity}/stores`);


        setStores(res.data || []);
      } catch (err) {
        console.error("Failed to load stores", err);
        setStores([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, [decodedCity]);

  /* ================= STOCK STATUS ================= */
  const getStockStatus = (inventory, sold) => {
    if (inventory < sold * 0.5) return "Understock 🔴";
    if (inventory > sold * 1.5) return "Overstock 🟡";
    return "Balanced 🟢";
  };

  /* ================= NO CITY ================= */
  if (!decodedCity) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold mb-2">
          No city selected
        </h2>
        <p className="mb-4 text-gray-600">
          Please select a city from the City Dashboard.
        </p>
        <button
          onClick={() => navigate("/cities")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Go to City Dashboard
        </button>
      </div>
    );
  }

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="p-6 text-gray-900 dark:text-white">
        Loading stores in {decodedCity}...
      </div>
    );
  }

  /* ================= NO DATA ================= */
  if (stores.length === 0) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          No store data available for {decodedCity}
        </h2>
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-5 text-gray-900 dark:text-white" >
        {decodedCity} Stores
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {stores.map((store) => (
          <div
            key={store.StoreID}
            className="bg-white p-5 rounded-xl shadow hover:shadow-lg"
          >
            <h2 className="text-lg font-semibold">
              {store.storeName || store.StoreID}
            </h2>
            <p>Units Sold: {store.totalUnitsSold}</p>
            <p>Inventory: {store.totalInventory}</p>
            <p className="font-semibold">
              {getStockStatus(
                store.totalInventory,
                store.totalUnitsSold
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
