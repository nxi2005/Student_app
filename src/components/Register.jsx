import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { UserPlus } from "lucide-react";

export default function Register({ switchToLogin }) {
	const { register, login } = useAuth();
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [study, setStudy] = useState("");
	const [year, setYear] = useState(1);
	const [error, setError] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		try {
			await register({ username, email, password, study, year: Number(year) });
			await login(email, password);
		} catch (err) {
			setError(err.response?.data?.error || "Registration error");
		}
	};

	return (
		<div>
			<h1 className="auth-title">Join the <br/>Community</h1>
			{error && <p className="error">{error}</p>}
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label htmlFor="username">Username</label>
					<input
						type="text"
						id="username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						placeholder="Student123"
						required
					/>
				</div>
				<div className="form-group">
					<label htmlFor="email">Email Address</label>
					<input
						type="email"
						id="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="email@example.com"
						required
					/>
				</div>
				<div className="form-group">
					<label htmlFor="password">Password</label>
					<input
						type="password"
						id="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="••••••••"
						required
					/>
				</div>
				<div className="form-group">
					<label htmlFor="study">Course / Study</label>
					<input
						type="text"
						id="study"
						value={study}
						onChange={(e) => setStudy(e.target.value)}
						placeholder="Computer Science"
						required
					/>
				</div>
				<div className="form-group">
					<label htmlFor="year">Current Year</label>
					<input
						type="number"
						id="year"
						min="1"
						max="8"
						value={year}
						onChange={(e) => setYear(e.target.value)}
						required
					/>
				</div>
				<button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
					<UserPlus size={20} /> Create Account
				</button>
			</form>
			<p style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 600 }}>
				Already have an account? <button onClick={switchToLogin} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 700, cursor: 'pointer', padding: '0 4px' }}>Sign In</button>
			</p>
		</div>
	);
}