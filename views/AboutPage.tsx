
import React from 'react';
import { 
  ArrowLeft, 
  Stethoscope, 
  ShieldCheck, 
  Zap, 
  Globe, 
  Scale, 
  Shield, 
  Cpu,
  ChevronRight,
  Heart
} from 'lucide-react';

interface AboutPageProps {
  onBack: () => void;
  isDashboardView?: boolean;
}

const AboutPage: React.FC<AboutPageProps> = ({ onBack, isDashboardView }) => {
  return (
    <div className={`min-h-screen bg-white ${isDashboardView ? '' : 'animate-in fade-in duration-500'}`}>
      {!isDashboardView && (
        <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-black text-xs uppercase tracking-widest transition-all"
            >
              <ArrowLeft size={18} /> Back Home
            </button>
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg text-white">
                <Stethoscope size={20} />
              </div>
              <span className="text-lg font-black tracking-tight text-slate-900 uppercase">MedScript<span className="text-indigo-600">AI</span></span>
            </div>
          </div>
        </nav>
      )}

      <div className={`max-w-7xl mx-auto px-6 ${isDashboardView ? 'py-10' : 'pt-40 pb-32'}`}>
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-none mb-10">
            Digital Health <br />
            <span className="text-indigo-600">Sovereignty.</span>
          </h1>
          <p className="text-xl text-slate-500 font-bold leading-relaxed mb-16">
            MedScript AI is a clinical-grade network designed to solve the most persistent problem in healthcare: the data gap. By digitizing the prescription lifecycle, we protect lives and secure medical history for 1.4 billion citizens.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-32">
          <ValueProp 
            icon={<Cpu className="text-indigo-600" />}
            title="AI Intelligence"
            desc="Leveraging Google Gemini to detect drug-drug interactions with 99.9% accuracy before the prescription is even issued."
          />
          <ValueProp 
            icon={<Shield className="text-emerald-600" />}
            title="Encrypted Vaults"
            desc="Every record is signed with a unique cryptographic hash and stored in an encrypted vault, accessible only with patient authorization."
          />
          <ValueProp 
            icon={<Globe className="text-amber-600" />}
            title="Rural Reach"
            desc="Lightweight architecture designed to work in low-bandwidth rural clinics, ensuring healthcare equity across the Indian subcontinent."
          />
        </div>

        <div className="bg-slate-900 rounded-[4rem] p-12 md:p-24 text-white overflow-hidden relative mb-32">
          <div className="relative z-10 max-w-4xl">
            <h2 className="text-4xl md:text-6xl font-black mb-10 tracking-tight leading-none">The Social Impact <br />Pillar.</h2>
            <div className="space-y-12">
              <ImpactSection 
                title="Eliminating Medical Errors"
                content="Illegible handwriting accounts for over 7,000 deaths annually worldwide. MedScript eliminates this risk by ensuring every clinical intent is clearly typed and verified."
              />
              <ImpactSection 
                title="Fraud Prevention"
                content="Our encrypted QR system prevents the distribution of fraudulent medications. Pharmacists can verify the origin and authenticity of every prescription in real-time."
              />
              <ImpactSection 
                title="Patient Portability"
                content="For many Indian patients, medical history is lost between doctor switches. Our vault ensures your clinical journey is permanent, portable, and private."
              />
            </div>
          </div>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 blur-[150px] -mr-64 -mt-64"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div>
            <h3 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-6">Our Technology</h3>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-tight mb-8">Built on the most secure medical protocols.</h2>
            <p className="text-lg text-slate-500 font-bold mb-10 leading-relaxed">
              We utilize a proprietary blend of Gemini AI for diagnostics support, high-density QR encoding for verification, and 256-bit AES encryption for data at rest.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-3xl font-black text-slate-900">256-bit</p>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">AES Encryption</p>
              </div>
              <div>
                <p className="text-3xl font-black text-slate-900">HIPAA</p>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Global Standard</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 p-12 rounded-[3rem] border border-slate-100">
             <div className="flex items-center gap-4 mb-8">
               <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-indigo-600">
                 <ShieldCheck size={24} />
               </div>
               <h4 className="font-black text-slate-800 uppercase tracking-widest text-sm">Security Layers</h4>
             </div>
             <ul className="space-y-6">
                <SecurityLayer title="Biometric Authorization" />
                <SecurityLayer title="Digital Signature Anchors" />
                <SecurityLayer title="Real-time Audit Logs" />
                <SecurityLayer title="Zero-Knowledge Storage" />
             </ul>
          </div>
        </div>
      </div>

      {!isDashboardView && (
        <footer className="bg-white border-t border-slate-100 py-24 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">© 2025 MedScript AI Network • All Rights Reserved</p>
          </div>
        </footer>
      )}
    </div>
  );
};

const ValueProp: React.FC<{ icon: React.ReactNode, title: string, desc: string }> = ({ icon, title, desc }) => (
  <div className="p-10 bg-slate-50 rounded-[3rem] border border-transparent hover:border-indigo-100 hover:bg-white hover:shadow-2xl transition-all group">
    <div className="p-5 bg-white rounded-2xl w-fit shadow-md mb-8 group-hover:bg-indigo-600 group-hover:text-white transition-all">
      {icon}
    </div>
    <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tight">{title}</h3>
    <p className="text-slate-500 font-bold leading-relaxed text-sm">{desc}</p>
  </div>
);

const ImpactSection: React.FC<{ title: string, content: string }> = ({ title, content }) => (
  <div className="group border-l-4 border-indigo-500/30 pl-10 hover:border-indigo-500 transition-all">
    <h4 className="text-2xl font-black text-white mb-4 flex items-center gap-4">
      {title} <ChevronRight className="opacity-0 group-hover:opacity-100 transition-all text-indigo-500" />
    </h4>
    <p className="text-slate-400 font-bold leading-relaxed max-w-2xl">{content}</p>
  </div>
);

const SecurityLayer: React.FC<{ title: string }> = ({ title }) => (
  <li className="flex items-center gap-4">
    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
    <span className="text-sm font-black text-slate-700 uppercase tracking-widest">{title}</span>
  </li>
);

export default AboutPage;
