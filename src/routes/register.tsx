import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { PublicLayout } from '@/components/common/PublicLayout';
import { useHealthcare } from '@/lib/healthcare-store';
import {
  UserPlus,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/register')({
  head: () => ({
    meta: [
      { title: 'Register Patient Account — Two Brothers Healthcare' },
      {
        name: 'description',
        content: 'Create a patient account to manage family appointments, store prescriptions, and monitor diagnostic trends.',
      },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const { registerPatient } = useHealthcare();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      toast.error('Please agree to terms and privacy policies.');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    const cleanUsername = (username || name.toLowerCase().replace(/\s+/g, '')).trim().toLowerCase();

    setSubmitting(true);
    try {
      const res = await registerPatient({
        fullName: name.trim(),
        username: cleanUsername,
        email: email.trim(),
        phone: phone.trim(),
        password,
      });

      if (!res.success) {
        toast.error(res.error || 'Failed to register account.');
        return;
      }

      toast.success(`Patient account registered successfully for ${name}!`);
      navigate({ to: '/account' });
    } catch {
      toast.error('Failed to register account.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PublicLayout>
      <div className="py-20 bg-[#F2F8FF] min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 text-[#10243B]">
        <div className="max-w-md w-full bg-white border border-blue-100 rounded-3xl p-8 sm:p-10 shadow-[0_12px_45px_rgba(7,85,217,0.08)] space-y-6">
          <div className="text-center space-y-3">
            <div className="h-16 w-16 rounded-2xl bg-white p-2 ring-2 ring-blue-100 shadow-md mx-auto flex items-center justify-center">
              <img src="/logo.png" alt="Two Brothers Healthcare logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="font-display text-2xl font-bold text-[#082653]">
              Create Patient Account
            </h1>
            <p className="text-xs text-[#64748B]">
              Fast, single-dashboard access for all family appointments and medical history in Sanagau.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-[#EBF5FF] border border-blue-200 text-[#0755D9] text-[11px] flex items-start gap-2">
            <Info className="h-4 w-4 shrink-0 mt-0.5" />
            <span>
              Public registration is available exclusively for <strong>Patient</strong> accounts. Staff and Clinician accounts are provisioned by the Super Admin.
            </span>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#082653] block mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!username) setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''));
                }}
                placeholder="e.g. Bikash Shrestha"
                className="w-full px-4 py-3 rounded-2xl bg-[#F2F8FF] border border-blue-200 text-[#10243B] text-xs focus:outline-none focus:border-[#0755D9]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#082653] block mb-1">
                  Username *
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. bikash"
                  className="w-full px-4 py-3 rounded-2xl bg-[#F2F8FF] border border-blue-200 text-[#10243B] text-xs focus:outline-none focus:border-[#0755D9]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#082653] block mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9851098765"
                  className="w-full px-4 py-3 rounded-2xl bg-[#F2F8FF] border border-blue-200 text-[#10243B] text-xs focus:outline-none focus:border-[#0755D9]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#082653] block mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="bikash@example.com"
                className="w-full px-4 py-3 rounded-2xl bg-[#F2F8FF] border border-blue-200 text-[#10243B] text-xs focus:outline-none focus:border-[#0755D9]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#082653] block mb-1">
                Password (min. 6 characters) *
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-2xl bg-[#F2F8FF] border border-blue-200 text-[#10243B] text-xs focus:outline-none focus:border-[#0755D9]"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="h-4 w-4 rounded text-[#0755D9] border-slate-300 focus:ring-0"
              />
              <label htmlFor="terms" className="text-[11px] text-[#64748B]">
                I agree to Two Brothers Healthcare <Link to="/terms" className="text-[#0755D9] underline">Terms</Link> and <Link to="/privacy" className="text-[#0755D9] underline">Privacy Policy</Link>.
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-full bg-[#0755D9] hover:bg-[#00AAFF] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <UserPlus className="h-4 w-4" />
              <span>{submitting ? 'Registering...' : 'Register Patient Account'}</span>
            </button>
          </form>

          <div className="text-center pt-2 text-xs text-[#64748B]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#0755D9] font-bold hover:underline">
              Log In →
            </Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
