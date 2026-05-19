import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from "react-router-dom";

import {
  LayoutDashboard,
  Package,
  ArrowDownCircle,
  ArrowUpCircle,
  FileBarChart2,
  LogOut,
  UserCircle2,
  Menu,
  X,
  Store,
} from "lucide-react";

// COMPONENTS
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Product from "./components/Product";
import ProductIn from "./components/ProductIn";
import ProductOut from "./components/ProductOut";
import Reports from "./components/Reports";

// ================= SIDEBAR =================
const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Products",
      path: "/product",
      icon: Package,
    },
    {
      name: "Product In",
      path: "/product-in",
      icon: ArrowDownCircle,
    },
    {
      name: "Product Out",
      path: "/product-out",
      icon: ArrowUpCircle,
    },
    {
      name: "Reports",
      path: "/reports",
      icon: FileBarChart2,
    },
  ];

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <>
      {/* OVERLAY MOBILE */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
        fixed top-0 left-0 z-40 h-screen w-72 bg-slate-900 text-white shadow-2xl
        transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}
      >
        {/* LOGO */}
        <div className="h-20 border-b border-slate-800 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl">
              <Store size={22} />
            </div>

            <div>
              <h1 className="font-bold text-lg leading-none">
                Berwa Shop
              </h1>

              <p className="text-xs text-slate-400 mt-1">
                Inventory System
              </p>
            </div>
          </div>

          {/* CLOSE BUTTON MOBILE */}
          <button
            className="lg:hidden"
            onClick={() => setIsOpen(false)}
          >
            <X size={22} />
          </button>
        </div>

        {/* MENU */}
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-2xl transition-all
                  ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }
                `}
              >
                <Icon size={20} />

                <span className="font-medium text-sm">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* FOOTER */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-400 hover:bg-red-500/10 transition"
          >
            <LogOut size={20} />

            <span className="font-medium text-sm">
              Logout
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

// ================= HEADER =================
const Header = ({ setIsOpen }) => {
  const username =
    localStorage.getItem("username") || "User";

  return (
    <header className="h-20 bg-white border-b border-slate-200 sticky top-0 z-20 flex items-center justify-between px-4 md:px-8">

      {/* LEFT */}
      <div className="flex items-center gap-4">

        {/* MENU BUTTON MOBILE */}
        <button
          className="lg:hidden bg-slate-100 p-2 rounded-xl"
          onClick={() => setIsOpen(true)}
        >
          <Menu size={22} />
        </button>

        <div>
          <p className="text-xs md:text-sm text-slate-400 font-medium">
            Inventory Management System
          </p>

          <h2 className="text-lg md:text-2xl font-bold text-slate-800">
            Welcome, {username}
          </h2>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">

        <div className="hidden sm:block text-right">
          <p className="text-sm font-semibold text-slate-800">
            {username}
          </p>

          <p className="text-xs text-blue-600">
            Administrator
          </p>
        </div>

        <div className="bg-slate-100 p-2 rounded-full">
          <UserCircle2
            size={30}
            className="text-slate-600"
          />
        </div>
      </div>
    </header>
  );
};

// ================= PROTECTED ROUTE =================
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  const [isOpen, setIsOpen] = useState(false);

  if (!token) return <Navigate to="/" />;

  return (
    <div className="min-h-screen bg-slate-100">

      {/* SIDEBAR */}
      <Sidebar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />

      {/* MAIN CONTENT */}
      <div className="lg:ml-72 flex flex-col min-h-screen">

        {/* HEADER */}
        <Header setIsOpen={setIsOpen} />

        {/* PAGE */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

// ================= APP =================
function App() {
  return (
    <Router>
      <Routes>

        {/* LOGIN */}
        <Route path="/" element={<Login />} />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* PRODUCT */}
        <Route
          path="/product"
          element={
            <ProtectedRoute>
              <Product />
            </ProtectedRoute>
          }
        />

        {/* PRODUCT IN */}
        <Route
          path="/product-in"
          element={
            <ProtectedRoute>
              <ProductIn />
            </ProtectedRoute>
          }
        />

        {/* PRODUCT OUT */}
        <Route
          path="/product-out"
          element={
            <ProtectedRoute>
              <ProductOut />
            </ProtectedRoute>
          }
        />

        {/* REPORTS */}
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />

        {/* DEFAULT */}
        <Route
          path="*"
          element={<Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;