import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useLanguage } from "../LanguageProvider";

const TRANSACTIONS_KEY = "transactions";

const getTransactions = () => {
  const data = localStorage.getItem(TRANSACTIONS_KEY);
  return data ? JSON.parse(data) : [];
};

const translations = {
  en: {
    reports: "Reports",
    filterByDate: "Filter by Date:",
    clear: "Clear",
    type: "Type",
    description: "Description",
    amount: "Amount",
    date: "Date",
    noEntries: "No entries found for the selected date.",
    credit: "Credit",
    debit: "Debit",
  },
  bn: {
    reports: "রিপোর্ট",
    filterByDate: "তারিখ অনুযায়ী ফিল্টার:",
    clear: "মুছুন",
    type: "ধরন",
    description: "বিবরণ",
    amount: "পরিমাণ",
    date: "তারিখ",
    noEntries: "নির্বাচিত তারিখের জন্য কোনো এন্ট্রি পাওয়া যায়নি।",
    credit: "ক্রেডিট",
    debit: "ডেবিট",
  },
};

const Reports = () => {
  const [entries, setEntries] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const { language, setLanguage } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    setEntries(getTransactions());
  }, []);

  const filteredEntries = filterDate
    ? entries.filter((e) => e.date === filterDate)
    : entries;

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">{t.reports}</h1>

        <div className="mb-4">
          <label className="mr-2 font-medium">{t.filterByDate}</label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="border p-2 rounded"
          />
          <button
            className="ml-4 px-3 py-2 bg-gray-300 rounded"
            onClick={() => setFilterDate("")}
          >
            {t.clear}
          </button>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-600 border-b">
                <th className="w-1/4 py-2">{t.type}</th>
                <th className="w-1/4 py-2">{t.description}</th>
                <th className="w-1/4 py-2">{t.amount}</th>
                <th className="w-1/4 py-2">{t.date}</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.length ? (
                filteredEntries.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="w-1/4 break-words py-2 capitalize">{item.type === "Credit" ? t.credit : t.debit}</td>
                    <td className="w-1/4 break-words px-2 md:px-0 py-2">
                      {item.category}
                    </td>
                    <td
                      className={`w-1/4 break-words px-2 md:px-0 py-2 font-semibold ${item.type === "Credit" ? "text-green-600" : "text-red-600"}`}
                    >
                      ${item.amount}
                    </td>
                    <td className="w-1/4 break-words py-2 text-sm text-gray-500">{item.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500">
                    {t.noEntries}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Reports;
