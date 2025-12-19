// import React, { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import { useParams, useNavigate } from "react-router-dom";
// import { ThemeContext } from "../context/ThemeContext";

// const EditProduct = () => {
//   const { theme } = useContext(ThemeContext);
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [product, setProduct] = useState({
//     name: "",
//     quantity: 0,
//     price: 0,
//     category: ""
//   });

//   const [errors, setErrors] = useState({});
//   const [successMsg, setSuccessMsg] = useState("");

//   const CATEGORIES = ["Groceries", "Toys", "Electronics", "Furniture", "Clothing"];

//   // LOAD PRODUCT DATA
//   useEffect(() => {
//     axios
//       .get(`http://localhost:5000/api/products/${id}`)
//       .then((res) => {
//         if (res.data.product) setProduct(res.data.product);
//       })
//       .catch(() => setErrors({ general: "Failed to load product" }));
//   }, [id]);

//   // HANDLE INPUT CHANGE
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setProduct({
//       ...product,
//       [name]: name === "price" || name === "quantity" ? Number(value) : value,
//     });
//   };

//   // VALIDATION
//   const validate = () => {
//     let temp = {};
//     if (!product.name.trim()) temp.name = "Product name is required";
//     if (!product.category) temp.category = "Category is required";
//     if (product.quantity < 0) temp.quantity = "Quantity must be 0 or above";
//     if (product.price <= 0) temp.price = "Price must be greater than 0";

//     setErrors(temp);
//     return Object.keys(temp).length === 0;
//   };

//   // HANDLE FORM SUBMIT
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;

//     try {
//       await axios.put(`http://localhost:5000/api/products/${id}`, product);
//       setSuccessMsg("Product updated successfully!");
//       setTimeout(() => navigate("/products"), 1200);
//     } catch {
//       setErrors({ general: "Failed to update product" });
//     }
//   };

//   return (
//     <div className={`min-h-screen p-6 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100"}`}>
//       <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
//         <h2 className="text-2xl font-bold mb-4">Edit Product ✏️</h2>

//         {errors.general && <p className="text-red-500 mb-2">{errors.general}</p>}
//         {successMsg && <p className="text-green-600 bg-green-100 p-2 rounded mb-2">{successMsg}</p>}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* PRODUCT NAME */}
//           <div>
//             <label className="block mb-1">Product Name</label>
//             <input
//               name="name"
//               value={product.name || ""}
//               onChange={handleChange}
//               className="w-full p-3 border rounded text-black"
//             />
//             {errors.name && <p className="text-red-500">{errors.name}</p>}
//           </div>

//           {/* QUANTITY */}
//           <div>
//             <label className="block mb-1">Quantity</label>
//             <input
//               name="quantity"
//               type="number"
//               value={product.quantity || 0}
//               onChange={handleChange}
//               className="w-full p-3 border rounded text-black"
//             />
//             {errors.quantity && <p className="text-red-500">{errors.quantity}</p>}
//           </div>

//           {/* PRICE */}
//           <div>
//             <label className="block mb-1">Price (₹)</label>
//             <input
//               name="price"
//               type="number"
//               value={product.price || 0}
//               onChange={handleChange}
//               className="w-full p-3 border rounded text-black"
//             />
//             {errors.price && <p className="text-red-500">{errors.price}</p>}
//           </div>

//           {/* CATEGORY */}
//           <div>
//             <label className="block mb-1">Category</label>
//             <select
//               name="category"
//               value={product.category || ""}
//               onChange={handleChange}
//               className="w-full p-3 border rounded text-black"
//             >
//               <option value="">Select Category</option>
//               {CATEGORIES.map((c) => (
//                 <option key={c} value={c}>{c}</option>
//               ))}
//             </select>
//             {errors.category && <p className="text-red-500">{errors.category}</p>}
//           </div>

//           <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
//             Update Product
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EditProduct;

































import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});

  useEffect(() => {
    axios.get(`http://localhost:8000/api/products/${id}`)
      .then(res => setProduct(res.data.product));
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();

    await axios.put(`http://localhost:8000/api/products/${id}`, {
      name: product.name,
      category: product.category,
      inventory_level: product.inventory_level,
      price: product.price
    });

    navigate("/products");
  };

  return (
    <form onSubmit={submit} className="p-6 max-w-lg mx-auto">
      <input value={product.name || ""} onChange={e => setProduct({...product, name:e.target.value})}/>
      <input value={product.category || ""} onChange={e => setProduct({...product, category:e.target.value})}/>
      <input type="number" value={product.inventory_level || 0} onChange={e => setProduct({...product, inventory_level:e.target.value})}/>
      <input type="number" value={product.price || 0} onChange={e => setProduct({...product, price:e.target.value})}/>
      <button>Update</button>
    </form>
  );
}
