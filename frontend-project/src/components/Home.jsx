import React from "react";
import { Link } from "react-router-dom";

function Home() {

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <div className="bg-blue-600 text-white p-4 flex justify-between items-center">

        <h1 className="text-2xl font-bold">
          Shop Management
        </h1>

        <button
          onClick={logout}
          className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center justify-center h-[80vh]">

        <div className="bg-white p-10 rounded-xl shadow-lg text-center w-[400px]">

          <h1 className="text-3xl font-bold mb-4">
            Welcome Home
          </h1>

          <p className="text-gray-600 mb-6">
            Shop Stock Management System
          </p>

          <Link
            to="/dashboard"
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
          >
            Go To Dashboard
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Home;