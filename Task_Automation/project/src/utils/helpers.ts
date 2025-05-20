/**
 * Generate a random ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

/**
 * Format a date string
 */
export const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'Never';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

/**
 * Get a friendly name for script type
 */
export const getScriptTypeName = (type: string): string => {
  const typeMap: Record<string, string> = {
    'file-organization': 'File Organization',
    'data-cleaning': 'Data Cleaning',
    'system-maintenance': 'System Maintenance',
    'web-scraping': 'Web Scraping',
    'backup': 'Backup',
    'notification': 'Notification',
    'custom': 'Custom Script'
  };
  
  return typeMap[type] || 'Custom Script';
};

/**
 * Get a status color for a script status
 */
export const getStatusColor = (status: string): string => {
  const statusMap: Record<string, string> = {
    'idle': 'bg-gray-200 text-gray-800',
    'running': 'bg-highlight-100 text-highlight-800 animate-pulse',
    'completed': 'bg-success-50 text-success-700',
    'failed': 'bg-error-50 text-error-700',
    'scheduled': 'bg-primary-100 text-primary-800',
  };
  
  return statusMap[status] || 'bg-gray-200 text-gray-800';
};

/**
 * Get an icon color for a log type
 */
export const getLogTypeColor = (type: string): string => {
  const typeMap: Record<string, string> = {
    'info': 'text-primary-500',
    'warning': 'text-highlight-500',
    'error': 'text-error-500',
    'success': 'text-success-500',
  };
  
  return typeMap[type] || 'text-primary-500';
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};