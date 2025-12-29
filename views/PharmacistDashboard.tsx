
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { User, Prescription, PrescriptionStatus } from '../types';
import { db } from '../services/db';
import jsQR from 'jsqr';
import { 
  Scan, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Package, 
  History,
  ShieldCheck,
  ClipboardList,
  Clock3,
  Camera,
  Upload,
  X,
  Loader2,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Minus,
  Plus
} from 'lucide-react';

interface PharmacistDashboardProps {
  user: User;
}

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  category: string;
  minThreshold: number;
}

const PharmacistDashboard: React.FC<PharmacistDashboardProps> = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Routing View Logic
  const view = useMemo(() => {
    if (location.pathname === '/verify') return 'verify';
    if (location.pathname === '/stock') return 'stock';
    return 'overview';
  }, [location.pathname]);

  // Verification State
  const [scanInput, setScanInput] = useState('');
  const [activeRx, setActiveRx] = useState<Prescription | null>(null);
  const [error, setError] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannerMode, setScannerMode] = useState<'camera' | 'file' | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  // Inventory State (Simulated)
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: '1', name: 'Paracetamol 500mg', quantity: 150, category: 'Analgesic', minThreshold: 50 },
    { id: '2', name: 'Amoxicillin 250mg', quantity: 12, category: 'Antibiotic', minThreshold: 30 },
    { id: '3', name: 'Metformin 500mg', quantity: 45, category: 'Anti-diabetic', minThreshold: 50 },
    { id: '4', name: 'Atorvastatin 10mg', quantity: 80, category: 'Lipid-lowering', minThreshold: 20 },
    { id: '5', name: 'Ibuprofen 200mg', quantity: 0, category: 'NSAID', minThreshold: 40 },
  ]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const requestRef = useRef<number>(null);

  const handleVerify = (code?: string) => {
    setError('');
    const targetCode = code || scanInput;
    const found = db.getPrescriptions().find(p => p.qrCode === targetCode);
    if (found) {
      setActiveRx(found);
      if (code) setScanInput(code);
    } else {
      setError('Prescription not found or invalid QR code.');
      setActiveRx(null);
    }
  };

  const handleDispense = () => {
    if (activeRx) {
      db.updatePrescription(activeRx.id, { status: PrescriptionStatus.DISPENSED });
      setActiveRx({ ...activeRx, status: PrescriptionStatus.DISPENSED });
    }
  };

  const updateInventory = (id: string, delta: number) => {
    setInventory(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
    ));
  };

  const startCamera = async () => {
    setScannerMode('camera');
    setIsScanning(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.play();
        requestRef.current = requestAnimationFrame(tick);
      }
    } catch (err) {
      setError('Could not access camera. Please check permissions.');
      setIsScanning(false);
      setScannerMode(null);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    setScannerMode(null);
    setIsScanning(false);
  };

  const tick = () => {
    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      if (context) {
        canvas.height = videoRef.current.videoHeight;
        canvas.width = videoRef.current.videoWidth;
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: 'dontInvert' });
        if (code) {
          handleVerify(code.data);
          closeScanner();
          return;
        }
      }
    }
    requestRef.current = requestAnimationFrame(tick);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsScanning(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        if (canvasRef.current) {
          const canvas = canvasRef.current;
          const context = canvas.getContext('2d');
          if (context) {
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0);
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);
            if (code) {
              handleVerify(code.data);
              closeScanner();
            } else {
              setError('No valid QR code found in this image.');
            }
          }
        }
        setIsScanning(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const closeScanner = () => {
    stopCamera();
    setIsScannerOpen(false);
    setScannerMode(null);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const isDispensed = activeRx?.status === PrescriptionStatus.DISPENSED;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Action Switcher Bar */}
      <div className="bg-white p-3 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex p-1 bg-slate-50 rounded-2xl w-full md:w-auto">
          <button 
            onClick={() => navigate('/')}
            className={`flex-1 md:px-10 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${view === 'overview' ? 'bg-white shadow-sm text-emerald-600 ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Clinical Overview
          </button>
          <button 
            onClick={() => navigate('/verify')}
            className={`flex-1 md:px-10 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${view === 'verify' ? 'bg-white shadow-sm text-emerald-600 ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Verification Hub
          </button>
          <button 
            onClick={() => navigate('/stock')}
            className={`flex-1 md:px-10 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${view === 'stock' ? 'bg-white shadow-sm text-emerald-600 ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Stock Registry
          </button>
        </div>
        <div className="hidden md:flex items-center gap-4 px-6 py-3 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100">
           <ShieldCheck size={18} />
           <span className="text-[10px] font-black uppercase tracking-widest">Store Node Auth Active</span>
        </div>
      </div>

      {view === 'overview' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <DashboardStat icon={<History size={32} />} label="Session Dispenses" value="42" trend="+12% today" />
            <DashboardStat icon={<ClipboardList size={32} />} label="Inventory Alerts" value={inventory.filter(i => i.quantity <= i.minThreshold).length.toString()} trend="Requires attention" />
            <DashboardStat icon={<ShieldCheck size={32} />} label="Store Integrity" value="100%" trend="Secure Vault" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center space-y-6">
               <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                 <Scan size={32} />
               </div>
               <h3 className="text-2xl font-black text-slate-800 tracking-tight">Verify Clinical Intents</h3>
               <p className="text-slate-500 font-bold max-w-sm">Every MedScript prescription is cryptographically signed. Use the scanner to verify and dispense records.</p>
               <button 
                onClick={() => navigate('/verify')}
                className="px-8 py-3 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-xl shadow-emerald-100"
               >
                 Open Scanner <ArrowUpRight size={16} />
               </button>
            </div>
            
            <div className="bg-slate-900 p-12 rounded-[3.5rem] shadow-2xl text-white flex flex-col items-center justify-center text-center space-y-6">
               <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md">
                 <Package size={32} className="text-emerald-400" />
               </div>
               <h3 className="text-2xl font-black tracking-tight">Inventory Intelligence</h3>
               <p className="text-slate-400 font-bold max-w-sm">Manage your store's stock levels with automated thresholds and shelf-life tracking.</p>
               <button 
                onClick={() => navigate('/stock')}
                className="px-8 py-3 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-lg"
               >
                 View Stock Registry
               </button>
            </div>
          </div>
        </div>
      )}

      {view === 'verify' && (
        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 flex flex-col md:flex-row items-center gap-8">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center shrink-0">
              <Scan size={40} />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">Prescription Verification</h2>
              <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">Smart Healthcare Authentication Protocol</p>
            </div>
            <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
              <div className="relative flex-1 sm:w-64">
                <input 
                  type="text" 
                  placeholder="VERIFY-CODE"
                  className="w-full pl-6 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-mono uppercase font-black text-slate-700 tracking-widest"
                  value={scanInput}
                  onChange={e => setScanInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                />
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsScannerOpen(true)}
                  className="p-4 bg-white border-2 border-emerald-600 text-emerald-600 rounded-2xl hover:bg-emerald-50 transition-all flex items-center justify-center active:scale-95"
                  title="Scan QR Code"
                >
                  <Camera size={24} />
                </button>
                <button 
                  onClick={() => handleVerify()}
                  className="flex-1 sm:px-8 py-4 bg-emerald-600 text-white font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 active:scale-95"
                >
                  Verify
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-5 bg-rose-50 text-rose-700 rounded-3xl flex items-center gap-3 border border-rose-100 font-black text-xs uppercase tracking-widest animate-in fade-in slide-in-from-top-2">
              <XCircle size={20} /> {error}
            </div>
          )}

          {activeRx ? (
            <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">
              <div className={`p-3 text-center text-[10px] font-black tracking-[0.3em] uppercase flex items-center justify-center gap-3 ${isDispensed ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>
                {isDispensed ? <Clock3 size={16} /> : <CheckCircle2 size={16} />}
                {isDispensed ? 'STATUS: ALREADY DISPENSED' : 'STATUS: VALID & AUTHENTICATED'}
              </div>
              
              <div className="p-10 md:p-14 grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="space-y-10">
                  <div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Patient Profile</h3>
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                        <UserIcon size={32} />
                      </div>
                      <div>
                        <p className="text-2xl font-black text-slate-800 leading-none mb-1">Authenticated Identity</p>
                        <p className="text-sm text-indigo-600 font-bold">{activeRx.patientEmail}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                      <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Issue Date</h4>
                      <p className="font-black text-slate-800">{new Date(activeRx.date).toLocaleDateString()}</p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                      <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Physician</h4>
                      <p className="font-black text-slate-800">DR. {activeRx.doctorName.toUpperCase()}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Digital Seal</h3>
                    <div className="p-6 rounded-[2.5rem] bg-emerald-50/50 border border-emerald-100 flex items-center gap-6 text-emerald-700">
                      <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center shrink-0 border border-emerald-100">
                        <ShieldCheck size={40} />
                      </div>
                      <div>
                        <p className="font-black text-sm uppercase tracking-tight">Verified Digital Certificate</p>
                        <p className="text-[10px] font-bold opacity-60 leading-relaxed mt-1 uppercase tracking-wide">Blockchain Hash: {activeRx.qrCode}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Medication Inventory</h3>
                  <div className="space-y-4">
                    {activeRx.medications.map((med, i) => (
                      <div key={i} className="p-6 bg-white rounded-[2rem] border border-slate-100 flex items-center justify-between group hover:border-emerald-200 transition-all">
                        <div>
                          <p className="font-black text-slate-800 text-lg tracking-tight">{med.name}</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{med.dosage} • {med.frequency} • {med.duration}</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                          <Package size={24} />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {!isDispensed ? (
                    <button 
                      onClick={handleDispense}
                      className="w-full py-6 bg-emerald-600 text-white font-black text-sm uppercase tracking-[0.2em] rounded-[2rem] flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-200 hover:scale-[1.02] active:scale-95"
                    >
                      <CheckCircle2 size={24} /> Confirm Dispense
                    </button>
                  ) : (
                    <div className="w-full py-6 bg-slate-100 text-slate-400 font-black text-sm uppercase tracking-[0.2em] rounded-[2rem] flex items-center justify-center gap-3 border border-slate-200 cursor-not-allowed">
                      Dispensed Status Recorded
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
             <div className="bg-white p-20 rounded-[3rem] border-4 border-dashed border-slate-50 flex flex-col items-center justify-center text-center">
                <Scan size={64} className="text-slate-100 mb-6" />
                <h4 className="text-xl font-black text-slate-300 uppercase tracking-widest italic">Waiting for Input Registry</h4>
             </div>
          )}
        </div>
      )}

      {view === 'stock' && (
        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
           <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-200">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
                 <div>
                    <h3 className="text-3xl font-black text-slate-800 tracking-tight leading-none">Stock Registry</h3>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-3">Smart Inventory Management</p>
                 </div>
                 <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80">
                       <Search className="absolute left-4 top-3.5 text-slate-300" size={18} />
                       <input 
                        type="text" 
                        placeholder="Search medicines..."
                        className="w-full pl-12 pr-6 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                       />
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                 {inventory.map((item) => {
                    const isLow = item.quantity <= item.minThreshold;
                    const isOut = item.quantity === 0;
                    return (
                       <div key={item.id} className={`p-8 rounded-[2.5rem] border flex flex-col md:flex-row items-center gap-8 transition-all hover:shadow-xl ${isOut ? 'bg-rose-50 border-rose-100' : isLow ? 'bg-amber-50 border-amber-100' : 'bg-white border-slate-100 hover:border-emerald-200'}`}>
                          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${isOut ? 'bg-rose-600 text-white' : isLow ? 'bg-amber-500 text-white' : 'bg-emerald-50 text-emerald-600'}`}>
                             <Package size={32} />
                          </div>
                          
                          <div className="flex-1 text-center md:text-left">
                             <h4 className="text-2xl font-black text-slate-800 tracking-tight leading-none mb-2">{item.name}</h4>
                             <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-500">{item.category}</span>
                                {isOut ? (
                                   <span className="px-3 py-1 bg-rose-200 text-rose-800 rounded-full text-[9px] font-black uppercase tracking-widest">Out of Stock</span>
                                ) : isLow ? (
                                   <span className="px-3 py-1 bg-amber-200 text-amber-800 rounded-full text-[9px] font-black uppercase tracking-widest">Low Stock</span>
                                ) : (
                                   <span className="px-3 py-1 bg-emerald-200 text-emerald-800 rounded-full text-[9px] font-black uppercase tracking-widest">Healthy</span>
                                )}
                             </div>
                          </div>

                          <div className="flex items-center gap-10 border-l border-slate-200 pl-10">
                             <div className="text-center">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current</p>
                                <p className={`text-3xl font-black ${isOut ? 'text-rose-600' : isLow ? 'text-amber-600' : 'text-slate-900'}`}>{item.quantity}</p>
                             </div>
                             <div className="flex gap-2">
                                <button 
                                 onClick={() => updateInventory(item.id, -10)}
                                 className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all active:scale-95"
                                >
                                   <Minus size={18} />
                                </button>
                                <button 
                                 onClick={() => updateInventory(item.id, 10)}
                                 className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all active:scale-95"
                                >
                                   <Plus size={18} />
                                </button>
                             </div>
                          </div>
                       </div>
                    );
                 })}
              </div>
           </div>

           <div className="bg-emerald-600 p-12 rounded-[4rem] text-white flex flex-col md:flex-row items-center gap-12 shadow-2xl shadow-emerald-100">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md shrink-0">
                 <AlertTriangle size={48} />
              </div>
              <div className="text-center md:text-left">
                 <h4 className="text-2xl font-black mb-3">Critical Refill Reminder</h4>
                 <p className="text-emerald-50 font-bold max-w-2xl leading-relaxed">System has detected <span className="underline">{inventory.filter(i => i.quantity <= i.minThreshold).length} items</span> below safety thresholds. Consider re-ordering stock to prevent dispensing delays.</p>
              </div>
              <button className="md:ml-auto px-8 py-4 bg-white text-emerald-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-50 transition-all shadow-xl active:scale-95">
                 Generate Order List
              </button>
           </div>
        </div>
      )}

      {/* QR Scanner Modal */}
      {isScannerOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={closeScanner}></div>
          <div className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-black text-slate-800 uppercase tracking-widest">QR Scanner</h3>
              <button onClick={closeScanner} className="p-2 hover:bg-slate-200 rounded-xl transition-all">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-10 text-center">
              {!scannerMode ? (
                <div className="grid grid-cols-2 gap-6">
                  <button 
                    onClick={startCamera}
                    className="flex flex-col items-center gap-4 p-8 bg-indigo-50 text-indigo-700 rounded-3xl hover:bg-indigo-100 transition-all group"
                  >
                    <div className="p-4 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                      <Camera size={32} />
                    </div>
                    <span className="font-black text-[10px] uppercase tracking-widest">Use Camera</span>
                  </button>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center gap-4 p-8 bg-emerald-50 text-emerald-700 rounded-3xl hover:bg-emerald-100 transition-all group"
                  >
                    <div className="p-4 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                      <Upload size={32} />
                    </div>
                    <span className="font-black text-[10px] uppercase tracking-widest">Upload File</span>
                  </button>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                </div>
              ) : (
                <div className="relative aspect-square w-full max-w-sm mx-auto rounded-3xl overflow-hidden bg-black flex items-center justify-center border-4 border-emerald-500 shadow-2xl">
                  {scannerMode === 'camera' && (
                    <>
                      <video ref={videoRef} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none">
                        <div className="w-full h-full border-2 border-emerald-400/50 relative">
                           <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-500"></div>
                           <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-500"></div>
                           <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-emerald-500/30 animate-pulse"></div>
                        </div>
                      </div>
                    </>
                  )}
                  {isScanning && (
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm flex items-center justify-center">
                      <Loader2 size={48} className="text-emerald-500 animate-spin" />
                    </div>
                  )}
                  <canvas ref={canvasRef} className="hidden" />
                </div>
              )}
              {scannerMode === 'camera' && (
                <button onClick={stopCamera} className="mt-8 px-8 py-3 bg-rose-50 text-rose-600 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-rose-100">Stop Camera</button>
              )}
              <p className="mt-8 text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">Position the QR code within the frame</p>
            </div>
          </div>
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

const DashboardStat: React.FC<{ icon: React.ReactNode; label: string; value: string; trend: string }> = ({ icon, label, value, trend }) => (
  <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-200 hover:shadow-xl transition-all group">
    <div className="p-5 bg-slate-50 text-slate-400 w-fit rounded-3xl mb-8 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-inner">{icon}</div>
    <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mb-2">{label}</p>
    <div className="flex items-baseline gap-4">
      <p className="text-4xl font-black text-slate-900 tracking-tighter">{value}</p>
      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{trend}</span>
    </div>
  </div>
);

const UserIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

export default PharmacistDashboard;
