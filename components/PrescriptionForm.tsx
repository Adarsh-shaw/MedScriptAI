
import React, { useState, useRef } from 'react';
import { Medication, User, Prescription, DrugInteraction, PrescriptionStatus } from '../types';
import { Plus, Trash2, AlertTriangle, CheckCircle, Search, FileUp, Loader2, Mail } from 'lucide-react';
import { checkDrugInteractions, digitizeHandwrittenPrescription } from '../services/gemini';
import { db } from '../services/db';

interface PrescriptionFormProps {
  doctor: User;
  onSuccess: () => void;
  initialMeds?: Medication[];
}

const PrescriptionForm: React.FC<PrescriptionFormProps> = ({ doctor, onSuccess, initialMeds }) => {
  const [patientEmail, setPatientEmail] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [meds, setMeds] = useState<Medication[]>(initialMeds || [
    { name: '', dosage: '', frequency: '', duration: '', instructions: '' }
  ]);
  const [interactions, setInteractions] = useState<DrugInteraction[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addMed = () => setMeds([...meds, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
  const removeMed = (index: number) => setMeds(meds.filter((_, i) => i !== index));

  // Fix: Use type assertion to avoid "string not assignable to never" when updating Medication fields
  const updateMed = (index: number, field: keyof Medication, value: string) => {
    const updated = [...meds];
    (updated[index] as any)[field] = value;
    setMeds(updated);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(',')[1];
      const extractedMeds = await digitizeHandwrittenPrescription(base64);
      if (extractedMeds && extractedMeds.length > 0) {
        setMeds(extractedMeds);
      }
      setIsScanning(false);
    };
    reader.readAsDataURL(file);
  };

  const checkAI = async () => {
    setIsChecking(true);
    const results = await checkDrugInteractions(meds.filter(m => m.name.length > 2));
    setInteractions(results);
    setIsChecking(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const newPrescription: Prescription = {
      id: `RX-${Date.now()}`,
      patientEmail,
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorEmail: doctor.email,
      date: new Date().toISOString(),
      diagnosis,
      medications: meds,
      status: PrescriptionStatus.PENDING,
      qrCode: `VERIFY-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    };

    db.savePrescription(newPrescription);
    
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess();
    }, 800);
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-xl font-black text-slate-800 tracking-tight">Generate Digital Prescription</h3>
          <p className="text-sm text-slate-500 font-medium">Map this record to a patient's medical vault via email.</p>
        </div>
        <div className="flex gap-2">
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isScanning}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-50 text-indigo-700 font-bold rounded-xl hover:bg-indigo-100 transition-colors border border-indigo-200"
          >
            {isScanning ? <Loader2 size={18} className="animate-spin" /> : <FileUp size={18} />}
            {isScanning ? "Digitizing..." : "AI OCR Digitizer"}
          </button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Patient Identifier</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-slate-400" size={18} />
              <input 
                type="email" 
                required
                placeholder="Patient's Gmail Address"
                value={patientEmail}
                onChange={e => setPatientEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
              />
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Clinical Diagnosis</label>
            <input 
              required
              value={diagnosis}
              onChange={e => setDiagnosis(e.target.value)}
              placeholder="e.g. Acute Respiratory Infection"
              className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-black text-indigo-900 uppercase tracking-widest">Medication Inventory</h4>
            <button 
              type="button" 
              onClick={addMed}
              className="flex items-center gap-2 text-xs text-indigo-600 font-black hover:bg-indigo-50 px-4 py-2 rounded-xl transition-all border border-indigo-100"
            >
              <Plus size={16} /> Add Medicine
            </button>
          </div>

          <div className="space-y-4">
            {meds.map((med, idx) => (
              <div key={idx} className="group p-6 bg-slate-50 rounded-3xl border border-slate-100 relative hover:border-indigo-100 transition-all">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="md:col-span-1">
                    <input 
                      placeholder="Name"
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold"
                      value={med.name}
                      onChange={e => updateMed(idx, 'name', e.target.value)}
                    />
                  </div>
                  <div>
                    <input 
                      placeholder="Dosage (mg/ml)"
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold"
                      value={med.dosage}
                      onChange={e => updateMed(idx, 'dosage', e.target.value)}
                    />
                  </div>
                  <div>
                    <input 
                      placeholder="Freq (1-0-1)"
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold"
                      value={med.frequency}
                      onChange={e => updateMed(idx, 'frequency', e.target.value)}
                    />
                  </div>
                  <div>
                    <input 
                      placeholder="Days"
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold"
                      value={med.duration}
                      onChange={e => updateMed(idx, 'duration', e.target.value)}
                    />
                  </div>
                </div>
                <textarea 
                  placeholder="Specific intake instructions..."
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  value={med.instructions}
                  onChange={e => updateMed(idx, 'instructions', e.target.value)}
                  rows={1}
                />
                {meds.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => removeMed(idx)}
                    className="absolute -right-2 -top-2 p-2 bg-red-50 text-red-600 rounded-full border border-red-100 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {interactions.length > 0 && (
          <div className="p-6 bg-amber-50 border border-amber-200 rounded-3xl space-y-3">
            <div className="flex items-center gap-2 text-amber-800 font-black text-sm uppercase">
              <AlertTriangle size={20} /> AI Interaction Warning
            </div>
            {interactions.map((int, i) => (
              <div key={i} className="text-sm border-l-4 border-amber-400 pl-4 py-1">
                <p className="font-bold text-amber-900 capitalize">{int.severity} risk detected</p>
                <p className="text-amber-800 text-xs">{int.description}</p>
                <p className="text-amber-700 italic mt-1 font-bold">💡 {int.recommendation}</p>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button 
            type="button"
            disabled={isChecking || meds.some(m => !m.name)}
            onClick={checkAI}
            className="px-8 py-4 bg-emerald-600 text-white font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-3 transition-all shadow-lg shadow-emerald-100"
          >
            {isChecking ? "Analysing..." : "AI Safety Check"}
            {!isChecking && <CheckCircle size={18} />}
          </button>
          <button 
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-8 py-4 bg-indigo-600 text-white font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-xl shadow-indigo-100"
          >
            {isSubmitting ? "Generating Vault Record..." : "Issue Digital Prescription"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PrescriptionForm;
