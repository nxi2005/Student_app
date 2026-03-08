import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";

export default function TaskForm({ onAddTask, user, openProfile }) {
	const { token } = useAuth();
	const [title, setTitle] = useState("");
	const [subject, setSubject] = useState("");
	const [deadline, setDeadline] = useState("");
	const [subjects, setSubjects] = useState([]);

	useEffect(() => {
		const fetchSubjects = async () => {
			try {
				const res = await axios.get("http://localhost:4000/api/subjects/all", {
					headers: { Authorization: `Bearer ${token || localStorage.getItem('token')}` }
				});
				setSubjects(res.data);
			} catch (err) {
				console.error("Error fetching subjects", err);
			}
		};
		if (token) fetchSubjects();
	}, [token]);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!title) return;
		onAddTask({ title, subject, deadline });
		setTitle("");
		setSubject("");
		setDeadline("");
	};

	return (
		<div className="task-form">
			<h2>Novi zadatak</h2>
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label>Naslov:</label>
					<input
						type="text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder="npr. Domaća zadaća"
						required
					/>
				</div>
				<div className="form-group">
					<label>Kolegij:</label>
					<select value={subject} onChange={(e) => setSubject(e.target.value)}>
						<option value="">-- Odaberi kolegij --</option>
						{subjects.map((s, index) => (
							<option key={index} value={s.name}>
								{s.name} {s.type === 'personal' ? '(moj)' : ''}
							</option>
						))}
					</select>
				</div>
				<div className="form-group">
					<label>Rok:</label>
					<input
						type="date"
						value={deadline}
						onChange={(e) => setDeadline(e.target.value)}
					/>
				</div>
				<button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Create Task</button>
			</form>
		</div>
	);
}
