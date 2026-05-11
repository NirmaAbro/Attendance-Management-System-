'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { BookOpen, Mail, Lock, Users, ChevronDown } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [form, setForm] = useState({ email: '', password: '', role: 'student' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.login(form);
      if (res.success) {
        await refresh();
        router.push(res.data?.role === 'admin' ? '/admin' : '/student');
      } else {
        setError(res.message || 'Login failed');
      }
    } catch {
      setError('Connection error. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <BookOpen size={20} className="text-white" />
          </div>
          <span className="font-display text-white text-xl font-bold">AttendanceManager</span>
        </div>
        <div>
          <h1 className="font-display text-5xl font-bold text-white leading-tight mb-6">
            Track Every<br />Attendance,<br />Effortlessly.
          </h1>
          <p className="text-indigo-200 text-lg leading-relaxed">
            A centralized, role-based system for academic attendance monitoring, correction handling, and reporting.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[['Real-time', 'Live updates'], ['Secure', 'RBAC auth'], ['Reports', 'CSV export']].map(([t, s]) => (
            <div key={t} className="bg-white/10 rounded-xl p-4">
              <p className="text-white font-semibold text-sm">{t}</p>
              <p className="text-indigo-300 text-xs mt-1">{s}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md animate-fade-up">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <BookOpen size={20} className="text-indigo-600" />
            <span className="font-display font-bold text-indigo-700">AttendanceManager</span>
          </div>

          <h2 className="font-display text-3xl font-bold text-slate-900 mb-1">Welcome back</h2>
          <p className="text-slate-500 mb-8">Sign in to your account to continue</p>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl px-4 py-3 text-sm mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email" required
                  className="input pl-10"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password" required
                  className="input pl-10"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Role</label>
              <div className="relative">
                <Users size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  className="input pl-10 appearance-none"
                  value={form.role}
                  onChange={e => setForm({ ...form, role: e.target.value })}
                >
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                </select>
                <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="text-indigo-600 font-semibold hover:underline">
              Register
            </Link>
          </p>

          <div className="mt-8 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
            <p className="text-xs font-semibold text-indigo-700 mb-2">Demo credentials</p>
            <p className="text-xs text-slate-600">Admin: <span className="font-mono">admin@gmail.com</span> / <span className="font-mono">admin123</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
