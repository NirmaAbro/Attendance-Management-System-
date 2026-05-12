// 'use client';

// import {
//     PieChart,
//     Pie,
//     Cell,
//     Tooltip,
//     BarChart,
//     Bar,
//     XAxis,
//     YAxis,
//     LineChart,
//     Line,
//     ResponsiveContainer,
// } from 'recharts';

// interface Student {
//     id: string;
//     name: string;
//     email: string;
// }

// interface Attendance {
//     id: string;
//     student_id: string;
//     student_name: string;
//     date: string;
//     status: string;
// }

// export default function Analytics({
//     students,
//     attendance,
// }: {
//     students: Student[];
//     attendance: Attendance[];
// }) {

//     // 🔍 DEBUG LOGS (your data is correct)
//     console.log("STUDENTS:", students);
//     console.log("ATTENDANCE:", attendance);
//     console.log("PRESENT RECORDS:", attendance.filter(a => a.status === 'Present'));
//     console.log("ABSENT RECORDS:", attendance.filter(a => a.status === 'Absent'));

//     // 📊 BASIC COUNTS
//     const totalStudents = students.length;
//     const totalPresentRecords = attendance.filter(a => a.status === 'Present').length;
//     const totalAbsentRecords = attendance.filter(a => a.status === 'Absent').length;

//     const attendanceRate =
//         attendance.length
//             ? Math.round((totalPresentRecords / attendance.length) * 100)
//             : 0;

//     // 🍩 PIE DATA
//     const pieData = [
//         { name: 'Present', value: totalPresentRecords },
//         { name: 'Absent', value: totalAbsentRecords },
//     ];

//     const COLORS = ['#22c55e', '#ef4444'];

//     // 🥇 TOP STUDENTS (FIXED)
//     const topStudents = students
//         .map(s => {
//             const records = attendance.filter(a => a.student_id === s.id);
//             const present = records.filter(a => a.status === 'Present').length;

//             const percent = records.length
//                 ? Math.round((present / records.length) * 100)
//                 : 0;

//             return {
//                 name: s.name,
//                 attendance: percent,
//             };
//         })
//         .sort((a, b) => b.attendance - a.attendance)
//         .slice(0, 5);

//     // 📈 TREND DATA (FIXED - NO STRING BUG)
//     const trendData = attendance.map(a => ({
//         date: a.date,
//         value: a.status === 'Present' ? 1 : 0,
//     }));

//     // 🎨 UI STYLE
//     const card =
//         "bg-white/40 backdrop-blur-xl border border-white/30 shadow-sm rounded-2xl p-5";

//     return (
//         <div className="space-y-8">

//             {/* HEADER */}
//             <div>
//                 <h1 className="text-3xl font-bold text-slate-900">
//                     Analytics Dashboard
//                 </h1>
//                 <p className="text-slate-500 text-sm">
//                     Real-time attendance insights
//                 </p>
//             </div>

//             {/* KPI CARDS */}
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

//                 <div className={card}>
//                     <p className="text-sm text-slate-500">Total Students</p>
//                     <h2 className="text-2xl font-bold">{totalStudents}</h2>
//                 </div>

//                 <div className={card}>
//                     <p className="text-sm text-green-600">Present Records</p>
//                     <h2 className="text-2xl font-bold text-green-600">
//                         {totalPresentRecords}
//                     </h2>
//                 </div>

//                 <div className={card}>
//                     <p className="text-sm text-red-500">Absent Records</p>
//                     <h2 className="text-2xl font-bold text-red-500">
//                         {totalAbsentRecords}
//                     </h2>
//                 </div>

//                 <div className={card}>
//                     <p className="text-sm text-indigo-600">Attendance Rate</p>
//                     <h2 className="text-2xl font-bold text-indigo-600">
//                         {attendanceRate}%
//                     </h2>
//                 </div>

//             </div>

//             {/* CHARTS */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

//                 {/* PIE CHART */}
//                 <div className={card}>
//                     <h2 className="font-semibold mb-4">Attendance Split</h2>

//                     <div className="h-[260px]">
//                         <ResponsiveContainer width="100%" height="100%">
//                             <PieChart>
//                                 <Pie
//                                     data={pieData}
//                                     dataKey="value"
//                                     outerRadius={90}
//                                     label
//                                 >
//                                     {pieData.map((_, i) => (
//                                         <Cell key={i} fill={COLORS[i]} />
//                                     ))}
//                                 </Pie>
//                                 <Tooltip />
//                             </PieChart>
//                         </ResponsiveContainer>
//                     </div>
//                 </div>

//                 {/* TOP STUDENTS */}
//                 <div className={card}>
//                     <h2 className="font-semibold mb-4">Top Students</h2>

//                     <div className="h-[260px]">
//                         <ResponsiveContainer width="100%" height="100%">
//                             <BarChart data={topStudents}>
//                                 <XAxis dataKey="name" />
//                                 <YAxis />
//                                 <Tooltip />
//                                 <Bar
//                                     dataKey="attendance"
//                                     fill="#6366f1"
//                                     radius={[8, 8, 0, 0]}
//                                 />
//                             </BarChart>
//                         </ResponsiveContainer>
//                     </div>
//                 </div>

//             </div>

//             {/* TREND CHART */}
//             <div className={card}>
//                 <h2 className="font-semibold mb-4">Attendance Trend</h2>

//                 <div className="h-[300px]">
//                     <ResponsiveContainer width="100%" height="100%">
//                         <LineChart data={trendData}>
//                             <XAxis dataKey="date" />
//                             <YAxis />
//                             <Tooltip />
//                             <Line
//                                 type="monotone"
//                                 dataKey="value"
//                                 stroke="#3b82f6"
//                                 strokeWidth={3}
//                             />
//                         </LineChart>
//                     </ResponsiveContainer>
//                 </div>
//             </div>

//         </div>
//     );
// }


'use client';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LineChart,
  Line,
  ResponsiveContainer,
} from 'recharts';

interface Student {
  id: string;
  name: string;
  email: string;
}

interface Attendance {
  id: string;
  student_id: string;
  student_name: string;
  date: string;
  status: string;
}

export default function Analytics({
  students,
  attendance,
}: {
  students: Student[];
  attendance: Attendance[];
}) {

  // 🔍 DEBUG (your requested logs)
  console.log("STUDENTS:", students);
  console.log("ATTENDANCE:", attendance);
  console.log("PRESENT RECORDS:", attendance.filter(a => a.status === 'Present'));
  console.log("ABSENT RECORDS:", attendance.filter(a => a.status === 'Absent'));

  // 📅 CURRENT MONTH FILTER
  const currentMonth = new Date().getMonth();

  const thisMonthAttendance = attendance.filter(a => {
    const d = new Date(a.date);
    return d.getMonth() === currentMonth;
  });

  // 📊 PIE DATA
  const presentCount = attendance.filter(a => a.status === 'Present').length;
  const absentCount = attendance.filter(a => a.status === 'Absent').length;

  const pieData = [
    { name: 'Present', value: presentCount },
    { name: 'Absent', value: absentCount },
  ];

  // 🧠 STUDENT PERFORMANCE MAP
  const studentStats = students.map(s => {
    const records = attendance.filter(a => a.student_id === s.id);
    const present = records.filter(a => a.status === 'Present').length;

    const percent = records.length
      ? Math.round((present / records.length) * 100)
      : 0;

    return {
      name: s.name,
      percent,
      present,
      absent: records.length - present,
    };
  });

  // 🥇 TOP & LOW STUDENTS
  const sorted = [...studentStats].sort((a, b) => b.percent - a.percent);

  const topStudent = sorted[0] || null;
  const lowStudent = sorted[sorted.length - 1] || null;

  // 📅 MONTH STATS
  const monthlyPresent = thisMonthAttendance.filter(a => a.status === 'Present').length;
  const monthlyAbsent = thisMonthAttendance.filter(a => a.status === 'Absent').length;

  const COLORS = ['#22c55e', '#ef4444'];

  const card =
    "bg-white/40 backdrop-blur-xl border border-white/30 shadow-sm rounded-2xl p-5";

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Analytics Dashboard
        </h1>
        <p className="text-slate-500 text-sm">
          Smart attendance insights (2026)
        </p>
      </div>

      {/* 🔥 NEW KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        {/* TOP STUDENT */}
        <div className={card}>
          <p className="text-sm text-slate-500">Top Student</p>
          <h2 className="text-lg font-bold">
            {topStudent?.name || 'N/A'}
          </h2>
          <p className="text-green-600 text-sm">
            {topStudent?.percent || 0}%
          </p>
        </div>

        {/* LOW STUDENT */}
        <div className={card}>
          <p className="text-sm text-slate-500">At Risk Student</p>
          <h2 className="text-lg font-bold">
            {lowStudent?.name || 'N/A'}
          </h2>
          <p className="text-red-500 text-sm">
            {lowStudent?.percent || 0}%
          </p>
        </div>

        {/* MONTH PRESENT */}
        <div className={card}>
          <p className="text-sm text-slate-500">This Month Present</p>
          <h2 className="text-2xl font-bold text-green-600">
            {monthlyPresent}
          </h2>
        </div>

        {/* MONTH ABSENT */}
        <div className={card}>
          <p className="text-sm text-slate-500">This Month Absent</p>
          <h2 className="text-2xl font-bold text-red-500">
            {monthlyAbsent}
          </h2>
        </div>

      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* PIE */}
        <div className={card}>
          <h2 className="font-semibold mb-4">Attendance Split</h2>

          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" outerRadius={90} label>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* BAR */}
        <div className={card}>
          <h2 className="font-semibold mb-4">Student Performance</h2>

          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studentStats}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="percent" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* TREND */}
      <div className={card}>
        <h2 className="font-semibold mb-4">Attendance Trend</h2>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={attendance.map(a => ({
                date: a.date,
                value: a.status === 'Present' ? 1 : 0,
              }))}
            >
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}