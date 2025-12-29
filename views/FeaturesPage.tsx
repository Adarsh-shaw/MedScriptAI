
import React from 'react';
import { 
  ArrowLeft, 
  Zap, 
  ShieldCheck, 
  Smartphone, 
  BookOpen, 
  Heart, 
  Search, 
  Bell, 
  Cpu, 
  Database,
  Stethoscope,
  Scan
} from 'lucide-react';

interface FeaturesPageProps {
  onBack: () => void;
  isDashboardView?: boolean;
}

const FeaturesPage: React.FC<FeaturesPageProps> = ({ onBack, isDashboardView }) => {
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
        <div className="max-w-4xl mb-24">
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-none mb-10">
            Clinical <br />
            <span className="text-indigo-600">Intelligence.</span>
          </h1>
          <p className="text-xl text-slate-500 font-bold leading-relaxed">
            MedScript AI isn't just a database; it's a real-time safety layer for modern medicine. We've built tools that empower doctors while protecting patients with cryptographic verification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-32">
          <FeatureBlock 
            icon={<Zap className="text-amber-500" />}
            title="90s Generation"
            desc="Our UI is optimized for high-pressure clinical environments. Generate a full, compliant prescription in under 90 seconds."
          />
          <FeatureBlock 
            icon={<Cpu className="text-indigo-600" />}
            title="Gemini AI Interaction"
            desc="Automated drug-drug interaction checks using Google Gemini. Detect life-threatening collisions before the ink is dry."
          />
          <FeatureBlock 
            icon={<Scan className="text-emerald-500" />}
            title="AI OCR Digitizer"
            desc="Seamlessly transition from paper to digital. Scan existing handwritten notes and convert them into structured clinical data."
          />
          <FeatureBlock 
            icon={<ShieldCheck className="text-slate-900" />}
            title="QR Verifier"
            desc="Every prescription features an encrypted QR seal. Pharmacists scan to verify authenticity and origin in milliseconds."
          />
          <FeatureBlock 
            icon={<Database className="text-indigo-600" />}
            title="Patient Vault"
            desc="Centralized medical history that follows the patient. No more lost papers or forgotten medication details."
          />
          <FeatureBlock 
            icon={<Bell className="text-rose-500" />}
            title="Adherence Reminders"
            desc="Automated smart notifications for patients, ensuring chronic medication cycles are never missed."
          />
        </div>

        <div className="bg-indigo-50 rounded-[4rem] p-12 md:p-24 border border-indigo-100 flex flex-col lg:flex-row gap-20 items-center">
           <div className="flex-1">
             <h2 className="text-4xl font-black text-slate-900 mb-8 tracking-tight">Technical Architecture</h2>
             <p className="text-lg text-slate-600 font-bold mb-10 leading-relaxed">
               Built with a serverless core and 256-bit AES encryption, MedScript ensures data sovereignty while maintaining lightning-fast query speeds for clinical history.
             </p>
             <div className="space-y-6">
                <TechLabel label="256-bit End-to-End Encryption" />
                <TechLabel label="Real-time Synchronization Engine" />
                <TechLabel label="Zero-Knowledge Authentication" />
                <TechLabel label="Offline-First Verification Support" />
             </div>
           </div>
           <div className="flex-1 grid grid-cols-2 gap-6">
              <div className="p-8 bg-white rounded-3xl shadow-sm border border-indigo-100 text-center">
                 <p className="text-4xl font-black text-indigo-600 mb-2">&lt; 1s</p>
                 <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Query Speed</p>
              </div>
              <div className="p-8 bg-white rounded-3xl shadow-sm border border-indigo-100 text-center">
                 <p className="text-4xl font-black text-indigo-600 mb-2">99%</p>
                 <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">AI Accuracy</p>
              </div>
              <div className="p-8 bg-white rounded-3xl shadow-sm border border-indigo-100 text-center">
                 <p className="text-4xl font-black text-indigo-600 mb-2">TLS 1.3</p>
                 <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Security Level</p>
              </div>
              <div className="p-8 bg-white rounded-3xl shadow-sm border border-indigo-100 text-center">
                 <p className="text-4xl font-black text-indigo-600 mb-2">HA</p>
                 <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Availability</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const FeatureBlock: React.FC<{ icon: React.ReactNode, title: string, desc: string }> = ({ icon, title, desc }) => (
  <div className="group space-y-6">
    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-all">
      {icon}
    </div>
    <h3 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h3>
    <p className="text-slate-500 font-bold text-sm leading-relaxed">{desc}</p>
  </div>
);

const TechLabel: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex items-center gap-4">
    <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
    <span className="text-sm font-black text-slate-800 uppercase tracking-widest">{label}</span>
  </div>
);

export default FeaturesPage;
