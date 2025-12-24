import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";

const EditProduct = () => {
  const { theme } = useContext(ThemeContext);
  const { id } = useParams(); // DB id
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    product_id: "",
    category: "",
    inventory_level: "",
    price: "",
  });

  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");

  const CATEGORIES = [
    "Groceries",
    "Toys",
    "Electronics",
    "Furniture",
    "Clothing",
  ];

  // 🔹 LOAD PRODUCT BY DB ID
  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/products/${id}`)
      .then((res) => {
        if (res.data.product) {
          setProduct({
            product_id: res.data.product.product_id,
            category: res.data.product.category,
            inventory_level: res.data.product.inventory_level,
            price: res.data.product.price,
          });
        }
      })
      .catch(() => {
        setErrors({ general: "Failed to load product" });
      });
  }, [id]);

  // 🔹 HANDLE INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]:
        name === "inventory_level" || name === "price"
          ? value
          : value,
    });
  };

  // 🔹 VALIDATION
  const validate = () => {
    let temp = {};

    if (!product.category)
      temp.category = "Category is required";

    if (product.inventory_level === "" || Number(product.inventory_level) < 0)
      temp.inventory_level = "Quantity must be 0 or above";

    if (product.price === "" || Number(product.price) <= 0)
      temp.price = "Price must be greater than 0";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  // 🔹 SUBMIT UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await axios.put(`http://localhost:8000/api/products/${id}`, {
        category: product.category,
        inventory_level: Number(product.inventory_level),
        price: Number(product.price),
      });

      setSuccessMsg("Product updated successfully!");
      setTimeout(() => navigate("/products"), 1200);
    } catch (err) {
      console.error(err);
      setErrors({ general: "Failed to update product" });
    }
  };

  return (
    <div
      className={`min-h-screen p-6 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100"
      }`}
    >
      <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4">Edit Product ✏️</h2>

        {errors.general && (
          <p className="text-red-500 mb-2">{errors.general}</p>
        )}

        {successMsg && (
          <p className="text-green-600 bg-green-100 p-2 rounded mb-2">
            {successMsg}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* PRODUCT ID (READ-ONLY) */}
          <div>
            <label className="block mb-1">Product ID</label>
            <input
              value={product.product_id}
              disabled
              className="w-full p-3 border rounded bg-gray-100 dark:bg-gray-700 text-gray-600 cursor-not-allowed"
            />
          </div>

          {/* CATEGORY */}
          <div>
            <label className="block mb-1">Category</label>
            <select
              name="category"
              value={product.category}
              onChange={handleChange}
              className="w-full p-3 border rounded text-black"
            >
              <option value="">Select Category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500">{errors.category}</p>
            )}
          </div>

          {/* QUANTITY */}
          <div>
            <label className="block mb-1">Quantity</label>
            <input
              name="inventory_level"
              type="number"
              value={product.inventory_level}
              onChange={handleChange}
              className="w-full p-3 border rounded text-black"
            />
            {errors.inventory_level && (
              <p className="text-red-500">{errors.inventory_level}</p>
            )}
          </div>

          {/* PRICE */}
          <div>
            <label className="block mb-1">Price (₹)</label>
            <input
              name="price"
              type="number"
              value={product.price}
              onChange={handleChange}
              className="w-full p-3 border rounded text-black"
            />
            {errors.price && (
              <p className="text-red-500">{errors.price}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-2 rounded transition"
          >
            Update Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
