
import React from 'react';
import { 
  Stethoscope, 
  ShieldCheck, 
  Zap, 
  Heart, 
  Globe, 
  Smartphone, 
  ArrowRight,
  CheckCircle2,
  Users,
  Award,
  BookOpen,
  Scale
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onShowAbout: () => void;
  onShowFeatures: () => void;
  onShowImpact: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onShowAbout, onShowFeatures, onShowImpact }) => {
  return (
    <div className="min-h-screen bg-white selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2.5 rounded-xl text-white shadow-lg shadow-indigo-200">
              <Stethoscope size={24} />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900 uppercase">MedScript<span className="text-indigo-600">AI</span></span>
          </div>
          <div className="hidden lg:flex items-center gap-10 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
            <button onClick={onShowAbout} className="hover:text-indigo-600 transition-colors">About</button>
            <button onClick={onShowFeatures} className="hover:text-indigo-600 transition-colors">Features</button>
            <button onClick={onShowImpact} className="hover:text-indigo-600 transition-colors">Social Impact</button>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={onGetStarted}
              className="px-8 py-3 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95"
            >
              Portal Access
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-48 pb-32 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <ShieldCheck size={14} /> HIPAA Compliant Architecture
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tight leading-[0.9] mb-10">
              Healthcare <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400">Deciphered.</span>
            </h1>
            <p className="text-xl text-slate-500 font-bold max-w-xl mb-12 leading-relaxed">
              We are eliminating the world's leading cause of medication errors: illegible prescriptions. A digital-first network for doctors, patients, and pharmacies.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start">
              <button 
                onClick={onGetStarted}
                className="w-full sm:w-auto px-12 py-6 bg-slate-900 text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-2xl hover:scale-[1.02] active:scale-95"
              >
                Join the Network <ArrowRight size={20} />
              </button>
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-200 overflow-hidden shadow-sm">
                    <img src={`https://i.pravatar.cc/150?u=${i+10}`} alt="User" />
                  </div>
                ))}
                <div className="w-12 h-12 rounded-full border-4 border-white bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                  +2k
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="absolute inset-0 bg-indigo-500/10 blur-[120px] rounded-full"></div>
            <img 
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=2000" 
              className="relative z-10 w-full rounded-[3rem] shadow-2xl border-[12px] border-white aspect-square object-cover grayscale hover:grayscale-0 transition-all duration-1000"
              alt="Healthcare Platform"
            />
            <div className="absolute -bottom-10 -left-10 z-20 bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 animate-bounce-slow">
               <div className="flex items-center gap-4">
                 <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                   <Users size={24} />
                 </div>
                 <div>
                   <p className="text-2xl font-black text-slate-900 leading-none">1.4B+</p>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Impact Potential</p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </header>

      {/* Quick About Link */}
      <section className="py-32 px-6 bg-slate-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6 pt-12">
                <div className="p-10 bg-white rounded-[3rem] shadow-sm border border-slate-100 text-center group hover:border-indigo-200 transition-all cursor-pointer" onClick={onShowAbout}>
                   <Award className="mx-auto text-indigo-600 mb-6" size={40} />
                   <h4 className="font-black text-slate-900 text-sm uppercase tracking-widest mb-2">Mission</h4>
                   <p className="text-[11px] text-slate-500 font-bold leading-relaxed">Read about our healthcare journey.</p>
                </div>
                <div className="p-10 bg-indigo-600 text-white rounded-[3rem] shadow-2xl shadow-indigo-100 text-center cursor-pointer" onClick={onShowFeatures}>
                   <Zap className="mx-auto mb-6" size={40} />
                   <h4 className="font-black text-sm uppercase tracking-widest mb-2">Tech</h4>
                   <p className="text-[11px] font-bold leading-relaxed opacity-80">Explore our clinical intelligence.</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="p-10 bg-slate-900 text-white rounded-[3rem] shadow-2xl shadow-slate-200 text-center cursor-pointer" onClick={onShowImpact}>
                   <Globe className="mx-auto mb-6" size={40} />
                   <h4 className="font-black text-sm uppercase tracking-widest mb-2">Impact</h4>
                   <p className="text-[11px] font-bold leading-relaxed opacity-80">See how we bridge the rural gap.</p>
                </div>
                <div className="p-10 bg-white rounded-[3rem] shadow-sm border border-slate-100 text-center group hover:border-indigo-200 transition-all">
                   <Scale className="mx-auto text-indigo-600 mb-6" size={40} />
                   <h4 className="font-black text-slate-900 text-sm uppercase tracking-widest mb-2">Ethics</h4>
                   <p className="text-[11px] text-slate-500 font-bold leading-relaxed">Committed to patient data privacy.</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-6">About MedScript AI</h3>
              <h2 className="text-5xl font-black text-slate-900 tracking-tight leading-none mb-10">Healthcare for the <span className="text-indigo-600">Digital Age.</span></h2>
              <p className="text-lg text-slate-500 font-bold mb-8 leading-relaxed">
                MedScript AI was born from a simple realization: human handwriting should never be a barrier to human life. We've built an infrastructure that translates medical intent into verifiable digital records.
              </p>
              <button 
                onClick={onShowAbout}
                className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest hover:gap-4 transition-all"
              >
                Learn More About Our Tech <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-12">
            <div className="bg-indigo-600 p-2.5 rounded-xl text-white">
              <Stethoscope size={24} />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900 uppercase">MedScript AI</span>
          </div>
          <p className="text-slate-500 font-bold max-w-xl mx-auto mb-12">
            Empowering the Indian healthcare ecosystem with precision, security, and accessibility.
          </p>
          <div className="flex justify-center gap-10 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-12">
            <button onClick={onShowAbout} className="hover:text-indigo-600 transition-colors">About Us</button>
            <button onClick={onShowFeatures} className="hover:text-indigo-600 transition-colors">Tech Stack</button>
            <button onClick={onShowImpact} className="hover:text-indigo-600 transition-colors">Impact</button>
          </div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">© 2025 MedScript AI Network • Frostbite Solutions</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, desc: string }> = ({ icon, title, desc }) => (
  <div className="p-10 bg-slate-50 rounded-[3rem] border border-transparent hover:border-indigo-100 hover:bg-white hover:shadow-2xl transition-all group">
    <div className="p-5 bg-white rounded-2xl w-fit shadow-md mb-8 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
      {icon}
    </div>
    <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tight">{title}</h3>
    <p className="text-slate-500 font-bold leading-relaxed text-sm">{desc}</p>
  </div>
);

const ImpactItem: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex items-center gap-5">
    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-inner">
      <CheckCircle2 size={16} />
    </div>
    <span className="font-bold text-slate-300 text-sm">{text}</span>
  </div>
);

export default LandingPage;
