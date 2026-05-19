import React, { useEffect, useState } from "react";
import axios from "axios";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [productName, setProductName] = useState("");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const token = localStorage.getItem("token");

  // ================= GET ALL PRODUCTS WITH CURRENT STOCK =================
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/product", {
        headers: { authorization: token },
      });
      setProducts(res.data);
    } catch (error) {
      console.error("Error pulling product inventories:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ================= ADD PRODUCT =================
  const addProduct = async (e) => {
    e.preventDefault();
    if (!productName.trim()) return;

    try {
      await axios.post(
        "http://localhost:5000/api/product/add",
        { ProductName: productName },
        { headers: { authorization: token } }
      );
      setProductName("");
      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  // ================= DELETE PRODUCT =================
  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure? Deleting this product removes all stock logs completely.")) return;

    try {
      await axios.delete(`http://localhost:5000/api/product/${id}`, {
        headers: { authorization: token },
      });
      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  // ================= EDIT PRODUCT =================
  const startEdit = (product) => {
    setEditId(product.ProductCode);
    setProductName(product.ProductName);
  };

  // ================= UPDATE PRODUCT =================
  const updateProduct = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/product/${editId}`,
        { ProductName: productName },
        { headers: { authorization: token } }
      );
      setEditId(null);
      setProductName("");
      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  // ================= CALC SUMMARY METRICS =================
  const totalUniqueProducts = products.length;
  const outOfStockItems = products.filter((p) => p.CurrentStock <= 0).length;
  const totalStockVolume = products.reduce((acc, p) => acc + (Number(p.CurrentStock) || 0), 0);

  // ================= PAGINATION LOGIC =================
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 text-slate-800">
      <div className="max-w-5xl mx-auto">
        
        <h1 className="text-2xl md:text-3xl font-bold mb-8 text-slate-900 border-b pb-4">
          Product Catalog & Stock Management
        </h1>

        {/* ================= METRIC CARDS OVERVIEW ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Catalog Items</span>
            <span className="text-3xl font-bold text-slate-800 mt-2">{totalUniqueProducts}</span>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Stock Volume</span>
            <span className="text-3xl font-bold text-indigo-600 mt-2">{totalStockVolume} Units</span>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Out of Stock Alerts</span>
            <span className={`text-3xl font-bold mt-2 ${outOfStockItems > 0 ? "text-amber-600" : "text-emerald-600"}`}>
              {outOfStockItems}
            </span>
          </div>
        </div>

        {/* ================= FORMS (ADD & EDIT) ================= */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 mb-8">
          {!editId ? (
            <form onSubmit={addProduct} className="flex flex-col sm:flex-row gap-3 items-center">
              <div className="w-full flex-1">
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Create New Product</label>
                <input
                  type="text"
                  placeholder="e.g. Premium Engine Oil 10W-40"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                  required
                />
              </div>
              <button type="submit" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors shadow-sm self-end">
                Register Product
              </button>
            </form>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <div className="w-full flex-1">
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Modify Product Profile</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                  required
                />
              </div>
              <div className="w-full sm:w-auto flex gap-2 self-end">
                <button onClick={updateProduct} className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors">
                  Update
                </button>
                <button onClick={() => { setEditId(null); setProductName(""); }} className="flex-1 sm:flex-none bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2.5 rounded-lg text-sm transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ================= PRODUCT DATA LAYOUT ================= */}
        <div className="bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden">
          
          {/* Desktop Table view (Hidden on small screens) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800 text-slate-200 text-xs font-semibold uppercase tracking-wider">
                  <th className="p-4 text-center w-24">Code ID</th>
                  <th className="p-4">Product Name</th>
                  <th className="p-4 text-center w-48">Current Balance Status</th>
                  <th className="p-4 text-center w-40">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {currentProducts.map((p) => (
                  <tr key={p.ProductCode} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4 font-mono text-center text-slate-500 font-semibold">{p.ProductCode}</td>
                    <td className="p-4 font-medium text-slate-900">{p.ProductName}</td>
                    <td className="p-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wide ${p.CurrentStock <= 0 ? "bg-rose-50 text-rose-700 border border-rose-100" : "bg-emerald-50 text-emerald-700 border border-emerald-100"}`}>
                        {p.CurrentStock <= 0 ? "Out of Stock" : `${p.CurrentStock} units`}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => startEdit(p)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors">
                          Edit
                        </button>
                        <button onClick={() => deleteProduct(p.ProductCode)} className="bg-rose-50 hover:bg-rose-100 text-rose-600 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked Responsive Cards (Hidden on Medium+ viewports) */}
          <div className="block md:hidden divide-y divide-slate-100">
            {currentProducts.map((p) => (
              <div key={p.ProductCode} className="p-4 hover:bg-slate-50/50 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-mono text-slate-400 font-bold block mb-0.5">#{p.ProductCode}</span>
                    <h3 className="text-sm font-semibold text-slate-900">{p.ProductName}</h3>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${p.CurrentStock <= 0 ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}>
                    {p.CurrentStock} pcs
                  </span>
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-dashed border-slate-100">
                  <button onClick={() => startEdit(p)} className="bg-slate-100 text-slate-700 px-3 py-1 rounded text-xs font-medium">
                    Edit
                  </button>
                  <button onClick={() => deleteProduct(p.ProductCode)} className="bg-rose-50 text-rose-600 px-3 py-1 rounded text-xs font-medium">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty Table Placeholder */}
          {products.length === 0 && (
            <div className="p-12 text-center text-slate-400 text-sm">
              No products found in the database directory.
            </div>
          )}

          {/* ================= PAGINATION FOOTER CONTROL ================= */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs font-medium text-slate-600">
              <div>
                Showing <span className="font-bold">{indexOfFirstItem + 1}</span> to{" "}
                <span className="font-bold">{Math.min(indexOfLastItem, products.length)}</span> of{" "}
                <span className="font-bold">{products.length}</span> items
              </div>
              <div className="flex gap-1">
                <button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="px-2.5 py-1.5 rounded border bg-white shadow-sm hover:bg-slate-100 disabled:opacity-50 disabled:hover:bg-white transition-colors"
                >
                  Prev
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-3 py-1.5 rounded border shadow-sm transition-colors ${currentPage === index + 1 ? "bg-indigo-600 border-indigo-600 text-white font-bold" : "bg-white hover:bg-slate-100"}`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
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

export default Product;