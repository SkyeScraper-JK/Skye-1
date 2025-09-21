import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { socketService } from '../../services/socketService';
import InventoryBrowser from './InventoryBrowser';
import DashboardStats from './DashboardStats';
import NotificationCenter from './NotificationCenter';
import { 
  Home, 
  Search, 
  BarChart3, 
  Settings, 
  LogOut, 
  User,
  Bell
} from 'lucide-react';

const AgentDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user, logout, token } = useAuth();

  useEffect(() => {
    if (token && user) {
      socketService.connect(token, user.id);
    }

    return () => {
      socketService.disconnect();
    };
  }, [token, user]);

  const menuItems = [
    { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
    { id: 'inventory', icon: Search, label: 'Browse Inventory' },
    { id: 'leads', icon: Home, label: 'My Leads' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardStats />;
      case 'inventory':
        return <InventoryBrowser />;
      case 'leads':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Leads</h2>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600">Leads management coming soon...</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600">Settings panel coming soon...</p>
            </div>
          </div>
        );
      default:
        return <DashboardStats />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        {/* Logo & User Info */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Home className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Property Hub</h1>
              <p className="text-sm text-gray-500">Agent Portal</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                      activeTab === item.id
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Bar with Notifications */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 capitalize">
              {activeTab === 'dashboard' ? '📊 Dashboard' : 
               activeTab === 'inventory' ? '🔍 Browse Inventory' : 
               activeTab === 'leads' ? '👥 My Leads' : 
               '⚙️ Settings'}
            </h1>
          </div>
          <NotificationCenter />
        </div>
        
        {renderContent()}
      </div>
    </div>
  );
};

export default AgentDashboard;