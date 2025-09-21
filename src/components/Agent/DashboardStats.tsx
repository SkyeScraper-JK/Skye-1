import React, { useState, useEffect } from 'react';
import { Building, Package, TrendingUp, Users, Bell, Star } from 'lucide-react';

interface Stats {
  total_projects: number;
  available_units: number;
  my_leads: number;
  active_bookings: number;
  notifications: number;
}

const DashboardStats = () => {
  const [stats, setStats] = useState<Stats>({
    total_projects: 0,
    available_units: 0,
    my_leads: 0,
    active_bookings: 0,
    notifications: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await fetch('/api/agent/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Available Projects',
      value: stats.total_projects,
      icon: Building,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Available Units',
      value: stats.available_units,
      icon: Package,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'My Leads',
      value: stats.my_leads,
      icon: Users,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Active Bookings',
      value: stats.active_bookings,
      icon: TrendingUp,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    }
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back! 👋</h2>
        <p className="text-gray-600">Here's what's happening with your property business today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</div>
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
            </div>
          );
        })}
      </div>

      {/* Quick Actions & Latest Updates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">🚀 Quick Actions</h2>
          
          <div className="space-y-4">
            <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center group-hover:bg-green-100 transition-colors">
                  <Package className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Browse Inventory</h3>
                  <p className="text-sm text-gray-600">Find units for your clients</p>
                </div>
              </div>
            </button>

            <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Add New Lead</h3>
                  <p className="text-sm text-gray-600">Register potential buyer</p>
                </div>
              </div>
            </button>

            <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Book Unit</h3>
                  <p className="text-sm text-gray-600">Complete a booking</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Latest Updates */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Latest Updates
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Building className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">New inventory from Azure Developers</p>
                <p className="text-sm text-gray-600">Sky Tower Bay Square: 120 units updated with latest pricing</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>

            <div className="text-center py-4">
              <p className="text-gray-500 text-sm">Stay updated with new inventory releases!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">📈 Performance Overview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600 mb-2">0</div>
            <p className="text-sm text-gray-600">Deals Closed This Month</p>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600 mb-2">{stats.my_leads}</div>
            <p className="text-sm text-gray-600">Active Leads</p>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              <Star className="w-8 h-8 inline" />
            </div>
            <p className="text-sm text-gray-600">Performance Rating</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;