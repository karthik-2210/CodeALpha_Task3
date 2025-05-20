import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Edit, FileText, Clock, AlertCircle } from 'lucide-react';
import { useScripts } from '../contexts/ScriptsContext';
import { formatDate, getScriptTypeName, getStatusColor } from '../utils/helpers';

const Dashboard = () => {
  const { scripts, runScript } = useScripts();
  
  // Count statistics
  const totalScripts = scripts.length;
  const runningScripts = scripts.filter(s => s.status === 'running').length;
  const scheduledScripts = scripts.filter(s => s.schedule).length;
  const recentlyRun = scripts.filter(s => s.lastRun).sort((a, b) => 
    new Date(b.lastRun || 0).getTime() - new Date(a.lastRun || 0).getTime()
  ).slice(0, 5);
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-5 border-l-4 border-primary-500">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-primary-500">Total Scripts</p>
              <p className="text-2xl font-bold">{totalScripts}</p>
            </div>
            <div className="p-2 bg-primary-100 rounded-full">
              <FileText size={24} className="text-primary-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-5 border-l-4 border-highlight-500">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-highlight-500">Running</p>
              <p className="text-2xl font-bold">{runningScripts}</p>
            </div>
            <div className="p-2 bg-highlight-100 rounded-full">
              <Play size={24} className="text-highlight-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-5 border-l-4 border-accent-500">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-accent-500">Scheduled</p>
              <p className="text-2xl font-bold">{scheduledScripts}</p>
            </div>
            <div className="p-2 bg-accent-100 rounded-full">
              <Clock size={24} className="text-accent-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-5 border-l-4 border-gray-500">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Last 7 Days</p>
              <p className="text-2xl font-bold">{scripts.filter(s => {
                if (!s.lastRun) return false;
                const lastRun = new Date(s.lastRun);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return lastRun >= weekAgo;
              }).length}</p>
            </div>
            <div className="p-2 bg-gray-100 rounded-full">
              <AlertCircle size={24} className="text-gray-500" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Script List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Your Scripts</h2>
          <Link 
            to="/create" 
            className="px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors"
          >
            Create New Script
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Run</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {scripts.length > 0 ? (
                scripts.map((script) => (
                  <tr key={script.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to={`/script/${script.id}`} className="font-medium text-primary-600 hover:text-primary-800">
                        {script.name}
                      </Link>
                      <p className="text-sm text-gray-500">{script.description.substring(0, 60)}...</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm">{getScriptTypeName(script.type)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(script.status)}`}>
                        {script.status.charAt(0).toUpperCase() + script.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(script.lastRun)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => runScript(script.id)} 
                          disabled={script.status === 'running'}
                          className="p-1 text-highlight-600 hover:text-highlight-900 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Run script"
                        >
                          <Play size={18} />
                        </button>
                        <Link to={`/edit/${script.id}`} className="p-1 text-primary-600 hover:text-primary-900" title="Edit script">
                          <Edit size={18} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No scripts created yet. <Link to="/create" className="text-accent-600 hover:text-accent-800">Create your first script</Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Recent Activity */}
      {recentlyRun.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-5 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
          </div>
          <div className="p-5">
            <ul className="space-y-4">
              {recentlyRun.map((script) => (
                <li key={script.id} className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${script.status === 'completed' ? 'bg-success-500' : 'bg-error-500'}`}></div>
                  <div className="flex-1">
                    <Link to={`/script/${script.id}`} className="font-medium text-primary-600 hover:text-primary-800">
                      {script.name}
                    </Link>
                    <p className="text-sm text-gray-500">Last run: {formatDate(script.lastRun)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;