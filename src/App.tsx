import React, { useState } from 'react';
import { Building, Package, TrendingUp, Users, Upload, BarChart3, Search, MapPin, Calendar, DollarSign, Eye, Maximize } from 'lucide-react';
import './App.css';

// Mock data for demonstration
const mockStats = {
  developer: {
    total_projects: 3,
    total_units: 245,
    available_units: 180,
    sold_units: 65
  },
  agent: {
    total_projects: 8,
    available_units: 420,
    my_leads: 12,
    active_bookings: 3
  }
};

const mockUnits = [
  {
    id: 1,
    unit_number: "A-1205",
    category: "2BR",
    area: 1250,
    current_price: 1850000,
    project_name: "Sky Tower Bay Square",
    project_location: "Business Bay, Dubai",
    handover_date: "Q4 2024",
    view_description: "Marina and City View",
    floor: 12
  },
  {
    id: 2,
    unit_number: "B-0803",
    category: "1BR",
    area: 850,
    current_price: 1200000,
    project_name: "Azure Heights",
    project_location: "Downtown Dubai",
    handover_date: "Q2 2025",
    view_description: "Burj Khalifa View",
    floor: 8
  },
  {
    id: 3,
    unit_number: "C-1501",
    category: "3BR",
    area: 1800,
    current_price: 2750000,
    project_name: "Marina Pearl",
    project_location: "Dubai Marina",
    handover_date: "Q1 2025",
    view_description: "Full Marina View",
    floor: 15
  }
];

function App() {
  const [currentRole, setCurrentRole] = useState<'DEVELOPER' | 'AGENT'>('AGENT');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatArea = (area: number) => {
    return `${area.toLocaleString()} sq ft`;
  };

  const DeveloperDashboard = () => (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">📊 Developer Dashboard</h1>
        <p className="text-gray-600">Overview of your property portfolio and recent activity</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Building className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{mockStats.developer.total_projects}</div>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Total Projects</h3>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{mockStats.developer.total_units}</div>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Total Units</h3>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{mockStats.developer.available_units}</div>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Available Units</h3>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{mockStats.developer.sold_units}</div>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Sold Units</h3>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">🚀 Quick Actions</h2>
          
          <div className="space-y-4">
            <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <Upload className="w-6 h-6 text-blue-600" />
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

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">📈 Performance Metrics</h2>
          
          <div className="space-y-6">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {Math.round((mockStats.developer.sold_units / mockStats.developer.total_units) * 100)}%
              </div>
              <p className="text-sm text-gray-600">Sales Rate</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {mockStats.developer.total_projects}
              </div>
              <p className="text-sm text-gray-600">Active Projects</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const AgentDashboard = () => (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back! 👋</h2>
        <p className="text-gray-600">Here's what's happening with your property business today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Building className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{mockStats.agent.total_projects}</div>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Available Projects</h3>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{mockStats.agent.available_units}</div>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Available Units</h3>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{mockStats.agent.my_leads}</div>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600">My Leads</h3>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{mockStats.agent.active_bookings}</div>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Active Bookings</h3>
        </div>
      </div>

      {/* Available Inventory */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">
              🔍 Available Inventory ({mockUnits.length} Units)
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Search className="w-4 h-4" />
              Updated live
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {mockUnits.map((unit) => (
            <div key={unit.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h4 className="text-lg font-semibold text-gray-900">
                      Unit {unit.unit_number}
                    </h4>
                    <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      {unit.category}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <div>
                        <div className="font-medium text-gray-900">{unit.project_name}</div>
                        <div>{unit.project_location}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Maximize className="w-4 h-4" />
                      <div>
                        <div className="font-medium text-gray-900">{formatArea(unit.area)}</div>
                        <div>Floor {unit.floor}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <DollarSign className="w-4 h-4" />
                      <div>
                        <div className="font-medium text-gray-900">{formatPrice(unit.current_price)}</div>
                        <div>{formatPrice(unit.current_price / unit.area)} per sq ft</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <div>
                        <div className="font-medium text-gray-900">Handover</div>
                        <div>{unit.handover_date}</div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">
                    <strong>View:</strong> {unit.view_description}
                  </p>
                </div>
                
                <div className="flex flex-col gap-2 ml-6">
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Book Unit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation with Role Switcher */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">🏢 Property Hub</h1>
              <p className="text-sm text-gray-500">Multi-Role Real Estate Platform</p>
            </div>
          </div>
          
          {/* Role Switcher */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setCurrentRole('AGENT')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentRole === 'AGENT'
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🏢 Agent View
            </button>
            <button
              onClick={() => setCurrentRole('DEVELOPER')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentRole === 'DEVELOPER'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              👨‍💼 Developer View
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {currentRole === 'DEVELOPER' ? <DeveloperDashboard /> : <AgentDashboard />}
      </div>
    </div>
  );
}

export default App;