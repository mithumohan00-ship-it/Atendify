export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused' | 'unmarked';

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  trainerId: string;
  avatar?: string;
  gender: 'male' | 'female' | 'other';
  parentName: string;
  parentRelation: 'Father' | 'Mother' | 'Guardian';
  parentPhone: string;
  parentEmail: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  trainerId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  updatedAt: string;
  remarks?: string;
}

export type NotificationChannel = 'whatsapp' | 'sms' | 'email';
export type NotificationStatus = 'queued' | 'sent' | 'delivered' | 'failed';

export interface ParentNotification {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  date: string;
  parentName: string;
  parentRelation: string;
  parentPhone: string;
  parentEmail: string;
  channel: NotificationChannel;
  message: string;
  status: NotificationStatus;
  createdAt: string;
  sentAt?: string;
}

export interface Trainer {
  id: string;
  name: string;
  specialization: string;
  batch: string;
  room: string;
  email: string;
  phone: string;
  branch?: string; // e.g. 'Branch 2' | 'Branch 1'
}

export interface NotificationSettings {
  autoNotifyOnAbsent: boolean;
  defaultChannel: NotificationChannel;
  smsTemplate: string;
  whatsappTemplate: string;
  emailSubjectTemplate: string;
  emailBodyTemplate: string;
}
