import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, FilePlus, Code, BookTemplate, Settings, Menu, X } from 'lucide-react';
import { useScripts } from '../../contexts/ScriptsContext';

const Sidebar = () => {
  const [expanded, setExpanded] = React.useState(true);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { scripts } = useScripts();
  
  // Count running scripts
  const runningScripts = scripts.filter(script => script.status === 'running').length;
  
  const toggleSidebar = () => {
    setExpanded(!expanded);
  };
  
  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };
  
  // Navigation items
  const navItems = [
    { to: '/', icon: <Home size={20} />, label: 'Dashboard' },
    { to: '/create', icon: <FilePlus size={20} />, label: 'Create Script' },
    { to: '/templates', icon: <BookTemplate size={20} />, label: 'Templates' },
    { to: '/settings', icon: <Settings size={20} />, label: 'Settings' }
  ];
  
  const sidebarClasses = `
    ${expanded ? 'w-64' : 'w-20'} 
    hidden md:block transition-all duration-300 ease-in-out 
    bg-primary-800 text-white flex flex-col
  `;
  
  const mobileSidebarClasses = `
    fixed inset-y-0 left-0 z-50 w-64 
    ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} 
    transition-transform duration-300 ease-in-out 
    bg-primary-800 text-white flex flex-col md:hidden
  `;
  
  const SidebarContent = () => (
    <>
      <div className="flex items-center justify-between p-4 border-b border-primary-700">
        <div className="flex items-center space-x-3">
          <Code size={24} className="text-accent-400" />
          {expanded && <span className="font-semibold text-lg">AutoTask</span>}
        </div>
        <button onClick={toggleSidebar} className="hidden md:block text-primary-400 hover:text-white">
          {expanded ? <X size={18} /> : <Menu size={18} />}
        </button>
        <button onClick={toggleMobileSidebar} className="md:hidden text-primary-400 hover:text-white">
          <X size={18} />
        </button>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-2 px-2">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) => `
                  flex items-center p-3 rounded-lg transition-colors duration-200
                  ${isActive 
                    ? 'bg-primary-700 text-white' 
                    : 'text-primary-300 hover:bg-primary-700 hover:text-white'}
                `}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {expanded && <span className="ml-3">{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-primary-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full ${runningScripts > 0 ? 'bg-highlight-500 animate-pulse' : 'bg-success-500'}`}></div>
            {expanded && (
              <span className="ml-3 text-sm text-primary-300">
                {runningScripts > 0 
                  ? `${runningScripts} script${runningScripts > 1 ? 's' : ''} running` 
                  : 'System idle'}
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
  
  return (
    <>
      {/* Mobile toggle button */}
      <button 
        onClick={toggleMobileSidebar}
        className="fixed top-4 left-4 z-40 md:hidden bg-primary-800 text-white p-2 rounded-md"
      >
        <Menu size={24} />
      </button>
      
      {/* Desktop sidebar */}
      <aside className={sidebarClasses}>
        <SidebarContent />
      </aside>
      
      {/* Mobile sidebar */}
      <aside className={mobileSidebarClasses}>
        <SidebarContent />
      </aside>
      
      {/* Backdrop for mobile sidebar */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40 md:hidden"
          onClick={toggleMobileSidebar}
        ></div>
      )}
    </>
  );
};

export default Sidebar;