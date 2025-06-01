import { useState, useEffect } from "react";
import { FaMinusCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../LanguageProvider";
import Layout from "../components/Layout";
import SuggestionScroll from "../components/SuggestionScroll";

const TRANSACTIONS_KEY = "transactions";

const getTransactions = () => {
    const data = localStorage.getItem(TRANSACTIONS_KEY);
    return data ? JSON.parse(data) : [];
};

const saveTransactions = (transactions) => {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
};

const translations = {
    en: {
        addExpense: "Add Expense",
        category: "Expense Category",
        amount: "Amount",
        date: "Date",
        add: "Add Expense",
        noIncome: "No expense entries yet.",
        currency: "$",
        expenses: "Expenses",

    },
    bn: {
        addExpense: "ব্যয় যোগ করুন",
        category: "কোথায় ব্যয় করেছেন?",
        amount: "পরিমাণ",
        date: "তারিখ",
        add: "ব্যয় যোগ করুন",
        noIncome: "এখনো কোনো ব্যয়ের তথ্য নেই",
        currency: "৳",
        expenses: "ব্যয়সমূহ",
    },
};

// Helper to get local date string in YYYY-MM-DD
const getLocalDateString = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().split("T")[0];
};

const Expense = () => {
    const router = useNavigate();
    const { language } = useLanguage();
    const t = translations[language] || translations.en;

    const today = getLocalDateString();
    const [form, setForm] = useState({ category: "", amount: "", date: today });
    const [entries, setEntries] = useState([]);

    useEffect(() => {
        setEntries(getTransactions().filter(e => e.type === "Expense"));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.category || !form.amount || !form.date) return;

        const newEntry = {
            id: Date.now(),
            type: "Expense",
            category: form.category,
            amount: parseFloat(form.amount),
            date: form.date,
        };

        const updatedTx = [...getTransactions(), newEntry];
        saveTransactions(updatedTx);
        setEntries(updatedTx.filter(e => e.type === "Expense"));
        setForm({ category: "", amount: "", date: today });
    };

    return (
        <Layout>
            <div className="p-6 bg-gray-100 min-h-screen">
                <h1 className="text-2xl font-bold mb-6 flex items-center gap-2 text-red-600">
                    <FaMinusCircle /> {t.addExpense}
                </h1>

                {/* Form Section */}
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow mb-6 space-y-4">
                    <SuggestionScroll
                        value={form.category}
                        onSelect={(cat) => setForm({ ...form, category: cat })}
                        suggestionType="expense"
                    />

                    <input
                        type="text"
                        placeholder={t.category}
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />

                    <input
                        type="number"
                        placeholder={t.amount}
                        value={form.amount}
                        onChange={(e) => setForm({ ...form, amount: e.target.value })}
                        className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />

                    <input
                        type="date"
                        value={form.date}
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                        className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />

                    <button
                        type="submit"
                        className="w-full bg-red-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-red-700 transition"
                    >
                        {t.add}
                    </button>
                </form>

                {/* Expense List Section */}
                <div className="bg-white rounded-2xl p-6 shadow">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">{t.expenses}</h2>

                    {entries.length === 0 ? (
                        <p className="text-gray-500 text-sm">{t.noIncome}</p>
                    ) : (
                        <ul className="divide-y divide-gray-100">
                            {entries.map((entry) => (
                                <li key={entry.id} className="py-4 flex justify-between items-center text-sm">
                                    <span className="w-1/3 text-gray-700 truncate">{entry.category}</span>
                                    <span className="w-1/3 text-center font-medium text-red-600">
                                        {t.currency}{entry.amount}
                                    </span>
                                    <span className="w-1/3 text-right text-gray-500">{entry.date}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Expense;