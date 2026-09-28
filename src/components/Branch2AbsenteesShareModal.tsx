import React, { useState } from 'react';
import { 
  X, 
  MessageCircle, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldAlert, 
  ShieldCheck, 
  Lock,
  Building2,
  User,
  SendHorizontal,
  Info
} from 'lucide-react';
import { useAttendance, BRANCH_2_WHATSAPP_GROUP_URL } from '../context/AttendanceContext';
import { Student, Trainer } from '../types';

export const Branch2AbsenteesShareModal: React.FC = () => {
  const { 
    isBranch2GroupModalOpen, 
    setIsBranch2GroupModalOpen, 
    activeTrainer, 
    isBranch2Trainer, 
    generateDailyAbsenteesText, 
    generateOverallBranch2AbsenteesText,
    trainers,
    students, 
    allStudents,
    attendanceMap, 
    allTrainerAttendance,
    selectedDate,
    showToast
  } = useAttendance();

  const [reportMode, setReportMode] = useState<'overall' | 'trainer'>('overall');
  const [copied, setCopied] = useState(false);
  const [isForwarding, setIsForwarding] = useState(false);

  if (!isBranch2GroupModalOpen || !activeTrainer) return null;

  const isBranch2 = isBranch2Trainer(activeTrainer);

  // Active trainer absentees
  const activeTrainerAbsentees = students.filter(s => attendanceMap[s.id]?.status === 'absent');

  // Overall Branch 2 absentees
  const b2Trainers = trainers.filter(t => isBranch2Trainer(t));
  const overallAbsenteesList: { trainer: Trainer; student: Student }[] = [];
  b2Trainers.forEach(t => {
    const tStudents = allStudents.filter(s => s.trainerId === t.id);
    const recs = (t.id === activeTrainer?.id ? attendanceMap : allTrainerAttendance[t.id]) || {};
    tStudents.forEach(s => {
      if (recs[s.id]?.status === 'absent') {
        overallAbsenteesList.push({ trainer: t, student: s });
      }
    });
  });

  const reportText = reportMode === 'overall' 
    ? generateOverallBranch2AbsenteesText() 
    : generateDailyAbsenteesText(activeTrainer);

  const displayedAbsenteesCount = reportMode === 'overall' 
    ? overallAbsenteesList.length 
    : activeTrainerAbsentees.length;

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

  // Primary Action: Forward message directly to WhatsApp with pre-filled absentees
  const handleForwardToWhatsApp = async () => {
    setIsForwarding(true);
    try {
      // 1. Always copy text to clipboard as guaranteed fallback
      await navigator.clipboard.writeText(reportText);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);

      // 2. Try native Web Share API if supported (works beautifully on mobile browsers)
      if (navigator.share) {
        try {
          await navigator.share({
            title: reportMode === 'overall' ? 'Branch 2 Overall Daily Absentees' : `${activeTrainer.name} Daily Absentees`,
            text: reportText
          });
          showToast('Shared successfully via WhatsApp!', 'success');
          return;
        } catch (err: any) {
          // If user cancelled the share dialog, do nothing
          if (err?.name === 'AbortError') return;
        }
      }

      // 3. Fallback: Open WhatsApp universal send link which opens WhatsApp with pre-filled message
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(reportText)}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      showToast('WhatsApp opened with absentees list loaded! Select Branch 2 group.', 'success');
    } catch {
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(reportText)}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    } finally {
      setIsForwarding(false);
    }
  };

  // Secondary Action: Open Branch 2 group invite link directly
  const handleOpenGroupDirectly = async () => {
    try {
      await navigator.clipboard.writeText(reportText);
      setCopied(true);
      showToast('Absentees list copied! In WhatsApp group, press Paste (Ctrl+V / Cmd+V) and Send.', 'info');
      setTimeout(() => setCopied(false), 3000);
      window.open(BRANCH_2_WHATSAPP_GROUP_URL, '_blank', 'noopener,noreferrer');
    } catch {
      window.open(BRANCH_2_WHATSAPP_GROUP_URL, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-scale-in">
        
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
                  Share Absentees to WhatsApp Group
                </h3>
                {isBranch2 ? (
                  <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    Branch 2 Authorized
                  </span>
                ) : (
                  <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                    Restricted
                  </span>
                )}
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Official absentees forwarding for Branch 2 trainers
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
                Forwarding daily absentees to this WhatsApp group is strictly authorized for <span className="font-semibold text-neutral-900 dark:text-white">Branch 2 trainers</span> only.
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
            
            {/* Report Scope Switcher: Overall vs Active Trainer */}
            <div className="flex items-center p-1 bg-neutral-100 dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 text-xs">
              <button
                type="button"
                onClick={() => setReportMode('overall')}
                className={`flex-1 py-2 px-3 rounded-xl font-medium transition-all flex items-center justify-center space-x-2 ${
                  reportMode === 'overall'
                    ? 'bg-white dark:bg-neutral-900 text-neutral-950 dark:text-white shadow-xs font-semibold'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Overall Branch 2 Absentees ({overallAbsenteesList.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setReportMode('trainer')}
                className={`flex-1 py-2 px-3 rounded-xl font-medium transition-all flex items-center justify-center space-x-2 ${
                  reportMode === 'trainer'
                    ? 'bg-white dark:bg-neutral-900 text-neutral-950 dark:text-white shadow-xs font-semibold'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>My Batch Only ({activeTrainerAbsentees.length})</span>
              </button>
            </div>

            {/* Status & Scope Banner */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <p className="font-semibold text-emerald-950 dark:text-emerald-200">
                    {reportMode === 'overall' 
                      ? 'Branch 2 — Combined Absentees Roster' 
                      : `Trainer ${activeTrainer.name} (${activeTrainer.batch})`}
                  </p>
                  <p className="text-[11px] text-emerald-700/90 dark:text-emerald-400/90">
                    {reportMode === 'overall'
                      ? `Includes all ${b2Trainers.length} Branch 2 trainers: ${b2Trainers.map(t => t.name).join(', ')}`
                      : `Location: ${activeTrainer.room} • Domain: ${activeTrainer.specialization}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-1.5 font-mono text-[11px]">
                <span className={`px-2 py-0.5 rounded-md font-semibold ${
                  displayedAbsenteesCount > 0 
                    ? 'bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300' 
                    : 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300'
                }`}>
                  {displayedAbsenteesCount} Absent
                </span>
                <span className="text-neutral-400">&bull;</span>
                <span className="text-neutral-600 dark:text-neutral-400">{selectedDate}</span>
              </div>
            </div>

            {/* Formatted Message Preview */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-neutral-700 dark:text-neutral-300 flex items-center space-x-1.5">
                  <span>WhatsApp Formatted Text Preview</span>
                  <span className="text-[10px] text-neutral-400 font-normal">
                    (Forwarded directly into WhatsApp)
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
                      <span>Copy Full Text</span>
                    </>
                  )}
                </button>
              </div>

              {/* WhatsApp Bubble Style Preview */}
              <div className="p-4 rounded-2xl bg-[#efeae2] dark:bg-[#121b22] border border-[#d1c7bc] dark:border-[#222e35] shadow-inner text-neutral-900 dark:text-neutral-100 font-mono text-[11px] whitespace-pre-wrap leading-relaxed max-h-52 overflow-y-auto">
                {reportText}
              </div>
            </div>

            {/* Absentees List Cards */}
            {displayedAbsenteesCount > 0 ? (
              <div className="space-y-1.5">
                <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                  Included Absent Students ({displayedAbsenteesCount})
                </span>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {(reportMode === 'overall' ? overallAbsenteesList : activeTrainerAbsentees.map(s => ({ trainer: activeTrainer, student: s }))).map(({ trainer, student }, idx) => (
                    <div 
                      key={`${trainer.id}-${student.id}`}
                      className="flex items-center justify-between p-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/70 border border-neutral-200 dark:border-neutral-700/60 text-xs"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="w-5 h-5 rounded-md bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center font-mono text-[10px] font-bold text-neutral-700 dark:text-neutral-300">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="font-medium text-neutral-900 dark:text-white">{student.name}</p>
                          <p className="text-[10px] text-neutral-400">
                            Roll: {student.rollNumber} &bull; <span className="font-medium text-neutral-600 dark:text-neutral-300">{trainer.name}</span> ({trainer.batch})
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] font-mono text-neutral-700 dark:text-neutral-300">{student.parentPhone}</p>
                        <p className="text-[10px] text-neutral-400">{student.parentName} ({student.parentRelation})</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 flex items-center space-x-2 text-xs text-neutral-600 dark:text-neutral-300">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Zero absentees recorded today. Perfect attendance across batches! 🎉</span>
              </div>
            )}

            {/* Helper Instructions Tip */}
            <div className="p-3 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-800/40 text-[11px] text-blue-900 dark:text-blue-300 flex items-start space-x-2">
              <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">How forwarding works:</span> Clicking <span className="font-semibold text-emerald-700 dark:text-emerald-400">"Forward to WhatsApp Group"</span> opens WhatsApp with the complete absentees list pre-filled. Simply select the <strong>Branch 2</strong> group to send!
              </div>
            </div>

          </div>
        )}

        {/* Action Buttons Footer */}
        {isBranch2 && (
          <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/70 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 shrink-0">
            
            {/* Direct Group Open Link */}
            <button
              onClick={handleOpenGroupDirectly}
              className="inline-flex items-center justify-center space-x-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
              title="Copies absentees and opens the official Branch 2 WhatsApp group chat"
            >
              <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
              <span>Open Group Chat</span>
            </button>

            <div className="flex items-center space-x-2">
              {/* Copy Full Report Button */}
              <button
                onClick={handleCopy}
                className="inline-flex items-center justify-center space-x-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                title="Copy formatted text to clipboard"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-neutral-400" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              {/* PRIMARY ACTION: Forward Absentees to WhatsApp */}
              <button
                onClick={handleForwardToWhatsApp}
                disabled={isForwarding}
                className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20 transition-all active:scale-95 cursor-pointer"
                title="Opens WhatsApp directly with the absentees list pre-filled to forward to the Branch 2 group"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Forward Absentees to WhatsApp</span>
                <SendHorizontal className="w-3.5 h-3.5 ml-0.5" />
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
