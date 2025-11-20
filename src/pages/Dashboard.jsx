import MainLayout from "../layouts/MainLayout";

export default function Dashboard() {
  return (
    <MainLayout>
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Dashboard
      </h1>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">

        {/* Total Products */}
        <div className="bg-white p-6 shadow rounded-xl border">
          <h2 className="text-sm text-gray-500">Total Products</h2>
          <p className="text-3xl font-bold text-gray-800 mt-2">120</p>
        </div>

        {/* Low Stock */}
        <div className="bg-white p-6 shadow rounded-xl border">
          <h2 className="text-sm text-gray-500">Low Stock Items</h2>
          <p className="text-3xl font-bold text-red-600 mt-2">14</p>
        </div>

        {/* Incoming Shipments */}
        <div className="bg-white p-6 shadow rounded-xl border">
          <h2 className="text-sm text-gray-500">Incoming Shipments</h2>
          <p className="text-3xl font-bold text-blue-600 mt-2">5</p>
        </div>

        {/* Sales Forecast */}
        <div className="bg-white p-6 shadow rounded-xl border">
          <h2 className="text-sm text-gray-500">Next Week Forecast</h2>
          <p className="text-3xl font-bold text-green-600 mt-2">+12%</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Sales Chart */}
        <div className="bg-white p-6 shadow rounded-xl border min-h-[300px]">
          <h3 className="text-lg font-semibold mb-4">Sales Overview</h3>
          <p className="text-gray-500 text-sm">
            (Chart will be placed here)
          </p>
        </div>

        {/* Stock Chart */}
        <div className="bg-white p-6 shadow rounded-xl border min-h-[300px]">
          <h3 className="text-lg font-semibold mb-4">Stock Levels</h3>
          <p className="text-gray-500 text-sm">
            (Chart will be placed here)
          </p>
        </div>
      </div>
    </div>
    </MainLayout>
  );
}
