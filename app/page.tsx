'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import PiktagSkin from '@/components/skins/PiktagSkin';
import DayinupSkin from '@/components/skins/DayinupSkin';
import DeotengSkin from '@/components/skins/DeotengSkin';
import GathertaiwanSkin from '@/components/skins/GathertaiwanSkin';

const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID || 'piktag';
const SITE_SKIN = process.env.NEXT_PUBLIC_SITE_SKIN || 'piktag';

export default function DashboardSwitcher() {
  const [features, setFeatures] = useState<any[]>([]);
  const [versions, setVersions] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [uploading, setUploading] = useState(false);

  async function fetchData() {
    const { data: featureData } = await supabase
      .from('features')
      .select('*')
      .eq('project_id', PROJECT_ID)
      .order('created_at', { ascending: false });

    const { data: versionData } = await supabase
      .from('versions')
      .select('*')
      .eq('project_id', PROJECT_ID)
      .order('created_at', { ascending: false });

    const { data: feedbackData } = await supabase
      .from('feedback')
      .select('*')
      .eq('project_id', PROJECT_ID)
      .order('created_at', { ascending: true });
    
    if (featureData) setFeatures(featureData);
    if (versionData) setVersions(versionData);
    if (feedbackData) setFeedbacks(feedbackData);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel(`db-changes-${PROJECT_ID}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'features', filter: `project_id=eq.${PROJECT_ID}` }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'versions', filter: `project_id=eq.${PROJECT_ID}` }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'feedback', filter: `project_id=eq.${PROJECT_ID}` }, () => fetchData())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>, featureId: string) => {
    try {
      setUploading(true);
      const file = e.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${PROJECT_ID}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('screenshots')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('screenshots')
        .getPublicUrl(filePath);

      await supabase.from('feedback').insert({
        feature_id: featureId,
        project_id: PROJECT_ID,
        image_url: publicUrl,
        author: 'System',
        text: 'Report attachment'
      });
    } catch (error) {
      console.error(error);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSendFeedback = async (featureId: string) => {
    if (!feedbackText.trim()) return;
    const { error } = await supabase.from('feedback').insert({
      feature_id: featureId,
      project_id: PROJECT_ID,
      text: feedbackText,
      author: 'Commander'
    });
    if (!error) setFeedbackText('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500 font-mono text-xs tracking-widest">
        LOADING_{PROJECT_ID.toUpperCase()}_PROTOCOL...
      </div>
    );
  }

  const skinProps = {
    features,
    versions,
    feedbacks,
    selectedFeature,
    setSelectedFeature,
    feedbackText,
    setFeedbackText,
    uploading,
    onUploadImage: handleUploadImage,
    onSendFeedback: handleSendFeedback
  };

  if (SITE_SKIN === 'dayinup') {
    return <DayinupSkin {...skinProps} />;
  }

  if (SITE_SKIN === 'deoteng') {
    return <DeotengSkin {...skinProps} />;
  }

  if (SITE_SKIN === 'gathertaiwan') {
    return <GathertaiwanSkin {...skinProps} />;
  }

  return <PiktagSkin {...skinProps} />;
}