
import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { User, Prescription, PrescriptionStatus, Medication } from '../types';
import { db } from '../services/db';
import { 
  Pill, 
  Calendar, 
  Download, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  Clock3,
  XCircle,
  Phone,
  ShieldCheck,
  LayoutGrid,
  TrendingUp,
  History,
  ArrowUpRight,
  BellRing,
  Check,
  AlertTriangle,
  Stethoscope
} from 'lucide-react';

interface PatientDashboardProps {
  user: User;
}

const PatientDashboard: React.FC<PatientDashboardProps> = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [selectedRx, setSelectedRx] = useState<Prescription | null>(null);

  // Determine current view from URL
  const view = useMemo(() => {
    if (location.pathname === '/vault') return 'vault';
    if (location.pathname === '/reminders') return 'reminders';
    return 'overview';
  }, [location.pathname]);

  useEffect(() => {
    const data = db.getPatientHistory(user.email);
    setPrescriptions(data);
    if (data.length > 0 && !selectedRx) setSelectedRx(data[0]);
  }, [user.email]);

  const adherenceScore = useMemo(() => {
    if (prescriptions.length === 0) return 0;
    return 100; // Simulated
  }, [prescriptions]);

  const allMeds = useMemo(() => {
    const meds: (Medication & { doctor: string, date: string })[] = [];
    prescriptions.forEach(rx => {
      rx.medications.forEach(m => {
        meds.push({ ...m, doctor: rx.doctorName, date: rx.date });
      });
    });
    return meds;
  }, [prescriptions]);

  const getStatusDisplay = (status: PrescriptionStatus) => {
    switch (status) {
      case PrescriptionStatus.PENDING:
        return { label: 'In Store Queue', color: 'text-amber-600 bg-amber-50', icon: <Clock3 size={14} /> };
      case PrescriptionStatus.DISPENSED:
        return { label: 'Handover Done', color: 'text-emerald-600 bg-emerald-50', icon: <CheckCircle2 size={14} /> };
      case PrescriptionStatus.CANCELED:
        return { label: 'Invalidated', color: 'text-rose-600 bg-rose-50', icon: <XCircle size={14} /> };
      default:
        return { label: 'Unknown', color: 'text-slate-400 bg-slate-50', icon: <Pill size={14} /> };
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
      
      {/* View Switcher Toolbar */}
      <div className="bg-white p-3 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex p-1 bg-slate-50 rounded-2xl w-full md:w-auto">
          <button 
            onClick={() => navigate('/')}
            className={`flex-1 md:px-10 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${view === 'overview' ? 'bg-white shadow-sm text-indigo-600 ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => navigate('/vault')}
            className={`flex-1 md:px-10 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${view === 'vault' ? 'bg-white shadow-sm text-indigo-600 ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Medical Vault
          </button>
          <button 
            onClick={() => navigate('/reminders')}
            className={`flex-1 md:px-10 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${view === 'reminders' ? 'bg-white shadow-sm text-indigo-600 ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Med Reminders
          </button>
        </div>
        <div className="hidden md:flex items-center gap-4 px-6 py-3 bg-indigo-50 text-indigo-700 rounded-2xl border border-indigo-100">
           <ShieldCheck size={18} />
           <span className="text-[10px] font-black uppercase tracking-widest">Global Health ID Active</span>
        </div>
      </div>

      {view === 'overview' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard icon={<ShieldCheck />} label="Medical Vault" value={prescriptions.length.toString()} trend="Protected" />
            <StatCard icon={<TrendingUp />} label="Adherence Score" value={`${adherenceScore}%`} trend="Healthy" />
            <StatCard icon={<BellRing />} label="Reminders Active" value={allMeds.length.toString()} trend="In Schedule" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center space-y-6">
               <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
                 <History size={32} />
               </div>
               <h3 className="text-2xl font-black text-slate-800">Your clinical journey is secure.</h3>
               <p className="text-slate-500 font-bold max-w-sm">Every prescription from your healthcare providers is automatically mapped to this encrypted vault.</p>
               <button 
                onClick={() => navigate('/vault')}
                className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2"
               >
                 Open Medical Vault <ArrowUpRight size={16} />
               </button>
            </div>
            
            <div className="bg-indigo-600 p-12 rounded-[3rem] shadow-2xl shadow-indigo-100 text-white flex flex-col items-center justify-center text-center space-y-6">
               <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center">
                 <BellRing size={32} />
               </div>
               <h3 className="text-2xl font-black">Stay on Schedule.</h3>
               <p className="text-indigo-100 font-bold max-w-sm opacity-80">We've generated a personalized medication timeline based on your current prescriptions.</p>
               <button 
                onClick={() => navigate('/reminders')}
                className="px-8 py-3 bg-white text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-lg"
               >
                 View Medication Clock
               </button>
            </div>
          </div>
        </div>
      )}

      {view === 'vault' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in slide-in-from-right-4 duration-500">
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-200 h-fit">
            <h3 className="font-black text-slate-800 mb-8 flex items-center gap-4 text-[10px] uppercase tracking-[0.3em]">
              <LayoutGrid size={20} className="text-indigo-600" /> Clinical History
            </h3>
            <div className="space-y-4 max-h-[600px] overflow-y-auto scrollbar-hide pr-2">
              {prescriptions.length > 0 ? prescriptions.map(rx => {
                const status = getStatusDisplay(rx.status);
                const isActive = selectedRx?.id === rx.id;
                return (
                  <button 
                    key={rx.id}
                    onClick={() => setSelectedRx(rx)}
                    className={`w-full text-left p-6 rounded-[2rem] border transition-all flex items-center gap-5 ${isActive ? 'border-indigo-600 bg-indigo-50 shadow-xl ring-2 ring-indigo-50' : 'border-slate-50 hover:border-indigo-100 hover:bg-slate-50'}`}
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${isActive ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400'}`}>
                      <Pill size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-black truncate ${isActive ? 'text-indigo-900' : 'text-slate-800'}`}>{rx.diagnosis}</p>
                      <div className="flex items-center gap-2 mt-1">
                         <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase flex items-center gap-1.5 ${status.color}`}>
                           {status.icon} {status.label}
                         </span>
                      </div>
                    </div>
                  </button>
                );
              }) : (
                <div className="py-20 text-center text-slate-300 font-black text-[10px] uppercase tracking-widest italic">
                  No medical records found.
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            {selectedRx ? (
              <div className="bg-white rounded-[4rem] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden">
                <div className="p-10 md:p-14 border-b border-slate-50 flex flex-wrap gap-10 justify-between items-start bg-slate-50/30">
                  <div className="flex-1 min-w-[300px]">
                    <div className="flex flex-wrap gap-3 mb-6">
                      <span className="px-4 py-1.5 bg-slate-900 text-white rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg">
                        RX ID: {selectedRx.id.slice(-6).toUpperCase()}
                      </span>
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-8 leading-none">{selectedRx.diagnosis}</h2>
                    <div className="flex flex-col sm:flex-row gap-8">
                       <div className="flex items-center gap-2 text-slate-400">
                         <Calendar size={14} className="text-indigo-600" />
                         <span className="text-[10px] font-black uppercase tracking-widest">{new Date(selectedRx.date).toLocaleDateString()}</span>
                       </div>
                       <div className="flex items-center gap-2 text-slate-400">
                         {/* Fix: Added Stethoscope import to fix 'Cannot find name' error */}
                         <Stethoscope size={14} className="text-indigo-600" />
                         <span className="text-[10px] font-black uppercase tracking-widest">DR. {selectedRx.doctorName.toUpperCase()}</span>
                       </div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-50 flex flex-col items-center">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${selectedRx.qrCode}`} 
                      className="w-24 h-24 mb-3"
                    />
                    <p className="text-[9px] font-mono text-slate-400 font-black tracking-widest">#{selectedRx.qrCode}</p>
                  </div>
                </div>
                <div className="p-10 md:p-14 space-y-6">
                  {selectedRx.medications.map((m, i) => (
                    <div key={i} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex flex-col md:flex-row items-center gap-8 group hover:bg-white hover:border-indigo-200 transition-all">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        <Pill size={32} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-2xl font-black text-slate-800 mb-1">{m.name}</h4>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{m.instructions}</p>
                      </div>
                      <div className="flex gap-6 border-l border-slate-200 pl-8">
                        <div className="text-center">
                           <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Dose</p>
                           <p className="text-sm font-black text-slate-800">{m.dosage}</p>
                        </div>
                        <div className="text-center">
                           <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Cycle</p>
                           <p className="text-sm font-black text-slate-800">{m.frequency}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-[600px] flex flex-col items-center justify-center text-slate-300 bg-white rounded-[4rem] border-8 border-dashed border-slate-50">
                 <ShieldCheck size={64} className="opacity-10 mb-6" />
                 <p className="font-black text-xl tracking-tight">VAULT ENCRYPTED</p>
                 <p className="text-[10px] font-bold uppercase tracking-widest mt-2">Select a record to decrypt details</p>
              </div>
            )}
          </div>
        </div>
      )}

      {view === 'reminders' && (
        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
           <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-200">
             <div className="flex items-center justify-between mb-10">
               <div>
                 <h3 className="text-2xl font-black text-slate-800 tracking-tight">Medication Clock</h3>
                 <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">Smart Adherence Schedule</p>
               </div>
               <div className="px-6 py-3 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 flex items-center gap-3">
                 <CheckCircle2 size={20} />
                 <span className="text-xs font-black uppercase tracking-widest">Reminders Synced</span>
               </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <ReminderColumn title="Morning" icon={<Clock className="text-amber-500" />} meds={allMeds.filter(m => m.frequency.startsWith('1'))} />
               <ReminderColumn title="Afternoon" icon={<Clock className="text-indigo-500" />} meds={allMeds.filter(m => m.frequency.split('-')[1] === '1')} />
               <ReminderColumn title="Evening" icon={<Clock className="text-slate-900" />} meds={allMeds.filter(m => m.frequency.endsWith('1'))} />
             </div>
           </div>

           <div className="bg-slate-900 p-12 rounded-[4rem] text-white overflow-hidden relative">
             <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md">
                   <AlertTriangle size={48} className="text-amber-400" />
                </div>
                <div>
                   <h4 className="text-2xl font-black mb-2">Safety Notice</h4>
                   <p className="text-slate-400 font-bold max-w-xl leading-relaxed">Your adherence schedule is automatically generated from your clinical records. Always consult with your prescribing doctor if you feel unusual symptoms during your medication cycle.</p>
                </div>
             </div>
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] -mr-32 -mt-32"></div>
           </div>
        </div>
      )}
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string; trend: string }> = ({ icon, label, value, trend }) => (
  <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200 hover:shadow-xl transition-all group">
    <div className="p-4 bg-slate-50 text-slate-400 w-fit rounded-2xl mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
      {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 24 }) : icon}
    </div>
    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
    <div className="flex items-baseline gap-3">
      <h4 className="text-3xl font-black text-slate-900 tracking-tighter">{value}</h4>
      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{trend}</span>
    </div>
  </div>
);

const ReminderColumn: React.FC<{ title: string; icon: React.ReactNode; meds: any[] }> = ({ title, icon, meds }) => (
  <div className="space-y-6">
    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
      <div className="p-2 bg-white rounded-xl shadow-sm">{icon}</div>
      <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-700">{title} Slot</h4>
    </div>
    <div className="space-y-4">
      {meds.length > 0 ? meds.map((m, i) => (
        <div key={i} className="p-6 bg-white border border-slate-100 rounded-[2rem] hover:border-indigo-200 transition-all group shadow-sm">
           <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Pill size={20} />
              </div>
              <button className="p-2 bg-slate-50 text-slate-300 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all">
                <Check size={16} />
              </button>
           </div>
           <h5 className="font-black text-slate-800 truncate mb-1">{m.name}</h5>
           <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{m.dosage}</p>
           <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-2">
             {/* Fix: Added Stethoscope import to fix 'Cannot find name' error */}
             <Stethoscope size={10} className="text-indigo-400" />
             <span className="text-[8px] font-black text-slate-400 uppercase truncate">DR. {m.doctor.toUpperCase()}</span>
           </div>
        </div>
      )) : (
        <div className="py-10 text-center border-2 border-dashed border-slate-50 rounded-[2rem]">
          <p className="text-[10px] font-black text-slate-200 uppercase tracking-widest">Free Slot</p>
        </div>
      )}
    </div>
  </div>
);

export default PatientDashboard;
