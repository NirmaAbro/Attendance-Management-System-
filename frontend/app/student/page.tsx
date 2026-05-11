'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import Sidebar from '@/components/Sidebar';
import { BarChart3, Download, MessageSquare, KeyRound, Send } from 'lucide-react';

const LINKS = [
  { id: 'attendance',  label: 'Attendance Summary', icon: <BarChart3 size={16} /> },
  { id: 'report',      label: 'Download Report',    icon: <Download size={16} /> },
  { id: 'corrections', label: 'Request Correction',  icon: <MessageSquare size={16} /> },
  { id: 'password',    label: 'Change Password',     icon: <KeyRound size={16} /> },
];

interface Attendance { id: string; student_id: string; student_name: string; date: string; status: string; }
interface Correction { id: string; date: string; message: string; status: string; }

export default function StudentDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState('attendance');
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [corrections, setCorrections] = useState<Correction[]>([]);
  const [corrForm, setCorrForm] = useState({ date: '', message: '' });
  const [pwForm, setPwForm] = useState({ old_password: '', new_password: '' });
  const [toast, setToast] = useState('');
  const [busy, setBusy] = useState(false);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };
  const fetchAttendance  = useCallback(async () => { const r = await api.student.getAttendance();  if (r.success) setAttendance(r.data || []); }, []);
  const fetchCorrections = useCallback(async () => { const r = await api.student.getCorrections(); if (r.success) setCorrections(r.data || []); }, []);

  useEffect(() => { if (!loading && (!user || user.role !== 'student')) router.replace('/auth/login'); }, [user, loading, router]);
  useEffect(() => { if (user?.role === 'student') { fetchAttendance(); fetchCorrections(); } }, [user, fetchAttendance, fetchCorrections]);

  if (loading || !user) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>;

  const present = attendance.filter(a => a.status === 'Present').length;
  const total   = attendance.length;
  const pct     = total ? Math.round((present / total) * 100) : 0;

  const downloadReport = async () => {
    try {
      const res = await api.student.downloadReport();
      if (!res.ok) { showToast('Failed to download report'); return; }
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href = url; a.download = 'attendance_report.csv'; a.click();
      URL.revokeObjectURL(url);
      showToast('Report downloaded!');
    } catch { showToast('Download failed'); }
  };

  const submitCorrection = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true);
    const r = await api.student.submitCorrection(corrForm);
    setBusy(false);
    if (r.success) { showToast('Correction submitted!'); setCorrForm({ date: '', message: '' }); fetchCorrections(); }
    else showToast('Error: ' + r.message);
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true);
    const r = await api.student.changePassword(pwForm);
    setBusy(false);
    if (r.success) { showToast('Password updated!'); setPwForm({ old_password: '', new_password: '' }); }
    else showToast('Error: ' + r.message);
  };

  const inp = "w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-slate-50 focus:bg-white transition-all";

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar links={LINKS} active={tab} onSelect={setTab} />
      <main className="flex-1 p-8 overflow-auto">
        {toast && <div className="fixed top-5 right-5 bg-slate-900 text-white text-sm px-5 py-3 rounded-xl shadow-xl z-50 animate-fade-up">{toast}</div>}

        {/* ATTENDANCE */}
        {tab === 'attendance' && (
          <div className="animate-fade-up space-y-6">
            <div>
              <h1 className="font-display text-2xl font-bold text-slate-900">Attendance Summary</h1>
              <p className="text-slate-500 text-sm mt-1">Your personal attendance records</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-5">
                <p className="text-3xl font-bold text-indigo-700">{total}</p>
                <p className="text-sm text-slate-500 mt-1">Total Classes</p>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-5">
                <p className="text-3xl font-bold text-emerald-600">{present}</p>
                <p className="text-sm text-slate-500 mt-1">Present</p>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-5">
                <p className="text-3xl font-bold text-rose-500">{total - present}</p>
                <p className="text-sm text-slate-500 mt-1">Absent</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Attendance Rate</span>
                <span className="text-sm font-bold text-indigo-700">{pct}%</span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-700 ${pct >= 75 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${pct}%` }} />
              </div>
              <p className={`text-xs mt-2 font-medium ${pct >= 75 ? 'text-emerald-600' : 'text-amber-600'}`}>
                {pct >= 75 ? '✓ Good standing' : '⚠ Below 75% attendance threshold'}
              </p>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    {['Student ID','Name','Date','Status'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {attendance.length === 0 && <tr><td colSpan={4} className="text-center py-12 text-slate-400">No attendance records yet</td></tr>}
                  {attendance.map(a => (
                    <tr key={a.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono text-xs text-slate-500">{a.student_id}</td>
                      <td className="px-4 py-3 font-medium">{a.student_name}</td>
                      <td className="px-4 py-3 text-slate-500">{a.date}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${a.status === 'Present' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{a.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* REPORT */}
        {tab === 'report' && (
          <div className="animate-fade-up max-w-lg space-y-6">
            <div>
              <h1 className="font-display text-2xl font-bold text-slate-900">Download Report</h1>
              <p className="text-slate-500 text-sm mt-1">Export attendance as CSV file</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Download size={28} className="text-indigo-600" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">Attendance Report CSV</h3>
              <p className="text-slate-500 text-sm mb-6">{total} attendance records will be included in the export.</p>
              <button onClick={downloadReport} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-all flex items-center gap-2 mx-auto">
                <Download size={16} />Download CSV
              </button>
            </div>
          </div>
        )}

        {/* CORRECTIONS */}
        {tab === 'corrections' && (
          <div className="animate-fade-up space-y-6">
            <div>
              <h1 className="font-display text-2xl font-bold text-slate-900">Request Correction</h1>
              <p className="text-slate-500 text-sm mt-1">Submit a request for incorrect attendance</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-lg">
              <form onSubmit={submitCorrection} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Date of Incorrect Attendance</label>
                  <input type="date" className={inp} required value={corrForm.date} onChange={e => setCorrForm({ ...corrForm, date: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Message to Admin</label>
                  <textarea rows={4} className={inp + " resize-none"} required placeholder="Explain why the attendance should be corrected…" value={corrForm.message} onChange={e => setCorrForm({ ...corrForm, message: e.target.value })} />
                </div>
                <button type="submit" disabled={busy} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2">
                  <Send size={15} />{busy ? 'Submitting…' : 'Submit Request'}
                </button>
              </form>
            </div>

            {corrections.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden max-w-2xl">
                <div className="px-6 py-4 border-b border-slate-100">
                  <h3 className="font-semibold text-slate-800">My Requests</h3>
                </div>
                <table className="w-full text-sm">
                  <thead><tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Message</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                  </tr></thead>
                  <tbody>
                    {corrections.map(c => (
                      <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="px-4 py-3">{c.date}</td>
                        <td className="px-4 py-3 max-w-xs truncate text-slate-600">{c.message}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                            c.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                            c.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                          }`}>{c.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* PASSWORD */}
        {tab === 'password' && (
          <div className="animate-fade-up max-w-md space-y-6">
            <div>
              <h1 className="font-display text-2xl font-bold text-slate-900">Change Password</h1>
              <p className="text-slate-500 text-sm mt-1">Update your account password</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <form onSubmit={changePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Current Password</label>
                  <input type="password" className={inp} required value={pwForm.old_password} onChange={e => setPwForm({ ...pwForm, old_password: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">New Password</label>
                  <input type="password" className={inp} required value={pwForm.new_password} onChange={e => setPwForm({ ...pwForm, new_password: e.target.value })} />
                </div>
                <button type="submit" disabled={busy} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-all">
                  {busy ? 'Updating…' : 'Update Password'}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
