import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  study: { type: String, required: true },
  year: { type: Number, required: true },
  subjects: { type: [String], default: [] },
  notificationPreferences: {
    emailEnabled: { type: Boolean, default: true },
    pushEnabled: { type: Boolean, default: true },
    dailyDigestEnabled: { type: Boolean, default: true },
    reminderHoursBefore: { type: Number, default: 24 }
  },
  webPushSubscription: { type: Object, default: null }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
