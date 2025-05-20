import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Play, Edit, Trash2, Clock, ArrowLeft, FileText, Download } from 'lucide-react';
import { useScripts } from '../contexts/ScriptsContext';
import { formatDate, getScriptTypeName, getStatusColor, getLogTypeColor } from '../utils/helpers';
import CodeEditor from '../components/scripts/CodeEditor';

const ScriptDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getScript, runScript, deleteScript, logs, clearLogs } = useScripts();
  const [activeTab, setActiveTab] = useState<'details' | 'code' | 'logs'>('details');
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  const script = getScript(id || '');
  const scriptLogs = logs[id || ''] || [];
  
  if (!script) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600 mb-4">Script not found</p>
        <Link to="/" className="text-accent-600 hover:text-accent-800">
          Go back to dashboard
        </Link>
      </div>
    );
  }
  
  const handleDelete = () => {
    if (confirmDelete) {
      deleteScript(script.id);
      navigate('/');
    } else {
      setConfirmDelete(true);
      // Reset confirmation after 5 seconds
      setTimeout(() => setConfirmDelete(false), 5000);
    }
  };
  
  const handleExport = () => {
    // Create a blob with the script code
    const scriptData = {
      name: script.name,
      description: script.description,
      code: script.code,
      type: script.type,
    };
    
    const blob = new Blob([JSON.stringify(scriptData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create a download link
    const link = document.createElement('a');
    link.href = url;
    link.download = `${script.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    
    // Trigger the download
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft size={20} className="text-primary-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-primary-800">{script.name}</h1>
            <p className="text-gray-600">{script.description}</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => runScript(script.id)}
            disabled={script.status === 'running'}
            className="px-4 py-2 bg-highlight-600 hover:bg-highlight-700 text-white rounded-lg transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play size={18} className="mr-2" />
            Run Script
          </button>
          
          <Link
            to={`/edit/${script.id}`}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors flex items-center"
          >
            <Edit size={18} className="mr-2" />
            Edit
          </Link>
          
          <button
            onClick={handleDelete}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
              confirmDelete
                ? 'bg-error-600 hover:bg-error-700 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            <Trash2 size={18} className="mr-2" />
            {confirmDelete ? 'Confirm' : 'Delete'}
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Tab navigation */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-6 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'details'
                ? 'border-accent-500 text-accent-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-6 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'code'
                ? 'border-accent-500 text-accent-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Code
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-6 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'logs'
                ? 'border-accent-500 text-accent-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Logs
          </button>
        </div>
        
        {/* Tab content */}
        <div className="p-6">
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Script Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <p className="mt-1">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(script.status)}`}>
                        {script.status.charAt(0).toUpperCase() + script.status.slice(1)}
                      </span>
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Type</p>
                    <p className="mt-1">{getScriptTypeName(script.type)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Created</p>
                    <p className="mt-1">{formatDate(script.createdAt)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Last Run</p>
                    <p className="mt-1">{formatDate(script.lastRun)}</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button
                    onClick={handleExport}
                    className="inline-flex items-center text-primary-600 hover:text-primary-800"
                  >
                    <Download size={16} className="mr-1" />
                    Export Script
                  </button>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Schedule</h3>
                
                {script.schedule ? (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-start mb-4">
                      <Clock size={20} className="text-highlight-500 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium">
                          {script.schedule.frequency.charAt(0).toUpperCase() + script.schedule.frequency.slice(1)}
                        </p>
                        
                        {script.schedule.frequency === 'once' && script.schedule.date && (
                          <p className="text-sm text-gray-600">
                            {new Date(script.schedule.date).toLocaleDateString()} at {script.schedule.time}
                          </p>
                        )}
                        
                        {script.schedule.frequency === 'daily' && script.schedule.time && (
                          <p className="text-sm text-gray-600">Every day at {script.schedule.time}</p>
                        )}
                        
                        {script.schedule.frequency === 'weekly' && script.schedule.days && (
                          <p className="text-sm text-gray-600">
                            Every {script.schedule.days.join(', ')} at {script.schedule.time}
                          </p>
                        )}
                        
                        {script.schedule.frequency === 'monthly' && script.schedule.date && (
                          <p className="text-sm text-gray-600">
                            Monthly on {new Date(script.schedule.date).getDate()} at {script.schedule.time}
                          </p>
                        )}
                        
                        {script.schedule.frequency === 'custom' && script.schedule.cronExpression && (
                          <p className="text-sm text-gray-600">
                            Cron: {script.schedule.cronExpression}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <Link
                      to={`/edit/${script.id}`}
                      className="text-sm text-accent-600 hover:text-accent-800"
                    >
                      Edit Schedule
                    </Link>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center">
                    <FileText size={20} className="text-gray-400 mr-3" />
                    <p className="text-gray-600">No schedule set.</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'code' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800">Script Code</h3>
                <Link to={`/edit/${script.id}`} className="text-accent-600 hover:text-accent-800">
                  Edit Code
                </Link>
              </div>
              
              <CodeEditor code={script.code} onChange={() => {}} readOnly height="500px" />
            </div>
          )}
          
          {activeTab === 'logs' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800">Execution Logs</h3>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => clearLogs(script.id)}
                    disabled={scriptLogs.length === 0}
                    className="text-sm text-primary-600 hover:text-primary-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Clear Logs
                  </button>
                </div>
              </div>
              
              {scriptLogs.length > 0 ? (
                <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm overflow-auto max-h-[500px]">
                  {scriptLogs.map((log, index) => (
                    <div key={index} className="mb-2">
                      <span className="text-gray-400">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                      <span className={`ml-2 ${getLogTypeColor(log.type)}`}>{log.type.toUpperCase()}:</span>
                      <span className="ml-2">{log.message}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                  <p className="text-gray-600">No logs available. Run the script to generate logs.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScriptDetail;