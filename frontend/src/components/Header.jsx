import React from 'react';
import { Menu, Search, Bell, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Header = () => {
  const { sidebarOpen, setSidebarOpen } = useApp();

  return (
    <header className="bg-gray-900 border-b border-gray-800 px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-white">
          <Menu size={24} />
        </button>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 bg-gray-800 text-gray-300 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none w-80"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-400 hover:text-white">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:opacity-90 flex items-center gap-2">
          <Plus size={18} />
          Create Quiz
        </button>
        <button className="flex items-center gap-3 px-3 py-2 hover:bg-gray-800 rounded-lg transition-colors">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full"></div>
        </button>
      </div>
    </header>
  );
};

export default Header;
