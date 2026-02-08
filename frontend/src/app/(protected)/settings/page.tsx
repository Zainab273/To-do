'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('account');
  
  // Preferences state
  const [darkMode, setDarkMode] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [compactView, setCompactView] = useState(false);
  
  // Notifications state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [taskReminders, setTaskReminders] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(false);
  
  // Password modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const tabs = [
    { id: 'account', name: 'Account', icon: '👤' },
    { id: 'preferences', name: 'Preferences', icon: '⚙️' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'security', name: 'Security', icon: '🔒' },
  ];

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('All fields are required');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    // Simulate password change (replace with actual API call)
    setTimeout(() => {
      setPasswordSuccess(true);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess(false);
      }, 2000);
    }, 1000);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/signin');
  };

  return (
    <div className="min-h-screen bg-[#011425] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3 tracking-tight">
            <span className="bg-gradient-to-r from-[#5C7C89] to-[#1F4959] bg-clip-text text-transparent">
              Settings
            </span>
          </h1>
          <p className="text-lg text-white/70">
            Manage your account settings and preferences
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-[#1F4959]/50 backdrop-blur-xl border border-[#5C7C89]/20 rounded-2xl p-4 space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-[#5C7C89] to-[#1F4959] text-white shadow-lg'
                      : 'text-white/70 hover:bg-[#242424]/50 hover:text-white'
                  }`}
                >
                  <span className="text-xl">{tab.icon}</span>
                  <span className="font-medium">{tab.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-[#1F4959]/50 backdrop-blur-xl border border-[#5C7C89]/20 rounded-2xl p-8">
              {activeTab === 'account' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Account Information</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Email Address</label>
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="w-full px-4 py-3 bg-[#242424]/50 border border-[#5C7C89]/30 rounded-xl text-white/50 cursor-not-allowed"
                      />
                      <p className="text-xs text-white/50 mt-1">Email cannot be changed</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Username</label>
                      <input
                        type="text"
                        value={user?.email?.split('@')[0] || ''}
                        disabled
                        className="w-full px-4 py-3 bg-[#242424]/50 border border-[#5C7C89]/30 rounded-xl text-white/50 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Account Status</label>
                      <div className="flex items-center gap-2 px-4 py-3 bg-green-500/10 border border-green-500/30 rounded-xl">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-green-400 font-medium">Active</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Member Since</label>
                      <input
                        type="text"
                        value={new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        disabled
                        className="w-full px-4 py-3 bg-[#242424]/50 border border-[#5C7C89]/30 rounded-xl text-white/50 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#5C7C89]/20">
                    <button
                      onClick={handleSignOut}
                      className="px-6 py-3 bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/30 transition-all duration-200 font-medium"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Preferences</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-[#242424]/50 border border-[#5C7C89]/20 rounded-xl">
                      <div>
                        <p className="text-white font-medium">Dark Mode</p>
                        <p className="text-sm text-white/60">Use dark theme across the app</p>
                      </div>
                      <button
                        onClick={() => setDarkMode(!darkMode)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          darkMode ? 'bg-[#5C7C89]' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            darkMode ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-[#242424]/50 border border-[#5C7C89]/20 rounded-xl">
                      <div>
                        <p className="text-white font-medium">Auto-save</p>
                        <p className="text-sm text-white/60">Automatically save changes</p>
                      </div>
                      <button
                        onClick={() => setAutoSave(!autoSave)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          autoSave ? 'bg-[#5C7C89]' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            autoSave ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-[#242424]/50 border border-[#5C7C89]/20 rounded-xl">
                      <div>
                        <p className="text-white font-medium">Compact View</p>
                        <p className="text-sm text-white/60">Show more tasks in less space</p>
                      </div>
                      <button
                        onClick={() => setCompactView(!compactView)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          compactView ? 'bg-[#5C7C89]' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            compactView ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="pt-4">
                    <p className="text-sm text-white/50">
                      ✓ Changes are saved automatically
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Notification Settings</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-[#242424]/50 border border-[#5C7C89]/20 rounded-xl">
                      <div>
                        <p className="text-white font-medium">Email Notifications</p>
                        <p className="text-sm text-white/60">Receive updates via email</p>
                      </div>
                      <button
                        onClick={() => setEmailNotifications(!emailNotifications)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          emailNotifications ? 'bg-[#5C7C89]' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            emailNotifications ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-[#242424]/50 border border-[#5C7C89]/20 rounded-xl">
                      <div>
                        <p className="text-white font-medium">Task Reminders</p>
                        <p className="text-sm text-white/60">Get reminded about pending tasks</p>
                      </div>
                      <button
                        onClick={() => setTaskReminders(!taskReminders)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          taskReminders ? 'bg-[#5C7C89]' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            taskReminders ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-[#242424]/50 border border-[#5C7C89]/20 rounded-xl">
                      <div>
                        <p className="text-white font-medium">Weekly Summary</p>
                        <p className="text-sm text-white/60">Receive weekly progress reports</p>
                      </div>
                      <button
                        onClick={() => setWeeklySummary(!weeklySummary)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          weeklySummary ? 'bg-[#5C7C89]' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            weeklySummary ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="pt-4">
                    <p className="text-sm text-white/50">
                      ✓ Notification preferences saved
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Security Settings</h2>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-[#242424]/50 border border-[#5C7C89]/20 rounded-xl">
                      <p className="text-white font-medium mb-2">Password</p>
                      <p className="text-sm text-white/60 mb-4">Last changed 30 days ago</p>
                      <button
                        onClick={() => setShowPasswordModal(true)}
                        className="px-4 py-2 bg-gradient-to-r from-[#5C7C89] to-[#1F4959] text-white rounded-lg hover:from-[#5C7C89]/90 hover:to-[#1F4959]/90 transition-all duration-200 font-medium"
                      >
                        Change Password
                      </button>
                    </div>

                    <div className="p-4 bg-[#242424]/50 border border-[#5C7C89]/20 rounded-xl">
                      <p className="text-white font-medium mb-2">Two-Factor Authentication</p>
                      <p className="text-sm text-white/60 mb-4">Add an extra layer of security</p>
                      <button className="px-4 py-2 bg-[#5C7C89]/20 border border-[#5C7C89]/30 text-[#5C7C89] rounded-lg hover:bg-[#5C7C89]/30 transition-all duration-200 font-medium">
                        Enable 2FA
                      </button>
                    </div>

                    <div className="p-4 bg-[#242424]/50 border border-[#5C7C89]/20 rounded-xl">
                      <p className="text-white font-medium mb-2">Active Sessions</p>
                      <p className="text-sm text-white/60 mb-4">Manage your active sessions</p>
                      <div className="flex items-center gap-2 text-sm text-white/70">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Current session - {new Date().toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1F4959] border border-[#5C7C89]/30 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6">Change Password</h3>
            
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  className="w-full px-4 py-3 bg-[#242424]/50 border border-[#5C7C89]/30 rounded-xl text-white placeholder-white/40 focus:ring-2 focus:ring-[#5C7C89] focus:border-transparent"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="w-full px-4 py-3 bg-[#242424]/50 border border-[#5C7C89]/30 rounded-xl text-white placeholder-white/40 focus:ring-2 focus:ring-[#5C7C89] focus:border-transparent"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  className="w-full px-4 py-3 bg-[#242424]/50 border border-[#5C7C89]/30 rounded-xl text-white placeholder-white/40 focus:ring-2 focus:ring-[#5C7C89] focus:border-transparent"
                  placeholder="Confirm new password"
                />
              </div>

              {passwordError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                  {passwordError}
                </div>
              )}

              {passwordSuccess && (
                <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm">
                  ✓ Password changed successfully!
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-[#5C7C89] to-[#1F4959] text-white rounded-xl hover:from-[#5C7C89]/90 hover:to-[#1F4959]/90 transition-all duration-200 font-medium"
                >
                  Change Password
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordError('');
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                  className="flex-1 px-4 py-3 bg-[#242424]/50 border border-[#5C7C89]/30 text-white rounded-xl hover:bg-[#242424]/70 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
