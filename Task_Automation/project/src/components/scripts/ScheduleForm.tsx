import React, { useState, useEffect } from 'react';
import { Schedule } from '../../types/script';

interface ScheduleFormProps {
  schedule: Schedule | null;
  onSave: (schedule: Schedule) => void;
  onCancel: () => void;
}

const ScheduleForm: React.FC<ScheduleFormProps> = ({ schedule, onSave, onCancel }) => {
  const [frequency, setFrequency] = useState<Schedule['frequency']>('once');
  const [time, setTime] = useState('12:00');
  const [date, setDate] = useState('');
  const [days, setDays] = useState<string[]>([]);
  const [cronExpression, setCronExpression] = useState('');
  
  // Initialize form with existing schedule data
  useEffect(() => {
    if (schedule) {
      setFrequency(schedule.frequency);
      if (schedule.time) setTime(schedule.time);
      if (schedule.date) setDate(schedule.date);
      if (schedule.days) setDays(schedule.days);
      if (schedule.cronExpression) setCronExpression(schedule.cronExpression);
    } else {
      // Set default date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDate(tomorrow.toISOString().split('T')[0]);
    }
  }, [schedule]);
  
  const handleSave = () => {
    const newSchedule: Schedule = {
      frequency,
      time,
    };
    
    if (frequency === 'once' || frequency === 'monthly') {
      newSchedule.date = date;
    }
    
    if (frequency === 'weekly') {
      newSchedule.days = days;
    }
    
    if (frequency === 'custom') {
      newSchedule.cronExpression = cronExpression;
    }
    
    onSave(newSchedule);
  };
  
  const handleDayToggle = (day: string) => {
    if (days.includes(day)) {
      setDays(days.filter(d => d !== day));
    } else {
      setDays([...days, day]);
    }
  };
  
  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-800">Schedule Script</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Frequency
        </label>
        <select
          value={frequency}
          onChange={(e) => setFrequency(e.target.value as Schedule['frequency'])}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
        >
          <option value="once">Run Once</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="custom">Custom (Cron)</option>
        </select>
      </div>
      
      {frequency !== 'custom' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time
          </label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
          />
        </div>
      )}
      
      {(frequency === 'once' || frequency === 'monthly') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
          />
        </div>
      )}
      
      {frequency === 'weekly' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Days of Week
          </label>
          <div className="flex flex-wrap gap-2">
            {weekdays.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => handleDayToggle(day)}
                className={`px-3 py-1 rounded-full text-sm ${
                  days.includes(day)
                    ? 'bg-accent-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {day.substring(0, 3)}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {frequency === 'custom' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cron Expression
          </label>
          <input
            type="text"
            value={cronExpression}
            onChange={(e) => setCronExpression(e.target.value)}
            placeholder="* * * * *"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Format: minute hour day-of-month month day-of-week
          </p>
        </div>
      )}
      
      <div className="flex justify-end space-x-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors"
        >
          Save Schedule
        </button>
      </div>
    </div>
  );
};

export default ScheduleForm;