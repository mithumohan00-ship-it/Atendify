import React from 'react';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Bell, 
  Moon, 
  Sun, 
  UserPlus, 
  UserCheck,
  Database,
  FileSpreadsheet
} from 'lucide-react';
import { useAttendance } from '../context/AttendanceContext';

export const Header: React.FC = () => {
  const { 
    trainers, 
    activeTrainer, 
    setActiveTrainerId, 
    selectedDate, 
    setSelectedDate, 
    notifications,
    isDarkMode, 
    toggleDarkMode, 
    setIsNotificationDrawerOpen,
    setIsAddStudentModalOpen,
    setIsImportModalOpen,
    setCurrentView,
    dbStatus,
    setIsDbModalOpen 
  } = useAttendance();

  // Date Navigation Helpers
  const shiftDate = (offset: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + offset);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  const todayNotificationsCount = notifications.length;

  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-white/80 dark:bg-neutral-900/80 border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand & Back button */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setCurrentView('trainers')}
              className="inline-flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              title="Return to Trainers list"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Trainers</span>
            </button>

            <div className="h-4 w-[1px] bg-neutral-200 dark:bg-neutral-800" />

            <div 
              onClick={() => setCurrentView('landing')}
              className="flex items-center space-x-2.5 cursor-pointer"
              title="Return to Intro"
            >
              <div className="h-8 w-8 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center font-bold text-sm shadow-sm">
                A
              </div>
              <div>
                <span className="font-semibold text-base tracking-tight">Attendify</span>
              </div>
            </div>
          </div>

          {/* Center: Trainer & Date Selectors */}
          <div className="hidden md:flex items-center space-x-2 bg-neutral-100/70 dark:bg-neutral-800/70 p-1 rounded-xl border border-neutral-200/60 dark:border-neutral-700/60">
            
            {/* Trainer Dropdown */}
            <div className="flex items-center px-2 py-1 space-x-1.5 text-xs text-neutral-700 dark:text-neutral-300">
              <UserCheck className="w-3.5 h-3.5 text-neutral-400" />
              <select
                value={activeTrainer?.id || ''}
                onChange={(e) => setActiveTrainerId(e.target.value)}
                className="bg-transparent font-medium focus:outline-none cursor-pointer text-xs"
              >
                {trainers.map((trainer) => (
                  <option key={trainer.id} value={trainer.id} className="dark:bg-neutral-900">
                    {trainer.name} ({trainer.specialization})
                  </option>
                ))}
              </select>
            </div>

            <div className="h-4 w-[1px] bg-neutral-300 dark:bg-neutral-700" />

            {/* Date Nav */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => shiftDate(-1)}
                className="p-1 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400 transition-colors"
                title="Previous Day"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center space-x-1.5 px-2 py-1 text-xs">
                <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent font-mono text-xs focus:outline-none cursor-pointer"
                />
              </div>

              <button
                onClick={() => shiftDate(1)}
                className="p-1 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400 transition-colors"
                title="Next Day"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              {!isToday && (
                <button
                  onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                  className="text-[10px] font-medium px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-300 transition-colors ml-1"
                >
                  Today
                </button>
              )}
            </div>

          </div>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Add Student Button */}
            <button
              onClick={() => setIsAddStudentModalOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Student</span>
            </button>

            {/* Import from Excel Button */}
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 transition-all active:scale-95 cursor-pointer"
              title="Import students from Excel or CSV spreadsheet"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">Import Excel</span>
            </button>

            {/* Supabase Database Status Trigger */}
            <button
              onClick={() => setIsDbModalOpen(true)}
              className="relative p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors border border-neutral-200 dark:border-neutral-800"
              title={dbStatus.hasTables ? "Supabase Cloud Active" : "Supabase Tables Setup Required"}
            >
              <Database className="w-4 h-4" />
              <span className={`absolute -top-0.5 -right-0.5 flex h-2 w-2 rounded-full ${dbStatus.hasTables ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            </button>

            {/* Notification Drawer Trigger */}
            <button
              onClick={() => setIsNotificationDrawerOpen(true)}
              className="relative p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors border border-neutral-200 dark:border-neutral-800"
              title="Parent Notification Hub"
            >
              <Bell className="w-4 h-4" />
              {todayNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-neutral-900 animate-pulse">
                  {todayNotificationsCount}
                </span>
              )}
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors border border-neutral-200 dark:border-neutral-800"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

          </div>

        </div>

        {/* Mobile Trainer & Date Bar */}
        <div className="md:hidden py-2 border-t border-neutral-200/60 dark:border-neutral-800/60 flex items-center justify-between gap-2 text-xs">
          <div className="flex-1 min-w-0 flex items-center space-x-1">
            <UserCheck className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <select
              value={activeTrainer?.id || ''}
              onChange={(e) => setActiveTrainerId(e.target.value)}
              className="w-full bg-transparent font-medium text-xs focus:outline-none py-1 dark:bg-neutral-900 truncate"
            >
              {trainers.map((trainer) => (
                <option key={trainer.id} value={trainer.id} className="dark:bg-neutral-900">
                  {trainer.name} ({trainer.specialization})
                </option>
              ))}
            </select>
          </div>
          <div className="shrink-0 flex items-center space-x-1 pl-2 border-l border-neutral-200 dark:border-neutral-800">
            <Calendar className="w-3 h-3 text-neutral-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent font-mono text-xs focus:outline-none w-28 text-right"
            />
          </div>
        </div>

      </div>
    </header>
  );
};
