// // AddProduct
// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { FiPackage, FiTag, FiHash, FiShoppingCart } from "react-icons/fi";

// const AddProduct = () => {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     name: "",
//     category: "",
//     quantity: "",
//     price: "",
//   });

//   const [errors, setErrors] = useState({});

//   const validate = () => {
//     let temp = {};
//     if (!form.name.trim()) temp.id = "Product ID is required";
//     if (!form.category) temp.category = "Category is required";
//     if (form.quantity === "" || form.quantity < 0)
//       temp.quantity = "Quantity must be 0 or above";
//     if (form.price === "" || form.price <= 0)
//       temp.price = "Price must be greater than 0";

//     setErrors(temp);
//     return Object.keys(temp).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;

//     try {
//       await axios.post("http://localhost:5000/api/products", {
//         name: form.name.trim(),
//         category: form.category,
//         quantity: Number(form.quantity),
//         price: Number(form.price),
//       });

//       navigate("/products");
//     } catch (err) {
//       setErrors({ api: "❌ Failed to add product" });
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-xl shadow">
//       <h2 className="text-2xl font-semibold mb-6 flex gap-2 text-black dark:text-white">
//         <FiPackage /> Add New Product
//       </h2>

//       {errors.api && (
//         <p className="mb-4 p-3 bg-red-100 text-red-700 rounded">
//           {errors.api}
//         </p>
//       )}

//       <form className="space-y-5" onSubmit={handleSubmit}>
//         {/* NAME */}
//         <div>
//           <label className="flex gap-2 mb-1"><FiTag /> Product ID</label>
//           <input
//             className="w-full p-3 rounded border text-black"
//             value={form.id}
//             onChange={(e) => setForm({ ...form, id: e.target.value })}
//             placeholder="Enter Product id"
//           />
//           {errors.id && <p className="text-red-500">{errors.id}</p>}
//         </div>

//         {/* CATEGORY */}
//         <div>
//           <label className="flex gap-2 mb-1"><FiHash /> Category</label>
//           <select
//             className="w-full p-3 rounded border text-black"
//             value={form.category}
//             onChange={(e) => setForm({ ...form, category: e.target.value })}
//           >
//             <option value="">Select Category</option>
//             <option value="Groceries">Groceries</option>
//             <option value="Toys">Toys</option>
//             <option value="Electronics">Electronics</option>
//             <option value="Furniture">Furniture</option>
//             <option value="Clothing">Clothing</option>
//           </select>
//           {errors.category && <p className="text-red-500">{errors.category}</p>}
//         </div>

//         {/* QUANTITY */}
//         <div>
//           <label className="flex gap-2 mb-1"><FiShoppingCart /> Quantity</label>
//           <input
//             type="number"
//             className="w-full p-3 rounded border text-black"
//             value={form.quantity}
//             onChange={(e) => setForm({ ...form, quantity: e.target.value })}
//             placeholder="Enter Quantity"
//           />
//           {errors.quantity && <p className="text-red-500">{errors.quantity}</p>}
//         </div>

//         {/* PRICE */}
//         <div>
//           <label className="flex gap-2 mb-1"><FiTag /> Price (₹)</label>
//           <input
//             type="number"
//             className="w-full p-3 rounded border text-black"
//             value={form.price}
//             onChange={(e) => setForm({ ...form, price: e.target.value })}
//             placeholder="Enter Price"
//           />
//           {errors.price && <p className="text-red-500">{errors.price}</p>}
//         </div>

//         <button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg">
//           Save Product
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AddProduct;






















import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiPackage, FiTag, FiHash, FiShoppingCart } from "react-icons/fi";

const AddProduct = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    product_id: "",
    category: "",
    inventory_level: "",
    price: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
  let temp = {};

  if (form.product_id === "")
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
    await axios.post("http://localhost:8000/api/products", {
      product_id: form.product_id.trim().toLowerCase(),
      category: form.category,
      inventory_level: Number(form.inventory_level),
      price: Number(form.price),
    });

    navigate("/products");
  } catch (err) {
    console.error(err);
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
        {/* PRODUCT ID */}
        <div>
          <label className="flex gap-2 mb-1">
            <FiTag /> Product ID
          </label>
          <input
            type="text"
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
          {errors.category && (
            <p className="text-red-500">{errors.category}</p>
          )}
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
            placeholder="Enter Quantity"
          />
          {errors.inventory_level && (
            <p className="text-red-500">{errors.inventory_level}</p>
          )}
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
            placeholder="Enter Price"
          />
          {errors.price && (
            <p className="text-red-500">{errors.price}</p>
          )}
        </div>

        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg">
          Save Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
