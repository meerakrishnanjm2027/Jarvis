import React, { useState } from 'react';
import { Folder, FolderOpen, FileCode, Copy, Check, ChevronRight, ChevronDown, Download, CheckCircle, Clock } from 'lucide-react';
import { ProjectFileNode } from '../types';

interface ProjectViewerProps {
  files: ProjectFileNode[];
}

const PHASES = [
  { id: 1, name: 'Phase 1: Project Inspection & Migration Plan', status: 'IN_PROGRESS' },
  { id: 2, name: 'Phase 2: Gemini API Integration (google-genai)', status: 'PREPARED' },
  { id: 3, name: 'Phase 3: Hybrid Router (Local / Online / AI / Device)', status: 'PREPARED' },
  { id: 4, name: 'Phase 4: Windows Actions Integration', status: 'PREPARED' },
  { id: 5, name: 'Phase 5: Result Verification & Error Management', status: 'PREPARED' },
  { id: 6, name: 'Phase 6: Security & Confirmation Subsystem', status: 'PREPARED' },
  { id: 7, name: 'Phase 7: Memory & Preferences SQLite Subsystem', status: 'PREPARED' },
  { id: 8, name: 'Phase 8: Offline AI & Local Fallback', status: 'PREPARED' },
  { id: 9, name: 'Phase 9: ESP32 Smart-Home & MQTT Prep', status: 'PREPARED' },
  { id: 10, name: 'Phase 10: Complete Verification Testing', status: 'PREPARED' },
];

export const ProjectViewer: React.FC<ProjectViewerProps> = ({ files }) => {
  const [selectedFile, setSelectedFile] = useState<ProjectFileNode | null>(null);
  const [copied, setCopied] = useState(false);
  const [openDirs, setOpenDirs] = useState<Record<string, boolean>>({
    'Mark-LIV-main': true,
    'core': true,
    'config': true,
  });

  const toggleDir = (path: string) => {
    setOpenDirs((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const copyContent = () => {
    if (selectedFile?.content) {
      navigator.clipboard.writeText(selectedFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const renderTree = (nodes: ProjectFileNode[]) => {
    return (
      <ul className="space-y-1 font-mono text-xs">
        {nodes.map((node) => {
          if (node.type === 'directory') {
            const isOpen = Boolean(openDirs[node.path]);
            return (
              <li key={node.path} className="select-none">
                <div
                  onClick={() => toggleDir(node.path)}
                  className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                >
                  {isOpen ? (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  {isOpen ? (
                    <FolderOpen className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Folder className="w-4 h-4 text-amber-400" />
                  )}
                  <span className="font-semibold">{node.name}/</span>
                </div>
                {isOpen && node.children && (
                  <div className="pl-4 border-l border-slate-800 ml-2 mt-1">
                    {renderTree(node.children)}
                  </div>
                )}
              </li>
            );
          }

          const isSelected = selectedFile?.path === node.path;
          return (
            <li key={node.path}>
              <div
                onClick={() => setSelectedFile(node)}
                className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-cyan-950/80 border border-cyan-500/40 text-cyan-300'
                    : 'hover:bg-slate-800/80 text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                <span>{node.name}</span>
              </div>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 border-b border-slate-800/80 pb-3">
        <div>
          <h2 className="text-base font-bold font-mono text-slate-100 flex items-center gap-2">
            <span>📁</span> MARK-LIV-MAIN PROJECT EXPLORER & ROADMAP
          </h2>
          <p className="text-xs text-slate-400">
            Modular target architecture maintaining clean backward-compatibility with your existing project.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/30 font-mono">
            Phase 1 Active
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: File Tree */}
        <div className="lg:col-span-4 bg-slate-950/80 rounded-xl border border-slate-800 p-3 h-96 overflow-y-auto">
          <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">
            Target Directory Structure
          </div>
          {files.length > 0 ? (
            renderTree(files)
          ) : (
            <div className="text-xs text-slate-500 p-2 font-mono">Loading workspace files...</div>
          )}
        </div>

        {/* Right Column: Code Viewer / Phase Tracker */}
        <div className="lg:col-span-8 bg-slate-950/80 rounded-xl border border-slate-800 flex flex-col h-96 overflow-hidden">
          {selectedFile ? (
            <>
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800 bg-slate-900/60">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-cyan-400" />
                  <span className="font-mono text-xs font-semibold text-slate-200">
                    {selectedFile.path}
                  </span>
                </div>
                <button
                  onClick={copyContent}
                  className="flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="flex-1 p-4 overflow-auto font-mono text-xs text-slate-300 leading-relaxed whitespace-pre bg-slate-950">
                {selectedFile.content || '// Empty file'}
              </div>
            </>
          ) : (
            <div className="p-5 flex-1 overflow-y-auto">
              <div className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                10-Phase Incremental Upgrade Plan
              </div>
              <div className="space-y-2">
                {PHASES.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80 text-xs font-mono"
                  >
                    <span className="text-slate-300">{p.name}</span>
                    {p.status === 'IN_PROGRESS' ? (
                      <span className="flex items-center gap-1 text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                        <Clock className="w-3 h-3 animate-spin" /> In Progress
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded">
                        <CheckCircle className="w-3 h-3" /> Ready for Next Turn
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-slate-400 font-mono">
                &bull; Click any file in the tree on the left to inspect its code.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
