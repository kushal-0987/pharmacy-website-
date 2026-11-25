import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Role,
  UserProfile,
  UserAccount,
  HealthcareProvider,
  LabTest,
  HealthPackage,
  Medicine,
  Appointment,
  MedicineEnquiry,
  DeliveryRequest,
  LabReport,
  HealthArticle,
  AuditLogEntry,
  NotificationItem,
} from '@/types/healthcare';
import {
  hashPassword,
  verifyPassword,
  generateSalt,
  generateTempPassword,
} from '@/lib/auth-crypto';

// Seed User Accounts with cryptographically hashed passwords
export const SEED_USERS: UserAccount[] = [
  {
    id: 'usr-admin-1',
    fullName: 'Kushal Pokhrel',
    username: 'kushal',
    email: 'kushal@twobrothershealthcare.com',
    phone: '9841234567',
    role: 'admin',
    passwordSalt: 'tbh_salt_2026',
    passwordHash: '190e612043da84ea5a75a6eafb30c40a5b6b0e2e9bf820eacf5ef934b9ef1ff8', // Admin@123
    status: 'active',
    createdAt: '2026-01-01T08:00:00.000Z',
    updatedAt: '2026-01-01T08:00:00.000Z',
  },
  {
    id: 'usr-patient-1',
    fullName: 'Bikash',
    username: 'bikash',
    email: 'bikash@twobrothershealthcare.com',
    phone: '9851098765',
    role: 'patient',
    passwordSalt: 'tbh_salt_2026',
    passwordHash: 'e960438bd13e8f5f6c31e700ee4fe6cabe5cafedd68b18bff53c12f8c29e9c39', // Patient@123
    status: 'active',
    createdAt: '2026-01-02T09:00:00.000Z',
    updatedAt: '2026-01-02T09:00:00.000Z',
  },
  {
    id: 'usr-doctor-1',
    fullName: 'Dr. Suresh Shrestha',
    username: 'drsuresh',
    email: 'suresh@twobrothershealthcare.com',
    phone: '9801234560',
    role: 'doctor',
    passwordSalt: 'tbh_salt_2026',
    passwordHash: '4205037293c5bc3a438321d4a218039ae3e87e15bf311410186d49256de60437', // Doctor@123
    status: 'active',
    createdAt: '2026-01-02T09:30:00.000Z',
    updatedAt: '2026-01-02T09:30:00.000Z',
  },
  {
    id: 'usr-pharm-1',
    fullName: 'Ph. Manish Shrestha',
    username: 'phmanish',
    email: 'manish@twobrothershealthcare.com',
    phone: '9801234561',
    role: 'pharmacist',
    passwordSalt: 'tbh_salt_2026',
    passwordHash: '5a922cf5279779decf10f51465ffd34bd1ebccabe2a6f22be4a05fd8002d2bb6', // Pharma@123
    status: 'active',
    createdAt: '2026-01-02T10:00:00.000Z',
    updatedAt: '2026-01-02T10:00:00.000Z',
  },
  {
    id: 'usr-lab-1',
    fullName: 'Rohan Shakya',
    username: 'rohan',
    email: 'rohan@twobrothershealthcare.com',
    phone: '9801234562',
    role: 'lab_staff',
    passwordSalt: 'tbh_salt_2026',
    passwordHash: '50439017a7fa163358bf90d5985969cc16822b5543a5b38fa64eba161f7f4a77', // Lab@123
    status: 'active',
    createdAt: '2026-01-02T10:30:00.000Z',
    updatedAt: '2026-01-02T10:30:00.000Z',
  },
  {
    id: 'usr-recept-1',
    fullName: 'Puja Joshi',
    username: 'puja',
    email: 'puja@twobrothershealthcare.com',
    phone: '9801234563',
    role: 'receptionist',
    passwordSalt: 'tbh_salt_2026',
    passwordHash: '1c0e47f930186901d094b5034a0f64cec7c9b99e5e202445739f15f897bee9e4', // Front@123
    status: 'active',
    createdAt: '2026-01-02T11:00:00.000Z',
    updatedAt: '2026-01-02T11:00:00.000Z',
  },
  {
    id: 'usr-delivery-1',
    fullName: 'Prakash Tamang',
    username: 'prakash',
    email: 'prakash@twobrothershealthcare.com',
    phone: '9801234564',
    role: 'delivery',
    passwordSalt: 'tbh_salt_2026',
    passwordHash: 'cb58d85667e78fcd2772312329c7e973ed248a8bd0f33843979e48a9e2c29dd4', // Rider@123
    status: 'active',
    createdAt: '2026-01-02T11:30:00.000Z',
    updatedAt: '2026-01-02T11:30:00.000Z',
  },
];

// Seed Doctors
const SEED_PROVIDERS: HealthcareProvider[] = [
  {
    id: 'doc-1',
    name: 'Dr. Suresh Shrestha',
    title: 'Senior Consultant Physician',
    qualifications: 'MBBS, MD (Internal Medicine, TUTH)',
    registrationNumber: 'NMC #4829',
    specialties: ['Internal Medicine', 'Diabetes & Hypertension', 'Geriatric Care'],
    experienceYears: 14,
    languages: ['Nepali', 'English', 'Newari'],
    consultationFee: 700,
    photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    rating: 4.9,
    reviewCount: 124,
    availableDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    availableTimeSlots: ['08:00 AM', '09:00 AM', '10:00 AM', '04:00 PM', '05:00 PM', '06:00 PM'],
    verified: true,
    department: 'General & Internal Medicine',
  },
  {
    id: 'doc-2',
    name: 'Dr. Anjana Karki',
    title: 'Consultant Gynecologist & Obstetrician',
    qualifications: 'MBBS, MS (OB/GYN, KMC)',
    registrationNumber: 'NMC #6210',
    specialties: ["Women's Health", 'Antenatal Care', 'Infertility Counselling'],
    experienceYears: 11,
    languages: ['Nepali', 'English'],
    consultationFee: 800,
    photoUrl: 'https://images.unsplash.com/photo-1594824813568-16ef78486588?auto=format&fit=crop&q=80&w=400',
    rating: 4.95,
    reviewCount: 98,
    availableDays: ['Sunday', 'Tuesday', 'Thursday', 'Saturday'],
    availableTimeSlots: ['11:00 AM', '12:00 PM', '01:00 PM', '03:00 PM'],
    verified: true,
    department: 'Obstetrics & Gynecology',
  },
  {
    id: 'doc-3',
    name: 'Dr. Rabin Maharjan',
    title: 'Consultant Pediatrician',
    qualifications: 'MBBS, MD (Pediatrics, Kanti Children Hospital)',
    registrationNumber: 'NMC #7542',
    specialties: ['Childhood Illnesses', 'Vaccination', 'Growth & Nutrition'],
    experienceYears: 9,
    languages: ['Nepali', 'English', 'Newari'],
    consultationFee: 650,
    photoUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
    rating: 4.88,
    reviewCount: 156,
    availableDays: ['Sunday', 'Monday', 'Wednesday', 'Friday', 'Saturday'],
    availableTimeSlots: ['09:30 AM', '10:30 AM', '02:00 PM', '04:30 PM'],
    verified: true,
    department: 'Pediatrics & Child Care',
  },
  {
    id: 'doc-4',
    name: 'Dr. Bikram Thapa',
    title: 'Cardiology Associate & Fellow',
    qualifications: 'MBBS, MD, Fellowship in Non-invasive Cardiology',
    registrationNumber: 'NMC #8911',
    specialties: ['Preventive Cardiology', 'ECG & Echo Review', 'Cholesterol Management'],
    experienceYears: 8,
    languages: ['Nepali', 'English', 'Hindi'],
    consultationFee: 900,
    photoUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
    rating: 4.92,
    reviewCount: 76,
    availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
    availableTimeSlots: ['03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'],
    verified: true,
    department: 'Cardiology',
  },
];

// Seed Lab Tests
const SEED_LAB_TESTS: LabTest[] = [
  {
    id: 'lab-1',
    name: 'Complete Blood Count (CBC) with ESR',
    category: 'Blood',
    sampleType: 'Whole Blood (EDTA)',
    preparationNotes: 'No fasting required. Hydration recommended.',
    turnaroundTime: '2 - 3 Hours',
    price: 450,
    description: 'Measures RBC, WBC, Platelets, Hemoglobin, and indices to evaluate infections and anemia.',
    commonBundleId: 'bundle-basic',
  },
  {
    id: 'lab-2',
    name: 'Fasting Blood Glucose (FBS) & HbA1c',
    category: 'Biochemistry',
    sampleType: 'Serum / Fluoride Plasma',
    preparationNotes: 'Strict 10-12 hours overnight fasting required. Water is allowed.',
    turnaroundTime: '3 Hours',
    price: 950,
    description: 'Evaluates immediate glycemic level and estimated 3-month average blood glucose control.',
    commonBundleId: 'bundle-diabetes',
  },
  {
    id: 'lab-3',
    name: 'Lipid Profile (Cholesterol, HDL, LDL, Triglycerides)',
    category: 'Biochemistry',
    sampleType: 'Serum',
    preparationNotes: '12-hour fasting strictly advised. Avoid alcohol 24 hours prior.',
    turnaroundTime: '4 Hours',
    price: 850,
    description: 'Assesses cardiovascular risk and cholesterol balance.',
  },
  {
    id: 'lab-4',
    name: 'Liver Function Test (LFT - SGPT, SGOT, Bilirubin, Protein)',
    category: 'Biochemistry',
    sampleType: 'Serum',
    preparationNotes: '8-10 hours fasting preferred.',
    turnaroundTime: '4 Hours',
    price: 800,
    description: 'Screening for hepatic enzymes, jaundice, and protein synthesis efficiency.',
  },
  {
    id: 'lab-5',
    name: 'Renal Function Test (KFT - Urea, Creatinine, Electrolytes, Uric Acid)',
    category: 'Biochemistry',
    sampleType: 'Serum',
    preparationNotes: 'Normal diet, adequate hydration.',
    turnaroundTime: '3 Hours',
    price: 900,
    description: 'Screens kidney filtration, urea clearance, and serum electrolyte balances.',
  },
  {
    id: 'lab-6',
    name: 'Thyroid Function Test (FT3, FT4, TSH)',
    category: 'Blood',
    sampleType: 'Serum',
    preparationNotes: 'Morning sample preferred before taking daily thyroid medications.',
    turnaroundTime: 'Same Day (6 Hours)',
    price: 1200,
    description: 'Evaluates hyperthyroidism, hypothyroidism, and hormonal metabolism.',
  },
  {
    id: 'lab-7',
    name: 'Routine & Microscopic Urine Examination',
    category: 'Urine',
    sampleType: 'Midstream Urine',
    preparationNotes: 'Clean-catch first morning midstream urine specimen.',
    turnaroundTime: '1 - 2 Hours',
    price: 250,
    description: 'Detects urinary tract infections, protein leakage, glucose, and micro-crystalluria.',
  },
  {
    id: 'lab-8',
    name: '12-Lead Electrocardiogram (ECG)',
    category: 'Cardiac',
    sampleType: 'Non-invasive Cardiac Trace',
    preparationNotes: 'Rest comfortably 10 minutes before recording. Wear easily openable garments.',
    turnaroundTime: 'Immediate (15 Minutes)',
    price: 500,
    description: 'Direct recording of heart electrical impulses to identify arrhythmias and ischemic changes.',
  },
];

// Seed Health Packages
const SEED_PACKAGES: HealthPackage[] = [
  {
    id: 'pkg-1',
    name: 'Essential Wellness Checkup',
    slug: 'essential-wellness',
    category: 'Basic',
    tagline: 'Ideal annual baseline screen for working adults and young individuals.',
    price: 1850,
    originalPrice: 2450,
    testCount: 22,
    durationMinutes: 45,
    includedTests: [
      'Complete Blood Count (CBC)',
      'Fasting Blood Sugar (FBS)',
      'Lipid Profile Screen',
      'Urine Routine & Microscopic',
      'General Physician Consultation & Vitals',
    ],
    exclusions: ['Cardiac Echo', 'Ultrasound'],
    preparationNotes: 'Requires 10-12 hours overnight fasting. Complimentary morning herbal tea provided.',
    targetAudience: 'Men & women aged 18 - 45 seeking annual wellness validation.',
    badge: 'Popular',
  },
  {
    id: 'pkg-2',
    name: 'Comprehensive Executive Health Panel',
    slug: 'executive-panel',
    category: 'Comprehensive',
    tagline: 'Deep metabolic, cardiac, liver, and kidney evaluation for busy professionals.',
    price: 4500,
    originalPrice: 6200,
    testCount: 48,
    durationMinutes: 75,
    includedTests: [
      'CBC + ESR',
      'HbA1c & Fasting Glucose',
      'Full Lipid Profile',
      'Complete Liver Function (LFT)',
      'Complete Kidney Function (KFT & Electrolytes)',
      'Thyroid Screen (TSH)',
      '12-Lead Resting ECG',
      'Uric Acid & Urine Analysis',
      'Comprehensive Doctor Review & Diet Plan',
    ],
    exclusions: ['MRI', 'CT Scan'],
    preparationNotes: '12-hour fasting. Arrive between 7:00 AM - 9:30 AM.',
    targetAudience: 'Individuals aged 35+ seeking an in-depth clinical overview.',
    badge: 'Best Value',
  },
  {
    id: 'pkg-3',
    name: 'Senior Citizen Care & Vitality Package',
    slug: 'senior-care',
    category: 'Senior',
    tagline: 'Gentle, attentive assessment designed specifically for parents and elders.',
    price: 3800,
    originalPrice: 5100,
    testCount: 36,
    durationMinutes: 60,
    includedTests: [
      'CBC + Hemoglobin Assessment',
      'Fasting & Post-Prandial Glucose',
      'Kidney & Liver Function Tests',
      'Calcium & Bone Health Indicator',
      'Uric Acid (Gout Check)',
      'ECG 12-Lead Cardiac Screening',
      'Urine Routine',
      'Geriatrician / Senior Physician Consultation',
    ],
    exclusions: ['DEXA Scan'],
    preparationNotes: 'Assisted priority queue at the clinic or free home sample collection in Lalitpur.',
    targetAudience: 'Seniors aged 60+ requiring comfortable monitoring.',
    badge: 'Recommended for Parents',
  },
  {
    id: 'pkg-4',
    name: 'Women’s Wellness & Hormonal Balance',
    slug: 'womens-wellness',
    category: 'Women',
    tagline: 'Tailored diagnostics for hormonal health, bone density risk, and anemia.',
    price: 3600,
    originalPrice: 4800,
    testCount: 30,
    durationMinutes: 60,
    includedTests: [
      'CBC (Iron Deficiency & Anemia Check)',
      'Thyroid Panel (FT3, FT4, TSH)',
      'Fasting Blood Glucose',
      'Serum Calcium & Uric Acid',
      'Urine Culture & Sensitivity Screen',
      'Consultation with Consultant Gynecologist',
    ],
    exclusions: ['Mammogram'],
    preparationNotes: 'Fasting 10 hours. Comfortable consultation in private clinic suite.',
    targetAudience: 'Women of all age groups prioritizing preventive reproductive & metabolic health.',
  },
  {
    id: 'pkg-5',
    name: 'Diabetes & Cardiac Watch Package',
    slug: 'diabetes-cardiac-watch',
    category: 'Specialized',
    tagline: 'Focused monitoring for individuals managing hypertension or blood sugar.',
    price: 2900,
    originalPrice: 3850,
    testCount: 28,
    durationMinutes: 45,
    includedTests: [
      'HbA1c & Fasting Glucose',
      'Lipid Profile (LDL, HDL, Triglycerides)',
      'Serum Creatinine & Microalbuminuria',
      '12-Lead ECG with Cardiologist Review',
      'Blood Pressure Mapping & BMI Consultation',
    ],
    exclusions: ['Stress Echo'],
    preparationNotes: 'Fasting 12 hours. Bring current medication prescription.',
    targetAudience: 'Patients with existing or suspected diabetic or cardiac risk factors.',
  },
];

// Seed Medicines
const SEED_MEDICINES: Medicine[] = [
  {
    id: 'med-1',
    name: 'Niko Paracetamol 500mg',
    genericName: 'Paracetamol',
    strength: '500mg',
    form: 'Tablet',
    manufacturer: 'Nepal Pharmaceuticals Lab (NPL)',
    prescriptionRequired: false,
    price: 20,
    inStock: true,
    stockCount: 850,
    category: 'Pain Relief & Fever',
    dosageGuidelines: '1 tablet every 6 hours as needed for fever or mild pain.',
  },
  {
    id: 'med-2',
    name: 'Cifran 500 (Ciprofloxacin)',
    genericName: 'Ciprofloxacin Hydrochloride',
    strength: '500mg',
    form: 'Tablet',
    manufacturer: 'Sun Pharma Nepal',
    prescriptionRequired: true,
    price: 180,
    inStock: true,
    stockCount: 140,
    category: 'Antibiotics',
    dosageGuidelines: 'Strictly as prescribed by a licensed doctor. Complete the full course.',
  },
  {
    id: 'med-3',
    name: 'Pantocid 40 (Pantoprazole)',
    genericName: 'Pantoprazole Sodium',
    strength: '40mg',
    form: 'Tablet',
    manufacturer: 'Sun Pharma',
    prescriptionRequired: false,
    price: 120,
    inStock: true,
    stockCount: 420,
    category: 'Acidity & Gastrointestinal',
    dosageGuidelines: '1 tablet once daily in the morning 30 minutes before breakfast.',
  },
  {
    id: 'med-4',
    name: 'Glycomet-GP 1 (Metformin + Glimepiride)',
    genericName: 'Metformin 500mg + Glimepiride 1mg',
    strength: '500mg / 1mg',
    form: 'Tablet',
    manufacturer: 'USV Nepal',
    prescriptionRequired: true,
    price: 165,
    inStock: true,
    stockCount: 210,
    category: 'Diabetes Care',
    dosageGuidelines: 'Take strictly with breakfast as advised by physician.',
  },
  {
    id: 'med-5',
    name: 'Amlokem 5 (Amlodipine)',
    genericName: 'Amlodipine Besylate',
    strength: '5mg',
    form: 'Tablet',
    manufacturer: 'Alkem Laboratories',
    prescriptionRequired: true,
    price: 95,
    inStock: true,
    stockCount: 310,
    category: 'Cardiovascular & Blood Pressure',
    dosageGuidelines: 'Once daily at a regular scheduled time.',
  },
  {
    id: 'med-6',
    name: 'Cetriz 10mg (Cetirizine)',
    genericName: 'Cetirizine Dihydrochloride',
    strength: '10mg',
    form: 'Tablet',
    manufacturer: 'Deurali-Janta Pharmaceuticals (DJPL)',
    prescriptionRequired: false,
    price: 45,
    inStock: true,
    stockCount: 600,
    category: 'Allergy & Cold',
    dosageGuidelines: '1 tablet in the evening for allergic rhinitis or skin allergy.',
  },
  {
    id: 'med-7',
    name: 'Azithral 500 (Azithromycin)',
    genericName: 'Azithromycin',
    strength: '500mg',
    form: 'Tablet',
    manufacturer: 'Alembic Pharmaceuticals',
    prescriptionRequired: true,
    price: 240,
    inStock: true,
    stockCount: 95,
    category: 'Antibiotics',
    dosageGuidelines: '1 tablet daily 1 hour before or 2 hours after meals for 3-5 days.',
  },
  {
    id: 'med-8',
    name: 'Shelcal 500 (Calcium + Vit D3)',
    genericName: 'Calcium Carbonate 500mg + Vitamin D3 250 IU',
    strength: '500mg',
    form: 'Tablet',
    manufacturer: 'Torrent Pharma',
    prescriptionRequired: false,
    price: 150,
    inStock: true,
    stockCount: 350,
    category: 'Vitamins & Supplements',
    dosageGuidelines: '1 tablet after main meal daily.',
  },
  {
    id: 'med-9',
    name: 'Jeevan Jal (Oral Rehydration Salts)',
    genericName: 'WHO Standard Oral Rehydration Salts',
    strength: '20.5g sachet',
    form: 'Drops',
    manufacturer: 'Nepal Pharmaceuticals Lab',
    prescriptionRequired: false,
    price: 15,
    inStock: true,
    stockCount: 1200,
    category: 'Dehydration & Rehydration',
    dosageGuidelines: 'Dissolve entire sachet in 1 liter of boiled and cooled drinking water.',
  },
];

// Seed Blog Articles
const SEED_ARTICLES: HealthArticle[] = [
  {
    id: 'art-1',
    slug: 'managing-blood-pressure-nepal',
    title: 'Managing High Blood Pressure: Essential Daily Habits for Families in Kathmandu Valley',
    titleNe: 'उच्च रक्तचाप नियन्त्रण: दैनिक जीवनशैली र खानपानका महत्वपूर्ण उपाय',
    category: 'Chronic Conditions',
    excerpt: 'Practical dietary shifts, sodium awareness, and morning monitoring routines to maintain cardiovascular vitality without overwhelming stress.',
    coverImageUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800',
    authorName: 'Dr. Bikram Thapa',
    authorCredentials: 'MBBS, MD (Cardiology)',
    reviewedByDoctor: 'Dr. Suresh Shrestha (Senior Consultant Physician)',
    reviewDate: '2026-10-15',
    publishedDate: '2026-10-18',
    readTimeMinutes: 5,
    contentMarkdown: `
### Understanding Hypertension in Nepal
High blood pressure often develops quietly without obvious distress until it begins straining vital organs. In urban and peri-urban communities across Lalitpur and Kathmandu, dietary shifts towards processed snacks and higher dietary sodium have accelerated hypertension among young adults.

#### Practical Steps to Take Today:
1. **Reduce Salt Intentionally**: Replace excess table salt with fresh lemon, ginger, garlic, and cumin to flavor dal and curries.
2. **Move for 30 Minutes**: A brisk morning walk around Sanagau or your neighborhood courtyard stimulates vascular elasticity.
3. **Regular Monitoring**: Check your blood pressure every fortnight and log readings in your patient portal.
4. **Never Discontinue Prescriptions Abruptly**: If you experience side effects, discuss dosage calibration with your doctor rather than stopping medication on your own.
    `,
  },
  {
    id: 'art-2',
    slug: 'seasonal-flu-prevention-lalitpur',
    title: 'Seasonal Flu vs Viral Infiltration: When to Consult a Pharmacist or Physician',
    titleNe: 'मौसमी रुघाखोकी र भाइरल संक्रमण: कहिले डाक्टरसँग परामर्श लिने?',
    category: 'Seasonal Health',
    excerpt: 'Differentiating self-limiting viral symptoms from bacterial upper respiratory complications, with safe hydration guidelines.',
    coverImageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800',
    authorName: 'Dr. Rabin Maharjan',
    authorCredentials: 'MBBS, MD (Pediatrics)',
    reviewedByDoctor: 'Dr. Anjana Karki (Consultant)',
    reviewDate: '2026-11-02',
    publishedDate: '2026-11-05',
    readTimeMinutes: 4,
    contentMarkdown: `
### Managing Seasonal Transitions Safely
With winter and seasonal changes in the Valley, pediatric and geriatric household members are frequently exposed to viral respiratory pathogens.

#### Key Warnings:
- **Antibiotic Misuse**: Antibiotics have zero efficacy against viral colds. Using amoxicillin or azithromycin without doctor diagnosis builds bacterial resistance.
- **Hydration is Essential**: Warm ginger water, soup broth, and WHO ORS sachets replenish electrolytes lost through low-grade perspiration and fever.
- **When to Seek Immediate Consultation**: Fever exceeding 102°F persisting over 3 days, labored or rapid breathing, or chest tightness.
    `,
  },
  {
    id: 'art-3',
    slug: 'diabetes-fasting-blood-sugar-tips',
    title: 'The Truth About Fasting Blood Sugar: How to Prepare Accurately for Lab Tests',
    titleNe: 'फास्टिङ सुगर परीक्षण: सही र भरपर्दो रिपोर्टका लागि ध्यान दिनुपर्ने कुराहरू',
    category: 'Prevention',
    excerpt: 'Why your fasting window duration matters, what you can drink, and how stress impacts metabolic biomarkers.',
    coverImageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800',
    authorName: 'Dr. Suresh Shrestha',
    authorCredentials: 'MBBS, MD (Internal Medicine)',
    reviewedByDoctor: 'Dr. Suresh Shrestha',
    reviewDate: '2026-11-10',
    publishedDate: '2026-11-12',
    readTimeMinutes: 6,
    contentMarkdown: `
### Accurate Diagnostics Start with Proper Preparation
A laboratory test is only as accurate as the pre-analytical conditions. When patients fast for 18 hours or drink sugary tea by mistake, fasting blood glucose and lipid profile readings skew substantially.

#### Golden Rules for Fasting Tests:
- **Optimal Window**: Strictly 10 to 12 hours. Do not fast longer than 14 hours as the liver begins gluconeogenesis.
- **Water is Allowed**: Plain drinking water does not affect glucose or lipid levels and actually assists the phlebotomist in locating veins smoothly.
- **Morning Timing**: Book your slot between 7:00 AM and 8:30 AM at Two Brothers Healthcare for comfortable morning sampling.
    `,
  },
];

// Seed Appointments
const SEED_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-1',
    referenceId: 'TBH-2026-001',
    patientId: 'usr-patient-1',
    patientName: 'Kushal Sharma',
    patientPhone: '9841234567',
    patientEmail: 'kushal.sharma@example.com',
    serviceType: 'consultation',
    serviceTitle: 'General & Internal Medicine Consultation',
    providerId: 'doc-1',
    providerName: 'Dr. Suresh Shrestha',
    appointmentDate: '2026-11-25',
    timeSlot: '09:00 AM',
    status: 'confirmed',
    reasonForVisit: 'Routine blood pressure review & seasonal allergies',
    totalFee: 700,
    createdAt: '2026-11-23T10:00:00Z',
    updatedAt: '2026-11-23T10:05:00Z',
  },
  {
    id: 'apt-2',
    referenceId: 'TBH-2026-002',
    patientId: 'usr-patient-2',
    patientName: 'Sunita Maharjan',
    patientPhone: '9801987654',
    serviceType: 'lab',
    serviceTitle: 'Lipid Profile & Liver Function Panel',
    appointmentDate: '2026-11-26',
    timeSlot: '07:30 AM',
    status: 'pending',
    reasonForVisit: 'Doctor referral for pre-operative baseline test',
    totalFee: 1650,
    createdAt: '2026-11-23T11:30:00Z',
    updatedAt: '2026-11-23T11:30:00Z',
  },
  {
    id: 'apt-3',
    referenceId: 'TBH-2026-003',
    patientId: 'usr-patient-1',
    patientName: 'Gita Sharma (Mother)',
    patientPhone: '9841234567',
    serviceType: 'package',
    serviceTitle: 'Senior Citizen Care & Vitality Package',
    appointmentDate: '2026-11-28',
    timeSlot: '08:30 AM',
    status: 'confirmed',
    createdForDependent: 'Gita Sharma',
    reasonForVisit: 'Annual senior citizen health checkup',
    totalFee: 3800,
    createdAt: '2026-11-23T12:15:00Z',
    updatedAt: '2026-11-23T12:20:00Z',
  },
];

// Seed Medicine Enquiries
const SEED_ENQUIRIES: MedicineEnquiry[] = [
  {
    id: 'enq-1',
    referenceId: 'MED-2026-042',
    patientName: 'Kushal Sharma',
    phone: '9841234567',
    email: 'kushal.sharma@example.com',
    deliveryType: 'delivery',
    deliveryAddress: 'Sanagau Ward-4, Near Shiva Temple, Lalitpur',
    deliveryZone: 'Lalitpur Zone 1',
    deliveryFee: 60,
    medicineList: [
      { medicineName: 'Pantocid 40mg', quantity: 30, priceQuoted: 120, available: true },
      { medicineName: 'Niko Paracetamol 500mg', quantity: 20, priceQuoted: 40, available: true },
    ],
    status: 'confirmed',
    pharmacistNotes: 'Both medicines are in stock and verified. Delivery dispatched with rider.',
    totalQuoted: 220,
    createdAt: '2026-11-23T09:15:00Z',
  },
  {
    id: 'enq-2',
    referenceId: 'MED-2026-043',
    patientName: 'Ramesh Adhikari',
    phone: '9860112233',
    deliveryType: 'pickup',
    medicineList: [
      { medicineName: 'Amlokem 5mg', quantity: 60, priceQuoted: 190, available: true },
      { medicineName: 'Shelcal 500', quantity: 30, priceQuoted: 150, available: true },
    ],
    status: 'verified',
    pharmacistNotes: 'Prescription verified. Ready for counter pickup between 8 AM - 8 PM.',
    totalQuoted: 340,
    createdAt: '2026-11-23T13:40:00Z',
  },
];

// Seed Deliveries
const SEED_DELIVERIES: DeliveryRequest[] = [
  {
    id: 'del-1',
    referenceId: 'DEL-2026-015',
    enquiryId: 'enq-1',
    patientName: 'Kushal Sharma',
    phone: '9841234567',
    address: 'Sanagau Ward-4, Near Shiva Temple, Lalitpur',
    zone: 'Lalitpur Zone 1 (Sanagau / Gwarko)',
    itemsSummary: 'Pantocid 40 (3 strips), Niko Paracetamol (2 strips)',
    totalAmount: 220,
    status: 'dispatched',
    assignedStaffId: 'staff-delivery-1',
    assignedStaffName: 'Prakash Tamang (Rider #3)',
    estimatedDeliveryTime: '35 mins',
    createdAt: '2026-11-23T14:00:00Z',
    updatedAt: '2026-11-23T14:45:00Z',
  },
];

// Seed Lab Reports & Trends
const SEED_LAB_REPORTS: LabReport[] = [
  {
    id: 'rep-1',
    referenceId: 'REP-2026-881',
    patientId: 'usr-patient-1',
    patientName: 'Kushal Sharma',
    testName: 'Comprehensive Metabolic & Lipid Panel',
    date: '2026-10-10',
    verifiedByDoctor: 'Dr. Suresh Shrestha (NMC #4829)',
    downloadUrl: '#',
    results: [
      { id: 'r1', testName: 'Fasting Blood Glucose', measuredValue: 94, unit: 'mg/dL', normalRange: '70 - 100', status: 'normal' },
      { id: 'r2', testName: 'HbA1c', measuredValue: 5.4, unit: '%', normalRange: '< 5.7', status: 'normal' },
      { id: 'r3', testName: 'Total Cholesterol', measuredValue: 182, unit: 'mg/dL', normalRange: '< 200', status: 'normal' },
      { id: 'r4', testName: 'Triglycerides', measuredValue: 142, unit: 'mg/dL', normalRange: '< 150', status: 'normal' },
      { id: 'r5', testName: 'Serum Creatinine', measuredValue: 0.9, unit: 'mg/dL', normalRange: '0.7 - 1.2', status: 'normal' },
    ],
  },
  {
    id: 'rep-2',
    referenceId: 'REP-2026-614',
    patientId: 'usr-patient-1',
    testName: 'Routine Blood Glucose & HbA1c',
    date: '2026-05-14',
    verifiedByDoctor: 'Dr. Suresh Shrestha (NMC #4829)',
    downloadUrl: '#',
    results: [
      { id: 'r1', testName: 'Fasting Blood Glucose', measuredValue: 102, unit: 'mg/dL', normalRange: '70 - 100', status: 'high' },
      { id: 'r2', testName: 'HbA1c', measuredValue: 5.8, unit: '%', normalRange: '< 5.7', status: 'high' },
      { id: 'r3', testName: 'Total Cholesterol', measuredValue: 195, unit: 'mg/dL', normalRange: '< 200', status: 'normal' },
      { id: 'r4', testName: 'Triglycerides', measuredValue: 165, unit: 'mg/dL', normalRange: '< 150', status: 'high' },
    ],
  },
];

interface HealthcareContextType {
  // Current user & authentication
  currentUser: UserProfile;
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  updateCurrentUser: (updates: Partial<UserProfile>) => void;
  users: UserAccount[];
  activeAccount: UserAccount | null;
  isAuthenticated: boolean;
  login: (identifier: string, password: string) => Promise<{ success: boolean; user?: UserAccount; error?: string; mustChangePassword?: boolean }>;
  logout: () => void;
  changePassword: (oldPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  adminCreateUser: (data: { fullName: string; username: string; email: string; phone?: string; role: Role; tempPassword?: string }) => Promise<{ success: boolean; user?: UserAccount; error?: string }>;
  adminUpdateUser: (id: string, updates: Partial<Pick<UserAccount, 'fullName' | 'email' | 'phone' | 'role' | 'status'>>) => Promise<{ success: boolean; error?: string }>;
  adminResetPassword: (id: string, newTempPassword?: string) => Promise<{ success: boolean; tempPassword?: string; error?: string }>;
  adminToggleUserStatus: (id: string) => Promise<{ success: boolean; error?: string }>;
  adminDeleteUser: (id: string) => Promise<{ success: boolean; error?: string }>;

  // Data lists
  providers: HealthcareProvider[];
  labTests: LabTest[];
  packages: HealthPackage[];
  medicines: Medicine[];
  articles: HealthArticle[];
  appointments: Appointment[];
  enquiries: MedicineEnquiry[];
  deliveries: DeliveryRequest[];
  labReports: LabReport[];
  notifications: NotificationItem[];
  auditLogs: AuditLogEntry[];

  // Slot Locking
  heldSlots: Record<string, { heldUntil: number; sessionId: string }>;
  holdSlot: (key: string) => boolean;
  releaseSlot: (key: string) => void;

  // Actions
  createAppointment: (apt: Omit<Appointment, 'id' | 'referenceId' | 'createdAt' | 'updatedAt'>) => Appointment;
  updateAppointmentStatus: (id: string, status: Appointment['status'], notes?: string) => void;
  createMedicineEnquiry: (enq: Omit<MedicineEnquiry, 'id' | 'referenceId' | 'createdAt' | 'status'>) => MedicineEnquiry;
  updateEnquiryStatus: (id: string, status: MedicineEnquiry['status'], pharmacistNotes?: string, totalQuoted?: number) => void;
  updateDeliveryStatus: (id: string, status: DeliveryRequest['status'], notes?: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addAuditLog: (action: string, entityType: string, entityId: string, details: string) => void;
}

const HealthcareContext = createContext<HealthcareContextType | null>(null);

// Safe storage helpers for SSR resilience (handles Node.js SSR where localStorage is undefined)
function safeGetItem(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return typeof window.localStorage !== 'undefined' ? window.localStorage.getItem(key) : null;
  } catch {
    return null;
  }
}

function safeSetItem(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  try {
    if (typeof window.localStorage !== 'undefined') {
      window.localStorage.setItem(key, value);
    }
  } catch {
    // Ignore storage quota or sandbox restrictions
  }
}

export const HealthcareProviderComponent: React.FC<{ children: ReactNode }> = ({ children }) => {
  // User Accounts & Authentication State
  const [users, setUsers] = useState<UserAccount[]>(SEED_USERS);
  // Initial default: Super Admin Kushal Pokhrel
  const [activeAccount, setActiveAccount] = useState<UserAccount | null>(SEED_USERS[0]);
  const [currentRole, setCurrentRoleState] = useState<Role>('admin');

  // Restricted setCurrentRole (Strict Role-Based Access Control)
  const setCurrentRole = (role: Role) => {
    // Only Super Admin can override role for testing; ordinary users are blocked
    if (activeAccount && activeAccount.role !== 'admin' && activeAccount.role !== role) {
      console.warn('Security Alert: Unauthorized role switch attempt blocked.');
      return;
    }
    setCurrentRoleState(role);
  };

  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: 'usr-admin-1',
    name: 'Kushal Pokhrel',
    email: 'kushal@twobrothershealthcare.com',
    phone: '9841234567',
    role: 'admin',
    dateOfBirth: '1994-08-22',
    bloodGroup: 'B Positive',
    allergies: ['Penicillin'],
    chronicConditions: ['None'],
    emergencyContact: {
      name: 'Binod Sharma',
      relationship: 'Brother',
      phone: '9851098765',
    },
    dependents: [
      { id: 'dep-1', name: 'Gita Sharma', relationship: 'Mother', dateOfBirth: '1962-03-12', bloodGroup: 'B Positive' },
      { id: 'dep-2', name: 'Aarav Sharma', relationship: 'Son', dateOfBirth: '2021-11-04', bloodGroup: 'O Positive' },
    ],
    addresses: [
      { id: 'addr-1', label: 'Home', address: 'Sanagau Ward-4, Near Shiva Temple', city: 'Lalitpur', isDefault: true },
      { id: 'addr-2', label: 'Office', address: 'Pulchowk Commercial Complex, 3rd Floor', city: 'Lalitpur' },
    ],
  });

  // Local state initialized with seeds (SSR safe)
  const [providers] = useState<HealthcareProvider[]>(SEED_PROVIDERS);
  const [labTests] = useState<LabTest[]>(SEED_LAB_TESTS);
  const [packages] = useState<HealthPackage[]>(SEED_PACKAGES);
  const [medicines, setMedicines] = useState<Medicine[]>(SEED_MEDICINES);
  const [articles] = useState<HealthArticle[]>(SEED_ARTICLES);
  const [appointments, setAppointments] = useState<Appointment[]>(SEED_APPOINTMENTS);
  const [enquiries, setEnquiries] = useState<MedicineEnquiry[]>(SEED_ENQUIRIES);
  const [deliveries, setDeliveries] = useState<DeliveryRequest[]>(SEED_DELIVERIES);
  const [labReports] = useState<LabReport[]>(SEED_LAB_REPORTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      type: 'appointment',
      title: 'Appointment Confirmed (TBH-2026-001)',
      message: 'Your consultation with Dr. Suresh Shrestha on Nov 25 at 09:00 AM has been confirmed.',
      channel: 'in_app',
      read: false,
      createdAt: '2026-11-23T10:05:00Z',
    },
    {
      id: 'notif-2',
      type: 'enquiry',
      title: 'Medicine Dispatched (MED-2026-042)',
      message: 'Rider Prakash is en route to your address in Sanagau. ETA ~35 mins.',
      channel: 'sms',
      read: true,
      createdAt: '2026-11-23T14:45:00Z',
    },
  ]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);

  // Slot locking state (key -> { heldUntil, sessionId })
  const [heldSlots, setHeldSlots] = useState<Record<string, { heldUntil: number; sessionId: string }>>({});

  // Client-side rehydration from localStorage after mount
  useEffect(() => {
    try {
      const savedMeds = safeGetItem('tbh_medicines');
      if (savedMeds) setMedicines(JSON.parse(savedMeds));

      const savedAppts = safeGetItem('tbh_appointments');
      if (savedAppts) setAppointments(JSON.parse(savedAppts));

      const savedEnq = safeGetItem('tbh_enquiries');
      if (savedEnq) setEnquiries(JSON.parse(savedEnq));

      const savedDel = safeGetItem('tbh_deliveries');
      if (savedDel) setDeliveries(JSON.parse(savedDel));

      const savedNotifs = safeGetItem('tbh_notifications');
      if (savedNotifs) setNotifications(JSON.parse(savedNotifs));

      // Rehydrate user registry and active session
      const savedUsers = safeGetItem('tbh_user_registry');
      if (savedUsers) {
        try {
          const parsedUsers = JSON.parse(savedUsers);
          if (Array.isArray(parsedUsers) && parsedUsers.length > 0) {
            setUsers(parsedUsers);
          }
        } catch {}
      } else {
        safeSetItem('tbh_user_registry', JSON.stringify(SEED_USERS));
        safeSetItem('tbh_initial_setup_completed', 'true');
      }

      const savedAuth = safeGetItem('tbh_auth_session');
      if (savedAuth) {
        try {
          const parsedAuth = JSON.parse(savedAuth);
          if (parsedAuth && parsedAuth.id) {
            setActiveAccount(parsedAuth);
            setCurrentRoleState(parsedAuth.role);
          }
        } catch {}
      }
    } catch (e) {
      console.warn('Failed to rehydrate local state:', e);
    }
  }, []);

  // Sync activeAccount changes to currentUser and storage
  useEffect(() => {
    if (activeAccount) {
      safeSetItem('tbh_auth_session', JSON.stringify(activeAccount));
      setCurrentRoleState(activeAccount.role);
      setCurrentUser((prev) => ({
        ...prev,
        id: activeAccount.id,
        name: activeAccount.fullName,
        email: activeAccount.email,
        phone: activeAccount.phone || prev.phone,
        role: activeAccount.role,
      }));
    } else {
      if (typeof window !== 'undefined') {
        try {
          window.localStorage.removeItem('tbh_auth_session');
        } catch {}
      }
      setCurrentRoleState('patient');
      setCurrentUser((prev) => ({
        ...prev,
        id: 'usr-guest',
        name: 'Guest Patient',
        role: 'patient',
      }));
    }
  }, [activeAccount]);

  // Persist user registry updates
  useEffect(() => {
    safeSetItem('tbh_user_registry', JSON.stringify(users));
  }, [users]);

  // Save to localStorage when state updates (SSR safe)
  useEffect(() => {
    safeSetItem('tbh_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    safeSetItem('tbh_enquiries', JSON.stringify(enquiries));
  }, [enquiries]);

  useEffect(() => {
    safeSetItem('tbh_deliveries', JSON.stringify(deliveries));
  }, [deliveries]);

  useEffect(() => {
    safeSetItem('tbh_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    safeSetItem('tbh_medicines', JSON.stringify(medicines));
  }, [medicines]);

  // Periodic cleanup of expired slot holds (10-minute timeout)
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      setHeldSlots((prev) => {
        let changed = false;
        const next: Record<string, { heldUntil: number; sessionId: string }> = {};
        for (const [key, val] of Object.entries(prev)) {
          if (val.heldUntil > now) {
            next[key] = val;
          } else {
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const holdSlot = (key: string): boolean => {
    const now = Date.now();
    const existing = heldSlots[key];
    if (existing && existing.heldUntil > now) {
      return false; // Already locked by another user
    }
    // Hold for 10 minutes (600,000 ms)
    const heldUntil = now + 10 * 60 * 1000;
    setHeldSlots((prev) => ({
      ...prev,
      [key]: { heldUntil, sessionId: 'session-' + Math.random().toString(36).substring(2, 9) },
    }));
    return true;
  };

  const releaseSlot = (key: string) => {
    setHeldSlots((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const addAuditLog = (action: string, entityType: string, entityId: string, details: string) => {
    const entry: AuditLogEntry = {
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toISOString(),
      actorName: currentUser.name,
      actorRole: currentRole,
      action,
      entityType,
      entityId,
      details,
      ipAddress: '192.168.1.1 (Sanagau Local Net)',
    };
    setAuditLogs((prev) => [entry, ...prev.slice(0, 100)]);
  };

  const createAppointment = (apt: Omit<Appointment, 'id' | 'referenceId' | 'createdAt' | 'updatedAt'>): Appointment => {
    const refNum = (appointments.length + 1).toString().padStart(3, '0');
    const newAppointment: Appointment = {
      ...apt,
      id: 'apt-' + Date.now(),
      referenceId: `TBH-2026-${refNum}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setAppointments((prev) => [newAppointment, ...prev]);

    // Send notification
    const newNotif: NotificationItem = {
      id: 'notif-' + Date.now(),
      type: 'appointment',
      title: `Appointment Booked (${newAppointment.referenceId})`,
      message: `Your booking for ${newAppointment.serviceTitle} on ${newAppointment.appointmentDate} at ${newAppointment.timeSlot} has been received.`,
      channel: 'sms',
      read: false,
      relatedEntityId: newAppointment.id,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);
    addAuditLog('BOOK_APPOINTMENT', 'Appointment', newAppointment.referenceId, `Patient: ${apt.patientName}, Service: ${apt.serviceTitle}`);

    return newAppointment;
  };

  const updateAppointmentStatus = (id: string, status: Appointment['status'], notes?: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status, internalStaffNotes: notes ?? a.internalStaffNotes, updatedAt: new Date().toISOString() } : a))
    );
    addAuditLog('UPDATE_STATUS', 'Appointment', id, `Status updated to ${status}`);
  };

  const createMedicineEnquiry = (enq: Omit<MedicineEnquiry, 'id' | 'referenceId' | 'createdAt' | 'status'>): MedicineEnquiry => {
    const refNum = (enquiries.length + 42).toString().padStart(3, '0');
    const newEnquiry: MedicineEnquiry = {
      ...enq,
      id: 'enq-' + Date.now(),
      referenceId: `MED-2026-${refNum}`,
      status: 'submitted',
      createdAt: new Date().toISOString(),
    };
    setEnquiries((prev) => [newEnquiry, ...prev]);

    // Notification
    const newNotif: NotificationItem = {
      id: 'notif-' + Date.now(),
      type: 'enquiry',
      title: `Medicine Enquiry Received (${newEnquiry.referenceId})`,
      message: `Our licensed pharmacist at Sanagau is reviewing your prescription and availability.`,
      channel: 'in_app',
      read: false,
      relatedEntityId: newEnquiry.id,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);
    addAuditLog('SUBMIT_ENQUIRY', 'MedicineEnquiry', newEnquiry.referenceId, `Patient: ${enq.patientName}, Items: ${enq.medicineList.length}`);

    return newEnquiry;
  };

  const updateEnquiryStatus = (id: string, status: MedicineEnquiry['status'], pharmacistNotes?: string, totalQuoted?: number) => {
    setEnquiries((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              status,
              pharmacistNotes: pharmacistNotes ?? e.pharmacistNotes,
              totalQuoted: totalQuoted ?? e.totalQuoted,
            }
          : e
      )
    );

    // If confirmed and delivery requested, spawn delivery record if not already created
    if (status === 'confirmed') {
      const target = enquiries.find((e) => e.id === id);
      if (target && target.deliveryType === 'delivery') {
        const delNum = (deliveries.length + 16).toString().padStart(3, '0');
        const newDelivery: DeliveryRequest = {
          id: 'del-' + Date.now(),
          referenceId: `DEL-2026-${delNum}`,
          enquiryId: target.id,
          patientName: target.patientName,
          phone: target.phone,
          address: target.deliveryAddress || 'Sanagau, Lalitpur',
          zone: target.deliveryZone || 'Lalitpur Zone 1',
          itemsSummary: target.medicineList.map((m) => `${m.medicineName} (${m.quantity})`).join(', '),
          totalAmount: totalQuoted || target.totalQuoted || 200,
          status: 'accepted',
          assignedStaffName: 'Prakash Tamang (Rider)',
          estimatedDeliveryTime: '45 mins',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setDeliveries((prev) => [newDelivery, ...prev]);
      }
    }

    addAuditLog('ENQUIRY_STATUS_UPDATE', 'MedicineEnquiry', id, `Status changed to ${status}`);
  };

  const updateDeliveryStatus = (id: string, status: DeliveryRequest['status'], notes?: string) => {
    setDeliveries((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status, notes: notes ?? d.notes, updatedAt: new Date().toISOString() } : d))
    );
    addAuditLog('DELIVERY_STATUS_UPDATE', 'DeliveryRequest', id, `Status moved to ${status}`);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // --- AUTHENTICATION & SUPER ADMIN USER MANAGEMENT ---

  const login = async (
    identifier: string,
    password: string
  ): Promise<{ success: boolean; user?: UserAccount; error?: string; mustChangePassword?: boolean }> => {
    const cleanId = identifier.trim().toLowerCase();
    const found = users.find(
      (u) =>
        u.username.toLowerCase() === cleanId ||
        u.email.toLowerCase() === cleanId ||
        (u.phone && u.phone === cleanId)
    );

    if (!found) {
      addAuditLog('LOGIN_FAILED', 'UserAccount', identifier, 'User not found in registry');
      return { success: false, error: 'Invalid username/email or password.' };
    }

    if (found.status === 'inactive') {
      addAuditLog('LOGIN_BLOCKED', 'UserAccount', found.id, 'Deactivated account login attempt');
      return { success: false, error: 'This account has been deactivated. Please contact the Super Admin.' };
    }

    const isValid = await verifyPassword(password, found.passwordHash, found.passwordSalt);
    if (!isValid) {
      addAuditLog('LOGIN_FAILED', 'UserAccount', found.id, 'Invalid password entered');
      return { success: false, error: 'Invalid username/email or password.' };
    }

    const updatedUser: UserAccount = {
      ...found,
      lastLoginAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setUsers((prev) => prev.map((u) => (u.id === found.id ? updatedUser : u)));
    setActiveAccount(updatedUser);
    setCurrentRoleState(updatedUser.role);
    safeSetItem('tbh_auth_session', JSON.stringify(updatedUser));
    addAuditLog('LOGIN_SUCCESS', 'UserAccount', found.id, `Logged in as ${found.fullName} (${found.role})`);

    return {
      success: true,
      user: updatedUser,
      mustChangePassword: !!updatedUser.mustChangePassword,
    };
  };

  const logout = () => {
    if (activeAccount) {
      addAuditLog('LOGOUT', 'UserAccount', activeAccount.id, `User ${activeAccount.fullName} logged out`);
    }
    setActiveAccount(null);
    setCurrentRoleState('patient');
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem('tbh_auth_session');
      } catch {}
    }
  };

  const changePassword = async (
    oldPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!activeAccount) {
      return { success: false, error: 'No active session found.' };
    }

    const isValid = await verifyPassword(oldPassword, activeAccount.passwordHash, activeAccount.passwordSalt);
    if (!isValid) {
      return { success: false, error: 'Current password is incorrect.' };
    }

    if (newPassword.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters long.' };
    }

    const newSalt = generateSalt();
    const newHash = await hashPassword(newPassword, newSalt);

    const updatedUser: UserAccount = {
      ...activeAccount,
      passwordSalt: newSalt,
      passwordHash: newHash,
      mustChangePassword: false,
      updatedAt: new Date().toISOString(),
    };

    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    setActiveAccount(updatedUser);
    safeSetItem('tbh_auth_session', JSON.stringify(updatedUser));
    addAuditLog('PASSWORD_CHANGED', 'UserAccount', updatedUser.id, `Password changed by ${updatedUser.fullName}`);
    return { success: true };
  };

  const adminCreateUser = async (data: {
    fullName: string;
    username: string;
    email: string;
    phone?: string;
    role: Role;
    tempPassword?: string;
  }): Promise<{ success: boolean; user?: UserAccount; error?: string }> => {
    if (currentRole !== 'admin') {
      addAuditLog('SECURITY_VIOLATION', 'UserAccount', data.username, 'Non-admin attempted user creation');
      return { success: false, error: 'Unauthorized: Only Super Admin can create accounts and assign roles.' };
    }

    const cleanUsername = data.username.trim().toLowerCase();
    const cleanEmail = data.email.trim().toLowerCase();

    if (!cleanUsername || !cleanEmail || !data.fullName.trim()) {
      return { success: false, error: 'Full name, unique username, and valid email are required.' };
    }

    if (users.some((u) => u.username.toLowerCase() === cleanUsername)) {
      return { success: false, error: `Username "${data.username}" is already taken.` };
    }

    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: `Email "${data.email}" is already registered.` };
    }

    const passwordToHash = data.tempPassword || generateTempPassword();
    const salt = generateSalt();
    const passwordHash = await hashPassword(passwordToHash, salt);

    const newUser: UserAccount = {
      id: 'usr-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      fullName: data.fullName.trim(),
      username: cleanUsername,
      email: cleanEmail,
      phone: data.phone?.trim() || '',
      role: data.role,
      passwordSalt: salt,
      passwordHash,
      status: 'active',
      mustChangePassword: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setUsers((prev) => [newUser, ...prev]);
    addAuditLog(
      'USER_CREATED',
      'UserAccount',
      newUser.id,
      `Super Admin created account ${newUser.username} (${newUser.fullName}) with role ${newUser.role}`
    );

    return { success: true, user: newUser };
  };

  const adminUpdateUser = async (
    id: string,
    updates: Partial<Pick<UserAccount, 'fullName' | 'email' | 'phone' | 'role' | 'status'>>
  ): Promise<{ success: boolean; error?: string }> => {
    if (currentRole !== 'admin') {
      return { success: false, error: 'Unauthorized: Only Super Admin can modify user accounts.' };
    }

    const target = users.find((u) => u.id === id);
    if (!target) return { success: false, error: 'User not found.' };

    if (target.role === 'admin' && updates.role && updates.role !== 'admin') {
      const activeAdmins = users.filter((u) => u.role === 'admin' && u.status === 'active');
      if (activeAdmins.length <= 1) {
        return { success: false, error: 'Cannot demote the last active Super Admin account.' };
      }
    }

    if (updates.email && updates.email.toLowerCase() !== target.email.toLowerCase()) {
      const emailTaken = users.some((u) => u.id !== id && u.email.toLowerCase() === updates.email!.toLowerCase());
      if (emailTaken) {
        return { success: false, error: `Email "${updates.email}" is already in use by another account.` };
      }
    }

    const updatedUser: UserAccount = {
      ...target,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    setUsers((prev) => prev.map((u) => (u.id === id ? updatedUser : u)));

    if (activeAccount?.id === id) {
      setActiveAccount(updatedUser);
      if (updates.role) setCurrentRoleState(updates.role);
    }

    addAuditLog('USER_UPDATED', 'UserAccount', id, `Updated account ${target.username}: ${Object.keys(updates).join(', ')}`);
    return { success: true };
  };

  const adminResetPassword = async (
    id: string,
    newTempPassword?: string
  ): Promise<{ success: boolean; tempPassword?: string; error?: string }> => {
    if (currentRole !== 'admin') {
      return { success: false, error: 'Unauthorized: Only Super Admin can reset user passwords.' };
    }

    const target = users.find((u) => u.id === id);
    if (!target) return { success: false, error: 'User not found.' };

    const tempPass = newTempPassword || generateTempPassword();
    const newSalt = generateSalt();
    const newHash = await hashPassword(tempPass, newSalt);

    const updatedUser: UserAccount = {
      ...target,
      passwordSalt: newSalt,
      passwordHash: newHash,
      mustChangePassword: true,
      updatedAt: new Date().toISOString(),
    };

    setUsers((prev) => prev.map((u) => (u.id === id ? updatedUser : u)));
    addAuditLog('PASSWORD_RESET', 'UserAccount', id, `Temporary password generated for ${target.username}`);
    return { success: true, tempPassword: tempPass };
  };

  const adminToggleUserStatus = async (id: string): Promise<{ success: boolean; error?: string }> => {
    if (currentRole !== 'admin') {
      return { success: false, error: 'Unauthorized: Only Super Admin can toggle account status.' };
    }

    const target = users.find((u) => u.id === id);
    if (!target) return { success: false, error: 'User not found.' };

    if (target.role === 'admin' && target.status === 'active') {
      const activeAdmins = users.filter((u) => u.role === 'admin' && u.status === 'active');
      if (activeAdmins.length <= 1) {
        return { success: false, error: 'Cannot deactivate the last active Super Admin account.' };
      }
    }

    const newStatus = target.status === 'active' ? 'inactive' : 'active';
    const updatedUser: UserAccount = {
      ...target,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };

    setUsers((prev) => prev.map((u) => (u.id === id ? updatedUser : u)));
    if (activeAccount?.id === id && newStatus === 'inactive') {
      logout();
    }

    addAuditLog('ACCOUNT_STATUS_CHANGED', 'UserAccount', id, `Status for ${target.username} set to ${newStatus}`);
    return { success: true };
  };

  const adminDeleteUser = async (id: string): Promise<{ success: boolean; error?: string }> => {
    if (currentRole !== 'admin') {
      return { success: false, error: 'Unauthorized: Only Super Admin can delete user accounts.' };
    }

    const target = users.find((u) => u.id === id);
    if (!target) return { success: false, error: 'User not found.' };

    if (target.id === 'usr-admin-1') {
      return { success: false, error: 'Primary Super Admin account (Kushal Pokhrel) cannot be deleted.' };
    }

    if (target.role === 'admin') {
      const activeAdmins = users.filter((u) => u.role === 'admin' && u.status === 'active');
      if (activeAdmins.length <= 1) {
        return { success: false, error: 'Cannot delete the last active Super Admin account.' };
      }
    }

    setUsers((prev) => prev.filter((u) => u.id !== id));
    addAuditLog('USER_DELETED', 'UserAccount', id, `Account ${target.username} (${target.fullName}) deleted`);
    return { success: true };
  };

  const updateCurrentUser = (updates: Partial<UserProfile>) => {
    setCurrentUser((prev) => ({ ...prev, ...updates }));
  };

  return (
    <HealthcareContext.Provider
      value={{
        currentUser,
        currentRole,
        setCurrentRole,
        updateCurrentUser,
        users,
        activeAccount,
        isAuthenticated: !!activeAccount,
        login,
        logout,
        changePassword,
        adminCreateUser,
        adminUpdateUser,
        adminResetPassword,
        adminToggleUserStatus,
        adminDeleteUser,
        providers,
        labTests,
        packages,
        medicines,
        articles,
        appointments,
        enquiries,
        deliveries,
        labReports,
        notifications,
        auditLogs,
        heldSlots,
        holdSlot,
        releaseSlot,
        createAppointment,
        updateAppointmentStatus,
        createMedicineEnquiry,
        updateEnquiryStatus,
        updateDeliveryStatus,
        markNotificationRead,
        markAllNotificationsRead,
        addAuditLog,
      }}
    >
      {children}
    </HealthcareContext.Provider>
  );
};

export const useHealthcare = () => {
  const context = useContext(HealthcareContext);
  if (!context) {
    throw new Error('useHealthcare must be used within HealthcareProviderComponent');
  }
  return context;
};
