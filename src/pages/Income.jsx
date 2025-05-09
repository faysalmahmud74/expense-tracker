import { useState, useEffect } from "react";
import { FaPlusCircle } from "react-icons/fa";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../LanguageProvider";

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
    addIncome: "Add Income",
    category: "category",
    amount: "Amount",
    date: "Date",
    add: "Add Income",
    noIncome: "No income entries yet.",
  },
  bn: {
    addIncome: "আয় যোগ করুন",
    category: "উৎস",
    amount: "পরিমাণ",
    date: "তারিখ",
    add: "আয় যোগ করুন",
    noIncome: "এখনো কোনো আয়ের তথ্য নেই।",
  },
};

const Income = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ category: "", amount: "", date: today });

  const { language } = useLanguage() || { language: "en" };
  const t = translations[language] || translations.en;

  useEffect(() => {
    const incomeEntries = getTransactions().filter((e) => e.type === "Credit");
    setEntries(incomeEntries);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.category || !form.amount || !form.date) return;

    const newEntry = {
      id: Date.now(),
      type: "Credit",
      category: form.category,
      amount: parseFloat(form.amount),
      date: form.date,
    };

    const updatedTransactions = [...getTransactions(), newEntry];
    saveTransactions(updatedTransactions);
    setEntries(updatedTransactions.filter((e) => e.type === "Credit"));
    setForm({ category: "", amount: "", date: today });
  };

  return (
    <Layout>
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2 text-green-600">
          <FaPlusCircle /> {t.addIncome}
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl shadow mb-6 space-y-4"
        >
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
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {t.add}
          </button>
        </form>

        <div className="bg-white rounded-2xl p-6 shadow">
          <h2 className="text-lg font-semibold mb-4">{t.addIncome}</h2>
          {entries.length === 0 ? (
            <p className="text-gray-500">{t.noIncome}</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {entries.map((entry) => (
                <li key={entry.id} className="w-full py-4 flex justify-between">
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

export default Income;