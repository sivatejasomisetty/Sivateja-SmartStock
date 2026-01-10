import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { FiPackage, FiTag, FiHash, FiShoppingCart } from "react-icons/fi";

const AddProduct = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    store_id: "HYD-S01",          // ✅ REQUIRED (admin safe)
    product_id: "",
    category: "",
    inventory_level: "",
    price: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    let temp = {};

    if (!form.product_id.trim())
      temp.product_id = "Product ID is required";

    if (!form.category)
      temp.category = "Category is required";

    if (form.inventory_level === "" || Number(form.inventory_level) < 0)
      temp.inventory_level = "Quantity must be 0 or above";

    if (form.price === "" || Number(form.price) <= 0)
      temp.price = "Price must be greater than 0";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  try {
    const res = await api.post("/api/products", {
      store_id: form.store_id,
      product_id: form.product_id.trim().toUpperCase(),
      category: form.category,
      inventory_level: Number(form.inventory_level),
      price: Number(form.price),
    });

    alert(res.data.message || "Product added successfully");
    navigate("/products");
  } catch (err) {
    console.error("ADD PRODUCT ERROR:", err.response?.data || err.message);
    setErrors({ api: "❌ Failed to add product" });
  }
};


  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-6 flex gap-2">
        <FiPackage /> Add New Product
      </h2>

      {errors.api && (
        <p className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {errors.api}
        </p>
      )}

      <form className="space-y-5" onSubmit={handleSubmit}>

        {/* STORE ID */}
        <div>
          <label className="flex gap-2 mb-1">
            <FiHash /> Store ID
          </label>
          <input
            className="w-full p-3 rounded border text-black"
            value={form.store_id}
            onChange={(e) =>
              setForm({ ...form, store_id: e.target.value })
            }
            placeholder="Ex: HYD-S01"
          />
        </div>

        {/* PRODUCT ID */}
        <div>
          <label className="flex gap-2 mb-1">
            <FiTag /> Product ID
          </label>
          <input
            className="w-full p-3 rounded border text-black"
            value={form.product_id}
            onChange={(e) =>
              setForm({ ...form, product_id: e.target.value })
            }
            placeholder="Ex: P0001"
          />
          {errors.product_id && <p className="text-red-500">{errors.product_id}</p>}
        </div>

        {/* CATEGORY */}
        <div>
          <label className="flex gap-2 mb-1">
            <FiHash /> Category
          </label>
          <select
            className="w-full p-3 rounded border text-black"
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
          >
            <option value="">Select Category</option>
            <option value="Groceries">Groceries</option>
            <option value="Toys">Toys</option>
            <option value="Electronics">Electronics</option>
            <option value="Furniture">Furniture</option>
            <option value="Clothing">Clothing</option>
          </select>
          {errors.category && <p className="text-red-500">{errors.category}</p>}
        </div>

        {/* QUANTITY */}
        <div>
          <label className="flex gap-2 mb-1">
            <FiShoppingCart /> Quantity
          </label>
          <input
            type="number"
            className="w-full p-3 rounded border text-black"
            value={form.inventory_level}
            onChange={(e) =>
              setForm({ ...form, inventory_level: e.target.value })
            }
          />
          {errors.inventory_level && <p className="text-red-500">{errors.inventory_level}</p>}
        </div>

        {/* PRICE */}
        <div>
          <label className="flex gap-2 mb-1">
            <FiTag /> Price (₹)
          </label>
          <input
            type="number"
            className="w-full p-3 rounded border text-black"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: e.target.value })
            }
          />
          {errors.price && <p className="text-red-500">{errors.price}</p>}
        </div>

        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg">
          Save Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
