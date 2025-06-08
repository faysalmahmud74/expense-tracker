import { useState, useEffect } from "react";
import { useLanguage } from "../LanguageProvider";
import Layout from "../components/Layout";
import React from "react";
import { BiSolidEdit } from "react-icons/bi";

const TRANSACTIONS_KEY = "transactions";

const getTransactions = () => {
  const data = localStorage.getItem(TRANSACTIONS_KEY);
  return data ? JSON.parse(data) : [];
};

const translations = {
  en: {
    reports: "Reports",
    filterByDate: "Filter by Date:",
    filterByType: "Filter by Type:",
    clear: "Clear",
    type: "Type",
    description: "Description",
    amount: "Amount",
    date: "Date",
    noEntries: "No entries found for the selected filter.",
    credit: "Income",
    debit: "Expense",
    clearAll: "Delete All",
    default: "Default",
    filterByTag: "Filter by Tag:",
    currency: "$",
    delete: "Delete",
    editTransaction: "Edit Transaction",
    options: {
      today: "Today",
      thismonth: "This Month",
      last7: "Last 7 Days",
      last15: "Last 15 Days",
      lastMonth: "Last Month",
      specific: "Specific Date",
      daterange: "Date Range", // <-- add translation for date range
      from: "From",
      to: "To",
    },
  },
  bn: {
    reports: "রিপোর্ট",
    filterByDate: "তারিখ অনুযায়ী ফিল্টার:",
    filterByType: "ধরন অনুযায়ী ফিল্টার:",
    clear: "মুছুন",
    type: "ধরন",
    description: "বিবরণ",
    amount: "পরিমাণ",
    date: "তারিখ",
    noEntries: "নির্বাচিত ফিল্টারের জন্য কোনো এন্ট্রি পাওয়া যায়নি",
    credit: "আয়",
    debit: "ব্যয়",
    clearAll: "সব মুছুন",
    default: "ডিফল্ট",
    filterByTag: "ট্যাগ অনুযায়ী ফিল্টার:",
    currency: "৳",
    delete: "মুছুন",
    editTransaction: "এডিট ট্রানজেকশন",
    options: {
      today: "আজ",
      thismonth: "এই মাস",
      last7: "গত ৭ দিন",
      last15: "গত ১৫ দিন",
      lastMonth: "গত মাস",
      specific: "নির্দিষ্ট তারিখ",
      daterange: "তারিখ পরিসর", // <-- add translation for date range
      from: "হতে",
      to: "থেকে",
    },
  },
};

const Reports = () => {
  const [entries, setEntries] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [filterDateRange, setFilterDateRange] = useState("");
  const [filterFromDate, setFilterFromDate] = useState(""); // for range
  const [filterToDate, setFilterToDate] = useState("");     // for range
  const [filterType, setFilterType] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [editData, setEditData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    setEntries(getTransactions());
  }, []);

  const handleClearTransactions = () => {
    if (confirm("Are you sure you want to delete all transactions?")) {
      localStorage.removeItem(TRANSACTIONS_KEY);
      setEntries([]);
    }
  };

  const allCategories = Array.from(new Set(entries.map(e => e.category))).filter(Boolean);

  // Helper to get date N days ago
  const getPastDate = (days) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  // Helper to get today's date (start of day)
  const getToday = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  };

  // Helper to get first day of last month
  const getLastMonthRange = () => {
    const now = new Date();
    const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    firstDayLastMonth.setHours(0, 0, 0, 0);
    lastDayLastMonth.setHours(23, 59, 59, 999);
    return [firstDayLastMonth, lastDayLastMonth];
  };

  // Helper to get first and last day of this month
  const getThisMonthRange = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    firstDay.setHours(0, 0, 0, 0);
    lastDay.setHours(23, 59, 59, 999);
    return [firstDay, lastDay];
  };

  // Date filter logic
  const filteredEntries = entries
    .filter((e) => {
      if (filterDateRange === "today") {
        const today = getToday();
        const entryDate = new Date(e.date);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === today.getTime();
      }
      if (filterDateRange === "thismonth") {
        const [start, end] = getThisMonthRange();
        const d = new Date(e.date);
        return d >= start && d <= end;
      }
      if (filterDateRange === "7") {
        const past = getPastDate(7);
        return new Date(e.date) >= past;
      }
      if (filterDateRange === "15") {
        const past = getPastDate(15);
        return new Date(e.date) >= past;
      }
      if (filterDateRange === "month") {
        const [start, end] = getLastMonthRange();
        const d = new Date(e.date);
        return d >= start && d <= end;
      }
      if (filterDateRange === "date" && filterDate) {
        return e.date === filterDate;
      }
      if (filterDateRange === "daterange" && filterFromDate && filterToDate) {
        const entryDate = new Date(e.date);
        const from = new Date(filterFromDate);
        const to = new Date(filterToDate);
        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);
        return entryDate >= from && entryDate <= to;
      }
      if (!filterDateRange && filterDate) {
        return e.date === filterDate;
      }
      return !filterDateRange || filterDateRange === "";
    })
    .filter((e) => (filterType ? e.type === filterType : true))
    .filter((e) => (filterCategory ? e.category === filterCategory : true));

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setEditData({ ...item });
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedItem(null);
    setEditData(null);
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      const updated = entries.filter(e => e.id !== selectedItem.id);
      localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(updated));
      setEntries(updated);
      handleModalClose();
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSave = () => {
    const updated = entries.map(e =>
      e.id === selectedItem.id ? { ...e, ...editData, amount: parseFloat(editData.amount) } : e
    );
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(updated));
    setEntries(updated);
    handleModalClose();
  };

  return (
    <Layout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold text-gray-800">{t.reports}</h1>
          <button
            onClick={handleClearTransactions}
            className="px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition"
          >
            {t.clearAll}
          </button>
        </div>


        <div className="flex sm:flex-row sm:items-end gap-4">
          {/* Filter by Date */}
          <div className="w-full sm:w-auto flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="text-sm font-medium text-gray-700">
              {t.filterByDate}
            </label>
            <div className="flex gap-2 items-center">
              <select
                value={filterDateRange}
                onChange={(e) => {
                  setFilterDateRange(e.target.value);
                  setFilterDate("");
                  setFilterFromDate("");
                  setFilterToDate("");
                }}
                className="px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{t.default}</option>
                <option value="today">{t.options.today}</option>
                <option value="thismonth">{t.options.thismonth}</option>
                <option value="7">{t.options.last7}</option>
                <option value="15">{t.options.last15}</option>
                <option value="month">{t.options.lastMonth}</option>
                <option value="date">{t.options.specific}</option>
                <option value="daterange">{t.options.daterange}</option>
              </select>

              <button
                onClick={() => {
                  setFilterDate("");
                  setFilterDateRange("");
                  setFilterFromDate("");
                  setFilterToDate("");
                }}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm hover:bg-gray-200 transition"
              >
                {t.clear}
              </button>
            </div>
          </div>

          {/* Filter by Type */}
          <div className="w-full sm:w-auto flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="text-sm font-medium text-gray-700">
              {t.filterByType}
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{t.default}</option>
              <option value="Expense">{t.debit}</option>
              <option value="Income">{t.credit}</option>
            </select>
          </div>
        </div>
        {filterDateRange === "date" && (
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-0.5 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}
        {filterDateRange === "daterange" && (
          <div className="flex gap-2 items-center">
            <input
              type="date"
              value={filterFromDate}
              onChange={(e) => setFilterFromDate(e.target.value)}
              className="px-0.5 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="From"
            />
            <span className="text-gray-500">{t.options.to}</span>
            <input
              type="date"
              value={filterToDate}
              onChange={(e) => setFilterToDate(e.target.value)}
              className="px-0.5 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="To"
            />
          </div>
        )}


        {/* Filter by Category */}
        <div className="w-full flex flex-col sm:flex-row sm:items-center sm:gap-4">
          <label className="text-sm font-medium mb-1">{t.filterByTag}</label>
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              className={`px-3 py-1 rounded-full border text-sm whitespace-nowrap ${filterCategory === "" ? "bg-green-600 text-white" : "bg-gray-100"}`}
              onClick={() => setFilterCategory("")}
              type="button"
            >
              All
            </button>
            {allCategories.map((cat) => (
              <button
                key={cat}
                className={`px-3 py-1 rounded-full border text-sm whitespace-nowrap ${filterCategory === cat ? "bg-green-600 text-white" : "bg-gray-100"}`}
                onClick={() => setFilterCategory(cat)}
                type="button"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Transaction List */}
        <div className="space-y-3">
          {filteredEntries.length ? (
            [...filteredEntries].reverse().map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center bg-white rounded-xl p-4 shadow border cursor-pointer"
                onClick={() => handleItemClick(item)}
              >
                <div className="space-y-2">
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    📅 {new Date(item.date).toLocaleDateString("en-GB")}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded ${item.type === "Income"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                        }`}
                    >
                      {item.type === "Income" ? t.credit : t.debit}
                    </span>
                    <span className="text-sm font-medium">{item.category}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`text-sm font-bold px-3 py-1 rounded ${item.type === "Income"
                      ? "text-green-600"
                      : "text-red-600"
                      }`}
                  >
                    {item.type === "Income" ? "+" : "-"}{t.currency}{item.amount}
                  </div>
                  {/* Edit icon */}
                  <button
                    type="button"
                    className="ml-2 p-1 rounded hover:bg-gray-100"
                    onClick={e => {
                      e.stopPropagation();
                      handleItemClick(item);
                    }}
                    title={t.editTransaction}
                  >
                    <BiSolidEdit size={20} className="text-gray-300" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-sm text-gray-500 mt-4">
              {t.noEntries}
            </div>
          )}
        </div>
        {/* Modal for Edit/Delete */}
        {showModal && selectedItem && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
              <h3 className="text-md font-semibold text-gray-800 mb-4 text-center">{t.editTransaction || "Edit Transaction"}</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    {t.type}
                  </label>
                  <select
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    name="type"
                    value={editData.type}
                    onChange={handleEditChange}
                  >
                    <option value="Income">{t.credit}</option>
                    <option value="Expense">{t.debit}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    {t.description}
                  </label>
                  <input
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    name="category"
                    value={editData.category}
                    onChange={handleEditChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    {t.amount}
                  </label>
                  <input
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    name="amount"
                    type="number"
                    value={editData.amount}
                    onChange={handleEditChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    {t.date}
                  </label>
                  <input
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    name="date"
                    type="date"
                    value={editData.date}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="flex flex-wrap justify-end gap-2 pt-4">
                  <button
                    type="button"
                    className="px-4 py-2 rounded-xl border border-gray-400 text-gray-700 hover:bg-gray-100 transition"
                    onClick={handleModalClose}
                  >
                    {t.cancel || "Cancel"}
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
                    onClick={handleEditSave}
                  >
                    {t.save || "Save"}
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition"
                    onClick={handleDelete}
                  >
                    {t.delete || "Delete"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Reports;
