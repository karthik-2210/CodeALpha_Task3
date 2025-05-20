import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, Tag } from 'lucide-react';
import { useScripts } from '../contexts/ScriptsContext';
import { ScriptTemplate } from '../types/script';

const Templates = () => {
  const navigate = useNavigate();
  const { addScript } = useScripts();
  
  // Sample templates
  const templates: ScriptTemplate[] = [
    {
      id: 'template1',
      name: 'File Organizer',
      description: 'Organizes files in a directory based on their file type',
      type: 'file-organization',
      tags: ['files', 'organization', 'cleanup'],
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
    },
    {
      id: 'template2',
      name: 'Data Cleaner',
      description: 'Cleans and formats CSV data files',
      type: 'data-cleaning',
      tags: ['data', 'csv', 'cleaning'],
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
    },
    {
      id: 'template3',
      name: 'System Backup',
      description: 'Creates compressed backups of important directories',
      type: 'backup',
      tags: ['backup', 'system', 'archive'],
      code: `import os
import shutil
import datetime
import zipfile

def create_backup(source_dir, backup_dir=None):
    """Create a compressed backup of a directory."""
    if not os.path.exists(source_dir):
        print(f"Source directory {source_dir} does not exist.")
        return
    
    # Create backup directory if not specified
    if backup_dir is None:
        backup_dir = os.path.join(os.path.dirname(source_dir), "backups")
    
    # Ensure backup directory exists
    if not os.path.exists(backup_dir):
        os.makedirs(backup_dir)
    
    # Generate backup filename with timestamp
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    source_name = os.path.basename(source_dir)
    backup_filename = f"{source_name}_{timestamp}.zip"
    backup_path = os.path.join(backup_dir, backup_filename)
    
    print(f"Creating backup of {source_dir}...")
    
    # Create zip archive
    with zipfile.ZipFile(backup_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(source_dir):
            for file in files:
                file_path = os.path.join(root, file)
                # Calculate path within the zip file
                arcname = os.path.relpath(file_path, os.path.dirname(source_dir))
                try:
                    zipf.write(file_path, arcname)
                except Exception as e:
                    print(f"Error adding {file_path} to backup: {str(e)}")
    
    print(f"Backup created: {backup_path}")
    print(f"Backup size: {os.path.getsize(backup_path) / (1024*1024):.2f} MB")
    
    return backup_path

# Example usage
source_directory = "/path/to/important/files"
backup_directory = "/path/to/backup/location"

create_backup(source_directory, backup_directory)`,
    },
    {
      id: 'template4',
      name: 'Log Analyzer',
      description: 'Parses log files and generates summary reports',
      type: 'data-cleaning',
      tags: ['logs', 'analysis', 'reports'],
      code: `import re
import os
from datetime import datetime
from collections import Counter, defaultdict

def analyze_logs(log_file, output_file=None):
    """Analyze a log file and generate a summary report."""
    if not os.path.exists(log_file):
        print(f"Log file {log_file} does not exist.")
        return
    
    # Set default output file if not specified
    if output_file is None:
        file_name, file_ext = os.path.splitext(log_file)
        output_file = f"{file_name}_analysis.txt"
    
    # Initialize counters and storage
    line_count = 0
    error_count = 0
    warning_count = 0
    ip_addresses = Counter()
    timestamps = []
    errors = defaultdict(int)
    urls = Counter()
    
    # Common log patterns - adjust based on your log format
    ip_pattern = r'\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b'
    timestamp_pattern = r'\\[(\\d{2}/\\w+/\\d{4}:\\d{2}:\\d{2}:\\d{2})\\]'
    error_pattern = r'ERROR|FATAL|EXCEPTION'
    warning_pattern = r'WARN|WARNING'
    url_pattern = r'GET\\s+([^\\s]+)'
    
    print(f"Analyzing log file: {log_file}")
    
    # Process the log file
    with open(log_file, 'r', encoding='utf-8', errors='ignore') as f:
        for line in f:
            line_count += 1
            
            # Extract IP addresses
            ip_matches = re.findall(ip_pattern, line)
            for ip in ip_matches:
                ip_addresses[ip] += 1
            
            # Extract timestamps
            timestamp_matches = re.findall(timestamp_pattern, line)
            if timestamp_matches:
                timestamps.append(timestamp_matches[0])
            
            # Check for errors
            if re.search(error_pattern, line, re.IGNORECASE):
                error_count += 1
                # Extract error type - this is a simplified example
                error_type = re.search(r'ERROR:\\s*([^\\n\\r]+)', line)
                if error_type:
                    errors[error_type.group(1).strip()] += 1
            
            # Check for warnings
            if re.search(warning_pattern, line, re.IGNORECASE):
                warning_count += 1
            
            # Extract URLs
            url_matches = re.findall(url_pattern, line)
            for url in url_matches:
                urls[url] += 1
    
    # Generate the report
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(f"Log Analysis Report for {log_file}\\n")
        f.write(f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\\n\\n")
        
        f.write(f"Total lines processed: {line_count}\\n")
        f.write(f"Total errors: {error_count} ({error_count/line_count*100:.2f}%)\\n")
        f.write(f"Total warnings: {warning_count} ({warning_count/line_count*100:.2f}%)\\n\\n")
        
        if timestamps:
            f.write(f"Time span: {timestamps[0]} to {timestamps[-1]}\\n\\n")
        
        f.write("Top 10 IP addresses:\\n")
        for ip, count in ip_addresses.most_common(10):
            f.write(f"  {ip}: {count} requests\\n")
        f.write("\\n")
        
        f.write("Top 10 URLs:\\n")
        for url, count in urls.most_common(10):
            f.write(f"  {url}: {count} requests\\n")
        f.write("\\n")
        
        f.write("Top 10 Errors:\\n")
        for error, count in sorted(errors.items(), key=lambda x: x[1], reverse=True)[:10]:
            f.write(f"  {error}: {count} occurrences\\n")
    
    print(f"Analysis complete. Report saved to: {output_file}")
    return output_file

# Example usage
log_file = "/path/to/your/logfile.log"
analyze_logs(log_file)`,
    },
  ];
  
  const useTemplate = (template: ScriptTemplate) => {
    const newScript = addScript({
      name: template.name,
      description: template.description,
      code: template.code,
      type: template.type,
      status: 'idle',
      lastRun: null,
      schedule: null,
    });
    
    navigate(`/edit/${newScript.id}`);
  };
  
  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-primary-800 mb-6">Script Templates</h1>
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-5 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Choose a Template</h2>
          <p className="text-gray-600">Get started quickly with these pre-built automation scripts</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {templates.map((template) => (
            <div key={template.id} className="border border-gray-200 rounded-lg overflow-hidden transition-all hover:shadow-md">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-medium text-primary-800">{template.name}</h3>
              </div>
              
              <div className="p-4">
                <p className="text-gray-600 mb-4">{template.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {template.tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      <Tag size={12} className="mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
                
                <button
                  onClick={() => useTemplate(template)}
                  className="w-full mt-2 px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors flex items-center justify-center"
                >
                  <Copy size={16} className="mr-2" />
                  Use Template
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Templates;