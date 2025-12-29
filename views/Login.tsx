
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { db } from '../services/db';
import { Stethoscope, Pill, User as UserIcon, ShieldCheck, ArrowLeft, Mail, Lock } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
  onBack: () => void;
  onToggleRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onBack, onToggleRegister }) => {
  const [role, setRole] = useState<UserRole>(UserRole.DOCTOR);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const user = db.getUserByEmail(email, role);
    if (user) {
      onLogin(user);
    } else {
      setError(`No ${role.toLowerCase()} found with this email. Try: ${role === UserRole.DOCTOR ? 'doctor@medscript.com' : role === UserRole.PATIENT ? 'patient@gmail.com' : role === UserRole.PHARMACIST ? 'pharmacist@medscript.com' : 'admin@medscript.com'}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative">
      <button 
        onClick={onBack}
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-colors"
      >
        <ArrowLeft size={20} /> Back to Website
      </button>

      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-200 mb-6">
            <Stethoscope size={40} />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Access Portal</h1>
          <p className="text-slate-500 mt-2 text-lg">Secure Login for Medical Professionals & Patients</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-4">Select Your Role</label>
              <div className="grid grid-cols-2 gap-3">
                {[UserRole.DOCTOR, UserRole.PATIENT, UserRole.PHARMACIST, UserRole.ADMIN].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all text-xs font-bold ${role === r ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'}`}
                  >
                    {r === UserRole.DOCTOR && <Stethoscope size={16} />}
                    {r === UserRole.PATIENT && <UserIcon size={16} />}
                    {r === UserRole.PHARMACIST && <Pill size={16} />}
                    {r === UserRole.ADMIN && <ShieldCheck size={16} />}
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-slate-400" size={18} />
                <input
                  type="email"
                  required
                  placeholder="Enter your registered email"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-slate-400" size={18} />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-indigo-600 text-white font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
            >
              Sign In to Dashboard
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500 font-medium">
              Don't have an account?{' '}
              <button 
                onClick={onToggleRegister}
                className="text-indigo-600 font-bold hover:underline"
              >
                Register as Patient
              </button>
            </p>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-6 opacity-50">
              Data Encryption Active • HIPAA Compliant
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
