import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { 
  Trainer, 
  Student, 
  AttendanceRecord, 
  AttendanceStatus, 
  ParentNotification, 
  NotificationSettings, 
  NotificationChannel 
} from '../types';
import { attendanceService } from '../services/attendanceService';

export type AppView = 'landing' | 'trainers' | 'attendance';

export interface TrainerSummary {
  total: number;
  present: number;
  absent: number;
  late: number;
  marked: number;
}

interface AttendanceContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  trainers: Trainer[];
  activeTrainer: Trainer | null;
  setActiveTrainerId: (id: string) => void;
  selectTrainerAndProceed: (trainerId: string) => void;
  addTrainer: (trainerData: Omit<Trainer, 'id'>) => Promise<Trainer>;
  updateTrainer: (id: string, updates: Partial<Omit<Trainer, 'id'>>) => Promise<Trainer>;
  deleteTrainer: (id: string) => Promise<boolean>;
  editingTrainer: Trainer | null;
  setEditingTrainer: (trainer: Trainer | null) => void;
  isEditTrainerModalOpen: boolean;
  setIsEditTrainerModalOpen: (open: boolean) => void;
  openEditTrainerModal: (trainer: Trainer) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  students: Student[];
  allStudents: Student[];
  attendanceMap: Record<string, AttendanceRecord>;
  notifications: ParentNotification[];
  notificationSettings: NotificationSettings;
  updateNotificationSettings: (settings: NotificationSettings) => Promise<void>;
  markAttendance: (studentId: string, status: AttendanceStatus, note?: string) => Promise<void>;
  markAllPresent: () => Promise<void>;
  resetAttendance: () => Promise<void>;
  notifyAllAbsent: () => Promise<void>;
  sendSingleNotification: (studentId: string, channel?: NotificationChannel) => Promise<ParentNotification | null>;
  addStudent: (student: Omit<Student, 'id'>) => Promise<Student>;
  importStudentsBatch: (students: Omit<Student, 'id'>[]) => Promise<Student[]>;
  getTrainerSummary: (trainerId: string) => TrainerSummary;
  // UI state
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isSimulatorOpen: boolean;
  setIsSimulatorOpen: (open: boolean) => void;
  activeSimulatorStudent: Student | null;
  setActiveSimulatorStudent: (student: Student | null) => void;
  isNotificationDrawerOpen: boolean;
  setIsNotificationDrawerOpen: (open: boolean) => void;
  isAddStudentModalOpen: boolean;
  setIsAddStudentModalOpen: (open: boolean) => void;
  isImportModalOpen: boolean;
  setIsImportModalOpen: (open: boolean) => void;
  isAddTrainerModalOpen: boolean;
  setIsAddTrainerModalOpen: (open: boolean) => void;
  isDbModalOpen: boolean;
  setIsDbModalOpen: (open: boolean) => void;
  dbStatus: { configured: boolean; connected: boolean; hasTables: boolean; checking: boolean; error?: string };
  checkDbStatus: () => Promise<void>;
  toastMessage: { text: string; type: 'info' | 'success' | 'alert' } | null;
  showToast: (text: string, type?: 'info' | 'success' | 'alert') => void;
  refreshData: () => Promise<void>;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export const AttendanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [activeTrainerId, setActiveTrainerId] = useState<string>('trainer-marcus');
  
  // Format today's date YYYY-MM-DD
  const getTodayString = () => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  };

  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());
  const [students, setStudents] = useState<Student[]>([]);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [attendanceMap, setAttendanceMap] = useState<Record<string, AttendanceRecord>>({});
  const [allTrainerAttendance, setAllTrainerAttendance] = useState<Record<string, Record<string, AttendanceRecord>>>({});
  const [notifications, setNotifications] = useState<ParentNotification[]>([]);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    autoNotifyOnAbsent: true,
    defaultChannel: 'whatsapp',
    smsTemplate: '',
    whatsappTemplate: '',
    emailSubjectTemplate: '',
    emailBodyTemplate: ''
  });

  // UI state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [activeSimulatorStudent, setActiveSimulatorStudent] = useState<Student | null>(null);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isAddTrainerModalOpen, setIsAddTrainerModalOpen] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null);
  const [isEditTrainerModalOpen, setIsEditTrainerModalOpen] = useState(false);
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);

  const openEditTrainerModal = (trainer: Trainer) => {
    setEditingTrainer(trainer);
    setIsEditTrainerModalOpen(true);
  };
  const [dbStatus, setDbStatus] = useState<{
    configured: boolean;
    connected: boolean;
    hasTables: boolean;
    checking: boolean;
    error?: string;
  }>({
    configured: attendanceService.isUsingDatabase(),
    connected: false,
    hasTables: false,
    checking: false
  });
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'info' | 'success' | 'alert' } | null>(null);

  const checkDbStatus = useCallback(async () => {
    setDbStatus(prev => ({ ...prev, checking: true }));
    const res = await attendanceService.checkDatabaseConnection();
    setDbStatus({
      configured: res.configured,
      connected: res.connected,
      hasTables: res.hasTables,
      checking: false,
      error: res.error
    });
  }, []);

  useEffect(() => {
    checkDbStatus();
  }, [checkDbStatus]);

  const showToast = useCallback((text: string, type: 'info' | 'success' | 'alert' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(prev => (prev?.text === text ? null : prev));
    }, 4000);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  // Sync dark class on mount
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Load initial settings and trainers
  const loadInitial = useCallback(async () => {
    const trns = await attendanceService.getTrainers();
    setTrainers(trns);
    if (trns.length > 0 && !activeTrainerId) {
      setActiveTrainerId(trns[0].id);
    }
    const settings = await attendanceService.getSettings();
    setNotificationSettings(settings);

    const allStds = await attendanceService.getStudents();
    setAllStudents(allStds);
  }, [activeTrainerId]);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  // Load students, records, and notifications whenever active trainer or date changes
  const refreshData = useCallback(async () => {
    if (!activeTrainerId) return;
    const stds = await attendanceService.getStudents(activeTrainerId);
    setStudents(stds);

    const allStds = await attendanceService.getStudents();
    setAllStudents(allStds);

    const recs = await attendanceService.getAttendance(selectedDate, activeTrainerId);
    setAttendanceMap(recs);

    // Also fetch attendance across all trainers for trainer overview cards
    const trnList = await attendanceService.getTrainers();
    const trainerMap: Record<string, Record<string, AttendanceRecord>> = {};
    for (const t of trnList) {
      trainerMap[t.id] = await attendanceService.getAttendance(selectedDate, t.id);
    }
    setAllTrainerAttendance(trainerMap);

    const notifs = await attendanceService.getNotifications(selectedDate);
    setNotifications(notifs);
  }, [activeTrainerId, selectedDate]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const activeTrainer = trainers.find(t => t.id === activeTrainerId) || null;

  // Navigate to attendance page for a specific trainer
  const selectTrainerAndProceed = (trainerId: string) => {
    setActiveTrainerId(trainerId);
    setCurrentView('attendance');
  };

  // Add new trainer
  const addTrainer = async (trainerData: Omit<Trainer, 'id'>) => {
    const created = await attendanceService.addTrainer(trainerData);
    setTrainers(prev => [...prev, created]);
    showToast(`Trainer "${created.name}" created`, 'success');
    await refreshData();
    return created;
  };

  // Update existing trainer
  const updateTrainer = async (id: string, updates: Partial<Omit<Trainer, 'id'>>) => {
    const updated = await attendanceService.updateTrainer(id, updates);
    setTrainers(prev => prev.map(t => t.id === id ? updated : t));
    showToast(`Trainer "${updated.name}" updated`, 'success');
    await refreshData();
    return updated;
  };

  // Delete trainer
  const deleteTrainer = async (id: string) => {
    const target = trainers.find(t => t.id === id);
    await attendanceService.deleteTrainer(id);
    setTrainers(prev => prev.filter(t => t.id !== id));
    if (activeTrainerId === id) {
      const remaining = trainers.filter(t => t.id !== id);
      if (remaining.length > 0) {
        setActiveTrainerId(remaining[0].id);
      }
    }
    showToast(`Trainer "${target?.name || ''}" removed`, 'info');
    await refreshData();
    return true;
  };

  // Compute summary stats for a trainer on selectedDate
  const getTrainerSummary = useCallback((trainerId: string): TrainerSummary => {
    const assignedStudents = allStudents.filter(s => s.trainerId === trainerId);
    const recs = allTrainerAttendance[trainerId] || {};
    let present = 0;
    let absent = 0;
    let late = 0;
    let marked = 0;

    assignedStudents.forEach(s => {
      const rec = recs[s.id];
      if (rec?.status === 'present') {
        present++;
        marked++;
      } else if (rec?.status === 'absent') {
        absent++;
        marked++;
      } else if (rec?.status === 'late') {
        late++;
        marked++;
      } else if (rec?.status === 'excused') {
        marked++;
      }
    });

    return {
      total: assignedStudents.length,
      present,
      absent,
      late,
      marked
    };
  }, [allStudents, allTrainerAttendance]);

  // Mark attendance for single student
  const markAttendance = async (studentId: string, status: AttendanceStatus, note?: string) => {
    if (!activeTrainer) return;
    
    // Optimistic UI update
    setAttendanceMap(prev => ({
      ...prev,
      [studentId]: {
        id: prev[studentId]?.id || `rec-${studentId}`,
        studentId,
        trainerId: activeTrainer.id,
        date: selectedDate,
        status,
        updatedAt: new Date().toISOString(),
        remarks: note
      }
    }));

    await attendanceService.updateAttendance(studentId, activeTrainer.id, selectedDate, status, note);

    // Automated Parent Notification if marked ABSENT
    if (status === 'absent' && notificationSettings.autoNotifyOnAbsent) {
      const student = students.find(s => s.id === studentId);
      if (student) {
        const notif = await attendanceService.createNotificationForAbsence(
          student, 
          activeTrainer, 
          selectedDate
        );
        setNotifications(prev => [notif, ...prev.filter(n => n.id !== notif.id)]);
        showToast(`Absence alert sent to ${student.parentName} (${student.parentPhone}) for Trainer ${activeTrainer.name}`, 'alert');
      }
    } else if (status === 'present') {
      showToast(`Marked present`, 'success');
    }

    await refreshData();
  };

  // Mark all students present
  const markAllPresent = async () => {
    if (!activeTrainer || students.length === 0) return;
    const updates = students.map(s => ({
      studentId: s.id,
      status: 'present' as AttendanceStatus
    }));

    await attendanceService.batchUpdateAttendance(activeTrainer.id, selectedDate, updates);
    await refreshData();
    showToast(`All ${students.length} assigned students marked Present`, 'success');
  };

  // Reset attendance for this date & trainer
  const resetAttendance = async () => {
    if (!activeTrainer || students.length === 0) return;
    const updates = students.map(s => ({
      studentId: s.id,
      status: 'unmarked' as AttendanceStatus
    }));
    await attendanceService.batchUpdateAttendance(activeTrainer.id, selectedDate, updates);
    await refreshData();
    showToast(`Attendance reset for ${selectedDate}`, 'info');
  };

  // Notify all currently absent students' parents
  const notifyAllAbsent = async () => {
    if (!activeTrainer) return;
    const absentStudents = students.filter(s => attendanceMap[s.id]?.status === 'absent');
    if (absentStudents.length === 0) {
      showToast('No absent students recorded for today', 'info');
      return;
    }

    for (const student of absentStudents) {
      await attendanceService.createNotificationForAbsence(
        student,
        activeTrainer,
        selectedDate
      );
    }

    await refreshData();
    showToast(`Dispatched absence alerts to ${absentStudents.length} parents`, 'alert');
  };

  // Send or preview single notification
  const sendSingleNotification = async (studentId: string, channel?: NotificationChannel) => {
    if (!activeTrainer) return null;
    const student = students.find(s => s.id === studentId);
    if (!student) return null;

    const notif = await attendanceService.createNotificationForAbsence(
      student,
      activeTrainer,
      selectedDate,
      channel
    );

    await refreshData();
    showToast(`Notification sent to ${student.parentName} via ${(channel || notificationSettings.defaultChannel).toUpperCase()}`, 'success');
    return notif;
  };

  // Add new student
  const addStudent = async (studentData: Omit<Student, 'id'>) => {
    const created = await attendanceService.addStudent(studentData);
    await refreshData();
    showToast(`Student ${created.name} assigned`, 'success');
    return created;
  };

  // Import batch of students from Excel/CSV
  const importStudentsBatch = async (studentsData: Omit<Student, 'id'>[]) => {
    const created = await attendanceService.addStudentsBatch(studentsData);
    await refreshData();
    showToast(`Successfully imported ${created.length} students`, 'success');
    return created;
  };

  // Update notification templates and settings
  const updateNotificationSettings = async (settings: NotificationSettings) => {
    const updated = await attendanceService.updateSettings(settings);
    setNotificationSettings(updated);
    showToast('Notification preferences saved', 'success');
  };

  return (
    <AttendanceContext.Provider
      value={{
        currentView,
        setCurrentView,
        trainers,
        activeTrainer,
        setActiveTrainerId,
        selectTrainerAndProceed,
        addTrainer,
        selectedDate,
        setSelectedDate,
        students,
        allStudents,
        attendanceMap,
        notifications,
        notificationSettings,
        updateNotificationSettings,
        markAttendance,
        markAllPresent,
        resetAttendance,
        notifyAllAbsent,
        sendSingleNotification,
        addStudent,
        importStudentsBatch,
        getTrainerSummary,
        isDarkMode,
        toggleDarkMode,
        isSimulatorOpen,
        setIsSimulatorOpen,
        activeSimulatorStudent,
        setActiveSimulatorStudent,
        isNotificationDrawerOpen,
        setIsNotificationDrawerOpen,
        isAddStudentModalOpen,
        setIsAddStudentModalOpen,
        isImportModalOpen,
        setIsImportModalOpen,
        isAddTrainerModalOpen,
        setIsAddTrainerModalOpen,
        editingTrainer,
        setEditingTrainer,
        isEditTrainerModalOpen,
        setIsEditTrainerModalOpen,
        openEditTrainerModal,
        updateTrainer,
        deleteTrainer,
        isDbModalOpen,
        setIsDbModalOpen,
        dbStatus,
        checkDbStatus,
        toastMessage,
        showToast,
        refreshData
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};
