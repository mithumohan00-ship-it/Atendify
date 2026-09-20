import React, { useState } from 'react';
import { X, UserCheck, Plus, Briefcase, Mail, Phone, MapPin } from 'lucide-react';
import { useAttendance } from '../context/AttendanceContext';

export const AddTrainerModal: React.FC = () => {
  const { isAddTrainerModalOpen, setIsAddTrainerModalOpen, addTrainer } = useAttendance();

  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    batch: '',
    room: '',
    email: '',
    phone: '',
    branch: 'Branch 2'
  });

  if (!isAddTrainerModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.specialization) return;

    await addTrainer({
      name: formData.name,
      specialization: formData.specialization,
      batch: formData.batch || 'General Batch',
      room: formData.room || 'Training Lab 1',
      email: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, '.')}@attendify.tech`,
      phone: formData.phone || '+1 (555) 000-0000',
      branch: formData.branch || 'Branch 2'
    });

    setFormData({
      name: '',
      specialization: '',
      batch: '',
      room: '',
      email: '',
      phone: '',
      branch: 'Branch 2'
    });
    setIsAddTrainerModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                Add New Trainer
              </h3>
              <p className="text-[11px] text-neutral-400">
                Register a trainer to assign students and track attendance
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAddTrainerModalOpen(false)}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          
          <div>
            <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-medium">
              Trainer Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Marcus Vance"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-400 text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-medium">
              Specialization / Domain *
            </label>
            <div className="relative">
              <Briefcase className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                required
                placeholder="e.g. Full Stack Web Development"
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-400 text-xs"
              />
            </div>
          </div>

          {/* Branch Selection */}
          <div>
            <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-medium flex items-center justify-between">
              <span>Branch Assignment *</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-normal">
                Branch 2 has WhatsApp Group access
              </span>
            </label>
            <select
              value={formData.branch}
              onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-400 text-xs font-medium cursor-pointer"
            >
              <option value="Branch 2">Branch 2 (Has WhatsApp Group Sharing Access)</option>
              <option value="Branch 1">Branch 1</option>
              <option value="Branch 3">Branch 3</option>
              <option value="Main Campus">Main Campus</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-medium">
                Batch / Cohort
              </label>
              <input
                type="text"
                placeholder="e.g. Cohort Alpha (Morning)"
                value={formData.batch}
                onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-400 text-xs"
              />
            </div>

            <div>
              <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-medium">
                Room / Lab
              </label>
              <div className="relative">
                <MapPin className="w-3 h-3 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="e.g. Code Lab 01"
                  value={formData.room}
                  onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-400 text-xs font-mono"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-medium">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-3 h-3 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="email"
                  placeholder="trainer@attendify.tech"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-400 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-medium">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-3 h-3 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-400 text-xs font-mono"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setIsAddTrainerModalOpen(false)}
              className="flex-1 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-sm flex items-center justify-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register Trainer</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
