import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState("en");

    // Optional: persist language in localStorage
    useEffect(() => {
        const storedLang = localStorage.getItem("lang");
        if (storedLang) setLanguage(storedLang);
    }, []);

    useEffect(() => {
        localStorage.setItem("lang", language);
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

