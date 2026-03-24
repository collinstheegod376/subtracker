"use client";
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useState } from 'react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('account');

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-4 lg:p-10 pb-24">
        <h2 className="text-3xl lg:text-4xl font-extrabold font-headline tracking-tight text-primary mb-8">Settings</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4">
            <div className="flex flex-row md:flex-col gap-2 overflow-x-auto no-scrollbar">
              {[
                { id: 'account', label: 'User Account', icon: 'person' },
                { id: 'preferences', label: 'Preferences', icon: 'tune' },
                { id: 'notifications', label: 'Notifications', icon: 'notifications' },
                { id: 'billing', label: 'Billing & Plan', icon: 'credit_card' },
                { id: 'security', label: 'Security', icon: 'lock' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm whitespace-nowrap md:whitespace-normal ${
                    activeTab === tab.id 
                      ? 'bg-primary-container text-on-primary-container shadow-sm' 
                      : 'text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  <span className="material-symbols-outlined">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-8 space-y-8">
            {activeTab === 'account' && (
              <div className="bg-surface-container-lowest p-6 lg:p-8 rounded-2xl shadow-sm space-y-6">
                <h3 className="font-headline font-bold text-xl text-primary border-b border-surface-variant pb-4">Account Information</h3>
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-surface-container-high overflow-hidden">
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwejpdhXmAqGo4DBJspfcNGlL1wxZ4nmOCLI_1FQXCWwm62Sb4kc-xR9ZKd89Hu23MPiRoEBR3inZspe23jrakP_kNwUdaDHWNPi9eJVi3a29CPv0E3ylQAxopJ0kP2J8bAiTZJuOEAJhW8CFFDScx0pI-NFC-cLBXuuFfMufKIJv29N90PwN7aNKHvChy9DambaO6I41fFLpwlUodqI6Rq8OFETC-BDR90fXRkGhboM7yhrAgcOv4P0hwlpVMNXBWL5BTDKL7Au-p" alt="avatar" />
                  </div>
                  <button className="px-4 py-2 bg-surface-container-high hover:bg-surface-variant rounded-full text-sm font-bold transition-colors">Change Avatar</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-on-surface-variant mb-2 uppercase">First Name</label>
                    <input type="text" defaultValue="Alex" className="w-full bg-surface-container-highest rounded-xl px-4 py-3 border-none focus:ring-2 focus:ring-surface-tint outline-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-on-surface-variant mb-2 uppercase">Last Name</label>
                    <input type="text" defaultValue="Rivera" className="w-full bg-surface-container-highest rounded-xl px-4 py-3 border-none focus:ring-2 focus:ring-surface-tint outline-none text-sm" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-on-surface-variant mb-2 uppercase">Email Address</label>
                    <input type="email" defaultValue="alex.rivera@example.com" className="w-full bg-surface-container-highest rounded-xl px-4 py-3 border-none focus:ring-2 focus:ring-surface-tint outline-none text-sm" />
                  </div>
                </div>
                <div className="pt-4 flex justify-end">
                  <button className="px-6 py-2.5 bg-primary text-on-primary font-bold rounded-full hover:opacity-90 transition-opacity text-sm shadow-md">Save Changes</button>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="bg-surface-container-lowest p-6 lg:p-8 rounded-2xl shadow-sm space-y-6">
                <h3 className="font-headline font-bold text-xl text-primary border-b border-surface-variant pb-4">Display & Preferences</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2">
                    <div>
                      <h4 className="font-bold text-primary">Dark Mode</h4>
                      <p className="text-xs text-on-surface-variant">Toggle dark theme across the application</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <div>
                      <h4 className="font-bold text-primary">Compact View</h4>
                      <p className="text-xs text-on-surface-variant">Reduce padding in lists and grids</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-on-surface-variant mb-2 uppercase mt-4">Default Currency</label>
                    <select className="w-full bg-surface-container-highest rounded-xl px-4 py-3 border-none focus:ring-2 focus:ring-surface-tint outline-none text-sm cursor-pointer">
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                      <option>GBP (£)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="bg-surface-container-lowest p-6 lg:p-8 rounded-2xl shadow-sm space-y-6">
                <h3 className="font-headline font-bold text-xl text-primary border-b border-surface-variant pb-4">Notification Alerts</h3>
                <div className="space-y-4">
                  {[
                    { title: 'Upcoming Renewals', desc: 'Get notified 3 days before a subscription renews' },
                    { title: 'Price Changes', desc: 'Alert me when a subscription price increases' },
                    { title: 'Weekly Summary', desc: 'Receive a brief recap every Sunday' },
                    { title: 'Dormant Warning', desc: 'Alert me if I havent used a service in 30 days' }
                  ].map((notif, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-surface-container-low last:border-0 last:pb-0">
                      <div>
                        <h4 className="font-bold text-primary text-sm">{notif.title}</h4>
                        <p className="text-xs text-on-surface-variant">{notif.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4">
                        <input type="checkbox" className="sr-only peer" defaultChecked={i < 2} />
                        <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
