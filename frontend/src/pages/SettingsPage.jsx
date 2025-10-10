import React, { useState } from 'react';
import { Check, X, AlertCircle, Moon, Sun, Monitor, Globe } from 'lucide-react';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">Manage your account settings and preferences</p>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700">
          <div className="flex gap-1 p-2 border-b border-gray-700">
            <button onClick={() => setActiveTab('profile')} className={`px-6 py-3 rounded-lg font-medium transition-colors ${activeTab === 'profile' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}>Profile</button>
            <button onClick={() => setActiveTab('account')} className={`px-6 py-3 rounded-lg font-medium transition-colors ${activeTab === 'account' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}>Account</button>
            <button onClick={() => setActiveTab('notifications')} className={`px-6 py-3 rounded-lg font-medium transition-colors ${activeTab === 'notifications' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}>Notifications</button>
            <button onClick={() => setActiveTab('appearance')} className={`px-6 py-3 rounded-lg font-medium transition-colors ${activeTab === 'appearance' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}>Appearance</button>
            <button onClick={() => setActiveTab('privacy')} className={`px-6 py-3 rounded-lg font-medium transition-colors ${activeTab === 'privacy' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}>Privacy</button>
            <button onClick={() => setActiveTab('billing')} className={`px-6 py-3 rounded-lg font-medium transition-colors ${activeTab === 'billing' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}>Billing</button>
          </div>

          <div className="p-8">
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Profile Information</h2>
                <p className="text-gray-400 mb-8">Update your profile information and public details</p>

                <div className="flex items-start gap-8 mb-8">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mb-4"></div>
                    <button className="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm hover:bg-gray-600 flex items-center gap-2 mx-auto">
                      Change Photo
                    </button>
                  </div>

                  <div className="flex-1 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                        <input type="text" defaultValue="John" className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                        <input type="text" defaultValue="Doe" className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                      <input type="email" defaultValue="johndoe@gmail.com" className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                      <input type="text" defaultValue="Teacher" className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                      <textarea rows="3" defaultValue="Science teacher with 10+ years of experience. Passionate about making learning fun and engaging through interactive quizzes" className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"></textarea>
                    </div>
                  </div>
                </div>

                <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:opacity-90">
                  Save Changes
                </button>
              </div>
            )}

            {activeTab === 'account' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Account Security</h2>
                <p className="text-gray-400 mb-8">Update your password and security settings</p>

                <div className="space-y-6 max-w-2xl mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
                    <input type="password" className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                    <input type="password" className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
                    <input type="password" className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none" />
                  </div>
                  <button className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700">
                    Update Password
                  </button>
                </div>

                <div className="border-t border-gray-700 pt-8 mb-8">
                  <h3 className="text-xl font-bold text-white mb-2">Two-Factor Authentication</h3>
                  <p className="text-gray-400 mb-4">Add an extra layer of security to your account</p>
                  <div className="flex items-center justify-between max-w-2xl p-4 bg-gray-900 rounded-lg border border-gray-700">
                    <div>
                      <div className="text-white font-medium mb-1">Enable Two-Factor Authentication</div>
                      <div className="text-gray-400 text-sm">Receive a verification code via email or authenticator app</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-8">
                  <h3 className="text-xl font-bold text-white mb-2">Connected Accounts</h3>
                  <p className="text-gray-400 mb-4">Connect your account to other services</p>
                  <div className="space-y-3 max-w-2xl">
                    {[
                      { name: 'Google', desc: 'Connect your Google account' },
                      { name: 'Facebook', desc: 'Connect your Facebook account' },
                      { name: 'X', desc: 'Connect your X account' }
                    ].map((service, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-gray-900 rounded-lg border border-gray-700">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                            <Globe size={20} className="text-gray-400" />
                          </div>
                          <div>
                            <div className="text-white font-medium">{service.name}</div>
                            <div className="text-gray-400 text-sm">{service.desc}</div>
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
                    <h3 className="text-xl font-bold text-red-400 mb-2">Danger Zone</h3>
                    <p className="text-gray-400 mb-4">Irreversible actions for your account</p>
                    <div className="mb-4">
                      <div className="text-white font-medium mb-1">Delete Account</div>
                      <div className="text-gray-400 text-sm mb-3">Once you delete your account, there is no going back. All your data will be permanently removed</div>
                      <button className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Appearance</h2>
                <p className="text-gray-400 mb-8">Customize how Quizzy looks for you</p>

                <div className="space-y-8 max-w-3xl">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Theme</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <button className="p-6 bg-gray-900 rounded-xl border-2 border-purple-500 hover:border-purple-400 transition-colors">
                        <Moon className="mx-auto mb-3 text-purple-400" size={32} />
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
                        <Monitor className="mx-auto mb-3 text-gray-400" size={32} />
                        <div className="text-white font-medium mb-2">System</div>
                        <div className="h-16 bg-gradient-to-r from-gray-800 to-white rounded-lg mb-2"></div>
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Accent Color</h3>
                    <div className="flex gap-4">
                      {[
                        { name: 'Purple', color: 'bg-purple-500' },
                        { name: 'Blue', color: 'bg-blue-500' },
                        { name: 'Green', color: 'bg-green-500' },
                        { name: 'Red', color: 'bg-red-500' },
                        { name: 'Amber', color: 'bg-amber-500' },
                        { name: 'Pink', color: 'bg-pink-500' }
                      ].map((item, i) => (
                        <button key={i} className="flex flex-col items-center gap-2">
                          <div className={`w-16 h-16 ${item.color} rounded-full ${i === 0 ? 'ring-4 ring-purple-500/50' : ''}`}></div>
                          <span className="text-gray-400 text-sm">{item.name}</span>
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

            {activeTab === 'billing' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Subscription Plan</h2>
                <p className="text-gray-400 mb-8">Manage your subscription and billing details</p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                  <div className="lg:col-span-2 bg-gray-900 rounded-xl p-6 border-2 border-purple-500">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-1">Pro Plan</h3>
                        <p className="text-gray-400">Your subscription renews on June 15, 2025</p>
                      </div>
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">Active</span>
                    </div>
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between py-2">
                        <span className="text-gray-400">Price</span>
                        <span className="text-white font-semibold">$9.99 / month</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-400">Billing Cycle</span>
                        <span className="text-white font-semibold">Monthly</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-400">Payment Method</span>
                        <span className="text-white font-semibold">•••• •••• •••• 4242</span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button className="px-6 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 border border-gray-700">
                        Change Plan
                      </button>
                      <button className="px-6 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 border border-gray-700">
                        Update Payment
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
                    <h3 className="text-xl font-bold text-white mb-4">Billing History</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-white font-medium">May 16, 2025</div>
                          <div className="text-gray-400 text-sm">$9.99</div>
                        </div>
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-medium">Paid</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-white font-medium">May 16, 2025</div>
                          <div className="text-gray-400 text-sm">$9.99</div>
                        </div>
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-medium">Paid</span>
                      </div>
                    </div>
                    <button className="w-full mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg text-sm hover:bg-gray-700 border border-gray-700">
                      View All Invoices
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-6">Plan Comparison</h3>
                  <p className="text-gray-400 mb-6">Compare available subscription plans</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
                      <h4 className="text-xl font-bold text-white mb-2">Free</h4>
                      <div className="text-4xl font-bold text-white mb-6">$0</div>
                      <ul className="space-y-3 mb-6">
                        <li className="flex items-center gap-2 text-gray-300">
                          <Check size={18} className="text-green-400" />
                          <span>5 Quizzes</span>
                        </li>
                        <li className="flex items-center gap-2 text-gray-300">
                          <Check size={18} className="text-green-400" />
                          <span>Basic Analytics</span>
                        </li>
                        <li className="flex items-center gap-2 text-gray-300">
                          <Check size={18} className="text-green-400" />
                          <span>50 Student Limit</span>
                        </li>
                        <li className="flex items-center gap-2 text-gray-500">
                          <X size={18} />
                          <span>Custom Branding</span>
                        </li>
                        <li className="flex items-center gap-2 text-gray-500">
                          <X size={18} />
                          <span>Advanced Question Types</span>
                        </li>
                      </ul>
                      <button className="w-full px-6 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 border border-gray-700">
                        Current Plan
                      </button>
                    </div>

                    <div className="bg-gray-900 rounded-xl p-6 border-2 border-purple-500 relative">
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-purple-600 text-white rounded-full text-xs font-medium">Popular</span>
                      <h4 className="text-xl font-bold text-white mb-2">Pro</h4>
                      <div className="text-4xl font-bold text-white mb-1">$9.99<span className="text-lg text-gray-400">/mo</span></div>
                      <ul className="space-y-3 mb-6 mt-6">
                        <li className="flex items-center gap-2 text-gray-300">
                          <Check size={18} className="text-green-400" />
                          <span>Unlimited Quizzes</span>
                        </li>
                        <li className="flex items-center gap-2 text-gray-300">
                          <Check size={18} className="text-green-400" />
                          <span>Advanced Analytics</span>
                        </li>
                        <li className="flex items-center gap-2 text-gray-300">
                          <Check size={18} className="text-green-400" />
                          <span>500 Student Limit</span>
                        </li>
                        <li className="flex items-center gap-2 text-gray-300">
                          <Check size={18} className="text-green-400" />
                          <span>Custom Branding</span>
                        </li>
                        <li className="flex items-center gap-2 text-gray-300">
                          <Check size={18} className="text-green-400" />
                          <span>Advanced Question Types</span>
                        </li>
                      </ul>
                      <button className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:opacity-90">
                        Upgrade
                      </button>
                    </div>

                    <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
                      <h4 className="text-xl font-bold text-white mb-2">Enterprise</h4>
                      <div className="text-4xl font-bold text-white mb-1">$12.99<span className="text-lg text-gray-400">/mo</span></div>
                      <ul className="space-y-3 mb-6 mt-6">
                        <li className="flex items-center gap-2 text-gray-300">
                          <Check size={18} className="text-green-400" />
                          <span>Everything in Pro</span>
                        </li>
                        <li className="flex items-center gap-2 text-gray-300">
                          <Check size={18} className="text-green-400" />
                          <span>Unlimited Access</span>
                        </li>
                        <li className="flex items-center gap-2 text-gray-300">
                          <Check size={18} className="text-green-400" />
                          <span>API Access</span>
                        </li>
                        <li className="flex items-center gap-2 text-gray-300">
                          <Check size={18} className="text-green-400" />
                          <span>Dedicated Support</span>
                        </li>
                        <li className="flex items-center gap-2 text-gray-300">
                          <Check size={18} className="text-green-400" />
                          <span>Custom Integrations</span>
                        </li>
                      </ul>
                      <button className="w-full px-6 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 border border-gray-700">
                        Contact Sales
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-gray-400 text-sm">
            <AlertCircle size={16} />
            <span>Need help with your account settings?</span>
            <button className="text-purple-400 hover:text-purple-300 font-medium">Contact Support</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
