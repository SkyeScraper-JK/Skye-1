import React, { useState, useEffect } from 'react';
import { socketService } from '../../services/socketService';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Trash2,
  RefreshCw
} from 'lucide-react';

interface UploadProgress {
  status: string;
  message: string;
  step: number;
  total: number;
  unitProgress?: {
    processed: number;
    total: number;
    currentProject: string;
  };
  error?: string;
}

interface UploadHistory {
  id: number;
  filename: string;
  file_size: number;
  projects_processed?: number;
  units_processed?: number;
  status: string;
  created_at: string;
  error_details?: any;
}

const UploadInterface = () => {
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [uploadHistory, setUploadHistory] = useState<UploadHistory[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    loadUploadHistory();
    setupSocketListeners();

    return () => {
      const socket = socketService.getSocket();
      if (socket) {
        socket.off('upload_progress');
        socket.off('upload_complete');
        socket.off('upload_error');
        socket.off('unit_progress');
      }
    };
  }, []);

  const setupSocketListeners = () => {
    const socket = socketService.getSocket();
    if (!socket) return;

    socket.on('upload_progress', handleUploadProgress);
    socket.on('upload_complete', handleUploadComplete);
    socket.on('upload_error', handleUploadError);
    socket.on('unit_progress', handleUnitProgress);
  };

  const handleUploadProgress = (progress: UploadProgress) => {
    setUploadProgress(progress);
    setUploadStatus(progress.status);
  };

  const handleUploadComplete = (result: any) => {
    setUploadStatus('completed');
    setUploadProgress(null);
    loadUploadHistory();
    setSelectedFile(null);
  };

  const handleUploadError = (error: any) => {
    setUploadStatus('error');
    setUploadProgress(prev => ({ ...prev!, error: error.error }));
  };

  const handleUnitProgress = (progress: any) => {
    setUploadProgress(prev => ({ ...prev!, unitProgress: progress }));
  };

  const handleFileSelect = (file: File) => {
    if (file && isValidFile(file)) {
      setSelectedFile(file);
      setUploadStatus('selected');
      setUploadProgress(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const isValidFile = (file: File) => {
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ];
    return validTypes.includes(file.type) && file.size <= 50 * 1024 * 1024;
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploadStatus('uploading');
    setUploadProgress({ status: 'uploading', message: 'Starting upload...', step: 0, total: 6 });

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      const socket = socketService.getSocket();
      if (socket) {
        formData.append('socketId', socket.id);
      }

      const response = await fetch('/api/upload/excel', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

    } catch (error: any) {
      setUploadStatus('error');
      setUploadProgress({ 
        status: 'error', 
        message: 'Upload failed', 
        step: 0, 
        total: 6, 
        error: error.message 
      });
    }
  };

  const loadUploadHistory = async () => {
    try {
      const response = await fetch('/api/upload/history', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUploadHistory(data.uploads || []);
      }
    } catch (error) {
      console.error('Failed to load upload history:', error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'FAILED':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'PROCESSING':
        return <Clock className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">📤 Excel File Upload</h1>
        <p className="text-gray-600">Upload your property inventory Excel files with unit details and pricing</p>
      </div>

      {/* File Upload Section */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Select File</h2>
        
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
            dragActive 
              ? 'border-blue-400 bg-blue-50' 
              : selectedFile 
                ? 'border-green-400 bg-green-50' 
                : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="file-input"
            accept=".xlsx,.xls,.csv"
            onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
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
                {uploadProgress.status.replace('_', ' ')}
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
            
            {uploadProgress.unitProgress && (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  Processing: {uploadProgress.unitProgress.processed}/{uploadProgress.unitProgress.total} units
                  {uploadProgress.unitProgress.currentProject && (
                    <span className="font-medium"> in {uploadProgress.unitProgress.currentProject}</span>
                  )}
                </p>
              </div>
            )}
            
            {uploadProgress.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-700">{uploadProgress.error}</p>
              </div>
            )}
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
          <button
            onClick={loadUploadHistory}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
        
        <div className="overflow-x-auto">
          {uploadHistory.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p>No uploads yet</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    File Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Projects
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Units
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {uploadHistory.map((upload) => (
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
                      <br />
                      {new Date(upload.created_at).toLocaleTimeString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {upload.projects_processed || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {upload.units_processed || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(upload.status)}
                        <span className={`text-sm font-medium ${
                          upload.status === 'COMPLETED' 
                            ? 'text-green-700' 
                            : upload.status === 'FAILED' 
                              ? 'text-red-700' 
                              : 'text-gray-700'
                        }`}>
                          {upload.status}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadInterface;