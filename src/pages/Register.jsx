import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react'; // optional – for focusing

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Optional: auto-focus first input on mount
  useEffect(() => {
    document.querySelector('input[name="name"]')?.focus();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing again
    if (error) setError('');
  };

  const handleRegister = async () => {
    // Basic client-side validation
    if (!form.name.trim()) {
      setError('Name is required');
      return;
    }
    if (!form.email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await axios.post('http://localhost:8000/auth/register', form, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      alert('Registration successful! Please log in.');
      navigate('/login');
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Registration failed. Please try again.';
      setError(message);
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleRegister();
    }
  };

  return (
    <div className="register-container" style={{ maxWidth: '400px', margin: '2rem auto', padding: '1.5rem' }}>
      <h2>Register</h2>

      {error && (
        <div style={{ color: 'crimson', marginBottom: '1rem', fontWeight: 500 }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          name="name"
          placeholder="Full name"
          value={form.name}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={loading}
          autoComplete="name"
        />

        <input
          name="email"
          type="email"
          placeholder="Email address"
          value={form.email}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={loading}
          autoComplete="email"
        />

        <input
          name="password"
          type="password"
          placeholder="Password (min 6 characters)"
          value={form.password}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={loading}
          autoComplete="new-password"
        />

        <button
          onClick={handleRegister}
          disabled={loading}
          style={{
            padding: '0.8rem',
            background: loading ? '#aaa' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '1.05rem',
          }}
        >
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </div>

      <p style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        Already have an account?{' '}
        <button
          type="button"
          onClick={() => navigate('/login')}
          style={{ color: '#1976d2', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          Login here
        </button>
      </p>
    </div>
  );
}