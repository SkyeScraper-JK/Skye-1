import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Maximize, Calendar, DollarSign, Eye } from 'lucide-react';

interface Unit {
  id: number;
  unit_number: string;
  unit_code: string;
  floor: number;
  category: string;
  area: number;
  current_price: number;
  project_name: string;
  project_location: string;
  handover_date: string;
  view_description?: string;
}

const InventoryBrowser = () => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    project: '',
    location: '',
    price_min: '',
    price_max: '',
    category: ''
  });

  useEffect(() => {
    loadInventory();
  }, [filters]);

  const loadInventory = async () => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await fetch(`/api/agent/inventory?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUnits(data.inventory || []);
      }
    } catch (error) {
      console.error('Failed to load inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      project: '',
      location: '',
      price_min: '',
      price_max: '',
      category: ''
    });
  };

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

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6 w-64"></div>
          <div className="grid gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-48"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
            <input
              type="text"
              value={filters.project}
              onChange={(e) => handleFilterChange('project', e.target.value)}
              placeholder="Search projects..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">All Categories</option>
              <option value="1BR">1 Bedroom</option>
              <option value="2BR">2 Bedroom</option>
              <option value="3BR">3 Bedroom</option>
              <option value="Studio">Studio</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Min Price (AED)</label>
            <input
              type="number"
              value={filters.price_min}
              onChange={(e) => handleFilterChange('price_min', e.target.value)}
              placeholder="Min price"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Max Price (AED)</label>
            <input
              type="number"
              value={filters.price_max}
              onChange={(e) => handleFilterChange('price_max', e.target.value)}
              placeholder="Max price"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">
              {units.length} Units Available
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Search className="w-4 h-4" />
              Updated live
            </div>
          </div>
        </div>

        {units.length === 0 ? (
          <div className="p-12 text-center">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Units Found</h3>
            <p className="text-gray-600">Try adjusting your filters or check back later for new inventory</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {units.map((unit) => (
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
                      
                      {unit.handover_date && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <div>
                            <div className="font-medium text-gray-900">Handover</div>
                            <div>{unit.handover_date}</div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {unit.view_description && (
                      <p className="text-sm text-gray-600 mb-4">
                        <strong>View:</strong> {unit.view_description}
                      </p>
                    )}
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
        )}
      </div>
    </div>
  );
};

export default InventoryBrowser;