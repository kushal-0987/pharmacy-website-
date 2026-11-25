import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { HealthcareProviderComponent, useHealthcare } from '@/lib/healthcare-store';
import { I18nProvider } from '@/lib/i18n';
import { ThreeDotAccountMenu } from '@/components/common/ThreeDotAccountMenu';

// Mock @tanstack/react-router Link and useNavigate for unit testing components
import { vi } from 'vitest';
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to, ...props }: any) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  useNavigate: () => vi.fn(),
  useRouterState: () => ({ location: { pathname: '/' } }),
}));

const AuthHarness: React.FC = () => {
  const { isAuthenticated, activeAccount, currentRole, currentUser, login, logout, setCurrentRole } = useHealthcare();
  return (
    <div>
      <div data-testid="auth-state">{isAuthenticated ? 'authenticated' : 'guest'}</div>
      <div data-testid="user-name">{currentUser.name}</div>
      <div data-testid="user-role">{currentRole}</div>
      <div data-testid="account-id">{activeAccount?.id || 'none'}</div>
      <ThreeDotAccountMenu />
      <button type="button" onClick={() => login('bikash', 'Patient@123')}>
        Login Patient
      </button>
      <button type="button" onClick={() => login('drsuresh', 'Doctor@123')}>
        Login Doctor
      </button>
      <button type="button" onClick={() => login('phmanish', 'Pharma@123')}>
        Login Pharmacist
      </button>
      <button type="button" onClick={() => login('rohan', 'Lab@123')}>
        Login Lab
      </button>
      <button type="button" onClick={() => login('puja', 'Front@123')}>
        Login Receptionist
      </button>
      <button type="button" onClick={() => login('prakash', 'Rider@123')}>
        Login Delivery
      </button>
      <button type="button" onClick={() => login('kushal', 'Admin@123')}>
        Login Admin
      </button>
      <button type="button" onClick={() => setCurrentRole('admin')}>
        Try Escalate
      </button>
      <button type="button" onClick={() => logout()}>
        Do Logout
      </button>
    </div>
  );
};

const renderHarness = () =>
  render(
    <I18nProvider>
      <HealthcareProviderComponent>
        <AuthHarness />
      </HealthcareProviderComponent>
    </I18nProvider>
  );

describe('Navigation, Guest Isolation & 8-State Auth Verification', () => {
  beforeEach(() => {
    const store = new Map<string, string>();
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      writable: true,
      value: {
        getItem: (k: string) => store.get(k) ?? null,
        setItem: (k: string, v: string) => {
          store.set(k, String(v));
        },
        removeItem: (k: string) => {
          store.delete(k);
        },
        clear: () => {
          store.clear();
        },
      },
    });
  });

  it('defaults to unauthenticated Guest Visitor without exposing internal roles or security notice', () => {
    renderHarness();
    expect(screen.getByTestId('auth-state').textContent).toBe('guest');
    expect(screen.getByTestId('user-name').textContent).toBe('Guest Visitor');

    const menuTrigger = screen.getByRole('button', { name: /visitor and access menu/i });
    fireEvent.click(menuTrigger);

    expect(screen.getAllByText('Guest Visitor').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('Welcome to Two Brothers')).toBeTruthy();
    expect(screen.getByText('Login / Admin Access')).toBeTruthy();
    expect(screen.getByText('About This Website')).toBeTruthy();

    expect(screen.queryByText(/Security Notice/i)).toBeNull();
    expect(screen.queryByText(/Role switching is restricted/i)).toBeNull();
    expect(screen.queryByText(/Kushal Pokhrel/i)).toBeNull();
    expect(screen.queryByText(/Manage Users & Roles/i)).toBeNull();
    expect(screen.queryByText('Logout')).toBeNull();
  });

  it('authenticates all 7 roles cleanly, blocks frontend role escalation, and scopes Manage Users strictly to Super Admin', async () => {
    renderHarness();

    const cases: { btn: string; expectedName: string; expectedRole: string; isAdmin: boolean }[] = [
      { btn: 'Login Patient', expectedName: 'Bikash', expectedRole: 'patient', isAdmin: false },
      { btn: 'Login Doctor', expectedName: 'Dr. Suresh Shrestha', expectedRole: 'doctor', isAdmin: false },
      { btn: 'Login Pharmacist', expectedName: 'Ph. Manish Shrestha', expectedRole: 'pharmacist', isAdmin: false },
      { btn: 'Login Lab', expectedName: 'Rohan Shakya', expectedRole: 'lab_staff', isAdmin: false },
      { btn: 'Login Receptionist', expectedName: 'Puja Joshi', expectedRole: 'receptionist', isAdmin: false },
      { btn: 'Login Delivery', expectedName: 'Prakash Tamang', expectedRole: 'delivery', isAdmin: false },
      { btn: 'Login Admin', expectedName: 'Kushal Pokhrel', expectedRole: 'admin', isAdmin: true },
    ];

    for (const c of cases) {
      fireEvent.click(screen.getByText(c.btn));
      await waitFor(() => {
        expect(screen.getByTestId('auth-state').textContent).toBe('authenticated');
        expect(screen.getByTestId('user-name').textContent).toBe(c.expectedName);
        expect(screen.getByTestId('user-role').textContent).toBe(c.expectedRole);
      });

      // Attempt unauthorized role escalation
      fireEvent.click(screen.getByText('Try Escalate'));
      expect(screen.getByTestId('user-role').textContent).toBe(c.expectedRole);

      // Open Three-Dot menu and inspect scoped permissions
      const trigger = screen.getByRole('button', { name: /account menu/i });
      fireEvent.click(trigger);

      expect(screen.getByText('My Account')).toBeTruthy();
      expect(screen.getByText('Logout')).toBeTruthy();
      if (c.isAdmin) {
        expect(screen.getByText(/Manage Users & Roles/i)).toBeTruthy();
      } else {
        expect(screen.queryByText(/Manage Users & Roles/i)).toBeNull();
      }

      // Close menu & logout
      fireEvent.click(trigger);
      fireEvent.click(screen.getByText('Do Logout'));
      expect(screen.getByTestId('auth-state').textContent).toBe('guest');
      expect(screen.getByTestId('user-name').textContent).toBe('Guest Visitor');
    }
  });
});
