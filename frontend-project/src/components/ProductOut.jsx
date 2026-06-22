import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Package,
  ShoppingCart,
  DollarSign,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";

const ProductOut = () => {
  const [salesRecords, setSalesRecords] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  const [form, setForm] = useState({
    ProductCode: "",
    Quantity: "",
    UnitPrice: "",
  });

  const token = localStorage.getItem("token");

  // ================= FETCH DATA =================
  const fetchData = async () => {
    try {
      setLoading(true);

      const outRes = await axios.get(
        "http://localhost:5000/api/productout",
        {
          headers: { authorization: token },
        }
      );

      const prodRes = await axios.get(
        "http://localhost:5000/api/product",
        {
          headers: { authorization: token },
        }
      );

      setSalesRecords(outRes.data);
      setAvailableProducts(prodRes.data);
    } catch (error) {
      console.error("Error fetching page data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage("");

    try {
      await axios.post(
        "http://localhost:5000/api/productout",
        form,
        {
          headers: { authorization: token },
        }
      );

      setForm({
        ProductCode: "",
        Quantity: "",
        UnitPrice: "",
      });

      fetchData();
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Unexpected server error.");
      }
    }
  };

  // ================= SEARCH =================
  const filteredSales = useMemo(() => {
    return salesRecords.filter((item) =>
      Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [salesRecords, search]);

  // ================= PAGINATION =================
  const totalPages = Math.ceil(
    filteredSales.length / recordsPerPage
  );

  const startIndex = (currentPage - 1) * recordsPerPage;

  const currentRecords = filteredSales.slice(
    startIndex,
    startIndex + recordsPerPage
  );

  // ================= SUMMARY =================
  const totalSales = salesRecords.reduce(
    (sum, item) => sum + Number(item.TotalPrice || 0),
    0
  );

  const totalTransactions = salesRecords.length;

  const totalQuantity = salesRecords.reduce(
    (sum, item) => sum + Number(item.Quantity || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* ================= HEADER ================= */}
        <div className="mb-6 flex flex-col lg:flex-row justify-between gap-4 items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Product Sales
            </h1>

            <p className="text-gray-500 mt-1">
              Manage sold products and sales transactions
            </p>
          </div>
        </div>

        {/* ================= CARDS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

          <div className="bg-white p-5 rounded-2xl shadow-sm border">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">
                  Total Sales
                </p>

                <h2 className="text-3xl font-bold mt-2 text-green-600">
                  ${totalSales.toFixed(2)}
                </h2>
              </div>

              <div className="bg-green-100 p-3 rounded-xl">
                <DollarSign className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">
                  Transactions
                </p>

                <h2 className="text-3xl font-bold mt-2 text-blue-600">
                  {totalTransactions}
                </h2>
              </div>

              <div className="bg-blue-100 p-3 rounded-xl">
                <ShoppingCart className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">
                  Products Sold
                </p>

                <h2 className="text-3xl font-bold mt-2 text-red-600">
                  {totalQuantity}
                </h2>
              </div>

              <div className="bg-red-100 p-3 rounded-xl">
                <Package className="text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* ================= ERROR ================= */}
        {errorMessage && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl mb-6 text-center">
            {errorMessage}
          </div>
        )}

        {/* ================= FORM ================= */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-5">
            Add Product Sale
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
          >

            <select
              name="ProductCode"
              value={form.ProductCode}
              onChange={handleChange}
              className="border rounded-xl p-3 outline-none focus:ring-2 focus:ring-red-500"
              required
            >
              <option value="">Select Product</option>

              {availableProducts.map((p) => (
                <option
                  key={p.ProductCode}
                  value={p.ProductCode}
                >
                  {p.ProductName} (Stock: {p.CurrentStock})
                </option>
              ))}
            </select>

            <input
              type="number"
              name="Quantity"
              placeholder="Quantity"
              value={form.Quantity}
              onChange={handleChange}
              className="border rounded-xl p-3 outline-none focus:ring-2 focus:ring-red-500"
              min="1"
              required
            />

            <input
              type="number"
              name="UnitPrice"
              placeholder="Unit Price"
              value={form.UnitPrice}
              onChange={handleChange}
              className="border rounded-xl p-3 outline-none focus:ring-2 focus:ring-red-500"
              min="0"
              step="0.01"
              required
            />

            <button className="bg-red-600 hover:bg-red-700 transition-all text-white rounded-xl p-3 font-semibold">
              Save Sale
            </button>
          </form>
        </div>

        {/* ================= TABLE SECTION ================= */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

          {/* TOP BAR */}
          <div className="p-5 border-b flex flex-col md:flex-row justify-between gap-4 md:items-center">

            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Sales History
              </h2>

              <p className="text-sm text-gray-500">
                View all product sales records
              </p>
            </div>

            {/* SEARCH */}
            <div className="relative w-full md:w-80">
              <Search
                size={18}
                className="absolute left-3 top-4 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search transaction..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full border rounded-xl p-3 pl-10 outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* ================= LOADING ================= */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2
                size={45}
                className="animate-spin text-red-600"
              />

              <p className="text-gray-500 mt-4">
                Loading sales records...
              </p>
            </div>
          ) : (
            <>
              {/* ================= TABLE ================= */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-red-600 text-white">
                    <tr>
                      <th className="p-4 text-center">ID</th>
                      <th className="p-4 text-left">Product</th>
                      <th className="p-4 text-center">Quantity</th>
                      <th className="p-4 text-right">
                        Unit Price
                      </th>
                      <th className="p-4 text-right">
                        Total
                      </th>
                      <th className="p-4 text-center">Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {currentRecords.length > 0 ? (
                      currentRecords.map((p) => (
                        <tr
                          key={p.ProductOutId}
                          className="border-b hover:bg-gray-50 transition"
                        >
                          <td className="p-4 text-center">
                            {p.ProductOutId}
                          </td>

                          <td className="p-4 font-medium whitespace-nowrap">
                            {p.ProductName}
                          </td>

                          <td className="p-4 text-center">
                            {p.Quantity}
                          </td>

                          <td className="p-4 text-right">
                            Rwf
                            {Number(p.UnitPrice).toFixed(2)}
                          </td>

                          <td className="p-4 text-right font-bold text-green-600">
                            Rwf
                            {Number(p.TotalPrice).toFixed(2)}
                          </td>

                          <td className="p-4 text-center whitespace-nowrap">
                            {new Date(
                              p.Date
                            ).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          className="p-8 text-center text-gray-500"
                        >
                          No sales records found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* ================= PAGINATION ================= */}
              <div className="p-5 flex flex-col md:flex-row justify-between items-center gap-4 border-t">

                <p className="text-sm text-gray-500">
                  Showing{" "}
                  <span className="font-semibold">
                    {currentRecords.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold">
                    {filteredSales.length}
                  </span>{" "}
                  records
                </p>

                <div className="flex items-center gap-2">

                  <button
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.max(prev - 1, 1)
                      )
                    }
                    disabled={currentPage === 1}
                    className="border px-4 py-2 rounded-xl hover:bg-gray-100 disabled:opacity-40"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <div className="px-4 py-2 rounded-xl bg-red-600 text-white font-semibold">
                    {currentPage}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(prev + 1, totalPages)
                      )
                    }
                    disabled={currentPage === totalPages}
                    className="border px-4 py-2 rounded-xl hover:bg-gray-100 disabled:opacity-40"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductOut;