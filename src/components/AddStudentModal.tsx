import React, { useState } from 'react';
import { X, UserPlus, Phone, Mail, UserCheck, FileSpreadsheet } from 'lucide-react';
import { useAttendance } from '../context/AttendanceContext';

export const AddStudentModal: React.FC = () => {
  const { 
    isAddStudentModalOpen, 
    setIsAddStudentModalOpen, 
    setIsImportModalOpen,
    trainers, 
    activeTrainer, 
    addStudent 
  } = useAttendance();

  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    trainerId: activeTrainer?.id || '',
    gender: 'male' as 'male' | 'female' | 'other',
    parentName: '',
    parentRelation: 'Father' as 'Father' | 'Mother' | 'Guardian',
    parentPhone: '',
    parentEmail: ''
  });

  if (!isAddStudentModalOpen) return null;

  const selectedTrainerId = formData.trainerId || activeTrainer?.id || (trainers[0]?.id ?? '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.rollNumber || !formData.parentPhone) return;

    await addStudent({
      ...formData,
      trainerId: selectedTrainerId
    });

    // Reset and close
    setFormData({
      name: '',
      rollNumber: '',
      trainerId: activeTrainer?.id || '',
      gender: 'male',
      parentName: '',
      parentRelation: 'Father',
      parentPhone: '',
      parentEmail: ''
    });
    setIsAddStudentModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-fade-in">
        
        {/* Header */}
        <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                Enroll New Student
              </h3>
              <p className="text-[11px] text-neutral-400">
                Assigning to Trainer {activeTrainer?.name}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAddStudentModalOpen(false)}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          
          {/* Import from Excel shortcut */}
          <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/80 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-[11px] text-neutral-600 dark:text-neutral-400">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Have an Excel or CSV roster?</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsAddStudentModalOpen(false);
                setIsImportModalOpen(true);
              }}
              className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
            >
              Import Excel &rarr;
            </button>
          </div>

          {/* Trainer Assignment */}
          <div>
            <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-medium">
              Assigned Trainer *
            </label>
            <div className="relative">
              <UserCheck className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <select
                value={selectedTrainerId}
                onChange={(e) => setFormData({ ...formData, trainerId: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-400 text-xs font-medium"
              >
                {trainers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} — {t.specialization} ({t.batch})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Student Info */}
          <div className="space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-semibold block">
              Student Details
            </span>

            <div>
              <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-medium">
                Student Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Maya Lin"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-400 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-medium">
                  Student ID / Roll # *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FS-05"
                  value={formData.rollNumber}
                  onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-400 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-medium">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-400 text-xs"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <div className="h-[1px] bg-neutral-100 dark:bg-neutral-800 my-2" />

          {/* Parent/Guardian Info */}
          <div className="space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-semibold block">
              Parent / Guardian Contact
            </span>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-medium">
                  Parent Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jennifer Lin"
                  value={formData.parentName}
                  onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-400 text-xs"
                />
              </div>

              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-medium">
                  Relation
                </label>
                <select
                  value={formData.parentRelation}
                  onChange={(e) => setFormData({ ...formData, parentRelation: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-400 text-xs"
                >
                  <option value="Mother">Mother</option>
                  <option value="Father">Father</option>
                  <option value="Guardian">Guardian</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-medium">
                Parent WhatsApp / Mobile Phone *
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="tel"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={formData.parentPhone}
                  onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-400 text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-medium">
                Parent Email (Optional)
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="email"
                  placeholder="parent@example.com"
                  value={formData.parentEmail}
                  onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-400 text-xs font-mono"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setIsAddStudentModalOpen(false)}
              className="flex-1 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-sm"
            >
              Enroll Student
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
