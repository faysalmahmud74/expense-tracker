import React, { useEffect, useState } from 'react';
import { useLanguage } from '../LanguageProvider';

const translations = {
    en: {
        clear: "Clear",
        close: "Close",
        ok: "OK",
        calculator: "Calculator",
    },
    bn: {
        clear: "ক্লিয়ার",
        close: "বন্ধ করুন",
        ok: "ঠিক আছে",
        calculator: "ক্যালকুলেটর",
    },
};

const Footer = () => {
    const [ipAddress, setIpAddress] = useState("Fetching...");
    const [location, setLocation] = useState("Fetching...");
    const [additionalInfo, setAdditionalInfo] = useState(null);
    const [showCalculator, setShowCalculator] = useState(false);
    const [calcInput, setCalcInput] = useState("");
    const [calcResult, setCalcResult] = useState("");

    const { language } = useLanguage() || { language: "en" };
    const t = translations[language] || translations.en;

    useEffect(() => {
        const fetchIpAndLocation = async () => {
            try {
                // Replace 'YOUR_API_KEY' with your actual API key from ipgeolocation.io
                const apiKey = "09f10e24b54f4909841fb45b5d426793";

                // Fetch IP and location details
                const response = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}`);
                const data = await response.json();

                // Update state with the fetched data
                setIpAddress(data.ip);
                setLocation(`${data.city}, ${data.country_name}`);
                setAdditionalInfo(data);
            } catch (error) {
                console.error("Error fetching IP and location:", error);
                setIpAddress("Unable to fetch IP");
                setLocation("Unable to fetch location");
            }
        };

        fetchIpAndLocation();
    }, []);

    const handleMoreInfo = () => {
        if (additionalInfo) {
            alert(
                `IP: ${additionalInfo.ip}\nCity: ${additionalInfo.city}\nRegion: ${additionalInfo.state_prov}\nCountry: ${additionalInfo.country_name}\nTimezone: ${additionalInfo.time_zone.name}\nISP: ${additionalInfo.isp}`
            );
        } else {
            alert("Additional information is unavailable.");
        }
    };

    const handleCalcButtonClick = () => setShowCalculator(true);
    const handleCalcClose = () => {
        setShowCalculator(false);
        setCalcInput("");
        setCalcResult("");
    };
    const handleCalcInput = (val) => setCalcInput((prev) => prev + val);
    const handleCalcClear = () => {
        setCalcInput("");
        setCalcResult("");
    };
    const handleCalcEqual = () => {
        try {
            // eslint-disable-next-line no-eval
            const result = eval(calcInput);
            setCalcResult(result);
        } catch {
            setCalcResult("Error");
        }
    };

    return (
        <div className="relative py-5">
            <footer className="bg-[#F3F4F6] text-gray-700 border-t border-b p-4 mt-auto fixed bottom-0 w-full">
                {/* Floating Calculator Button */}
                <button
                    className="fixed z-50 bottom-20 right-6 bg-gray-50 text-white rounded-full shadow-lg w-14 h-14 flex items-center justify-center text-2xl transition"
                    onClick={handleCalcButtonClick}
                    title="Open Calculator"
                >
                    <img className='w-8 h-8' src="/calculator.svg" alt="" />
                </button>
                {/* Calculator Modal */}
                {showCalculator && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="bg-white rounded-2xl shadow-2xl p-6 w-80 relative">
                            <div className="mb-2 text-center text-lg font-semibold">{t.calculator}</div>
                            <input
                                className="w-full mb-2 p-2 border rounded text-right text-lg"
                                value={calcInput}
                                readOnly
                            />
                            <div className="w-full mb-2 text-right text-blue-600 font-bold text-xl min-h-[28px]">{calcResult}</div>
                            <div className="grid grid-cols-4 gap-2">
                                {["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "0", ".", "=", "+"].map((val) => (
                                    val === "=" ? (
                                        <button key={val} className="col-span-1 bg-blue-500 text-white rounded p-2 hover:bg-blue-600" onClick={handleCalcEqual}>=</button>
                                    ) : (
                                        <button key={val} className="col-span-1 bg-gray-200 rounded p-2 hover:bg-gray-300" onClick={() => handleCalcInput(val)}>{val}</button>
                                    )
                                ))}
                            </div>
                            {/* Text-only button row */}
                            <div className="flex justify-between mt-5 px-2">
                                <button
                                    className="bg-transparent border-none shadow-none text-green-500 font-semibold mr-2"
                                    style={{ background: "none", border: "none", boxShadow: "none" }}
                                    onClick={handleCalcClear}
                                >
                                    {t.clear}
                                </button>
                                <div className='flex gap-4'>
                                    <button
                                        className="flex-1 bg-transparent border-none shadow-none text-green-500 font-semibold mx-2"
                                        style={{ background: "none", border: "none", boxShadow: "none" }}
                                        onClick={handleCalcClose}
                                    >
                                        {t.close}
                                    </button>
                                    <button
                                        className="flex-1 bg-transparent border-none shadow-none text-green-500 font-semibold ml-2"
                                        style={{ background: "none", border: "none", boxShadow: "none" }}
                                        onClick={handleCalcClose}
                                    >
                                        {t.ok}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div className="flex flex-col sm:flex-row justify-center items-center text-xs text-center">
                    <p className='hidden lg:block xl:block 2xl:block'></p>
                    <p className='hidden lg:block xl:block 2xl:block'></p>
                    <div className='text-center md:text-start lg:text-start xl:text-center 2xl:text-center'>
                        <p>&copy; {new Date().getFullYear()} Expense Tracker 365. All rights reserved.</p>
                        <p>UI Version: 1.0.1 | Developed by Faysal Mahmud</p>
                    </div>
                </div >
            </footer >
        </div >
    );
};

export default Footer;