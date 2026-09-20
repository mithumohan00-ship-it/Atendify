import React, { useState, useEffect } from 'react';
import { 
  X, 
  UserCheck, 
  Save, 
  Briefcase, 
  Mail, 
  Phone, 
  MapPin, 
  Trash2, 
  AlertTriangle,
  Users
} from 'lucide-react';
import { useAttendance } from '../context/AttendanceContext';

export const EditTrainerModal: React.FC = () => {
  const { 
    editingTrainer, 
    isEditTrainerModalOpen, 
    setIsEditTrainerModalOpen, 
    updateTrainer, 
    deleteTrainer,
    allStudents
  } = useAttendance();

  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    batch: '',
    room: '',
    email: '',
    phone: ''
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync form data whenever editingTrainer changes
  useEffect(() => {
    if (editingTrainer) {
      setFormData({
        name: editingTrainer.name || '',
        specialization: editingTrainer.specialization || '',
        batch: editingTrainer.batch || '',
        room: editingTrainer.room || '',
        email: editingTrainer.email || '',
        phone: editingTrainer.phone || ''
      });
      setShowDeleteConfirm(false);
    }
  }, [editingTrainer]);

  if (!isEditTrainerModalOpen || !editingTrainer) return null;

  const assignedCount = allStudents.filter(s => s.trainerId === editingTrainer.id).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.specialization.trim()) return;

    setIsSubmitting(true);
    try {
      await updateTrainer(editingTrainer.id, {
        name: formData.name.trim(),
        specialization: formData.specialization.trim(),
        batch: formData.batch.trim() || 'General Batch',
        room: formData.room.trim() || 'Lab 1',
        email: formData.email.trim(),
        phone: formData.phone.trim()
      });
      setIsEditTrainerModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await deleteTrainer(editingTrainer.id);
      setIsEditTrainerModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-scale-in">
        
        {/* Header */}
        <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                Edit Trainer Details
              </h3>
              <p className="text-[11px] text-neutral-400">
                Update trainer profile, specialization, and room info
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsEditTrainerModalOpen(false)}
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
                <MapPin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
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
                <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
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
                <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
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

          {/* Assigned Students Summary Notice */}
          <div className="flex items-center space-x-2 p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/70 dark:border-neutral-700/60 text-[11px] text-neutral-500 dark:text-neutral-400">
            <Users className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span>
              <strong>{assignedCount} students</strong> currently assigned to this trainer
            </span>
          </div>

          {/* Delete Confirmation Box */}
          {showDeleteConfirm ? (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 space-y-2.5 animate-scale-in">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-rose-900 dark:text-rose-200 text-xs">
                    Delete "{editingTrainer.name}"?
                  </p>
                  <p className="text-[11px] text-rose-700 dark:text-rose-300 mt-0.5 leading-relaxed">
                    This will permanently remove this trainer from Supabase.
                    {assignedCount > 0 && ` (Warning: ${assignedCount} assigned student(s) will be affected).`}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-medium hover:bg-white dark:hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  className="flex-1 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Deleting...' : 'Confirm Delete'}
                </button>
              </div>
            </div>
          ) : null}

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-between space-x-2">
            {!showDeleteConfirm && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                title="Delete Trainer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <div className="flex-1 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsEditTrainerModalOpen(false)}
                className="py-2.5 px-4 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="py-2.5 px-5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-sm flex items-center justify-center space-x-1.5 disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
