import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [walletAddress, setWalletAddress] = useState<string | null>(null);

    useEffect(() => {
        // Check for walletAddress in localStorage
        const storedAddress = localStorage.getItem('walletAddress');
        if (storedAddress) {
            setWalletAddress(storedAddress);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('walletAddress');
        localStorage.removeItem('walletSignature');
        setWalletAddress(null);
        console.log('User logged out');
        navigate('/')
    };

    const toggleMenu = () => setIsMenuOpen((prev) => !prev);

    const navLinks = [
        { to: '/', label: 'Home' },
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/heirs', label: 'Heirs' },
    ];

    return (
        <header className="sticky top-0 z-50 bg-gradient-to-r from-gray-900 to-black shadow-lg">
            <div className="rounded-3xl max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center space-x-2">
                    <span className="text-3xl font-extrabold text-white tracking-tight transform transition-all duration-300 hover:scale-110">
                        <button>
                            👑 AncestryChain
                        </button>
                    </span>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex space-x-8">
                    {navLinks.map((link, index) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className="text-gray-200 text-sm font-medium relative group animate-fadeIn"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {link.label}
                            <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-indigo-400 transition-all duration-300 group-hover:w-full" />
                        </Link>
                    ))}
                </nav>

                {/* Auth Buttons */}
                <div className="flex items-center space-x-4">
                    {walletAddress ? (
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-300 text-sm font-mono hidden sm:block">
                                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold text-sm transform transition-all duration-200 hover:bg-red-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => navigate('/sign-up')}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold text-sm transform transition-all duration-200 hover:bg-green-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                        >
                            Sign Up
                        </button>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={toggleMenu}
                        className="md:hidden text-white focus:outline-none"
                        aria-label="Toggle mobile menu"
                    >
                        <svg
                            className="w-6 h-6 transition-transform duration-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'}
                            />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <nav className="md:hidden bg-gray-800 animate-slideIn">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col space-y-4">
                        {navLinks.map((link, index) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                onClick={toggleMenu}
                                className="text-gray-200 text-lg font-medium relative group animate-fadeIn"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {link.label}
                                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-indigo-400 transition-all duration-300 group-hover:w-full" />
                            </Link>
                        ))}
                        {walletAddress && (
                            <button
                                onClick={() => {
                                    handleLogout();
                                    toggleMenu();
                                }}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold text-sm text-left transform transition-all duration-200 hover:bg-red-700 hover:scale-105"
                            >
                                Logout
                            </button>
                        )}
                    </div>
                </nav>
            )}
        </header>
    );
};

export default Header;
