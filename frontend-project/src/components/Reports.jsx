import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";

import {
  Search,
  Printer,
  Download,
  Calendar,
  Package,
  AlertTriangle,
  TrendingUp,
  Boxes,
  RefreshCw,
  FileText,
} from "lucide-react";

const Reports = () => {
  const token = localStorage.getItem("token");

  const apiBase = "http://localhost:5000/api/report";

  // ================= STATES =================
  const [stockStatus, setStockStatus] = useState([]);
  const [daily, setDaily] = useState([]);
  const [weekly, setWeekly] = useState([]);
  const [monthly, setMonthly] = useState([]);

  const [loading, setLoading] = useState(true);

  const [reportType, setReportType] = useState("stock");

  const [search, setSearch] = useState("");

  const [selectedDate, setSelectedDate] = useState("");

  // ================= FETCH REPORTS =================
  const fetchReportsData = async () => {
    try {
      setLoading(true);

      const headers = {
        headers: {
          authorization: token,
        },
      };

      const [
        resStock,
        resDaily,
        resWeekly,
        resMonthly,
      ] = await Promise.all([
        axios.get(`${apiBase}/stock-status`, headers),
        axios.get(`${apiBase}/daily`, headers),
        axios.get(`${apiBase}/weekly`, headers),
        axios.get(`${apiBase}/monthly`, headers),
      ]);

      setStockStatus(
        Array.isArray(resStock.data)
          ? resStock.data
          : []
      );

      setDaily(
        Array.isArray(resDaily.data)
          ? resDaily.data
          : []
      );

      setWeekly(
        Array.isArray(resWeekly.data)
          ? resWeekly.data
          : []
      );

      setMonthly(
        Array.isArray(resMonthly.data)
          ? resMonthly.data
          : []
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportsData();
  }, []);

  // ================= CURRENT REPORT =================
  const currentData = useMemo(() => {
    switch (reportType) {
      case "daily":
        return daily;

      case "weekly":
        return weekly;

      case "monthly":
        return monthly;

      default:
        return stockStatus;
    }
  }, [
    reportType,
    stockStatus,
    daily,
    weekly,
    monthly,
  ]);

  // ================= FILTER =================
  const filteredData = useMemo(() => {
    return currentData.filter((item) => {
      const values = Object.values(item)
        .join(" ")
        .toLowerCase();

      const matchesSearch = values.includes(
        search.toLowerCase()
      );

      const itemDate = new Date(
        item.Date ||
          item.ReportDate ||
          item.WeekStartDate ||
          new Date()
      )
        .toISOString()
        .split("T")[0];

      const matchesDate = selectedDate
        ? itemDate === selectedDate
        : true;

      return matchesSearch && matchesDate;
    });
  }, [currentData, search, selectedDate]);

  // ================= SUMMARY =================
  const lowStock = stockStatus.filter(
    (item) => Number(item.CurrentStock) <= 5
  ).length;

  const totalProducts = stockStatus.length;

  const totalStockValue = stockStatus.reduce(
    (sum, item) =>
      sum + Number(item.EstStockValue || 0),
    0
  );

  const totalSales = monthly.reduce(
    (sum, item) =>
      sum + Number(item.TotalSalesOut || 0),
    0
  );

  // ================= CSV =================
  const downloadCSV = () => {
    if (!filteredData.length) {
      alert("No data available");
      return;
    }

    const headers = Object.keys(
      filteredData[0]
    ).join(",");

    const rows = filteredData.map((row) =>
      Object.values(row)
        .map(
          (value) =>
            `"${String(value).replace(/"/g, '""')}"`
        )
        .join(",")
    );

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].join("\n");

    const encodedUri = encodeURI(csvContent);

    const link = document.createElement("a");

    link.setAttribute("href", encodedUri);

    link.setAttribute(
      "download",
      `${reportType}_report.csv`
    );

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  // ================= PDF =================
  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);

    doc.text("Business Report", 14, 18);

    doc.setFontSize(10);

    doc.text(
      `Generated: ${new Date().toLocaleString()}`,
      14,
      26
    );

    if (!filteredData.length) {
      doc.text("No data available", 14, 40);

      doc.save("report.pdf");

      return;
    }

    const columns = Object.keys(filteredData[0]);

    const rows = filteredData.map((item) =>
      Object.values(item)
    );

    doc.autoTable({
      startY: 35,
      head: [columns],
      body: rows,
      styles: {
        fontSize: 8,
      },
      headStyles: {
        fillColor: [30, 41, 59],
      },
    });

    doc.save(`${reportType}_report.pdf`);
  };

  // ================= PRINT =================
  const handlePrint = () => {
    window.print();
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center">

          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>

          <p className="mt-4 text-slate-600 font-medium">
            Loading reports...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">

      <div className="max-w-7xl mx-auto">

        {/* ================= HEADER ================= */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border mb-6">

          <div className="flex flex-col lg:flex-row justify-between gap-5 lg:items-center">

            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                Reports Dashboard
              </h1>

              <p className="text-slate-500 mt-2">
                Monitor stock, transactions and
                business performance
              </p>
            </div>

            <div className="flex flex-wrap gap-3">

              <button
                onClick={fetchReportsData}
                className="bg-slate-700 hover:bg-slate-800 text-white px-4 py-3 rounded-2xl flex items-center gap-2 transition"
              >
                <RefreshCw size={18} />
                Refresh
              </button>

              <button
                onClick={downloadCSV}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-2xl flex items-center gap-2 transition"
              >
                <Download size={18} />
                CSV
              </button>

              <button
                onClick={downloadPDF}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-2xl flex items-center gap-2 transition"
              >
                <FileText size={18} />
                PDF
              </button>

              <button
                onClick={handlePrint}
                className="bg-slate-900 hover:bg-black text-white px-4 py-3 rounded-2xl flex items-center gap-2 transition"
              >
                <Printer size={18} />
                Print
              </button>
            </div>
          </div>
        </div>

        {/* ================= CARDS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">

          {/* CARD */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border">
            <div className="flex justify-between items-center">

              <div>
                <p className="text-slate-500 text-sm">
                  Products
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {totalProducts}
                </h2>
              </div>

              <div className="bg-blue-100 p-4 rounded-2xl">
                <Boxes className="text-blue-600" />
              </div>
            </div>
          </div>

          {/* CARD */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border">
            <div className="flex justify-between items-center">

              <div>
                <p className="text-slate-500 text-sm">
                  Stock Value
                </p>

                <h2 className="text-2xl font-bold mt-2 text-green-600">
                  $
                  {Number(
                    totalStockValue || 0
                  ).toFixed(2)}
                </h2>
              </div>

              <div className="bg-green-100 p-4 rounded-2xl">
                <Package className="text-green-600" />
              </div>
            </div>
          </div>

          {/* CARD */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border">
            <div className="flex justify-between items-center">

              <div>
                <p className="text-slate-500 text-sm">
                  Total Sales
                </p>

                <h2 className="text-2xl font-bold mt-2 text-purple-600">
                  $
                  {Number(totalSales || 0).toFixed(
                    2
                  )}
                </h2>
              </div>

              <div className="bg-purple-100 p-4 rounded-2xl">
                <TrendingUp className="text-purple-600" />
              </div>
            </div>
          </div>

          {/* CARD */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border">
            <div className="flex justify-between items-center">

              <div>
                <p className="text-slate-500 text-sm">
                  Low Stock
                </p>

                <h2 className="text-3xl font-bold mt-2 text-red-600">
                  {lowStock}
                </h2>
              </div>

              <div className="bg-red-100 p-4 rounded-2xl">
                <AlertTriangle className="text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* ================= FILTERS ================= */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border mb-6">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* REPORT TYPE */}
            <div>
              <label className="text-sm font-semibold text-slate-600">
                Report Type
              </label>

              <select
                value={reportType}
                onChange={(e) =>
                  setReportType(e.target.value)
                }
                className="w-full mt-2 border rounded-2xl p-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="stock">
                  Stock Report
                </option>

                <option value="daily">
                  Daily Report
                </option>

                <option value="weekly">
                  Weekly Report
                </option>

                <option value="monthly">
                  Monthly Report
                </option>
              </select>
            </div>

            {/* DATE */}
            <div>
              <label className="text-sm font-semibold text-slate-600">
                Filter By Date
              </label>

              <div className="relative mt-2">

                <Calendar
                  size={18}
                  className="absolute left-3 top-4 text-slate-400"
                />

                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) =>
                    setSelectedDate(
                      e.target.value
                    )
                  }
                  className="w-full border rounded-2xl p-3 pl-10 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* SEARCH */}
            <div>
              <label className="text-sm font-semibold text-slate-600">
                Search
              </label>

              <div className="relative mt-2">

                <Search
                  size={18}
                  className="absolute left-3 top-4 text-slate-400"
                />

                <input
                  type="text"
                  placeholder="Search transaction..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  className="w-full border rounded-2xl p-3 pl-10 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ================= STOCK HEALTH ================= */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border mb-6">

          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-800">
              Stock Health
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Quick overview of inventory status
            </p>
          </div>

          <div className="space-y-3">

            {stockStatus
              .slice(0, 5)
              .map((item, index) => (
                <div
                  key={index}
                  className="border rounded-2xl p-4 flex flex-col sm:flex-row justify-between gap-3 sm:items-center"
                >
                  <div>
                    <h3 className="font-semibold text-slate-700">
                      {item.ProductName}
                    </h3>

                    <p className="text-sm text-slate-500">
                      Product Code:{" "}
                      {item.ProductCode}
                    </p>
                  </div>

                  <div>
                    {Number(
                      item.CurrentStock
                    ) <= 5 ? (
                      <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold">
                        Low Stock
                      </span>
                    ) : (
                      <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                        In Stock
                      </span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* ================= TABLE ================= */}
        <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">

          <div className="p-5 border-b">

            <h2 className="text-2xl font-bold text-slate-800 capitalize">
              {reportType} Report
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              {filteredData.length} records found
            </p>
          </div>

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead className="bg-slate-800 text-white">

                <tr>
                  {filteredData?.length > 0 &&
                    Object.keys(
                      filteredData[0] || {}
                    ).map((key) => (
                      <th
                        key={key}
                        className="p-4 text-left whitespace-nowrap"
                      >
                        {key}
                      </th>
                    ))}
                </tr>
              </thead>

              <tbody>

                {filteredData.length > 0 ? (
                  filteredData.map(
                    (row, index) => (
                      <tr
                        key={index}
                        className="border-b hover:bg-slate-50 transition"
                      >
                        {Object.values(row).map(
                          (value, i) => (
                            <td
                              key={i}
                              className="p-4 whitespace-nowrap"
                            >
                              {value}
                            </td>
                          )
                        )}
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td
                      colSpan="100%"
                      className="text-center p-10 text-slate-500"
                    >
                      No report data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Reports;