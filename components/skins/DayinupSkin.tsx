'use client';

import { 
  Briefcase, 
  History, 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ArrowRight,
  MessageSquare,
  Image as ImageIcon
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

export default function DayinupSkin({
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
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-300 font-sans">
      {/* Header */}
      <header className="h-24 bg-[#111] border-b border-orange-500/20 px-12 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center font-black text-white italic">D</div>
          <h1 className="text-2xl font-black tracking-tighter text-white uppercase">DayinUP Hub</h1>
        </div>
        <div className="flex items-center gap-4 bg-orange-500/10 px-4 py-2 rounded-full border border-orange-500/20">
          <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">Core Active</span>
        </div>
      </header>

      <div className="p-12 max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Progress */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center gap-3 border-l-4 border-orange-600 pl-4">
            <h2 className="text-xl font-bold text-white uppercase tracking-tight">Project Evolution</h2>
            <span className="text-sm text-zinc-600 font-mono">[{features.length} Nodes]</span>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {features.map((item) => (
              <motion.div 
                key={item.id}
                className={`p-1 rounded-3xl transition-all ${selectedFeature === item.id ? 'bg-gradient-to-r from-orange-600/50 to-amber-600/50' : 'bg-zinc-900/50'}`}
              >
                <div 
                  className="bg-[#0f0f0f] rounded-[22px] p-6 cursor-pointer"
                  onClick={() => setSelectedFeature(selectedFeature === item.id ? null : item.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-white">{item.name}</h3>
                      <p className="text-sm text-zinc-500 max-w-xl">{item.description}</p>
                    </div>
                    <div className="px-3 py-1 bg-zinc-800 rounded-lg text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                      {item.status}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-600 shadow-[0_0_15px_rgba(234,88,12,0.4)]" style={{ width: `${item.progress_pct}%` }} />
                    </div>
                    <span className="text-sm font-black text-white font-mono">{item.progress_pct}%</span>
                  </div>

                  <AnimatePresence>
                    {selectedFeature === item.id && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 pt-8 border-t border-white/5 space-y-6"
                      >
                        <div className="space-y-4 max-h-80 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-orange-600/20">
                          {feedbacks.filter(f => f.feature_id === item.id).map((f) => (
                            <div key={f.id} className="flex gap-4">
                              <div className="w-8 h-8 rounded-full bg-zinc-800 shrink-0" />
                              <div className="space-y-2 flex-1">
                                <div className="flex justify-between items-center">
                                  <span className="text-xs font-bold text-orange-500">{f.author}</span>
                                  <span className="text-[10px] text-zinc-600 font-mono">{new Date(f.created_at).toLocaleTimeString()}</span>
                                </div>
                                <div className="text-sm text-zinc-300 leading-relaxed">{f.text}</div>
                                {f.image_url && (
                                  <img src={f.image_url} alt="Reference" className="mt-4 rounded-2xl border border-white/5 max-w-md shadow-2xl" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex gap-3 items-center bg-zinc-800/30 p-2 rounded-2xl border border-white/5">
                          <input 
                            type="text" 
                            placeholder="Type a message..." 
                            className="flex-1 bg-transparent px-4 py-2 text-sm focus:outline-none"
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && onSendFeedback(item.id)}
                          />
                          <label className="cursor-pointer hover:text-orange-500 transition-colors">
                            <ImageIcon className="w-5 h-5" />
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => onUploadImage(e, item.id)} />
                          </label>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Column: Versions */}
        <div className="lg:col-span-4 space-y-8">
          <div className="flex items-center gap-3 border-l-4 border-zinc-700 pl-4">
            <h2 className="text-xl font-bold text-white uppercase tracking-tight">Timeline</h2>
          </div>
          
          <div className="space-y-6">
            {versions.map((v) => (
              <div key={v.id} className="group relative pl-8 border-l border-zinc-800 pb-8 last:pb-0">
                <div className="absolute left-[-5px] top-1 w-2 h-2 rounded-full bg-orange-600 group-hover:scale-150 transition-transform" />
                <div className="text-[10px] font-mono text-zinc-600 mb-1">{new Date(v.created_at).toDateString()}</div>
                <div className="text-sm font-bold text-white mb-2">{v.version_tag}</div>
                <p className="text-xs text-zinc-500 leading-relaxed bg-zinc-900/30 p-3 rounded-xl border border-white/5">{v.change_summary}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}