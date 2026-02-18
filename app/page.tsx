'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import {
  LayoutDashboard, GitBranch, MessageSquare, Rocket, CheckCircle2,
  Clock, AlertCircle, Image as ImageIcon, ChevronRight, Terminal,
  Send, ThumbsUp, ShieldCheck, XCircle, ArrowUpRight, Package
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================
// Types
// ============================================
type Product = {
  id: string; name: string; description: string;
  repo_url: string; staging_url: string; production_url: string; status: string;
};
type Feature = {
  id: string; product_id: string; name: string; description: string;
  status: string; progress_pct: number; priority: string; created_at: string;
};
type Feedback = {
  id: string; product_id: string; feature_id: string; author: string;
  text: string; screenshot_url: string; status: string; created_at: string;
};
type PipelineLog = {
  id: string; product_id: string; feedback_id: string; stage: string;
  status: string; logs: string; duration_ms: number; created_at: string;
};
type Version = {
  id: string; product_id: string; version_tag: string; commit_hash: string;
  change_summary: string; author: string; environment: string; created_at: string;
};

// ============================================
// Status Helpers
// ============================================
const statusColors: Record<string, string> = {
  'Backlog': 'bg-zinc-700 text-zinc-300',
  'In Progress': 'bg-amber-600/20 text-amber-400 border border-amber-600/30',
  'Testing': 'bg-blue-600/20 text-blue-400 border border-blue-600/30',
  'Staging': 'bg-purple-600/20 text-purple-400 border border-purple-600/30',
  'Live': 'bg-emerald-600/20 text-emerald-400 border border-emerald-600/30',
};

const feedbackStatusConfig: Record<string, { label: string; color: string; icon: any }> = {
  'pending': { label: '待審核', color: 'text-amber-400', icon: Clock },
  'approved': { label: '已批准', color: 'text-blue-400', icon: ThumbsUp },
  'fixing': { label: 'AI 修復中', color: 'text-cyan-400', icon: Terminal },
  'staged': { label: '已上測試站', color: 'text-purple-400', icon: Rocket },
  'verified': { label: '驗證通過', color: 'text-emerald-400', icon: ShieldCheck },
  'deployed': { label: '已上線', color: 'text-green-400', icon: CheckCircle2 },
  'rejected': { label: '不處理', color: 'text-zinc-500', icon: XCircle },
};

const pipelineStageLabel: Record<string, string> = {
  'ai_fix': '🤖 AI 自動修復',
  'unit_test': '🧪 單元測試',
  'build': '🔨 建置',
  'deploy_staging': '🚀 部署至測試站',
  'deploy_production': '🚢 部署至正式站',
};

// ============================================
// Main Component
// ============================================
export default function DayinUPDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeProduct, setActiveProduct] = useState<string>('dating-up');
  const [features, setFeatures] = useState<Feature[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [pipelineLogs, setPipelineLogs] = useState<PipelineLog[]>([]);
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'features' | 'pipeline' | 'feedback'>('features');

  // ---- Data Fetching ----
  const fetchData = useCallback(async () => {
    const [prodRes, featRes, fbRes, plRes, verRes] = await Promise.all([
      supabase.from('products').select('*').eq('status', 'active'),
      supabase.from('features').select('*').eq('product_id', activeProduct).order('priority', { ascending: true }),
      supabase.from('feedbacks').select('*').eq('product_id', activeProduct).order('created_at', { ascending: false }),
      supabase.from('pipeline_logs').select('*').eq('product_id', activeProduct).order('created_at', { ascending: false }).limit(50),
      supabase.from('versions').select('*').eq('product_id', activeProduct).order('created_at', { ascending: false }).limit(20),
    ]);

    if (prodRes.data) setProducts(prodRes.data);
    if (featRes.data) setFeatures(featRes.data);
    if (fbRes.data) setFeedbacks(fbRes.data);
    if (plRes.data) setPipelineLogs(plRes.data);
    if (verRes.data) setVersions(verRes.data);
    setLoading(false);
  }, [activeProduct]);

  useEffect(() => {
    setLoading(true);
    fetchData();

    const channel = supabase
      .channel(`dayinup-${activeProduct}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'features', filter: `product_id=eq.${activeProduct}` }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'feedbacks', filter: `product_id=eq.${activeProduct}` }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pipeline_logs', filter: `product_id=eq.${activeProduct}` }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'versions', filter: `product_id=eq.${activeProduct}` }, () => fetchData())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [activeProduct, fetchData]);

  // ---- Actions ----
  const handleSendFeedback = async (featureId: string) => {
    if (!feedbackText.trim()) return;
    await supabase.from('feedbacks').insert({
      product_id: activeProduct,
      feature_id: featureId,
      text: feedbackText,
      author: 'Partner',
      status: 'pending',
    });
    setFeedbackText('');
  };

  const handleUploadScreenshot = async (e: React.ChangeEvent<HTMLInputElement>, featureId: string) => {
    try {
      setUploading(true);
      const file = e.target.files?.[0];
      if (!file) return;
      const fileExt = file.name.split('.').pop();
      const fileName = `${activeProduct}/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('screenshots').upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('screenshots').getPublicUrl(fileName);
      await supabase.from('feedbacks').insert({
        product_id: activeProduct,
        feature_id: featureId,
        text: 'Screenshot attached',
        screenshot_url: publicUrl,
        author: 'Partner',
        status: 'pending',
      });
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleApproveFeedback = async (feedbackId: string) => {
    await supabase.from('feedbacks').update({ status: 'approved' }).eq('id', feedbackId);
  };

  const handleRejectFeedback = async (feedbackId: string) => {
    await supabase.from('feedbacks').update({ status: 'rejected' }).eq('id', feedbackId);
  };

  // ---- Loading ----
  if (loading) {
    return (
      <div className="min-h-screen bg-[#050510] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-2 border-orange-500/30 border-t-orange-400 rounded-full animate-spin mx-auto" />
          <p className="text-orange-500/60 font-mono text-xs tracking-[0.3em] uppercase">Initializing DayinUP System...</p>
        </div>
      </div>
    );
  }

  // ---- Render ----
  return (
    <div className="min-h-screen bg-[#050510] text-zinc-300 font-sans selection:bg-orange-500/20">
      {/* ===== HEADER ===== */}
      <header className="h-16 bg-[#0a0a1a]/80 backdrop-blur-xl border-b border-white/5 px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center font-black text-white text-sm shadow-lg shadow-orange-500/20">
              DU
            </div>
            <span className="text-sm font-bold text-white tracking-tight hidden sm:block">DayinUP</span>
          </div>

          {/* Product Switcher */}
          <nav className="flex items-center gap-1 bg-white/[0.03] p-1 rounded-lg border border-white/5">
            {products.map((p) => (
              <button
                key={p.id}
                onClick={() => setActiveProduct(p.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${activeProduct === p.id
                  ? 'bg-orange-500/10 text-orange-400 shadow-inner'
                  : 'text-zinc-500 hover:text-zinc-300'
                  }`}
              >
                {p.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">System Online</span>
          </div>
        </div>
      </header>

      {/* ===== TAB NAVIGATION ===== */}
      <div className="border-b border-white/5 px-6 bg-[#0a0a1a]/40">
        <nav className="flex gap-1">
          {[
            { key: 'features' as const, label: 'Features', icon: Package },
            { key: 'pipeline' as const, label: 'Pipeline', icon: Terminal },
            { key: 'feedback' as const, label: 'Feedback', icon: MessageSquare },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all ${activeTab === key
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
                }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <main className="max-w-[1400px] mx-auto p-6">
        <AnimatePresence mode="wait">
          {/* ---------- FEATURES TAB ---------- */}
          {activeTab === 'features' && (
            <motion.div key="features" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Feature Cards */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-bold text-white">Product Evolution</h2>
                  <span className="text-xs text-zinc-600 font-mono">{features.length} features</span>
                </div>
                {features.map((f) => {
                  const statusMap = ['Backlog', 'In Progress', 'Testing', 'Staging', 'Live'];
                  let stepIndex = statusMap.indexOf(f.status);
                  if (stepIndex === -1 && f.status === 'done') stepIndex = 4;
                  if (stepIndex === -1) stepIndex = 0;

                  const isFixing = feedbacks.some(fb => fb.feature_id === f.id && fb.status === 'fixing');
                  const product = products.find(p => p.id === activeProduct);
                  const isStaged = stepIndex >= 3;
                  const isLive = stepIndex >= 4;

                  return (
                    <motion.div
                      key={f.id}
                      layout
                      className={`rounded-xl border transition-all cursor-pointer group ${selectedFeature === f.id
                        ? 'border-orange-500/30 bg-orange-500/[0.03]'
                        : 'border-white/5 bg-white/[0.02] hover:border-white/10'
                        }`}
                      onClick={() => setSelectedFeature(selectedFeature === f.id ? null : f.id)}
                    >
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-6">
                          <div>
                            <h3 className="text-sm font-bold text-white mb-1 group-hover:text-orange-400 transition-colors">{f.name}</h3>
                            <p className="text-xs text-zinc-500 max-w-md">{f.description}</p>
                          </div>
                          <div className="flex gap-2">
                            <div className={`flex items-center gap-1.5 px-2 py-1 rounded border ${isStaged
                              ? 'bg-purple-500/10 border-purple-500/20 text-purple-400'
                              : 'bg-zinc-800/50 border-white/5 text-zinc-600 grayscale opacity-50'}`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${isStaged ? 'bg-purple-400 animate-pulse' : 'bg-zinc-600'}`} />
                              <span className="text-[9px] font-bold uppercase tracking-wider">TEST</span>
                              {isStaged && product?.staging_url && (
                                <a href={product.staging_url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="ml-1 hover:text-white"><ArrowUpRight className="w-3 h-3" /></a>
                              )}
                            </div>
                            <div className={`flex items-center gap-1.5 px-2 py-1 rounded border ${isLive
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                              : 'bg-zinc-800/50 border-white/5 text-zinc-600 grayscale opacity-50'}`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'}`} />
                              <span className="text-[9px] font-bold uppercase tracking-wider">PROD</span>
                              {isLive && product?.production_url && (
                                <a href={product.production_url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="ml-1 hover:text-white"><ArrowUpRight className="w-3 h-3" /></a>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Milestone Tracker */}
                        <div className="relative mt-2 mb-2">
                          <div className="absolute top-2.5 left-0 w-full h-0.5 bg-zinc-800 rounded-full" />
                          <div className="absolute top-2.5 left-0 h-0.5 bg-gradient-to-r from-orange-600 to-red-600 rounded-full transition-all duration-500" style={{ width: `${(stepIndex / 4) * 100}%` }} />
                          <div className="relative flex justify-between">
                            {[
                              { label: 'Backlog', icon: Package },
                              { label: 'Dev', icon: GitBranch },
                              { label: isFixing ? 'AI Fix' : 'Test', icon: isFixing ? AlertCircle : CheckCircle2, color: isFixing ? 'text-red-400' : '' },
                              { label: 'Stage', icon: Rocket },
                              { label: 'Live', icon: ShieldCheck },
                            ].map((s, idx) => {
                              const isActive = idx <= stepIndex;
                              const isCurrent = idx === stepIndex;
                              const Icon = s.icon;
                              let circleColor = 'bg-zinc-800 border-zinc-700 text-zinc-500';
                              if (s.color && isCurrent) circleColor = `bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_10px_rgba(248,113,113,0.3)]`;
                              else if (isActive && isCurrent) circleColor = 'bg-[#050510] border-orange-500 text-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.2)]';
                              else if (isActive) circleColor = 'bg-orange-500 border-orange-500 text-[#050510]';

                              return (
                                <div key={idx} className="flex flex-col items-center gap-2 relative z-10 group/step">
                                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${circleColor}`}>
                                    <Icon className="w-3 h-3" />
                                  </div>
                                  <span className={`text-[10px] font-medium transition-colors ${isActive ? (s.color || 'text-orange-200') : 'text-zinc-600 group-hover/step:text-zinc-500'}`}>
                                    {s.label}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Expanded: Feedback Input */}
                      <AnimatePresence>
                        {selectedFeature === f.id && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                            <div className="px-5 pb-5 pt-4 border-t border-white/5 space-y-4">
                              <div className="space-y-3 max-h-60 overflow-y-auto">
                                {feedbacks.filter(fb => fb.feature_id === f.id).map((fb) => {
                                  const cfg = feedbackStatusConfig[fb.status] || feedbackStatusConfig['pending'];
                                  const StatusIcon = cfg.icon;
                                  return (
                                    <div key={fb.id} className="flex gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5">
                                      <div className="shrink-0 w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center">
                                        <StatusIcon className={`w-3.5 h-3.5 ${cfg.color}`} />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                          <span className="text-xs font-bold text-zinc-300">{fb.author}</span>
                                          <span className={`text-[10px] font-semibold ${cfg.color}`}>{cfg.label}</span>
                                        </div>
                                        <p className="text-xs text-zinc-400 leading-relaxed">{fb.text}</p>
                                        {fb.screenshot_url && (
                                          <img src={fb.screenshot_url} alt="Screenshot" className="mt-2 rounded-lg border border-white/5 max-w-xs" />
                                        )}
                                        {fb.status === 'pending' && (
                                          <div className="flex gap-2 mt-2">
                                            <button onClick={(e) => { e.stopPropagation(); handleApproveFeedback(fb.id); }} className="px-3 py-1 rounded-md bg-orange-500/10 text-orange-400 text-[10px] font-bold hover:bg-orange-500/20 transition-colors">
                                              ✅ Approve & Fix
                                            </button>
                                            <button onClick={(e) => { e.stopPropagation(); handleRejectFeedback(fb.id); }} className="px-3 py-1 rounded-md bg-zinc-800 text-zinc-500 text-[10px] font-bold hover:bg-zinc-700 transition-colors">
                                              ✕ Skip
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>

                              <div className="flex gap-2 items-center bg-white/[0.03] p-2 rounded-lg border border-white/5">
                                <input
                                  type="text"
                                  placeholder="Leave feedback or report an issue..."
                                  className="flex-1 bg-transparent px-3 py-1.5 text-xs focus:outline-none placeholder:text-zinc-600"
                                  value={feedbackText}
                                  onChange={(e) => setFeedbackText(e.target.value)}
                                  onKeyDown={(e) => e.key === 'Enter' && handleSendFeedback(f.id)}
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <label className="cursor-pointer hover:text-orange-400 transition-colors p-1.5" onClick={(e) => e.stopPropagation()}>
                                  <ImageIcon className="w-4 h-4" />
                                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUploadScreenshot(e, f.id)} />
                                </label>
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleSendFeedback(f.id); }}
                                  className="p-1.5 rounded-md bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 transition-colors"
                                >
                                  <Send className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>

              {/* Version Timeline */}
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-white mb-2">Version History</h2>
                <div className="space-y-1">
                  {versions.map((v) => (
                    <div key={v.id} className="relative pl-6 pb-6 border-l border-zinc-800/50 last:pb-0">
                      <div className="absolute left-[-4px] top-1.5 w-2 h-2 rounded-full bg-orange-500" />
                      <div className="text-[10px] font-mono text-zinc-600 mb-0.5">{new Date(v.created_at).toLocaleDateString()}</div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        {v.version_tag}
                        <span className={`text-[9px] px-1.5 py-0.5 rounded ${v.environment === 'production' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-purple-500/10 text-purple-400'}`}>
                          {v.environment}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">{v.change_summary}</p>
                    </div>
                  ))}
                  {versions.length === 0 && <p className="text-xs text-zinc-600 text-center py-8">No version history yet</p>}
                </div>
              </div>
            </motion.div>
          )}

          {/* ---------- PIPELINE TAB ---------- */}
          {activeTab === 'pipeline' && (
            <motion.div key="pipeline" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <h2 className="text-lg font-bold text-white mb-4">Pipeline Logs</h2>
              <div className="rounded-xl border border-white/5 bg-[#0a0a12] overflow-hidden">
                <div className="p-4 border-b border-white/5 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-orange-500" />
                  <span className="text-xs font-mono text-orange-400">dayinup@pipeline ~ $</span>
                </div>
                <div className="p-4 font-mono text-xs space-y-2 max-h-[600px] overflow-y-auto">
                  {pipelineLogs.length === 0 && (
                    <p className="text-zinc-600">No pipeline activity yet. Approve a feedback to trigger the first run.</p>
                  )}
                  {pipelineLogs.map((log) => (
                    <div key={log.id} className="flex items-start gap-3 py-2 border-b border-white/[0.03]">
                      <span className="text-zinc-600 shrink-0 w-16">{new Date(log.created_at).toLocaleTimeString()}</span>
                      <span className={`shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[8px] ${log.status === 'success' ? 'bg-emerald-500/20 text-emerald-400' :
                        log.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                          log.status === 'running' ? 'bg-orange-500/20 text-orange-400 animate-pulse' :
                            'bg-zinc-700 text-zinc-400'
                        }`}>
                        {log.status === 'success' ? '✓' : log.status === 'failed' ? '✕' : log.status === 'running' ? '⟳' : '–'}
                      </span>
                      <div className="flex-1">
                        <span className="text-zinc-300">{pipelineStageLabel[log.stage] || log.stage}</span>
                        {log.logs && <p className="text-zinc-600 mt-1 whitespace-pre-wrap">{log.logs}</p>}
                      </div>
                      {log.duration_ms && <span className="text-zinc-600 text-[10px]">{log.duration_ms}ms</span>}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ---------- FEEDBACK TAB ---------- */}
          {activeTab === 'feedback' && (
            <motion.div key="feedback" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <h2 className="text-lg font-bold text-white mb-4">All Feedback</h2>
              <div className="space-y-3">
                {feedbacks.length === 0 && (
                  <p className="text-zinc-600 text-center py-12 text-sm">No feedback yet. Click a feature to leave a comment.</p>
                )}
                {feedbacks.map((fb) => {
                  const cfg = feedbackStatusConfig[fb.status] || feedbackStatusConfig['pending'];
                  const StatusIcon = cfg.icon;
                  const relatedFeature = features.find(f => f.id === fb.feature_id);
                  return (
                    <div key={fb.id} className="p-4 rounded-xl border border-white/5 bg-white/[0.02] flex gap-4">
                      <div className="shrink-0 w-9 h-9 rounded-full bg-zinc-800/50 flex items-center justify-center">
                        <StatusIcon className={`w-4 h-4 ${cfg.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-zinc-200">{fb.author}</span>
                            {relatedFeature && (
                              <span className="text-[10px] text-zinc-600">on {relatedFeature.name}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${cfg.color} bg-white/[0.03]`}>{cfg.label}</span>
                            <span className="text-[10px] text-zinc-600 font-mono">{new Date(fb.created_at).toLocaleString()}</span>
                          </div>
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed">{fb.text}</p>
                        {fb.screenshot_url && (
                          <img src={fb.screenshot_url} alt="Screenshot" className="mt-3 rounded-lg border border-white/5 max-w-sm" />
                        )}
                        {fb.status === 'pending' && (
                          <div className="flex gap-2 mt-3">
                            <button onClick={() => handleApproveFeedback(fb.id)} className="px-3 py-1.5 rounded-md bg-orange-500/10 text-orange-400 text-xs font-bold hover:bg-orange-500/20 transition-colors flex items-center gap-1.5">
                              <ThumbsUp className="w-3 h-3" /> Approve & Fix
                            </button>
                            <button onClick={() => handleRejectFeedback(fb.id)} className="px-3 py-1.5 rounded-md bg-zinc-800 text-zinc-500 text-xs font-bold hover:bg-zinc-700 transition-colors">
                              Skip
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}