import React from 'react';
import { Play, CheckCircle2, ShieldAlert, WifiOff, Sparkles, Terminal } from 'lucide-react';

interface TestCase {
  id: number;
  title: string;
  command: string;
  expectedRoute: string;
  expectedBehavior: string;
  requiresOffline?: boolean;
}

interface TestRunnerProps {
  onRunTest: (test: TestCase) => void;
  isProcessing: boolean;
}

const TEST_CASES: TestCase[] = [
  {
    id: 1,
    title: 'Test 1: Local App Execution',
    command: 'Open Notepad',
    expectedRoute: 'LOCAL',
    expectedBehavior: 'open_app -> SUCCESS verification',
  },
  {
    id: 2,
    title: 'Test 2: System Volume Control',
    command: 'Set volume to 50 percent',
    expectedRoute: 'LOCAL',
    expectedBehavior: 'volume action -> SUCCESS verification',
  },
  {
    id: 3,
    title: 'Test 3: AI Chat & Reasoning',
    command: 'Explain Python decorators',
    expectedRoute: 'AI_CHAT',
    expectedBehavior: 'Gemini 3.8 Flash model invocation',
  },
  {
    id: 4,
    title: 'Test 4: Online Live Search',
    command: 'Search the latest AI news',
    expectedRoute: 'ONLINE',
    expectedBehavior: 'Online service / web search action',
  },
  {
    id: 5,
    title: 'Test 5: Offline Resiliency (Local)',
    command: 'Open Calculator',
    expectedRoute: 'LOCAL',
    expectedBehavior: 'Opens Calculator offline without crashing',
    requiresOffline: true,
  },
  {
    id: 6,
    title: 'Test 6: Offline Online Protection',
    command: 'Search latest news',
    expectedRoute: 'ONLINE REQUIRED',
    expectedBehavior: 'Rejects gracefully: Internet connection unavailable',
    requiresOffline: true,
  },
  {
    id: 7,
    title: 'Test 7: Strong Security Gate',
    command: 'Shutdown computer',
    expectedRoute: 'SECURITY CHECK',
    expectedBehavior: 'Strong confirmation required before shutdown',
  },
  {
    id: 8,
    title: 'Test 8: Protected File Deletion',
    command: 'Delete this file',
    expectedRoute: 'SECURITY CHECK',
    expectedBehavior: 'Moderate confirmation prompt required',
  },
];

export const TestRunner: React.FC<TestRunnerProps> = ({ onRunTest, isProcessing }) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-cyan-400" />
          <h2 className="text-base font-bold font-mono text-slate-100">
            SECTION 18 ARCHITECTURAL TEST SUITE
          </h2>
        </div>
        <span className="text-xs font-mono text-slate-400">8 Standard Scenarios</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {TEST_CASES.map((tc) => (
          <div
            key={tc.id}
            className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-cyan-500/30 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold font-mono text-slate-200">
                  {tc.title}
                </span>
                {tc.requiresOffline && (
                  <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-500/30 font-mono">
                    <WifiOff className="w-2.5 h-2.5" /> OFFLINE
                  </span>
                )}
              </div>
              <div className="text-xs font-mono text-cyan-300 mb-1 font-semibold">
                "{tc.command}"
              </div>
              <p className="text-[11px] text-slate-400 mb-3">
                {tc.expectedBehavior}
              </p>
            </div>

            <button
              onClick={() => onRunTest(tc)}
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg bg-slate-800 group-hover:bg-cyan-600/90 text-slate-300 group-hover:text-white text-xs font-medium transition-all disabled:opacity-40 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Run Scenario</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
