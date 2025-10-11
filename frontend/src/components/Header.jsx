import React, { useState } from "react";
import { Menu, Search, Bell, Plus, LogOut, User, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const Header = () => {
  const { sidebarOpen, setSidebarOpen, currentUser, signOut } = useApp();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleProfileClick = () => {
    setShowUserMenu(!showUserMenu);
  };

  return (
    <header className="bg-gray-900 border-b border-gray-800 px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-400 hover:text-white"
        >
          <Menu size={24} />
        </button>
        {/* <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 bg-gray-800 text-gray-300 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none w-80"
          />
        </div> */}
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-400 hover:text-white">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={handleProfileClick}
            className="flex items-center gap-3 px-3 py-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {currentUser?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <span className="text-white font-medium hidden sm:block">
              {currentUser?.name || "User"}
            </span>
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-700">
                <div className="text-white font-semibold">
                  {currentUser?.name}
                </div>
                <div className="text-gray-400 text-sm">
                  {currentUser?.email}
                </div>
              </div>

              <button
                onClick={() => {
                  setShowUserMenu(false);
                  navigate("/profile");
                }}
                className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white flex items-center gap-2"
              >
                <User size={16} />
                Profile
              </button>

              <button
                onClick={() => {
                  setShowUserMenu(false);
                  navigate("/settings");
                }}
                className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white flex items-center gap-2"
              >
                <Settings size={16} />
                Settings
              </button>

              <div className="border-t border-gray-700 my-1"></div>

              <button
                onClick={() => {
                  setShowUserMenu(false);
                  handleLogout();
                }}
                className="w-full px-4 py-2 text-left text-red-400 hover:bg-gray-700 hover:text-red-300 flex items-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Overlay to close menu when clicking outside */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        ></div>
      )}
    </header>
  );
};

export default Header;
