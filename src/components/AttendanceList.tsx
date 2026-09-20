import React from 'react';
import { 
  Check, 
  X, 
  Clock, 
  HelpCircle, 
  Smartphone, 
  MessageSquare, 
  PhoneCall
} from 'lucide-react';
import { useAttendance } from '../context/AttendanceContext';
import { AttendanceStatus, Student } from '../types';

interface AttendanceListProps {
  students: Student[];
}

export const AttendanceList: React.FC<AttendanceListProps> = ({ students }) => {
  const { 
    attendanceMap, 
    markAttendance, 
    selectedDate, 
    activeTrainer,
    setIsSimulatorOpen, 
    setActiveSimulatorStudent 
  } = useAttendance();

  // Helper for status classes
  const getStatusButtonClass = (studentStatus: AttendanceStatus, targetStatus: AttendanceStatus) => {
    const isSelected = studentStatus === targetStatus;
    
    if (targetStatus === 'present') {
      return isSelected
        ? 'bg-emerald-600 text-white font-medium shadow-sm ring-2 ring-emerald-500/20'
        : 'hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300 text-neutral-600 dark:text-neutral-400';
    }
    if (targetStatus === 'absent') {
      return isSelected
        ? 'bg-rose-600 text-white font-medium shadow-sm ring-2 ring-rose-500/20'
        : 'hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/40 dark:hover:text-rose-300 text-neutral-600 dark:text-neutral-400';
    }
    if (targetStatus === 'late') {
      return isSelected
        ? 'bg-amber-500 text-white font-medium shadow-sm ring-2 ring-amber-500/20'
        : 'hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-amber-950/40 dark:hover:text-amber-300 text-neutral-600 dark:text-neutral-400';
    }
    return isSelected
      ? 'bg-neutral-800 text-white dark:bg-neutral-200 dark:text-neutral-900 font-medium shadow-sm'
      : 'hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-200 text-neutral-500';
  };

  // Open live Phone Simulator
  const handleOpenSimulator = (student: Student) => {
    setActiveSimulatorStudent(student);
    setIsSimulatorOpen(true);
  };

  // Direct WhatsApp Web Trigger
  const handleDirectWhatsApp = (student: Student) => {
    const cleanPhone = student.parentPhone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Hello ${student.parentName},\nThis is an official notice from Trainer ${activeTrainer?.name || 'Academy'}. Your ward ${student.name} (ID: ${student.rollNumber}) was marked ABSENT today (${selectedDate}) for the ${activeTrainer?.specialization || 'training'} session. Please let us know if this was planned or an error.`
    );
    window.open(`https://api.whatsapp.com/send?phone=${cleanPhone}&text=${message}`, '_blank');
  };

  if (students.length === 0) {
    return (
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-12 text-center">
        <p className="text-neutral-400 text-sm">No students found matching current filters.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm overflow-hidden">
      
      {/* Table Header */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-neutral-50/70 dark:bg-neutral-800/40 border-b border-neutral-200/60 dark:border-neutral-800/60 text-[11px] font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
        <div className="col-span-1">Roll</div>
        <div className="col-span-4">Student & Parent Info</div>
        <div className="col-span-4 text-center">Attendance Status</div>
        <div className="col-span-3 text-right">Parent Alert & Actions</div>
      </div>

      {/* Table Rows */}
      <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
        {students.map((student) => {
          const record = attendanceMap[student.id];
          const status: AttendanceStatus = record?.status || 'unmarked';
          const isAbsent = status === 'absent';

          return (
            <div 
              key={student.id}
              className={`p-4 md:px-6 md:py-3.5 transition-colors flex flex-col md:grid md:grid-cols-12 md:gap-4 md:items-center ${
                isAbsent 
                  ? 'bg-rose-50/30 dark:bg-rose-950/10' 
                  : 'hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20'
              }`}
            >
              
              {/* Roll Number */}
              <div className="col-span-1 hidden md:block">
                <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                  {student.rollNumber}
                </span>
              </div>

              {/* Student & Parent Info */}
              <div className="col-span-4 flex items-center space-x-3 mb-3 md:mb-0">
                {/* Minimal Avatar */}
                <div className={`h-9 w-9 rounded-xl flex items-center justify-center font-semibold text-xs transition-colors shrink-0 ${
                  isAbsent 
                    ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800' 
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700'
                }`}>
                  {student.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm text-neutral-900 dark:text-neutral-100 truncate">
                      {student.name}
                    </span>
                    <span className="md:hidden text-[11px] font-mono text-neutral-400">
                      #{student.rollNumber}
                    </span>
                  </div>

                  {/* Parent Info Line */}
                  <div className="flex items-center space-x-2 text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                    <span className="truncate">
                      {student.parentRelation}: {student.parentName}
                    </span>
                    <span>&bull;</span>
                    <span className="font-mono text-[11px] truncate">
                      {student.parentPhone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Buttons */}
              <div className="col-span-4 grid grid-cols-3 sm:flex sm:items-center sm:justify-center gap-1.5 my-2.5 md:my-0 w-full md:w-auto">
                
                {/* Present */}
                <button
                  onClick={() => markAttendance(student.id, 'present')}
                  className={`flex items-center justify-center space-x-1 px-2.5 sm:px-3 py-2 sm:py-1.5 rounded-lg text-xs transition-all ${getStatusButtonClass(status, 'present')}`}
                >
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>Present</span>
                </button>

                {/* Absent */}
                <button
                  onClick={() => markAttendance(student.id, 'absent')}
                  className={`flex items-center justify-center space-x-1 px-2.5 sm:px-3 py-2 sm:py-1.5 rounded-lg text-xs transition-all ${getStatusButtonClass(status, 'absent')}`}
                >
                  <X className="w-3.5 h-3.5 shrink-0" />
                  <span>Absent</span>
                </button>

                {/* Late */}
                <button
                  onClick={() => markAttendance(student.id, 'late')}
                  className={`flex items-center justify-center space-x-1 px-2.5 sm:px-3 py-2 sm:py-1.5 rounded-lg text-xs transition-all ${getStatusButtonClass(status, 'late')}`}
                >
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span>Late</span>
                </button>

                {/* Excused */}
                <button
                  onClick={() => markAttendance(student.id, 'excused')}
                  className={`hidden lg:flex items-center justify-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs transition-all ${getStatusButtonClass(status, 'excused')}`}
                  title="Excused Absence"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>

              </div>

              {/* Parent Alert Status & Actions */}
              <div className="col-span-3 flex items-center justify-between md:justify-end space-x-2 mt-2 md:mt-0 pt-2 md:pt-0 border-t md:border-0 border-neutral-100 dark:border-neutral-800 w-full md:w-auto">
                
                {isAbsent ? (
                  <div className="flex items-center justify-between md:justify-end space-x-2 w-full md:w-auto">
                    {/* Simulator Preview Button */}
                    <button
                      onClick={() => handleOpenSimulator(student)}
                      className="flex-1 md:flex-initial inline-flex items-center justify-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-rose-100/70 hover:bg-rose-200/80 dark:bg-rose-950/70 dark:hover:bg-rose-900/80 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 transition-colors"
                      title="Preview how notification looks on parent's phone"
                    >
                      <Smartphone className="w-3 h-3 text-rose-600 dark:text-rose-400 shrink-0" />
                      <span>Preview Alert</span>
                    </button>

                    {/* Direct WhatsApp Action */}
                    <button
                      onClick={() => handleDirectWhatsApp(student)}
                      className="p-1.5 rounded-lg text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 transition-colors shrink-0"
                      title="Open chat on WhatsApp Web"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 text-xs text-neutral-400">
                    <button
                      onClick={() => handleOpenSimulator(student)}
                      className="p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                      title="Test Notification Preview"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                    </button>
                    <a
                      href={`tel:${student.parentPhone}`}
                      className="p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                      title={`Call ${student.parentName}`}
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
