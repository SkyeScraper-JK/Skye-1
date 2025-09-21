import React, { useState } from 'react';
import { Building2, Users, BarChart3, Upload, Search, Settings, LogOut, User, Bell, Package, TrendingUp, Clock, DollarSign, Eye, MapPin, Maximize, Calendar, Filter, CheckCircle, AlertTriangle, FileText, Trash2, RefreshCw, X } from 'lucide-react';

// Simple role switcher without complex authentication
const App = () => {
  const [currentRole, setCurrentRole] = useState<'AGENT' | 'DEVELOPER'>('AGENT');
  const [activeTab, setActiveTab] = useState('dashboard');

  // Mock user data
  const mockUser = {
    AGENT: { first_name: 'Sarah', last_name: 'Agent', email: 'agent@example.com' },
    DEVELOPER: { first_name: 'John', last_name: 'Developer', email: 'developer@example.com' }
  };

  const user = mockUser[currentRole];

  // Agent Dashboard Component
  const AgentDashboard = () => {
    const [notifications, setNotifications] = useState([
      {
        id: 1,
        type: 'INVENTORY_UPDATE',
        title: 'New inventory from Azure Developers',
        message: 'Sky Tower Bay Square: 120 units updated with latest pricing',
        is_read: false,
        created_at: new Date().toISOString()
      }
    ]);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);

    const mockStats = {
      total_projects: 15,
      available_units: 1250,
      my_leads: 8,
      active_bookings: 3
    };

    const mockUnits = [
      {
        id: 1,
        unit_number: '1205',
        category: '2BR',
        area: 1200,
        current_price: 2500000,
        project_name: 'Sky Tower Bay Square',
        project_location: 'Business Bay, Dubai',
        handover_date: 'Q4 2025',
        view_description: 'Burj Khalifa and Canal View',
        floor: 12
      },
      {
        id: 2,
        unit_number: '0804',
        category: '1BR',
        area: 850,
        current_price: 1800000,
        project_name: 'Marina Heights',
        project_location: 'Dubai Marina',
        handover_date: 'Q2 2026',
        view_description: 'Marina and Sea View',
        floor: 8
      }
    ];

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

    const NotificationCenter = () => (
      <div className="relative">
        <button 
          onClick={() => setIsNotificationOpen(!isNotificationOpen)}
          className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            1
          </span>
        </button>
        
        {isNotificationOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsNotificationOpen(false)} />
            <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-20">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                <button onClick={() => setIsNotificationOpen(false)} className="p-1 text-gray-400 hover:text-gray-600 rounded">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map(notification => (
                  <div key={notification.id} className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer bg-blue-50">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2 mt-1"></div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    );

    const renderAgentContent = () => {
      switch (activeTab) {
        case 'dashboard':
          return (
            <div className="p-6">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back! 👋</h2>
                <p className="text-gray-600">Here's what's happening with your property business today.</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                  { title: 'Available Projects', value: mockStats.total_projects, icon: Building2, color: 'bg-blue-50', textColor: 'text-blue-600' },
                  { title: 'Available Units', value: mockStats.available_units, icon: Package, color: 'bg-green-50', textColor: 'text-green-600' },
                  { title: 'My Leads', value: mockStats.my_leads, icon: Users, color: 'bg-purple-50', textColor: 'text-purple-600' },
                  { title: 'Active Bookings', value: mockStats.active_bookings, icon: TrendingUp, color: 'bg-orange-50', textColor: 'text-orange-600' }
                ].map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
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

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">🚀 Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { icon: Package, title: 'Browse Inventory', desc: 'Find units for your clients', color: 'bg-green-50', textColor: 'text-green-600' },
                    { icon: Users, title: 'Add New Lead', desc: 'Register potential buyer', color: 'bg-purple-50', textColor: 'text-purple-600' },
                    { icon: TrendingUp, title: 'Book Unit', desc: 'Complete a booking', color: 'bg-blue-50', textColor: 'text-blue-600' }
                  ].map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <button key={index} className="text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform`}>
                            <Icon className={`w-6 h-6 ${action.textColor}`} />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{action.title}</h3>
                            <p className="text-sm text-gray-600">{action.desc}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );

        case 'inventory':
          return (
            <div className="p-6">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Available Inventory</h2>
                <p className="text-gray-600">Browse units from connected developers</p>
              </div>

              {/* Filters */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-5 h-5 text-gray-500" />
                  <h3 className="text-lg font-medium text-gray-900">Filters</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <input type="text" placeholder="Search projects..." className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500" />
                  <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                    <option value="">All Categories</option>
                    <option value="1BR">1 Bedroom</option>
                    <option value="2BR">2 Bedroom</option>
                    <option value="3BR">3 Bedroom</option>
                  </select>
                  <input type="number" placeholder="Min price" className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500" />
                  <input type="number" placeholder="Max price" className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500" />
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">Clear Filters</button>
                </div>
              </div>

              {/* Results */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">{mockUnits.length} Units Available</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {mockUnits.map((unit) => (
                    <div key={unit.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h4 className="text-lg font-semibold text-gray-900">Unit {unit.unit_number}</h4>
                            <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">{unit.category}</div>
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

        default:
          return (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{activeTab}</h2>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">Feature coming soon...</p>
              </div>
            </div>
          );
      }
    };

    return (
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-green-600" />
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
                <p className="text-sm font-medium text-gray-900 truncate">{user.first_name} {user.last_name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {[
                { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
                { id: 'inventory', icon: Search, label: 'Browse Inventory' },
                { id: 'leads', icon: Users, label: 'My Leads' },
                { id: 'settings', icon: Settings, label: 'Settings' }
              ].map((item) => {
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
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-900 capitalize">
              {activeTab === 'dashboard' ? '📊 Dashboard' : 
               activeTab === 'inventory' ? '🔍 Browse Inventory' : 
               activeTab === 'leads' ? '👥 My Leads' : 
               '⚙️ Settings'}
            </h1>
            <NotificationCenter />
          </div>
          {renderAgentContent()}
        </div>
      </div>
    );
  };

  // Developer Dashboard Component
  const DeveloperDashboard = () => {
    const [uploadStatus, setUploadStatus] = useState('idle');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState<any>(null);

    const mockStats = {
      total_projects: 5,
      total_units: 450,
      available_units: 320,
      sold_units: 130
    };

    const mockUploadHistory = [
      {
        id: 1,
        filename: 'Sky_Tower_Inventory_Q4_2024.xlsx',
        file_size: 2048000,
        projects_processed: 2,
        units_processed: 120,
        status: 'COMPLETED',
        created_at: new Date().toISOString()
      }
    ];

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setSelectedFile(file);
        setUploadStatus('selected');
      }
    };

    const handleUpload = () => {
      if (!selectedFile) return;
      
      setUploadStatus('uploading');
      setUploadProgress({ step: 1, total: 6, message: 'Analyzing file structure...' });
      
      // Simulate upload progress
      const steps = [
        { step: 1, message: 'Analyzing file structure...' },
        { step: 2, message: 'Validating data...' },
        { step: 3, message: 'Preparing database...' },
        { step: 4, message: 'Processing units...' },
        { step: 5, message: 'Processing pricing options...' },
        { step: 6, message: 'Notifying agents...' }
      ];
      
      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        if (currentStep < steps.length) {
          setUploadProgress(steps[currentStep]);
        } else {
          clearInterval(interval);
          setUploadStatus('completed');
          setUploadProgress(null);
          setSelectedFile(null);
        }
      }, 1500);
    };

    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const renderDeveloperContent = () => {
      switch (activeTab) {
        case 'dashboard':
          return (
            <div className="p-6">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">📊 Developer Dashboard</h1>
                <p className="text-gray-600">Overview of your property portfolio and recent activity</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                  { title: 'Total Projects', value: mockStats.total_projects, icon: Building2, color: 'bg-blue-50', textColor: 'text-blue-600' },
                  { title: 'Total Units', value: mockStats.total_units, icon: Package, color: 'bg-purple-50', textColor: 'text-purple-600' },
                  { title: 'Available Units', value: mockStats.available_units, icon: TrendingUp, color: 'bg-green-50', textColor: 'text-green-600' },
                  { title: 'Sold Units', value: mockStats.sold_units, icon: DollarSign, color: 'bg-orange-50', textColor: 'text-orange-600' }
                ].map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
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

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">🚀 Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { icon: Upload, title: 'Upload New Inventory', desc: 'Add new units and pricing data', color: 'bg-blue-50', textColor: 'text-blue-600' },
                    { icon: Building2, title: 'Manage Projects', desc: 'View and edit your projects', color: 'bg-purple-50', textColor: 'text-purple-600' },
                    { icon: Users, title: 'Agent Network', desc: 'View connected agents', color: 'bg-green-50', textColor: 'text-green-600' }
                  ].map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <button 
                        key={index} 
                        onClick={() => index === 0 && setActiveTab('upload')}
                        className="text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform`}>
                            <Icon className={`w-6 h-6 ${action.textColor}`} />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{action.title}</h3>
                            <p className="text-sm text-gray-600">{action.desc}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );

        case 'upload':
          return (
            <div className="p-6 max-w-6xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">📤 Excel File Upload</h1>
                <p className="text-gray-600">Upload your property inventory Excel files with unit details and pricing</p>
              </div>

              {/* File Upload Section */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Select File</h2>
                
                <div className="border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 border-gray-300 hover:border-gray-400">
                  <input
                    type="file"
                    id="file-input"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  
                  {selectedFile ? (
                    <div className="space-y-4">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                        <FileText className="w-8 h-8 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{selectedFile.name}</h3>
                        <p className="text-gray-500">{formatFileSize(selectedFile.size)}</p>
                      </div>
                      <div className="flex gap-3 justify-center">
                        <button
                          onClick={handleUpload}
                          disabled={uploadStatus === 'uploading'}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                        >
                          <Upload className="w-4 h-4" />
                          {uploadStatus === 'uploading' ? 'Uploading...' : 'Start Upload'}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedFile(null);
                            setUploadStatus('idle');
                            setUploadProgress(null);
                          }}
                          className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full">
                        <Upload className="w-8 h-8 text-gray-500" />
                      </div>
                      <div>
                        <label 
                          htmlFor="file-input"
                          className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Click to select Excel file
                        </label>
                        <span className="text-gray-500"> or drag and drop</span>
                      </div>
                      <p className="text-sm text-gray-500">Supports .xlsx, .xls, .csv files up to 50MB</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Progress */}
              {uploadProgress && uploadStatus !== 'completed' && (
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Upload Progress</h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {uploadStatus.replace('_', ' ')}
                      </span>
                      <span className="text-sm text-gray-500">
                        Step {uploadProgress.step} of {uploadProgress.total}
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(uploadProgress.step / uploadProgress.total) * 100}%` }}
                      />
                    </div>
                    
                    <p className="text-gray-700">{uploadProgress.message}</p>
                  </div>
                </div>
              )}

              {/* Upload Success */}
              {uploadStatus === 'completed' && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-green-900">✅ Upload Completed Successfully!</h3>
                      <p className="text-green-700 mt-1">Your inventory has been updated and agents have been notified.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Upload History */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">📊 Upload History</h2>
                  <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">File Name</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Projects</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Units</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {mockUploadHistory.map((upload) => (
                        <tr key={upload.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <FileText className="w-4 h-4 text-gray-400" />
                              <div>
                                <p className="font-medium text-gray-900">{upload.filename}</p>
                                <p className="text-sm text-gray-500">{formatFileSize(upload.file_size)}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {new Date(upload.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">{upload.projects_processed}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{upload.units_processed}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-5 h-5 text-green-500" />
                              <span className="text-sm font-medium text-green-700">{upload.status}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );

        default:
          return (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{activeTab}</h2>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">Feature coming soon...</p>
              </div>
            </div>
          );
      }
    };

    return (
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Property Hub</h1>
                <p className="text-sm text-gray-500">Developer Portal</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user.first_name} {user.last_name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {[
                { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
                { id: 'upload', icon: Upload, label: 'Upload Excel' },
                { id: 'projects', icon: Building2, label: 'Projects' },
                { id: 'settings', icon: Settings, label: 'Settings' }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                        activeTab === item.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
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
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {renderDeveloperContent()}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Property Hub</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => {
                  setCurrentRole('AGENT');
                  setActiveTab('dashboard');
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentRole === 'AGENT'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🏢 Agent View
              </button>
              <button
                onClick={() => {
                  setCurrentRole('DEVELOPER');
                  setActiveTab('dashboard');
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentRole === 'DEVELOPER'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                👨‍💼 Developer View
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      {currentRole === 'AGENT' ? <AgentDashboard /> : <DeveloperDashboard />}
    </div>
  );
};

export default App;