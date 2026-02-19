
import React, { useEffect, useState } from 'react';
import { Database, Server, MessageSquare, Send, ArrowRight, UserCheck } from 'lucide-react';

interface Props {
  isAnimating: boolean;
  onAnimationComplete: () => void;
}

const ArchitectureDiagram: React.FC<Props> = ({ isAnimating, onAnimationComplete }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (isAnimating) {
      setStep(1);
      const timers = [
        setTimeout(() => setStep(2), 1000),
        setTimeout(() => setStep(3), 2500),
        setTimeout(() => setStep(4), 4000),
        setTimeout(() => {
          setStep(0);
          onAnimationComplete();
        }, 5500),
      ];
      return () => timers.forEach(t => clearTimeout(t));
    }
  }, [isAnimating, onAnimationComplete]);

  return (
    <div className="relative w-full min-w-[600px] h-[350px] md:h-[400px] bg-slate-900/50 p-6 md:p-8 flex flex-col items-center justify-center">
      <div className="flex items-center justify-between w-full max-w-4xl relative z-10">
        
        {/* User Service */}
        <div className="flex flex-col items-center gap-4">
          <div className={`p-4 md:p-6 rounded-2xl transition-all duration-500 flex flex-col items-center gap-2 border-2 ${step === 1 || step === 2 ? 'bg-blue-600/20 border-blue-500 shadow-lg shadow-blue-500/20' : 'bg-slate-800 border-slate-700'}`}>
            <Server className={`w-8 h-8 md:w-10 md:h-10 ${step === 1 || step === 2 ? 'text-blue-400' : 'text-slate-400'}`} />
            <span className="font-bold text-[10px] md:text-sm">User Service</span>
            <div className="flex items-center gap-1.5 mt-1">
              <Database className={`w-4 h-4 ${step === 2 ? 'text-green-400 animate-pulse' : 'text-slate-500'}`} />
              <span className="text-[8px] uppercase tracking-wider text-slate-500 font-bold">user_db</span>
            </div>
          </div>
        </div>

        {/* Kafka Broker */}
        <div className="flex flex-col items-center gap-4">
          <div className={`p-4 md:p-6 rounded-2xl transition-all duration-500 flex flex-col items-center gap-2 border-2 ${step === 3 ? 'bg-amber-600/20 border-amber-500 shadow-lg shadow-amber-500/20' : 'bg-slate-800 border-slate-700'}`}>
            <MessageSquare className={`w-8 h-8 md:w-10 md:h-10 ${step === 3 ? 'text-amber-400' : 'text-slate-400'}`} />
            <span className="font-bold text-[10px] md:text-sm">Kafka</span>
            <span className="text-[8px] uppercase tracking-wider text-slate-500 font-bold">user-topic</span>
          </div>
        </div>

        {/* Profile Service */}
        <div className="flex flex-col items-center gap-4">
          <div className={`p-4 md:p-6 rounded-2xl transition-all duration-500 flex flex-col items-center gap-2 border-2 ${step === 4 ? 'bg-purple-600/20 border-purple-500 shadow-lg shadow-purple-500/20' : 'bg-slate-800 border-slate-700'}`}>
            <Server className={`w-8 h-8 md:w-10 md:h-10 ${step === 4 ? 'text-purple-400' : 'text-slate-400'}`} />
            <span className="font-bold text-[10px] md:text-sm">Profile Service</span>
            <div className="flex items-center gap-1.5 mt-1">
              <Database className={`w-4 h-4 ${step === 4 ? 'text-green-400 animate-pulse' : 'text-slate-500'}`} />
              <span className="text-[8px] uppercase tracking-wider text-slate-500 font-bold">profile_db</span>
            </div>
          </div>
        </div>

      </div>

      {/* Animation Lines Background */}
      <div className="absolute top-1/2 left-0 w-full h-[2px] bg-slate-800/30 -translate-y-1/2 -z-0"></div>
      
      {/* Particle: User Data Generation */}
      {step === 1 && (
        <div className="absolute left-[15%] top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full blur-sm animate-ping" />
      )}
      
      {/* Moving Event Packet */}
      {step === 3 && (
        <div className="absolute left-[18%] top-1/2 -translate-y-1/2 flex items-center gap-1.5 transition-all duration-[1500ms] translate-x-[160px] md:translate-x-[200px]">
           <div className="bg-amber-500 p-1.5 rounded-full shadow-lg shadow-amber-500/40"><Send className="w-3 h-3 text-white" /></div>
           <div className="text-[8px] font-mono bg-amber-900 text-amber-200 px-2 py-0.5 rounded-full border border-amber-700">UserRegisteredEvent</div>
        </div>
      )}

      {/* Consumption Sync Packet */}
      {step === 4 && (
        <div className="absolute left-[52%] top-1/2 -translate-y-1/2 flex items-center gap-1.5 transition-all duration-[1500ms] translate-x-[160px] md:translate-x-[200px]">
           <div className="bg-purple-500 p-1.5 rounded-full shadow-lg shadow-purple-500/40"><UserCheck className="w-3 h-3 text-white" /></div>
           <div className="text-[8px] font-mono bg-purple-900 text-purple-200 px-2 py-0.5 rounded-full border border-purple-700">SyncProfile()</div>
        </div>
      )}

      {/* Connection Flow Indicators */}
      <div className="absolute bottom-6 md:bottom-10 flex w-full justify-around text-slate-500 text-[9px] font-bold uppercase tracking-[0.1em]">
        <div className="flex items-center gap-1"><ArrowRight className="w-3 h-3" /> Event Production</div>
        <div className="flex items-center gap-1"><ArrowRight className="w-3 h-3" /> Async Consumption</div>
      </div>
    </div>
  );
};

export default ArchitectureDiagram;
