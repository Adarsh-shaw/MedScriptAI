
import { Prescription, User, UserRole, PrescriptionStatus } from '../types';

const STORAGE_KEYS = {
  PRESCRIPTIONS: 'medscript_prescriptions',
  USERS: 'medscript_users',
};

const seedData = () => {
  const existingUsers = localStorage.getItem(STORAGE_KEYS.USERS);
  if (!existingUsers) {
    const users: User[] = [
      { id: '1', name: 'Dr. Wilson', role: UserRole.DOCTOR, email: 'doctor@medscript.com', specialty: 'General Physician' },
      { id: '2', name: 'John Patient', role: UserRole.PATIENT, email: 'patient@gmail.com', phone: '+91 9876543210' },
      { id: '3', name: 'Pharma Hub', role: UserRole.PHARMACIST, email: 'pharmacist@medscript.com' },
      { id: '4', name: 'Admin', role: UserRole.ADMIN, email: 'admin@medscript.com' },
    ];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }
};

seedData();

export const db = {
  getUsers: (): User[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]'),
  
  getUserByEmail: (email: string, role: UserRole): User | undefined => {
    const users = db.getUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.role === role);
  },

  addUser: (user: User) => {
    const users = db.getUsers();
    users.push(user);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  deleteUser: (id: string) => {
    const users = db.getUsers().filter(u => u.id !== id);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  getPrescriptions: (): Prescription[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.PRESCRIPTIONS) || '[]'),
  
  savePrescription: (prescription: Prescription) => {
    const list = db.getPrescriptions();
    list.unshift(prescription);
    localStorage.setItem(STORAGE_KEYS.PRESCRIPTIONS, JSON.stringify(list));
  },

  updatePrescription: (id: string, updates: Partial<Prescription>) => {
    const list = db.getPrescriptions();
    const index = list.findIndex(p => p.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.PRESCRIPTIONS, JSON.stringify(list));
    }
  },

  getPatientHistory: (email: string) => {
    return db.getPrescriptions().filter(p => p.patientEmail.toLowerCase() === email.toLowerCase());
  },

  getDoctorRecords: (email: string) => {
    return db.getPrescriptions().filter(p => p.doctorEmail.toLowerCase() === email.toLowerCase());
  }
};
