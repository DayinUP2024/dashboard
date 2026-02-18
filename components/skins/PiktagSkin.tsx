'use client';

import { 
  LayoutDashboard, 
  GitBranch, 
  Users, 
  Plus, 
  CheckCircle2, 
  Circle, 
  Clock, 
  ShieldAlert,
  ChevronRight,
  Github,
  Image as ImageIcon,
  Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type SkinProps = {
  features: any[];
  versions: any[];
  feedbacks: any[];
  selectedFeature: string | null;
  setSelectedFeature: (id: string | null) => void;
  feedbackText: string;
  setFeedbackText: (text: string) => void;
  uploading: boolean;
  onUploadImage: (e: React.ChangeEvent<HTMLInputElement>, id: string) => void;
  onSendFeedback: (id: string) => void;
};

export default function PiktagSkin({
  features,
  versions,
  feedbacks,
  selectedFeature,
  setSelectedFeature,
  feedbackText,
  setFeedbackText,
  uploading,
  onUploadImage,
  onSendFeedback
}: SkinProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Live': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'In Progress': return <Clock className="w-5 h-5 text-amber-500" />;
      case 'Review': return <ShieldAlert className="w-5 h-5 text-blue-500" />;
      default: return <Circle className="w-5 h-5 text-zinc-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-200 font-sans selection:bg-indigo-500/30">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 w-64 h-full border-r border-white/5 bg-white/[0.02] backdrop-blur-xl hidden lg:block">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-600/20">P</div>
            <h1 className="text-xl font-bold tracking-tight text-white">Piktag</h1>
          </div>
          <nav className="space-y-2">
            <button className="flex items-center gap-3 w-full p-3 rounded-xl bg-white/5 text-white transition-all text-sm font-medium">
              <LayoutDashboard className="w-4 h-4" />
              <span>Mission Control</span>
            </button>
            <button className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white transition-all text-sm font-medium">
              <GitBranch className="w-4 h-4" />
              <span>Version Sentinel</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="lg:pl-64 min-h-screen">
        <header className="sticky top-0 z-30 h-20 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md px-8 flex items-center justify-between">
          <h2 className="text-sm font-bold tracking-widest uppercase text-zinc-400">Commander&apos;s Dashboard</h2>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-xs font-medium text-indigo-500/80">PIKTAG MODE</span>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
            {/* Feature List */}
            <div className="xl:col-span-2 space-y-6">
              <h3 className="text-lg font-bold text-white tracking-tight uppercase">Feature Matrix</h3>
              <div className="grid gap-4">
                {features.map((feature, idx) => (
                  <motion.div 
                    key={feature.id}
                    className="rounded-2xl border border-white/5 bg-white/[0.01] overflow-hidden group"
                  >
                    <div 
                      className="p-5 flex items-center justify-between cursor-pointer"
                      onClick={() => setSelectedFeature(selectedFeature === feature.id ? null : feature.id)}
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                          {getStatusIcon(feature.status)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">{feature.name}</h4>
                          <p className="text-xs text-zinc-500">{feature.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="text-[10px] text-white font-bold">{feature.progress_pct}%</div>
                        <motion.div animate={{ rotate: selectedFeature === feature.id ? 90 : 0 }}>
                          <ChevronRight className="w-4 h-4 text-zinc-700" />
                        </motion.div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {selectedFeature === feature.id && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-white/5 bg-black/20 p-6 space-y-6"
                        >
                          <div className="space-y-4 max-h-60 overflow-y-auto pr-2 scrollbar-thin">
                            {feedbacks.filter(f => f.feature_id === feature.id).map((f) => (
                              <div key={f.id} className="flex flex-col gap-2">
                                <div className="text-[10px] font-bold text-indigo-400">{f.author}</div>
                                <div className="bg-white/5 rounded-xl p-3 text-xs text-zinc-300">
                                  {f.text}
                                  {f.image_url && (
                                    <div className="mt-3 rounded-lg overflow-hidden">
                                      <img src={f.image_url} alt="Screenshot" className="w-full h-auto" />
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center gap-3">
                            <input 
                              type="text" 
                              placeholder="Add report..." 
                              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-indigo-500/50"
                              value={feedbackText}
                              onChange={(e) => setFeedbackText(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && onSendFeedback(feature.id)}
                            />
                            <label className="cursor-pointer p-2 bg-white/5 hover:bg-white/10 rounded-xl">
                              <ImageIcon className={`w-4 h-4 ${uploading ? 'animate-pulse text-amber-500' : 'text-zinc-400'}`} />
                              <input type="file" className="hidden" accept="image/*" onChange={(e) => onUploadImage(e, feature.id)} />
                            </label>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Versions */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white tracking-tight uppercase">Version Sentinel</h3>
              <div className="space-y-4">
                {versions.map((version) => (
                  <div key={version.id} className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                    <div className="flex justify-between text-[10px] mb-2 font-mono uppercase tracking-widest text-indigo-400">
                      <span>{version.version_tag}</span>
                      <span className="text-zinc-600">#{version.commit_hash?.slice(0, 7)}</span>
                    </div>
                    <p className="text-xs text-zinc-300">{version.change_summary}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}