'use client';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { BookOpen, LogOut } from 'lucide-react';

interface SidebarProps {
  links: { label: string; icon: React.ReactNode; id: string }[];
  active: string;
  onSelect: (id: string) => void;
}

export default function Sidebar({ links, active, onSelect }: SidebarProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-slate-200 flex flex-col flex-shrink-0">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
            <BookOpen size={18} className="text-white" />
          </div>
          <div>
            <p className="font-display font-bold text-slate-900 text-sm leading-tight">Attendance</p>
            <p className="font-display font-bold text-indigo-600 text-sm leading-tight">Manager</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${user?.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'}`}>
              {user?.role === 'admin' ? 'Administrator' : 'Student'}
            </span>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map(link => (
          <button key={link.id} onClick={() => onSelect(link.id)}
            className={`w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer ${active === link.id ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-700'}`}>
            {link.icon}{link.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button onClick={handleLogout}
          className="w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-all duration-150 cursor-pointer">
          <LogOut size={16} />Logout
        </button>
      </div>
    </aside>
  );
}
