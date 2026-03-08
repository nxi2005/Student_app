import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  subject: { type: String, default: null },
  deadline: { type: Date, default: null },
  completed: { type: Boolean, default: false },
  lastReminderSentAt: { type: Date, default: null },
  overdueNotificationSentAt: { type: Date, default: null }
}, { timestamps: true });

export default mongoose.models.Task || mongoose.model('Task', TaskSchema);
