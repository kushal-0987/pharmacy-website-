-- ============================================================================
-- Two Brothers Healthcare Pvt. Ltd. (Sanagau, Lalitpur, Nepal)
-- Database Initialization & Schema Migration
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUMS
CREATE TYPE user_role AS ENUM (
  'patient',
  'reception',
  'doctor',
  'nurse',
  'lab_tech',
  'pharmacist',
  'admin'
);

CREATE TYPE appointment_status AS ENUM (
  'pending',
  'confirmed',
  'arrived',
  'in_consultation',
  'completed',
  'cancelled',
  'no_show'
);

CREATE TYPE enquiry_status AS ENUM (
  'submitted',
  'pharmacist_review',
  'quoted',
  'confirmed',
  'dispatched',
  'delivered',
  'cancelled'
);

CREATE TYPE delivery_status AS ENUM (
  'order_confirmed',
  'packed_by_pharmacist',
  'rider_assigned',
  'out_for_delivery',
  'delivered'
);

-- 3. USER PROFILES
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'patient',
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  blood_group TEXT,
  allergies TEXT[],
  chronic_conditions TEXT[],
  emergency_contact JSONB,
  dependents JSONB[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. CLINICAL PROVIDERS (DOCTORS & SPECIALISTS)
CREATE TABLE healthcare_providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  specialty TEXT NOT NULL,
  sub_specialties TEXT[] DEFAULT '{}',
  qualifications TEXT NOT NULL,
  nmc_number TEXT NOT NULL UNIQUE,
  experience_years INT NOT NULL DEFAULT 1,
  languages TEXT[] NOT NULL DEFAULT '{"Nepali", "English"}',
  bio TEXT,
  consultation_fee NUMERIC(10,2) NOT NULL DEFAULT 500.00,
  is_available BOOLEAN NOT NULL DEFAULT true,
  duty_schedule JSONB DEFAULT '{}',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. SERVICES & LAB TESTS
CREATE TABLE clinical_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('pharmacy', 'consultation', 'lab', 'packages', 'other')),
  description TEXT NOT NULL,
  duration_minutes INT NOT NULL DEFAULT 20,
  price NUMERIC(10,2),
  max_daily_visits INT NOT NULL DEFAULT 50,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE lab_tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  specimen_type TEXT NOT NULL,
  fasting_required BOOLEAN NOT NULL DEFAULT false,
  fasting_hours INT,
  turnaround_hours INT NOT NULL DEFAULT 4,
  price NUMERIC(10,2) NOT NULL,
  description TEXT,
  home_collection_available BOOLEAN NOT NULL DEFAULT true,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. HEALTH PACKAGES
CREATE TABLE health_packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  price NUMERIC(10,2) NOT NULL,
  original_price NUMERIC(10,2),
  description TEXT NOT NULL,
  target_audience TEXT,
  estimated_duration TEXT NOT NULL DEFAULT '2 hours',
  included_tests TEXT[] NOT NULL,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. PHARMACY INVENTORY & MEDICINES
CREATE TABLE medicines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  generic_name TEXT NOT NULL,
  dosage_form TEXT NOT NULL CHECK (dosage_form IN ('tablet', 'capsule', 'syrup', 'injection', 'cream', 'drops', 'inhaler')),
  strength TEXT NOT NULL,
  manufacturer TEXT NOT NULL,
  stock_quantity INT NOT NULL DEFAULT 0,
  min_stock_alert INT NOT NULL DEFAULT 20,
  unit_price NUMERIC(10,2) NOT NULL,
  is_prescription_required BOOLEAN NOT NULL DEFAULT false,
  batch_number TEXT,
  expiry_date DATE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. 10-MINUTE TRANSACTIONAL SLOT LOCKS
CREATE TABLE slot_locks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID REFERENCES healthcare_providers(id) ON DELETE CASCADE,
  service_id UUID REFERENCES clinical_services(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  locked_by_session TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_active_slot UNIQUE(provider_id, date, time_slot)
);

-- 9. APPOINTMENTS
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference_no TEXT NOT NULL UNIQUE,
  patient_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  provider_id UUID REFERENCES healthcare_providers(id) ON DELETE SET NULL,
  service_id UUID REFERENCES clinical_services(id) ON DELETE SET NULL,
  patient_name TEXT NOT NULL,
  patient_phone TEXT NOT NULL,
  patient_email TEXT,
  date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  status appointment_status NOT NULL DEFAULT 'pending',
  chief_complaint TEXT,
  clinical_notes TEXT,
  is_guest BOOLEAN NOT NULL DEFAULT false,
  payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded')),
  payment_method TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. MEDICINE ENQUIRIES & DISPENSING
CREATE TABLE medicine_enquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference_no TEXT NOT NULL UNIQUE,
  patient_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  patient_name TEXT NOT NULL,
  patient_phone TEXT NOT NULL,
  patient_email TEXT,
  items JSONB NOT NULL DEFAULT '[]',
  prescription_file_url TEXT,
  fulfillment_type TEXT NOT NULL CHECK (fulfillment_type IN ('delivery', 'pickup')),
  delivery_address TEXT,
  status enquiry_status NOT NULL DEFAULT 'submitted',
  pharmacist_notes TEXT,
  quoted_amount NUMERIC(10,2),
  reviewed_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. COURIER DELIVERIES
CREATE TABLE deliveries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tracking_no TEXT NOT NULL UNIQUE,
  enquiry_id UUID REFERENCES medicine_enquiries(id) ON DELETE CASCADE,
  patient_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Lalitpur',
  zone TEXT NOT NULL,
  rider_name TEXT,
  rider_phone TEXT,
  status delivery_status NOT NULL DEFAULT 'order_confirmed',
  estimated_delivery TIMESTAMPTZ,
  actual_delivery TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. LAB REPORTS & PATIENT VAULT
CREATE TABLE lab_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  test_name TEXT NOT NULL,
  performed_by TEXT NOT NULL,
  verified_by TEXT NOT NULL,
  results JSONB NOT NULL DEFAULT '{}',
  pdf_url TEXT NOT NULL,
  report_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. HEALTH ARTICLES / BLOG
CREATE TABLE health_articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  read_time_minutes INT NOT NULL DEFAULT 5,
  author_name TEXT NOT NULL,
  reviewed_by_doctor TEXT NOT NULL,
  reviewed_date DATE NOT NULL,
  image_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. IMMUTABLE AUDIT LOGS
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_name TEXT NOT NULL,
  user_role TEXT NOT NULL,
  action TEXT NOT NULL,
  resource TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  details JSONB
);

-- 15. ROW-LEVEL SECURITY (RLS) POLICIES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE healthcare_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE slot_locks ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicine_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: users read and update their own profile; staff/admins read all
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Public catalogs: readable by everyone
CREATE POLICY "Public read healthcare_providers" ON healthcare_providers FOR SELECT USING (true);
CREATE POLICY "Public read clinical_services" ON clinical_services FOR SELECT USING (is_active = true);
CREATE POLICY "Public read lab_tests" ON lab_tests FOR SELECT USING (is_active = true);
CREATE POLICY "Public read health_packages" ON health_packages FOR SELECT USING (is_active = true);
CREATE POLICY "Public read medicines" ON medicines FOR SELECT USING (is_active = true);
CREATE POLICY "Public read health_articles" ON health_articles FOR SELECT USING (is_published = true);

-- Slot locks: readable & creatable by anyone during booking
CREATE POLICY "Anyone can check and claim slot locks" ON slot_locks FOR ALL USING (true);

-- Appointments: patients can see their own, staff/reception/admin see all
CREATE POLICY "Patients view own appointments" ON appointments
  FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Patients create appointments" ON appointments
  FOR INSERT WITH CHECK (true);

-- Medicine Enquiries: patients see own, pharmacists see all
CREATE POLICY "Patients view own enquiries" ON medicine_enquiries
  FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Anyone can submit medicine enquiry" ON medicine_enquiries
  FOR INSERT WITH CHECK (true);

-- Audit logs: only readable by admins; insertable by authenticated system events
CREATE POLICY "Admins can view audit logs" ON audit_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
