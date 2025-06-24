import React, { useState } from 'react';

const Signup = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            // Replace with your API endpoint
            const res = await fetch('/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    password: form.password,
                }),
            });
            if (!res.ok) {
                const data = await res.json();
                setError(data.message || 'Signup failed');
            } else {
                setSuccess('Signup successful! Please login.');
                setForm({ name: '', email: '', password: '', confirmPassword: '' });
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: '40px auto', padding: 24, border: '1px solid #ddd', borderRadius: 8 }}>
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 12 }}>
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: 8, marginTop: 4 }}
                    />
                </div>
                <div style={{ marginBottom: 12 }}>
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: 8, marginTop: 4 }}
                    />
                </div>
                <div style={{ marginBottom: 12 }}>
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: 8, marginTop: 4 }}
                    />
                </div>
                <div style={{ marginBottom: 12 }}>
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: 8, marginTop: 4 }}
                    />
                </div>
                {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
                {success && <div style={{ color: 'green', marginBottom: 12 }}>{success}</div>}
                <button type="submit" style={{ width: '100%', padding: 10 }}>Sign Up</button>
            </form>
        </div>
    );
};

export default Signup;