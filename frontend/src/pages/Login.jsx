import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Code2, AlertTriangle } from 'lucide-react';
import { loginAdmin, verifyAdminToken } from '../utils/api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // If already logged in, redirect straight to dashboard
  useEffect(() => {
    const checkAuth = async () => {
      const auth = await verifyAdminToken();
      if (auth.valid) {
        navigate('/admin/dashboard');
      }
    };
    checkAuth();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Both username and password are required');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const result = await loginAdmin(username, password);
      localStorage.setItem('adminToken', result.token);
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden text-slate-200">
      
      {/* Dynamic Ambient Background Glows */}
      <div className="glow-spot glow-spot-primary top-1/4 left-1/3"></div>
      <div className="glow-spot glow-spot-secondary bottom-1/4 right-1/3"></div>

      {/* Login Card */}
      <div className="w-full max-w-md p-8 rounded-3xl glass-panel border-white/20 dark:border-slate-800/60 shadow-2xl relative z-10">
        
        {/* Icon & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-500 to-indigo-600 items-center justify-center text-white shadow-lg shadow-brand-500/20 mb-4">
            <Lock size={22} />
          </div>
          <h2 className="font-display font-extrabold text-2xl text-white">
            Secure Admin Login
          </h2>
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1.5">
            Student Portfolio CMS
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold flex gap-2 items-center mb-6">
            <AlertTriangle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="username" className="text-xs font-bold text-slate-400 uppercase tracking-wide">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                className="w-full glass-input pl-10"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-xs font-bold text-slate-400 uppercase tracking-wide">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full glass-input pl-10"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="glass-button-primary w-full flex items-center justify-center py-3 mt-4 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-900 text-center">
          <a href="/" className="text-xs text-slate-550 hover:text-brand-400 font-semibold tracking-wide uppercase transition-colors">
            &larr; Back to Portfolio
          </a>
        </div>

      </div>

    </div>
  );
}
