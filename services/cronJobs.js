import cron from 'node-cron';
import Task from '../models/Task.js';
import User from '../models/User.js';
import { sendTaskReminder, sendOverdueAlert, sendDailyDigest } from './notificationService.js';

export const startCronJobs = () => {
  // Check for upcoming reminders every hour
  cron.schedule('0 * * * *', async () => {
    try {
      console.log('Running task reminder check...');
      const now = new Date();
      
      const users = await User.find({});
      for (const user of users) {
        const hoursBefore = user.notificationPreferences?.reminderHoursBefore || 24;
        const reminderTime = new Date(now.getTime() + hoursBefore * 60 * 60 * 1000);
        
        // Find tasks due within the reminder timeframe, not completed, and no reminder sent yet
        const tasks = await Task.find({
          userId: user._id,
          completed: false,
          deadline: { $lte: reminderTime, $gt: now },
          lastReminderSentAt: null
        });

        for (const task of tasks) {
          await sendTaskReminder(user, task);
        }
      }
    } catch (error) {
      console.error('Error running reminder cron job:', error);
    }
  });

  // Check for overdue tasks every hour
  cron.schedule('0 * * * *', async () => {
    try {
      console.log('Running overdue task check...');
      const now = new Date();
      
      const tasks = await Task.find({
        completed: false,
        deadline: { $lt: now },
        overdueNotificationSentAt: null
      }).populate('userId');

      for (const task of tasks) {
        if (task.userId) {
          await sendOverdueAlert(task.userId, task);
        }
      }
    } catch (error) {
      console.error('Error running overdue cron job:', error);
    }
  });

  // Daily digest at 8:00 AM user time (simplified to server time for now)
  cron.schedule('0 8 * * *', async () => {
    try {
      console.log('Running daily digest...');
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      
      const users = await User.find({ 'notificationPreferences.dailyDigestEnabled': true });
      for (const user of users) {
        const tasks = await Task.find({
          userId: user._id,
          completed: false,
          deadline: { $gte: startOfDay, $lte: endOfDay }
        });

        if (tasks.length > 0) {
          await sendDailyDigest(user, tasks);
        }
      }
    } catch (error) {
      console.error('Error running daily digest cron job:', error);
    }
  });

  console.log('Cron jobs scheduled');
};
