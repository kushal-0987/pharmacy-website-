import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { PublicLayout } from '@/components/common/PublicLayout';
import { useHealthcare } from '@/lib/healthcare-store';
import {
  LogIn,
  Eye,
  EyeOff,
  KeyRound,
} from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/login')({
  head: () => ({
    meta: [
      { title: 'Secure Portal Login — Two Brothers Healthcare' },
      {
        name: 'description',
        content: 'Unified secure login for patients, medical officers, pharmacists, and administrative personnel.',
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login, changePassword, activeAccount } = useHealthcare();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // First-login password change state
  const [mustChangePasswordModal, setMustChangePasswordModal] = useState(false);
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [changingPass, setChangingPass] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      toast.error('Please enter your username/email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await login(identifier, password);
      if (!res.success || !res.user) {
        toast.error(res.error || 'Login failed. Please check your credentials.');
        return;
      }

      toast.success(`Welcome back, ${res.user.fullName}!`);

      if (res.mustChangePassword) {
        setOldPass(password);
        setMustChangePasswordModal(true);
        return;
      }

      redirectByRole(res.user.role);
    } catch {
      toast.error('A network or authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const redirectByRole = (role: string) => {
    if (role === 'admin') {
      navigate({ to: '/admin' });
    } else if (['doctor', 'pharmacist', 'lab_staff', 'receptionist', 'delivery'].includes(role)) {
      navigate({ to: '/staff' });
    } else {
      navigate({ to: '/account' });
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      toast.error('New passwords do not match.');
      return;
    }
    if (newPass.length < 6) {
      toast.error('New password must be at least 6 characters long.');
      return;
    }

    setChangingPass(true);
    try {
      const res = await changePassword(oldPass, newPass);
      if (res.success) {
        toast.success('Password updated successfully!');
        setMustChangePasswordModal(false);
        if (activeAccount) {
          redirectByRole(activeAccount.role);
        }
      } else {
        toast.error(res.error || 'Failed to update password.');
      }
    } catch {
      toast.error('Failed to change password.');
    } finally {
      setChangingPass(false);
    }
  };

  return (
    <PublicLayout>
      <div className="py-20 bg-[#F2F8FF] min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 text-[#10243B]">
        <div className="max-w-md w-full bg-white border border-blue-100 rounded-3xl p-8 sm:p-10 shadow-[0_12px_45px_rgba(7,85,217,0.08)] space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="h-16 w-16 rounded-2xl bg-white p-2 ring-2 ring-blue-100 shadow-md mx-auto flex items-center justify-center">
              <img src="/logo.png" alt="Two Brothers Healthcare logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="font-display text-2xl font-bold text-[#082653]">
              Unified Portal Login
            </h1>
            <p className="text-xs text-[#64748B]">
              Enter your credentials. The system automatically identifies your role and routes to your dashboard.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#082653] block mb-1">
                Username, Email or Mobile
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter your username, email, or mobile"
                  className="w-full px-4 py-3 rounded-2xl bg-[#F2F8FF] border border-blue-200 text-[#10243B] text-xs focus:outline-none focus:border-[#0755D9]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-[#082653]">Password</label>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    toast.info('Please contact our clinic administrator for password recovery assistance.');
                  }}
                  className="text-[11px] text-[#0755D9] hover:underline"
                >
                  Forgot password?
                </a>
              </div>
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
              className="w-full py-3.5 rounded-full bg-[#0755D9] hover:bg-[#00AAFF] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <LogIn className="h-4 w-4" />
              <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
            </button>
          </form>

          {/* Patient Registration Link */}
          <div className="pt-4 border-t border-slate-100 text-center text-xs text-[#64748B] space-y-2">
            <div>
              New patient?{' '}
              <Link to="/register" className="font-semibold text-[#0755D9] hover:underline">
                Register for Patient Portal →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* First-login Password Change Modal */}
      {mustChangePasswordModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-blue-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-[#082653]">Password Change Required</h3>
                <p className="text-xs text-[#64748B]">You are logging in with a temporary password. Please set a new secure password.</p>
              </div>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-semibold text-[#64748B] block mb-1">New Password (min. 6 characters)</label>
                <input
                  type="password"
                  required
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#0755D9]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#64748B] block mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#0755D9]"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={changingPass}
                  className="w-full py-2.5 rounded-full bg-[#0755D9] hover:bg-[#00AAFF] text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
                >
                  {changingPass ? 'Updating...' : 'Set New Password & Proceed'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PublicLayout>
  );
}
