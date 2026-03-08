import { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Check, Trash2, Calendar as CalendarIcon, Book } from 'lucide-react';
import confetti from 'canvas-confetti';
import Countdown from './Countdown';

const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function TaskItem({ task, onToggle, onDelete }) {
  const isOverdue = !task.completed && task.deadline && new Date(task.deadline) < new Date();
  
  const handleToggle = () => {
    if (!task.completed) {
      // Confetti burst on completion
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#00C2A8', '#FF6B35', '#FFFCF2']
      });
    }
    onToggle(task._id);
  };

  const getPriorityClass = () => {
    if (!task.deadline) return 'low-priority';
    const daysUntil = (new Date(task.deadline) - new Date()) / (1000 * 60 * 60 * 24);
    if (daysUntil < 1) return 'high-priority';
    if (daysUntil < 3) return 'medium-priority';
    return 'low-priority';
  };

  return (
    <motion.div 
      variants={variants}
      layout
      drag="x"
      dragConstraints={{ left: -100, right: 0 }}
      onDragEnd={(e, info) => {
        if (info.offset.x < -50) {
          const confirm = window.confirm("Delete this task?");
          if (confirm) onDelete(task._id);
        }
      }}
      className={`task-card ${getPriorityClass()} ${isOverdue ? 'overdue' : ''}`}
    >
      <div 
        className={`checkbox-container ${task.completed ? 'checked' : ''}`}
        onClick={handleToggle}
      >
        {task.completed && <Check size={16} strokeWidth={3} />}
      </div>
      
      <div className="task-content">
        <p className={`task-title ${task.completed ? 'completed' : ''}`}>
          {task.title}
        </p>
        
        <div className="task-meta">
          {task.subject && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Book size={12} /> {task.subject}
            </span>
          )}
          {task.deadline && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CalendarIcon size={12} /> {task.deadline.split('T')[0]}
            </span>
          )}
        </div>
      </div>
      
      {/* Visual cue for swipe-to-delete */}
      <div style={{ position: 'absolute', right: '-60px', top: '50%', transform: 'translateY(-50%)', color: '#FF6B35' }}>
        <Trash2 size={24} />
      </div>
    </motion.div>
  );
}