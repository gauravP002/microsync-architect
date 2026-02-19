
import React, { useState } from 'react';
import { Copy, Check, FileCode, Layers } from 'lucide-react';

interface CodeFile {
  name: string;
  code: string;
  language: string;
}

interface Props {
  files: CodeFile[];
}

const CodeViewer: React.FC<Props> = ({ files }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (files.length === 0) return;
    navigator.clipboard.writeText(files[activeIndex].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (files.length === 0) return null;

  return (
    <div className="flex flex-col h-full bg-[#0d1117] rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* File Explorer Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#161b22] border-b border-slate-800">
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {files.map((file, idx) => (
            <button
              key={file.name}
              onClick={() => setActiveIndex(idx)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-semibold transition-all whitespace-nowrap ${
                activeIndex === idx ? 'bg-blue-600/20 text-blue-400 shadow-sm' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <FileCode className="w-3 h-3" />
              {file.name}
            </button>
          ))}
        </div>
        <button
          onClick={handleCopy}
          className="p-1.5 text-slate-400 hover:text-white transition-colors bg-slate-800/50 rounded-lg ml-2 shrink-0"
          title="Copy to clipboard"
        >
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>

      {/* Code Display Area */}
      <div className="flex-1 overflow-auto p-4 md:p-6 code-font text-[11px] md:text-sm">
        <pre className="text-blue-100 leading-relaxed overflow-x-auto">
          <code className="block">{files[activeIndex].code}</code>
        </pre>
      </div>

      {/* Status Bar */}
      <div className="bg-[#161b22] px-4 py-2 border-t border-slate-800 flex items-center justify-between text-[9px] uppercase tracking-widest font-black text-slate-600">
        <span className="flex items-center gap-1.5">
           <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
           {files[activeIndex].language}
        </span>
        <div className="flex items-center gap-2">
           <Layers className="w-3 h-3" /> micro-repo
        </div>
      </div>
    </div>
  );
};

export default CodeViewer;
