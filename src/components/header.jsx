import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { DEFAULT_USER_IMAGE_URL } from './constants';
import Breadcrumbs from './breadcrumbs';
import { useLanguage } from '../LanguageProvider';

const translations = {
    en: {
        profile: "Profile",
        logout: "Log Out",
    },
    bn: {
        profile: "প্রোফাইল",
        logout: "লগ আউট",
    },
};

const Header = () => {
    const router = useNavigate();
    const [isMenu, setIsMenu] = useState(false);
    const menuRef = useRef(null);
    const { language, setLanguage } = useLanguage();
    const t = translations[language];

    const handleLogout = () => {
        toast.error(language === 'bn' ? "আপনি সফলভাবে লগ আউট হয়েছেন। আবার দেখা হবে!" : "You have successfully logged out. See you next time!");
        router('/');
    };

    const toggleMenu = () => {
        setIsMenu(prev => !prev); // Toggle the menu
    };

    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setIsMenu(false); // Close the menu
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative">
            <header className="fixed top-0 w-full bg-white flex items-center justify-between px-4 py-3 border-b border-gray-200 z-50">
                {/* Logo in the middle */}
                <div className='w-full'> </div>
                <div className="w-full flex-grow flex justify-center lg:justify-start">
                    <div className='lg:w-[255px] xl:w-[255px] 2xl:w-[255px]'>
                        <img
                            src="/logo.png"
                            alt="Logo"
                            className="h-auto w-24 cursor-pointer"
                            onClick={() => router('/')}
                        />
                    </div>
                    <div className="hidden lg:flex lg:flex-grow">
                        <Breadcrumbs />
                    </div>
                </div>

                {/* Language Switch */}
                <div className="w-full flex justify-end">
                    <div className="relative">
                    <button
                        className="h-10 w-10 border rounded-full flex items-center justify-center cursor-pointer"
                        onClick={toggleMenu}
                    >
                        {language.toUpperCase()}
                    </button>

                    {/* Dropdown Menu */}
                    {isMenu && (
                        <div
                            ref={menuRef}
                            className="absolute right-4 top-14 w-48 bg-white shadow-md rounded-md z-50"
                        >
                            <div
                                className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                                onClick={() => {
                                    setLanguage('en');
                                    setIsMenu(false);
                                }}
                            >
                                English
                            </div>
                            <div
                                className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                                onClick={() => {
                                    setLanguage('bn');
                                    setIsMenu(false);
                                }}
                            >
                                বাংলা
                            </div>
                        </div>
                    )}
                </div>
                </div>
            </header>
        </div>
    );
};

export default Header;