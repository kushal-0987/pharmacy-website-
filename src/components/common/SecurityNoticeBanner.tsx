import React, { useState } from 'react';
import { ShieldCheck, X } from 'lucide-react';

export const SecurityNoticeBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 z-40 max-w-sm sm:max-w-md animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-blue-200/90 shadow-[0_10px_35px_rgba(7,85,217,0.12)] text-[#10243B]">
        <div className="h-9 w-9 rounded-xl bg-[#0755D9] text-white flex items-center justify-center shrink-0 shadow-sm">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div className="text-xs flex-1">
          <strong className="block font-bold text-[#082653] leading-tight">Security Notice</strong>
          <span className="text-[11px] text-[#64748B] leading-tight block mt-0.5">
            Role switching is restricted for security. Contact the Super Admin to assign roles.
          </span>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss security notice"
          className="p-1 rounded-full text-slate-400 hover:text-slate-600 transition-colors shrink-0"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
