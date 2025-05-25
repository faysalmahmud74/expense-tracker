import {
  FaMoneyBillWave,
  FaWallet,
  FaArrowUp,
  FaArrowDown,
  FaEdit,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { useLanguage } from "./LanguageProvider";
import InitLoader from "./components/initLoader";
import { Bar, Pie, Line } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement, PointElement, LineElement } from "chart.js";
import { useNavigate, useLocation } from "react-router-dom";
import { MdAccountBalance, MdDelete, MdKeyboardArrowRight, MdOutlineAccountBalance } from "react-icons/md";
import Layout from "./components/Layout";
import { IoIosArrowDropright } from "react-icons/io";

// Register chart components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement, PointElement, LineElement);

const TRANSACTIONS_KEY = "transactions";

const getTransactions = () => {
  const data = localStorage.getItem(TRANSACTIONS_KEY);
  return data ? JSON.parse(data) : [];
};

const getDailyDataForCurrentMonth = (transactions) => {
  const currentMonth = new Date().getMonth();
  const daysInMonth = new Date(new Date().getFullYear(), currentMonth + 1, 0).getDate();
  const dailyData = Array(daysInMonth).fill({ credit: 0, debit: 0 });

  transactions.forEach((tx) => {
    const date = new Date(tx.date);
    if (date.getMonth() === currentMonth) {
      const day = date.getDate() - 1; // Convert to zero-based index
      if (tx.type === "Income") {
        dailyData[day] = {
          ...dailyData[day],
          credit: dailyData[day].credit + tx.amount,
        };
      } else if (tx.type === "Expense") {
        dailyData[day] = {
          ...dailyData[day],
          debit: dailyData[day].debit + tx.amount,
        };
      }
    }
  });

  return dailyData;
};

const getCumulativeBalanceData = (transactions) => {
  const currentMonth = new Date().getMonth();
  const daysInMonth = new Date(new Date().getFullYear(), currentMonth + 1, 0).getDate();
  const cumulativeData = Array(daysInMonth).fill(0);

  transactions.forEach((tx) => {
    const date = new Date(tx.date);
    if (date.getMonth() === currentMonth) {
      const day = date.getDate() - 1; // Convert to zero-based index
      const amount = tx.type === "Income" ? tx.amount : -tx.amount;
      for (let i = day; i < daysInMonth; i++) {
        cumulativeData[i] += amount;
      }
    }
  });

  return cumulativeData;
};

const translations = {
  en: {
    totalCredit: "Total Income",
    totalDebit: "Total Expense",
    balance: "Balance",
    monthlyActivity: "Monthly Activity",
    chartPlaceholder: "Chart will be displayed here",
    recentTransactions: "Recent Transactions",
    credit: "Income",
    debit: "Expense",
    clearAll: "Delete All",
    noTransaction: "No transactions available.",
    type: "Type",
    amount: "Amount",
    date: "Date",
    save: "Save",
    cancel: "Cancel",
    currency: "$",
    description: "Description",
    editTransaction: "Edit Transaction",
    showAll: "Show All",
  },
  bn: {
    totalCredit: "মোট আয়",
    totalDebit: "মোট ব্যয়",
    balance: "ব্যালেন্স",
    monthlyActivity: "মাসিক কার্যক্রম",
    chartPlaceholder: "এখানে চার্ট দেখানো হবে",
    recentTransactions: "সাম্প্রতিক লেনদেন",
    credit: "আয়",
    debit: "ব্যয়",
    clearAll: "সব মুছুন",
    noTransaction: "কোনো লেনদেন নেই",
    type: "ধরন",
    amount: "পরিমাণ",
    date: "তারিখ",
    save: "সংরক্ষণ করুন",
    cancel: "বাতিল করুন",
    currency: "৳",
    description: "বিবরণ",
    editTransaction: "এডিট ট্রানজেকশন",
    showAll: "সব দেখুন",
  },
};

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [credit, setCredit] = useState(0);
  const [debit, setDebit] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const { language, setLanguage } = useLanguage();
  const t = translations[language];
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [editForm, setEditForm] = useState({ type: "", category: "", amount: 0, date: "" });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited");

    if (!hasVisited) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
        localStorage.setItem("hasVisited", "true");
      }, 4000); // Show loader for 4 seconds

      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const transactions = getTransactions();
    let totalCredit = 0;
    let totalDebit = 0;

    transactions.forEach((tx) => {
      if (tx.type === "Income") {
        totalCredit += tx.amount;
      } else if (tx.type === "Expense") {
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
      tx.id === editingTransaction.id
        ? { ...tx, ...editForm, amount: parseFloat(editForm.amount) }
        : tx
    );
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(updatedTransactions));
    // Refetch transactions from localStorage to ensure latest data
    const refreshedTransactions = getTransactions();
    setRecentTransactions(refreshedTransactions);

    // Recalculate credit and debit
    let totalCredit = 0;
    let totalDebit = 0;
    refreshedTransactions.forEach((tx) => {
      if (tx.type === "Income") {
        totalCredit += tx.amount;
      } else if (tx.type === "Expense") {
        totalDebit += tx.amount;
      }
    });
    setCredit(totalCredit);
    setDebit(totalDebit);

    setEditingTransaction(null);
  };

  const handleEditCancel = () => {
    setEditingTransaction(null);
  };

  const deleteTransaction = (id) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      const updatedTransactions = recentTransactions.filter((tx) => tx.id !== id);
      setRecentTransactions(updatedTransactions);
      localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(updatedTransactions));
    }
  }

  const balance = credit - debit;

  const dailyData = getDailyDataForCurrentMonth(recentTransactions);

  const chartData = {
    labels: dailyData.map((_, index) => index + 1), // Days of the month
    datasets: [
      {
        label: t.credit,
        data: dailyData.map((data) => data.credit),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: t.debit,
        data: dailyData.map((data) => data.debit),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  const chartOptions = {
    // responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Day of the Month",
        },
      },
      y: {
        title: {
          display: true,
          text: "Amount",
        },
      },
    },
  };

  const totalCredit = dailyData.reduce((sum, day) => sum + day.credit, 0);
  const totalDebit = dailyData.reduce((sum, day) => sum + day.debit, 0);

  const pieChartData = {
    labels: [t.credit, t.debit],
    datasets: [
      {
        data: [totalCredit, totalDebit],
        backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)"],
      },
    ],
  };

  const cumulativeBalanceData = getCumulativeBalanceData(recentTransactions);

  const lineChartData = {
    labels: dailyData.map((_, index) => index + 1), // Days of the month
    datasets: [
      {
        label: t.balance,
        data: cumulativeBalanceData,
        borderColor: "rgba(54, 162, 235, 0.8)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: true,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Day of the Month",
        },
      },
      y: {
        title: {
          display: true,
          text: "Cumulative Balance",
        },
      },
    },
  };

  if (isLoading) {
    return <InitLoader />;
  }

  return (
    <Layout>
      <div className="p-6 bg-gray-100 min-h-screen">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div
            className="flex justify-between items-center bg-white rounded-2xl p-5 shadow hover:shadow-lg transition cursor-pointer"
            onClick={() => navigate("/credit")}
          >
            <div className="w-full">
              <div className="flex items-center text-green-600 mb-3">
                <FaMoneyBillWave className="text-2xl mr-2" />
                <h2 className="text-xl font-medium">{t.totalCredit}</h2>
              </div>
              <p className="text-2xl font-bold text-gray-800">{t.currency}{credit}</p>
            </div>
            <MdKeyboardArrowRight size={30} className="text-gray-300" />
          </div>

          <div
            className="flex justify-between items-center bg-white rounded-2xl p-5 shadow hover:shadow-lg transition cursor-pointer"
            onClick={() => navigate("/debit")}
          >
            <div className="w-full">
              <div className="flex items-center text-red-600 mb-3">
                <FaWallet className="text-2xl mr-2" />
                <h2 className="text-xl font-medium">{t.totalDebit}</h2>
              </div>
              <p className="text-2xl font-bold text-gray-800">{t.currency}{debit}</p>
            </div>

            <MdKeyboardArrowRight size={30} className="text-gray-300" />
          </div>

          <div
            className="flex justify-between items-center bg-white rounded-2xl p-5 shadow hover:shadow-lg transition cursor-pointer"
            onClick={() => navigate("/reports")}
          >
            <div className="w-full">
              <div className="flex items-center text-blue-600 mb-3">
                <MdAccountBalance className="text-2xl mr-2" />
                <h2 className="text-xl font-medium">{t.balance}</h2>
              </div>
              <p className="text-2xl font-bold text-gray-800">{t.currency}{balance}</p>
            </div>
            <MdKeyboardArrowRight size={30} className="text-gray-300" />
          </div>
        </div>

        {/* Placeholder for Chart */}
        <div className="bg-white rounded-2xl p-6 shadow mb-4">
          <h2 className="text-lg font-semibold mb-4">{t.monthlyActivity}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="w-full col-span-1">
              <Bar data={chartData} options={chartOptions} />
            </div>
            <div className="w-full col-span-1">
              <Line data={lineChartData} options={lineChartOptions} />
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl p-6 shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">{t.recentTransactions}</h2>
            <button
              className="px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition"
              onClick={handleClearTransactions}
            >
              {t.clearAll}
            </button>
          </div>
          {recentTransactions.length === 0 ? (
            <p className="text-gray-500">{t.noTransaction}</p>
          ) : (
            <>
              <ul className="divide-y divide-gray-200">
                {recentTransactions
                  .slice()
                  .sort((a, b) => b.id - a.id)
                  .slice(0, 5)
                  .map((tx) => (
                    <li
                      key={tx.id}
                      className="py-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        {tx.type === "Income" ? (
                          <FaArrowUp className="text-green-500" />
                        ) : (
                          <FaArrowDown className="text-red-500" />
                        )}
                        {/* <span className="font-medium">
                          {tx.type === "Income" ? t.credit : t.debit}
                        </span> */}
                      </div>
                      <div className="w-2/6 text-gray-700 text-start">{tx.category}</div>
                      <div className="w-2/6 text-gray-700">{t.currency}{tx.amount}</div>
                      <div className="flex gap-4">
                        <button
                          className="text-blue-500 hover:underline"
                          onClick={() => handleEditClick(tx)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="text-red-500 hover:underline"
                          onClick={() => { deleteTransaction(tx.id) }}
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </li>
                  ))}
              </ul>
              <div className="flex justify-center mt-4">
                <button
                  className="text-blue-600 font-medium"
                  onClick={() => navigate("/reports")}
                >
                  {t.showAll}
                </button>
              </div>
            </>
          )}

          {editingTransaction && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-center justify-center px-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                  {t.editTransaction}
                </h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      {t.type}
                    </label>
                    <select
                      name="type"
                      value={editForm.type}
                      onChange={handleEditChange}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      type="text"
                      name="category"
                      value={editForm.category}
                      onChange={handleEditChange}
                      placeholder="e.g., Salary, Grocery"
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      {t.amount}
                    </label>
                    <input
                      type="number"
                      name="amount"
                      value={editForm.amount}
                      onChange={handleEditChange}
                      placeholder="৳0.00"
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      {t.date}
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={editForm.date}
                      onChange={handleEditChange}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      className="px-4 py-2 rounded-xl border border-gray-400 text-gray-700 hover:bg-gray-100 transition"
                      onClick={handleEditCancel}
                    >
                      {t.cancel}
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
                      onClick={handleEditSave}
                    >
                      {t.save}
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