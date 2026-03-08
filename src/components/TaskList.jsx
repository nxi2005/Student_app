import { motion } from "framer-motion";
import TaskItem from "./TaskItem";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

export default function TaskList({ tasks, onToggle, onDelete }) {
	if (!tasks || !tasks.length) return (
		<div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
			<svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 1rem auto', display: 'block', opacity: 0.5 }}>
				<path d="M12 20h9"/>
				<path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
			</svg>
			<p>No tasks here. Take a break!</p>
		</div>
	);

	return (
		<motion.div 
			className="task-list"
			variants={container}
			initial="hidden"
			animate="visible"
		>
			{tasks.map(task => (
				<TaskItem key={task._id} task={task} onToggle={onToggle} onDelete={onDelete} />
			))}
		</motion.div>
	);
}