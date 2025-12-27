// import React, { useEffect, useState, useContext, useMemo } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { ThemeContext } from "../context/ThemeContext";
// import { FiSearch, FiEdit, FiTrash2 } from "react-icons/fi";

// export default function Products() {
//   const { theme } = useContext(ThemeContext);
//   const navigate = useNavigate();

//   const [products, setProducts] = useState([]);

//   const [search, setSearch] = useState("");
//   const [categoryFilter, setCategoryFilter] = useState("");
//   const [stockFilter, setStockFilter] = useState("");
//   const [sortBy, setSortBy] = useState("");

//   const [page, setPage] = useState(1);
//   const itemsPerPage = 8;

//   const CATEGORIES = ["Groceries", "Toys", "Electronics", "Furniture", "Clothing"];

//   // ✅ FETCH ALL PRODUCTS
//   const fetchProducts = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/products/all");
//       setProducts(res.data.products || []);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   useEffect(() => {
//     setPage(1);
//   }, [search, categoryFilter, stockFilter, sortBy]);

//   // STOCK STATUS
//   const getStockStatus = (p) => {
//     if (p.quantity <= (p.reorderLevel ?? 5)) return "low";
//     if (p.quantity >= (p.reorderLevel ?? 10) * 10) return "over";
//     return "normal";
//   };

//   // FILTER + SORT
//   const filteredProducts = useMemo(() => {
//     let data = [...products];

//     if (search) {
//       data = data.filter(
//         (p) =>
//           p.name.toLowerCase().includes(search.toLowerCase()) ||
//           (p.sku || "").toLowerCase().includes(search.toLowerCase())
//       );
//     }

//     if (categoryFilter) {
//       data = data.filter((p) => p.category === categoryFilter);
//     }

//     if (stockFilter) {
//       data = data.filter((p) => getStockStatus(p) === stockFilter);
//     }

//     if (sortBy === "name") data.sort((a, b) => a.name.localeCompare(b.name));
//     if (sortBy === "price") data.sort((a, b) => a.price - b.price);
//     if (sortBy === "quantity") data.sort((a, b) => a.quantity - b.quantity);

//     return data;
//   }, [products, search, categoryFilter, stockFilter, sortBy]);

//   // PAGINATION
//   const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
//   const paginatedProducts = filteredProducts.slice(
//     (page - 1) * itemsPerPage,
//     page * itemsPerPage
//   );

//   // DELETE
//   const deleteProduct = async (id) => {
//     if (!window.confirm("Delete this product?")) return;
//     await axios.delete(`http://localhost:5000/api/products/${id}`);
//     fetchProducts();
//   };

//   return (
//     <div className={`p-6 min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
//       <div className="flex justify-between mb-6">
//         <h1 className="text-3xl font-semibold">Products</h1>
//         <button
//           onClick={() => navigate("/add-product")}
//           className="bg-blue-600 text-white px-4 py-2 rounded-lg"
//         >
//           + Add Product
//         </button>
//       </div>

//       {/* FILTERS */}
//       <div className="grid md:grid-cols-4 gap-4 mb-4">
//         <input className="p-3 rounded-lg border text-black" placeholder="Search"
//           value={search} onChange={(e) => setSearch(e.target.value)} />

//         <select className="p-3 rounded-lg border text-black"
//           value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
//           <option value="">All Categories</option>
//           {CATEGORIES.map(c => <option key={c}>{c}</option>)}
//         </select>

//         <select className="p-3 rounded-lg border text-black"
//           value={stockFilter} onChange={(e) => setStockFilter(e.target.value)}>
//           <option value="">All Stock</option>
//           <option value="low">Low</option>
//           <option value="normal">Normal</option>
//           <option value="over">Over</option>
//         </select>

//         <select className="p-3 rounded-lg border text-black"
//           value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
//           <option value="">Sort By</option>
//           <option value="name">Name</option>
//           <option value="price">Price</option>
//           <option value="quantity">Quantity</option>
//         </select>
//       </div>

//       {/* TABLE */}
//       <table className="w-full bg-white dark:bg-gray-800 rounded-lg">
//         <thead className="bg-gray-200 dark:bg-gray-700">
//           <tr>
//             <th className="p-3">SKU</th>
//             <th className="p-3">Product</th>
//             <th className="p-3">Category</th>
//             <th className="p-3">Qty</th>
//             <th className="p-3">Price</th>
//             <th className="p-3">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {paginatedProducts.map(p => {
//             const stock = getStockStatus(p);
//             const rowBg =
//               stock === "low" ? "bg-red-200 text-black" :
//               stock === "over" ? "bg-yellow-200 text-black" : "";

//             return (
//               <tr key={p._id} className={`${rowBg} border-b`}>
//                 <td className="p-3">{p.sku}</td>
//                 <td className="p-3">{p.name}</td>
//                 <td className="p-3">{p.category}</td>
//                 <td className="p-3">{p.quantity}</td>
//                 <td className="p-3">₹{p.price}</td>
//                 <td className="p-3 flex gap-3">
//                   <FiEdit onClick={() => navigate(`/edit-product/${p._id}`)} />
//                   <FiTrash2 onClick={() => deleteProduct(p._id)} />
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>

//       {/* PAGINATION */}
//       <div className="flex justify-center gap-4 mt-4">
//         <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</button>
//         <span>{page} / {totalPages || 1}</span>
//         <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
//       </div>
//     </div>
//   );
// }


























import React, { useEffect, useState, useContext, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const API_BASE = "http://localhost:8000/api/products";

export default function Products() {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [page, setPage] = useState(1);

  const itemsPerPage = 8;

  const CATEGORIES = [
    "Groceries",
    "Toys",
    "Electronics",
    "Furniture",
    "Clothing",
  ];

  /* ================= FETCH PRODUCTS ================= */
 const fetchProducts = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      "http://localhost:8000/api/products/all",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // 🔥 THIS LINE WAS MISSING
    setProducts(res.data.products || []);

  } catch (err) {
    console.error("Failed to fetch products:", err);
    setProducts([]);
  }
};

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, categoryFilter, stockFilter, sortBy]);

  /* ================= STOCK STATUS LOGIC ================= */
  const getStockStatus = (qty) => {
    if (qty <= 10) {
      return { label: "Low Stock", color: "bg-red-100 text-red-700" };
    }
    if (qty >= 100) {
      return { label: "Overstock", color: "bg-yellow-100 text-yellow-700" };
    }
    return { label: "Normal", color: "bg-green-100 text-green-700" };
  };

  /* ================= FILTER + SORT ================= */
  const filteredProducts = useMemo(() => {
    let data = [...products];

    if (search) {
      data = data.filter(
        (p) =>
          (p.product_id || "").toLowerCase().includes(search.toLowerCase())
      );
    }

    if (categoryFilter) {
      data = data.filter((p) => p.category === categoryFilter);
    }

    if (stockFilter) {
      data = data.filter(
        (p) =>
          getStockStatus(p.inventory_level).label
            .toLowerCase()
            .includes(stockFilter)
      );
    }

    if (sortBy === "price") {
      data.sort((a, b) => a.price - b.price);
    }

    if (sortBy === "quantity") {
      data.sort(
        (a, b) =>
          (a.inventory_level || 0) - (b.inventory_level || 0)
      );
    }

    return data;
  }, [products, search, categoryFilter, stockFilter, sortBy]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  /* ================= DELETE PRODUCT ================= */
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(`${API_BASE}/${id}`);
      fetchProducts();
    } catch (err) {
      alert("Failed to delete product");
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
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Inventory Products</h1>
        <button
          onClick={() => navigate("/add-product")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          + Add Product
        </button>
      </div>

      {/* FILTERS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input
          className="p-3 rounded border text-gray-800 font-semibold"
          placeholder="Search by Product ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="p-3 rounded border text-gray-800"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          className="p-3 rounded border text-gray-800"
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
        >
          <option value="">All Stock Status</option>
          <option value="low">Low Stock</option>
          <option value="normal">Normal</option>
          <option value="over">Overstock</option>
        </select>

        <select
          className="p-3 rounded border text-gray-800"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="price">Price</option>
          <option value="quantity">Stock Quantity</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto shadow rounded-lg">
        <table className="w-full border-collapse">
  <thead>
    <tr className="bg-gray-700 text-white h-14">
      <th className="px-4 py-3 text-left align-middle">Product ID</th>
      <th className="px-4 py-3 text-left align-middle">Category</th>
      <th className="px-4 py-3 text-left align-middle">Stock Qty</th>
      <th className="px-4 py-3 text-left align-middle">Status</th>
      <th className="px-4 py-3 text-left align-middle">Price</th>
      <th className="px-4 py-3 text-center align-middle">Actions</th>
    </tr>
  </thead>

  <tbody>
    {paginatedProducts.map((p) => {
      const status = getStockStatus(p.inventory_level);
      return (
        <tr
          key={p.id}
              className="
  h-14
  border-b
  border-gray-300
  hover:bg-gray-200
  dark:border-gray-600
  dark:hover:bg-gray-700
  transition-colors
"

        >
          <td className="px-4 py-3 align-middle">{p.product_id}</td>
          <td className="px-4 py-3 align-middle">{p.category}</td>
          <td className="px-4 py-3 align-middle">{p.inventory_level}</td>
          <td className="px-4 py-3 align-middle">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}
            >
              {status.label}
            </span>
          </td>
          <td className="px-4 py-3 align-middle">₹{p.price}</td>
          <td className="px-4 py-3 align-middle text-center">
            <div className="flex justify-center gap-4">
              <FiEdit
                className="cursor-pointer text-blue-500"
                onClick={() => navigate(`/edit-product/${p.id}`)}
              />
              <FiTrash2
                className="cursor-pointer text-red-500"
                onClick={() => deleteProduct(p.id)}
              />
            </div>
          </td>
        </tr>
      );
    })}
  </tbody>
</table>
    </div>

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50 text-white font-bold"
        >
          Prev
        </button>

        <span className="font-semibold">
          Page {page} of {totalPages || 1}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50 text-white font-bold"
        >
          Next
        </button>
      </div>
    </div>
  );
}
