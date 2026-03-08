import { useState, useEffect } from "react";
import "./styles.css";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Home as HomeIcon, CheckSquare, Calendar, User as UserIcon } from "lucide-react";
import { subscribeToPush } from "./pushService.js";

import TaskForm from "./components/TaskForm.jsx";
import Profile from "./components/Profile.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import Home from "./components/Home.jsx";
import AllTasks from "./components/AllTasks.jsx";

const API = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:4000/api';

function AppContent() {
	const { user, token, logout } = useAuth();
	const [tasks, setTasks] = useState([]);
	const [page, setPage] = useState('login');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (user && token) {
			setPage('home');
			fetchTasks(token);
			
			// Request notification permission and subscribe
			if (Notification.permission !== 'denied') {
				Notification.requestPermission().then(permission => {
					if (permission === 'granted') {
						subscribeToPush();
					}
				});
			}
		} else {
			setPage('login');
			setLoading(false);
		}
	}, [user, token]);

	const fetchTasks = async (tkn) => {
		try {
			const res = await axios.get(`${API}/tasks`, {
				headers: { Authorization: `Bearer ${tkn || token}` }
			});
			setTasks(res.data || []);
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const addTask = async (t) => {
		await axios.post(`${API}/tasks`, t, {
			headers: { Authorization: `Bearer ${token}` }
		});
		fetchTasks(token);
		setPage('tasks');
	};

	const toggleTask = async (id) => {
		const t = tasks.find(x => x._id === id);
		if (!t) return;
		await axios.put(`${API}/tasks/${id}`, { completed: !t.completed }, {
			headers: { Authorization: `Bearer ${token}` }
		});
		fetchTasks(token);
	};

	const deleteTask = async (id) => {
		await axios.delete(`${API}/tasks/${id}`, {
			headers: { Authorization: `Bearer ${token}` }
		});
		fetchTasks(token);
	};

	if (!user) {
		return (
			<div className="app">
				<div className="auth-container">
					<AnimatePresence mode="wait">
						<motion.div
							key={page}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							transition={{ duration: 0.3 }}
						>
							{page === 'login' ? <Login switchToRegister={() => setPage('register')} /> : <Register switchToLogin={() => setPage('login')} />}
						</motion.div>
					</AnimatePresence>
				</div>
			</div>
		);
	}

	return (
		<div className="app">
			<main className="screen-container">
				<AnimatePresence mode="wait">
					<motion.div
						key={page}
						initial={{ opacity: 0, x: 10 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -10 }}
						transition={{ duration: 0.2 }}
					>
						{page === 'home' && <Home user={user} tasks={tasks} onToggle={toggleTask} />}
						{page === 'tasks' && <AllTasks tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} onAddTask={addTask} />}
						{page === 'calendar' && (
							<div>
								<h1 className="page-title">Calendar</h1>
								<p className="empty">Calendar view coming soon.</p>
							</div>
						)}
						{page === 'profile' && <Profile user={user} logout={logout} />}
					</motion.div>
				</AnimatePresence>
			</main>

			<nav className="bottom-tabs">
				<a href="#" className={`tab-item ${page === 'home' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setPage('home'); }}>
					<HomeIcon size={24} />
					<span>Home</span>
				</a>
				<a href="#" className={`tab-item ${page === 'tasks' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setPage('tasks'); }}>
					<CheckSquare size={24} />
					<span>Tasks</span>
				</a>
				<a href="#" className={`tab-item ${page === 'calendar' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setPage('calendar'); }}>
					<Calendar size={24} />
					<span>Calendar</span>
				</a>
				<a href="#" className={`tab-item ${page === 'profile' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setPage('profile'); }}>
					<UserIcon size={24} />
					<span>Profile</span>
				</a>
			</nav>
		</div>
	);
}

export default function App() {
	return (
		<AuthProvider>
			<AppContent />
		</AuthProvider>
	);
}
