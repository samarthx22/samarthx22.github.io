import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { AudioPlayer } from './AudioPlayer';

interface Beat {
  id: string;
  title: string;
  audio_url: string;
}

export function BeatLibrary() {
  const [beats, setBeats] = useState<Beat[]>([]);

  useEffect(() => {
    loadBeats();
  }, []);

  async function loadBeats() {
    const { data, error } = await supabase
      .from('beats')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error loading beats:', error);
      return;
    }
    
    if (data) setBeats(data);
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Available Beats</h2>
      <div className="space-y-4">
        {beats.length === 0 ? (
          <p className="text-gray-400">No beats available yet. Login to upload some beats!</p>
        ) : (
          beats.map((beat) => (
            <AudioPlayer key={beat.id} url={beat.audio_url} title={beat.title} />
          ))
        )}
      </div>
    </div>
  );
}