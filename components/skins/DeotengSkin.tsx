'use client';

import React from 'react';
import { 
  Rocket, 
  Activity, 
  Shield, 
  Clock, 
  ChevronRight, 
  Upload, 
  MessageSquare,
  Zap,
  Globe,
  Star
} from 'lucide-react';

interface SkinProps {
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
}

const DeotengSkin: React.FC<SkinProps> = ({
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
}) => {
  return (
    <div className="min-h-screen bg-[#0a0a05] text-[#d4af37] font-sans selection:bg-[#d4af37] selection:text-black">
      {/* Background Ornaments */}
      <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#d4af37] blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#8b7500] blur-[150px] rounded-full" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#d4af37]/20 bg-black/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#d4af37] to-[#8b7500] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.3)]">
              <Star className="text-black" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">DEOTENG</h1>
              <div className="flex items-center gap-2 text-[10px] font-mono text-[#d4af37]">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                ROYAL PROTOCOL ACTIVE
              </div>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#" className="text-white hover:text-[#d4af37] transition-colors">DOMAIN</a>
            <a href="#" className="hover:text-white transition-colors">INTELLIGENCE</a>
            <a href="#" className="hover:text-white transition-colors">ASSETS</a>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2 px-4 py-2 bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-lg">
              <Zap size={14} />
              <span className="text-xs">GOLD TIER</span>
            </div>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8">
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Activity size={20} className="text-[#d4af37]" />
                  <h2 className="text-xl font-bold text-white uppercase tracking-wider">Mission Matrix</h2>
                </div>
                <div className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-mono border border-white/10">
                  {features.length} ACTIVE NODES
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {features.map((feature) => (
                  <div 
                    key={feature.id}
                    onClick={() => setSelectedFeature(selectedFeature === feature.id ? null : feature.id)}
                    className={`group relative p-6 rounded-2xl border transition-all cursor-pointer ${
                      selectedFeature === feature.id 
                        ? 'bg-[#1a1a0a] border-[#d4af37] shadow-[0_0_30px_rgba(212,175,55,0.1)]' 
                        : 'bg-black/40 border-white/5 hover:border-[#d4af37]/40 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white group-hover:text-[#d4af37] transition-colors flex items-center gap-2">
                          {feature.title}
                          {feature.status === 'done' && <Shield size={14} className="text-green-500" />}
                        </h3>
                        <p className="text-sm text-zinc-400 mt-1 line-clamp-2">{feature.description}</p>
                      </div>
                      <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tighter ${
                        feature.status === 'done' ? 'bg-green-500/10 text-green-500' : 'bg-[#d4af37]/10 text-[#d4af37]'
                      }`}>
                        {feature.status}
                      </div>
                    </div>

                    {selectedFeature === feature.id && (
                      <div className="mt-8 pt-8 border-t border-white/10 space-y-6 animate-in fade-in slide-in-from-top-4 duration-300" onClick={e => e.stopPropagation()}>
                        {/* Feedbacks */}
                        <div className="space-y-4">
                          <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                            <MessageSquare size={12} /> Communication Logs
                          </h4>
                          <div className="space-y-3">
                            {feedbacks.filter(f => f.feature_id === feature.id).map((f) => (
                              <div key={f.id} className="bg-white/5 p-4 rounded-xl border border-white/5">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-xs font-bold text-[#d4af37]">{f.author}</span>
                                  <span className="text-[10px] text-zinc-500">{new Date(f.created_at).toLocaleString()}</span>
                                </div>
                                <p className="text-sm text-zinc-300">{f.text}</p>
                                {f.image_url && (
                                  <img src={f.image_url} alt="Evidence" className="mt-3 rounded-lg border border-white/10 w-full object-cover max-h-48" />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Input */}
                        <div className="flex flex-col gap-4">
                          <textarea 
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            placeholder="Input command..."
                            className="bg-black/60 border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-[#d4af37] transition-colors resize-none h-24"
                          />
                          <div className="flex justify-between items-center">
                            <label className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 transition-colors text-xs">
                              <Upload size={14} />
                              {uploading ? 'UPLOADING...' : 'ATTACH MEDIA'}
                              <input type="file" className="hidden" onChange={(e) => onUploadImage(e, feature.id)} disabled={uploading} />
                            </label>
                            <button 
                              onClick={() => onSendFeedback(feature.id)}
                              className="px-6 py-2 bg-[#d4af37] text-black font-bold rounded-lg hover:bg-white transition-all text-xs"
                            >
                              EXECUTE
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-8">
            <section className="bg-black/40 border border-white/5 rounded-3xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#d4af37]/10 blur-[40px] rounded-full" />
              <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                <Clock size={20} className="text-[#d4af37]" />
                <h2 className="text-xl font-bold text-white uppercase tracking-wider">Evolution Log</h2>
              </div>
              <div className="space-y-6">
                {versions.map((v, i) => (
                  <div key={v.id} className="relative pl-6">
                    {i !== versions.length - 1 && (
                      <div className="absolute left-[9px] top-4 bottom-[-24px] w-px bg-white/10" />
                    )}
                    <div className="absolute left-0 top-[6px] w-[18px] h-[18px] bg-black border-2 border-[#d4af37] rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-[#d4af37] rounded-full" />
                    </div>
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-bold text-white">v{v.version_number}</span>
                      <span className="text-[10px] text-zinc-500 font-mono">{new Date(v.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-zinc-400 line-clamp-2">{v.release_notes}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-gradient-to-br from-[#d4af37]/10 to-transparent border border-[#d4af37]/20 rounded-3xl p-8">
              <Globe className="text-[#d4af37] mb-4" size={32} />
              <h3 className="text-lg font-bold text-white mb-2">Empire Status</h3>
              <p className="text-sm text-zinc-400 mb-6">Deoteng node is synchronized with the primary database. Real-time encryption active.</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/60 p-4 rounded-2xl border border-white/5">
                  <div className="text-xs text-zinc-500 mb-1">LATENCY</div>
                  <div className="text-lg font-mono text-white">24ms</div>
                </div>
                <div className="bg-black/60 p-4 rounded-2xl border border-white/5">
                  <div className="text-xs text-zinc-500 mb-1">STABILITY</div>
                  <div className="text-lg font-mono text-white">99.9%</div>
                </div>
              </div>
            </section>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 mt-12 bg-black/40">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[10px] font-mono tracking-widest text-zinc-600">
            SYSTEM_DEOTENG_AUTH_BETA_2026
          </div>
          <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            <a href="#" className="hover:text-[#d4af37]">Protocol</a>
            <a href="#" className="hover:text-[#d4af37]">Privacy</a>
            <a href="#" className="hover:text-[#d4af37]">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DeotengSkin;