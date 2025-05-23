import { useState } from "react";
import { useLanguage } from "../LanguageProvider";

// suggestionType: 'income' | 'expense'
const SUGGESTION_KEY = {
    income: "incomeSuggestions",
    expense: "expenseSuggestions",
};

const translations = {
    en: {
        addCustom: "Add custom suggestion",
        cancel: "Cancel",
        add: "Add",
    },
    bn: {
        addCustom: "কাস্টম সাজেশন যোগ করুন",
        cancel: "বাতিল করুন",
        add: "যোগ করুন",
    },
};

export default function SuggestionScroll({
    value,
    onSelect,
    suggestionType = "income",
}) {
    const [showModal, setShowModal] = useState(false);
    const [custom, setCustom] = useState("");
    const key = SUGGESTION_KEY[suggestionType];
    const stored = localStorage.getItem(key);

    const { language } = useLanguage();
    const t = translations[language] || translations.en;

    const defaultSuggestions = {
        income: language === "bn"
            ? ["বেতন", "উপহার", "বোনাস", "মুনাফা"]
            : ["Salary", "Gift", "Bonus", "Interest"],
        expense: language === "bn"
            ? ["মুদিখানা", "কেনাকাটা", "বিল", "পরিবহন"]
            : ["Groceries", "Shopping", "Bills", "Transport"],
    };

    const suggestions = [
        ...defaultSuggestions[suggestionType],
        ...(stored ? JSON.parse(stored) : []),
    ];

    const addCustom = () => {
        if (!custom.trim()) return;
        // Check if suggestion already exists (case-insensitive)
        const exists = suggestions.some(
            s => s.trim().toLowerCase() === custom.trim().toLowerCase()
        );
        if (exists) {
            setCustom("");
            setShowModal(false);
            return;
        }
        const updated = [...(stored ? JSON.parse(stored) : []), custom.trim()];
        localStorage.setItem(key, JSON.stringify(updated));
        setCustom("");
        setShowModal(false);
    };

    return (
        <div className="mb-4">
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {suggestions.map((s, i) => (
                    <button
                        key={s + i}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${value === s
                                ? "bg-green-600 text-white shadow"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        onClick={() => onSelect(s)}
                        type="button"
                    >
                        {s}
                    </button>
                ))}
                <button
                    className="px-4 py-1.5 rounded-full border border-green-500 text-green-600 text-sm font-semibold hover:bg-green-50 transition"
                    onClick={() => setShowModal(true)}
                    type="button"
                >
                    +
                </button>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm flex items-center justify-center px-4">
                    <div className="bg-white w-full max-w-xs p-6 rounded-2xl shadow-lg animate-fade-in flex flex-col gap-4">
                        <h2 className="text-lg font-semibold text-gray-800">{t.addCustom}</h2>
                        <input
                            className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder={t.category || "Enter category"}
                            value={custom}
                            onChange={(e) => setCustom(e.target.value)}
                            autoFocus
                        />
                        <div className="flex justify-end gap-2 mt-2">
                            <button
                                className="px-4 py-1.5 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
                                onClick={() => setShowModal(false)}
                                type="button"
                            >
                                {t.cancel}
                            </button>
                            <button
                                className="px-4 py-1.5 rounded-md bg-green-600 text-white hover:bg-green-700"
                                onClick={addCustom}
                                type="button"
                            >
                                {t.add}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
