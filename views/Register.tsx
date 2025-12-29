
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { db } from '../services/db';
import { User as UserIcon, Mail, Lock, Phone, ArrowLeft, Stethoscope, CheckCircle } from 'lucide-react';

interface RegisterProps {
  onBack: () => void;
  onToggleLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onBack, onToggleLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const existing = db.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      setError('This email is already registered in our medical database.');
      return;
    }

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      role: UserRole.PATIENT
    };

    db.addUser(newUser);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-50">
            <CheckCircle size={48} />
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Vault Created!</h2>
            <p className="text-slate-500 font-bold">Your digital medical vault is ready. You can now receive and verify prescriptions from registered doctors.</p>
          </div>
          <button 
            onClick={onToggleLogin}
            className="w-full py-4 bg-indigo-600 text-white font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left side: Form */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-24 py-12">
        <button 
          onClick={onBack}
          className="mb-12 flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold transition-colors w-fit"
        >
          <ArrowLeft size={20} /> Return Home
        </button>

        <div className="max-w-md w-full">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
              Patient Registration
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-4">Join the Network</h1>
            <p className="text-slate-500 font-bold">Secure your clinical history in our encrypted vault.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Legal Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-3.5 text-slate-400" size={18} />
                <input 
                  required
                  className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-slate-800"
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-slate-400" size={18} />
                <input 
                  required
                  type="email"
                  className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-slate-800"
                  placeholder="personal@gmail.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-3.5 text-slate-400" size={18} />
                <input 
                  required
                  className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-slate-800"
                  placeholder="+91 00000 00000"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secure Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-slate-400" size={18} />
                <input 
                  required
                  type="password"
                  className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-slate-800"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <p className="text-xs font-bold text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-100 italic">{error}</p>
            )}

            <button 
              type="submit"
              className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-indigo-200 mt-6 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all"
            >
              Initialize Registry
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-bold text-slate-500">
            Already registered?{' '}
            <button onClick={onToggleLogin} className="text-indigo-600 hover:underline">Log in here</button>
          </p>
        </div>
      </div>

      {/* Right side: Visual */}
      <div className="hidden lg:block flex-1 bg-slate-50 relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1600" 
          className="absolute inset-0 w-full h-full object-cover grayscale opacity-20"
          alt="Medical Background"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 to-slate-900/90 flex flex-col items-center justify-center p-20 text-center">
          <div className="p-8 bg-white/10 backdrop-blur-xl rounded-[3rem] border border-white/10 shadow-2xl max-w-lg">
             <Stethoscope size={64} className="text-indigo-400 mx-auto mb-8" />
             <h2 className="text-3xl font-black text-white tracking-tight mb-6 leading-tight">Securing 1.4 Billion Prescriptions</h2>
             <p className="text-indigo-200 font-bold leading-relaxed mb-10">By creating an account, you join a network dedicated to eliminating medication errors through digital precision and verification.</p>
             <div className="flex justify-center gap-8">
               <div className="text-center">
                 <p className="text-2xl font-black text-white">99.9%</p>
                 <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">Accuracy</p>
               </div>
               <div className="w-px h-10 bg-white/10"></div>
               <div className="text-center">
                 <p className="text-2xl font-black text-white">256-bit</p>
                 <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">Security</p>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
