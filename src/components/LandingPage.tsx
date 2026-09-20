import React from 'react';
import { 
  ArrowRight, 
  ShieldCheck, 
  MessageSquare, 
  Sun, 
  Moon, 
  Sparkles,
  Zap,
  Smartphone
} from 'lucide-react';
import { useAttendance } from '../context/AttendanceContext';

export const LandingPage: React.FC = () => {
  const { setCurrentView, isDarkMode, toggleDarkMode } = useAttendance();

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col justify-between selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-neutral-900">
      
      {/* Top Navbar */}
      <nav className="max-w-7xl w-full mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center font-bold text-lg shadow-sm">
            A
          </div>
          <span className="font-semibold text-lg tracking-tight">Attendify</span>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-neutral-200/70 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
            Minimal v1.0
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
            title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setCurrentView('trainers')}
            className="hidden sm:inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-medium bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all shadow-sm"
          >
            <span>Launch App</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl w-full mx-auto px-6 py-12 md:py-20 flex-1 flex flex-col items-center justify-center text-center">
        
        {/* Subtle Pill Tag */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 mb-8 animate-fade-in shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-300" />
          <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
            Trainer & Cohort Attendance &bull; Automated Parent Alerts
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-neutral-950 dark:text-white max-w-4xl leading-[1.1]">
          Attendance simplified. <br />
          <span className="text-neutral-400 dark:text-neutral-500 font-light">
            Parents notified instantly.
          </span>
        </h1>

        {/* Hero Description */}
        <p className="mt-6 text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed font-normal">
          A hyper-minimalist workspace for trainers, mentors, and academies. Mark attendance in seconds for students assigned to each trainer. The instant a student is marked absent, a personalized notification is automatically staged for their parents via WhatsApp, SMS, or Email.
        </p>

        {/* Hero CTA Button: CHECK IN */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setCurrentView('trainers')}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all shadow-xl hover:shadow-2xl flex items-center justify-center space-x-2 active:scale-98 group cursor-pointer"
          >
            <span>Check In & Mark Attendance</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Interactive Feature Teaser Card */}
        <div className="mt-14 w-full max-w-3xl rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/70 dark:bg-neutral-900/60 p-6 md:p-8 backdrop-blur-md shadow-xl text-left">
          
          <div className="flex items-center justify-between border-b border-neutral-200/60 dark:border-neutral-800/60 pb-4 mb-5">
            <div className="flex items-center space-x-2">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-ping" />
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                Live Workflow Simulation
              </span>
            </div>
            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-medium">
              Zero Latency Dispatch
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Step 1 Preview: Trainer Action */}
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200/60 dark:border-neutral-800/60">
              <div className="flex items-center justify-between text-xs text-neutral-400 mb-2 font-mono">
                <span>Trainer Marcus Vance</span>
                <span>09:14 AM</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-xl bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center font-bold text-xs">
                  AW
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-900 dark:text-white">Alexander Wright</p>
                  <p className="text-[11px] text-neutral-400">ID: FS-01 &bull; Robert Wright (Father)</p>
                </div>
              </div>
              <div className="mt-3 flex items-center space-x-1.5">
                <span className="px-2.5 py-1 rounded-lg text-xs bg-rose-600 text-white font-medium flex items-center space-x-1">
                  <span>Marked Absent</span>
                </span>
                <span className="text-[11px] text-neutral-400 font-mono">&rarr; Alert Triggered</span>
              </div>
            </div>

            {/* Step 2 Preview: Parent Phone Notice */}
            <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40">
              <div className="flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-300 mb-2 font-mono">
                <span className="flex items-center space-x-1">
                  <MessageSquare className="w-3 h-3 text-emerald-600" />
                  <span>WhatsApp to Parent</span>
                </span>
                <span className="text-[10px]">Instant</span>
              </div>
              <p className="text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed font-sans">
                "Hello <span className="font-semibold">Robert</span>, your child <span className="font-semibold">Alexander</span> was recorded as <span className="text-rose-600 font-semibold">ABSENT</span> today from Full Stack Engineering with Trainer Marcus Vance."
              </p>
              <div className="mt-2 text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                &check;&check; Verified Parent Contact &bull; Delivered
              </div>
            </div>
          </div>

        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl w-full mt-14 text-left">
          
          <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xs">
            <div className="h-8 w-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-3 text-neutral-800 dark:text-neutral-200">
              <Zap className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Speed Roll Call</h4>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Mark an entire lecture or classroom in under 30 seconds with one-click bulk status presets.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xs">
            <div className="h-8 w-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-3 text-neutral-800 dark:text-neutral-200">
              <Smartphone className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Phone Simulator</h4>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Live smartphone preview shows you the exact SMS, WhatsApp, or Email message before or after delivery.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xs">
            <div className="h-8 w-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-3 text-neutral-800 dark:text-neutral-200">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Database Ready</h4>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Decoupled storage service layer structured to seamlessly link into Supabase, Firebase, or PostgreSQL.
            </p>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 py-6 text-center text-xs text-neutral-400">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Attendify &bull; Minimalist Attendance Platform</span>
          <span>Click Check In above to get started</span>
        </div>
      </footer>

    </div>
  );
};
