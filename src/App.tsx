import React from 'react';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🏢 Property Hub
          </h1>
          <p className="text-gray-600 mb-8">
            Multi-Role Real Estate Platform
          </p>
          
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h2 className="text-lg font-semibold text-green-800 mb-2">
                ✅ React App Working!
              </h2>
              <p className="text-green-700 text-sm">
                The frontend is now running successfully on port 5173
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">Features:</h3>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Developer Dashboard with Excel Upload</li>
                <li>• Agent Dashboard with Inventory Browser</li>
                <li>• Real-time Notifications</li>
                <li>• Role-based Authentication</li>
              </ul>
            </div>
            
            <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Ready to Add Backend
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;