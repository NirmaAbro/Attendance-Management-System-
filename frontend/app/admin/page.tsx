'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import Sidebar from '@/components/Sidebar';
import { Users, BarChart3, MessageSquare, KeyRound, Trash2, Plus, Pencil, Check, X } from 'lucide-react';

const LINKS = [
  { id: 'students',    label: 'Students',          icon: <Users size={16} /> },
  { id: 'attendance',  label: 'Attendance Summary', icon: <BarChart3 size={16} /> },
  { id: 'corrections', label: 'Corrections',        icon: <MessageSquare size={16} /> },
  { id: 'password',    label: 'Change Password',    icon: <KeyRound size={16} /> },
];

interface Student { id: string; name: string; email: string; }
interface Attendance { id: string; student_id: string; student_name: string; date: string; status: string; }
interface Correction { id: string; student_id: string; date: string; message: string; status: string; }

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState('students');
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [corrections, setCorrections] = useState<Correction[]>([]);
  const [newAtt, setNewAtt] = useState({ student_id: '', student_name: '', date: '', status: 'Present' });
  const [editingAtt, setEditingAtt] = useState<{ id: string; status: string } | null>(null);
  const [pwForm, setPwForm] = useState({ old_password: '', new_password: '' });
  const [toast, setToast] = useState('');
  const [busy, setBusy] = useState(false);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };
  const fetchStudents    = useCallback(async () => { const r = await api.admin.getStudents();    if (r.success) setStudents(r.data || []); }, []);
  const fetchAttendance  = useCallback(async () => { const r = await api.admin.getAttendance();  if (r.success) setAttendance(r.data || []); }, []);
  const fetchCorrections = useCallback(async () => { const r = await api.admin.getCorrections(); if (r.success) setCorrections(r.data || []); }, []);

  useEffect(() => { if (!loading && (!user || user.role !== 'admin')) router.replace('/auth/login'); }, [user, loading, router]);
  useEffect(() => { if (user?.role === 'admin') { fetchStudents(); fetchAttendance(); fetchCorrections(); } }, [user, fetchStudents, fetchAttendance, fetchCorrections]);

  if (loading || !user) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>;

  const deleteStudent = async (id: string) => {
    if (!confirm('Delete this student and all their records?')) return;
    const r = await api.admin.deleteStudent(id);
    if (r.success) { showToast('Student deleted'); fetchStudents(); fetchAttendance(); }
    else showToast('Error: ' + r.message);
  };

  const addAttendance = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true);
    const r = await api.admin.addAttendance({ ...newAtt });
    setBusy(false);
    if (r.success) { showToast('Attendance added'); fetchAttendance(); setNewAtt({ student_id: '', student_name: '', date: '', status: 'Present' }); }
    else showToast('Error: ' + r.message);
  };

  const saveAttEdit = async () => {
    if (!editingAtt) return;
    const r = await api.admin.updateAttendance(editingAtt.id, editingAtt.status);
    if (r.success) { showToast('Updated'); fetchAttendance(); setEditingAtt(null); }
    else showToast('Error: ' + r.message);
  };

  const deleteAttendance = async (id: string) => {
    if (!confirm('Delete this record?')) return;
    const r = await api.admin.deleteAttendance(id);
    if (r.success) { showToast('Deleted'); fetchAttendance(); }
  };

  const updateCorrection = async (id: string, status: string) => {
    const r = await api.admin.updateCorrection(id, status);
    if (r.success) { showToast('Correction ' + status); fetchCorrections(); }
    else showToast('Error: ' + r.message);
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true);
    const r = await api.admin.changePassword(pwForm);
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

        {/* STUDENTS */}
        {tab === 'students' && (
          <div className="animate-fade-up space-y-6">
            <div>
              <h1 className="font-display text-2xl font-bold text-slate-900">Manage Students</h1>
              <p className="text-slate-500 text-sm mt-1">{students.length} registered students</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Email</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {students.length === 0 && <tr><td colSpan={3} className="text-center py-12 text-slate-400">No students registered yet</td></tr>}
                  {students.map(s => (
                    <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium">{s.name}</td>
                      <td className="px-4 py-3 text-slate-500">{s.email}</td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => deleteStudent(s.id)} className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ml-auto">
                          <Trash2 size={12} />Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ATTENDANCE */}
        {tab === 'attendance' && (
          <div className="animate-fade-up space-y-6">
            <div>
              <h1 className="font-display text-2xl font-bold text-slate-900">Attendance Summary</h1>
              <p className="text-slate-500 text-sm mt-1">Add, update or remove attendance records</p>
            </div>

            {/* Add form */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><Plus size={16} className="text-indigo-600" />Mark Attendance</h2>
              <form onSubmit={addAttendance} className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <input className={inp} placeholder="Student ID (any text)" required value={newAtt.student_id} onChange={e => setNewAtt({ ...newAtt, student_id: e.target.value })} />
                <input className={inp} placeholder="Student Name" required value={newAtt.student_name} onChange={e => setNewAtt({ ...newAtt, student_name: e.target.value })} />
                <input className={inp} type="date" required value={newAtt.date} onChange={e => setNewAtt({ ...newAtt, date: e.target.value })} />
                <select className={inp} value={newAtt.status} onChange={e => setNewAtt({ ...newAtt, status: e.target.value })}>
                  <option>Present</option><option>Absent</option>
                </select>
                <button type="submit" disabled={busy} className="md:col-span-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2">
                  <Plus size={16} />{busy ? 'Adding…' : 'Add Attendance Record'}
                </button>
              </form>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    {['Student ID','Name','Date','Status','Actions'].map(h => (
                      <th key={h} className={`px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide ${h === 'Actions' ? 'text-right' : 'text-left'}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {attendance.length === 0 && <tr><td colSpan={5} className="text-center py-12 text-slate-400">No attendance records yet</td></tr>}
                  {attendance.map(a => (
                    <tr key={a.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono text-xs text-slate-500">{a.student_id}</td>
                      <td className="px-4 py-3 font-medium">{a.student_name}</td>
                      <td className="px-4 py-3 text-slate-500">{a.date}</td>
                      <td className="px-4 py-3">
                        {editingAtt?.id === a.id ? (
                          <select className="border border-slate-200 rounded-lg px-2 py-1 text-xs bg-white" value={editingAtt.status} onChange={e => setEditingAtt({ ...editingAtt, status: e.target.value })}>
                            <option>Present</option><option>Absent</option>
                          </select>
                        ) : (
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${a.status === 'Present' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{a.status}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {editingAtt?.id === a.id ? (
                            <>
                              <button onClick={saveAttEdit} className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1"><Check size={12}/>Save</button>
                              <button onClick={() => setEditingAtt(null)} className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg"><X size={12}/></button>
                            </>
                          ) : (
                            <button onClick={() => setEditingAtt({ id: a.id, status: a.status })} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1"><Pencil size={12}/>Edit</button>
                          )}
                          <button onClick={() => deleteAttendance(a.id)} className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1"><Trash2 size={12}/>Del</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CORRECTIONS */}
        {tab === 'corrections' && (
          <div className="animate-fade-up space-y-6">
            <div>
              <h1 className="font-display text-2xl font-bold text-slate-900">Correction Requests</h1>
              <p className="text-slate-500 text-sm mt-1">{corrections.filter(c => c.status === 'Pending').length} pending</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    {['Student ID','Date','Message','Status','Actions'].map(h => (
                      <th key={h} className={`px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide ${h === 'Actions' ? 'text-right' : 'text-left'}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {corrections.length === 0 && <tr><td colSpan={5} className="text-center py-12 text-slate-400">No correction requests</td></tr>}
                  {corrections.map(c => (
                    <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono text-xs text-slate-500">{c.student_id.slice(-8)}</td>
                      <td className="px-4 py-3">{c.date}</td>
                      <td className="px-4 py-3 max-w-xs truncate text-slate-600">{c.message}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          c.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                          c.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                        }`}>{c.status}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {c.status === 'Pending' && (
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => updateCorrection(c.id, 'Approved')} className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1"><Check size={12}/>Approve</button>
                            <button onClick={() => updateCorrection(c.id, 'Rejected')} className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1"><X size={12}/>Reject</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PASSWORD */}
        {tab === 'password' && (
          <div className="animate-fade-up max-w-md space-y-6">
            <div>
              <h1 className="font-display text-2xl font-bold text-slate-900">Change Password</h1>
              <p className="text-slate-500 text-sm mt-1">Update your admin account password</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
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
