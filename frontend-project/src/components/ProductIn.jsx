import React, { useEffect, useState } from "react";
import axios from "axios";

const ProductIn = () => {
  const [stockInRecords, setStockInRecords] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [form, setForm] = useState({
    ProductCode: "",
    Quantity: "",
    UnitPrice: "",
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const token = localStorage.getItem("token");

  // ================= FETCH ALL DATA =================
  const fetchData = async () => {
    try {
      // 1. Get stock-in batch transaction records
      const inRes = await axios.get("http://localhost:5000/api/productin", {
        headers: { authorization: token },
      });
      setStockInRecords(inRes.data);

      // 2. Get registered products to fill the select menu dropdown option tags
      const prodRes = await axios.get("http://localhost:5000/api/product", {
        headers: { authorization: token },
      });
      setAvailableProducts(prodRes.data);
    } catch (error) {
      console.error("Error retrieving dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= ADD PRODUCT IN =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/productin", form, {
        headers: { authorization: token },
      });

      // Reset state form values
      setForm({
        ProductCode: "",
        Quantity: "",
        UnitPrice: "",
      });

      setCurrentPage(1); // Reset to first page to see the new entry
      fetchData();
    } catch (error) {
      console.error("Error creating stock-in log entry:", error);
    }
  };

  // ================= CALC SUMMARY METRICS =================
  const totalInvoices = stockInRecords.length;
  const totalQuantityIn = stockInRecords.reduce((acc, r) => acc + (Number(r.Quantity) || 0), 0);
  const totalInvestmentValue = stockInRecords.reduce((acc, r) => acc + (Number(r.TotalPrice) || 0), 0);

  // ================= PAGINATION LOGIC =================
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRecords = stockInRecords.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(stockInRecords.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 text-slate-800">
      <div className="max-w-5xl mx-auto">
        
        <h1 className="text-2xl md:text-3xl font-bold mb-8 text-slate-900 border-b pb-4">
          Stock-In Management (Procurement)
        </h1>

        {/* ================= METRIC CARDS OVERVIEW ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Stock-In Batches</span>
            <span className="text-3xl font-bold text-slate-800 mt-2">{totalInvoices} Logs</span>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Items Procured</span>
            <span className="text-3xl font-bold text-emerald-600 mt-2">{totalQuantityIn} Units</span>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Capital Outlay</span>
            <span className="text-3xl font-bold text-slate-900 mt-2">
              ${totalInvestmentValue.toFixed(2)}
            </span>
          </div>
        </div>

        {/* ================= FORM (ADD STOCK WORKFLOW) ================= */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
          <h2 className="text-xs font-bold uppercase text-slate-500 mb-4 tracking-wider">Log Incoming Stock Shipment</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-slate-600 mb-1">Select Product</label>
              <select
                name="ProductCode"
                value={form.ProductCode}
                onChange={handleChange}
                className="border border-slate-300 p-2.5 rounded-lg bg-white text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                required
              >
                <option value="">-- Choose Product --</option>
                {availableProducts.map((p) => (
                  <option key={p.ProductCode} value={p.ProductCode}>
                    {p.ProductName} (Stock: {p.CurrentStock})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-semibold text-slate-600 mb-1">Quantity Received</label>
              <input
                type="number"
                name="Quantity"
                placeholder="0"
                value={form.Quantity}
                onChange={handleChange}
                className="border border-slate-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                min="1"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-semibold text-slate-600 mb-1">Unit Buying Price ($)</label>
              <input
                type="number"
                name="UnitPrice"
                placeholder="0.00"
                value={form.UnitPrice}
                onChange={handleChange}
                className="border border-slate-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                step="0.01"
                min="0"
                required
              />
            </div>

            <button className="bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-lg font-semibold text-sm md:col-span-3 transition-colors shadow-sm mt-2">
              Submit Stock-In Transaction
            </button>
          </form>
        </div>

        {/* ================= HISTORICAL DATA LOGS ================= */}
        <div className="bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden">
          
          {/* Desktop Responsive View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800 text-slate-200 text-xs font-semibold uppercase tracking-wider">
                  <th className="p-4 text-center w-20">Log ID</th>
                  <th className="p-4">Product Name</th>
                  <th className="p-4 text-center w-28">Quantity</th>
                  <th className="p-4 text-right w-36">Unit Price</th>
                  <th className="p-4 text-right w-40">Total Cost Price</th>
                  <th className="p-4 text-center w-36">Date Logged</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {currentRecords.map((p) => (
                  <tr key={p.ProductInId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4 font-mono text-center text-slate-500 font-semibold">{p.ProductInId}</td>
                    <td className="p-4 font-medium text-slate-900">{p.ProductName}</td>
                    <td className="p-4 text-center font-semibold text-slate-700">{p.Quantity}</td>
                    <td className="p-4 text-right text-slate-600">Rwf{Number(p.UnitPrice).toFixed(2)}</td>
                    <td className="p-4 text-right font-bold text-emerald-600">Rwf{Number(p.TotalPrice).toFixed(2)}</td>
                    <td className="p-4 text-center text-slate-500">
                      {new Date(p.Date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Layout Display */}
          <div className="block md:hidden divide-y divide-slate-100">
            {currentRecords.map((p) => (
              <div key={p.ProductInId} className="p-4 hover:bg-slate-50/50 flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-mono text-slate-400 font-bold block">Ref Record: #{p.ProductInId}</span>
                    <h3 className="text-sm font-semibold text-slate-900">{p.ProductName}</h3>
                    <span className="text-xs text-slate-400">{new Date(p.Date).toLocaleDateString()}</span>
                  </div>
                  <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-xs font-bold">
                    +{p.Quantity} units
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-dashed border-slate-100 text-xs">
                  <span className="text-slate-500">Unit Cost: Rwf{Number(p.UnitPrice).toFixed(2)}</span>
                  <span className="font-bold text-emerald-600 text-sm">Batch Cost: ${Number(p.TotalPrice).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State Handler */}
          {stockInRecords.length === 0 && (
            <div className="p-12 text-center text-slate-400 text-sm">
              No product procurement logs exist in history.
            </div>
          )}

          {/* ================= PAGINATION CONTROL CONTROLLER ================= */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs font-medium text-slate-600">
              <div>
                Showing <span className="font-bold">{indexOfFirstItem + 1}</span> to{" "}
                <span className="font-bold">{Math.min(indexOfLastItem, stockInRecords.length)}</span> of{" "}
                <span className="font-bold">{stockInRecords.length}</span> entries
              </div>
              <div className="flex gap-1">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="px-2.5 py-1.5 rounded border bg-white shadow-sm hover:bg-slate-100 disabled:opacity-50 disabled:hover:bg-white transition-colors"
                >
                  Prev
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-3 py-1.5 rounded border shadow-sm transition-colors ${currentPage === index + 1 ? "bg-emerald-600 border-emerald-600 text-white font-bold" : "bg-white hover:bg-slate-100"}`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="px-2.5 py-1.5 rounded border bg-white shadow-sm hover:bg-slate-100 disabled:opacity-50 disabled:hover:bg-white transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProductIn;