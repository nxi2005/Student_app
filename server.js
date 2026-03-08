import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from './models/User.js';
import Task from './models/Task.js';
import Subject from './models/Subject.js';
import notificationsRouter from './routes/notifications.js';
import { startCronJobs } from './services/cronJobs.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;
const SECRET = process.env.JWT_SECRET || 'tajniKljuc';

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

const infoMid = (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
};
app.use(infoMid);

async function seed() {
  const count = await Subject.countDocuments();
  if (count === 0) {
    await Subject.insertMany([{ name: 'Matematika' }, { name: 'Programiranje' }, { name: 'Fizika' }]);
    console.log('✓ Seeded default subjects');
  }
}

const provjeriToken = (req, res, next) => {
  const authZaglavlje = req.headers['authorization'];
  if (!authZaglavlje) return res.status(403).json({ error: 'Ne postoji autorizacijsko zaglavlje' });

  const token = authZaglavlje.split(' ')[1];
  if (!token) return res.status(403).json({ error: 'Bearer token nije pronađen' });

  try {
    const dekodiraniToken = jwt.verify(token, SECRET);
    req.user = dekodiraniToken;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Neispravni Token' });
  }
};

app.use('/api/notifications', provjeriToken, notificationsRouter);

// --- AUTH ENDPOINTS ---
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password, study, year } = req.body;
    if (!username || !email || !password || !study || !year) return res.status(400).json({ error: 'Missing fields' });
    
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: 'User already exists' });

    const saltRunde = 10;
    const hashLozinka = await bcrypt.hash(password, saltRunde);
    
    await User.create({ 
      username, 
      email, 
      password: hashLozinka, 
      study, 
      year
    });
    
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, username: user.username },
      SECRET,
      { expiresIn: '1h' }
    );
    
    res.json({ token, user: { id: user._id, username: user.username, email: user.email, study: user.study, year: user.year } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- TASK ENDPOINTS (PROTECTED) ---
app.get('/api/tasks', provjeriToken, async (req, res) => {
  const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json(tasks);
});

app.post('/api/tasks', provjeriToken, async (req, res) => {
  try {
    const { title, deadline, subject } = req.body;
    const task = await Task.create({ userId: req.user.id, title, subject, deadline });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/tasks/:id', provjeriToken, async (req, res) => {
  const t = await Task.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, req.body, { new: true });
  res.json(t);
});

app.delete('/api/tasks/:id', provjeriToken, async (req, res) => {
  await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  res.json({ ok: true });
});

// --- SUBJECTS ---
app.get('/api/subjects', async (req, res) => {
  const globalSubjects = await Subject.find();
  res.json(globalSubjects);
});

// New: Get all available subjects for a specific user (Global + Personal)
app.get('/api/subjects/all', provjeriToken, async (req, res) => {
  try {
    const globalSubs = await Subject.find();
    const user = await User.findById(req.user.id);
    const personalSubs = user.subjects || [];
    
    // Combine both lists
    const combined = [
      ...globalSubs.map(s => ({ name: s.name, type: 'global' })),
      ...personalSubs.map(s => ({ name: s, type: 'personal' }))
    ];
    res.json(combined);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// New: Manage personal subjects
app.post('/api/my-subjects', provjeriToken, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Naziv kolegija je obavezan' });
    
    const user = await User.findById(req.user.id);
    if (!user.subjects.includes(name)) {
      user.subjects.push(name);
      await user.save();
    }
    res.json(user.subjects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/my-subjects/:name', provjeriToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.subjects = user.subjects.filter(s => s !== req.params.name);
    await user.save();
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- PROFILE ---
app.get('/api/profile', provjeriToken, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Dogodila se pogreška!');
});

async function start() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✓ Connected to MongoDB');
  await seed();
  startCronJobs();
  app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
  });
}

start().catch(err => console.error(err));
