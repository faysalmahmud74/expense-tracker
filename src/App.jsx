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
import Layout from "./components/layout.jsx";
import InitLoader from "./components/initLoader";
import { Bar, Pie, Line } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement, PointElement, LineElement } from "chart.js";

// Register chart components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement, PointElement, LineElement);

const TRANSACTIONS_KEY = "transactions";

const getTransactions = () => {
  const data = localStorage.getItem(TRANSACTIONS_KEY);
  return data ? JSON.parse(data) : [];
};

const getMonthlyData = (transactions) => {
  const monthlyData = Array(12).fill({ credit: 0, debit: 0 });

  transactions.forEach((tx) => {
    const month = new Date(tx.date).getMonth();
    if (tx.type === "Credit") {
      monthlyData[month] = {
        ...monthlyData[month],
        credit: monthlyData[month].credit + tx.amount,
      };
    } else if (tx.type === "Debit") {
      monthlyData[month] = {
        ...monthlyData[month],
        debit: monthlyData[month].debit + tx.amount,
      };
    }
  });

  return monthlyData;
};

const getCurrentMonthData = (transactions) => {
  const currentMonth = new Date().getMonth();
  const currentMonthData = { credit: 0, debit: 0 };

  transactions.forEach((tx) => {
    const month = new Date(tx.date).getMonth();
    if (month === currentMonth) {
      if (tx.type === "Credit") {
        currentMonthData.credit += tx.amount;
      } else if (tx.type === "Debit") {
        currentMonthData.debit += tx.amount;
      }
    }
  });

  return currentMonthData;
};

const getDailyDataForCurrentMonth = (transactions) => {
  const currentMonth = new Date().getMonth();
  const daysInMonth = new Date(new Date().getFullYear(), currentMonth + 1, 0).getDate();
  const dailyData = Array(daysInMonth).fill({ credit: 0, debit: 0 });

  transactions.forEach((tx) => {
    const date = new Date(tx.date);
    if (date.getMonth() === currentMonth) {
      const day = date.getDate() - 1; // Convert to zero-based index
      if (tx.type === "Credit") {
        dailyData[day] = {
          ...dailyData[day],
          credit: dailyData[day].credit + tx.amount,
        };
      } else if (tx.type === "Debit") {
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
      const amount = tx.type === "Credit" ? tx.amount : -tx.amount;
      for (let i = day; i < daysInMonth; i++) {
        cumulativeData[i] += amount;
      }
    }
  });

  return cumulativeData;
};

const translations = {
  en: {
    totalCredit: "Total Credit",
    totalDebit: "Total Debit",
    balance: "Balance",
    monthlyActivity: "Monthly Activity",
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
    monthlyActivity: "মাসিক কার্যক্রম",
    chartPlaceholder: "এখানে চার্ট দেখানো হবে",
    recentTransactions: "সাম্প্রতিক লেনদেন",
    credit: "ক্রেডিট",
    debit: "ডেবিট",
    clearAll: "সমস্ত লেনদেন মুছুন",
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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited");

    if (!hasVisited) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
        localStorage.setItem("hasVisited", "true");
      }, 2000); // Show loader for 2 seconds

      return () => clearTimeout(timer);
    }
  }, []);

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