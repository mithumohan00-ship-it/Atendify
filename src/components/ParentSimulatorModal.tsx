import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  MessageSquare, 
  Mail, 
  Send, 
  CheckCheck, 
  ExternalLink,
  ShieldCheck,
  Edit3,
  Sliders
} from 'lucide-react';
import { useAttendance } from '../context/AttendanceContext';
import { NotificationChannel } from '../types';

export const ParentSimulatorModal: React.FC = () => {
  const { 
    isSimulatorOpen, 
    setIsSimulatorOpen, 
    activeSimulatorStudent, 
    activeTrainer, 
    selectedDate,
    notificationSettings,
    sendSingleNotification,
    showToast
  } = useAttendance();

  const [channel, setChannel] = useState<NotificationChannel>('whatsapp');
  const [mobileTab, setMobileTab] = useState<'preview' | 'details'>('preview');
  const [isEditing, setIsEditing] = useState(false);
  const [customText, setCustomText] = useState<string>('');

  if (!isSimulatorOpen || !activeSimulatorStudent) return null;

  // Generate rendered message
  const getRenderedMessage = () => {
    if (customText) return customText;

    let template = notificationSettings.whatsappTemplate;
    if (channel === 'sms') template = notificationSettings.smsTemplate;
    if (channel === 'email') template = notificationSettings.emailBodyTemplate;

    return template
      .replace(/{studentName}/g, activeSimulatorStudent.name)
      .replace(/{parentName}/g, activeSimulatorStudent.parentName)
      .replace(/{rollNumber}/g, activeSimulatorStudent.rollNumber)
      .replace(/{date}/g, selectedDate)
      .replace(/{trainerName}/g, activeTrainer?.name || 'Trainer')
      .replace(/{specialization}/g, activeTrainer?.specialization || 'Program')
      .replace(/{room}/g, activeTrainer?.room || 'Main Lab')
      .replace(/{batch}/g, activeTrainer?.batch || 'Cohort');
  };

  const messageText = getRenderedMessage();

  // Send & simulate
  const handleSendSimulated = async () => {
    await sendSingleNotification(activeSimulatorStudent.id, channel);
    setIsSimulatorOpen(false);
  };

  // Direct WhatsApp Launch
  const handleOpenDirectWhatsApp = () => {
    const cleanPhone = activeSimulatorStudent.parentPhone.replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(messageText);
    window.open(`https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encoded}`, '_blank');
    showToast(`Opening WhatsApp chat with ${activeSimulatorStudent.parentName}`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      
      {/* Modal Container */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl w-full max-w-2xl shadow-2xl flex flex-col md:flex-row max-h-[92vh] overflow-hidden">
        
        {/* Mobile-Only Header & Tab Switcher */}
        <div className="md:hidden px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between shrink-0 bg-neutral-50/50 dark:bg-neutral-900/50">
          <div className="flex items-center space-x-1 p-0.5 bg-neutral-200/70 dark:bg-neutral-800 rounded-xl text-xs font-medium">
            <button
              onClick={() => setMobileTab('preview')}
              className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
                mobileTab === 'preview'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs font-semibold'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Live Phone</span>
            </button>
            <button
              onClick={() => setMobileTab('details')}
              className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
                mobileTab === 'details'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs font-semibold'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Details & Edit</span>
            </button>
          </div>

          <button
            onClick={() => setIsSimulatorOpen(false)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Left Side: Parent Details & Channel Selector */}
        <div className={`${mobileTab === 'details' ? 'flex' : 'hidden md:flex'} p-5 md:p-6 md:w-1/2 flex-col justify-between border-b md:border-b-0 md:border-r border-neutral-200 dark:border-neutral-800 overflow-y-auto`}>
          <div>
            <div className="hidden md:flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                Parent Notification Engine
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Absence Alert Simulator
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Preview what the parent receives before or during dispatch.
            </p>

            {/* Recipient Card */}
            <div className="mt-4 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/60 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-neutral-400">Student:</span>
                <span className="font-medium text-neutral-800 dark:text-neutral-200 truncate ml-2">
                  {activeSimulatorStudent.name} (#{activeSimulatorStudent.rollNumber})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Parent:</span>
                <span className="font-medium text-neutral-800 dark:text-neutral-200 truncate ml-2">
                  {activeSimulatorStudent.parentName} ({activeSimulatorStudent.parentRelation})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Mobile Phone:</span>
                <span className="font-mono text-neutral-800 dark:text-neutral-200">
                  {activeSimulatorStudent.parentPhone}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Email:</span>
                <span className="font-mono text-neutral-800 dark:text-neutral-200 truncate max-w-[170px]">
                  {activeSimulatorStudent.parentEmail}
                </span>
              </div>
            </div>

            {/* Channel Tabs */}
            <div className="mt-5">
              <label className="text-xs font-medium text-neutral-600 dark:text-neutral-300 block mb-2">
                Simulate Channel:
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
                <button
                  onClick={() => { setChannel('whatsapp'); setIsEditing(false); }}
                  className={`flex items-center justify-center space-x-1.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    channel === 'whatsapp'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>

                <button
                  onClick={() => { setChannel('sms'); setIsEditing(false); }}
                  className={`flex items-center justify-center space-x-1.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    channel === 'sms'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>SMS</span>
                </button>

                <button
                  onClick={() => { setChannel('email'); setIsEditing(false); }}
                  className={`flex items-center justify-center space-x-1.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    channel === 'email'
                      ? 'bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-900 shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email</span>
                </button>
              </div>
            </div>

            {/* Optional message customization toggle */}
            <div className="mt-4">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 flex items-center space-x-1"
              >
                <Edit3 className="w-3 h-3" />
                <span>{isEditing ? 'Revert to auto template' : 'Customize notice wording'}</span>
              </button>
              {isEditing && (
                <textarea
                  value={customText || messageText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="w-full mt-2 p-2.5 text-xs rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-400 font-sans h-24"
                />
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 space-y-2 pt-2">
            {channel === 'whatsapp' && (
              <button
                onClick={handleOpenDirectWhatsApp}
                className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-sm active:scale-98"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Live Chat in WhatsApp Web</span>
              </button>
            )}

            <button
              onClick={handleSendSimulated}
              className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-xs font-medium bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-900 text-white transition-all shadow-sm active:scale-98"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Confirm & Dispatch Alert</span>
            </button>
          </div>
        </div>

        {/* Right Side: Smartphone Device Mockup */}
        <div className={`${mobileTab === 'preview' ? 'flex' : 'hidden md:flex'} p-4 sm:p-6 md:w-1/2 bg-neutral-100 dark:bg-neutral-950 flex-col items-center justify-center relative overflow-y-auto`}>
          <button
            onClick={() => setIsSimulatorOpen(false)}
            className="hidden md:block absolute top-4 right-4 p-1 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Minimal Smartphone Frame */}
          <div className="w-[260px] sm:w-[280px] bg-neutral-900 rounded-[36px] p-2.5 shadow-2xl border-4 border-neutral-800 dark:border-neutral-700 my-auto">
            {/* Screen Inner */}
            <div className="bg-white dark:bg-neutral-900 rounded-[28px] overflow-hidden min-h-[380px] sm:min-h-[420px] flex flex-col text-neutral-900 dark:text-white">
              
              {/* Device Status Bar */}
              <div className="px-4 pt-2.5 pb-2 flex items-center justify-between text-[10px] font-mono text-neutral-400 dark:text-neutral-500 border-b border-neutral-100 dark:border-neutral-800/40">
                <span>09:41</span>
                {/* Dynamic Island Pill */}
                <div className="w-14 h-2.5 bg-neutral-900 dark:bg-neutral-800 rounded-full" />
                <span>5G &bull; 100%</span>
              </div>

              {/* App Bar (WhatsApp / SMS / Email header) */}
              <div className="px-3 py-2 border-b border-neutral-100 dark:border-neutral-800 flex items-center space-x-2">
                <div className="w-7 h-7 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  A
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-1">
                    <span className="font-semibold text-xs truncate">Attendify School</span>
                    <ShieldCheck className="w-3 h-3 text-emerald-500 shrink-0" />
                  </div>
                  <span className="text-[10px] text-neutral-400 block -mt-0.5 truncate">
                    Official Attendance Bot
                  </span>
                </div>
              </div>

              {/* Chat / Message Feed */}
              <div className="flex-1 p-3 bg-neutral-50/50 dark:bg-neutral-950/50 flex flex-col justify-end space-y-2.5 overflow-y-auto">
                
                {/* Date Stamp */}
                <div className="text-center">
                  <span className="text-[9px] font-medium bg-neutral-200/70 dark:bg-neutral-800 px-2 py-0.5 rounded-full text-neutral-500 dark:text-neutral-400">
                    Today, {selectedDate}
                  </span>
                </div>

                {/* Message Bubble based on channel */}
                {channel === 'whatsapp' && (
                  <div className="self-start max-w-[94%] bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200/80 dark:border-emerald-800/80 rounded-2xl rounded-tl-sm p-2.5 shadow-xs">
                    <p className="text-[11px] leading-relaxed text-neutral-800 dark:text-neutral-200 whitespace-pre-line font-sans">
                      {messageText}
                    </p>
                    <div className="mt-1 flex items-center justify-end space-x-1 text-[9px] text-neutral-400">
                      <span>09:41 AM</span>
                      <CheckCheck className="w-3 h-3 text-blue-500" />
                    </div>
                  </div>
                )}

                {channel === 'sms' && (
                  <div className="self-start max-w-[94%] bg-blue-50 dark:bg-blue-950/70 border border-blue-200/80 dark:border-blue-800/80 rounded-2xl rounded-tl-sm p-2.5 shadow-xs">
                    <span className="text-[9px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider block mb-1">
                      SMS Notice
                    </span>
                    <p className="text-[11px] leading-relaxed text-neutral-800 dark:text-neutral-200 whitespace-pre-line font-sans">
                      {messageText}
                    </p>
                    <div className="mt-1 flex items-center justify-end text-[9px] text-neutral-400">
                      <span>09:41 AM</span>
                    </div>
                  </div>
                )}

                {channel === 'email' && (
                  <div className="self-start w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-2.5 shadow-xs">
                    <div className="border-b border-neutral-100 dark:border-neutral-800 pb-1 mb-1">
                      <span className="text-[10px] text-neutral-400 block font-mono truncate">
                        Subject: Absence Alert for {activeSimulatorStudent.name}
                      </span>
                    </div>
                    <p className="text-[10px] leading-relaxed text-neutral-800 dark:text-neutral-200 whitespace-pre-line">
                      {messageText}
                    </p>
                  </div>
                )}

              </div>

              {/* Bottom Quick Action on Mobile */}
              <div className="p-2 border-t border-neutral-100 dark:border-neutral-800 text-[10px] text-center text-neutral-400 font-sans">
                Parent phone preview
              </div>

            </div>
          </div>

          {/* Quick mobile button to switch to details/dispatch */}
          <div className="md:hidden mt-3 w-full max-w-[260px]">
            <button
              onClick={handleOpenDirectWhatsApp}
              className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl text-xs font-medium bg-emerald-600 text-white shadow-xs"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Open in WhatsApp</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
