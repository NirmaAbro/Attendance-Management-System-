// 'use client';
// import { useEffect, useState, useCallback } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '@/lib/auth-context';
// import { api } from '@/lib/api';
// import Sidebar from '@/components/Sidebar';
// import { Users, BarChart3, MessageSquare, KeyRound, Trash2, Plus, Pencil, Check, X } from 'lucide-react';

// const LINKS = [
//   { id: 'students', label: 'Students', icon: <Users size={16} /> },
//   { id: 'attendance', label: 'Attendance Summary', icon: <BarChart3 size={16} /> },
//   { id: 'corrections', label: 'Corrections', icon: <MessageSquare size={16} /> },
//   { id: 'password', label: 'Change Password', icon: <KeyRound size={16} /> },
// ];

// interface Student { id: string; name: string; email: string; }
// interface Attendance { id: string; student_id: string; student_name: string; date: string; status: string; }
// interface Correction { id: string; student_id: string; date: string; message: string; status: string; }

// export default function AdminDashboard() {
//   const { user, loading } = useAuth();
//   const router = useRouter();
//   const [tab, setTab] = useState('students');
//   const [students, setStudents] = useState<Student[]>([]);

//   const [studentForm, setStudentForm] = useState({
//     name: '',
//     email: '',
//     password: '',
//   });

//   const [editingStudent, setEditingStudent] = useState<string | null>(null);
//   const [attendance, setAttendance] = useState<Attendance[]>([]);
//   const [corrections, setCorrections] = useState<Correction[]>([]);
//   const [newAtt, setNewAtt] = useState({ student_id: '', student_name: '', date: '', status: 'Present' });
//   const [editingAtt, setEditingAtt] = useState<{ id: string; status: string } | null>(null);
//   const [pwForm, setPwForm] = useState({ old_password: '', new_password: '' });
//   const [toast, setToast] = useState('');
//   const [busy, setBusy] = useState(false);

//   const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };
//   const fetchStudents = useCallback(async () => { const r = await api.admin.getStudents(); if (r.success) setStudents(r.data || []); }, []);
//   const fetchAttendance = useCallback(async () => { const r = await api.admin.getAttendance(); if (r.success) setAttendance(r.data || []); }, []);
//   const fetchCorrections = useCallback(async () => { const r = await api.admin.getCorrections(); if (r.success) setCorrections(r.data || []); }, []);

//   useEffect(() => { if (!loading && (!user || user.role !== 'admin')) router.replace('/auth/login'); }, [user, loading, router]);
//   useEffect(() => { if (user?.role === 'admin') { fetchStudents(); fetchAttendance(); fetchCorrections(); } }, [user, fetchStudents, fetchAttendance, fetchCorrections]);

//   if (loading || !user) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>;

//   const createStudent = async (e: React.FormEvent) => {
//     e.preventDefault();

//     setBusy(true);

//     const r = await api.admin.createStudent({
//       ...studentForm,
//       role: 'student',
//     });

//     setBusy(false);

//     if (r.success) {
//       showToast('Student created successfully');

//       setStudentForm({
//         name: '',
//         email: '',
//         password: '',
//       });

//       fetchStudents();
//     } else {
//       showToast('Error: ' + r.message);
//     }
//   };

//   const updateStudent = async (id: string) => {

//     const r = await api.admin.updateStudent(id, {
//       name: studentForm.name,
//       email: studentForm.email,
//     });

//     if (r.success) {

//       showToast('Student updated');

//       setEditingStudent(null);

//       setStudentForm({
//         name: '',
//         email: '',
//         password: '',
//       });

//       fetchStudents();

//     } else {
//       showToast('Error: ' + r.message);
//     }
//   };

//   const deleteStudent = async (id: string) => {
//     if (!confirm('Delete this student and all their records?')) return;
//     const r = await api.admin.deleteStudent(id);
//     if (r.success) { showToast('Student deleted'); fetchStudents(); fetchAttendance(); }
//     else showToast('Error: ' + r.message);
//   };

//   const addAttendance = async (e: React.FormEvent) => {
//     e.preventDefault(); setBusy(true);
//     const r = await api.admin.addAttendance({ ...newAtt });
//     setBusy(false);
//     if (r.success) { showToast('Attendance added'); fetchAttendance(); setNewAtt({ student_id: '', student_name: '', date: '', status: 'Present' }); }
//     else showToast('Error: ' + r.message);
//   };

//   const saveAttEdit = async () => {
//     if (!editingAtt) return;
//     const r = await api.admin.updateAttendance(editingAtt.id, editingAtt.status);
//     if (r.success) { showToast('Updated'); fetchAttendance(); setEditingAtt(null); }
//     else showToast('Error: ' + r.message);
//   };

//   const deleteAttendance = async (id: string) => {
//     if (!confirm('Delete this record?')) return;
//     const r = await api.admin.deleteAttendance(id);
//     if (r.success) { showToast('Deleted'); fetchAttendance(); }
//   };

//   const updateCorrection = async (id: string, status: string) => {
//     const r = await api.admin.updateCorrection(id, status);
//     if (r.success) { showToast('Correction ' + status); fetchCorrections(); }
//     else showToast('Error: ' + r.message);
//   };

//   const changePassword = async (e: React.FormEvent) => {
//     e.preventDefault(); setBusy(true);
//     const r = await api.admin.changePassword(pwForm);
//     setBusy(false);
//     if (r.success) { showToast('Password updated!'); setPwForm({ old_password: '', new_password: '' }); }
//     else showToast('Error: ' + r.message);
//   };

//   const inp = "w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-slate-50 focus:bg-white transition-all";

//   return (
//     <div className="flex min-h-screen bg-slate-50">
//       <Sidebar links={LINKS} active={tab} onSelect={setTab} />
//       <main className="flex-1 p-8 overflow-auto">
//         {toast && <div className="fixed top-5 right-5 bg-slate-900 text-white text-sm px-5 py-3 rounded-xl shadow-xl z-50 animate-fade-up">{toast}</div>}

//         {/* STUDENTS */}
//         {tab === 'students' && (
//           <div className="animate-fade-up space-y-6">
//             <div>
//               <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
//                 <h2 className="text-lg font-bold mb-4">
//                   {editingStudent ? 'Update Student' : 'Create Student'}
//                 </h2>

//                 <form
//                   onSubmit={
//                     editingStudent
//                       ? (e) => {
//                         e.preventDefault();
//                         updateStudent(editingStudent);
//                       }
//                       : createStudent
//                   }
//                   className="grid grid-cols-1 md:grid-cols-3 gap-3"
//                 >
//                   <input
//                     className={inp}
//                     placeholder="Student Name"
//                     value={studentForm.name}
//                     onChange={(e) =>
//                       setStudentForm({
//                         ...studentForm,
//                         name: e.target.value,
//                       })
//                     }
//                     required
//                   />

//                   <input
//                     className={inp}
//                     placeholder="Student Email"
//                     type="email"
//                     value={studentForm.email}
//                     onChange={(e) =>
//                       setStudentForm({
//                         ...studentForm,
//                         email: e.target.value,
//                       })
//                     }
//                     required
//                   />

//                   {!editingStudent && (
//                     <input
//                       className={inp}
//                       placeholder="Password"
//                       type="password"
//                       value={studentForm.password}
//                       onChange={(e) =>
//                         setStudentForm({
//                           ...studentForm,
//                           password: e.target.value,
//                         })
//                       }
//                       required
//                     />
//                   )}

//                   <button
//                     type="submit"
//                     className="md:col-span-3 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-semibold"
//                   >
//                     {editingStudent ? 'Update Student' : 'Create Student'}
//                   </button>
//                 </form>
//               </div>
//             </div>
//             <div>
//               <h1 className="font-display text-2xl font-bold text-slate-900">Manage Students</h1>
//               <p className="text-slate-500 text-sm mt-1">{students.length} registered students</p>
//             </div>
//             <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="bg-slate-50 border-b border-slate-200">
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Name</th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Email</th>
//                     <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {students.length === 0 && <tr><td colSpan={3} className="text-center py-12 text-slate-400">No students registered yet</td></tr>}
//                   {students.map(s => (
//                     <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50">
//                       <td className="px-4 py-3 font-medium">{s.name}</td>
//                       <td className="px-4 py-3 text-slate-500">{s.email}</td>
//                       {/* <td className="px-4 py-3 text-right">
//                         <button
//                           onClick={() => {
//                             setEditingStudent(s.id);

//                             setStudentForm({
//                               name: s.name,
//                               email: s.email,
//                               password: '',
//                             });
//                           }}
//                           className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1"
//                         >
//                           <Pencil size={12} />
//                           Edit
//                         </button>
//                         <button onClick={() => deleteStudent(s.id)} className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ml-auto">
//                           <Trash2 size={12} />Delete
//                         </button>
//                       </td> */}

//                       <td className="px-4 py-3">
//                         <div className="flex justify-end gap-2">

//                           <button
//                             onClick={() => {
//                               setEditingStudent(s.id);

//                               setStudentForm({
//                                 name: s.name,
//                                 email: s.email,
//                                 password: '',
//                               });
//                             }}
//                             className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1"
//                           >
//                             <Pencil size={12} />
//                             Edit
//                           </button>

//                           <button
//                             onClick={() => deleteStudent(s.id)}
//                             className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1"
//                           >
//                             <Trash2 size={12} />
//                             Delete
//                           </button>

//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}

//         {/* ATTENDANCE */}
//         {tab === 'attendance' && (
//           <div className="animate-fade-up space-y-6">
//             <div>
//               <h1 className="font-display text-2xl font-bold text-slate-900">Attendance Summary</h1>
//               <p className="text-slate-500 text-sm mt-1">Add, update or remove attendance records</p>
//             </div>

//             {/* Add form */}
//             <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
//               <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><Plus size={16} className="text-indigo-600" />Mark Attendance</h2>
//               <form onSubmit={addAttendance} className="grid grid-cols-1 md:grid-cols-4 gap-3">

//                 <select
//                   className={inp}
//                   value={newAtt.student_id}
//                   onChange={(e) => {
//                     const student = students.find(s => s.id === e.target.value);

//                     setNewAtt({
//                       ...newAtt,
//                       student_id: e.target.value,
//                       student_name: student?.name || '',
//                     });
//                   }}
//                 >
//                   <option value="">Select Student</option>

//                   {students.map((s) => (
//                     <option key={s.id} value={s.id}>
//                       {s.name}
//                     </option>
//                   ))}
//                 </select>
//                 {/* <input className={inp} placeholder="Student ID (any text)" required value={newAtt.student_id} onChange={e => setNewAtt({ ...newAtt, student_id: e.target.value })} /> */}
//                 {/* <input className={inp} placeholder="Student Name" required value={newAtt.student_name} onChange={e => setNewAtt({ ...newAtt, student_name: e.target.value })} /> */}
//                 <input className={inp} type="date" required value={newAtt.date} onChange={e => setNewAtt({ ...newAtt, date: e.target.value })} />
//                 <select className={inp} value={newAtt.status} onChange={e => setNewAtt({ ...newAtt, status: e.target.value })}>
//                   <option>Present</option><option>Absent</option>
//                 </select>
//                 <button type="submit" disabled={busy} className="md:col-span-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2">
//                   <Plus size={16} />{busy ? 'Adding…' : 'Add Attendance Record'}
//                 </button>
//               </form>
//             </div>

//             {/* Table */}
//             <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="bg-slate-50 border-b border-slate-200">
//                     {['Student ID', 'Name', 'Date', 'Status', 'Actions'].map(h => (
//                       <th key={h} className={`px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide ${h === 'Actions' ? 'text-right' : 'text-left'}`}>{h}</th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {attendance.length === 0 && <tr><td colSpan={5} className="text-center py-12 text-slate-400">No attendance records yet</td></tr>}
//                   {attendance.map(a => (
//                     <tr key={a.id} className="border-b border-slate-100 hover:bg-slate-50">
//                       <td className="px-4 py-3 font-mono text-xs text-slate-500">{a.student_id}</td>
//                       <td className="px-4 py-3 font-medium">{a.student_name}</td>
//                       <td className="px-4 py-3 text-slate-500">{a.date}</td>
//                       <td className="px-4 py-3">
//                         {editingAtt?.id === a.id ? (
//                           <select className="border border-slate-200 rounded-lg px-2 py-1 text-xs bg-white" value={editingAtt.status} onChange={e => setEditingAtt({ ...editingAtt, status: e.target.value })}>
//                             <option>Present</option><option>Absent</option>
//                           </select>
//                         ) : (
//                           <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${a.status === 'Present' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{a.status}</span>
//                         )}
//                       </td>

//                       <td className="px-4 py-3">
//                         <div className="flex justify-end gap-2">
//                           {editingAtt?.id === a.id ? (
//                             <>
//                               <button onClick={saveAttEdit} className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1"><Check size={12} />Save</button>
//                               <button onClick={() => setEditingAtt(null)} className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg"><X size={12} /></button>
//                             </>
//                           ) : (
//                             <button onClick={() => setEditingAtt({ id: a.id, status: a.status })} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1"><Pencil size={12} />Edit</button>
//                           )}
//                           <button onClick={() => deleteAttendance(a.id)} className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1"><Trash2 size={12} />Del</button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )
//         }

//         {/* CORRECTIONS */}
//         {
//           tab === 'corrections' && (
//             <div className="animate-fade-up space-y-6">
//               <div>
//                 <h1 className="font-display text-2xl font-bold text-slate-900">Correction Requests</h1>
//                 <p className="text-slate-500 text-sm mt-1">{corrections.filter(c => c.status === 'Pending').length} pending</p>
//               </div>
//               <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
//                 <table className="w-full text-sm">
//                   <thead>
//                     <tr className="bg-slate-50 border-b border-slate-200">
//                       {['Student ID', 'Date', 'Message', 'Status', 'Actions'].map(h => (
//                         <th key={h} className={`px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide ${h === 'Actions' ? 'text-right' : 'text-left'}`}>{h}</th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {corrections.length === 0 && <tr><td colSpan={5} className="text-center py-12 text-slate-400">No correction requests</td></tr>}
//                     {corrections.map(c => (
//                       <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50">
//                         <td className="px-4 py-3 font-mono text-xs text-slate-500">{c.student_id.slice(-8)}</td>
//                         <td className="px-4 py-3">{c.date}</td>
//                         <td className="px-4 py-3 max-w-xs truncate text-slate-600">{c.message}</td>
//                         <td className="px-4 py-3">
//                           <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${c.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
//                             c.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
//                             }`}>{c.status}</span>
//                         </td>
//                         <td className="px-4 py-3 text-right">
//                           {c.status === 'Pending' && (
//                             <div className="flex items-center justify-end gap-2">
//                               <button onClick={() => updateCorrection(c.id, 'Approved')} className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1"><Check size={12} />Approve</button>
//                               <button onClick={() => updateCorrection(c.id, 'Rejected')} className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1"><X size={12} />Reject</button>
//                             </div>
//                           )}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )
//         }

//         {/* PASSWORD */}
//         {
//           tab === 'password' && (
//             <div className="animate-fade-up max-w-md space-y-6">
//               <div>
//                 <h1 className="font-display text-2xl font-bold text-slate-900">Change Password</h1>
//                 <p className="text-slate-500 text-sm mt-1">Update your admin account password</p>
//               </div>
//               <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
//                 <form onSubmit={changePassword} className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-1.5">Current Password</label>
//                     <input type="password" className={inp} required value={pwForm.old_password} onChange={e => setPwForm({ ...pwForm, old_password: e.target.value })} />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-1.5">New Password</label>
//                     <input type="password" className={inp} required value={pwForm.new_password} onChange={e => setPwForm({ ...pwForm, new_password: e.target.value })} />
//                   </div>
//                   <button type="submit" disabled={busy} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-all">
//                     {busy ? 'Updating…' : 'Update Password'}
//                   </button>
//                 </form>
//               </div>
//             </div>
//           )
//         }
//       </main >
//     </div >
//   );
// }



'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import Sidebar from '@/components/Sidebar';
import { Users, BarChart3, MessageSquare, KeyRound, Trash2, Plus, Pencil, Check, X } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import Analytics from "@/components/Analytics";
import jsPDF from 'jspdf';

const LINKS = [
  // { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 size={16} /> },
  { id: 'students', label: 'Students', icon: <Users size={16} /> },
  { id: 'attendance', label: 'Attendance', icon: <Check size={16} /> },
  { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={16} /> },
  { id: 'reports', label: 'Reports', icon: <MessageSquare size={16} /> },
  { id: 'corrections', label: 'Corrections', icon: <MessageSquare size={16} /> },
  // { id: 'settings', label: 'Settings', icon: <KeyRound size={16} /> },
];

interface Student { id: string; name: string; email: string; }
interface Attendance { id: string; student_id: string; student_name: string; date: string; status: string; }
interface Correction { id: string; student_id: string; date: string; message: string; status: string; }

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState('students');
  const [students, setStudents] = useState<Student[]>([]);

  const [studentForm, setStudentForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [editingStudent, setEditingStudent] = useState<string | null>(null);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [corrections, setCorrections] = useState<Correction[]>([]);
  const [newAtt, setNewAtt] = useState({ student_id: '', student_name: '', date: '', status: 'Present' });
  const [editingAtt, setEditingAtt] = useState<{ id: string; status: string } | null>(null);
  const [pwForm, setPwForm] = useState({ old_password: '', new_password: '' });
  const [toast, setToast] = useState('');
  const [busy, setBusy] = useState(false);
  const pieData = [
    { name: 'Present', value: attendance.filter(a => a.status === 'Present').length },
    { name: 'Absent', value: attendance.filter(a => a.status === 'Absent').length },
  ];

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };
  const fetchStudents = useCallback(async () => { const r = await api.admin.getStudents(); if (r.success) setStudents(r.data || []); }, []);
  const fetchAttendance = useCallback(async () => { const r = await api.admin.getAttendance(); if (r.success) setAttendance(r.data || []); }, []);
  const fetchCorrections = useCallback(async () => { const r = await api.admin.getCorrections(); if (r.success) setCorrections(r.data || []); }, []);

  console.log("fetch studnet", fetchStudents);
  useEffect(() => { if (!loading && (!user || user.role !== 'admin')) router.replace('/auth/login'); }, [user, loading, router]);
  useEffect(() => { if (user?.role === 'admin') { fetchStudents(); fetchAttendance(); fetchCorrections(); } }, [user, fetchStudents, fetchAttendance, fetchCorrections]);

  if (loading || !user) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>;

  const createStudent = async (e: React.FormEvent) => {
    e.preventDefault();

    setBusy(true);

    const r = await api.admin.createStudent({
      ...studentForm,
      role: 'student',
    });

    setBusy(false);

    if (r.success) {
      showToast('Student created successfully');

      setStudentForm({
        name: '',
        email: '',
        password: '',
      });

      fetchStudents();
    } else {
      showToast('Error: ' + r.message);
    }
  };

  const updateStudent = async (id: string) => {

    const r = await api.admin.updateStudent(id, {
      name: studentForm.name,
      email: studentForm.email,
    });

    if (r.success) {

      showToast('Student updated');

      setEditingStudent(null);

      setStudentForm({
        name: '',
        email: '',
        password: '',
      });

      fetchStudents();

    } else {
      showToast('Error: ' + r.message);
    }
  };

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

  const getAttendancePercentage = (studentId: string) => {
    const records = attendance.filter(a => a.student_id === studentId);
    if (!records.length) return 0;

    const present = records.filter(a => a.status === 'Present').length;
    return Math.round((present / records.length) * 100);
  };

  const mostActive = students
    .map(s => ({
      name: s.name,
      percent: getAttendancePercentage(s.id)
    }))
    .sort((a, b) => b.percent - a.percent)[0];


  const atRisk = students.filter(
    s => getAttendancePercentage(s.id) < 75
  );

  const lastWeek = attendance.filter(a => {
    const d = new Date(a.date);
    const now = new Date();
    return (now.getTime() - d.getTime()) < 7 * 24 * 60 * 60 * 1000;
  });

  const lastWeekPresent = lastWeek.filter(a => a.status === 'Present').length;
  const lastWeekTotal = lastWeek.length;

  const lastWeekRate = Math.round((lastWeekPresent / lastWeekTotal) * 100);

  console.log("STUDENTS:", students);
  console.log("ATTENDANCE:", attendance);

  console.log("PRESENT RECORDS:", attendance.filter(a => a.status === 'Present'));
  console.log("ABSENT RECORDS:", attendance.filter(a => a.status === 'Absent'));

  const exportToCSV = (data: any[], filename: string) => {
    if (!data.length) return;

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(obj =>
      Object.values(obj).join(',')
    );

    const csv = [headers, ...rows].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
  };

  const exportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('Attendance Report', 10, 10);

    let y = 20;

    attendance.forEach((a, i) => {
      doc.setFontSize(10);
      doc.text(
        `${i + 1}. ${a.student_name} | ${a.date} | ${a.status}`,
        10,
        y
      );
      y += 8;
    });

    doc.save('attendance-report.pdf');
  };


  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar links={LINKS} active={tab} onSelect={setTab} />
      <main className="flex-1 p-8 overflow-auto">
        {toast && <div className="fixed top-5 right-5 bg-slate-900 text-white text-sm px-5 py-3 rounded-xl shadow-xl z-50 animate-fade-up">{toast}</div>}

        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="text-sm text-gray-500">Most Active Student</h3>
            <p className="text-lg font-bold">{mostActive?.name}</p>
            <p className="text-green-600">{mostActive?.percent}%</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="text-sm text-gray-500">At Risk Students</h3>
            <p className="text-lg font-bold">{atRisk.length}</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="text-sm text-gray-500">This Week Attendance</h3>
            <p className="text-lg font-bold">{lastWeekRate}%</p>
          </div>

        </div> */}

        {/* STUDENTS */}
        {tab === 'students' && (
          <div className="animate-fade-up space-y-6">
            <div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-lg font-bold mb-4">
                  {editingStudent ? 'Update Student' : 'Create Student'}
                </h2>

                <form
                  onSubmit={
                    editingStudent
                      ? (e) => {
                        e.preventDefault();
                        updateStudent(editingStudent);
                      }
                      : createStudent
                  }
                  className="grid grid-cols-1 md:grid-cols-3 gap-3"
                >
                  <input
                    className={inp}
                    placeholder="Student Name"
                    value={studentForm.name}
                    onChange={(e) =>
                      setStudentForm({
                        ...studentForm,
                        name: e.target.value,
                      })
                    }
                    required
                  />

                  <input
                    className={inp}
                    placeholder="Student Email"
                    type="email"
                    value={studentForm.email}
                    onChange={(e) =>
                      setStudentForm({
                        ...studentForm,
                        email: e.target.value,
                      })
                    }
                    required
                  />

                  {!editingStudent && (
                    <input
                      className={inp}
                      placeholder="Password"
                      type="password"
                      value={studentForm.password}
                      onChange={(e) =>
                        setStudentForm({
                          ...studentForm,
                          password: e.target.value,
                        })
                      }
                      required
                    />
                  )}

                  <button
                    type="submit"
                    className="md:col-span-3 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-semibold"
                  >
                    {editingStudent ? 'Update Student' : 'Create Student'}
                  </button>
                </form>
              </div>
            </div>
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
                      {/* <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => {
                            setEditingStudent(s.id);

                            setStudentForm({
                              name: s.name,
                              email: s.email,
                              password: '',
                            });
                          }}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1"
                        >
                          <Pencil size={12} />
                          Edit
                        </button>
                        <button onClick={() => deleteStudent(s.id)} className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ml-auto">
                          <Trash2 size={12} />Delete
                        </button>
                      </td> */}

                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">

                          <button
                            onClick={() => {
                              setEditingStudent(s.id);

                              setStudentForm({
                                name: s.name,
                                email: s.email,
                                password: '',
                              });
                            }}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1"
                          >
                            <Pencil size={12} />
                            Edit
                          </button>

                          <button
                            onClick={() => deleteStudent(s.id)}
                            className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1"
                          >
                            <Trash2 size={12} />
                            Delete
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'analytics' && (
          <Analytics students={students} attendance={attendance} />
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

                <select
                  className={inp}
                  value={newAtt.student_id}
                  onChange={(e) => {
                    const student = students.find(s => s.id === e.target.value);

                    setNewAtt({
                      ...newAtt,
                      student_id: e.target.value,
                      student_name: student?.name || '',
                    });
                  }}
                >
                  <option value="">Select Student</option>

                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                {/* <input className={inp} placeholder="Student ID (any text)" required value={newAtt.student_id} onChange={e => setNewAtt({ ...newAtt, student_id: e.target.value })} /> */}
                {/* <input className={inp} placeholder="Student Name" required value={newAtt.student_name} onChange={e => setNewAtt({ ...newAtt, student_name: e.target.value })} /> */}
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
                    {['Student ID', 'Name', 'Date', 'Status', 'Actions'].map(h => (
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

                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          {editingAtt?.id === a.id ? (
                            <>
                              <button onClick={saveAttEdit} className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1"><Check size={12} />Save</button>
                              <button onClick={() => setEditingAtt(null)} className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg"><X size={12} /></button>
                            </>
                          ) : (
                            <button onClick={() => setEditingAtt({ id: a.id, status: a.status })} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1"><Pencil size={12} />Edit</button>
                          )}
                          <button onClick={() => deleteAttendance(a.id)} className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1"><Trash2 size={12} />Del</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
        }

        {/* CORRECTIONS */}
        {
          tab === 'corrections' && (
            <div className="animate-fade-up space-y-6">
              <div>
                <h1 className="font-display text-2xl font-bold text-slate-900">Correction Requests</h1>
                <p className="text-slate-500 text-sm mt-1">{corrections.filter(c => c.status === 'Pending').length} pending</p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      {['Student ID', 'Date', 'Message', 'Status', 'Actions'].map(h => (
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
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${c.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                            c.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                            }`}>{c.status}</span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          {c.status === 'Pending' && (
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => updateCorrection(c.id, 'Approved')} className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1"><Check size={12} />Approve</button>
                              <button onClick={() => updateCorrection(c.id, 'Rejected')} className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1"><X size={12} />Reject</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        }

        {/* PASSWORD */}
        {
          tab === 'password' && (
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
          )
        }

        {tab === 'reports' && (
          <div className="space-y-6 animate-fade-up">

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Reports Center
              </h1>
              <p className="text-slate-500 text-sm">
                Download system reports in CSV or PDF format
              </p>
            </div>

            {/* CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              <div className="bg-white border rounded-2xl p-5 shadow-sm">
                <h2 className="font-semibold mb-2">Students Report</h2>
                <p className="text-sm text-slate-500 mb-3">
                  Export all registered students
                </p>

                <button
                  onClick={() => exportToCSV(students, 'students')}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm"
                >
                  Download CSV
                </button>
              </div>

              <div className="bg-white border rounded-2xl p-5 shadow-sm">
                <h2 className="font-semibold mb-2">Attendance Report</h2>
                <p className="text-sm text-slate-500 mb-3">
                  Export full attendance records
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => exportToCSV(attendance, 'attendance')}
                    className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm"
                  >
                    CSV
                  </button>

                  <button
                    onClick={exportPDF}
                    className="bg-red-600 text-white px-4 py-2 rounded-xl text-sm"
                  >
                    PDF
                  </button>
                </div>
              </div>

              <div className="bg-white border rounded-2xl p-5 shadow-sm">
                <h2 className="font-semibold mb-2">Monthly Report</h2>
                <p className="text-sm text-slate-500 mb-3">
                  Current month performance
                </p>

                <button
                  onClick={() =>
                    exportToCSV(
                      attendance.filter(a => {
                        const d = new Date(a.date);
                        return d.getMonth() === new Date().getMonth();
                      }),
                      'monthly-report'
                    )
                  }
                  className="bg-purple-600 text-white px-4 py-2 rounded-xl text-sm"
                >
                  Download CSV
                </button>
              </div>

            </div>

          </div>
        )}

        
      </main >
    </div >
  );
}

