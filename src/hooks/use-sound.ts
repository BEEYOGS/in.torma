
'use client';

import { useCallback, useState, useEffect } from 'react';

export const useSound = (src: string, volume: number = 0.5) => {
  // const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  // useEffect(() => {
  //   // We only want to create the Audio object on the client side.
  //   const audioInstance = new Audio(src);
  //   audioInstance.volume = volume;
  //   setAudio(audioInstance);
  // }, [src, volume]);

  const play = useCallback(() => {
    // if (audio) {
    //   // Allows playing the sound again even if it's already playing.
    //   audio.currentTime = 0;
    //   audio.play().catch(err => console.error(`Failed to play sound: ${err}`));
    // }
  }, []);

  return play;
};
