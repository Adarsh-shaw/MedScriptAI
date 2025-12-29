
import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { db } from '../services/db';
import { 
  Users, 
  ShieldCheck, 
  Activity, 
  Settings, 
  Database, 
  Lock,
  Globe,
  Bell,
  UserPlus,
  Trash2,
  X,
  Mail,
  Stethoscope,
  Pill,
  User as UserIcon,
  Search,
  CheckCircle2,
  AlertTriangle,
  RefreshCcw,
  Languages,
  PhoneCall
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: 'Mon', count: 400 },
  { name: 'Tue', count: 300 },
  { name: 'Wed', count: 600 },
  { name: 'Thu', count: 800 },
  { name: 'Fri', count: 700 },
  { name: 'Sat', count: 200 },
  { name: 'Sun', count: 150 },
];

const AdminDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'settings'>('stats');
  const [usersList, setUsersList] = useState<User[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Global Settings State (Simulated)
  const [settings, setSettings] = useState({
    clinicName: 'MedScript AI Network',
    maintenanceMode: false,
    strictSecurity: true,
    primaryLanguage: 'English (India)',
    supportEmail: 'admin@medscript.ai',
    sessionTimeout: '60'
  });

  // Form states for new user
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<UserRole>(UserRole.DOCTOR);
  const [newSpecialty, setNewSpecialty] = useState('');

  useEffect(() => {
    setUsersList(db.getUsers());
  }, [showAddModal]);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: Date.now().toString(),
      name: newName,
      email: newEmail,
      role: newRole,
      specialty: newRole === UserRole.DOCTOR ? newSpecialty : undefined
    };
    db.addUser(newUser);
    setShowAddModal(false);
    setNewName('');
    setNewEmail('');
    setNewSpecialty('');
    setUsersList(db.getUsers());
  };

  const handleDeleteUser = (id: string) => {
    if (window.confirm("Are you sure you want to delete this user? All access will be revoked.")) {
      db.deleteUser(id);
      setUsersList(db.getUsers());
    }
  };

  const handleSaveSettings = () => {
    // Simulated save
    alert("Global system settings updated successfully.");
  };

  const filteredUsers = usersList.filter(u => 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatItem icon={<Users />} label="Total Entities" value={usersList.length.toString()} />
        <StatItem icon={<Database />} label="Vault Storage" value="1.2 GB" />
        <StatItem icon={<Lock />} label="Security" value="Active" />
        <StatItem icon={<Globe />} label="Network" value="Cloud" />
      </div>

      <div className="flex flex-wrap gap-4 p-1.5 bg-slate-200 rounded-2xl w-fit shadow-inner">
        <button 
          onClick={() => setActiveTab('stats')}
          className={`px-8 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'stats' ? 'bg-white shadow-lg text-indigo-600' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Analytics
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          className={`px-8 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'users' ? 'bg-white shadow-lg text-indigo-600' : 'text-slate-600 hover:text-slate-900'}`}
        >
          User Management
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={`px-8 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'settings' ? 'bg-white shadow-lg text-indigo-600' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Global Settings
        </button>
      </div>

      {activeTab === 'stats' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Activity className="text-indigo-600" size={20} /> Prescription Traffic
                </h3>
                <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1 text-xs font-bold text-slate-500 outline-none">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                </select>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <Tooltip 
                      cursor={{fill: '#f8fafc'}}
                      contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#4f46e5' : '#818cf8'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                <ShieldCheck className="text-emerald-600" size={20} /> System Logs
              </h3>
              <div className="space-y-4">
                {[
                  { type: 'info', msg: 'Backup completed successfully', time: '10m ago' },
                  { type: 'auth', msg: 'New doctor registered: dr.wilson@med.com', time: '1h ago' },
                  { type: 'warning', msg: 'Peak traffic detected on Node-7', time: '3h ago' },
                  { type: 'info', msg: 'Core security patch applied', time: '1d ago' }
                ].map((log, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-indigo-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${log.type === 'info' ? 'bg-indigo-400' : log.type === 'auth' ? 'bg-emerald-400' : 'bg-amber-400'}`}></div>
                      <p className="text-sm font-semibold text-slate-700">{log.msg}</p>
                    </div>
                    <span className="text-xs font-bold text-slate-400">{log.time}</span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-3 border border-dashed border-slate-200 text-slate-400 font-bold text-sm rounded-2xl hover:bg-slate-50 transition-colors">
                View All Logs
              </button>
            </div>
          </div>

          <div className="flex gap-4">
            <button onClick={() => setActiveTab('settings')} className="flex-1 flex items-center justify-center gap-2 p-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 transition-all">
              <Settings size={20} /> Global Settings
            </button>
            <button onClick={() => setActiveTab('users')} className="flex-1 flex items-center justify-center gap-2 p-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all">
              <Users size={20} /> User Management
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 p-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 transition-all">
              <Bell size={20} /> System Announcements
            </button>
          </div>
        </>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-300">
          <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-widest">Directory Control</h3>
              <p className="text-sm text-slate-500 font-bold">Register or revoke access for medical entities.</p>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search by email/name..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button 
                onClick={() => setShowAddModal(true)}
                className="px-6 py-2.5 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2"
              >
                <UserPlus size={18} /> Register Entity
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                  <th className="px-8 py-4">Entity</th>
                  <th className="px-8 py-4">Role</th>
                  <th className="px-8 py-4">Contact</th>
                  <th className="px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                          {u.role === UserRole.DOCTOR ? <Stethoscope size={20} /> : 
                           u.role === UserRole.PHARMACIST ? <Pill size={20} /> :
                           u.role === UserRole.ADMIN ? <ShieldCheck size={20} /> : <UserIcon size={20} />}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{u.name}</p>
                          {u.specialty && <p className="text-[10px] text-slate-400 font-bold uppercase">{u.specialty}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        u.role === UserRole.ADMIN ? 'bg-purple-50 text-purple-600 border-purple-100' :
                        u.role === UserRole.DOCTOR ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                        u.role === UserRole.PHARMACIST ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-xs font-bold text-slate-600">{u.email}</p>
                    </td>
                    <td className="px-8 py-5 text-right">
                      {u.id !== user.id && (
                        <button 
                          onClick={() => handleDeleteUser(u.id)}
                          className="p-2 text-slate-300 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-widest">System Architecture Settings</h3>
              <p className="text-sm text-slate-500 font-bold">Configure network branding, security layers, and API availability.</p>
            </div>
            <button 
              onClick={handleSaveSettings}
              className="px-8 py-3 bg-indigo-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center gap-2 active:scale-95"
            >
              <CheckCircle2 size={18} /> Deploy Changes
            </button>
          </div>

          <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Branding & General */}
            <div className="space-y-8">
              <section className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 flex items-center gap-2">
                  <Activity size={14} /> Clinic Branding
                </h4>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500">Healthcare Facility Name</label>
                  <input 
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                    value={settings.clinicName}
                    onChange={(e) => setSettings({...settings, clinicName: e.target.value})}
                  />
                </div>
              </section>

              <section className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 flex items-center gap-2">
                  <Languages size={14} /> Regional Localization
                </h4>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500">Primary System Language</label>
                  <select 
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                    value={settings.primaryLanguage}
                    onChange={(e) => setSettings({...settings, primaryLanguage: e.target.value})}
                  >
                    <option>English (India)</option>
                    <option>Hindi</option>
                    <option>Bengali</option>
                    <option>Tamil</option>
                  </select>
                </div>
              </section>

              <section className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 flex items-center gap-2">
                  <RefreshCcw size={14} /> System Status
                </h4>
                <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <div>
                    <p className="text-sm font-bold text-slate-800">Maintenance Mode</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Restricts portal access for patients</p>
                  </div>
                  <button 
                    onClick={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})}
                    className={`w-12 h-6 rounded-full transition-colors relative ${settings.maintenanceMode ? 'bg-amber-500' : 'bg-slate-300'}`}
                  >
                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.maintenanceMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </button>
                </div>
              </section>
            </div>

            {/* Security & Support */}
            <div className="space-y-8">
              <section className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 flex items-center gap-2">
                  <Lock size={14} /> Encryption & Auth
                </h4>
                <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <div>
                    <p className="text-sm font-bold text-slate-800">Enforce Strict Verification</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Mandatory 2FA for Pharmacists</p>
                  </div>
                  <button 
                    onClick={() => setSettings({...settings, strictSecurity: !settings.strictSecurity})}
                    className={`w-12 h-6 rounded-full transition-colors relative ${settings.strictSecurity ? 'bg-indigo-600' : 'bg-slate-300'}`}
                  >
                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.strictSecurity ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </button>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500">Session Timeout (Minutes)</label>
                  <input 
                    type="number"
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                    value={settings.sessionTimeout}
                    onChange={(e) => setSettings({...settings, sessionTimeout: e.target.value})}
                  />
                </div>
              </section>

              <section className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 flex items-center gap-2">
                  <PhoneCall size={14} /> Technical Support
                </h4>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500">System Administrator Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 text-slate-400" size={18} />
                    <input 
                      className="w-full pl-12 pr-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                      value={settings.supportEmail}
                      onChange={(e) => setSettings({...settings, supportEmail: e.target.value})}
                    />
                  </div>
                </div>
              </section>

              <div className="p-6 rounded-2xl bg-amber-50 border border-amber-100 flex gap-4 text-amber-700">
                <AlertTriangle className="shrink-0" size={24} />
                <div className="space-y-1">
                  <p className="text-sm font-black uppercase tracking-tight leading-none">Security Advisory</p>
                  <p className="text-[10px] font-bold opacity-80 leading-relaxed">Changes made here affect global encryption keys and user access protocols. Deploy with caution.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Registration Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute top-8 right-8 text-slate-400 hover:text-slate-900"
            >
              <X size={24} />
            </button>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Entity Registration</h3>
            <p className="text-slate-500 text-sm font-bold mb-8">Onboard a new medical professional or user.</p>

            <form onSubmit={handleAddUser} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Display Name</label>
                <input 
                  required
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Dr. Robert Fox"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Registry Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 text-slate-400" size={18} />
                  <input 
                    required
                    type="email"
                    className="w-full pl-12 pr-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="email@medscript.ai"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">System Role</label>
                <div className="grid grid-cols-2 gap-2">
                  {[UserRole.DOCTOR, UserRole.PHARMACIST, UserRole.PATIENT, UserRole.ADMIN].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setNewRole(r)}
                      className={`py-2.5 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest transition-all ${newRole === r ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200'}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              {newRole === UserRole.DOCTOR && (
                <div className="space-y-2 animate-in slide-in-from-top-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Medical Specialty</label>
                  <input 
                    required
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                    value={newSpecialty}
                    onChange={(e) => setNewSpecialty(e.target.value)}
                    placeholder="e.g. Cardiologist"
                  />
                </div>
              )}
              <button 
                type="submit"
                className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 mt-4 active:scale-95 transition-all"
              >
                Finalize Registry
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const StatItem: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
    <div className="p-3 bg-slate-50 text-indigo-600 w-fit rounded-2xl mb-4">{icon}</div>
    <p className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">{label}</p>
    <p className="text-2xl font-extrabold text-slate-900">{value}</p>
  </div>
);

export default AdminDashboard;
