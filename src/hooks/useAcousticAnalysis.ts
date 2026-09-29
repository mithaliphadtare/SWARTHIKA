import { useState, useEffect } from 'react';
import { AcousticMetrics } from '../types/svi';
import { useSessionStore } from '../store/sessionStore';

export function useAcousticAnalysis(isActive: boolean = false) {
  const acousticMetrics = useSessionStore((s) => s.acousticMetrics);
  const [smoothedMetrics, setSmoothedMetrics] = useState<AcousticMetrics>(acousticMetrics);

  useEffect(() => {
    if (!isActive) {
      setSmoothedMetrics(acousticMetrics);
      return;
    }

    const interval = setInterval(() => {
      setSmoothedMetrics((prev) => ({
        pitch: Math.round(prev.pitch * 0.7 + acousticMetrics.pitch * 0.3),
        energy: Math.round(prev.energy * 0.7 + acousticMetrics.energy * 0.3),
        speechRate: Math.round(prev.speechRate * 0.7 + acousticMetrics.speechRate * 0.3),
        pauses: Math.round(prev.pauses * 0.7 + acousticMetrics.pauses * 0.3),
        jitter: acousticMetrics.jitter,
        shimmer: acousticMetrics.shimmer,
      }));
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, acousticMetrics]);

  return smoothedMetrics;
}
