import { Trainer, Student, NotificationSettings } from '../types';

export const INITIAL_TRAINERS: Trainer[] = [
  {
    id: 'trainer-marcus',
    name: 'Marcus Vance',
    specialization: 'Full Stack Engineering',
    batch: 'Morning Cohort Alpha',
    room: 'Code Lab 01',
    email: 'marcus.vance@attendify.tech',
    phone: '+1 (555) 101-2001',
    branch: 'Branch 2'
  },
  {
    id: 'trainer-sarah',
    name: 'Dr. Sarah Mitchell',
    specialization: 'AI & Machine Learning',
    batch: 'Advanced Track B',
    room: 'AI Research Suite',
    email: 'sarah.mitchell@attendify.tech',
    phone: '+1 (555) 101-2002',
    branch: 'Branch 1'
  },
  {
    id: 'trainer-david',
    name: 'David Chen',
    specialization: 'UI/UX & Product Design',
    batch: 'Studio Fellowship',
    room: 'Creative Studio 4',
    email: 'david.chen@attendify.tech',
    phone: '+1 (555) 101-2003',
    branch: 'Branch 2'
  },
  {
    id: 'trainer-elena',
    name: 'Elena Rostova',
    specialization: 'Cloud & DevOps Architecture',
    batch: 'Evening Intensive',
    room: 'Cloud Ops Lab',
    email: 'elena.rostova@attendify.tech',
    phone: '+1 (555) 101-2004',
    branch: 'Branch 1'
  }
];

export const INITIAL_STUDENTS: Student[] = [
  // Students assigned to Trainer Marcus Vance (Full Stack Engineering)
  {
    id: 'stu-1',
    name: 'Alexander Wright',
    rollNumber: 'FS-01',
    trainerId: 'trainer-marcus',
    gender: 'male',
    parentName: 'Robert Wright',
    parentRelation: 'Father',
    parentPhone: '+1 (555) 234-5678',
    parentEmail: 'robert.wright@example.com'
  },
  {
    id: 'stu-2',
    name: 'Maya Lin',
    rollNumber: 'FS-02',
    trainerId: 'trainer-marcus',
    gender: 'female',
    parentName: 'Jennifer Lin',
    parentRelation: 'Mother',
    parentPhone: '+1 (555) 345-6789',
    parentEmail: 'jennifer.lin@example.com'
  },
  {
    id: 'stu-3',
    name: 'Marcus Sterling',
    rollNumber: 'FS-03',
    trainerId: 'trainer-marcus',
    gender: 'male',
    parentName: 'Eleanor Sterling',
    parentRelation: 'Mother',
    parentPhone: '+1 (555) 456-7890',
    parentEmail: 'eleanor.sterling@example.com'
  },
  {
    id: 'stu-4',
    name: 'Sophia Rodriguez',
    rollNumber: 'FS-04',
    trainerId: 'trainer-marcus',
    gender: 'female',
    parentName: 'Carlos Rodriguez',
    parentRelation: 'Father',
    parentPhone: '+1 (555) 567-8901',
    parentEmail: 'carlos.r@example.com'
  },

  // Students assigned to Trainer Dr. Sarah Mitchell (AI & Machine Learning)
  {
    id: 'stu-5',
    name: 'Liam O\'Connor',
    rollNumber: 'AI-01',
    trainerId: 'trainer-sarah',
    gender: 'male',
    parentName: 'Patrick O\'Connor',
    parentRelation: 'Father',
    parentPhone: '+1 (555) 678-9012',
    parentEmail: 'patrick.oc@example.com'
  },
  {
    id: 'stu-6',
    name: 'Zara Patel',
    rollNumber: 'AI-02',
    trainerId: 'trainer-sarah',
    gender: 'female',
    parentName: 'Amina Patel',
    parentRelation: 'Mother',
    parentPhone: '+1 (555) 789-0123',
    parentEmail: 'amina.patel@example.com'
  },
  {
    id: 'stu-7',
    name: 'Ethan Nakamura',
    rollNumber: 'AI-03',
    trainerId: 'trainer-sarah',
    gender: 'male',
    parentName: 'Kenji Nakamura',
    parentRelation: 'Father',
    parentPhone: '+1 (555) 890-1234',
    parentEmail: 'kenji.nakamura@example.com'
  },

  // Students assigned to Trainer David Chen (UI/UX & Product Design)
  {
    id: 'stu-8',
    name: 'Chloe Bennett',
    rollNumber: 'UX-01',
    trainerId: 'trainer-david',
    gender: 'female',
    parentName: 'Diana Bennett',
    parentRelation: 'Mother',
    parentPhone: '+1 (555) 901-2345',
    parentEmail: 'diana.bennett@example.com'
  },
  {
    id: 'stu-9',
    name: 'Julian Vance',
    rollNumber: 'UX-02',
    trainerId: 'trainer-david',
    gender: 'male',
    parentName: 'Victor Vance',
    parentRelation: 'Father',
    parentPhone: '+1 (555) 012-3456',
    parentEmail: 'victor.vance@example.com'
  },
  {
    id: 'stu-10',
    name: 'Aria Montgomery',
    rollNumber: 'UX-03',
    trainerId: 'trainer-david',
    gender: 'female',
    parentName: 'Laura Montgomery',
    parentRelation: 'Mother',
    parentPhone: '+1 (555) 123-4567',
    parentEmail: 'laura.m@example.com'
  },

  // Students assigned to Trainer Elena Rostova (Cloud & DevOps)
  {
    id: 'stu-11',
    name: 'Lucas Dupont',
    rollNumber: 'CD-01',
    trainerId: 'trainer-elena',
    gender: 'male',
    parentName: 'Claire Dupont',
    parentRelation: 'Mother',
    parentPhone: '+1 (555) 876-5432',
    parentEmail: 'claire.dupont@example.com'
  },
  {
    id: 'stu-12',
    name: 'Hannah Schmidt',
    rollNumber: 'CD-02',
    trainerId: 'trainer-elena',
    gender: 'female',
    parentName: 'Markus Schmidt',
    parentRelation: 'Father',
    parentPhone: '+1 (555) 765-4321',
    parentEmail: 'markus.schmidt@example.com'
  }
];

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  autoNotifyOnAbsent: true,
  defaultChannel: 'whatsapp',
  smsTemplate: 'Dear {parentName}, attendance alert from Attendify. Your ward, {studentName} ({rollNumber}), was marked ABSENT today ({date}) for the {specialization} session mentored by Trainer {trainerName}.',
  whatsappTemplate: 'Hello *{parentName}*,\n\nThis is an automated attendance notice. Your ward *{studentName}* (ID: `{rollNumber}`) was recorded as *ABSENT* for training today, *{date}*.\n\n👤 Trainer: *{trainerName}*\n📚 Specialization: *{specialization}*\n📍 Location: {room}\n\nIf this absence was pre-scheduled or unexpected, please contact the academy office or reply directly.',
  emailSubjectTemplate: 'Training Attendance Alert: Absence notice for {studentName} on {date}',
  emailBodyTemplate: 'Dear {parentName},\n\nPlease note that your child {studentName} ({rollNumber}) was marked absent today ({date}) for the {specialization} training session led by Trainer {trainerName}.\n\nWarm regards,\nAcademy Attendance & Operations'
};
