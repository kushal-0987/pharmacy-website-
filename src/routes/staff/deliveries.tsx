import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { StaffLayout } from '@/components/staff/StaffLayout';
import { useHealthcare } from '@/lib/healthcare-store';
import { DeliveryRequest, DeliveryStatus } from '@/types/healthcare';
import {
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
  PhoneCall,
  User,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/staff/deliveries')({
  head: () => ({
    meta: [
      { title: 'Medicine Delivery Dispatch Kanban — Two Brothers Healthcare' },
      { name: 'description', content: 'Courier logistics board for Sanagau, Lalitpur, and Kathmandu prescription deliveries.' },
    ],
  }),
  component: StaffDeliveriesKanbanPage,
});

function StaffDeliveriesKanbanPage() {
  const { deliveries, updateDeliveryStatus } = useHealthcare();

  const columns: { id: DeliveryStatus; label: string; color: string }[] = [
    { id: 'accepted', label: 'Accepted', color: 'border-cyan/30 text-cyan' },
    { id: 'preparing', label: 'Preparing', color: 'border-teal/30 text-teal' },
    { id: 'ready', label: 'Ready for Rider', color: 'border-warm-gold/30 text-warm-gold' },
    { id: 'dispatched', label: 'Dispatched (En Route)', color: 'border-leaf/30 text-leaf' },
    { id: 'completed', label: 'Delivered', color: 'border-on-dark/20 text-on-dark-muted' },
  ];

  const handleAdvanceStatus = (id: string, current: DeliveryStatus) => {
    const nextMap: Record<DeliveryStatus, DeliveryStatus> = {
      accepted: 'preparing',
      preparing: 'ready',
      ready: 'dispatched',
      dispatched: 'completed',
      completed: 'completed',
      cancelled: 'cancelled',
    };
    const next = nextMap[current];
    if (next !== current) {
      updateDeliveryStatus(id, next);
      toast.success(`Delivery advanced to ${next.toUpperCase()}`);
    }
  };

  return (
    <StaffLayout>
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="pb-4 border-b border-on-dark/15">
          <h1 className="font-display text-2xl font-bold text-white">Doorstep Courier Kanban Board</h1>
          <p className="text-xs text-on-dark-muted">
            Track and advance prescription fulfillment from order acceptance to doorstep delivery.
          </p>
        </div>

        {/* 5-Column Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto min-h-[500px]">
          {columns.map((col) => {
            const colDeliveries = deliveries.filter((d) => d.status === col.id);

            return (
              <div
                key={col.id}
                className="rounded-3xl bg-midnight/40 border border-on-dark/15 p-4 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-on-dark/10 mb-3">
                    <span className={`text-xs font-bold uppercase tracking-wider ${col.color}`}>
                      {col.label}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-navy-deep text-white">
                      {colDeliveries.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {colDeliveries.map((del) => (
                      <div
                        key={del.id}
                        className="p-4 rounded-2xl bg-navy-deep border border-on-dark/15 text-xs space-y-2 shadow-lg"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">{del.patientName}</span>
                          <span className="text-[10px] text-teal font-mono">{del.referenceId}</span>
                        </div>

                        <div className="text-on-dark-muted line-clamp-2">
                          {del.itemsSummary}
                        </div>

                        <div className="text-[11px] text-on-dark-muted/80 flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-cyan shrink-0" />
                          <span className="truncate">{del.address}</span>
                        </div>

                        <div className="pt-2 border-t border-on-dark/10 flex items-center justify-between font-semibold">
                          <span className="text-cyan">NPR {del.totalAmount}</span>
                          {del.status !== 'completed' && (
                            <button
                              type="button"
                              onClick={() => handleAdvanceStatus(del.id, del.status)}
                              className="px-2.5 py-1 rounded-lg bg-teal/20 text-cyan hover:bg-cyan hover:text-navy-deep text-[10px] font-bold transition-colors flex items-center gap-1"
                            >
                              <span>Next</span>
                              <ArrowRight className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-center text-[10px] text-on-dark-muted/60 pt-2">
                  Sanagau Logistics
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </StaffLayout>
  );
}
