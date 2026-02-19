import ArchitectureDiagram from './components/ArchitectureDiagram';
import CodeViewer from './components/CodeViewer';
import { userServiceCode, profileServiceCode, infraCode } from './services/codeTemplates';

import React, { useState } from 'react';
import { 
  Terminal, 
  Cpu, 
  Database, 
  Network, 
  Settings, 
  ArrowRight, 
  Layers, 
  Activity, 
  Code2, 
  Play, 
  CheckCircle2,
  Package
} from 'lucide-react';
import { TabType, UserRecord, ProfileRecord } from './models/types';
import { registerUser } from './services/RegisterService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('architecture');
  const [isSimulating, setIsSimulating] = useState(false);
  const [userDb, setUserDb] = useState<UserRecord[]>([]);
  const [profileDb, setProfileDb] = useState<ProfileRecord[]>([]);
  
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    setIsSimulating(true);
    
    // Call the dedicated API service
    // This will try localhost:8081/register and fallback to mock data automatically
    const resultUser = await registerUser(formData.name, formData.email);
    
    // Visual Flow Timing:
    // 1. User Service processes & saves to DB
    setTimeout(() => {
      setUserDb(prev => [...prev, resultUser]);
    }, 1500);

    // 2. Kafka Event propagation & Profile Service consumption
    setTimeout(() => {
      const newProfile: ProfileRecord = {
        userId: resultUser.id,
        name: resultUser.name,
        email: resultUser.email,
        syncedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };
      setProfileDb(prev => [...prev, newProfile]);
    }, 5000);
  };

  const getActiveCodeFiles = () => {
    switch (activeTab) {
      case 'user-service':
        return [
          { name: 'User.java', language: 'java', code: userServiceCode.entity },
          { name: 'UserService.java', language: 'java', code: userServiceCode.service },
          { name: 'UserProducer.java', language: 'java', code: userServiceCode.producer },
          { name: 'RegistrationController.java', language: 'java', code: userServiceCode.controller },
          { name: 'application.yml', language: 'yaml', code: userServiceCode.yml },
        ];
      case 'profile-service':
        return [
          { name: 'Profile.java', language: 'java', code: profileServiceCode.entity },
          { name: 'ProfileService.java', language: 'java', code: profileServiceCode.service },
          { name: 'ProfileConsumer.java', language: 'java', code: profileServiceCode.consumer },
          { name: 'application.yml', language: 'yaml', code: profileServiceCode.yml },
        ];
      case 'infrastructure':
        return [
          { name: 'README.md', language: 'markdown', code: infraCode.dockerCompose },
          { name: 'setup.sql', language: 'sql', code: infraCode.sql },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a] text-slate-200">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 px-4 md:px-6 py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
            <Layers className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">MicroSync Architect</h1>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Spring Boot + Kafka</p>
          </div>
        </div>
        
        <div className="flex gap-1 bg-slate-800 p-1 rounded-lg overflow-x-auto no-scrollbar scroll-smooth">
          {(['architecture', 'user-service', 'profile-service', 'infrastructure'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 md:px-4 py-1.5 rounded-md text-[10px] md:text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === tab 
                  ? 'bg-slate-700 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.replace('-', ' ').toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1600px] mx-auto w-full">
        <div className="lg:col-span-7 flex flex-col gap-6">
          <section className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col">
            <div className="px-4 md:px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/30">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">Live Flow Simulation</h2>
              </div>
              <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full ${isSimulating ? 'bg-green-500/10' : 'bg-slate-800'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${isSimulating ? 'bg-green-500 animate-pulse' : 'bg-slate-600'}`} />
                <span className="text-[9px] text-slate-400 uppercase font-bold">{isSimulating ? 'Active' : 'Idle'}</span>
              </div>
            </div>
            
            <div className="overflow-x-auto no-scrollbar">
              <ArchitectureDiagram 
                isAnimating={isSimulating} 
                onAnimationComplete={() => {
                  setIsSimulating(false);
                  setFormData({ name: '', email: '' });
                }} 
              />
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-lg">
               <div className="flex items-center gap-2 mb-4">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <h2 className="text-xs font-bold uppercase tracking-wider">Trigger Registration</h2>
               </div>
               <form onSubmit={handleRegister} className="space-y-4">
                 <div>
                   <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Full Name</label>
                   <input 
                     type="text" 
                     required
                     value={formData.name}
                     onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                     placeholder="John Doe"
                     className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-700"
                   />
                 </div>
                 <div>
                   <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Email Address</label>
                   <input 
                     type="email" 
                     required
                     value={formData.email}
                     onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                     placeholder="john@example.com"
                     className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-700"
                   />
                 </div>
                 <button 
                   disabled={isSimulating}
                   className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-blue-900/20"
                 >
                   <Play className="w-4 h-4" />
                   Register & Sync
                 </button>
                 <p className="text-[9px] text-slate-500 text-center uppercase tracking-wider font-medium">
                   Target: http://localhost:8081/register
                 </p>
               </form>
            </section>

            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-lg overflow-hidden flex flex-col">
               <div className="flex items-center gap-2 mb-4">
                  <Database className="w-4 h-4 text-amber-400" />
                  <h2 className="text-xs font-bold uppercase tracking-wider">Live Database State</h2>
               </div>
               <div className="flex-1 space-y-5 overflow-y-auto pr-2 max-h-[220px] md:max-h-none">
                 <div className="space-y-2">
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] font-bold text-slate-500 uppercase">user_db</span>
                       <span className="text-[10px] text-blue-400 font-mono px-2 py-0.5 bg-blue-400/10 rounded">{userDb.length}</span>
                    </div>
                    <div className="space-y-1">
                      {userDb.length === 0 ? (
                        <p className="text-[10px] text-slate-600 italic px-2">Waiting for first registration...</p>
                      ) : (
                        userDb.slice(-3).reverse().map(user => (
                          <div key={user.id} className="text-[10px] font-mono bg-slate-950 p-2 rounded border border-slate-800/50 flex justify-between animate-in slide-in-from-left-1">
                            <span className="truncate mr-2">{user.name}</span>
                            <span className="text-slate-600 shrink-0">{user.createdAt}</span>
                          </div>
                        ))
                      )}
                    </div>
                 </div>
                 <div className="space-y-2">
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] font-bold text-slate-500 uppercase">profile_db</span>
                       <span className="text-[10px] text-purple-400 font-mono px-2 py-0.5 bg-purple-400/10 rounded">{profileDb.length}</span>
                    </div>
                    <div className="space-y-1">
                      {profileDb.length === 0 ? (
                        <p className="text-[10px] text-slate-600 italic px-2">Awaiting Kafka sync...</p>
                      ) : (
                        profileDb.slice(-3).reverse().map(profile => (
                          <div key={profile.userId} className="text-[10px] font-mono bg-slate-950 p-2 rounded border border-slate-800/50 flex justify-between items-center animate-in slide-in-from-right-1">
                            <span className="flex items-center gap-1.5 truncate mr-2">
                              <CheckCircle2 className="w-3 h-3 text-green-500 shrink-0" /> 
                              {profile.name}
                            </span>
                            <span className="text-slate-600 shrink-0">{profile.syncedAt}</span>
                          </div>
                        ))
                      )}
                    </div>
                 </div>
               </div>
            </section>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-6">
          <section className="flex-1 flex flex-col min-h-[400px] lg:h-full overflow-hidden">
            {activeTab === 'architecture' ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 h-full flex flex-col gap-6">
                 <div className="flex items-center gap-3">
                   <Settings className="w-6 h-6 text-blue-400" />
                   <h2 className="text-lg font-bold">System Blueprint</h2>
                 </div>
                 
                 <div className="space-y-4 flex-1">
                   {[
                     { icon: <Package className="w-4 h-4" />, title: 'Producer (User Service)', color: 'text-blue-400', desc: 'Registers users locally and emits persistence events to the Kafka bus.' },
                     { icon: <Network className="w-4 h-4" />, title: 'Event Bus (Kafka)', color: 'text-amber-400', desc: 'Handles distributed event logs. Decouples the user system from downstream profile processing.' },
                     { icon: <Cpu className="w-4 h-4" />, title: 'Consumer (Profile Service)', color: 'text-purple-400', desc: 'Subscribes to user-topic to maintain up-to-date profile metadata idempotently.' }
                   ].map((item, i) => (
                     <div key={i} className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 hover:bg-slate-800 transition-colors">
                       <h3 className={`${item.color} font-bold text-xs mb-1.5 flex items-center gap-2 uppercase tracking-wide`}>
                         {item.icon} {item.title}
                       </h3>
                       <p className="text-[11px] text-slate-400 leading-relaxed">
                         {item.desc}
                       </p>
                     </div>
                   ))}
                 </div>

                 <div className="mt-4 bg-blue-900/20 p-4 rounded-xl border border-blue-500/20 flex gap-4 items-center">
                    <div className="bg-blue-600 p-2 rounded-lg shrink-0">
                       <Code2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-blue-100">Dev Documentation</h4>
                      <p className="text-[10px] text-blue-300/80">View implementation details by switching to service-specific code tabs above.</p>
                    </div>
                 </div>
              </div>
            ) : (
              <CodeViewer files={getActiveCodeFiles()} />
            )}
          </section>
        </div>
      </main>

      <footer className="bg-slate-900/50 border-t border-slate-800 py-6 px-4 text-center">
        <p className="text-[9px] text-slate-500 uppercase tracking-[0.3em] font-bold">
          MicroSync Lab &copy; 2025 • Interactive Event-Driven Microservices
        </p>
      </footer>
    </div>
  );
};

export default App;
