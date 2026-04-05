"use client";

import { useCallback, useRef } from "react";

type SoundName = "drumroll" | "reveal" | "success" | "click" | "dramatic";

const SOUND_MAP: Record<SoundName, string> = {
  drumroll: "/sounds/drumroll.wav",
  reveal: "/sounds/reveal.wav",
  success: "/sounds/success.wav",
  click: "/sounds/click.wav",
  dramatic: "/sounds/dramatic.wav",
};

export function useSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = useCallback((name: SoundName) => {
    try {
      // Stop previous sound
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      const audio = new Audio(SOUND_MAP[name]);
      audio.volume = 0.7;
      audioRef.current = audio;
      audio.play().catch(() => {
        // Browser may block autoplay — ignore silently
      });
    } catch {
      // Audio not available — fail silently
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  return { play, stop };
}
