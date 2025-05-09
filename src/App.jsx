import {
  FaMoneyBillWave,
  FaWallet,
  FaBalanceScale,
  FaArrowUp,
  FaArrowDown,
  FaEdit,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { useLanguage } from "./LanguageProvider";
import Layout from "./components/Layout";

const TRANSACTIONS_KEY = "transactions";

const getTransactions = () => {
  const data = localStorage.getItem(TRANSACTIONS_KEY);
  return data ? JSON.parse(data) : [];
};

const translations = {
  en: {
    totalCredit: "Total Credit",
    totalDebit: "Total Debit",
    balance: "Balance",
    monthlyActivity: "Monthly Activity (Chart Coming Soon)",
    chartPlaceholder: "Chart will be displayed here",
    recentTransactions: "Recent Transactions",
    credit: "Credit",
    debit: "Debit",
    clearAll: "Clear All Transactions",
  },
  bn: {
    totalCredit: "মোট ক্রেডিট",
    totalDebit: "মোট ডেবিট",
    balance: "ব্যালেন্স",
    monthlyActivity: "মাসিক কার্যক্রম (চার্ট শীঘ্রই আসছে)",
    chartPlaceholder: "এখানে চার্ট দেখানো হবে",
    recentTransactions: "সাম্প্রতিক লেনদেন",
    credit: "ক্রেডিট",
    debit: "ডেবিট",
    clearAll: "সমস্ত লেনদেন মুছে ফেলুন",
  },
};

const HomePage = () => {
  const [credit, setCredit] = useState(0);
  const [debit, setDebit] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const { language, setLanguage } = useLanguage();
  const t = translations[language];
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [editForm, setEditForm] = useState({ type: "", amount: 0, date: "" });

  useEffect(() => {
    const transactions = getTransactions();
    let totalCredit = 0;
    let totalDebit = 0;

    transactions.forEach((tx) => {
      if (tx.type === "Credit") {
        totalCredit += tx.amount;
      } else if (tx.type === "Debit") {
        totalDebit += tx.amount;
      }
    });

    setCredit(totalCredit);
    setDebit(totalDebit);
    setRecentTransactions(transactions);
  }, []);

  const handleClearTransactions = () => {
    if (confirm("Are you sure you want to delete all transactions?")) {
      localStorage.removeItem(TRANSACTIONS_KEY);
      setCredit(0);
      setDebit(0);
      setRecentTransactions([]);
    }
  };

  const handleEditClick = (transaction) => {
    setEditingTransaction(transaction);
    setEditForm({ type: transaction.type, category: transaction.category, amount: transaction.amount, date: transaction.date });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = () => {
    const updatedTransactions = recentTransactions.map((tx) =>
      tx.id === editingTransaction.id ? { ...tx, ...editForm } : tx
    );
    setRecentTransactions(updatedTransactions);
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(updatedTransactions));
    setEditingTransaction(null);
  };

  const handleEditCancel = () => {
    setEditingTransaction(null);
  };

  const balance = credit - debit;

  return (
    <Layout>
      <div className="p-6 bg-gray-100 min-h-screen">
        {/* Language Switcher and Clear Button */}
        <div className="mb-4 flex justify-between items-center">
          <div className="flex">
            <button
              className={`px-3 py-1 rounded-l ${language === "en"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
                }`}
              onClick={() => setLanguage("en")}
            >
              English
            </button>
            <button
              className={`px-3 py-1 rounded-r ${language === "bn"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
                }`}
              onClick={() => setLanguage("bn")}
            >
              বাংলা
            </button>
          </div>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={handleClearTransactions}
          >
            {t.clearAll}
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-2xl p-5 shadow hover:shadow-lg transition">
            <div className="flex items-center text-green-600 mb-3">
              <FaMoneyBillWave className="text-2xl mr-2" />
              <h2 className="text-xl font-medium">{t.totalCredit}</h2>
            </div>
            <p className="text-2xl font-bold text-gray-800">${credit}</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow hover:shadow-lg transition">
            <div className="flex items-center text-red-600 mb-3">
              <FaWallet className="text-2xl mr-2" />
              <h2 className="text-xl font-medium">{t.totalDebit}</h2>
            </div>
            <p className="text-2xl font-bold text-gray-800">${debit}</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow hover:shadow-lg transition">
            <div className="flex items-center text-blue-600 mb-3">
              <FaBalanceScale className="text-2xl mr-2" />
              <h2 className="text-xl font-medium">{t.balance}</h2>
            </div>
            <p className="text-2xl font-bold text-gray-800">${balance}</p>
          </div>
        </div>

        {/* Placeholder for Chart */}
        <div className="bg-white rounded-2xl p-6 shadow mb-10">
          <h2 className="text-lg font-semibold mb-4">{t.monthlyActivity}</h2>
          <div className="h-48 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
            {t.chartPlaceholder}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl p-6 shadow">
          <h2 className="text-lg font-semibold mb-4">{t.recentTransactions}</h2>
          {recentTransactions.length === 0 ? (
            <p className="text-gray-500">No transactions available.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {recentTransactions.slice().sort((a, b) => b.id - a.id).map((tx) => (
                <li
                  key={tx.id}
                  className="py-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    {tx.type === "Credit" ? (
                      <FaArrowUp className="text-green-500" />
                    ) : (
                      <FaArrowDown className="text-red-500" />
                    )}
                    <span className="font-medium">
                      {tx.type === "Credit" ? t.credit : t.debit}
                    </span>
                  </div>
                  <div className="text-gray-700">${tx.amount}</div>
                  <div className="text-gray-500 text-sm">{tx.date}</div>
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => handleEditClick(tx)}
                  >
                    <FaEdit />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {editingTransaction && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Edit Transaction</h3>
                <form>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Type</label>
                    <select
                      name="type"
                      value={editForm.type}
                      onChange={handleEditChange}
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="Credit">Credit</option>
                      <option value="Debit">Debit</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Amount</label>
                    <input
                      type="number"
                      name="amount"
                      value={editForm.amount}
                      onChange={handleEditChange}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={editForm.date}
                      onChange={handleEditChange}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                      onClick={handleEditCancel}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      onClick={handleEditSave}
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;