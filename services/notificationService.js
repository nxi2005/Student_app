import nodemailer from 'nodemailer';
import webpush from 'web-push';
import dotenv from 'dotenv';
import Task from '../models/Task.js';
import User from '../models/User.js';

dotenv.config();

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
  port: process.env.EMAIL_PORT || 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Configure Web Push
webpush.setVapidDetails(
  'mailto:' + (process.env.EMAIL_FROM || 'test@example.com'),
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html
    });
    console.log(`Email sent to ${to}: ${subject}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export const sendPushNotification = async (subscription, payload) => {
  try {
    if (!subscription) return;
    await webpush.sendNotification(subscription, JSON.stringify(payload));
    console.log('Push notification sent');
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
};

export const sendTaskReminder = async (user, task) => {
  const prefs = user.notificationPreferences;
  const subject = `📚 Reminder: ${task.title} is due soon!`;
  const html = `
    <div style="font-family: 'DM Sans', sans-serif; color: #0F0E17; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #00C2A8;">Task Reminder</h2>
      <p>Hello ${user.username},</p>
      <p>This is a reminder that your task <strong>${task.title}</strong> is due on <strong>${new Date(task.deadline).toLocaleDateString()}</strong>.</p>
      <p>Don't forget to complete it!</p>
    </div>
  `;

  if (prefs?.emailEnabled && user.email) {
    await sendEmail(user.email, subject, html);
  }
  
  if (prefs?.pushEnabled && user.webPushSubscription) {
    await sendPushNotification(user.webPushSubscription, {
      title: 'Task Reminder',
      body: `📚 ${task.title} is due soon!`,
      icon: '/vite.svg'
    });
  }

  // Update task reminder sent status
  task.lastReminderSentAt = new Date();
  await task.save();
};

export const sendOverdueAlert = async (user, task) => {
  const prefs = user.notificationPreferences;
  const subject = `⚠️ Overdue Task: ${task.title}`;
  const html = `
    <div style="font-family: 'DM Sans', sans-serif; color: #0F0E17; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #FF6B35;">Overdue Task Alert</h2>
      <p>Hello ${user.username},</p>
      <p>Your task <strong>${task.title}</strong> was due on <strong>${new Date(task.deadline).toLocaleDateString()}</strong> and is now overdue.</p>
      <p>Please log in and update your progress.</p>
    </div>
  `;

  if (prefs?.emailEnabled && user.email) {
    await sendEmail(user.email, subject, html);
  }
  
  if (prefs?.pushEnabled && user.webPushSubscription) {
    await sendPushNotification(user.webPushSubscription, {
      title: 'Overdue Task',
      body: `⚠️ ${task.title} is overdue. Don't fall behind!`,
      icon: '/vite.svg'
    });
  }

  // Update task overdue sent status
  task.overdueNotificationSentAt = new Date();
  await task.save();
};

export const sendDailyDigest = async (user, tasks) => {
  const prefs = user.notificationPreferences;
  const subject = `☀️ Daily Summary: You have ${tasks.length} tasks due today`;
  
  const tasksHtml = tasks.map(t => `<li><strong>${t.title}</strong></li>`).join('');
  const html = `
    <div style="font-family: 'DM Sans', sans-serif; color: #0F0E17; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #00C2A8;">Your Daily Digest</h2>
      <p>Hello ${user.username},</p>
      <p>You have ${tasks.length} tasks due today:</p>
      <ul>${tasksHtml}</ul>
      <p>Let's get it done!</p>
    </div>
  `;

  if (prefs?.dailyDigestEnabled && prefs?.emailEnabled && user.email) {
    await sendEmail(user.email, subject, html);
  }
  
  if (prefs?.dailyDigestEnabled && prefs?.pushEnabled && user.webPushSubscription) {
    await sendPushNotification(user.webPushSubscription, {
      title: 'Daily Summary',
      body: `☀️ You have ${tasks.length} tasks due today. Let's get it done.`,
      icon: '/vite.svg'
    });
  }
};
