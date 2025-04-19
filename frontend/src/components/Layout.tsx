import React from 'react';
import { Menu, User, Moon, Sun } from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';

const Layout: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${isDarkMode ? 'dark' : ''}`}>
      <header className="bg-white dark:bg-gray-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="h-10 w-10 bg-purple-600 rounded-full flex items-center justify-center">
                  <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4L20 18H4L12 4Z" fill="currentColor" />
                  </svg>
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">CryptoHeir</span>
              </div>
              <nav className="hidden md:ml-6 md:flex md:space-x-8">
                <Link
                  to="/"
                  className={`${
                    location.pathname === '/'
                      ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/heirs"
                  className={`${
                    location.pathname === '/heirs'
                      ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Manage Heirs
                </Link>
              </nav>
            </div>
            <div className="hidden md:flex items-center">
              <button 
                onClick={toggleDarkMode}
                className="p-2 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none dark:text-gray-300 dark:hover:text-white"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <div className="ml-4 relative flex-shrink-0">
                <div>
                  <button className="flex text-sm rounded-full focus:outline-none ring-2 ring-offset-2 ring-purple-500">
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <User size={16} className="text-gray-600" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center md:hidden">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full text-gray-500 dark:text-gray-300"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className={`${
                  location.pathname === '/'
                    ? 'bg-purple-50 border-purple-500 text-purple-700 dark:bg-gray-800 dark:text-purple-400'
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 dark:text-gray-300 dark:hover:bg-gray-800'
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/heirs"
                className={`${
                  location.pathname === '/heirs'
                    ? 'bg-purple-50 border-purple-500 text-purple-700 dark:bg-gray-800 dark:text-purple-400'
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 dark:text-gray-300 dark:hover:bg-gray-800'
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Manage Heirs
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>© 2025 CryptoHeir. All rights reserved.</p>
            <p className="mt-2">Secure your legacy with blockchain technology.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;