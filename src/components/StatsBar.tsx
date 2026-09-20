import React from 'react';
import { Users, UserCheck, UserX, Clock, Send } from 'lucide-react';
import { useAttendance } from '../context/AttendanceContext';

export const StatsBar: React.FC = () => {
  const { students, attendanceMap, notifications, setIsNotificationDrawerOpen } = useAttendance();

  const total = students.length;
  let presentCount = 0;
  let absentCount = 0;
  let lateCount = 0;
  let excusedCount = 0;

  students.forEach(student => {
    const record = attendanceMap[student.id];
    if (record?.status === 'present') presentCount++;
    else if (record?.status === 'absent') absentCount++;
    else if (record?.status === 'late') lateCount++;
    else if (record?.status === 'excused') excusedCount++;
  });

  const markedCount = presentCount + absentCount + lateCount + excusedCount;
  const attendanceRate = markedCount > 0 ? Math.round((presentCount / markedCount) * 100) : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-6">
      
      {/* Metric 1: Total & Rate */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 shadow-sm relative overflow-hidden group">
        <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs font-medium">
          <span>Enrolled Students</span>
          <Users className="w-4 h-4 text-neutral-400" />
        </div>
        <div className="mt-2 flex items-baseline space-x-2">
          <span className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
            {total}
          </span>
          <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
            {markedCount}/{total} marked
          </span>
        </div>
        {/* Subtle Progress Bar */}
        <div className="mt-3 w-full bg-neutral-100 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-neutral-900 dark:bg-neutral-100 h-full rounded-full transition-all duration-500"
            style={{ width: `${total > 0 ? (markedCount / total) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Metric 2: Present Rate */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 shadow-sm relative overflow-hidden group">
        <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs font-medium">
          <span>Present Rate</span>
          <UserCheck className="w-4 h-4 text-emerald-500" />
        </div>
        <div className="mt-2 flex items-baseline space-x-2">
          <span className="text-2xl font-semibold tracking-tight text-emerald-600 dark:text-emerald-400">
            {presentCount}
          </span>
          <span className="text-xs font-mono text-emerald-600/80 dark:text-emerald-400/80 font-medium">
            ({attendanceRate}%)
          </span>
        </div>
        <div className="mt-3 w-full bg-emerald-50 dark:bg-emerald-950/40 h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-emerald-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${attendanceRate}%` }}
          />
        </div>
      </div>

      {/* Metric 3: Absentees & Alerts */}
      <div className={`bg-white dark:bg-neutral-900 border rounded-2xl p-4 shadow-sm relative overflow-hidden transition-colors ${
        absentCount > 0 
          ? 'border-rose-200 dark:border-rose-900/40 bg-rose-50/20 dark:bg-rose-950/10' 
          : 'border-neutral-200 dark:border-neutral-800'
      }`}>
        <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs font-medium">
          <span>Absent Today</span>
          <UserX className={`w-4 h-4 ${absentCount > 0 ? 'text-rose-500' : 'text-neutral-400'}`} />
        </div>
        <div className="mt-2 flex items-baseline space-x-2">
          <span className={`text-2xl font-semibold tracking-tight ${
            absentCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-neutral-900 dark:text-white'
          }`}>
            {absentCount}
          </span>
          {absentCount > 0 && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300">
              Alerts active
            </span>
          )}
        </div>
        <div className="mt-3 text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center justify-between">
          <span>Parent notices</span>
          <span className="font-mono font-medium text-rose-600 dark:text-rose-400">
            {notifications.length} queued/sent
          </span>
        </div>
      </div>

      {/* Metric 4: Late & Notifications Hub Trigger */}
      <div 
        onClick={() => setIsNotificationDrawerOpen(true)}
        className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 shadow-sm hover:border-neutral-400 dark:hover:border-neutral-700 cursor-pointer transition-all group"
      >
        <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs font-medium">
          <span>Dispatch Hub</span>
          <Send className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors" />
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
              {notifications.length}
            </span>
            <span className="text-xs text-neutral-400">sent</span>
          </div>
          {lateCount > 0 && (
            <span className="inline-flex items-center space-x-1 text-xs text-amber-600 dark:text-amber-400 font-mono">
              <Clock className="w-3 h-3" />
              <span>{lateCount} late</span>
            </span>
          )}
        </div>
        <div className="mt-3 text-[11px] text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 flex items-center space-x-1 transition-colors">
          <span>Click to view live log & preview &rarr;</span>
        </div>
      </div>

    </div>
  );
};
