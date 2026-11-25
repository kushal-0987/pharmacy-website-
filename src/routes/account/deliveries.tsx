import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { AccountLayout } from '@/components/account/AccountLayout';
import { useHealthcare } from '@/lib/healthcare-store';
import {
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
  PhoneCall,
  Plus,
  Building,
  Navigation,
} from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/account/deliveries')({
  head: () => ({
    meta: [
      { title: 'Medicine Delivery Tracking — Two Brothers Healthcare' },
      { name: 'description', content: 'Track your medicine doorstep deliveries with live timeline and address book in Lalitpur.' },
    ],
  }),
  component: DeliveriesPage,
});

function DeliveriesPage() {
  const { deliveries, currentUser, updateCurrentUser } = useHealthcare();

  const [newLabel, setNewLabel] = useState('Home');
  const [newAddress, setNewAddress] = useState('');
  const [newCity, setNewCity] = useState('Sanagau, Lalitpur');
  const [showAddAddress, setShowAddAddress] = useState(false);

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.trim()) return;

    const existing = currentUser.addresses || [];
    const updated = [
      ...existing,
      {
        id: 'addr-' + Date.now(),
        label: newLabel,
        address: newAddress,
        city: newCity,
        isDefault: existing.length === 0,
      },
    ];

    updateCurrentUser({ addresses: updated });
    toast.success('Address added to your address book!');
    setNewAddress('');
    setShowAddAddress(false);
  };

  const steps = ['accepted', 'preparing', 'ready', 'dispatched', 'completed'];

  return (
    <AccountLayout>
      <div className="space-y-8 animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-on-dark/15">
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Doorstep Delivery Tracking</h1>
            <p className="text-xs text-on-dark-muted">
              Live status timelines for medicine courier across Lalitpur and Kathmandu.
            </p>
          </div>

          <Link
            to="/pharmacy"
            className="px-5 py-2.5 rounded-full bg-cyan text-navy-deep font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all inline-flex items-center gap-2"
          >
            <Truck className="h-4 w-4" />
            <span>Order New Medicine Delivery</span>
          </Link>
        </div>

        {/* Active Deliveries with Timeline */}
        <div className="space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-teal">
            Active Deliveries ({deliveries.length})
          </h2>

          {deliveries.length === 0 ? (
            <div className="py-12 text-center rounded-3xl bg-midnight/30 border border-on-dark/15 p-8">
              <Truck className="h-10 w-10 text-on-dark-muted mx-auto mb-3" />
              <div className="font-bold text-white text-base">No active delivery requests</div>
              <p className="text-xs text-on-dark-muted mt-1">
                Your medicine dispatches will appear here with live rider tracking.
              </p>
            </div>
          ) : (
            deliveries.map((del) => {
              const currentStepIdx = steps.indexOf(del.status);

              return (
                <div
                  key={del.id}
                  className="rounded-3xl bg-midnight/60 border border-teal/40 p-6 sm:p-8 space-y-6 shadow-xl"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-on-dark/10">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display text-lg font-bold text-white">
                          Delivery #{del.referenceId}
                        </span>
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-cyan/20 text-cyan uppercase">
                          {del.status}
                        </span>
                      </div>
                      <div className="text-xs text-on-dark-muted mt-0.5">
                        Items: {del.itemsSummary}
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="text-xs text-on-dark-muted">Total Cash on Delivery:</div>
                      <div className="text-lg font-bold text-cyan">NPR {del.totalAmount}</div>
                    </div>
                  </div>

                  {/* 5-Stage Visual Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-on-dark-muted">
                      <span>Order Accepted</span>
                      <span>Dispensing</span>
                      <span>Packed</span>
                      <span>Dispatched (Rider)</span>
                      <span>Delivered</span>
                    </div>

                    <div className="grid grid-cols-5 gap-2">
                      {steps.map((st, idx) => (
                        <div
                          key={st}
                          className={`h-2 rounded-full transition-all ${
                            idx <= currentStepIdx ? 'bg-cyan' : 'bg-navy-deep'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Rider & Address Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                    <div className="p-4 rounded-2xl bg-navy-deep border border-on-dark/15 space-y-1">
                      <span className="text-teal font-bold block">Assigned Rider:</span>
                      <div className="text-white font-semibold flex items-center gap-2">
                        <Navigation className="h-4 w-4 text-cyan" />
                        <span>{del.assignedStaffName || 'Prakash Tamang (Rider #3)'}</span>
                      </div>
                      <div className="text-[11px] text-leaf">
                        Estimated Arrival: {del.estimatedDeliveryTime || '35 mins'}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-navy-deep border border-on-dark/15 space-y-1">
                      <span className="text-teal font-bold block">Delivery Location:</span>
                      <div className="text-white font-semibold flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-cyan" />
                        <span>{del.address}</span>
                      </div>
                      <div className="text-[11px] text-on-dark-muted">
                        Contact: {del.phone}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Delivery Address Book */}
        <div className="rounded-3xl bg-midnight/40 border border-on-dark/15 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <MapPin className="h-4 w-4 text-cyan" /> Saved Delivery Addresses
            </h2>
            <button
              type="button"
              onClick={() => setShowAddAddress(!showAddAddress)}
              className="px-4 py-1.5 rounded-full bg-cyan text-navy-deep font-bold text-xs"
            >
              + Add New Address
            </button>
          </div>

          {showAddAddress && (
            <form onSubmit={handleAddAddress} className="p-5 rounded-2xl bg-navy-deep border border-teal/40 space-y-3 text-xs animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-white font-semibold block mb-1">Label</label>
                  <input
                    type="text"
                    required
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    placeholder="Home / Work / Parents"
                    className="w-full px-3 py-2 rounded-xl bg-midnight border border-on-dark/20 text-white"
                  />
                </div>
                <div>
                  <label className="text-white font-semibold block mb-1">Street Address & Landmark</label>
                  <input
                    type="text"
                    required
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    placeholder="Ward No. 4, Near Shiva Temple"
                    className="w-full px-3 py-2 rounded-xl bg-midnight border border-on-dark/20 text-white"
                  />
                </div>
                <div>
                  <label className="text-white font-semibold block mb-1">City / Municipality</label>
                  <input
                    type="text"
                    required
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-midnight border border-on-dark/20 text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddAddress(false)}
                  className="px-4 py-1.5 rounded-full text-on-dark-muted hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded-full bg-cyan text-navy-deep font-bold"
                >
                  Save Address
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentUser.addresses?.map((addr) => (
              <div
                key={addr.id}
                className="p-4 rounded-2xl bg-navy-deep border border-on-dark/15 text-xs space-y-1 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{addr.label}</span>
                  {addr.isDefault && (
                    <span className="text-[10px] bg-leaf/20 text-leaf px-2 py-0.5 rounded-md font-bold">
                      Default
                    </span>
                  )}
                </div>
                <div className="text-on-dark-muted">{addr.address}</div>
                <div className="text-teal font-medium">{addr.city}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AccountLayout>
  );
}
