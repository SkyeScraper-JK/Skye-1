import React, { useState, useEffect } from 'react';
import { Building, Package, TrendingUp, Clock, Users, DollarSign } from 'lucide-react';

interface Stats {
  total_projects: number;
  total_units: number;
  available_units: number;
  sold_units: number;
  recent_uploads: number;
}

const DashboardStats = () => {
  const [stats, setStats] = useState<Stats>({
    total_projects: 0,
    total_units: 0,
    available_units: 0,
    sold_units: 0,
    recent_uploads: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await fetch('/api/developer/dashboard/stats', {
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
      title: 'Total Projects',
      value: stats.total_projects,
      icon: Building,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Total Units',
      value: stats.total_units,
      icon: Package,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Available Units',
      value: stats.available_units,
      icon: TrendingUp,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Sold Units',
      value: stats.sold_units,
      icon: DollarSign,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    }
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6 w-48"></div>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">📊 Developer Dashboard</h1>
        <p className="text-gray-600">Overview of your property portfolio and recent activity</p>
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

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Activity
          </h2>
          
          <div className="space-y-4">
            {stats.recent_uploads > 0 ? (
              <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-100">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Inventory Updated</p>
                  <p className="text-sm text-gray-600">{stats.recent_uploads} files processed recently</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No recent activity</p>
                <p className="text-sm text-gray-400">Your recent uploads and updates will appear here</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">🚀 Quick Actions</h2>
          
          <div className="space-y-4">
            <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Upload New Inventory</h3>
                  <p className="text-sm text-gray-600">Add new units and pricing data</p>
                </div>
              </div>
            </button>

            <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                  <Building className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Manage Projects</h3>
                  <p className="text-sm text-gray-600">View and edit your projects</p>
                </div>
              </div>
            </button>

            <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center group-hover:bg-green-100 transition-colors">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Agent Network</h3>
                  <p className="text-sm text-gray-600">View connected agents</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">📈 Performance Metrics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {stats.available_units > 0 ? Math.round((stats.sold_units / stats.total_units) * 100) : 0}%
            </div>
            <p className="text-sm text-gray-600">Sales Rate</p>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {stats.total_projects}
            </div>
            <p className="text-sm text-gray-600">Active Projects</p>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {stats.available_units}
            </div>
            <p className="text-sm text-gray-600">Units Available</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;