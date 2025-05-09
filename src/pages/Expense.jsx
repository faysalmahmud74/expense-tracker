import { useState, useEffect } from "react";
import { FaMinusCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../LanguageProvider";
import Layout from "../components/Layout";

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
        category: "Category",
        amount: "Amount",
        date: "Date",
        add: "Add Expense",
        noIncome: "No expense entries yet.",

    },
    bn: {
        addExpense: "ব্যয় যোগ করুন",
        category: "বিভাগ",
        amount: "পরিমাণ",
        date: "তারিখ",
        add: "ব্যয় যোগ করুন",
        noIncome: "এখনো কোনো ব্যয়ের তথ্য নেই।",
    },
};

const Expense = () => {
    const router = useNavigate();
    const { language } = useLanguage();
    const t = translations[language] || translations.en;

    const today = new Date().toISOString().split("T")[0];
    const [form, setForm] = useState({ category: "", amount: "", date: today });
    const [entries, setEntries] = useState([]);

    useEffect(() => {
        setEntries(getTransactions().filter(e => e.type === "Debit"));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.category || !form.amount || !form.date) return;

        const newEntry = {
            id: Date.now(),
            type: "Debit",
            category: form.category,
            amount: parseFloat(form.amount),
            date: form.date,
        };

        const updatedTx = [...getTransactions(), newEntry];
        saveTransactions(updatedTx);
        setEntries(updatedTx.filter(e => e.type === "Debit"));
        setForm({ category: "", amount: "", date: today });
    };

    return (
        <Layout>
            <div className="p-6 bg-gray-100 min-h-screen">
                <h1 className="text-2xl font-bold mb-6 flex items-center gap-2 text-red-600">
                    <FaMinusCircle /> {t.addExpense}
                </h1>

                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow mb-6 space-y-4">
                    <input
                        type="text"
                        placeholder={t.category}
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="w-full border p-2 rounded"
                    />
                    <input
                        type="number"
                        placeholder={t.amount}
                        value={form.amount}
                        onChange={(e) => setForm({ ...form, amount: e.target.value })}
                        className="w-full border p-2 rounded"
                    />
                    <input
                        type="date"
                        value={form.date}
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                        className="w-full border p-2 rounded"
                    />
                    <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded">
                        {t.add}
                    </button>
                </form>

                <div className="bg-white rounded-2xl p-6 shadow">
                    <h2 className="text-lg font-semibold mb-4">{t.addExpense}</h2>
                    {entries.length === 0 ? (
                        <p className="text-gray-500">{t.noIncome}</p>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {entries.map((entry) => (
                                <li key={entry.id} className="py-4 flex justify-between">
                                    <span className="w-full">{entry.category}</span>
                                    <span className="w-full text-center">${entry.amount}</span>
                                    <span className="w-full text-center text-sm text-gray-500">{entry.date}</span>
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