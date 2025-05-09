import { useState } from "react";
import {
    FaHome,
    FaUsers,
    FaClipboardList,
    FaChartBar,
    FaCog,
    FaBars,
    FaShippingFast,
    FaMoneyBillWave,
    FaWallet,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useLanguage } from "../LanguageProvider";

const translations = {
    en: {
        dashboard: "Dashboard",
        credit: "Credit",
        debit: "Debit",
        reports: "Reports",
    },
    bn: {
        dashboard: "ড্যাশবোর্ড",
        credit: "ক্রেডিট",
        debit: "ডেবিট",
        reports: "রিপোর্ট",
    },
};

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { language, setLanguage } = useLanguage();
    const t = translations[language];
    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            {/* Toggler Button for Mobile */}
            <button
                className="lg:hidden fixed top-4 left-4 z-50 bg-blue-500 text-white p-2 rounded focus:outline-none"
                onClick={toggleSidebar}
            >
                <FaBars size={20} />
            </button>

            {/* Sidebar */}
            <div className="relative">
                <nav
                    className={`bg-white w-64 h-screen p-5 fixed top-0 left-0 z-40 transform ${isOpen ? "translate-x-0" : "-translate-x-full"
                        } transition-transform duration-300 lg:translate-x-0`}
                >
                    <ul className="space-y-4 mt-20">
                        <li>
                            <NavLink
                                to="/"
                                className={({ isActive }) =>
                                    isActive
                                        ? "flex items-center hover:text-teal-600 bg-blue-500 text-white py-2 rounded-lg px-2"
                                        : "text-gray-600 flex items-center hover:text-teal-600 px-2"
                                }
                            >
                                <FaHome className="mr-3" />
                                {t.dashboard}
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/credit"
                                className={({ isActive }) =>
                                    isActive
                                        ? "flex items-center hover:text-teal-600 bg-blue-500 text-white py-2 rounded-lg px-2"
                                        : "text-gray-600 flex items-center hover:text-teal-600 px-2"
                                }
                            >
                                <FaMoneyBillWave className="mr-3" />
                                {t.credit}
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/debit"
                                className={({ isActive }) =>
                                    isActive
                                        ? "flex items-center hover:text-teal-600 bg-blue-500 text-white py-2 rounded-lg px-2"
                                        : "text-gray-600 flex items-center hover:text-teal-600 px-2"
                                }
                            >
                                <FaWallet className="mr-3" />
                                {t.debit}
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/reports"
                                className={({ isActive }) =>
                                    isActive
                                        ? "flex items-center hover:text-teal-600 bg-blue-500 text-white py-2 rounded-lg px-2"
                                        : "text-gray-600 flex items-center hover:text-teal-600 px-2"
                                }
                            >
                                <FaChartBar className="mr-3" />
                                {t.reports}
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Overlay for mobile when sidebar is open */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-50 z-30 lg:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}
        </>
    );
};

export default Sidebar;
