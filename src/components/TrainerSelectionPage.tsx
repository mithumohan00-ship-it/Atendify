import React from 'react';
import { 
  Plus, 
  ArrowLeft, 
  ArrowRight, 
  Users, 
  Briefcase, 
  MapPin, 
  UserCheck, 
  Calendar, 
  Sun, 
  Moon,
  ChevronLeft,
  ChevronRight,
  Clock,
  AlertCircle,
  Mail,
  Database,
  Pencil,
  MessageCircle
} from 'lucide-react';
import { useAttendance } from '../context/AttendanceContext';
import { AddTrainerModal } from './AddTrainerModal';
import { EditTrainerModal } from './EditTrainerModal';

export const TrainerSelectionPage: React.FC = () => {
  const { 
    trainers, 
    selectTrainerAndProceed, 
    setIsAddTrainerModalOpen, 
    selectedDate, 
    setSelectedDate,
    getTrainerSummary,
    setCurrentView,
    isDarkMode, 
    toggleDarkMode,
    dbStatus,
    setIsDbModalOpen,
    openEditTrainerModal,
    isBranch2Trainer
  } = useAttendance();

  const shiftDate = (offset: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + offset);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-neutral-50/60 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-neutral-900 flex flex-col">
      
      {/* Top Bar */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-white/80 dark:bg-neutral-900/80 border-b border-neutral-200 dark:border-neutral-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Left: Intro link + Logo */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={() => setCurrentView('landing')}
              className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Intro</span>
            </button>
            <div className="h-4 w-[1px] bg-neutral-200 dark:bg-neutral-800" />
            <div className="flex items-center space-x-2">
              <div className="h-7 w-7 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center font-bold text-xs">
                A
              </div>
              <span className="font-semibold text-sm tracking-tight hidden xs:inline">Attendify</span>
            </div>
          </div>

          {/* Desktop Date Selector */}
          <div className="hidden sm:flex items-center space-x-1 bg-neutral-100/70 dark:bg-neutral-800/70 p-1 rounded-xl border border-neutral-200/60 dark:border-neutral-700/60 text-xs">
            <button
              onClick={() => shiftDate(-1)}
              className="p-1 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400"
              title="Previous Day"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center space-x-1.5 px-2 py-0.5 font-mono">
              <Calendar className="w-3.5 h-3.5 text-neutral-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent focus:outline-none cursor-pointer text-xs"
              />
            </div>

            <button
              onClick={() => shiftDate(1)}
              className="p-1 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400"
              title="Next Day"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            {!isToday && (
              <button
                onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                className="text-[10px] font-medium px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 ml-1"
              >
                Today
              </button>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsDbModalOpen(true)}
              className="relative p-2 rounded-lg text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 border border-neutral-200 dark:border-neutral-800 transition-colors"
              title={dbStatus.hasTables ? "Supabase Cloud Active" : "Supabase Tables Setup Required"}
            >
              <Database className="w-4 h-4" />
              <span className={`absolute -top-0.5 -right-0.5 flex h-2 w-2 rounded-full ${dbStatus.hasTables ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            </button>

            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 border border-neutral-200 dark:border-neutral-800 transition-colors"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

        </div>

        {/* Mobile Date Selector Bar */}
        <div className="sm:hidden px-4 py-2 border-t border-neutral-200/60 dark:border-neutral-800/60 flex items-center justify-between text-xs bg-neutral-50/50 dark:bg-neutral-900/50">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => shiftDate(-1)}
              className="p-1 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center space-x-1 font-mono text-xs">
              <Calendar className="w-3.5 h-3.5 text-neutral-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent focus:outline-none"
              />
            </div>
            <button
              onClick={() => shiftDate(1)}
              className="p-1 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {!isToday && (
            <button
              onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
              className="text-[10px] font-medium px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300"
            >
              Today
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        
        {/* Page Header with "Add Trainer" Option */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-neutral-200/60 dark:border-neutral-800/60 gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-bold tracking-tight text-neutral-950 dark:text-white">
                Select Trainer to Mark Attendance
              </h2>
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
                {trainers.length} Trainers
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Select a trainer to access their assigned student roster for <span className="font-mono font-medium text-neutral-800 dark:text-neutral-200">{selectedDate}</span>.
            </p>
          </div>

          {/* ADD TRAINER BUTTON */}
          <button
            onClick={() => setIsAddTrainerModalOpen(true)}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all shadow-sm active:scale-95 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Trainer</span>
          </button>
        </div>

        {/* Trainers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
          {trainers.map((trainer) => {
            const stats = getTrainerSummary(trainer.id);
            const isCompleted = stats.total > 0 && stats.marked === stats.total;
            const isPending = stats.marked === 0;

            return (
              <div
                key={trainer.id}
                onClick={() => selectTrainerAndProceed(trainer.id)}
                className="group relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-700 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Trainer Batch & Branch Badge & Roll Status */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                      <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200/60 dark:border-neutral-700/60">
                        {trainer.batch}
                      </span>
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md border flex items-center space-x-1 ${
                        isBranch2Trainer(trainer)
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700'
                      }`}>
                        {isBranch2Trainer(trainer) && (
                          <MessageCircle className="w-3 h-3 fill-current text-emerald-600 dark:text-emerald-400" />
                        )}
                        <span>{trainer.branch || 'Branch 2'}</span>
                      </span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      {/* Status Pill */}
                      {isCompleted ? (
                        <span className="inline-flex items-center space-x-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                          <UserCheck className="w-3 h-3 text-emerald-500" />
                          <span>Completed</span>
                        </span>
                      ) : isPending ? (
                        <span className="inline-flex items-center space-x-1 text-[11px] font-medium text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800/60">
                          <Clock className="w-3 h-3 text-amber-500" />
                          <span>Not Marked</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 text-[11px] font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800/60">
                          <span>{stats.marked}/{stats.total} In Progress</span>
                        </span>
                      )}

                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditTrainerModal(trainer);
                        }}
                        className="p-1 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        title={`Edit ${trainer.name}'s details`}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Specialization */}
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 flex items-center justify-center font-bold text-sm">
                      {trainer.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-neutral-900 dark:text-white group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors">
                        {trainer.name}
                      </h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium flex items-center space-x-1 mt-0.5">
                        <Briefcase className="w-3 h-3 text-neutral-400" />
                        <span>{trainer.specialization}</span>
                      </p>
                    </div>
                  </div>

                  {/* Metadata: Room & Contact */}
                  <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 text-xs text-neutral-500 dark:text-neutral-400 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center space-x-1 text-neutral-400">
                        <MapPin className="w-3 h-3" />
                        <span>Location:</span>
                      </span>
                      <span className="font-mono text-neutral-800 dark:text-neutral-200">{trainer.room}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center space-x-1 text-neutral-400">
                        <Mail className="w-3 h-3" />
                        <span>Contact:</span>
                      </span>
                      <span className="font-mono text-[11px] text-neutral-800 dark:text-neutral-200 truncate max-w-[160px]">{trainer.email}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center space-x-1 text-neutral-400">
                        <Users className="w-3 h-3" />
                        <span>Assigned Students:</span>
                      </span>
                      <span className="font-mono font-semibold text-neutral-900 dark:text-neutral-100">{stats.total} students</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Mark Attendance Action */}
                <div className="mt-5 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
                  {stats.absent > 0 ? (
                    <span className="inline-flex items-center space-x-1 text-rose-600 dark:text-rose-400 text-[11px] font-medium">
                      <AlertCircle className="w-3 h-3" />
                      <span>{stats.absent} Parent Notices Sent</span>
                    </span>
                  ) : stats.marked > 0 ? (
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                      {stats.present} Present ({Math.round((stats.present / stats.marked) * 100)}%)
                    </span>
                  ) : (
                    <span className="text-[11px] text-neutral-400">
                      Ready for roll call
                    </span>
                  )}

                  <div className="inline-flex items-center space-x-1 font-semibold text-neutral-900 dark:text-white group-hover:translate-x-0.5 transition-transform">
                    <span>Mark</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 py-6 text-xs text-neutral-500 dark:text-neutral-400 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Attendify &copy; {new Date().getFullYear()} &bull; Trainer Cohorts &amp; Attendance</span>
          <span className="font-medium text-neutral-700 dark:text-neutral-300">
            Developed by <span className="font-semibold text-neutral-950 dark:text-white">Mithu Mohan</span>
          </span>
        </div>
      </footer>

      <AddTrainerModal />
      <EditTrainerModal />
    </div>
  );
};
