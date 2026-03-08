import { useState } from 'react';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import { Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AllTasks({ tasks, onToggle, onDelete, onAddTask }) {
  const [showForm, setShowForm] = useState(false);

  const todayStr = new Date().toISOString().slice(0, 10);
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrowStr = tomorrowDate.toISOString().slice(0, 10);
  
  const weekDate = new Date();
  weekDate.setDate(weekDate.getDate() + 7);
  const weekStr = weekDate.toISOString().slice(0, 10);

  const grouped = {
    Today: [],
    Tomorrow: [],
    'This Week': [],
    Later: []
  };

  (tasks || []).forEach(t => {
    if (!t.deadline) {
      grouped.Later.push(t);
    } else {
      const date = t.deadline.slice(0, 10);
      if (date === todayStr) {
        grouped.Today.push(t);
      } else if (date === tomorrowStr) {
        grouped.Tomorrow.push(t);
      } else if (date <= weekStr) {
        grouped['This Week'].push(t);
      } else {
        grouped.Later.push(t);
      }
    }
  });

  return (
    <div style={{ paddingBottom: '5rem' }}>
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>All Tasks</h1>
        <button 
          className="btn btn-primary" 
          style={{ width: 'auto', padding: '0.625rem', borderRadius: '50%', boxShadow: '0 4px 12px rgba(0, 194, 168, 0.2)' }}
          onClick={() => setShowForm(true)}
        >
          <Plus size={24} strokeWidth={3} />
        </button>
      </header>

      {Object.entries(grouped).map(([group, groupTasks]) => (
        groupTasks.length > 0 && (
          <div key={group} style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {group}
            </h3>
            <TaskList tasks={groupTasks} onToggle={onToggle} onDelete={onDelete} />
          </div>
        )
      ))}

      {tasks?.length === 0 && (
        <p className="empty">No tasks found. Click + to add one.</p>
      )}

      {/* Bottom Sheet for Task Form */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, backdropFilter: 'blur(4px)' }}
              onClick={() => setShowForm(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ 
                position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', 
                width: '100%', maxWidth: '430px', 
                backgroundColor: 'var(--bg-main)', 
                borderTopLeftRadius: '1.5rem', borderTopRightRadius: '1.5rem', 
                padding: '1.5rem', zIndex: 101, 
                boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
                maxHeight: '90vh', overflowY: 'auto'
              }}
            >
              <div style={{ width: '40px', height: '4px', backgroundColor: 'var(--border)', borderRadius: '2px', margin: '0 auto 1.5rem auto' }} />
              <TaskForm onAddTask={(t) => { onAddTask(t); setShowForm(false); }} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}