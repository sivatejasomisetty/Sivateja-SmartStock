import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { ThemeContext } from "../context/ThemeContext";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";

export default function Dashboard() {
  const { theme } = useContext(ThemeContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const CATEGORIES = ["Groceries", "Toys", "Electronics", "Furniture", "Clothing"];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/products/all");
      setProducts(res.data.products || []);
      setLoading(false);
    } catch (err) {
      console.error("Error loading dashboard:", err);
      setLoading(false);
    }
  };

  // Logic for Stat Cards
  const totalProducts = products.length;
  const lowStock = products.filter(p => (p.inventory_level || p.quantity) <= (p.reorderLevel ?? 10)).length;
  const overstock = products.filter(p => (p.inventory_level || p.quantity) >= 100).length;

  // Chart Data Preparation
  const categoryStock = CATEGORIES.map(cat => {
    const items = products.filter(p => p.category === cat);
    return {
      category: cat,
      totalQty: items.reduce((s, p) => s + (p.inventory_level || p.quantity || 0), 0),
    };
  });

  if (loading) return <div className="p-6 text-white">Loading SmartStock Dashboard...</div>;

  return (
    <div className={`p-6 min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100"}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Inventory Dashboard</h1>
        <button 
          onClick={fetchDashboardData}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Refresh Data
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 uppercase font-semibold">Total Products</div>
          <div className="text-3xl font-bold mt-1">{totalProducts}</div>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 uppercase font-semibold">Low Stock Items</div>
          <div className="text-3xl font-bold mt-1 text-red-500">{lowStock}</div>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 uppercase font-semibold">Overstock Items</div>
          <div className="text-3xl font-bold mt-1 text-yellow-500">{overstock}</div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Stock Levels by Category</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryStock}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ccc" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip 
                contentStyle={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#fff', borderRadius: '8px' }}
              />
              <Bar dataKey="totalQty" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                {categoryStock.map((entry, index) => (
                   <Cell key={`cell-${index}`} fill={entry.totalQty < 50 ? '#ef4444' : '#3b82f6'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <p className="mt-4 text-sm text-gray-400">
        Note: Predictions are generated via XGBoost based on historical MySQL data.
      </p>
    </div>
  );
}