
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  LayoutDashboard, 
  FileText, 
  History, 
  User as UserIcon,
  ShieldCheck,
  Stethoscope,
  Pill,
  Bell,
  Menu,
  X,
  Info,
  Zap,
  Globe
} from 'lucide-react';

interface LayoutProps {
  user: User;
  onLogout: () => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ user, onLogout, children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Mobile Header */}
      <div className="md:hidden bg-indigo-900 text-white p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Stethoscope size={24} />
          <span className="font-bold">MedScript AI</span>
        </div>
        <button onClick={toggleMobileMenu} className="p-2 hover:bg-indigo-800 rounded-lg">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-indigo-900 text-white transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-8 hidden md:flex items-center gap-3">
            <div className="bg-white p-2 rounded-xl">
              <Stethoscope className="text-indigo-900" size={24} />
            </div>
            <h1 className="text-xl font-black tracking-tight uppercase">MedScript</h1>
          </div>
          
          <nav className="flex-1 px-4 py-4 space-y-1">
            <NavItem 
              icon={<LayoutDashboard size={20} />} 
              label="Dashboard" 
              active={location.pathname === '/'} 
              onClick={() => { navigate('/'); setIsMobileMenuOpen(false); }} 
            />
            
            {user.role === UserRole.DOCTOR && (
              <>
                <NavItem 
                  icon={<FileText size={20} />} 
                  label="Prescriptions" 
                  active={location.pathname === '/prescriptions'}
                  onClick={() => { navigate('/prescriptions'); setIsMobileMenuOpen(false); }} 
                />
                <NavItem 
                  icon={<History size={20} />} 
                  label="Patient History" 
                  active={location.pathname === '/history'}
                  onClick={() => { navigate('/history'); setIsMobileMenuOpen(false); }} 
                />
              </>
            )}
            
            {user.role === UserRole.PATIENT && (
              <>
                <NavItem 
                  icon={<FileText size={20} />} 
                  label="Medical Vault" 
                  active={location.pathname === '/vault'}
                  onClick={() => { navigate('/vault'); setIsMobileMenuOpen(false); }} 
                />
                <NavItem 
                  icon={<Bell size={20} />} 
                  label="Med Reminders" 
                  active={location.pathname === '/reminders'}
                  onClick={() => { navigate('/reminders'); setIsMobileMenuOpen(false); }} 
                />
              </>
            )}
            
            {user.role === UserRole.PHARMACIST && (
              <>
                <NavItem 
                  icon={<ShieldCheck size={20} />} 
                  label="Verification Hub" 
                  active={location.pathname === '/verify'}
                  onClick={() => { navigate('/verify'); setIsMobileMenuOpen(false); }} 
                />
                <NavItem 
                  icon={<Pill size={20} />} 
                  label="Stock Registry" 
                  active={location.pathname === '/stock'}
                  onClick={() => { navigate('/stock'); setIsMobileMenuOpen(false); }} 
                />
              </>
            )}

            <div className="pt-8 mt-8 border-t border-indigo-800 space-y-1">
               <NavItem 
                icon={<Info size={20} />} 
                label="Mission" 
                active={location.pathname === '/about'}
                onClick={() => { navigate('/about'); setIsMobileMenuOpen(false); }} 
              />
               <NavItem 
                icon={<Zap size={20} />} 
                label="Core Features" 
                active={location.pathname === '/features'}
                onClick={() => { navigate('/features'); setIsMobileMenuOpen(false); }} 
              />
               <NavItem 
                icon={<Globe size={20} />} 
                label="Social Impact" 
                active={location.pathname === '/impact'}
                onClick={() => { navigate('/impact'); setIsMobileMenuOpen(false); }} 
              />
            </div>
          </nav>

          <div className="p-6 border-t border-indigo-800 bg-indigo-950/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500 flex items-center justify-center text-sm font-black shadow-lg">
                {user.email[0].toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-black truncate text-white">{user.email}</p>
                <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">{user.role}</p>
              </div>
            </div>
            <button 
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 p-3 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-2xl transition-all font-black text-xs uppercase tracking-widest"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen overflow-y-auto">
        <header className="hidden md:flex bg-white/80 backdrop-blur-md border-b border-slate-200 px-10 py-5 sticky top-0 z-30 justify-between items-center">
          <div>
            <h2 className="text-lg font-black text-slate-800 tracking-tight">Active Portal: {user.role}</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Logged in as {user.email}</p>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
               <ShieldCheck size={14} /> Encrypted Session
             </div>
             <button className="p-2.5 text-slate-400 hover:text-indigo-600 bg-slate-50 rounded-xl transition-all relative">
               <Bell size={20} />
               <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
             </button>
          </div>
        </header>
        <div className="p-6 md:p-10">
          {children}
        </div>
      </main>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode; label: string; active?: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`
      w-full flex items-center gap-3 p-4 rounded-2xl transition-all group
      ${active ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/20' : 'text-indigo-200 hover:text-white hover:bg-indigo-800/50'}
    `}
  >
    <span className={`${active ? 'text-white' : 'text-indigo-400 group-hover:text-white'} transition-colors`}>
      {icon}
    </span>
    <span className="font-black text-xs uppercase tracking-widest">{label}</span>
  </button>
);

export default Layout;
