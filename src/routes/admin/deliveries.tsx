import { createFileRoute } from '@tanstack/react-router';
import { useState, useMemo } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useHealthcare } from '@/lib/healthcare-store';
import { DeliveryRequest } from '@/types/healthcare';
import {
  Truck,
  Search,
  MapPin,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/deliveries')({
  head: () => ({
    meta: [
      { title: 'Delivery Management — Two Brothers Healthcare' },
      { name: 'description', content: 'Track home medicine deliveries, rider assignments, and Lalitpur courier fulfillment.' },
    ],
  }),
  component: AdminDeliveriesPage,
});

function getDeliveryBadge(status: DeliveryRequest['status']) {
  switch (status) {
    case 'completed':
      return 'bg-emerald-50 text-[#10B981] border-emerald-200';
    case 'dispatched':
      return 'bg-blue-50 text-[#0755D9] border-blue-200';
    case 'ready':
    case 'preparing':
    case 'accepted':
      return 'bg-amber-50 text-[#F59E0B] border-amber-200';
    case 'cancelled':
      return 'bg-rose-50 text-[#EF4444] border-rose-200';
    default:
      return 'bg-slate-100 text-[#64748B] border-slate-200';
  }
}

function AdminDeliveriesPage() {
  const { deliveries, updateDeliveryStatus } = useHealthcare();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return deliveries.filter((d) => {
      const matchSearch =
        !q ||
        d.referenceId.toLowerCase().includes(q) ||
        d.patientName.toLowerCase().includes(q) ||
        d.address.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'all' || d.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [deliveries, searchTerm, statusFilter]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#082653]">Delivery Management</h1>
            <p className="text-xs text-[#64748B] mt-0.5">
              Coordinate doorstep medicine dispatch, rider tracking, and delivery confirmation.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2ECFA] p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search DEL ID, patient, or address..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F4F8FE] border border-[#E2ECFA] text-xs text-[#10243B]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#F4F8FE] border border-[#E2ECFA] text-xs font-medium text-[#10243B]"
          >
            <option value="all">All Deliveries ({deliveries.length})</option>
            <option value="accepted">Accepted</option>
            <option value="preparing">Preparing</option>
            <option value="ready">Ready</option>
            <option value="dispatched">Dispatched</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2ECFA] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F4F8FE] border-b border-slate-100 text-[#64748B]">
                  <th className="py-3.5 px-4 font-semibold">Delivery ID</th>
                  <th className="py-3.5 px-4 font-semibold">Patient &amp; Zone</th>
                  <th className="py-3.5 px-4 font-semibold">Items</th>
                  <th className="py-3.5 px-4 font-semibold">Assigned Rider</th>
                  <th className="py-3.5 px-4 font-semibold">Amount</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[#64748B]">
                      <Truck className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                      No delivery requests found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((del) => (
                    <tr key={del.id} className="hover:bg-[#F4F8FE]/60">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#0755D9]">{del.referenceId}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#10243B]">{del.patientName}</div>
                        <div className="text-[11px] text-[#64748B] flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-[#0755D9]" />
                          {del.address}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-[#10243B] max-w-xs">{del.itemsSummary}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-[#10243B]">{del.assignedStaffName || 'Unassigned'}</div>
                        {del.estimatedDeliveryTime && (
                          <div className="text-[11px] text-[#64748B] flex items-center gap-1">
                            <Clock className="h-3 w-3" /> ETA {del.estimatedDeliveryTime}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#082653]">NPR {del.totalAmount.toLocaleString()}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold border capitalize ${getDeliveryBadge(del.status)}`}
                        >
                          {del.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <select
                          value={del.status}
                          onChange={(e) => {
                            const next = e.target.value as DeliveryRequest['status'];
                            updateDeliveryStatus(del.id, next);
                            toast.success(`Delivery ${del.referenceId} updated to ${next}.`);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-[#F4F8FE] border border-[#E2ECFA] text-[11px] font-semibold text-[#082653]"
                        >
                          <option value="accepted">Accepted</option>
                          <option value="preparing">Preparing</option>
                          <option value="ready">Ready</option>
                          <option value="dispatched">Dispatched</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
