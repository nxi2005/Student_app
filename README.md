# Student Tasks App 📚

A modern, mobile-first task tracking application designed for students. Stay organized, track academic deadlines, and receive automated reminders.

![PWA Ready](https://img.shields.io/badge/PWA-Ready-success)
![React](https://img.shields.io/badge/React-19-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-success)

## 🎯 Key Features

- **Mobile-First Experience:** A fully installable Progressive Web App (PWA) with a premium mobile UI.
- **Task Management:** Group tasks by "Today", "Tomorrow", "This Week", and "Later".
- **Visual Progress:** SVG progress ring and upcoming deadline carousels for easy visualization.
- **Smart Notifications:** 
  - **Email Reminders:** (24h before due date)
  - **Overdue Alerts:** Stay on top of late tasks.
  - **Daily Digest:** A summary of your day sent every morning.
  - **Web Push Notifications:** Get alerted directly on your mobile device.
- **Custom Subjects:** Manage personal subjects alongside global defaults.
- **Secure Authentication:** JWT-based login with hashed passwords.

## 🛠️ Tech Stack

- **Frontend:** React (Vite), Framer Motion, Styled-components, Lucide-react.
- **Backend:** Node.js, Express, Nodemailer, Node-cron.
- **Database:** MongoDB Atlas (Cloud).
- **PWA Tooling:** `vite-plugin-pwa`, `web-push`.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account (or local MongoDB)
- SMTP credentials (for email notifications)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/student-tasks-app.git
   cd student-tasks-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory (refer to `.env.example`):
   ```bash
   MONGO_URI=your_mongodb_atlas_uri
   PORT=4000
   JWT_SECRET=your_secret_key
   EMAIL_USER=your_smtp_user
   EMAIL_PASS=your_smtp_pass
   VAPID_PUBLIC_KEY=your_vapid_key
   VAPID_PRIVATE_KEY=your_vapid_private_key
   ```

4. **Run the application:**
   ```bash
   npm run dev:full
   ```
   The app will start at `http://localhost:5173` and the API at `http://localhost:4000`.

## 📦 Scripts

- `npm run dev`: Start Vite dev server.
- `npm run server`: Start Express server with Nodemon.
- `npm run dev:full`: Start both frontend and backend concurrently.
- `npm run build`: Build the PWA for production.
- `npm run lint`: Lint the codebase.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
Created with ❤️ for students.
