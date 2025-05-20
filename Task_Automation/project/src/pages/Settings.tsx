import React, { useState } from 'react';
import { Save, Trash2 } from 'lucide-react';

const Settings = () => {
  const [defaultDirectory, setDefaultDirectory] = useState('/home/user/documents');
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);
  const [pythonPath, setPythonPath] = useState('/usr/bin/python3');
  const [importedCount, setImportedCount] = useState(0);
  
  const handleImport = () => {
    // Simulate file selection and import
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    
    fileInput.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        // Simulate successful import
        setImportedCount(prev => prev + target.files!.length);
      }
    };
    
    fileInput.click();
  };
  
  const handleClearAll = () => {
    const confirmed = window.confirm(
      'Are you sure you want to clear all scripts? This action cannot be undone.'
    );
    
    if (confirmed) {
      localStorage.removeItem('automation-scripts');
      localStorage.removeItem('automation-logs');
      window.location.reload();
    }
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-primary-800 mb-6">Settings</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-5 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Application Settings</h2>
        </div>
        
        <div className="p-6">
          <div className="space-y-6">
            {/* General Settings */}
            <div>
              <h3 className="text-md font-medium text-gray-800 mb-4">General</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="defaultDirectory" className="block text-sm font-medium text-gray-700 mb-1">
                    Default Directory
                  </label>
                  <input
                    id="defaultDirectory"
                    type="text"
                    value={defaultDirectory}
                    onChange={(e) => setDefaultDirectory(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="pythonPath" className="block text-sm font-medium text-gray-700 mb-1">
                    Python Executable Path
                  </label>
                  <input
                    id="pythonPath"
                    type="text"
                    value={pythonPath}
                    onChange={(e) => setPythonPath(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="darkMode"
                      type="checkbox"
                      checked={darkMode}
                      onChange={(e) => setDarkMode(e.target.checked)}
                      className="h-4 w-4 text-accent-600 focus:ring-accent-500 border-gray-300 rounded"
                    />
                    <label htmlFor="darkMode" className="ml-2 block text-sm text-gray-700">
                      Dark Mode
                    </label>
                  </div>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Coming Soon</span>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="notifications"
                    type="checkbox"
                    checked={notifications}
                    onChange={(e) => setNotifications(e.target.checked)}
                    className="h-4 w-4 text-accent-600 focus:ring-accent-500 border-gray-300 rounded"
                  />
                  <label htmlFor="notifications" className="ml-2 block text-sm text-gray-700">
                    Enable Notifications
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="autoBackup"
                    type="checkbox"
                    checked={autoBackup}
                    onChange={(e) => setAutoBackup(e.target.checked)}
                    className="h-4 w-4 text-accent-600 focus:ring-accent-500 border-gray-300 rounded"
                  />
                  <label htmlFor="autoBackup" className="ml-2 block text-sm text-gray-700">
                    Auto-backup Scripts
                  </label>
                </div>
              </div>
            </div>
            
            {/* Import/Export */}
            <div>
              <h3 className="text-md font-medium text-gray-800 mb-4">Import and Export</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    Import scripts from external files or export your scripts for backup.
                  </p>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={handleImport}
                      className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                    >
                      Import Scripts
                    </button>
                    
                    {importedCount > 0 && (
                      <p className="text-sm text-green-600 self-center">
                        {importedCount} script(s) imported successfully
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Danger Zone */}
            <div>
              <h3 className="text-md font-medium text-error-600 mb-4">Danger Zone</h3>
              
              <div className="space-y-4 border border-error-200 rounded-lg p-4 bg-error-50">
                <div>
                  <p className="text-sm text-gray-600 mb-3">
                    Clearing all data will remove all your scripts and logs. This action cannot be undone.
                  </p>
                  
                  <button
                    onClick={handleClearAll}
                    className="px-4 py-2 bg-error-600 hover:bg-error-700 text-white rounded-lg transition-colors flex items-center"
                  >
                    <Trash2 size={16} className="mr-2" />
                    Clear All Data
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-5 border-t border-gray-200">
            <div className="flex justify-end">
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors mr-3"
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors flex items-center"
              >
                <Save size={16} className="mr-2" />
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;