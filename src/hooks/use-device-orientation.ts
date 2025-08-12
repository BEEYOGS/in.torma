
'use client';

import { useState, useEffect } from 'react';

interface DeviceOrientationState {
  alpha: number | null; // Z-axis rotation
  beta: number | null;  // X-axis rotation (front-back tilt)
  gamma: number | null; // Y-axis rotation (left-right tilt)
}

export function useDeviceOrientation(): DeviceOrientationState {
  const [orientation, setOrientation] = useState<DeviceOrientationState>({
    alpha: null,
    beta: null,
    gamma: null,
  });

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      setOrientation({
        alpha: event.alpha,
        beta: event.beta,
        gamma: event.gamma,
      });
    };

    // Check if the browser supports the event
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    } else {
      console.warn('DeviceOrientationEvent not supported on this device/browser.');
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  return orientation;
}
