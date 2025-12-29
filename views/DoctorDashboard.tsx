
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { User, Prescription, PrescriptionStatus } from '../types';
import PrescriptionForm from '../components/PrescriptionForm';
import { db } from '../services/db';
import { 
  Users, 
  Calendar, 
  ChevronRight, 
  Search,
  CheckCircle2,
  AlertCircle,
  FileUp,
  Loader2,
  Clock3,
  XCircle,
  Pill,
  TrendingUp,
  Activity,
  ArrowUpRight,
  UserSearch,
  Mail
} from 'lucide-react';
import { digitizeHandwrittenPrescription } from '../services/gemini';

interface DoctorDashboardProps {
  user: User;
}

const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Determine view based on URL path
  const view = useMemo(() => {
    if (location.pathname === '/prescriptions') return 'ledger';
    if (location.pathname === '/history') return 'history';
    if (location.pathname === '/new') return 'new';
    return 'overview';
  }, [location.pathname]);

  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [prefilledMeds, setPrefilledMeds] = useState<any[] | undefined>(undefined);
  const [patientSearch, setPatientSearch] = useState('');
  const [searchedHistory, setSearchedHistory] = useState<Prescription[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPrescriptions(db.getPrescriptions().filter(p => p.doctorId === user.id));
  }, [user.id]);

  const stats = useMemo(() => {
    const doctorRx = prescriptions;
    const pendingCount = doctorRx.filter(p => p.status === PrescriptionStatus.PENDING).length;
    const totalPatients = new Set(doctorRx.map(p => p.patientEmail)).size;

    return {
      totalPatients,
      totalRx: doctorRx.length,
      pendingCount
    };
  }, [prescriptions]);

  const recentInteractions = useMemo(() => {
    const sorted = [...prescriptions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return sorted.slice(0, 5).map(rx => ({
      email: rx.patientEmail,
      time: new Date(rx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      diagnosis: rx.diagnosis
    }));
  }, [prescriptions]);

  const handleQuickOCR = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(',')[1];
      const extractedMeds = await digitizeHandwrittenPrescription(base64);
      if (extractedMeds) {
        setPrefilledMeds(extractedMeds);
        navigate('/new');
      }
      setIsScanning(false);
    };
    reader.readAsDataURL(file);
  };

  const handlePatientSearch = () => {
    if (!patientSearch) return;
    const results = db.getPatientHistory(patientSearch);
    setSearchedHistory(results);
  };

  const getStatusStyle = (status: PrescriptionStatus) => {
    switch (status) {
      case PrescriptionStatus.PENDING:
        return { 
          bg: 'bg-amber-50', 
          text: 'text-amber-700', 
          border: 'border-amber-100',
          icon: <Clock3 size={12} />
        };
      case PrescriptionStatus.DISPENSED:
        return { 
          bg: 'bg-emerald-50', 
          text: 'text-emerald-700', 
          border: 'border-emerald-100',
          icon: <CheckCircle2 size={12} />
        };
      case PrescriptionStatus.CANCELED:
        return { 
          bg: 'bg-rose-50', 
          text: 'text-rose-700', 
          border: 'border-rose-100',
          icon: <XCircle size={12} />
        };
      default:
        return { 
          bg: 'bg-slate-50', 
          text: 'text-slate-700', 
          border: 'border-slate-100',
          icon: <Pill size={12} />
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Top Action Bar */}
      <div className="bg-white p-3 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex p-1 bg-slate-50 rounded-2xl w-full md:w-auto">
          <button 
            onClick={() => navigate('/')}
            className={`flex-1 md:px-10 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${view === 'overview' ? 'bg-white shadow-sm text-indigo-600 ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => navigate('/prescriptions')}
            className={`flex-1 md:px-10 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${view === 'ledger' ? 'bg-white shadow-sm text-indigo-600 ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Prescriptions
          </button>
          <button 
            onClick={() => navigate('/history')}
            className={`flex-1 md:px-10 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${view === 'history' ? 'bg-white shadow-sm text-indigo-600 ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Patient History
          </button>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <input type="file" ref={fileInputRef} onChange={handleQuickOCR} className="hidden" accept="image/*" />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isScanning}
            className="flex-1 md:flex-none px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            {isScanning ? <Loader2 size={16} className="animate-spin text-indigo-600" /> : <FileUp size={16} className="text-indigo-600" />}
            {isScanning ? "Digitizing..." : "OCR Digitizer"}
          </button>
          <button 
            onClick={() => navigate('/new')}
            className="flex-1 md:flex-none px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95 flex items-center justify-center gap-2"
          >
            <ArrowUpRight size={16} /> New Session
          </button>
        </div>
      </div>

      {/* Conditional View Rendering */}
      {view === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={<Users />} label="Patient Reach" value={stats.totalPatients.toString()} trend="+4% this month" />
            <StatCard icon={<Activity />} label="Total Records" value={stats.totalRx.toString()} trend="Live Vault" />
            <StatCard icon={<Clock3 />} label="Waiting Dispense" value={stats.pendingCount.toString()} trend="In Queue" />
            <StatCard icon={<TrendingUp />} label="Success Rate" value="99.9%" trend="Error-free" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-200 flex flex-col justify-center items-center text-center space-y-6 min-h-[400px]">
              <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 opacity-20">
                <Activity size={48} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Clinical Overview Active</h3>
                <p className="text-slate-500 font-bold max-w-sm mx-auto mt-2">Your medical dashboard is ready. Switch to Prescriptions or Patient History for detailed clinical records.</p>
              </div>
              <button 
                onClick={() => navigate('/prescriptions')}
                className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all"
              >
                View Full Ledger
              </button>
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-200 h-fit">
              <h4 className="font-black text-slate-800 mb-8 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em]">
                <Calendar size={18} className="text-indigo-600" /> Recent Logins
              </h4>
              <div className="space-y-5">
                {recentInteractions.length > 0 ? recentInteractions.map((patient, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 group cursor-pointer" onClick={() => { setPatientSearch(patient.email); navigate('/history'); }}>
                    <div className="w-11 h-11 rounded-xl bg-white shadow-sm flex items-center justify-center font-black text-indigo-600 text-[10px] shrink-0 uppercase">
                      {patient.time.split(' ')[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-black text-slate-800 truncate mb-1">{patient.email}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest truncate">{patient.diagnosis}</p>
                    </div>
                  </div>
                )) : (
                  <div className="py-10 text-center text-slate-400 font-bold text-[9px] uppercase tracking-widest opacity-60">
                    No recent clinical sessions.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {view === 'ledger' && (
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden flex flex-col animate-in slide-in-from-right-4 duration-500">
          <div className="px-8 py-10 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-6">
            <div>
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Prescription Ledger</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Full registry of issued clinical intents</p>
            </div>
          </div>
          
          <div className="divide-y divide-slate-100 overflow-y-auto max-h-[800px] scrollbar-hide">
            {prescriptions.length > 0 ? prescriptions.map(rx => {
              const style = getStatusStyle(rx.status);
              return (
                <div key={rx.id} className="px-8 py-7 hover:bg-indigo-50/30 transition-all group flex flex-col sm:flex-row sm:items-center gap-6 cursor-pointer">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shrink-0">
                    <Pill size={28} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <p className="font-black text-slate-900 text-base truncate tracking-tight">{rx.patientEmail}</p>
                      <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black border flex items-center gap-1.5 uppercase ${style.bg} ${style.text} ${style.border}`}>
                        {style.icon} {rx.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest truncate">
                      {rx.diagnosis} • Issued {new Date(rx.date).toLocaleDateString()}
                    </p>
                  </div>
                  <ChevronRight className="text-slate-300 group-hover:translate-x-1 transition-transform ml-auto" size={20} />
                </div>
              );
            }) : (
              <div className="p-32 text-center text-slate-300 flex flex-col items-center gap-6">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                  <AlertCircle size={40} className="opacity-10" />
                </div>
                <p className="font-black text-[10px] uppercase tracking-[0.3em] opacity-40">No issued prescriptions found</p>
              </div>
            )}
          </div>
        </div>
      )}

      {view === 'history' && (
        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-200">
             <div className="max-w-xl mx-auto text-center space-y-8">
               <div className="inline-flex items-center justify-center p-4 bg-indigo-50 text-indigo-600 rounded-3xl mb-4">
                 <UserSearch size={40} />
               </div>
               <h3 className="text-3xl font-black text-slate-900 tracking-tight">Global Patient History</h3>
               <p className="text-slate-500 font-bold">Search the MedScript network to see a patient's historical medical timeline via email.</p>
               
               <div className="flex gap-4">
                 <div className="relative flex-1">
                   <Mail className="absolute left-4 top-4 text-slate-300" size={20} />
                   <input 
                    type="email" 
                    placeholder="patient@gmail.com"
                    value={patientSearch}
                    onChange={e => setPatientSearch(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handlePatientSearch()}
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none"
                   />
                 </div>
                 <button 
                  onClick={handlePatientSearch}
                  className="px-10 py-4 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
                 >
                   Retrieve History
                 </button>
               </div>
             </div>
          </div>

          {searchedHistory && (
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                <h4 className="font-black text-slate-800 text-[10px] uppercase tracking-[0.3em]">Timeline for: {patientSearch}</h4>
              </div>
              <div className="divide-y divide-slate-100">
                {searchedHistory.length > 0 ? searchedHistory.map(rx => {
                  const style = getStatusStyle(rx.status);
                  return (
                    <div key={rx.id} className="p-8 flex items-start gap-8">
                       <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
                         <Calendar size={24} />
                       </div>
                       <div className="flex-1">
                         <div className="flex justify-between items-start mb-2">
                           <h5 className="text-xl font-black text-slate-800 tracking-tight">{rx.diagnosis}</h5>
                           <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black border flex items-center gap-1.5 uppercase ${style.bg} ${style.text} ${style.border}`}>
                             {style.icon} {rx.status}
                           </span>
                         </div>
                         <p className="text-xs font-bold text-slate-500 mb-4">Issued by DR. {rx.doctorName.toUpperCase()} • {new Date(rx.date).toLocaleDateString()}</p>
                         <div className="flex flex-wrap gap-2">
                           {rx.medications.map((m, mi) => (
                             <span key={mi} className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest">{m.name}</span>
                           ))}
                         </div>
                       </div>
                    </div>
                  );
                }) : (
                  <div className="p-20 text-center">
                    <p className="font-black text-slate-300 text-[10px] uppercase tracking-widest">No matching history found for this identifier.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {view === 'new' && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
          <PrescriptionForm 
            doctor={user} 
            onSuccess={() => { navigate('/prescriptions'); setPrefilledMeds(undefined); }} 
            initialMeds={prefilledMeds}
          />
        </div>
      )}
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string; trend: string }> = ({ icon, label, value, trend }) => (
  <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200 hover:shadow-xl hover:border-indigo-100 transition-all group">
    <div className="p-3.5 w-fit bg-slate-50 text-slate-400 rounded-2xl mb-8 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
      {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 24 }) : icon}
    </div>
    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{label}</p>
    <div className="flex items-baseline gap-3">
      <h4 className="text-3xl font-black text-slate-900 tracking-tighter">{value}</h4>
      <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">{trend}</span>
    </div>
  </div>
);

export default DoctorDashboard;
