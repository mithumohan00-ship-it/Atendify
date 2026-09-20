export const SUPABASE_SCHEMA_SQL = `-- ==============================================================================
-- Attendify — Supabase Database Schema & Initial Seed
-- Run this in your Supabase Project > SQL Editor > Click "Run"
-- ==============================================================================

-- 1. Trainers Table
CREATE TABLE IF NOT EXISTS public.trainers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  specialization TEXT NOT NULL,
  batch TEXT NOT NULL,
  room TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  branch TEXT DEFAULT 'Branch 2',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Migration support for existing trainers table:
ALTER TABLE public.trainers ADD COLUMN IF NOT EXISTS branch TEXT DEFAULT 'Branch 2';

-- 2. Students Table
CREATE TABLE IF NOT EXISTS public.students (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  roll_number TEXT NOT NULL,
  trainer_id TEXT REFERENCES public.trainers(id) ON DELETE CASCADE,
  gender TEXT DEFAULT 'other',
  parent_name TEXT NOT NULL,
  parent_relation TEXT DEFAULT 'Father',
  parent_phone TEXT NOT NULL,
  parent_email TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Attendance Records Table
CREATE TABLE IF NOT EXISTS public.attendance_records (
  id TEXT PRIMARY KEY,
  student_id TEXT REFERENCES public.students(id) ON DELETE CASCADE,
  trainer_id TEXT REFERENCES public.trainers(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status TEXT NOT NULL,
  remarks TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, trainer_id, date)
);

-- 4. Parent Notifications Table
CREATE TABLE IF NOT EXISTS public.parent_notifications (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  roll_number TEXT NOT NULL,
  date DATE NOT NULL,
  parent_name TEXT NOT NULL,
  parent_relation TEXT NOT NULL,
  parent_phone TEXT NOT NULL,
  parent_email TEXT DEFAULT '',
  channel TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'sent',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Notification Settings Table
CREATE TABLE IF NOT EXISTS public.notification_settings (
  id TEXT PRIMARY KEY DEFAULT 'default_settings',
  auto_notify_on_absent BOOLEAN DEFAULT true,
  default_channel TEXT DEFAULT 'whatsapp',
  sms_template TEXT NOT NULL,
  whatsapp_template TEXT NOT NULL,
  email_subject_template TEXT NOT NULL,
  email_body_template TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- Row Level Security (RLS) - Enable Read/Write for Anon Key
-- ==============================================================================

ALTER TABLE public.trainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on trainers" ON public.trainers FOR SELECT USING (true);
CREATE POLICY "Allow public write on trainers" ON public.trainers FOR ALL USING (true);

CREATE POLICY "Allow public read on students" ON public.students FOR SELECT USING (true);
CREATE POLICY "Allow public write on students" ON public.students FOR ALL USING (true);

CREATE POLICY "Allow public read on attendance_records" ON public.attendance_records FOR SELECT USING (true);
CREATE POLICY "Allow public write on attendance_records" ON public.attendance_records FOR ALL USING (true);

CREATE POLICY "Allow public read on parent_notifications" ON public.parent_notifications FOR SELECT USING (true);
CREATE POLICY "Allow public write on parent_notifications" ON public.parent_notifications FOR ALL USING (true);

CREATE POLICY "Allow public read on notification_settings" ON public.notification_settings FOR SELECT USING (true);
CREATE POLICY "Allow public write on notification_settings" ON public.notification_settings FOR ALL USING (true);

-- ==============================================================================
-- Initial Seed Data
-- ==============================================================================

INSERT INTO public.trainers (id, name, specialization, batch, room, email, phone, branch)
VALUES 
  ('trainer-marcus', 'Marcus Vance', 'Full Stack Engineering', 'Morning Cohort Alpha', 'Code Lab 01', 'marcus.vance@attendify.tech', '+1 (555) 101-2001', 'Branch 2'),
  ('trainer-sarah', 'Dr. Sarah Mitchell', 'AI & Machine Learning', 'Advanced Track B', 'AI Research Suite', 'sarah.mitchell@attendify.tech', '+1 (555) 101-2002', 'Branch 1'),
  ('trainer-david', 'David Chen', 'UI/UX & Product Design', 'Studio Fellowship', 'Creative Studio 4', 'david.chen@attendify.tech', '+1 (555) 101-2003', 'Branch 2'),
  ('trainer-elena', 'Elena Rostova', 'Cloud & DevOps Architecture', 'Evening Intensive', 'Cloud Ops Lab', 'elena.rostova@attendify.tech', '+1 (555) 101-2004', 'Branch 1')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.students (id, name, roll_number, trainer_id, gender, parent_name, parent_relation, parent_phone, parent_email)
VALUES
  ('stu-1', 'Alexander Wright', 'FS-01', 'trainer-marcus', 'male', 'Robert Wright', 'Father', '+1 (555) 234-5678', 'robert.wright@example.com'),
  ('stu-2', 'Maya Lin', 'FS-02', 'trainer-marcus', 'female', 'Jennifer Lin', 'Mother', '+1 (555) 345-6789', 'jennifer.lin@example.com'),
  ('stu-3', 'Marcus Sterling', 'FS-03', 'trainer-marcus', 'male', 'Eleanor Sterling', 'Mother', '+1 (555) 456-7890', 'eleanor.sterling@example.com'),
  ('stu-4', 'Sophia Rodriguez', 'FS-04', 'trainer-marcus', 'female', 'Carlos Rodriguez', 'Father', '+1 (555) 567-8901', 'carlos.r@example.com'),
  ('stu-5', 'Liam O''Connor', 'AI-01', 'trainer-sarah', 'male', 'Patrick O''Connor', 'Father', '+1 (555) 678-9012', 'patrick.oc@example.com'),
  ('stu-6', 'Zara Patel', 'AI-02', 'trainer-sarah', 'female', 'Amina Patel', 'Mother', '+1 (555) 789-0123', 'amina.patel@example.com'),
  ('stu-7', 'Ethan Nakamura', 'AI-03', 'trainer-sarah', 'male', 'Kenji Nakamura', 'Father', '+1 (555) 890-1234', 'kenji.nakamura@example.com'),
  ('stu-8', 'Chloe Bennett', 'UX-01', 'trainer-david', 'female', 'Diana Bennett', 'Mother', '+1 (555) 901-2345', 'diana.bennett@example.com'),
  ('stu-9', 'Julian Vance', 'UX-02', 'trainer-david', 'male', 'Victor Vance', 'Father', '+1 (555) 012-3456', 'victor.vance@example.com'),
  ('stu-10', 'Aria Montgomery', 'UX-03', 'trainer-david', 'female', 'Laura Montgomery', 'Mother', '+1 (555) 123-4567', 'laura.m@example.com'),
  ('stu-11', 'Lucas Dupont', 'CD-01', 'trainer-elena', 'male', 'Claire Dupont', 'Mother', '+1 (555) 876-5432', 'claire.dupont@example.com'),
  ('stu-12', 'Hannah Schmidt', 'CD-02', 'trainer-elena', 'female', 'Markus Schmidt', 'Father', '+1 (555) 765-4321', 'markus.schmidt@example.com')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.notification_settings (id, auto_notify_on_absent, default_channel, sms_template, whatsapp_template, email_subject_template, email_body_template)
VALUES (
  'default_settings',
  true,
  'whatsapp',
  'Dear {parentName}, attendance alert from Attendify. Your ward, {studentName} ({rollNumber}), was marked ABSENT today ({date}) for the {specialization} session mentored by Trainer {trainerName}.',
  'Hello *{parentName}*,\n\nThis is an automated attendance notice. Your ward *{studentName}* (ID: {rollNumber}) was recorded as *ABSENT* for training today, *{date}*.\n\n👤 Trainer: *{trainerName}*\n📚 Specialization: *{specialization}*\n📍 Location: {room}\n\nIf this absence was pre-scheduled or unexpected, please contact the academy office or reply directly.',
  'Training Attendance Alert: Absence notice for {studentName} on {date}',
  'Dear {parentName},\n\nPlease note that your child {studentName} ({rollNumber}) was marked absent today ({date}) for the {specialization} training session led by Trainer {trainerName}.\n\nWarm regards,\nAcademy Attendance & Operations'
)
ON CONFLICT (id) DO NOTHING;
`;
