import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ChatbotWidget from "../components/ChatbotWidget";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex bg-gray-100 dark:bg-gray-900 min-h-screen">

      {/* SIDEBAR */}
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />

      {/* MAIN CONTAINER */}
      <div className="flex flex-col flex-1">

        {/* NAVBAR */}
        <Navbar setSidebarOpen={setSidebarOpen} />

        {/* PAGE CONTENT */}
        <main className="p-4 mt-4 lg:ml-64">
          <Outlet />
        </main>
      </div>

      {/* FLOATING CHATBOT */}
      <ChatbotWidget />
    </div>
  );
};

export default MainLayout;












