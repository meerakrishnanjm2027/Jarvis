import React, { useState } from 'react';
import { Terminal, Shield, AlertTriangle, Activity } from 'lucide-react';
import { CommandHistoryItem } from '../types';

interface AuditLogProps {
  history: CommandHistoryItem[];
}

export const AuditLog: React.FC<AuditLogProps> = ({ history }) => {
  const [activeTab, setActiveTab] = useState<'ACTIONS' | 'SYSTEM' | 'SECURITY'>('ACTIONS');

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          <h2 className="text-base font-bold font-mono text-slate-100">
            STRUCTURED LOGS & AUDIT TRAIL
          </h2>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-xs">
          <button
            onClick={() => setActiveTab('ACTIONS')}
            className={`px-3 py-1 rounded-lg border transition-colors cursor-pointer ${
              activeTab === 'ACTIONS'
                ? 'bg-cyan-950/80 border-cyan-500/40 text-cyan-300'
                : 'bg-slate-800/60 border-slate-700 text-slate-400'
            }`}
          >
            actions.log ({history.length})
          </button>
          <button
            onClick={() => setActiveTab('SECURITY')}
            className={`px-3 py-1 rounded-lg border transition-colors cursor-pointer ${
              activeTab === 'SECURITY'
                ? 'bg-amber-950/80 border-amber-500/40 text-amber-300'
                : 'bg-slate-800/60 border-slate-700 text-slate-400'
            }`}
          >
            security.log
          </button>
          <button
            onClick={() => setActiveTab('SYSTEM')}
            className={`px-3 py-1 rounded-lg border transition-colors cursor-pointer ${
              activeTab === 'SYSTEM'
                ? 'bg-slate-800 border-slate-600 text-slate-200'
                : 'bg-slate-800/60 border-slate-700 text-slate-400'
            }`}
          >
            jarvis.log
          </button>
        </div>
      </div>

      <div className="bg-slate-950/90 rounded-xl border border-slate-800 p-4 font-mono text-xs h-48 overflow-y-auto space-y-2">
        {activeTab === 'ACTIONS' && (
          history.length > 0 ? (
            history.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 rounded bg-slate-900/60 border border-slate-800/60"
              >
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">{item.timestamp}</span>
                  <span className="text-cyan-400 font-bold">[{item.route}]</span>
                  <span className="text-slate-200">"{item.command}"</span>
                  <span className="text-slate-400">&rarr; {item.action}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`font-bold ${
                      item.status === 'SUCCESS'
                        ? 'text-emerald-400'
                        : item.status === 'REQUIRES_CONFIRMATION'
                        ? 'text-amber-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {item.status}
                  </span>
                  {item.verified && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                      VERIFIED
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-slate-500 italic p-2">No actions recorded yet. Run a command above.</div>
          )
        )}

        {activeTab === 'SECURITY' && (
          <div className="space-y-1.5 text-slate-300">
            <div className="text-emerald-400">&bull; [SECURITY] Whitelist validation initialized. Arbitrary shell execution strictly BLOCKED.</div>
            <div className="text-cyan-400">&bull; [SECURITY] Confirmation policy active: Protected actions require explicit user authorization.</div>
            <div className="text-slate-400">&bull; [SECURITY] Credential sanitization: Active regex filters for API keys and tokens.</div>
          </div>
        )}

        {activeTab === 'SYSTEM' && (
          <div className="space-y-1.5 text-slate-300">
            <div className="text-cyan-400">&bull; [STARTUP] JARVIS Mark-LIV core initialized. Mode: HYBRID.</div>
            <div className="text-slate-400">&bull; [CONFIG] settings.json loaded. 7 built-in command patterns compiled.</div>
            <div className="text-slate-400">&bull; [ROUTER] Hybrid Intent Router listening for LOCAL, ONLINE, AI_CHAT, DEVICE.</div>
          </div>
        )}
      </div>
    </div>
  );
};
