import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, Play, ArrowLeft, Calendar } from 'lucide-react';
import { useScripts } from '../contexts/ScriptsContext';
import { ScriptType, Script } from '../types/script';
import CodeEditor from '../components/scripts/CodeEditor';
import ScheduleForm from '../components/scripts/ScheduleForm';

const ScriptBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addScript, updateScript, getScript, runScript } = useScripts();
  const [showScheduler, setShowScheduler] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('# Enter your Python script here\n\nimport os\nimport time\n\ndef main():\n    print("Hello from Task Automation!")\n    \n    # Your automation code goes here\n    \n    return True\n\nif __name__ == "__main__":\n    result = main()\n    print(f"Script completed with result: {result}")\n');
  const [type, setType] = useState<ScriptType>('custom');
  const [schedule, setSchedule] = useState<Script['schedule']>(null);
  
  // Check if editing existing script
  const isEditing = !!id;
  
  // Load script data if editing
  useEffect(() => {
    if (isEditing) {
      const script = getScript(id);
      if (script) {
        setName(script.name);
        setDescription(script.description);
        setCode(script.code);
        setType(script.type);
        setSchedule(script.schedule);
      } else {
        // Script not found, navigate back
        navigate('/');
      }
    }
  }, [id, getScript, navigate, isEditing]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const scriptData = {
      name,
      description,
      code,
      type,
      status: 'idle' as const,
      lastRun: null,
      schedule,
    };
    
    if (isEditing) {
      updateScript(id, scriptData);
      navigate(`/script/${id}`);
    } else {
      const newScript = addScript(scriptData);
      navigate(`/script/${newScript.id}`);
    }
  };
  
  const handleRun = () => {
    if (isEditing) {
      runScript(id);
    } else {
      // Save first, then run
      const scriptData = {
        name,
        description,
        code,
        type,
        status: 'idle' as const,
        lastRun: null,
        schedule,
      };
      
      const newScript = addScript(scriptData);
      runScript(newScript.id);
      navigate(`/script/${newScript.id}`);
    }
  };
  
  const scriptTypes: { value: ScriptType; label: string }[] = [
    { value: 'file-organization', label: 'File Organization' },
    { value: 'data-cleaning', label: 'Data Cleaning' },
    { value: 'system-maintenance', label: 'System Maintenance' },
    { value: 'web-scraping', label: 'Web Scraping' },
    { value: 'backup', label: 'Backup' },
    { value: 'notification', label: 'Notification' },
    { value: 'custom', label: 'Custom Script' },
  ];
  
  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft size={20} className="text-primary-600" />
        </button>
        <h1 className="text-2xl font-bold text-primary-800">
          {isEditing ? 'Edit Script' : 'Create New Script'}
        </h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Script Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                placeholder="Enter script name"
              />
            </div>
            
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Script Type
              </label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value as ScriptType)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              >
                {scriptTypes.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              placeholder="Describe what this script does"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
              Python Code
            </label>
            <CodeEditor code={code} onChange={setCode} />
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex space-x-3">
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors flex items-center"
              >
                <Save size={18} className="mr-2" />
                Save Script
              </button>
              
              <button
                type="button"
                onClick={handleRun}
                className="px-4 py-2 bg-highlight-600 hover:bg-highlight-700 text-white rounded-lg transition-colors flex items-center"
              >
                <Play size={18} className="mr-2" />
                Run Now
              </button>
            </div>
            
            <button
              type="button"
              onClick={() => setShowScheduler(!showScheduler)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors flex items-center"
            >
              <Calendar size={18} className="mr-2" />
              {schedule ? 'Edit Schedule' : 'Add Schedule'}
            </button>
          </div>
          
          {/* Schedule form */}
          {showScheduler && (
            <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <ScheduleForm
                schedule={schedule}
                onSave={(newSchedule) => {
                  setSchedule(newSchedule);
                  setShowScheduler(false);
                }}
                onCancel={() => setShowScheduler(false)}
              />
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ScriptBuilder;