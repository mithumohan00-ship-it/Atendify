import React, { useState } from 'react';
import { 
  X, 
  Bell, 
  MessageSquare, 
  Smartphone, 
  Mail, 
  CheckCheck, 
  ExternalLink, 
  Sliders, 
  Check 
} from 'lucide-react';
import { useAttendance } from '../context/AttendanceContext';
import { NotificationChannel } from '../types';

export const NotificationDrawer: React.FC = () => {
  const { 
    isNotificationDrawerOpen, 
    setIsNotificationDrawerOpen, 
    notifications, 
    notificationSettings, 
    updateNotificationSettings,
    selectedDate,
    students,
    setIsSimulatorOpen,
    setActiveSimulatorStudent,
    showToast
  } = useAttendance();

  const [activeTab, setActiveTab] = useState<'feed' | 'settings'>('feed');
  const [settingsForm, setSettingsForm] = useState(notificationSettings);

  if (!isNotificationDrawerOpen) return null;

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateNotificationSettings(settingsForm);
  };

  const handleOpenSimulatorForNotif = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      setActiveSimulatorStudent(student);
      setIsSimulatorOpen(true);
      setIsNotificationDrawerOpen(false);
    }
  };

  const handleDirectWhatsApp = (phone: string, message: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(message);
    window.open(`https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encoded}`, '_blank');
    showToast('Opening WhatsApp link...', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
      
      {/* Drawer Body */}
      <div className="w-full max-w-md bg-white dark:bg-neutral-900 h-full shadow-2xl flex flex-col border-l border-neutral-200 dark:border-neutral-800 animate-slide-left">
        
        {/* Header */}
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Parent Notification Hub
              </h3>
              <p className="text-[11px] text-neutral-400">
                Log for {selectedDate} ({notifications.length} alerts)
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsNotificationDrawerOpen(false)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-neutral-200 dark:border-neutral-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab('feed')}
            className={`flex-1 py-2.5 text-center border-b-2 transition-colors ${
              activeTab === 'feed'
                ? 'border-neutral-900 dark:border-white text-neutral-900 dark:text-white'
                : 'border-transparent text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
          >
            Dispatched Alerts ({notifications.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-2.5 text-center border-b-2 transition-colors flex items-center justify-center space-x-1.5 ${
              activeTab === 'settings'
                ? 'border-neutral-900 dark:border-white text-neutral-900 dark:text-white'
                : 'border-transparent text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Templates & Setup</span>
          </button>
        </div>

        {/* Feed Tab Content */}
        {activeTab === 'feed' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-16 px-4">
                <Bell className="w-8 h-8 text-neutral-300 dark:text-neutral-600 mx-auto mb-2" />
                <p className="text-xs text-neutral-500 font-medium">No parent notifications yet.</p>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Mark any student as <span className="text-rose-500 font-medium">Absent</span> to trigger an instant parent notification.
                </p>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/60 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                        {item.parentName}
                      </span>
                      <span className="text-[10px] text-neutral-400">
                        ({item.parentRelation} of {item.studentName})
                      </span>
                    </div>

                    {/* Channel Pill */}
                    <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-medium uppercase ${
                      item.channel === 'whatsapp'
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                        : item.channel === 'sms'
                        ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                        : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                    }`}>
                      {item.channel === 'whatsapp' && <MessageSquare className="w-2.5 h-2.5" />}
                      {item.channel === 'sms' && <Smartphone className="w-2.5 h-2.5" />}
                      {item.channel === 'email' && <Mail className="w-2.5 h-2.5" />}
                      <span>{item.channel}</span>
                    </span>
                  </div>

                  {/* Message Content Preview */}
                  <div className="p-2 rounded-xl bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 text-[11px] leading-relaxed border border-neutral-100 dark:border-neutral-800 whitespace-pre-line font-mono">
                    {item.message}
                  </div>

                  {/* Footer & Actions */}
                  <div className="flex items-center justify-between pt-1 text-[10px] text-neutral-400">
                    <div className="flex items-center space-x-1">
                      <CheckCheck className="w-3 h-3 text-blue-500" />
                      <span>Delivered &bull; {new Date(item.sentAt || item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => handleOpenSimulatorForNotif(item.studentId)}
                        className="text-neutral-600 dark:text-neutral-300 hover:underline"
                      >
                        Phone View
                      </button>
                      <span>&bull;</span>
                      <button
                        onClick={() => handleDirectWhatsApp(item.parentPhone, item.message)}
                        className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-0.5"
                      >
                        <span>Chat</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Settings Tab Content */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            
            {/* Auto-notify toggle */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700">
              <div>
                <span className="font-medium text-neutral-900 dark:text-neutral-100 block">
                  Automated Absence Trigger
                </span>
                <span className="text-[11px] text-neutral-400 block mt-0.5">
                  Automatically stage parent alert whenever Absent is marked
                </span>
              </div>
              <input
                type="checkbox"
                checked={settingsForm.autoNotifyOnAbsent}
                onChange={(e) => setSettingsForm({ ...settingsForm, autoNotifyOnAbsent: e.target.checked })}
                className="w-4 h-4 accent-neutral-900 dark:accent-neutral-100 rounded cursor-pointer"
              />
            </div>

            {/* Default Channel */}
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Default Notification Channel
              </label>
              <select
                value={settingsForm.defaultChannel}
                onChange={(e) => setSettingsForm({ ...settingsForm, defaultChannel: e.target.value as NotificationChannel })}
                className="w-full p-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none"
              >
                <option value="whatsapp">WhatsApp (Recommended)</option>
                <option value="sms">SMS Text</option>
                <option value="email">Email</option>
              </select>
            </div>

            {/* WhatsApp Template */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  WhatsApp Message Template
                </label>
                <span className="text-[10px] text-neutral-400 font-mono">
                  {`{studentName}, {parentName}, {date}, {rollNumber}`}
                </span>
              </div>
              <textarea
                rows={4}
                value={settingsForm.whatsappTemplate}
                onChange={(e) => setSettingsForm({ ...settingsForm, whatsappTemplate: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none font-mono text-[11px]"
              />
            </div>

            {/* SMS Template */}
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                SMS Text Template
              </label>
              <textarea
                rows={3}
                value={settingsForm.smsTemplate}
                onChange={(e) => setSettingsForm({ ...settingsForm, smsTemplate: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none font-mono text-[11px]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl text-xs font-medium bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-sm flex items-center justify-center space-x-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Template Settings</span>
            </button>
          </form>
        )}

      </div>

    </div>
  );
};
