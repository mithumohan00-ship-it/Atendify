import React, { useState } from 'react';
import { 
  X, 
  MessageCircle, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldAlert, 
  ShieldCheck, 
  Share2, 
  Lock
} from 'lucide-react';
import { useAttendance, BRANCH_2_WHATSAPP_GROUP_URL } from '../context/AttendanceContext';

export const Branch2AbsenteesShareModal: React.FC = () => {
  const { 
    isBranch2GroupModalOpen, 
    setIsBranch2GroupModalOpen, 
    activeTrainer, 
    isBranch2Trainer, 
    generateDailyAbsenteesText, 
    students, 
    attendanceMap, 
    selectedDate,
    showToast
  } = useAttendance();

  const [copied, setCopied] = useState(false);

  if (!isBranch2GroupModalOpen || !activeTrainer) return null;

  const isBranch2 = isBranch2Trainer(activeTrainer);
  const reportText = generateDailyAbsenteesText(activeTrainer);
  const absentees = students.filter(s => attendanceMap[s.id]?.status === 'absent');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(reportText);
      setCopied(true);
      showToast('Daily absentees list copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      showToast('Failed to copy to clipboard', 'alert');
    }
  };

  const handleCopyAndOpenGroup = async () => {
    try {
      await navigator.clipboard.writeText(reportText);
      setCopied(true);
      showToast('Absentees list copied! Opening Branch 2 WhatsApp group...', 'success');
      setTimeout(() => setCopied(false), 2500);
      window.open(BRANCH_2_WHATSAPP_GROUP_URL, '_blank', 'noopener,noreferrer');
    } catch {
      window.open(BRANCH_2_WHATSAPP_GROUP_URL, '_blank', 'noopener,noreferrer');
    }
  };

  const handleDirectWhatsAppShare = () => {
    const directUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(reportText)}`;
    window.open(directUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-in">
        
        {/* Header */}
        <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between shrink-0 bg-neutral-50/50 dark:bg-neutral-900/50">
          <div className="flex items-center space-x-3">
            <div className={`p-2.5 rounded-2xl ${
              isBranch2 
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
            }`}>
              {isBranch2 ? (
                <MessageCircle className="w-5 h-5 fill-current" />
              ) : (
                <Lock className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm sm:text-base font-semibold text-neutral-900 dark:text-white">
                  Branch 2 WhatsApp Absentees
                </h3>
                {isBranch2 ? (
                  <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    Branch 2 Verified
                  </span>
                ) : (
                  <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                    Restricted
                  </span>
                )}
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Official attendance sharing for Branch 2 trainers
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsBranch2GroupModalOpen(false)}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        {!isBranch2 ? (
          /* Access Denied View for non-Branch 2 trainers */
          <div className="p-6 text-center space-y-4">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/60 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <ShieldAlert className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h4 className="text-base font-bold text-neutral-900 dark:text-white">
                Access Restricted to Branch 2 Trainers
              </h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 max-w-sm mx-auto leading-relaxed">
                Sharing daily absentees to this WhatsApp group is strictly authorized for <span className="font-semibold text-neutral-900 dark:text-white">Branch 2 trainers</span> only.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/60 text-left text-xs space-y-1.5 max-w-sm mx-auto">
              <div className="flex items-center justify-between">
                <span className="text-neutral-500 dark:text-neutral-400">Active Trainer:</span>
                <span className="font-semibold text-neutral-900 dark:text-white">{activeTrainer.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500 dark:text-neutral-400">Assigned Branch:</span>
                <span className="font-semibold text-rose-600 dark:text-rose-400">{activeTrainer.branch || 'Branch 1'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500 dark:text-neutral-400">Required Branch:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">Branch 2</span>
              </div>
            </div>

            <p className="text-[11px] text-neutral-400 max-w-xs mx-auto">
              If {activeTrainer.name} should have access, change their branch to "Branch 2" in trainer settings.
            </p>

            <div className="pt-2">
              <button
                onClick={() => setIsBranch2GroupModalOpen(false)}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          /* Authorized Branch 2 View */
          <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
            
            {/* Status & Trainer Pill */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/50">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <p className="font-semibold text-emerald-950 dark:text-emerald-200">
                    {activeTrainer.name} &bull; {activeTrainer.branch}
                  </p>
                  <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80">
                    Authorized to post daily absentees to Branch 2 group
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-1.5 font-mono text-[11px]">
                <span className={`px-2 py-0.5 rounded-md font-semibold ${
                  absentees.length > 0 
                    ? 'bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300' 
                    : 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300'
                }`}>
                  {absentees.length} Absent
                </span>
                <span className="text-neutral-400">&bull;</span>
                <span className="text-neutral-600 dark:text-neutral-400">{selectedDate}</span>
              </div>
            </div>

            {/* Formatted Message Preview */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-neutral-700 dark:text-neutral-300 flex items-center space-x-1.5">
                  <span>WhatsApp Message Preview</span>
                  <span className="text-[10px] text-neutral-400 font-normal">
                    (Ready to paste)
                  </span>
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center space-x-1 text-[11px] font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>
              </div>

              {/* WhatsApp Bubble Style Preview */}
              <div className="p-4 rounded-2xl bg-[#efeae2] dark:bg-[#121b22] border border-[#d1c7bc] dark:border-[#222e35] shadow-inner text-neutral-900 dark:text-neutral-100 font-mono text-[11px] whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto">
                {reportText}
              </div>
            </div>

            {/* Absentees Quick Table / List */}
            {absentees.length > 0 ? (
              <div className="space-y-1.5">
                <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                  Included Absentees ({absentees.length})
                </span>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {absentees.map((s, idx) => (
                    <div 
                      key={s.id}
                      className="flex items-center justify-between p-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/70 border border-neutral-200 dark:border-neutral-700/60 text-xs"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="w-5 h-5 rounded-md bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center font-mono text-[10px] font-bold text-neutral-700 dark:text-neutral-300">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="font-medium text-neutral-900 dark:text-white">{s.name}</p>
                          <p className="text-[10px] text-neutral-400">Roll: {s.rollNumber}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] font-mono text-neutral-700 dark:text-neutral-300">{s.parentPhone}</p>
                        <p className="text-[10px] text-neutral-400">{s.parentName} ({s.parentRelation})</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 flex items-center space-x-2 text-xs text-neutral-600 dark:text-neutral-300">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Zero absentees recorded for this session today. Perfect attendance!</span>
              </div>
            )}

            {/* Official WhatsApp Group URL Note */}
            <div className="p-3 rounded-2xl bg-neutral-100/80 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700/60 text-[11px] text-neutral-600 dark:text-neutral-400 flex items-center justify-between">
              <div className="truncate mr-2">
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">Target Group:</span>{' '}
                <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
                  chat.whatsapp.com/IgiPVOoEIMz4iFPNQ0Of4k
                </span>
              </div>
              <a
                href={BRANCH_2_WHATSAPP_GROUP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 hover:underline shrink-0"
              >
                <span>Open Link</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

          </div>
        )}

        {/* Action Buttons Footer */}
        {isBranch2 && (
          <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/70 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5 shrink-0">
            
            {/* Direct WhatsApp Share via API */}
            <button
              onClick={handleDirectWhatsAppShare}
              className="inline-flex items-center justify-center space-x-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
              title="Share via WhatsApp Web / App directly"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share via WhatsApp</span>
            </button>

            {/* Primary Action: Copy & Open Branch 2 Group */}
            <button
              onClick={handleCopyAndOpenGroup}
              className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-600 dark:hover:bg-emerald-500 shadow-sm transition-all active:scale-95 cursor-pointer"
              title="Copies formatted absentees message to clipboard and opens the official Branch 2 WhatsApp group"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Copy &amp; Open Branch 2 WhatsApp Group</span>
              <ExternalLink className="w-3.5 h-3.5 ml-0.5 opacity-80" />
            </button>

          </div>
        )}

      </div>
    </div>
  );
};
