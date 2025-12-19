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
//     if (!form.name.trim()) temp.name = "Product name is required";
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
//           <label className="flex gap-2 mb-1"><FiTag /> Product Name</label>
//           <input
//             className="w-full p-3 rounded border text-black"
//             value={form.name}
//             onChange={(e) => setForm({ ...form, name: e.target.value })}
//             placeholder="Enter Product Name"
//           />
//           {errors.name && <p className="text-red-500">{errors.name}</p>}
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

export default function AddProduct() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    category: "",
    quantity: "",
    price: ""
  });

  const submit = async (e) => {
    e.preventDefault();

    await axios.post("http://localhost:8000/api/products", {
      product_id: crypto.randomUUID().slice(0, 6),
      name: form.name,
      category: form.category,
      inventory_level: Number(form.quantity),
      price: Number(form.price)
    });

    navigate("/products");
  };

  return (
    <form onSubmit={submit} className="p-6 max-w-lg mx-auto">
      <input placeholder="Name" onChange={e => setForm({...form, name:e.target.value})} />
      <input placeholder="Category" onChange={e => setForm({...form, category:e.target.value})} />
      <input type="number" placeholder="Quantity" onChange={e => setForm({...form, quantity:e.target.value})} />
      <input type="number" placeholder="Price" onChange={e => setForm({...form, price:e.target.value})} />
      <button>Add Product</button>
    </form>
  );
}
