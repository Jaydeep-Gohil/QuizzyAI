import React from 'react';
import { BarChart3, BookOpen, Calendar, Users, Settings } from 'lucide-react';
import { useApp } from '../context/AppContext';
import NavItem from './NavItem';

const Sidebar = () => {
  const { sidebarOpen, currentPage, setCurrentPage } = useApp();

  return (
    <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-900 border-r border-gray-800 transition-all duration-300 flex flex-col`}>
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg"></div>
          {sidebarOpen && <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">Quizzy</span>}
        </div>
      </div>

      <div className="flex-1 px-3 py-4">
        <input
          type="text"
          placeholder="Search"
          className="w-full bg-gray-800 text-gray-300 px-3 py-2 rounded-lg text-sm mb-4"
        />

        <nav className="space-y-1">
          <NavItem icon={<BarChart3 size={20} />} text="Dashboard" active={currentPage === 'dashboard'} onClick={() => setCurrentPage('dashboard')} />
          <NavItem icon={<BookOpen size={20} />} text="Quizzes" active={currentPage === 'quizzes'} onClick={() => setCurrentPage('quizzes')} />
          <NavItem icon={<Calendar size={20} />} text="Events" active={currentPage === 'events'} onClick={() => setCurrentPage('events')} />
          <NavItem icon={<Users size={20} />} text="Students" active={currentPage === 'students'} onClick={() => setCurrentPage('students')} />
        </nav>

        <div className="mt-8 pt-4 border-t border-gray-800">
          <p className="text-gray-500 text-xs font-semibold mb-2 px-3">Manage</p>
          <NavItem icon={<Settings size={20} />} text="Settings" active={currentPage === 'settings'} onClick={() => setCurrentPage('settings')} />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
