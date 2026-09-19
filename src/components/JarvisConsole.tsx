import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, Volume2, VolumeX, Terminal, CheckCircle2, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { ActionStatus, CommandRoute } from '../types';

interface JarvisConsoleProps {
  listening: boolean;
  onToggleListening: () => void;
  lastCommand: string;
  status: ActionStatus;
  resultMessage: string;
  route: CommandRoute;
  onExecuteCommand: (command: string) => void;
  ttsEnabled: boolean;
  onToggleTts: () => void;
  isProcessing: boolean;
}

export const JarvisConsole: React.FC<JarvisConsoleProps> = ({
  listening,
  onToggleListening,
  lastCommand,
  status,
  resultMessage,
  route,
  onExecuteCommand,
  ttsEnabled,
  onToggleTts,
  isProcessing,
}) => {
  const [inputVal, setInputVal] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim() && !isProcessing) {
      onExecuteCommand(inputVal.trim());
      setInputVal('');
    }
  };

  // Status visual configurations
  const getStatusBadge = () => {
    switch (status) {
      case 'SUCCESS':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            SUCCESS
          </span>
        );
      case 'FAILED':
      case 'ERROR':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-950/80 text-rose-400 border border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.2)]">
            <XCircle className="w-3.5 h-3.5" />
            {status}
          </span>
        );
      case 'REQUIRES_CONFIRMATION':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-950/80 text-amber-400 border border-amber-500/40 animate-pulse">
            <AlertCircle className="w-3.5 h-3.5" />
            CONFIRMATION NEEDED
          </span>
        );
      case 'EXECUTING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-950/80 text-cyan-400 border border-cyan-500/40">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            EXECUTING
          </span>
        );
      case 'LISTENING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-950/80 text-indigo-400 border border-indigo-500/40 animate-pulse">
            <Mic className="w-3.5 h-3.5" />
            LISTENING...
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
            IDLE / READY
          </span>
        );
    }
  };

  const getRouteBadge = () => {
    const colors: Record<CommandRoute, string> = {
      LOCAL: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30',
      ONLINE: 'text-sky-400 bg-sky-950/40 border-sky-500/30',
      AI_CHAT: 'text-indigo-400 bg-indigo-950/40 border-indigo-500/30',
      DEVICE: 'text-purple-400 bg-purple-950/40 border-purple-500/30',
      HYBRID: 'text-cyan-400 bg-cyan-950/40 border-cyan-500/30',
    };

    return (
      <span className={`text-xs px-2.5 py-0.5 rounded border font-mono font-semibold ${colors[route] || 'text-slate-300'}`}>
        ROUTE: {route}
      </span>
    );
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md shadow-xl">
      {/* Background HUD Grid Scanline */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(6,182,212,0.03)_50%,transparent_100%)] bg-[length:100%_4px] pointer-events-none opacity-40"></div>

      {/* Main Status Display Required by Section 16 */}
      <div className="relative z-10 flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🤖</span>
              <span className="font-mono text-base font-bold text-slate-100 tracking-wider">
                CORE SYSTEM HUD
              </span>
            </div>
            {getRouteBadge()}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onToggleTts}
              title={ttsEnabled ? 'Disable Voice Speech' : 'Enable Voice Speech'}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                ttsEnabled
                  ? 'bg-cyan-950/50 border-cyan-500/40 text-cyan-400'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            {getStatusBadge()}
          </div>
        </div>

        {/* Listening Indicator */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/80 border border-slate-800">
          <div className="flex items-center gap-4">
            <button
              onClick={onToggleListening}
              className={`relative flex items-center justify-center w-12 h-12 rounded-full border transition-all cursor-pointer ${
                listening
                  ? 'bg-rose-600 border-rose-400 text-white shadow-[0_0_20px_rgba(244,63,94,0.6)] animate-pulse'
                  : 'bg-cyan-950/70 border-cyan-500/40 text-cyan-400 hover:bg-cyan-900/60 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
              }`}
            >
              {listening ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
              {listening && (
                <span className="absolute inset-0 rounded-full border-2 border-rose-400 animate-ping opacity-60"></span>
              )}
            </button>
            <div>
              <div className="font-mono text-sm font-semibold text-slate-200">
                {listening ? (
                  <span className="text-cyan-400 animate-pulse">Listening for voice command...</span>
                ) : (
                  <span>Microphone Standby</span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {listening
                  ? 'Speak clearly into your microphone (e.g., "Open Notepad", "Set volume to 50 percent")'
                  : 'Click microphone or type command below to trigger execution'}
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1">
            <span className={`w-1.5 h-6 rounded-full transition-all ${listening ? 'bg-cyan-400 animate-bounce' : 'bg-slate-700'}`} style={{ animationDelay: '0ms' }}></span>
            <span className={`w-1.5 h-10 rounded-full transition-all ${listening ? 'bg-cyan-400 animate-bounce' : 'bg-slate-700'}`} style={{ animationDelay: '150ms' }}></span>
            <span className={`w-1.5 h-8 rounded-full transition-all ${listening ? 'bg-cyan-400 animate-bounce' : 'bg-slate-700'}`} style={{ animationDelay: '300ms' }}></span>
            <span className={`w-1.5 h-4 rounded-full transition-all ${listening ? 'bg-cyan-400 animate-bounce' : 'bg-slate-700'}`} style={{ animationDelay: '450ms' }}></span>
          </div>
        </div>

        {/* Section 16 Requirement: Last Command and Status Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/90 font-mono">
            <span className="text-xs uppercase tracking-wider text-slate-400 block mb-1">
              Last command:
            </span>
            <div className="text-base font-semibold text-slate-100 break-words min-h-[1.75rem]">
              {lastCommand || <span className="text-slate-500 italic">None yet</span>}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/90 font-mono">
            <span className="text-xs uppercase tracking-wider text-slate-400 block mb-1">
              Status & Verification:
            </span>
            <div className="text-sm font-medium text-slate-200 break-words min-h-[1.75rem] flex items-center gap-2">
              <span className="text-cyan-400 font-bold">[{status}]</span>
              <span className="text-slate-300">{resultMessage || 'System ready for input.'}</span>
            </div>
          </div>
        </div>

        {/* Command Line Input Box */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 font-mono text-sm">
              <Terminal className="w-4 h-4 text-cyan-400" />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder='Enter command (e.g. "Open Notepad", "Explain Python decorators", "Shutdown computer")...'
              disabled={isProcessing}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-700/80 text-slate-100 placeholder-slate-500 text-sm font-mono focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 disabled:opacity-50 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={!inputVal.trim() || isProcessing}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer"
          >
            {isProcessing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>Execute</span>
          </button>
        </form>
      </div>
    </div>
  );
};
