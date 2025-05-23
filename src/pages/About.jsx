import { FaEnvelope, FaLinkedin, FaGithub } from "react-icons/fa";
import Layout from "../components/Layout";

const About = () => {
    return (
        <Layout>
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="bg-white border border-gray-200 shadow-xl rounded-2xl p-10 max-w-4xl w-full grid md:grid-cols-2 gap-10 animate-fade-in">

                    {/* Left Column */}
                    <div className="flex flex-col justify-center text-justify">
                        <h1 className="text-start text-3xl font-extrabold text-gray-800 mb-4">
                            About <span className="text-sky-600">Expense Tracker 365</span>
                        </h1>
                        <p className="text-gray-600 mb-5 text-base leading-relaxed">
                            <strong>Expense Tracker 365</strong> is a sleek, modern finance app that helps you log, view, and analyze your income and expenses in real-time. Built for speed and simplicity, it's perfect for individuals who want control over their budget without any clutter.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-3">
                            Developer
                        </h2>
                        <p className="text-gray-600 mb-0.5">
                            <strong>Faysal Mahmud</strong>
                        </p>
                        <p className="text-gray-600 mb-0.5">Software Engineer @ Akij iBOS Ltd.</p>
                        <p className="text-gray-600">B.Sc. in CSE, AIUB</p>

                        {/* Social Icons */}
                        <div className="flex gap-4 mt-6">
                            <a
                                href="mailto:mahmudfaysal64@gmail.com"
                                className="text-gray-500 hover:text-sky-600 transition"
                                title="Email"
                            >
                                <FaEnvelope size={18} />
                            </a>
                            <a
                                href="https://linkedin.com/in/faysalmahmud74"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-500 hover:text-sky-600 transition"
                                title="LinkedIn"
                            >
                                <FaLinkedin size={18} />
                            </a>
                            <a
                                href="https://github.com/faysalmahmud74"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-500 hover:text-sky-600 transition"
                                title="GitHub"
                            >
                                <FaGithub size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Right Column - Optional illustration */}
                    <div className="flex items-center justify-center">
                        <img
                            src="/0_3Vc_-76YdTqRbL4s.gif"
                            alt="Developer Illustration"
                            className="w-64 md:w-72"
                        />
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default About;