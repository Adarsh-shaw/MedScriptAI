
import React from 'react';
import { 
  ArrowLeft, 
  Globe, 
  Heart, 
  Users, 
  ShieldCheck, 
  Scale, 
  CheckCircle2,
  Stethoscope,
  TrendingUp,
  Award
} from 'lucide-react';

interface SocialImpactPageProps {
  onBack: () => void;
  isDashboardView?: boolean;
}

const SocialImpactPage: React.FC<SocialImpactPageProps> = ({ onBack, isDashboardView }) => {
  return (
    <div className={`min-h-screen bg-slate-900 text-white ${isDashboardView ? '' : 'animate-in fade-in duration-500'}`}>
      {!isDashboardView && (
        <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-md z-50 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-slate-400 hover:text-indigo-400 font-black text-xs uppercase tracking-widest transition-all"
            >
              <ArrowLeft size={18} /> Back Home
            </button>
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg text-white">
                <Stethoscope size={20} />
              </div>
              <span className="text-lg font-black tracking-tight text-white uppercase">MedScript<span className="text-indigo-600">AI</span></span>
            </div>
          </div>
        </nav>
      )}

      <div className={`max-w-7xl mx-auto px-6 ${isDashboardView ? 'py-10' : 'pt-40 pb-32'}`}>
        <div className="max-w-4xl mb-32">
          <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-[0.9] mb-12">
            Healing the <br />
            <span className="text-indigo-500">System.</span>
          </h1>
          <p className="text-2xl text-slate-400 font-bold leading-relaxed">
            MedScript AI is built on the belief that healthcare equity begins with data accessibility. We are dedicated to bridging the rural-urban divide in India's medical infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-40">
           <div className="space-y-16">
              <ImpactCard 
                icon={<Heart className="text-rose-500" />}
                title="Eliminating Clinical Errors"
                content="Illegible prescriptions are a leading cause of accidental deaths. Our digital-first approach ensures every medical intent is clearly communicated and verified."
              />
              <ImpactCard 
                icon={<Globe className="text-indigo-400" />}
                title="Rural Accessibility"
                content="Our lightweight infrastructure is designed for low-bandwidth environments, ensuring that rural patients have the same level of record portability as urban citizens."
              />
              <ImpactCard 
                icon={<Users className="text-emerald-400" />}
                title="Patient Empowerment"
                content="We put medical history back into the hands of the patient. The MedVault ensures that history is never lost during doctor switches or pharmacy visits."
              />
           </div>
           <div className="relative">
              <div className="sticky top-40 p-12 bg-white/5 backdrop-blur-3xl rounded-[4rem] border border-white/10 shadow-3xl">
                 <h3 className="text-3xl font-black mb-10 tracking-tight">Impact Roadmap 2025</h3>
                 <div className="space-y-8">
                    <Milestone label="1 Million Error-Free Prescriptions" percent={85} />
                    <Milestone label="500 Rural Health Centers Joined" percent={60} />
                    <Milestone label="99.9% Pharmacy Verification Rate" percent={95} />
                    <Milestone label="100% Data Sovereignty for Patients" percent={100} />
                 </div>
                 <div className="mt-16 pt-10 border-t border-white/10 flex gap-8">
                    <div>
                       <p className="text-4xl font-black text-white">1.4B</p>
                       <p className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">Lives Impacted</p>
                    </div>
                    <div>
                       <p className="text-4xl font-black text-white">0%</p>
                       <p className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">Fraud Tolerance</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <div className="text-center bg-indigo-600 rounded-[5rem] p-20 md:p-32 shadow-2xl shadow-indigo-500/20">
           <Award size={64} className="mx-auto mb-10 text-white opacity-40" />
           <h2 className="text-4xl md:text-6xl font-black mb-10 tracking-tight leading-none text-white">Committed to Healthcare <br />Equity for All.</h2>
           <p className="text-xl text-indigo-100 font-bold max-w-2xl mx-auto mb-16 opacity-80 leading-relaxed">
             Our mission is to ensure that no patient is ever misdiagnosed or mistreated due to a lack of historical clinical data. Digital health is a human right.
           </p>
           <div className="flex flex-wrap justify-center gap-10">
              <ImpactStat icon={<TrendingUp size={24} />} label="Error Reduction" value="99.9%" />
              <ImpactStat icon={<Scale size={24} />} label="Data Privacy" value="256-bit" />
              <ImpactStat icon={<ShieldCheck size={24} />} label="Fraud Prevent" value="Active" />
           </div>
        </div>
      </div>
    </div>
  );
};

const ImpactCard: React.FC<{ icon: React.ReactNode, title: string, content: string }> = ({ icon, title, content }) => (
  <div className="flex gap-10">
    <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center shrink-0 shadow-inner text-white">
      {icon}
    </div>
    <div className="space-y-4">
      <h3 className="text-2xl font-black tracking-tight">{title}</h3>
      <p className="text-slate-400 font-bold leading-relaxed">{content}</p>
    </div>
  </div>
);

const Milestone: React.FC<{ label: string, percent: number }> = ({ label, percent }) => (
  <div className="space-y-3">
    <div className="flex justify-between items-end">
       <p className="text-xs font-black uppercase tracking-widest text-slate-300">{label}</p>
       <p className="text-xs font-black text-indigo-500">{percent}%</p>
    </div>
    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
       <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${percent}%` }}></div>
    </div>
  </div>
);

const ImpactStat: React.FC<{ icon: React.ReactNode, label: string, value: string }> = ({ icon, label, value }) => (
  <div className="flex flex-col items-center gap-3">
    <div className="p-4 bg-white/10 rounded-2xl text-white">
      {icon}
    </div>
    <div>
      <p className="text-2xl font-black text-white leading-none">{value}</p>
      <p className="text-[10px] font-black uppercase text-indigo-300 tracking-widest mt-1">{label}</p>
    </div>
  </div>
);

export default SocialImpactPage;
