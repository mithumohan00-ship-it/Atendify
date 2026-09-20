import React from 'react';
import { 
  Search, 
  CheckCheck, 
  Send, 
  RotateCcw, 
  Filter
} from 'lucide-react';
import { useAttendance } from '../context/AttendanceContext';
import { AttendanceStatus } from '../types';

interface ActionBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: AttendanceStatus | 'all';
  setStatusFilter: (filter: AttendanceStatus | 'all') => void;
}

export const ActionBar: React.FC<ActionBarProps> = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
}) => {
  const { 
    markAllPresent, 
    notifyAllAbsent, 
    resetAttendance, 
    students, 
    attendanceMap 
  } = useAttendance();

  const absentCount = students.filter(s => attendanceMap[s.id]?.status === 'absent').length;

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-5">
      
      {/* Search & Status Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1">
        
        {/* Search Input - Full width on mobile */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search student or roll number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-400 dark:focus:ring-neutral-600 transition-all placeholder:text-neutral-400"
          />
        </div>

        {/* Filter Dropdown / Pills - Horizontally scrollable on mobile */}
        <div className="flex items-center space-x-1 bg-neutral-100 dark:bg-neutral-900 p-1 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs overflow-x-auto shrink-0">
          <Filter className="w-3.5 h-3.5 text-neutral-400 ml-1.5 hidden sm:block shrink-0" />
          {(['all', 'present', 'absent', 'late', 'unmarked'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-2.5 py-1 rounded-lg capitalize font-medium transition-all shrink-0 ${
                statusFilter === filter
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

      </div>

      {/* Batch Actions - Responsive wrap */}
      <div className="flex flex-wrap items-center gap-2 pt-1 md:pt-0">
        
        {/* Mark All Present */}
        <button
          onClick={markAllPresent}
          className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors active:scale-95 whitespace-nowrap"
          title="Mark all students as present"
        >
          <CheckCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Mark All Present</span>
        </button>

        {/* Notify All Absent Parents */}
        <button
          onClick={notifyAllAbsent}
          disabled={absentCount === 0}
          className={`flex-1 sm:flex-none inline-flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all active:scale-95 whitespace-nowrap ${
            absentCount > 0
              ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 cursor-pointer shadow-sm'
              : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-400 border border-neutral-200 dark:border-neutral-800 cursor-not-allowed opacity-60'
          }`}
          title="Send instant alert to all absent students' parents"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Notify Parents ({absentCount})</span>
        </button>

        {/* Reset Attendance */}
        <button
          onClick={resetAttendance}
          className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors shrink-0"
          title="Reset Attendance for Selected Date"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

      </div>

    </div>
  );
};
