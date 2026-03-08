import express from 'express';
import User from '../models/User.js';

const router = express.Router();

router.patch('/preferences', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.notificationPreferences = {
      ...user.notificationPreferences,
      ...req.body
    };
    
    await user.save();
    res.json(user.notificationPreferences);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/push-subscription', async (req, res) => {
  try {
    const { subscription } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.webPushSubscription = subscription;
    await user.save();
    
    res.json({ message: 'Push subscription saved successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/vapid-public-key', (req, res) => {
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
});

export default router;