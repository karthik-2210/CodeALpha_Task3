import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-bold text-primary-800 mb-4">404</h1>
      <p className="text-2xl font-medium text-gray-600 mb-8">Page Not Found</p>
      <p className="text-lg text-gray-500 max-w-md mx-auto mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
        <Link
          to="/"
          className="px-6 py-3 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors flex items-center justify-center"
        >
          <Home size={18} className="mr-2" />
          Go to Dashboard
        </Link>
        
        <button
          onClick={() => window.history.back()}
          className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors flex items-center justify-center"
        >
          <ArrowLeft size={18} className="mr-2" />
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NotFound;