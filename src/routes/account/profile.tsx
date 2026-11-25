import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { AccountLayout } from '@/components/account/AccountLayout';
import { useHealthcare } from '@/lib/healthcare-store';
import { useI18n } from '@/lib/i18n';
import {
  User,
  ShieldCheck,
  Heart,
  Users,
  Bell,
  Globe,
  Trash2,
  Plus,
  Save,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/account/profile')({
  head: () => ({
    meta: [
      { title: 'Patient Profile & Dependents — Two Brothers Healthcare' },
      { name: 'description', content: 'Manage patient personal information, emergency contacts, allergy lists, and family dependents.' },
    ],
  }),
  component: PatientProfilePage,
});

function PatientProfilePage() {
  const { currentUser, updateCurrentUser } = useHealthcare();
  const { lang, setLang } = useI18n();

  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email || '');
  const [phone, setPhone] = useState(currentUser.phone);
  const [bloodGroup, setBloodGroup] = useState(currentUser.bloodGroup || 'B Positive');
  const [allergies, setAllergies] = useState(currentUser.allergies?.join(', ') || 'Penicillin');
  const [conditions, setConditions] = useState(currentUser.chronicConditions?.join(', ') || 'Mild Allergic Rhinitis');

  // Emergency contact
  const [emName, setEmName] = useState(currentUser.emergencyContact?.name || 'Binod Sharma');
  const [emRel, setEmRel] = useState(currentUser.emergencyContact?.relationship || 'Brother');
  const [emPhone, setEmPhone] = useState(currentUser.emergencyContact?.phone || '9851098765');

  // Dependents
  const [dependents, setDependents] = useState(currentUser.dependents || []);
  const [showAddDep, setShowAddDep] = useState(false);
  const [depName, setDepName] = useState('');
  const [depRel, setDepRel] = useState('Parent');
  const [depDob, setDepDob] = useState('1965-01-01');

  // Notification toggles
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUser({
      name,
      email,
      phone,
      bloodGroup,
      allergies: allergies.split(',').map((s) => s.trim()).filter(Boolean),
      chronicConditions: conditions.split(',').map((s) => s.trim()).filter(Boolean),
      emergencyContact: { name: emName, relationship: emRel, phone: emPhone },
      dependents,
    });
    toast.success('Patient profile successfully updated!');
  };

  const handleAddDependent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!depName.trim()) return;

    const updated = [
      ...dependents,
      {
        id: 'dep-' + Date.now(),
        name: depName,
        relationship: depRel,
        dateOfBirth: depDob,
      },
    ];
    setDependents(updated);
    updateCurrentUser({ dependents: updated });
    toast.success(`Family dependent ${depName} added!`);
    setDepName('');
    setShowAddDep(false);
  };

  const handleRemoveDependent = (id: string) => {
    const updated = dependents.filter((d) => d.id !== id);
    setDependents(updated);
    updateCurrentUser({ dependents: updated });
    toast.info('Dependent removed.');
  };

  return (
    <AccountLayout>
      <div className="space-y-8 animate-in fade-in duration-300">
        <div className="pb-4 border-b border-on-dark/15">
          <h1 className="font-display text-2xl font-bold text-white">Profile & Medical Settings</h1>
          <p className="text-xs text-on-dark-muted">
            Update personal vitals, emergency contacts, and family members.
          </p>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-8">
          {/* Personal Information */}
          <div className="rounded-3xl bg-midnight/50 border border-on-dark/15 p-6 sm:p-8 space-y-6">
            <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
              <User className="h-5 w-5 text-cyan" /> Personal Details & Clinical Tags
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-white font-semibold block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-navy-deep border border-on-dark/20 text-white"
                />
              </div>

              <div>
                <label className="text-white font-semibold block mb-1">Mobile Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-navy-deep border border-on-dark/20 text-white"
                />
              </div>

              <div>
                <label className="text-white font-semibold block mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-navy-deep border border-on-dark/20 text-white"
                />
              </div>

              <div>
                <label className="text-white font-semibold block mb-1">Blood Group</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-navy-deep border border-on-dark/20 text-white"
                >
                  <option value="A Positive">A Positive (A+)</option>
                  <option value="A Negative">A Negative (A-)</option>
                  <option value="B Positive">B Positive (B+)</option>
                  <option value="B Negative">B Negative (B-)</option>
                  <option value="O Positive">O Positive (O+)</option>
                  <option value="O Negative">O Negative (O-)</option>
                  <option value="AB Positive">AB Positive (AB+)</option>
                  <option value="AB Negative">AB Negative (AB-)</option>
                </select>
              </div>

              <div>
                <label className="text-white font-semibold block mb-1">Known Drug Allergies</label>
                <input
                  type="text"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  placeholder="e.g. Penicillin, Sulfa"
                  className="w-full px-4 py-2.5 rounded-2xl bg-navy-deep border border-on-dark/20 text-white"
                />
              </div>

              <div>
                <label className="text-white font-semibold block mb-1">Chronic Conditions</label>
                <input
                  type="text"
                  value={conditions}
                  onChange={(e) => setConditions(e.target.value)}
                  placeholder="e.g. Hypertension, Diabetes"
                  className="w-full px-4 py-2.5 rounded-2xl bg-navy-deep border border-on-dark/20 text-white"
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="rounded-3xl bg-midnight/50 border border-on-dark/15 p-6 sm:p-8 space-y-4">
            <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
              <Heart className="h-5 w-5 text-destructive" /> Emergency Contact Person
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-white font-semibold block mb-1">Contact Name</label>
                <input
                  type="text"
                  value={emName}
                  onChange={(e) => setEmName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-navy-deep border border-on-dark/20 text-white"
                />
              </div>
              <div>
                <label className="text-white font-semibold block mb-1">Relationship</label>
                <input
                  type="text"
                  value={emRel}
                  onChange={(e) => setEmRel(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-navy-deep border border-on-dark/20 text-white"
                />
              </div>
              <div>
                <label className="text-white font-semibold block mb-1">Contact Mobile Number</label>
                <input
                  type="tel"
                  value={emPhone}
                  onChange={(e) => setEmPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-navy-deep border border-on-dark/20 text-white"
                />
              </div>
            </div>
          </div>

          {/* Preferences & Notifications */}
          <div className="rounded-3xl bg-midnight/50 border border-on-dark/15 p-6 sm:p-8 space-y-4 text-xs">
            <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
              <Bell className="h-5 w-5 text-teal" /> Communication Preferences
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-navy-deep border border-on-dark/15 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">SMS Appointment & Delivery Alerts</div>
                  <div className="text-[11px] text-on-dark-muted">Dispatched automatically to your mobile.</div>
                </div>
                <input
                  type="checkbox"
                  checked={smsAlerts}
                  onChange={(e) => setSmsAlerts(e.target.checked)}
                  className="h-5 w-5 rounded border-on-dark/30 text-cyan"
                />
              </div>

              <div className="p-4 rounded-2xl bg-navy-deep border border-on-dark/15 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Email Health Summaries</div>
                  <div className="text-[11px] text-on-dark-muted">Monthly clinic wellness digest.</div>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="h-5 w-5 rounded border-on-dark/30 text-cyan"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-8 py-3.5 rounded-full bg-cyan text-navy-deep font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              <span>Save Profile Changes</span>
            </button>
          </div>
        </form>

        {/* Family Dependents Management */}
        <div className="rounded-3xl bg-midnight/40 border border-on-dark/15 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-leaf" /> Family Dependents
              </h2>
              <p className="text-xs text-on-dark-muted mt-0.5">
                Add parents, spouse, or children to book appointments under your single account.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAddDep(!showAddDep)}
              className="px-4 py-2 rounded-full bg-cyan text-navy-deep font-bold text-xs"
            >
              + Add Family Member
            </button>
          </div>

          {showAddDep && (
            <form onSubmit={handleAddDependent} className="p-5 rounded-2xl bg-navy-deep border border-teal/40 space-y-3 text-xs animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-white font-semibold block mb-1">Dependent Full Name</label>
                  <input
                    type="text"
                    required
                    value={depName}
                    onChange={(e) => setDepName(e.target.value)}
                    placeholder="e.g. Gita Sharma"
                    className="w-full px-3 py-2 rounded-xl bg-midnight border border-on-dark/20 text-white"
                  />
                </div>
                <div>
                  <label className="text-white font-semibold block mb-1">Relationship</label>
                  <select
                    value={depRel}
                    onChange={(e) => setDepRel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-midnight border border-on-dark/20 text-white"
                  >
                    <option value="Mother">Mother</option>
                    <option value="Father">Father</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-white font-semibold block mb-1">Date of Birth</label>
                  <input
                    type="date"
                    required
                    value={depDob}
                    onChange={(e) => setDepDob(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-midnight border border-on-dark/20 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddDep(false)}
                  className="px-4 py-1.5 rounded-full text-on-dark-muted hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded-full bg-cyan text-navy-deep font-bold"
                >
                  Add Dependent
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {dependents.map((dep) => (
              <div
                key={dep.id}
                className="p-4 rounded-2xl bg-navy-deep border border-on-dark/15 flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-white text-sm">{dep.name}</div>
                  <div className="text-teal font-medium">
                    {dep.relationship} · Born: {dep.dateOfBirth}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveDependent(dep.id)}
                  className="p-2 text-on-dark-muted hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AccountLayout>
  );
}
