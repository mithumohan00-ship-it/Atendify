import { 
  Student, 
  AttendanceRecord, 
  AttendanceStatus, 
  ParentNotification, 
  Trainer, 
  NotificationSettings, 
  NotificationChannel 
} from '../types';
import { 
  INITIAL_TRAINERS, 
  INITIAL_STUDENTS, 
  DEFAULT_NOTIFICATION_SETTINGS 
} from '../data/mockData';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const STORAGE_KEYS = {
  TRAINERS: 'attendify_trainers',
  STUDENTS: 'attendify_students',
  RECORDS: 'attendify_records',
  NOTIFICATIONS: 'attendify_notifications',
  SETTINGS: 'attendify_settings'
};

class AttendanceService {
  // --- Check Database Status ---
  isUsingDatabase(): boolean {
    return isSupabaseConfigured && Boolean(supabase);
  }

  async checkDatabaseConnection(): Promise<{ configured: boolean; connected: boolean; hasTables: boolean; error?: string }> {
    if (!this.isUsingDatabase()) {
      return { configured: false, connected: false, hasTables: false, error: 'Supabase credentials not configured' };
    }
    try {
      const { error } = await supabase!.from('trainers').select('id', { head: true });
      if (error) {
        if (error.code === 'PGRST205' || error.message?.includes('schema cache') || error.message?.includes('relation') || error.code === '42P01') {
          return { configured: true, connected: true, hasTables: false, error: 'Tables have not been created yet in Supabase.' };
        }
        return { configured: true, connected: false, hasTables: false, error: error.message };
      }
      return { configured: true, connected: true, hasTables: true };
    } catch (err: any) {
      return { configured: true, connected: false, hasTables: false, error: err?.message || 'Connection failed' };
    }
  }

  // --- Trainers ---
  async getTrainers(): Promise<Trainer[]> {
    if (this.isUsingDatabase()) {
      try {
        const { data, error } = await supabase!.from('trainers').select('*').order('name');
        if (!error && data && data.length > 0) {
          return data as Trainer[];
        }
      } catch (e) {
        console.warn('Supabase query failed, falling back to local cache', e);
      }
    }

    const raw = localStorage.getItem(STORAGE_KEYS.TRAINERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.TRAINERS, JSON.stringify(INITIAL_TRAINERS));
      return INITIAL_TRAINERS;
    }
    return JSON.parse(raw);
  }

  async addTrainer(trainerData: Omit<Trainer, 'id'>): Promise<Trainer> {
    const newTrainer: Trainer = {
      ...trainerData,
      id: `trainer-${Date.now()}`
    };

    if (this.isUsingDatabase()) {
      try {
        const { data, error } = await supabase!.from('trainers').insert([newTrainer]).select().single();
        if (!error && data) {
          return data as Trainer;
        }
      } catch (e) {
        console.warn('Supabase insert failed, saving locally', e);
      }
    }

    const trainers = await this.getTrainers();
    const updated = [...trainers, newTrainer];
    localStorage.setItem(STORAGE_KEYS.TRAINERS, JSON.stringify(updated));
    return newTrainer;
  }

  async updateTrainer(id: string, updates: Partial<Omit<Trainer, 'id'>>): Promise<Trainer> {
    let updatedTrainer: Trainer | null = null;

    if (this.isUsingDatabase()) {
      try {
        const { data, error } = await supabase!
          .from('trainers')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        if (!error && data) {
          updatedTrainer = data as Trainer;
        } else if (error) {
          console.warn('Supabase trainer update failed', error);
        }
      } catch (e) {
        console.warn('Supabase trainer update error, updating locally', e);
      }
    }

    const trainers = await this.getTrainers();
    const existing = trainers.find(t => t.id === id);
    if (!updatedTrainer && existing) {
      updatedTrainer = { ...existing, ...updates };
    }

    if (updatedTrainer) {
      const updatedList = trainers.map(t => t.id === id ? updatedTrainer! : t);
      localStorage.setItem(STORAGE_KEYS.TRAINERS, JSON.stringify(updatedList));
      return updatedTrainer;
    }

    throw new Error(`Trainer with id ${id} not found`);
  }

  async deleteTrainer(id: string): Promise<boolean> {
    if (this.isUsingDatabase()) {
      try {
        const { error } = await supabase!
          .from('trainers')
          .delete()
          .eq('id', id);
        if (error) {
          console.warn('Supabase trainer delete error', error);
        }
      } catch (e) {
        console.warn('Supabase trainer delete failed', e);
      }
    }

    const trainers = await this.getTrainers();
    const filtered = trainers.filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.TRAINERS, JSON.stringify(filtered));
    return true;
  }

  // --- Students ---
  async getStudents(trainerId?: string): Promise<Student[]> {
    if (this.isUsingDatabase()) {
      try {
        let query = supabase!.from('students').select('*').order('name');
        if (trainerId) {
          query = query.eq('trainer_id', trainerId);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data.map((d: any) => ({
            id: d.id,
            name: d.name,
            rollNumber: d.roll_number,
            trainerId: d.trainer_id,
            gender: d.gender,
            parentName: d.parent_name,
            parentRelation: d.parent_relation,
            parentPhone: d.parent_phone,
            parentEmail: d.parent_email
          })) as Student[];
        }
      } catch (e) {
        console.warn('Supabase student query failed, using local cache', e);
      }
    }

    const raw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    let students: Student[] = raw ? JSON.parse(raw) : INITIAL_STUDENTS;
    
    // Auto migrate if previous dataset had classId instead of trainerId
    if (students.length > 0 && !(students[0] as any).trainerId) {
      students = INITIAL_STUDENTS;
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
    } else if (!raw) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
    }

    if (trainerId) {
      return students.filter(s => s.trainerId === trainerId);
    }
    return students;
  }

  async addStudent(studentData: Omit<Student, 'id'>): Promise<Student> {
    const newStudent: Student = {
      ...studentData,
      id: `stu-${Date.now()}`
    };

    if (this.isUsingDatabase()) {
      try {
        const { error } = await supabase!.from('students').insert([{
          id: newStudent.id,
          name: newStudent.name,
          roll_number: newStudent.rollNumber,
          trainer_id: newStudent.trainerId,
          gender: newStudent.gender,
          parent_name: newStudent.parentName,
          parent_relation: newStudent.parentRelation,
          parent_phone: newStudent.parentPhone,
          parent_email: newStudent.parentEmail
        }]);
        if (!error) {
          return newStudent;
        }
      } catch (e) {
        console.warn('Supabase student insert failed, saving locally', e);
      }
    }

    const students = await this.getStudents();
    const updated = [newStudent, ...students];
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(updated));
    return newStudent;
  }

  // --- Attendance Records ---
  async getAttendance(date: string, trainerId: string): Promise<Record<string, AttendanceRecord>> {
    if (this.isUsingDatabase()) {
      try {
        const { data, error } = await supabase!
          .from('attendance_records')
          .select('*')
          .eq('date', date)
          .eq('trainer_id', trainerId);

        if (!error && data) {
          const map: Record<string, AttendanceRecord> = {};
          data.forEach((rec: any) => {
            map[rec.student_id] = {
              id: rec.id,
              studentId: rec.student_id,
              trainerId: rec.trainer_id,
              date: rec.date,
              status: rec.status,
              remarks: rec.remarks,
              updatedAt: rec.updated_at
            };
          });
          return map;
        }
      } catch (e) {
        console.warn('Supabase attendance query failed, using local cache', e);
      }
    }

    const raw = localStorage.getItem(STORAGE_KEYS.RECORDS);
    const allRecords: AttendanceRecord[] = raw ? JSON.parse(raw) : [];
    
    // Filter records for this date and trainer
    const filtered = allRecords.filter(r => r.date === date && r.trainerId === trainerId);
    const map: Record<string, AttendanceRecord> = {};
    filtered.forEach(rec => {
      map[rec.studentId] = rec;
    });
    return map;
  }

  async updateAttendance(
    studentId: string, 
    trainerId: string, 
    date: string, 
    status: AttendanceStatus,
    remarks?: string
  ): Promise<AttendanceRecord> {
    const updatedRecord: AttendanceRecord = {
      id: `rec-${date}-${studentId}`,
      studentId,
      trainerId,
      date,
      status,
      updatedAt: new Date().toISOString(),
      remarks
    };

    if (this.isUsingDatabase()) {
      try {
        await supabase!.from('attendance_records').upsert([{
          id: updatedRecord.id,
          student_id: studentId,
          trainer_id: trainerId,
          date,
          status,
          remarks: remarks || '',
          updated_at: updatedRecord.updatedAt
        }], { onConflict: 'student_id,trainer_id,date' });
      } catch (e) {
        console.warn('Supabase attendance upsert failed, saving locally', e);
      }
    }

    const raw = localStorage.getItem(STORAGE_KEYS.RECORDS);
    let allRecords: AttendanceRecord[] = raw ? JSON.parse(raw) : [];

    const existingIndex = allRecords.findIndex(
      r => r.studentId === studentId && r.date === date && r.trainerId === trainerId
    );

    if (existingIndex >= 0) {
      allRecords[existingIndex] = updatedRecord;
    } else {
      allRecords.push(updatedRecord);
    }

    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(allRecords));
    return updatedRecord;
  }

  async batchUpdateAttendance(
    trainerId: string, 
    date: string, 
    updates: { studentId: string; status: AttendanceStatus }[]
  ): Promise<void> {
    const recordsToInsert = updates.map(u => ({
      id: `rec-${date}-${u.studentId}`,
      student_id: u.studentId,
      trainer_id: trainerId,
      date,
      status: u.status,
      updated_at: new Date().toISOString()
    }));

    if (this.isUsingDatabase()) {
      try {
        await supabase!.from('attendance_records').upsert(recordsToInsert, {
          onConflict: 'student_id,trainer_id,date'
        });
      } catch (e) {
        console.warn('Supabase batch attendance update failed', e);
      }
    }

    const raw = localStorage.getItem(STORAGE_KEYS.RECORDS);
    let allRecords: AttendanceRecord[] = raw ? JSON.parse(raw) : [];

    updates.forEach(u => {
      const existingIndex = allRecords.findIndex(
        r => r.studentId === u.studentId && r.date === date && r.trainerId === trainerId
      );
      const updated: AttendanceRecord = {
        id: existingIndex >= 0 ? allRecords[existingIndex].id : `rec-${date}-${u.studentId}`,
        studentId: u.studentId,
        trainerId,
        date,
        status: u.status,
        updatedAt: new Date().toISOString()
      };

      if (existingIndex >= 0) {
        allRecords[existingIndex] = updated;
      } else {
        allRecords.push(updated);
      }
    });

    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(allRecords));
  }

  // --- Parent Notifications ---
  async getNotifications(date?: string): Promise<ParentNotification[]> {
    if (this.isUsingDatabase()) {
      try {
        let query = supabase!.from('parent_notifications').select('*').order('created_at', { ascending: false });
        if (date) {
          query = query.eq('date', date);
        }
        const { data, error } = await query;
        if (!error && data) {
          return data.map((d: any) => ({
            id: d.id,
            studentId: d.student_id,
            studentName: d.student_name,
            rollNumber: d.roll_number,
            date: d.date,
            parentName: d.parent_name,
            parentRelation: d.parent_relation,
            parentPhone: d.parent_phone,
            parentEmail: d.parent_email,
            channel: d.channel,
            message: d.message,
            status: d.status,
            createdAt: d.created_at,
            sentAt: d.sent_at
          })) as ParentNotification[];
        }
      } catch (e) {
        console.warn('Supabase notification query failed', e);
      }
    }

    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const notifications: ParentNotification[] = raw ? JSON.parse(raw) : [];
    if (date) {
      return notifications.filter(n => n.date === date);
    }
    return notifications;
  }

  async createNotificationForAbsence(
    student: Student, 
    trainer: Trainer, 
    date: string,
    channel?: NotificationChannel
  ): Promise<ParentNotification> {
    const settings = await this.getSettings();
    const activeChannel = channel || settings.defaultChannel;

    let template = settings.whatsappTemplate;
    if (activeChannel === 'sms') template = settings.smsTemplate;
    if (activeChannel === 'email') template = settings.emailBodyTemplate;

    const message = template
      .replace(/{studentName}/g, student.name)
      .replace(/{parentName}/g, student.parentName)
      .replace(/{rollNumber}/g, student.rollNumber)
      .replace(/{date}/g, date)
      .replace(/{trainerName}/g, trainer.name)
      .replace(/{specialization}/g, trainer.specialization)
      .replace(/{room}/g, trainer.room)
      .replace(/{batch}/g, trainer.batch);

    const newNotification: ParentNotification = {
      id: `notif-${date}-${student.id}`,
      studentId: student.id,
      studentName: student.name,
      rollNumber: student.rollNumber,
      date,
      parentName: student.parentName,
      parentRelation: student.parentRelation,
      parentPhone: student.parentPhone,
      parentEmail: student.parentEmail,
      channel: activeChannel,
      message,
      status: 'sent',
      createdAt: new Date().toISOString(),
      sentAt: new Date().toISOString()
    };

    if (this.isUsingDatabase()) {
      try {
        await supabase!.from('parent_notifications').upsert([{
          id: newNotification.id,
          student_id: newNotification.studentId,
          student_name: newNotification.studentName,
          roll_number: newNotification.rollNumber,
          date: newNotification.date,
          parent_name: newNotification.parentName,
          parent_relation: newNotification.parentRelation,
          parent_phone: newNotification.parentPhone,
          parent_email: newNotification.parentEmail,
          channel: newNotification.channel,
          message: newNotification.message,
          status: newNotification.status,
          created_at: newNotification.createdAt,
          sent_at: newNotification.sentAt
        }]);
      } catch (e) {
        console.warn('Supabase notification insert failed', e);
      }
    }

    const notifications = await this.getNotifications();
    const existing = notifications.find(
      n => n.studentId === student.id && n.date === date
    );

    let updatedNotifications: ParentNotification[];
    if (existing) {
      updatedNotifications = notifications.map(n => n.id === existing.id ? newNotification : n);
    } else {
      updatedNotifications = [newNotification, ...notifications];
    }

    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updatedNotifications));
    return newNotification;
  }

  // --- Settings ---
  async getSettings(): Promise<NotificationSettings> {
    if (this.isUsingDatabase()) {
      try {
        const { data, error } = await supabase!.from('notification_settings').select('*').single();
        if (!error && data) {
          return {
            autoNotifyOnAbsent: data.auto_notify_on_absent,
            defaultChannel: data.default_channel,
            smsTemplate: data.sms_template,
            whatsappTemplate: data.whatsapp_template,
            emailSubjectTemplate: data.email_subject_template,
            emailBodyTemplate: data.email_body_template
          };
        }
      } catch (e) {
        console.warn('Supabase settings query failed', e);
      }
    }

    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_NOTIFICATION_SETTINGS));
      return DEFAULT_NOTIFICATION_SETTINGS;
    }
    return JSON.parse(raw);
  }

  async updateSettings(newSettings: NotificationSettings): Promise<NotificationSettings> {
    if (this.isUsingDatabase()) {
      try {
        await supabase!.from('notification_settings').upsert([{
          id: 'default_settings',
          auto_notify_on_absent: newSettings.autoNotifyOnAbsent,
          default_channel: newSettings.defaultChannel,
          sms_template: newSettings.smsTemplate,
          whatsapp_template: newSettings.whatsappTemplate,
          email_subject_template: newSettings.emailSubjectTemplate,
          email_body_template: newSettings.emailBodyTemplate
        }]);
      } catch (e) {
        console.warn('Supabase settings update failed', e);
      }
    }

    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));
    return newSettings;
  }
}

export const attendanceService = new AttendanceService();
