import React, { useState } from "react";
import { Check, X, AlertCircle, Moon, Sun, Monitor, Globe } from "lucide-react";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700">
          <div className="flex gap-1 p-2 border-b border-gray-700">
            <button
              onClick={() => setActiveTab("notifications")}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === "notifications"
                  ? "bg-purple-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Notifications
            </button>
            <button
              onClick={() => setActiveTab("appearance")}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === "appearance"
                  ? "bg-purple-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Appearance
            </button>
            <button
              onClick={() => setActiveTab("privacy")}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === "privacy"
                  ? "bg-purple-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Privacy
            </button>
          </div>

          <div className="p-8">
            {activeTab === "account" && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Account Security
                </h2>
                <p className="text-gray-400 mb-8">
                  Update your password and security settings
                </p>

                <div className="space-y-6 max-w-2xl mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <button className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700">
                    Update Password
                  </button>
                </div>

                <div className="border-t border-gray-700 pt-8 mb-8">
                  <h3 className="text-xl font-bold text-white mb-2">
                    Two-Factor Authentication
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Add an extra layer of security to your account
                  </p>
                  <div className="flex items-center justify-between max-w-2xl p-4 bg-gray-900 rounded-lg border border-gray-700">
                    <div>
                      <div className="text-white font-medium mb-1">
                        Enable Two-Factor Authentication
                      </div>
                      <div className="text-gray-400 text-sm">
                        Receive a verification code via email or authenticator
                        app
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-8">
                  <h3 className="text-xl font-bold text-white mb-2">
                    Connected Accounts
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Connect your account to other services
                  </p>
                  <div className="space-y-3 max-w-2xl">
                    {[
                      { name: "Google", desc: "Connect your Google account" },
                      {
                        name: "Facebook",
                        desc: "Connect your Facebook account",
                      },
                      { name: "X", desc: "Connect your X account" },
                    ].map((service, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-4 bg-gray-900 rounded-lg border border-gray-700"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                            <Globe size={20} className="text-gray-400" />
                          </div>
                          <div>
                            <div className="text-white font-medium">
                              {service.name}
                            </div>
                            <div className="text-gray-400 text-sm">
                              {service.desc}
                            </div>
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm hover:bg-gray-600">
                          Connect
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-8 mt-8">
                  <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-red-400 mb-2">
                      Danger Zone
                    </h3>
                    <p className="text-gray-400 mb-4">
                      Irreversible actions for your account
                    </p>
                    <div className="mb-4">
                      <div className="text-white font-medium mb-1">
                        Delete Account
                      </div>
                      <div className="text-gray-400 text-sm mb-3">
                        Once you delete your account, there is no going back.
                        All your data will be permanently removed
                      </div>
                      <button className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "appearance" && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Appearance
                </h2>
                <p className="text-gray-400 mb-8">
                  Customize how Quizzy looks for you
                </p>

                <div className="space-y-8 max-w-3xl">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Theme
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <button className="p-6 bg-gray-900 rounded-xl border-2 border-purple-500 hover:border-purple-400 transition-colors">
                        <Moon
                          className="mx-auto mb-3 text-purple-400"
                          size={32}
                        />
                        <div className="text-white font-medium mb-2">Dark</div>
                        <div className="h-16 bg-gray-800 rounded-lg mb-2 flex items-center px-3">
                          <div className="w-8 h-1.5 bg-purple-500 rounded mr-2"></div>
                          <div className="w-12 h-1.5 bg-gray-700 rounded"></div>
                        </div>
                        <Check className="mx-auto text-purple-500" size={20} />
                      </button>
                      <button className="p-6 bg-gray-900 rounded-xl border-2 border-gray-700 hover:border-purple-500 transition-colors">
                        <Sun className="mx-auto mb-3 text-gray-400" size={32} />
                        <div className="text-white font-medium mb-2">Light</div>
                        <div className="h-16 bg-white rounded-lg mb-2 flex items-center px-3">
                          <div className="w-8 h-1.5 bg-purple-500 rounded mr-2"></div>
                          <div className="w-12 h-1.5 bg-gray-300 rounded"></div>
                        </div>
                      </button>
                      <button className="p-6 bg-gray-900 rounded-xl border-2 border-gray-700 hover:border-purple-500 transition-colors">
                        <Monitor
                          className="mx-auto mb-3 text-gray-400"
                          size={32}
                        />
                        <div className="text-white font-medium mb-2">
                          System
                        </div>
                        <div className="h-16 bg-gradient-to-r from-gray-800 to-white rounded-lg mb-2"></div>
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Accent Color
                    </h3>
                    <div className="flex gap-4">
                      {[
                        { name: "Purple", color: "bg-purple-500" },
                        { name: "Blue", color: "bg-blue-500" },
                        { name: "Green", color: "bg-green-500" },
                        { name: "Red", color: "bg-red-500" },
                        { name: "Amber", color: "bg-amber-500" },
                        { name: "Pink", color: "bg-pink-500" },
                      ].map((item, i) => (
                        <button
                          key={i}
                          className="flex flex-col items-center gap-2"
                        >
                          <div
                            className={`w-16 h-16 ${item.color} rounded-full ${
                              i === 0 ? "ring-4 ring-purple-500/50" : ""
                            }`}
                          ></div>
                          <span className="text-gray-400 text-sm">
                            {item.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:opacity-90">
                    Save Preferences
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-gray-400 text-sm">
            <AlertCircle size={16} />
            <span>Need help with your account settings?</span>
            <button className="text-purple-400 hover:text-purple-300 font-medium">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
