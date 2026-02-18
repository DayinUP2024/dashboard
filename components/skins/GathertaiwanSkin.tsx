'use client';

import React from 'react';
import { 
  Users, 
  MapPin, 
  Heart, 
  Calendar, 
  ChevronRight, 
  Upload, 
  MessageSquare,
  Sprout,
  Compass,
  Mountain
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

const GathertaiwanSkin: React.FC<SkinProps> = ({
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
    <div className="min-h-screen bg-[#f0f9f6] text-[#1a4d3e] font-sans selection:bg-[#2dd4bf] selection:text-white">
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-40 overflow-hidden">
        <div className="absolute top-[-5%] right-[-5%] w-[30%] h-[30%] bg-[#2dd4bf] blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] left-[-10%] w-[40%] h-[40%] bg-[#84cc16] blur-[150px] rounded-full" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#1a4d3e]/10 bg-white/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-600/20">
              <Mountain className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-[#0f342a]">GatherTaiwan</h1>
              <div className="flex items-center gap-2 text-[10px] font-bold text-teal-600 uppercase tracking-widest">
                <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
                Community Pulse Active
              </div>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
            <a href="#" className="text-teal-900 hover:text-teal-600 transition-colors">ISLAND</a>
            <a href="#" className="hover:text-teal-600 transition-colors">VIBES</a>
            <a href="#" className="hover:text-teal-600 transition-colors">PEOPLE</a>
            <div className="h-4 w-px bg-teal-900/10" />
            <button className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-all shadow-md shadow-teal-600/20 active:scale-95">
              <Sprout size={16} />
              <span>GATHER NOW</span>
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8">
            <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-teal-100/50">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-teal-50 rounded-xl">
                    <Compass size={24} className="text-teal-600" />
                  </div>
                  <h2 className="text-2xl font-black text-[#0f342a] tracking-tight">Village Matrix</h2>
                </div>
                <div className="px-4 py-1.5 bg-teal-50 text-teal-700 rounded-full text-xs font-bold border border-teal-100">
                  {features.length} ACTIVE NODES
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {features.map((feature) => (
                  <div 
                    key={feature.id}
                    onClick={() => setSelectedFeature(selectedFeature === feature.id ? null : feature.id)}
                    className={`group p-8 rounded-[2rem] border-2 transition-all cursor-pointer ${
                      selectedFeature === feature.id 
                        ? 'bg-white border-teal-500 shadow-xl shadow-teal-900/5' 
                        : 'bg-teal-50/30 border-transparent hover:bg-white hover:border-teal-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-[#0f342a]">
                            {feature.title}
                          </h3>
                          {feature.status === 'done' && <div className="p-1 bg-green-100 rounded-full"><Heart size={12} className="text-green-600 fill-green-600" /></div>}
                        </div>
                        <p className="text-teal-800/70 leading-relaxed">{feature.description}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        feature.status === 'done' ? 'bg-green-100 text-green-700' : 'bg-teal-100 text-teal-700'
                      }`}>
                        {feature.status}
                      </div>
                    </div>

                    {selectedFeature === feature.id && (
                      <div className="mt-10 space-y-8 animate-in fade-in zoom-in-95 duration-500" onClick={e => e.stopPropagation()}>
                        <div className="h-px bg-teal-100 w-full" />
                        
                        {/* Feedbacks */}
                        <div className="space-y-4">
                          <h4 className="text-xs font-black uppercase tracking-[0.2em] text-teal-900/40 flex items-center gap-2">
                            <MessageSquare size={14} /> Community Echo
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {feedbacks.filter(f => f.feature_id === feature.id).map((f) => (
                              <div key={f.id} className="bg-white p-6 rounded-3xl border border-teal-100 shadow-sm">
                                <div className="flex justify-between items-center mb-3">
                                  <span className="text-xs font-black text-teal-600">@{f.author}</span>
                                  <span className="text-[10px] text-teal-900/30 font-bold">{new Date(f.created_at).toLocaleDateString()}</span>
                                </div>
                                <p className="text-sm text-teal-900 leading-relaxed">{f.text}</p>
                                {f.image_url && (
                                  <div className="mt-4 rounded-2xl overflow-hidden border border-teal-50 shadow-sm">
                                    <img src={f.image_url} alt="Snap" className="w-full object-cover max-h-40" />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Input */}
                        <div className="bg-teal-50/50 p-6 rounded-[2rem] border border-teal-100/50">
                          <textarea 
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            placeholder="Share your thoughts with the tribe..."
                            className="w-full bg-transparent border-none p-0 text-teal-900 placeholder:text-teal-900/30 text-sm focus:ring-0 resize-none h-20 font-medium"
                          />
                          <div className="flex justify-between items-center mt-4">
                            <label className="flex items-center gap-2 px-4 py-2 bg-white text-teal-700 rounded-full cursor-pointer hover:shadow-md transition-all text-xs font-bold border border-teal-100">
                              <Upload size={14} />
                              {uploading ? 'SHARING...' : 'UPLOAD SNAP'}
                              <input type="file" className="hidden" onChange={(e) => onUploadImage(e, feature.id)} disabled={uploading} />
                            </label>
                            <button 
                              onClick={() => onSendFeedback(feature.id)}
                              className="px-8 py-2.5 bg-teal-600 text-white font-black rounded-full hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20 text-xs uppercase tracking-widest"
                            >
                              PUBLISH
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
            <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-teal-100/50">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-teal-50 rounded-xl">
                  <Calendar size={20} className="text-teal-600" />
                </div>
                <h2 className="text-xl font-black text-[#0f342a] tracking-tight uppercase">Legacy Timeline</h2>
              </div>
              <div className="space-y-8">
                {versions.map((v, i) => (
                  <div key={v.id} className="relative pl-8">
                    {i !== versions.length - 1 && (
                      <div className="absolute left-[11px] top-4 bottom-[-32px] w-0.5 bg-teal-50" />
                    )}
                    <div className="absolute left-0 top-[4px] w-6 h-6 bg-white border-4 border-teal-500 rounded-full shadow-sm" />
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-black text-teal-900">Island v{v.version_number}</span>
                    </div>
                    <p className="text-xs text-teal-800/60 font-medium leading-relaxed">{v.release_notes}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-[#1a4d3e] text-white rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl shadow-teal-900/20">
              <div className="absolute top-[-20%] right-[-20%] w-40 h-40 bg-teal-400/20 blur-[40px] rounded-full" />
              <MapPin className="text-teal-400 mb-6" size={40} />
              <h3 className="text-2xl font-black mb-3 leading-tight">Gathering Ground</h3>
              <p className="text-teal-100/70 text-sm mb-8 leading-relaxed font-medium">Taiwan node is pulsing with life. Community data is blooming across the island.</p>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-teal-300">Energy</span>
                  <span className="text-sm font-mono font-bold text-teal-100 tracking-tighter">SURGING</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-teal-300">Sync</span>
                  <span className="text-sm font-mono font-bold text-teal-100 tracking-tighter">100%</span>
                </div>
              </div>
            </section>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-16 mt-12 text-center border-t border-teal-100/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-[10px] font-black tracking-[0.4em] text-teal-900/20 uppercase mb-8">
            Created with Love for Taiwan · 2026
          </div>
          <div className="flex justify-center gap-10 text-[10px] font-black uppercase tracking-widest text-teal-900/40">
            <a href="#" className="hover:text-teal-600 transition-colors">Manifesto</a>
            <a href="#" className="hover:text-teal-600 transition-colors">Vibe Code</a>
            <a href="#" className="hover:text-teal-600 transition-colors">Tribe Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GathertaiwanSkin;