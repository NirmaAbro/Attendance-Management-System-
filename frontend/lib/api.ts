const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

async function request(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const data = await res.json();
  return data;
}

export const api = {
  register: (body: object) => request('/register', { method: 'POST', body: JSON.stringify(body) }),
  login:    (body: object) => request('/login',    { method: 'POST', body: JSON.stringify(body) }),
  logout:   ()             => request('/logout',   { method: 'POST' }),
  me:       ()             => request('/me'),

  admin: {
    getStudents:       ()                          => request('/admin/students'),
    deleteStudent:     (id: string)                => request(`/admin/students/${id}`,    { method: 'DELETE' }),
    getAttendance:     ()                          => request('/admin/attendance'),
    addAttendance:     (body: object)              => request('/admin/attendance',         { method: 'POST',   body: JSON.stringify(body) }),
    updateAttendance:  (id: string, status: string)=> request(`/admin/attendance/${id}`,   { method: 'PUT',    body: JSON.stringify({ status }) }),
    deleteAttendance:  (id: string)                => request(`/admin/attendance/${id}`,   { method: 'DELETE' }),
    getCorrections:    ()                          => request('/admin/corrections'),
    updateCorrection:  (id: string, status: string)=> request(`/admin/corrections/${id}`,  { method: 'PUT',    body: JSON.stringify({ status }) }),
    changePassword:    (body: object)              => request('/admin/change-password',    { method: 'PUT',    body: JSON.stringify(body) }),
  },

  student: {
    getAttendance:    ()             => request('/student/attendance'),
    getCorrections:   ()             => request('/student/corrections'),
    submitCorrection: (body: object) => request('/student/corrections',      { method: 'POST', body: JSON.stringify(body) }),
    downloadReport:   ()             => fetch(`${API_BASE}/student/report`,  { credentials: 'include' }),
    changePassword:   (body: object) => request('/student/change-password',  { method: 'PUT',  body: JSON.stringify(body) }),
  },
};
