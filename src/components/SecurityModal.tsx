import React from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';
import { SecurityConfirmationState } from '../types';

interface SecurityModalProps {
  state: SecurityConfirmationState;
  onConfirm: () => void;
  onCancel: () => void;
}

export const SecurityModal: React.FC<SecurityModalProps> = ({
  state,
  onConfirm,
  onCancel,
}) => {
  if (!state.isOpen) return null;

  const isCritical = state.riskLevel === 'CRITICAL';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl transition-all ${
          isCritical
            ? 'bg-rose-950/95 border-rose-500/50 text-slate-100 shadow-[0_0_50px_rgba(244,63,94,0.3)]'
            : 'bg-amber-950/95 border-amber-500/50 text-slate-100 shadow-[0_0_50px_rgba(245,158,11,0.3)]'
        }`}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`p-3 rounded-xl ${
              isCritical ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
            }`}
          >
            {isCritical ? (
              <ShieldAlert className="w-7 h-7 animate-pulse" />
            ) : (
              <AlertTriangle className="w-7 h-7" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold font-mono tracking-wide">
              {isCritical ? 'STRONG CONFIRMATION REQUIRED' : 'PROTECTED ACTION VERIFICATION'}
            </h3>
            <p className="text-xs opacity-80 font-mono">
              Risk Level: <span className="font-bold">{state.riskLevel}</span>
            </p>
          </div>
        </div>

        <div className="space-y-3 bg-black/40 rounded-xl p-4 border border-white/10 font-mono text-sm mb-6">
          <div>
            <span className="text-xs text-slate-400 block">COMMAND REQUESTED:</span>
            <span className="text-cyan-300 font-semibold">{state.command}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">PROTECTED ACTION:</span>
            <span className="text-amber-300 font-semibold">{state.action}</span>
          </div>
          <p className="text-xs text-slate-300 pt-2 border-t border-white/10">
            {state.description ||
              'This action alters system state or performs potentially irreversible operations. Explicit user authorization is required.'}
          </p>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-colors cursor-pointer"
          >
            <XCircle className="w-4 h-4" />
            Cancel / Abort
          </button>
          <button
            onClick={onConfirm}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              isCritical
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_15px_rgba(225,29,72,0.5)]'
                : 'bg-amber-600 hover:bg-amber-500 text-white shadow-[0_0_15px_rgba(217,119,6,0.5)]'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            Authorize Execution
          </button>
        </div>
      </div>
    </div>
  );
};
