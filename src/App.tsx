import React, { useState, useMemo } from 'react';
import { AttendanceProvider, useAttendance } from './context/AttendanceContext';
import { LandingPage } from './components/LandingPage';
import { TrainerSelectionPage } from './components/TrainerSelectionPage';
import { Header } from './components/Header';
import { StatsBar } from './components/StatsBar';
import { ActionBar } from './components/ActionBar';
import { AttendanceList } from './components/AttendanceList';
import { ParentSimulatorModal } from './components/ParentSimulatorModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { AddStudentModal } from './components/AddStudentModal';
import { ImportStudentsModal } from './components/ImportStudentsModal';
import { EditTrainerModal } from './components/EditTrainerModal';
import { DatabaseModal } from './components/DatabaseModal';
import { Toast } from './components/Toast';
import { AttendanceStatus } from './types';
import { Database, ShieldCheck, Briefcase, Pencil } from 'lucide-react';
import { isSupabaseConfigured } from './services/supabaseClient';

const AttendanceDashboard: React.FC = () => {
  const { 
    students, 
    attendanceMap, 
    activeTrainer, 
    selectedDate, 
    dbStatus, 
    setIsDbModalOpen,
    openEditTrainerModal
  } = useAttendance();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<AttendanceStatus | 'all'>('all');

  // Filtered student list
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      // Search filter
      const matchesSearch = 
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.parentName.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Status filter
      if (statusFilter === 'all') return true;
      const status = attendanceMap[student.id]?.status || 'unmarked';
      return status === statusFilter;
    });
  }, [students, attendanceMap, searchQuery, statusFilter]);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50/60 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-neutral-900">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Trainer Banner / Subheading */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-neutral-200/60 dark:border-neutral-800/60 gap-2">
          <div>
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-950 dark:text-white">
                Trainer: {activeTrainer?.name}
              </h1>
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
                <Briefcase className="w-3 h-3 text-neutral-400" />
                <span>{activeTrainer?.specialization}</span>
              </span>
              {activeTrainer && (
                <button
                  onClick={() => openEditTrainerModal(activeTrainer)}
                  className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/70 dark:hover:bg-neutral-800 transition-colors border border-neutral-200/80 dark:border-neutral-700/80 cursor-pointer"
                  title="Edit Trainer Details"
                >
                  <Pencil className="w-3 h-3 text-neutral-400" />
                  <span>Edit Details</span>
                </button>
              )}
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Batch: {activeTrainer?.batch} &bull; Room: {activeTrainer?.room} &bull; Email: {activeTrainer?.email}
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono text-neutral-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Assigned Students Roster &bull; {selectedDate}</span>
          </div>
        </div>

        {/* Real-time Attendance & Absentee Metrics */}
        <StatsBar />

        {/* Controls: Search, Filters, Batch Actions */}
        <ActionBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        {/* Interactive Attendance Roster */}
        <AttendanceList students={filteredStudents} />

        {/* Minimalist Feature Indicator Callout */}
        <div className="mt-8 p-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </div>
            <div>
              <p className="font-medium text-neutral-900 dark:text-neutral-100">
                Automated Absence Notifications to Parents
              </p>
              <p className="text-neutral-400 text-[11px]">
                Marking any student "Absent" immediately stages an alert mentioning Trainer {activeTrainer?.name} and their session.
              </p>
            </div>
          </div>

          <button 
            onClick={() => setIsDbModalOpen(true)}
            className="flex items-center space-x-2 text-[11px] px-2.5 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer group"
          >
            <Database className={`w-3.5 h-3.5 ${dbStatus.hasTables ? 'text-emerald-500' : 'text-amber-500'} group-hover:scale-110 transition-transform`} />
            {dbStatus.hasTables ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                Supabase Cloud Active
              </span>
            ) : isSupabaseConfigured ? (
              <span className="text-amber-600 dark:text-amber-400 font-medium flex items-center space-x-1">
                <span>Tables Pending Setup</span>
                <span className="text-[10px] underline ml-1">Configure</span>
              </span>
            ) : (
              <span className="text-neutral-400">
                Local Storage Mode &bull; Configure Supabase
              </span>
            )}
          </button>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800/80 py-6 text-xs text-neutral-500 dark:text-neutral-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Attendify &copy; {new Date().getFullYear()} &bull; Minimalist Attendance &amp; Parent Alert Platform</span>
          <span className="font-medium text-neutral-700 dark:text-neutral-300">
            Developed by <span className="font-semibold text-neutral-950 dark:text-white">Mithu Mohan</span>
          </span>
        </div>
      </footer>

      {/* Interactive Overlays */}
      <ParentSimulatorModal />
      <NotificationDrawer />
      <AddStudentModal />
    </div>
  );
};

const MainRouter: React.FC = () => {
  const { currentView } = useAttendance();

  return (
    <>
      {currentView === 'landing' && <LandingPage />}
      {currentView === 'trainers' && <TrainerSelectionPage />}
      {currentView === 'attendance' && <AttendanceDashboard />}
      <DatabaseModal />
      <EditTrainerModal />
      <ImportStudentsModal />
      <Toast />
    </>
  );
};

export function App() {
  return (
    <AttendanceProvider>
      <MainRouter />
    </AttendanceProvider>
  );
}

export default App;
