import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Script, LogEntry } from '../types/script';
import { generateId } from '../utils/helpers';

interface ScriptsContextType {
  scripts: Script[];
  addScript: (script: Omit<Script, 'id' | 'createdAt' | 'logs'>) => Script;
  updateScript: (id: string, updates: Partial<Script>) => void;
  deleteScript: (id: string) => void;
  getScript: (id: string) => Script | undefined;
  runScript: (id: string) => void;
  logs: Record<string, LogEntry[]>;
  clearLogs: (id: string) => void;
}

const ScriptsContext = createContext<ScriptsContextType | undefined>(undefined);

export const useScripts = () => {
  const context = useContext(ScriptsContext);
  if (!context) {
    throw new Error('useScripts must be used within a ScriptsProvider');
  }
  return context;
};

interface ScriptsProviderProps {
  children: ReactNode;
}

// Sample initial scripts for demo purposes
const initialScripts: Script[] = [
  {
    id: '1',
    name: 'File Organizer',
    description: 'Organizes files in a directory based on their type',
    code: `import os
import shutil
from datetime import datetime

def organize_files(directory):
    """Organize files in a directory based on file type."""
    if not os.path.exists(directory):
        print(f"Directory {directory} does not exist.")
        return
    
    # Create directories for different file types
    categories = {
        'Images': ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg'],
        'Documents': ['.pdf', '.doc', '.docx', '.txt', '.xls', '.xlsx', '.ppt', '.pptx'],
        'Videos': ['.mp4', '.mov', '.avi', '.mkv', '.wmv'],
        'Audio': ['.mp3', '.wav', '.flac', '.aac', '.ogg'],
        'Archives': ['.zip', '.rar', '.tar', '.gz', '.7z']
    }
    
    # Create category directories if they don't exist
    for category in categories:
        category_path = os.path.join(directory, category)
        if not os.path.exists(category_path):
            os.makedirs(category_path)
    
    # Create an 'Others' directory for uncategorized files
    others_path = os.path.join(directory, 'Others')
    if not os.path.exists(others_path):
        os.makedirs(others_path)
    
    # Move files to their respective directories
    for filename in os.listdir(directory):
        file_path = os.path.join(directory, filename)
        
        # Skip if it's a directory or a hidden file
        if os.path.isdir(file_path) or filename.startswith('.'):
            continue
        
        # Get file extension and determine category
        file_ext = os.path.splitext(filename)[1].lower()
        destination = others_path
        
        for category, extensions in categories.items():
            if file_ext in extensions:
                destination = os.path.join(directory, category)
                break
        
        # Move the file
        shutil.move(file_path, os.path.join(destination, filename))
        print(f"Moved {filename} to {destination}")

# Example usage
directory_to_organize = "/path/to/your/directory"
organize_files(directory_to_organize)`,
    type: 'file-organization',
    status: 'idle',
    createdAt: new Date().toISOString(),
    lastRun: null,
    schedule: null,
    logs: [],
  },
  {
    id: '2',
    name: 'Data Cleaner',
    description: 'Cleans and formats CSV data files',
    code: `import csv
import os
from datetime import datetime

def clean_csv(input_file, output_file=None):
    """Clean a CSV file by removing empty rows, trimming whitespace, and standardizing formats."""
    if not os.path.exists(input_file):
        print(f"Input file {input_file} does not exist.")
        return
    
    if output_file is None:
        # Create output filename based on input filename
        file_name, file_ext = os.path.splitext(input_file)
        output_file = f"{file_name}_cleaned{file_ext}"
    
    rows_processed = 0
    rows_cleaned = 0
    rows_removed = 0
    
    try:
        # Read the input CSV
        with open(input_file, 'r', encoding='utf-8') as infile:
            reader = csv.reader(infile)
            header = next(reader)  # Get the header row
            
            # Process header - strip whitespace
            header = [col.strip() for col in header]
            
            data_rows = []
            for row in reader:
                rows_processed += 1
                
                # Check if row is empty or only contains whitespace
                if not any(cell.strip() for cell in row):
                    rows_removed += 1
                    continue
                
                # Clean each cell in the row
                cleaned_row = []
                row_was_cleaned = False
                
                for cell in row:
                    cleaned_cell = cell.strip()
                    if cleaned_cell != cell:
                        row_was_cleaned = True
                    cleaned_row.append(cleaned_cell)
                
                if row_was_cleaned:
                    rows_cleaned += 1
                
                data_rows.append(cleaned_row)
        
        # Write the cleaned data to the output file
        with open(output_file, 'w', newline='', encoding='utf-8') as outfile:
            writer = csv.writer(outfile)
            writer.writerow(header)
            writer.writerows(data_rows)
        
        print(f"Cleaning complete. Processed: {rows_processed}, Cleaned: {rows_cleaned}, Removed: {rows_removed}")
        print(f"Cleaned file saved as: {output_file}")
        
    except Exception as e:
        print(f"Error cleaning CSV: {str(e)}")

# Example usage
input_csv = "/path/to/your/data.csv"
clean_csv(input_csv)`,
    type: 'data-cleaning',
    status: 'idle',
    createdAt: new Date().toISOString(),
    lastRun: null,
    schedule: null,
    logs: [],
  },
];

export const ScriptsProvider: React.FC<ScriptsProviderProps> = ({ children }) => {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [logs, setLogs] = useState<Record<string, LogEntry[]>>({});

  // Load scripts from localStorage on mount
  useEffect(() => {
    const savedScripts = localStorage.getItem('automation-scripts');
    const savedLogs = localStorage.getItem('automation-logs');
    
    if (savedScripts) {
      setScripts(JSON.parse(savedScripts));
    } else {
      // Use demo scripts if no saved scripts
      setScripts(initialScripts);
    }
    
    if (savedLogs) {
      setLogs(JSON.parse(savedLogs));
    }
  }, []);

  // Save scripts to localStorage when updated
  useEffect(() => {
    localStorage.setItem('automation-scripts', JSON.stringify(scripts));
  }, [scripts]);

  // Save logs to localStorage when updated
  useEffect(() => {
    localStorage.setItem('automation-logs', JSON.stringify(logs));
  }, [logs]);

  const addScript = (scriptData: Omit<Script, 'id' | 'createdAt' | 'logs'>) => {
    const newScript: Script = {
      ...scriptData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      logs: [],
    };
    
    setScripts((prevScripts) => [...prevScripts, newScript]);
    return newScript;
  };

  const updateScript = (id: string, updates: Partial<Script>) => {
    setScripts((prevScripts) =>
      prevScripts.map((script) =>
        script.id === id ? { ...script, ...updates } : script
      )
    );
  };

  const deleteScript = (id: string) => {
    setScripts((prevScripts) => prevScripts.filter((script) => script.id !== id));
    
    // Also clear logs for the deleted script
    setLogs((prevLogs) => {
      const newLogs = { ...prevLogs };
      delete newLogs[id];
      return newLogs;
    });
  };

  const getScript = (id: string) => {
    return scripts.find((script) => script.id === id);
  };

  const runScript = (id: string) => {
    // Set script status to running
    updateScript(id, { status: 'running', lastRun: new Date().toISOString() });
    
    // Simulate script execution
    const scriptToRun = getScript(id);
    if (!scriptToRun) return;

    // Add a starting log entry
    const newLog: LogEntry = {
      timestamp: new Date().toISOString(),
      type: 'info',
      message: `Script "${scriptToRun.name}" started execution`,
    };
    
    setLogs((prevLogs) => ({
      ...prevLogs,
      [id]: [...(prevLogs[id] || []), newLog],
    }));
    
    // Simulate execution time
    setTimeout(() => {
      // Add logs for completion
      const successLog: LogEntry = {
        timestamp: new Date().toISOString(),
        type: 'success',
        message: `Script execution completed successfully`,
      };
      
      setLogs((prevLogs) => ({
        ...prevLogs,
        [id]: [...(prevLogs[id] || []), successLog],
      }));
      
      // Update script status
      updateScript(id, { status: 'completed' });
      
      // Reset to idle after some time
      setTimeout(() => {
        updateScript(id, { status: 'idle' });
      }, 5000);
    }, 3000);
  };

  const clearLogs = (id: string) => {
    setLogs((prevLogs) => ({
      ...prevLogs,
      [id]: [],
    }));
  };

  return (
    <ScriptsContext.Provider
      value={{
        scripts,
        addScript,
        updateScript,
        deleteScript,
        getScript,
        runScript,
        logs,
        clearLogs,
      }}
    >
      {children}
    </ScriptsContext.Provider>
  );
};