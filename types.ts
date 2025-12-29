
export enum UserRole {
  ADMIN = 'ADMIN',
  DOCTOR = 'DOCTOR',
  PATIENT = 'PATIENT',
  PHARMACIST = 'PHARMACIST'
}

export enum PrescriptionStatus {
  PENDING = 'PENDING',
  DISPENSED = 'DISPENSED',
  CANCELED = 'CANCELED'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  specialty?: string;
  phone?: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string; // e.g., "1-0-1"
  duration: string;
  instructions: string;
  reminderSent?: boolean;
}

export interface Prescription {
  id: string;
  patientEmail: string;
  doctorId: string;
  doctorName: string;
  doctorEmail: string;
  date: string;
  diagnosis: string;
  medications: Medication[];
  status: PrescriptionStatus;
  notes?: string;
  qrCode: string;
}

export interface DrugInteraction {
  severity: 'low' | 'moderate' | 'high';
  description: string;
  recommendation: string;
}
