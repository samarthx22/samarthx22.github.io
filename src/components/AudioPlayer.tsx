import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';

interface AudioPlayerProps {
  url: string;
  title: string;
}

export function AudioPlayer({ url, title }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 flex items-center gap-4">
      <button
        onClick={togglePlay}
        className="w-10 h-10 flex items-center justify-center bg-purple-600 rounded-full hover:bg-purple-700 transition-colors"
      >
        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
      </button>
      <div className="flex-1">
        <p className="text-white font-medium">{title}</p>
        <audio
          ref={audioRef}
          src={url}
          onEnded={() => setIsPlaying(false)}
          className="w-full"
          controls
        />
      </div>
      <Volume2 className="text-gray-400" size={20} />
    </div>
  );
}