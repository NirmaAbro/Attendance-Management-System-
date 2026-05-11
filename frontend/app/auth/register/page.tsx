'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { BookOpen, Mail, Lock, Users, User, ChevronDown } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setLoading(true);
    try {
      const res = await api.register(form);
      if (res.success) {
        setSuccess('Account created! Redirecting to login…');
        setTimeout(() => router.push('/auth/login'), 1500);
      } else {
        setError(res.message || 'Registration failed');
      }
    } catch {
      setError('Connection error. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <BookOpen size={20} className="text-white" />
          </div>
          <span className="font-display text-white text-xl font-bold">AttendanceManager</span>
        </div>
        <div>
          <h1 className="font-display text-5xl font-bold text-white leading-tight mb-6">
            Join the<br />Digital<br />Classroom.
          </h1>
          <p className="text-emerald-200 text-lg leading-relaxed">
            Create your account to start tracking attendance, submitting corrections, and downloading reports.
          </p>
        </div>
        <div className="bg-white/10 rounded-2xl p-6">
          <p className="text-emerald-300 text-sm font-semibold mb-3">What you get</p>
          <ul className="space-y-2 text-white text-sm">
            {['View attendance summary in real time','Submit correction requests','Download CSV attendance reports','Secure role-based access'].map(f => (
              <li key={f} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />{f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md animate-fade-up">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <BookOpen size={20} className="text-indigo-600" />
            <span className="font-display font-bold text-indigo-700">AttendanceManager</span>
          </div>

          <h2 className="font-display text-3xl font-bold text-slate-900 mb-1">Create account</h2>
          <p className="text-slate-500 mb-8">Fill in your details to get started</p>

          {error && <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl px-4 py-3 text-sm mb-6">{error}</div>}
          {success && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-sm mb-6">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" required className="input pl-10" placeholder="Jane Smith"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" required className="input pl-10" placeholder="you@example.com"
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="password" required className="input pl-10" placeholder="••••••••"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Role</label>
              <div className="relative">
                <Users size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <select className="input pl-10 appearance-none" value={form.role}
                  onChange={e => setForm({ ...form, role: e.target.value })}>
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                </select>
                <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-indigo-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
