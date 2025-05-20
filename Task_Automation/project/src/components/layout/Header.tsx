import React from 'react';
import { Search, Bell, HelpCircle } from 'lucide-react';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="flex items-center justify-between h-16 px-4 md:px-6 bg-white border-b border-gray-200">
      <div className="flex items-center">
        <h1 className="text-xl md:text-2xl font-semibold text-primary-800">{title}</h1>
      </div>
      
      <div className="flex items-center space-x-2 md:space-x-4">
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="Search scripts..."
            className="w-64 pl-10 pr-4 py-2 rounded-lg bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-500 transition-all"
          />
          <Search size={18} className="absolute left-3 top-2.5 text-gray-500" />
        </div>
        
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <Bell size={20} className="text-primary-600" />
        </button>
        
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <HelpCircle size={20} className="text-primary-600" />
        </button>
        
        <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center">
          <span className="font-medium text-sm">JS</span>
        </div>
      </div>
    </header>
  );
};

export default Header;