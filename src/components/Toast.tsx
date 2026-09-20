import React from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useAttendance();

  if (!toastMessage) return null;

  const isSuccess = toastMessage.type === 'success';
  const isAlert = toastMessage.type === 'alert';

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-bounce-in max-w-sm">
      <div className={`p-3.5 rounded-2xl shadow-xl border flex items-center space-x-3 text-xs backdrop-blur-md ${
        isAlert
          ? 'bg-rose-900/90 border-rose-700 text-white'
          : isSuccess
          ? 'bg-emerald-900/90 border-emerald-700 text-white'
          : 'bg-neutral-900/90 dark:bg-neutral-100/90 dark:text-neutral-900 border-neutral-700 dark:border-neutral-300 text-white'
      }`}>
        {isAlert && <AlertCircle className="w-4 h-4 text-rose-300 shrink-0" />}
        {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />}
        {!isAlert && !isSuccess && <Info className="w-4 h-4 text-neutral-300 dark:text-neutral-600 shrink-0" />}
        <span className="font-medium leading-snug">{toastMessage.text}</span>
      </div>
    </div>
  );
};
