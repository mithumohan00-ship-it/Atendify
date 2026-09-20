import React, { useState } from 'react';
import { 
  X, 
  Database, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Check, 
  ExternalLink, 
  RefreshCw, 
  ShieldCheck, 
  Terminal,
  Server
} from 'lucide-react';
import { useAttendance } from '../context/AttendanceContext';
import { SUPABASE_SCHEMA_SQL } from '../data/supabaseSchemaSql';

export const DatabaseModal: React.FC = () => {
  const { 
    isDbModalOpen, 
    setIsDbModalOpen, 
    dbStatus, 
    checkDbStatus,
    showToast 
  } = useAttendance();

  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'status' | 'sql'>('status');

  if (!isDbModalOpen) return null;

  const projectUrl = import.meta.env.VITE_SUPABASE_URL || 'https://krmyiqucfiznyaemmkky.supabase.co';
  const projectRef = projectUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1] || 'krmyiqucfiznyaemmkky';
  const sqlEditorUrl = `https://supabase.com/dashboard/project/${projectRef}/sql/new`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
    setCopied(true);
    showToast('SQL schema copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden animate-scale-in">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-xl ${dbStatus.hasTables ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400' : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'}`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center space-x-2">
                <span>Supabase Database Integration</span>
                {dbStatus.hasTables ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300">
                    Live Sync Active
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300">
                    Tables Pending
                  </span>
                )}
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono mt-0.5">
                {projectUrl}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsDbModalOpen(false)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-neutral-200 dark:border-neutral-800 text-xs font-medium px-6">
          <button
            onClick={() => setActiveTab('status')}
            className={`py-3 border-b-2 transition-colors mr-6 ${
              activeTab === 'status'
                ? 'border-neutral-900 dark:border-white text-neutral-900 dark:text-white'
                : 'border-transparent text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
          >
            Connection Status & Setup
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`py-3 border-b-2 transition-colors flex items-center space-x-1.5 ${
              activeTab === 'sql'
                ? 'border-neutral-900 dark:border-white text-neutral-900 dark:text-white'
                : 'border-transparent text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>SQL Migration Script</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {activeTab === 'status' ? (
            <div className="space-y-6">
              
              {/* Status Banner */}
              {dbStatus.hasTables ? (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
                      Cloud Persistence is Fully Operational
                    </h4>
                    <p className="text-xs text-emerald-700 dark:text-emerald-300/90 mt-1 leading-relaxed">
                      Your Supabase database tables (<code className="font-mono bg-emerald-100/70 dark:bg-emerald-900/50 px-1 py-0.5 rounded">trainers</code>, <code className="font-mono bg-emerald-100/70 dark:bg-emerald-900/50 px-1 py-0.5 rounded">students</code>, <code className="font-mono bg-emerald-100/70 dark:bg-emerald-900/50 px-1 py-0.5 rounded">attendance_records</code>, <code className="font-mono bg-emerald-100/70 dark:bg-emerald-900/50 px-1 py-0.5 rounded">parent_notifications</code>) are online and actively syncing.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                      Supabase Connected &bull; Run SQL Schema to Finish Setup
                    </h4>
                    <p className="text-xs text-amber-700 dark:text-amber-300/90 mt-1 leading-relaxed">
                      Your API keys are verified! To store records in Supabase cloud, create the database tables by pasting the SQL schema into your Supabase Dashboard.
                    </p>
                  </div>
                </div>
              )}

              {/* Step-by-step Quick Setup */}
              {!dbStatus.hasTables && (
                <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 space-y-4">
                  <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">
                    Quick 1-Minute Setup Guide
                  </h4>

                  <div className="space-y-3 text-xs text-neutral-600 dark:text-neutral-300">
                    <div className="flex items-start space-x-3">
                      <span className="w-6 h-6 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        1
                      </span>
                      <div className="flex-1">
                        <p className="font-medium text-neutral-900 dark:text-white">Copy the Schema</p>
                        <p className="text-[11px] text-neutral-500 mt-0.5">
                          Click the button below to copy the complete table structure and initial seed data.
                        </p>
                        <button
                          onClick={handleCopySql}
                          className="mt-2 inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors cursor-pointer"
                        >
                          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copied ? 'Copied to Clipboard!' : 'Copy SQL Schema'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <span className="w-6 h-6 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        2
                      </span>
                      <div className="flex-1">
                        <p className="font-medium text-neutral-900 dark:text-white">Open Supabase SQL Editor</p>
                        <p className="text-[11px] text-neutral-500 mt-0.5">
                          Paste the SQL query into your Supabase project's SQL editor and click <strong>"Run"</strong>.
                        </p>
                        <a
                          href={sqlEditorUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Open SQL Editor ({projectRef})</span>
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <span className="w-6 h-6 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        3
                      </span>
                      <div className="flex-1">
                        <p className="font-medium text-neutral-900 dark:text-white">Verify Connection</p>
                        <p className="text-[11px] text-neutral-500 mt-0.5">
                          Once run, click "Re-check Database" below to confirm live synchronization.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Technical Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 space-y-1">
                  <div className="flex items-center space-x-1.5 text-neutral-400">
                    <Server className="w-3.5 h-3.5" />
                    <span className="font-medium">Project Endpoint</span>
                  </div>
                  <p className="font-mono text-neutral-900 dark:text-neutral-100 truncate text-[11px]">
                    {projectUrl}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 space-y-1">
                  <div className="flex items-center space-x-1.5 text-neutral-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span className="font-medium">Security & Privacy</span>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 text-[11px]">
                    Row Level Security (RLS) active. Secret keys remain securely isolated.
                  </p>
                </div>
              </div>

            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-500 font-mono">
                  supabase/schema.sql ({SUPABASE_SCHEMA_SQL.split('\n').length} lines)
                </span>
                <button
                  onClick={handleCopySql}
                  className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy All'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-2xl bg-neutral-900 text-neutral-100 text-[11px] font-mono overflow-x-auto max-h-96 leading-relaxed border border-neutral-800">
                <code>{SUPABASE_SCHEMA_SQL}</code>
              </pre>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={checkDbStatus}
            disabled={dbStatus.checking}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-xl text-xs font-medium border border-neutral-300 dark:border-neutral-700 hover:bg-white dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${dbStatus.checking ? 'animate-spin' : ''}`} />
            <span>{dbStatus.checking ? 'Checking Database...' : 'Re-check Connection'}</span>
          </button>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => setIsDbModalOpen(false)}
              className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-medium bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
