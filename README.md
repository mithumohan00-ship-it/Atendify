# Attendify — Minimalist Attendance & Automated Parent Notification Platform

A modern, minimalist web application built with **React**, **TypeScript**, **Tailwind CSS**, and **Supabase** designed for educators, coaches, and academies to rapidly mark student attendance and automatically dispatch parent absence notifications via WhatsApp, SMS, or Email.

---

## ✨ Key Features

- **Minimalist, Clutter-Free UI**: High-contrast, clean borders, fluid animations, and native Dark/Light mode support.
- **Trainer-Centric Architecture**: Students are assigned directly to specialized trainers/mentors across cohorts, labs, and tracks.
- **Rapid Roll Call**: Mark students as `Present`, `Absent`, `Late`, or `Excused`, or use `Mark All Present` for instant batch operations.
- **Automated Parent Absence Alerts**:
  - Automatically stages personalized notifications when any student is marked `Absent`.
  - Mentions the assigned trainer, specialization, and room.
  - One-click direct dispatch to **WhatsApp Web** or mobile app.
- **Smartphone Simulator**: Live interactive phone simulator displaying how the notification will look on the parent's lock screen and chat app.
- **Supabase Cloud Persistence**: Real-time sync with PostgreSQL backend (with resilient offline local storage fallback).
- **Trainer Management**: Easily register and edit trainer details (names, specializations, batches, rooms, emails, contact numbers).

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Lucide Icons
- **Backend & Database**: Supabase (PostgreSQL with Row Level Security)
- **State Management**: React Context API

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/mithumohan00-ship-it/Atendify.git
cd Atendify
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory (based on `.env.example`):
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-publishable-key
```

### 4. Database Setup (Supabase)
Run the SQL migration script in your Supabase project's **SQL Editor**:
- Open the SQL script at `supabase/schema.sql`
- Paste into the Supabase Dashboard > SQL Editor > Click **Run**

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📄 License

MIT License &copy; 2026 Attendify
