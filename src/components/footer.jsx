import React, { useEffect, useState } from 'react';

const Footer = () => {
    const [ipAddress, setIpAddress] = useState("Fetching...");
    const [location, setLocation] = useState("Fetching...");
    const [additionalInfo, setAdditionalInfo] = useState(null);

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

    return (
        <div className="relative py-5">
            <footer className="bg-[#F3F4F6] text-gray-700 border-t border-b p-4 mt-auto fixed bottom-0 w-full">
                <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-center">
                    <p className='hidden lg:block xl:block 2xl:block'></p>
                    <p className='hidden lg:block xl:block 2xl:block'></p>
                    <div className='text-center md:text-start lg:text-start xl:text-center 2xl:text-center'>
                        <p>&copy; {new Date().getFullYear()} Expense Tracker. All rights reserved.</p>
                        <p>UI Version: 1.0.3 | Developed by Faysal Mahmud</p>
                    </div>

                    <div className='text-center md:text-end lg:text-end xl:text-end 2xl:text-end'>
                        <p>Login IP Address: {ipAddress}</p>

                        {/* Hide location until it's fetched */}
                        {location && location !== "Fetching..." && location !== "Unable to fetch location" && (
                            <p className='hidden md:block lg:block xl:block 2xl:block'>Location: {location}{" "}
                                <button
                                    onClick={handleMoreInfo}
                                    className="text-blue-500 underline ml-2"
                                >
                                    More Info
                                </button>
                            </p>
                        )}
                    </div>
                </div >
            </footer >
        </div >
    );
};

export default Footer;