import React from 'react';
import { Bot, Wifi, WifiOff, Sparkles, ShieldCheck } from 'lucide-react';
import { JarvisMode, NetworkStatus, GeminiStatus } from '../types';

interface JarvisHeaderProps {
  mode: JarvisMode;
  onModeChange: (mode: JarvisMode) => void;
  networkStatus: NetworkStatus;
  onToggleNetwork: () => void;
  geminiStatus: GeminiStatus;
}

export const JarvisHeader: React.FC<JarvisHeaderProps> = ({
  mode,
  onModeChange,
  networkStatus,
  onToggleNetwork,
  geminiStatus,
}) => {
  return (
    <header className="border-b border-cyan-500/20 bg-slate-950/80 backdrop-blur-md px-6 py-4 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-cyan-950/60 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
            <Bot className="w-6 h-6 text-cyan-400 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-wider text-slate-100 font-mono">
                JARVIS <span className="text-cyan-400 font-sans text-xs px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30">MARK-LIV</span>
              </h1>
            </div>
            <p className="text-xs text-slate-400">Hybrid AI PC Assistant &bull; Windows Core</p>
          </div>
        </div>

        {/* Live HUD Telemetry Indicators */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          {/* Mode Selector */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-700/80 rounded-lg px-3 py-1.5 text-slate-300">
            <span className="text-slate-400">Mode:</span>
            <select
              value={mode}
              onChange={(e) => onModeChange(e.target.value as JarvisMode)}
              className="bg-transparent font-bold text-cyan-400 focus:outline-none cursor-pointer"
            >
              <option value="HYBRID" className="bg-slate-900 text-slate-200">HYBRID</option>
              <option value="LOCAL" className="bg-slate-900 text-slate-200">LOCAL</option>
              <option value="ONLINE" className="bg-slate-900 text-slate-200">ONLINE</option>
              <option value="AI_CHAT" className="bg-slate-900 text-slate-200">AI_CHAT</option>
              <option value="DEVICE" className="bg-slate-900 text-slate-200">DEVICE</option>
            </select>
          </div>

          {/* Network State Button (Toggleable to test offline mode) */}
          <button
            onClick={onToggleNetwork}
            title="Click to toggle Internet connectivity for offline testing"
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              networkStatus === 'ONLINE'
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400 hover:bg-emerald-950/70'
                : 'bg-rose-950/40 border-rose-500/40 text-rose-400 hover:bg-rose-950/70'
            }`}
          >
            {networkStatus === 'ONLINE' ? (
              <>
                <Wifi className="w-3.5 h-3.5" />
                <span>Internet: ONLINE</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5" />
                <span>Internet: OFFLINE</span>
              </>
            )}
          </button>

          {/* Gemini AI Status */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
              geminiStatus === 'CONNECTED'
                ? 'bg-indigo-950/40 border-indigo-500/40 text-indigo-300'
                : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Gemini: {geminiStatus}</span>
          </div>

          {/* Security Subsystem indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700/60 bg-slate-900/60 text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Security: ACTIVE</span>
          </div>
        </div>
      </div>
    </header>
  );
};
