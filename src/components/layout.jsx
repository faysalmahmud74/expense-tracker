import Footer from "./footer";
import Header from "./header";
import Sidebar from "./nav";


const Layout = ({ children }) => {
    return (
        <div className="relative">
            <Header />

            <div className="flex flex-col lg:flex-row">
                <div className="w-full lg:w-64 xl:w-64 2xl:w-64 bg-white">
                    <Sidebar />
                </div>

                <div className="flex-1 bg-gray-100 min-h-screen">
                    <main className="pt-10 pb-16 mt-12">
                        {children}
                    </main>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Layout;