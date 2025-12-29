#  Digital Prescription Management System  
**Track:** Frostbite Solutions – Social Impact & Accessibility  
**Difficulty:** Easy–Moderate  

---

##  Problem Statement

In India, handwritten medical prescriptions are still the norm. This practice leads to multiple critical issues such as:

- Medication errors due to illegible handwriting  
- Loss of patient medical history when switching doctors  
- Difficulty in tracking chronic medication adherence  
- Prescription fraud and duplication  
- Rural patients forgetting prescription details between pharmacy visits  

These problems reduce healthcare efficiency and increase health risks, especially for elderly and rural populations.

---

## Mission & Solution

The **Digital Prescription Management System** is a web-based platform that allows doctors to generate **secure, digital prescriptions** while maintaining complete patient medication history.

### Key Goals:
- Improve prescription clarity and safety  
- Prevent prescription fraud using QR verification  
- Enable patients to access their prescription history anytime  
- Assist pharmacists in verifying authentic prescriptions  
- Enhance medication adherence through reminders  

---

## Features

### Doctor Portal
- Create digital prescriptions using dropdown medication database  
- Automatic patient medical history tracking  
- Drug interaction and allergy warnings  
- Generate secure QR codes for every prescription  

### Patient Portal
- View complete prescription and treatment history  
- Receive medication reminders via email or web notifications  
- Easy-to-understand dosage and timing instructions  

### Pharmacist Verification
- Scan QR code to verify prescription authenticity  
- Prevent fake or altered prescriptions  

###  Security & Privacy
- Encrypted data storage  
- Secure authentication for doctors and patients  
- Role-based access control  
- Compliance with healthcare data protection standards  

---

## Technical Stack

### Frontend
- HTML, CSS, JavaScript  
- React.js (optional for scalability)  
- QR Code Generation: `qrcode.js`, `qrcode-generator`

### Backend
- Node.js + Express.js  
- RESTful APIs  

### Database
- MongoDB / PostgreSQL  
- Structured patient & prescription records  

### APIs & Integrations
- Drug Database: OpenFDA / RxNorm  
- Email Notifications: SMTP / EmailJS  
- Web Push Notifications  

### Optional Enhancements
- OCR for digitizing handwritten prescriptions  
- Mobile-first Progressive Web App (PWA)  
- Multi-language support for rural accessibility  

## Workflow
1. Doctor logs in securely
2. Creates a digital prescription
3. System checks drug interactions
4. Prescription is stored and QR code is generated
5. Patient receives reminder notifications
6. Pharmacist scans QR code to verify authenticity

## Installation
git clone https://github.com/Adarsh-shaw/MedScriptAI
cd digital-prescription-system
npm install
npm start

## Social Impact
- Reduces medical errors
- Prevents prescription fraud
- Improves continuity of care
- Supports rural and elderly patients
- Encourages digital healthcare adoption in India

## Future Scope
- AI-based dosage recommendations
- WhatsApp/SMS reminders
- Blockchain-based prescription storage
- Multi-language support
- Government hospital integration

## License
MIT License

Built with ❤️ for accessible, secure, and transparent healthcare.
