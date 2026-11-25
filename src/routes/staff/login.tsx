import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { PublicLayout } from '@/components/common/PublicLayout';
import { useHealthcare } from '@/lib/healthcare-store';
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  UserCheck,
  Stethoscope,
  Pill,
  FlaskConical,
  Truck,
  Building,
  LogIn,
  Eye,
  EyeOff,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/staff/login')({
  head: () => ({
    meta: [
      { title: 'Staff & Clinician Portal Login — Two Brothers Healthcare' },
      {
        name: 'description',
        content: 'Authorized login for medical officers, licensed pharmacists, phlebotomists, and operations staff.',
      },
    ],
  }),
  component: StaffLoginPage,
});

function StaffLoginPage() {
  const { login } = useHealthcare();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleStaffLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      toast.error('Please enter employee username/email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await login(identifier, password);
      if (!res.success || !res.user) {
        toast.error(res.error || 'Authentication failed. Please verify credentials.');
        return;
      }

      if (res.user.role === 'patient') {
        toast.error('This account is registered as a Patient. Please use Patient Portal Login.');
        return;
      }

      toast.success(`Staff authorization confirmed: ${res.user.fullName} (${res.user.role.toUpperCase()})`);

      if (res.user.role === 'admin') {
        navigate({ to: '/admin' });
      } else {
        navigate({ to: '/staff' });
      }
    } catch {
      toast.error('An error occurred during authentication.');
    } finally {
      setLoading(false);
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
              Staff & Clinician Login
            </h1>
            <p className="text-xs text-[#64748B]">
              Secure internal portal access for Two Brothers Healthcare clinicians & personnel.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#EBF5FF] border border-blue-200 text-[#0755D9] text-xs leading-relaxed flex items-start gap-2.5">
            <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5" />
            <span>
              Unrestricted role switching has been disabled. All roles require authenticated credentials verified against the Super Admin registry.
            </span>
          </div>

          <form onSubmit={handleStaffLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#082653] block mb-1">
                Employee Username / Email
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. drsuresh, phmanish, or kushal"
                className="w-full px-4 py-3 rounded-2xl bg-[#F2F8FF] border border-blue-200 text-[#10243B] text-xs focus:outline-none focus:border-[#0755D9]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#082653] block mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-4 pr-10 py-3 rounded-2xl bg-[#F2F8FF] border border-blue-200 text-[#10243B] text-xs focus:outline-none focus:border-[#0755D9]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#082653]"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-[#082653] hover:bg-[#0755D9] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <LogIn className="h-4 w-4 text-[#00AAFF]" />
              <span>{loading ? 'Authenticating...' : 'Sign In as Staff'}</span>
            </button>
          </form>

          <div className="text-center pt-2 text-xs text-[#64748B]">
            Patient?{' '}
            <Link to="/login" className="text-[#0755D9] font-bold hover:underline">
              Go to Unified Portal Login →
            </Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
