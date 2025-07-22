import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, Search, Plus, MessageCircle, User, LogOut, Settings } from 'lucide-react';
import { Menu as HeadlessMenu } from '@headlessui/react';
import logo from '../assets/circlo-logo.png';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navigation = [
    { name: 'Browse', href: '/listings' },
    { name: 'Cultural Vault', href: '/cultural-vault' },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <img src={logo} alt="Circlo Logo" className="w-12 h-12 rounded-full shadow" />
              <span className="text-xl font-bold text-gray-900">Circlo</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    location.pathname === item.href
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              {/* Admin button, only for admin@circlo.com */}
              {user && user.email === 'admin@circlo.com' && (
                <Link
                  to="/admin"
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    location.pathname === '/admin'
                      ? 'text-red-600 border-b-2 border-red-600'
                      : 'text-red-700 hover:text-red-600'
                  }`}
                >
                  Admin
                </Link>
              )}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/add-listing"
                  className="hidden sm:flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>List Item</span>
                </Link>
                
                <Link
                  to="/chat"
                  className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                </Link>

                {/* User Menu */}
                <HeadlessMenu as="div" className="relative">
                  <HeadlessMenu.Button className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-colors">
                    <img
                      src={user.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="hidden sm:block text-sm font-medium text-gray-700">{user.name}</span>
                  </HeadlessMenu.Button>
                  
                  <HeadlessMenu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="py-1">
                      <HeadlessMenu.Item>
                        {({ active }) => (
                          <Link
                            to="/dashboard"
                            className={`flex items-center space-x-2 px-4 py-2 text-sm ${
                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                            }`}
                          >
                            <User className="w-4 h-4" />
                            <span>Dashboard</span>
                          </Link>
                        )}
                      </HeadlessMenu.Item>
                      <HeadlessMenu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            className={`w-full flex items-center space-x-2 px-4 py-2 text-sm ${
                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                            }`}
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign out</span>
                          </button>
                        )}
                      </HeadlessMenu.Item>
                    </div>
                  </HeadlessMenu.Items>
                </HeadlessMenu>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Sign up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {user && (
                <Link
                  to="/add-listing"
                  className="block px-3 py-2 text-base font-medium text-blue-600 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  List Item
                </Link>
              )}
              {/* Admin button, only for admin@circlo.com */}
              {user && user.email === 'admin@circlo.com' && (
                <Link
                  to="/admin"
                  className="block px-3 py-2 text-base font-medium text-red-700 hover:text-red-600 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;