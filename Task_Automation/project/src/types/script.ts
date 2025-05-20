export type ScriptType = 
  | 'file-organization' 
  | 'data-cleaning' 
  | 'system-maintenance' 
  | 'web-scraping' 
  | 'backup' 
  | 'notification' 
  | 'custom';

export type ScriptStatus = 
  | 'idle' 
  | 'running' 
  | 'completed' 
  | 'failed' 
  | 'scheduled';

export interface Schedule {
  frequency: 'once' | 'daily' | 'weekly' | 'monthly' | 'custom';
  time?: string;
  days?: string[];
  date?: string;
  cronExpression?: string;
}

export interface LogEntry {
  timestamp: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
}

export interface Script {
  id: string;
  name: string;
  description: string;
  code: string;
  type: ScriptType;
  status: ScriptStatus;
  createdAt: string;
  lastRun: string | null;
  schedule: Schedule | null;
  logs: LogEntry[];
}

export interface ScriptTemplate {
  id: string;
  name: string;
  description: string;
  code: string;
  type: ScriptType;
  tags: string[];
}