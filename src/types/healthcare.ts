export type Role =
  | 'patient'
  | 'pharmacist'
  | 'doctor'
  | 'lab_staff'
  | 'receptionist'
  | 'delivery'
  | 'admin';

export interface UserAccount {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phone?: string;
  role: Role;
  passwordHash: string;
  passwordSalt: string;
  status: 'active' | 'inactive';
  mustChangePassword?: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export type Language = 'en' | 'ne';

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  phone: string;
  role: Role;
  avatarUrl?: string;
  dateOfBirth?: string;
  bloodGroup?: string;
  allergies?: string[];
  chronicConditions?: string[];
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  dependents?: {
    id: string;
    name: string;
    relationship: string;
    dateOfBirth: string;
    bloodGroup?: string;
  }[];
  addresses?: {
    id: string;
    label: string;
    address: string;
    landmark?: string;
    city: string;
    isDefault?: boolean;
  }[];
}

export interface ServiceCategory {
  id: string;
  name: string;
  nameNe: string;
  slug: string;
  description: string;
  descriptionNe: string;
  iconName: string;
  features: string[];
}

export interface HealthcareProvider {
  id: string;
  name: string;
  title: string;
  qualifications: string;
  registrationNumber: string;
  specialties: string[];
  experienceYears: number;
  languages: string[];
  consultationFee: number;
  photoUrl: string;
  rating: number;
  reviewCount: number;
  availableDays: string[];
  availableTimeSlots: string[];
  verified: boolean;
  department: string;
}

export interface LabTest {
  id: string;
  name: string;
  category: 'Blood' | 'Urine' | 'Imaging' | 'Cardiac' | 'Biochemistry' | 'Microbiology';
  sampleType: string;
  preparationNotes: string;
  turnaroundTime: string;
  price: number;
  description: string;
  commonBundleId?: string;
}

export interface HealthPackage {
  id: string;
  name: string;
  slug: string;
  category: 'Basic' | 'Comprehensive' | 'Senior' | 'Women' | 'Men' | 'Specialized';
  tagline: string;
  price: number;
  originalPrice?: number;
  testCount: number;
  durationMinutes: number;
  includedTests: string[];
  exclusions: string[];
  preparationNotes: string;
  targetAudience: string;
  badge?: string;
}

export interface Medicine {
  id: string;
  name: string;
  brand?: string;
  genericName: string;
  strength: string;
  form: 'Tablet' | 'Capsule' | 'Syrup' | 'Injection' | 'Ointment' | 'Drops' | 'Inhaler';
  manufacturer: string;
  supplier?: string;
  prescriptionRequired: boolean;
  price: number;
  purchasePrice?: number;
  sellingPrice?: number;
  inStock: boolean;
  stockCount: number;
  lowStockThreshold?: number;
  expiryDate?: string; // YYYY-MM-DD
  batchNumber?: string;
  imageUrl?: string;
  category: string;
  dosageGuidelines?: string;
}

export type AppointmentStatus =
  | 'held'
  | 'pending'
  | 'confirmed'
  | 'arrived'
  | 'completed'
  | 'cancelled'
  | 'rescheduled';

export interface Appointment {
  id: string;
  referenceId: string; // e.g. TBH-2026-001
  patientId?: string;
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  serviceType: 'consultation' | 'lab' | 'package' | 'other';
  serviceTitle: string;
  subServiceId?: string;
  providerId?: string;
  providerName?: string;
  appointmentDate: string; // YYYY-MM-DD
  timeSlot: string; // HH:MM AM/PM
  status: AppointmentStatus;
  heldUntil?: number; // timestamp
  reasonForVisit?: string;
  notes?: string;
  internalStaffNotes?: string;
  createdForDependent?: string;
  documents?: string[];
  totalFee: number;
  createdAt: string;
  updatedAt: string;
}

export type EnquiryStatus =
  | 'submitted'
  | 'verified'
  | 'confirmed'
  | 'dispatched'
  | 'delivered'
  | 'declined';

export interface MedicineEnquiry {
  id: string;
  referenceId: string; // e.g. MED-2026-089
  patientName: string;
  phone: string;
  email?: string;
  deliveryType: 'pickup' | 'delivery';
  deliveryAddress?: string;
  deliveryZone?: string;
  deliveryFee?: number;
  medicineList: {
    medicineId?: string;
    medicineName: string;
    quantity: number;
    notes?: string;
    priceQuoted?: number;
    available?: boolean;
    alternativeSuggested?: string;
  }[];
  prescriptionFileUrl?: string;
  pharmacistNotes?: string;
  status: EnquiryStatus;
  createdAt: string;
  totalQuoted?: number;
}

export type DeliveryStatus =
  | 'accepted'
  | 'preparing'
  | 'ready'
  | 'dispatched'
  | 'completed'
  | 'cancelled';

export interface DeliveryRequest {
  id: string;
  referenceId: string;
  enquiryId: string;
  patientName: string;
  phone: string;
  address: string;
  zone: string;
  itemsSummary: string;
  totalAmount: number;
  status: DeliveryStatus;
  assignedStaffId?: string;
  assignedStaffName?: string;
  estimatedDeliveryTime?: string;
  photoProofUrl?: string;
  signatureReceived?: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LabResultItem {
  id: string;
  testName: string;
  measuredValue: number;
  unit: string;
  normalRange: string;
  status: 'normal' | 'low' | 'high' | 'critical';
}

export interface LabReport {
  id: string;
  referenceId: string;
  patientId: string;
  patientName: string;
  testName: string;
  date: string;
  verifiedByDoctor: string;
  downloadUrl: string;
  results: LabResultItem[];
}

export interface HealthArticle {
  id: string;
  slug: string;
  title: string;
  titleNe?: string;
  category: 'Nutrition' | 'Prevention' | 'Mental Health' | 'Chronic Conditions' | 'Seasonal Health' | 'Medication Safety';
  excerpt: string;
  coverImageUrl: string;
  authorName: string;
  authorCredentials: string;
  reviewedByDoctor: string;
  reviewDate: string;
  publishedDate: string;
  readTimeMinutes: number;
  contentMarkdown: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: Role;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  ipAddress?: string;
}

export interface NotificationItem {
  id: string;
  userId?: string;
  recipientRole?: Role;
  type: 'appointment' | 'enquiry' | 'delivery' | 'lab' | 'system';
  title: string;
  message: string;
  channel: 'in_app' | 'sms' | 'email';
  read: boolean;
  relatedEntityId?: string;
  createdAt: string;
}
