import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';

export const BackgroundMusic: React.FC = () => {
  const { settings } = useApp();
  const [playlist, setPlaylist] = useState<string[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(-1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch playlist
  useEffect(() => {
    const fetchMusic = async () => {
      try {
        const res = await fetch('/api/music');
        if (res.ok) {
          const files = await res.json();
          if (files.length > 0) {
            // Shuffle the playlist initially
            const shuffled = [...files].sort(() => Math.random() - 0.5);
            setPlaylist(shuffled);
            setCurrentTrackIndex(0);
          }
        }
      } catch (err) {
        console.error('Failed to load music list:', err);
      }
    };
    fetchMusic();
  }, []);

  // Sync volume and play/pause state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = (settings.bgmVolume / 100) * (settings.volume / 100);
      
      if (settings.bgmEnabled) {
        audioRef.current.play().catch(e => {
          console.warn('Auto-play blocked, waiting for user interaction');
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [settings.bgmEnabled, settings.bgmVolume, settings.volume, currentTrackIndex]);

  const handleEnded = () => {
    // Pick a new random track (ensure it's different if there's more than 1)
    if (playlist.length > 1) {
      let nextIndex;
      do {
        nextIndex = Math.floor(Math.random() * playlist.length);
      } while (nextIndex === currentTrackIndex);
      setCurrentTrackIndex(nextIndex);
    } else if (playlist.length === 1) {
      // Re-trigger playback of same file
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    }
  };

  if (playlist.length === 0 || currentTrackIndex === -1) return null;

  return (
    <audio
      ref={audioRef}
      src={`/musica/${playlist[currentTrackIndex]}`}
      onEnded={handleEnded}
      hidden
    />
  );
};
