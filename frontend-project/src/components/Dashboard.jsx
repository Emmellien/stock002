import React from "react";
import { Link } from "react-router-dom";
import {
  Package,
  ArrowDownCircle,
  ArrowUpCircle,
  FileBarChart2,
  LogOut,
  Home,
  Boxes,
  TrendingUp,
  ShoppingCart,
} from "lucide-react";

function Dashboard() {
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const cards = [
    {
      title: "Products",
      description: "Manage all products and inventory items",
      icon: <Package size={35} />,
      color: "bg-blue-600",
      link: "/product",
    },
    {
      title: "Product In",
      description: "Manage incoming stock and purchases",
      icon: <ArrowDownCircle size={35} />,
      color: "bg-green-600",
      link: "/product-in",
    },
    {
      title: "Product Out",
      description: "Manage sold products and transactions",
      icon: <ArrowUpCircle size={35} />,
      color: "bg-red-600",
      link: "/product-out",
    },
    {
      title: "Reports",
      description: "View reports, analytics and stock health",
      icon: <FileBarChart2 size={35} />,
      color: "bg-purple-600",
      link: "/reports",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ================= NAVBAR ================= */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">

          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Inventory Dashboard
            </h1>

            <p className="text-gray-500 text-sm mt-1">
              Manage products, stock and reports
            </p>
          </div>

          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 transition-all text-white px-4 py-2 rounded-xl flex items-center gap-2"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* ================= HERO SECTION ================= */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">

        <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-3xl p-8 md:p-10 text-white shadow-lg">
          <div className="flex flex-col lg:flex-row justify-between gap-6 items-center">

            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                Welcome Back 👋
              </h2>

              <p className="text-green-100 max-w-2xl">
                Monitor your inventory, track sales, manage stock
                movement and generate professional reports easily.
              </p>
            </div>

            <div className="hidden md:flex bg-white/20 p-6 rounded-2xl">
              <Boxes size={70} />
            </div>
          </div>
        </div>

        {/* ================= QUICK STATS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">

          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <div className="flex justify-between items-center">

              <div>
                <p className="text-gray-500 text-sm">
                  Inventory System
                </p>

                <h2 className="text-2xl font-bold mt-2">
                  Active
                </h2>
              </div>

              <div className="bg-blue-100 p-3 rounded-xl">
                <Boxes className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <div className="flex justify-between items-center">

              <div>
                <p className="text-gray-500 text-sm">
                  Sales Tracking
                </p>

                <h2 className="text-2xl font-bold mt-2">
                  Running
                </h2>
              </div>

              <div className="bg-green-100 p-3 rounded-xl">
                <TrendingUp className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <div className="flex justify-between items-center">

              <div>
                <p className="text-gray-500 text-sm">
                  Transactions
                </p>

                <h2 className="text-2xl font-bold mt-2">
                  Available
                </h2>
              </div>

              <div className="bg-red-100 p-3 rounded-xl">
                <ShoppingCart className="text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* ================= MAIN CARDS ================= */}
        <div className="mt-10">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Dashboard Menu
            </h2>

            <p className="text-gray-500 mt-1">
              Select a section to continue
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

            {cards.map((card, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-6 shadow-sm border hover:shadow-xl transition-all duration-300 group"
              >

                <div
                  className={`${card.color} w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-5 group-hover:scale-110 transition`}
                >
                  {card.icon}
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {card.title}
                </h2>

                <p className="text-gray-500 text-sm mb-6">
                  {card.description}
                </p>

                <Link
                  to={card.link}
                  className={`${card.color} text-white px-5 py-3 rounded-xl inline-block hover:opacity-90 transition`}
                >
                  Open
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* ================= FOOTER ACTIONS ================= */}
        <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4 pb-10">

          <Link
            to="/home"
            className="bg-gray-800 hover:bg-gray-900 transition text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2"
          >
            <Home size={18} />
            Back Home
          </Link>

          <Link
            to="/reports"
            className="bg-purple-600 hover:bg-purple-700 transition text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2"
          >
            <FileBarChart2 size={18} />
            View Reports
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;