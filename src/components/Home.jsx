import { motion } from 'framer-motion';
import TaskList from './TaskList';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';

// Progress Ring Component
const ProgressRing = ({ percentage }) => {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: '80px', height: '80px' }}>
      <svg width="80" height="80" style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx="40"
          cy="40"
          r={radius}
          stroke="var(--border)"
          strokeWidth="6"
          fill="transparent"
        />
        <motion.circle
          cx="40"
          cy="40"
          r={radius}
          stroke="var(--accent)"
          strokeWidth="6"
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ strokeLinecap: 'round' }}
        />
      </svg>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontFamily: 'Fraunces, serif' }}>
        {Math.round(percentage)}%
      </div>
    </div>
  );
};

export default function Home({ user, tasks, onToggle, onDelete }) {
  const today = new Date().toISOString().slice(0, 10);
  const todays = (Array.isArray(tasks) ? tasks : []).filter(t => t.deadline && t.deadline.startsWith(today));
  
  const completedToday = todays.filter(t => t.completed).length;
  const percentage = todays.length > 0 ? (completedToday / todays.length) * 100 : 0;

  const upcoming = (Array.isArray(tasks) ? tasks : [])
    .filter(t => !t.completed && t.deadline && t.deadline > today)
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 5);

  return (
    <div style={{ paddingBottom: '2rem' }}>
      <header className="page-header">
        <h1 className="page-title">
          Hello, {user?.username || 'Student'}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Let's crush today's tasks.</p>
      </header>

      {/* Dashboard Card */}
      <div className="progress-card">
        <div>
          <h3 style={{ fontSize: '1.35rem', marginBottom: '0.25rem' }}>Daily Progress</h3>
          <p style={{ opacity: 0.9, fontWeight: 500 }}>{completedToday} of {todays.length} tasks done</p>
        </div>
        <div style={{ background: 'white', borderRadius: '50%', padding: '4px', color: 'var(--text-main)', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
           <ProgressRing percentage={percentage} />
        </div>
      </div>

      {/* Upcoming Carousel */}
      {upcoming.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Upcoming Deadlines</h2>
          <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem', scrollSnapType: 'x mandatory' }}>
            {upcoming.map(task => (
              <div key={task._id} className="task-card" style={{ minWidth: '200px', flexShrink: 0, scrollSnapAlign: 'start', display: 'block' }}>
                <p style={{ fontWeight: 'bold', marginBottom: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{task.title}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--danger)', fontSize: '0.875rem' }}>
                  <Clock size={14} /> 
                  <span>{new Date(task.deadline).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Today's Tasks */}
      <div>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Today's Tasks</h2>
        {todays.length > 0 ? (
          <TaskList tasks={todays} onToggle={onToggle} onDelete={onDelete} />
        ) : (
          <p className="empty">No tasks scheduled for today. Enjoy your day!</p>
        )}
      </div>
    </div>
  );
}