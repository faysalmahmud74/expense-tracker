import { useEffect, useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";
import Layout from "../components/Layout";
import { useLanguage } from "../LanguageProvider";
import { FaSpinner } from "react-icons/fa";

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const TRANSACTIONS_KEY = "transactions";

const translations = {
    en: {
        income: "Income",
        expense: "Expense",
        noData: "No data",
        header: "Monthly Income and Expense",
    },
    bn: {
        income: "আয়",
        expense: "ব্যয়",
        noData: "কোন তথ্য নেই",
        header: "মাসিক আয় এবং ব্যয়",
    },
};



// Helper: Group transactions by month and category
function groupByMonthAndCategory(transactions, type) {
    // { '2024-05': { 'Salary': 1000, 'Gift': 200 }, ... }
    return transactions
        .filter((t) => t.type.toLowerCase() === type.toLowerCase())
        .reduce((acc, curr) => {
            const date = new Date(curr.date);
            const ym = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
            if (!acc[ym]) acc[ym] = {};
            if (!acc[ym][curr.category]) acc[ym][curr.category] = 0;
            acc[ym][curr.category] += Number(curr.amount);
            return acc;
        }, {});
}

function groupByType(transactions, type) {
    return transactions
        .filter((t) => t.type === type)
        .reduce((acc, curr) => {
            const idx = acc.findIndex((a) => a.title === curr.title);
            if (idx > -1) {
                acc[idx].amount += Number(curr.amount);
            } else {
                acc.push({ title: curr.title, amount: Number(curr.amount) });
            }
            return acc;
        }, []);
}

function PieChart({ data, label }) {
    if (!data.length) return <div className="text-center text-gray-400">No data</div>;
    return (
        <div className="w-full md:w-1/2 p-4">
            <h2 className="text-lg font-semibold mb-2 text-center">{label}</h2>
            <Pie
                data={{
                    labels: data.map((d) => `${d.title} (${d.amount})`),
                    datasets: [
                        {
                            data: data.map((d) => d.amount),
                            backgroundColor: [
                                "#4ade80",
                                "#f87171",
                                "#60a5fa",
                                "#fbbf24",
                                "#a78bfa",
                                "#f472b6",
                                "#34d399",
                                "#facc15",
                            ],
                            borderWidth: 1,
                        },
                    ],
                }}
                options={{
                    plugins: {
                        legend: { position: "bottom" },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    return `${context.label}`;
                                },
                            },
                        },
                    },
                }}
            />
        </div>
    );
}

// New: Bar chart for total income vs expense
function IncomeExpenseBarChart({ income, expense, t }) {
    const data = {
        labels: [t.income, t.expense],
        datasets: [
            {
                label: t.header,
                data: [income, expense],
                backgroundColor: ["#4ade80", "#f87171"],
            },
        ],
    };
    return (
        <div className="w-full md:w-1/2 p-4">
            <h2 className="text-lg font-semibold mb-2 text-center">{t.header}</h2>
            <Bar
                data={data}
                options={{
                    plugins: {
                        legend: { display: false },
                    },
                    scales: {
                        y: { beginAtZero: true },
                    },
                }}
            />
        </div>
    );
}

export default function Charts() {
    const { language } = useLanguage();
    const t = translations[language] || translations.en;
    const [monthlyIncome, setMonthlyIncome] = useState({});
    const [monthlyExpense, setMonthlyExpense] = useState({});
    const [selectedMonth, setSelectedMonth] = useState("");
    const [months, setMonths] = useState([]);

    useEffect(() => {
        const stored = localStorage.getItem(TRANSACTIONS_KEY);
        const transactions = stored ? JSON.parse(stored) : [];
        const income = groupByMonthAndCategory(transactions, "Income");
        const expense = groupByMonthAndCategory(transactions, "Expense");
        setMonthlyIncome(income);
        setMonthlyExpense(expense);
        // Get all months present in data
        const allMonths = Array.from(new Set([
            ...Object.keys(income),
            ...Object.keys(expense),
        ])).sort().reverse();
        setMonths(allMonths);
        if (!selectedMonth && allMonths.length) setSelectedMonth(allMonths[0]);
    }, [selectedMonth]);

    // Prepare chart data for selected month
    const incomeData = selectedMonth && monthlyIncome[selectedMonth]
        ? Object.entries(monthlyIncome[selectedMonth]).map(([category, amount]) => ({ title: category, amount }))
        : [];
    const expenseData = selectedMonth && monthlyExpense[selectedMonth]
        ? Object.entries(monthlyExpense[selectedMonth]).map(([category, amount]) => ({ title: category, amount }))
        : [];

    // New: Calculate total income and expense for bar chart
    const totalIncome = incomeData.reduce((sum, d) => sum + Number(d.amount), 0);
    const totalExpense = expenseData.reduce((sum, d) => sum + Number(d.amount), 0);

    return (
        <Layout>
            <div className="flex items-center justify-center flex-col px-4 bg-gray-50">
                <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-8 w-full max-w-5xl">
                    <div className="w-full md:w-1/2 bg-white p-6 rounded-2xl shadow-md">
                        <h2 className="text-lg font-semibold text-green-600 text-center mb-4">
                            {t.income}
                        </h2>
                        <PieChart data={incomeData} />
                    </div>

                    <div className="w-full md:w-1/2 bg-white p-6 rounded-2xl shadow-md">
                        <h2 className="text-lg font-semibold text-red-600 text-center mb-4">
                            {t.expense}
                        </h2>
                        <PieChart data={expenseData} />
                    </div>
                </div>

                {/* New: Bar chart for total income vs expense */}
                <div className="w-full max-w-2xl mt-10 bg-white p-6 rounded-2xl shadow-md">
                    <IncomeExpenseBarChart income={totalIncome} expense={totalExpense} t={t} />
                </div>
            </div>
        </Layout>
    );
}
