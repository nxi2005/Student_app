import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { LogIn } from "lucide-react";

export default function Login({ switchToRegister }) {
	const { login } = useAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		try {
			await login(email, password);
		} catch (err) {
			setError(err.response?.data?.error || "Invalid credentials");
		}
	};

	return (
		<div>
			<h1 className="auth-title">Welcome <br/>Back</h1>
			{error && <p className="error">{error}</p>}
			<form onSubmit={handleSubmit}>
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
				<button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
					<LogIn size={20} /> Sign In
				</button>
			</form>
			<p style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 600 }}>
				Don't have an account? <button onClick={switchToRegister} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 700, cursor: 'pointer', padding: '0 4px' }}>Register</button>
			</p>
		</div>
	);
}