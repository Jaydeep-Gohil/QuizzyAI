import React from 'react';
import { BarChart3, BookOpen, Calendar, Users, Settings, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import NavItem from './NavItem';

const Sidebar = () => {
  const { sidebarOpen } = useApp();

  return (
    <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-900 border-r border-gray-800 transition-all duration-300 flex flex-col`}>
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg"></div>
          {sidebarOpen && <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">Quizzy</span>}
        </div>
      </div>

      <div className="flex-1 px-3 py-4">
        {/* <input
          type="text"
          placeholder="Search"
          className="w-full bg-gray-800 text-gray-300 px-3 py-2 rounded-lg text-sm mb-4"
        /> */}

        <nav className="space-y-1">
          <NavLink to="/dashboard" className={({ isActive }) => 
            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`
          }>
            <BarChart3 size={20} />
            {sidebarOpen && <span>Dashboard</span>}
          </NavLink>
          <NavLink to="/quizzes" className={({ isActive }) => 
            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`
          }>
            <BookOpen size={20} />
            {sidebarOpen && <span>Quizzes</span>}
          </NavLink>
          <NavLink to="/events" className={({ isActive }) => 
            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`
          }>
            <Calendar size={20} />
            {sidebarOpen && <span>Events</span>}
          </NavLink>
          <NavLink to="/students" className={({ isActive }) => 
            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`
          }>
            <Users size={20} />
            {sidebarOpen && <span>Students</span>}
          </NavLink>
        </nav>

        <div className="mt-8 pt-4 border-t border-gray-800">
          <p className="text-gray-500 text-xs font-semibold mb-2 px-3">Account</p>
          <NavLink to="/profile" className={({ isActive }) => 
            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`
          }>
            <User size={20} />
            {sidebarOpen && <span>Profile</span>}
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => 
            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`
          }>
            <Settings size={20} />
            {sidebarOpen && <span>Settings</span>}
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
