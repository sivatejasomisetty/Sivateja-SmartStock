import MainLayout from "../layouts/MainLayout";
import { Link } from "react-router-dom";

export default function Products() {
  const sampleProducts = [
    { id: 1, name: "Sugar 1kg", stock: 45, price: 40, category: "Grocery" },
    { id: 2, name: "Milk 500ml", stock: 12, price: 25, category: "Dairy" },
    { id: 3, name: "Bread", stock: 5, price: 30, category: "Bakery" },
  ];

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Products</h1>

        <Link
          to="/products/add"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Add Product
        </Link>
      </div>

      {/* Product Table */}
      <div className="bg-white shadow rounded-xl border overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-600">#</th>
              <th className="p-4 font-semibold text-gray-600">Name</th>
              <th className="p-4 font-semibold text-gray-600">Category</th>
              <th className="p-4 font-semibold text-gray-600">Stock</th>
              <th className="p-4 font-semibold text-gray-600">Price</th>
              <th className="p-4 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>

          <tbody>
            {sampleProducts.map((item) => (
              <tr
                key={item.id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="p-4">{item.id}</td>
                <td className="p-4 font-medium">{item.name}</td>
                <td className="p-4">{item.category}</td>

                {/* Stock with Low stock coloring */}
                <td
                  className={`p-4 font-medium ${
                    item.stock < 10 ? "text-red-600" : "text-gray-700"
                  }`}
                >
                  {item.stock}
                </td>

                <td className="p-4">₹{item.price}</td>

                <td className="p-4 space-x-2">
                  <Link
                    to={`/products/edit/${item.id}`}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Edit
                  </Link>

                  <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
}
