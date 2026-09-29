import { AcousticMetrics, SVIResult } from '../types/svi';
import { ClinicalIndicator } from '../types/indicators';

export type WebSocketEventType =
  | 'TRANSCRIPT_UPDATE'
  | 'ACOUSTIC_UPDATE'
  | 'NLP_UPDATE'
  | 'SVI_UPDATE'
  | 'ASSESSMENT_COMPLETE'
  | 'SOS_ACKNOWLEDGED';

export interface WebSocketEvent<T = any> {
  type: WebSocketEventType;
  payload: T;
  timestamp: string;
}

export type WebSocketListener = (event: WebSocketEvent) => void;

class MockWebSocketClient {
  private listeners: Set<WebSocketListener> = new Set();
  private isConnected: boolean = true;

  subscribe(listener: WebSocketListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  emit<T>(type: WebSocketEventType, payload: T): void {
    const event: WebSocketEvent<T> = {
      type,
      payload,
      timestamp: new Date().toISOString(),
    };
    this.listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (err) {
        console.error('Error in mock WS listener:', err);
      }
    });
  }

  // Helper method to stream a full scenario word by word with progressive updates
  streamScenario(
    fullText: string,
    acousticTimeline: AcousticMetrics[],
    finalSVI: SVIResult,
    indicators: Record<string, ClinicalIndicator>,
    onComplete?: () => void,
    onProgress?: (word: string, currentSVI: number) => void
  ): () => void {
    const words = fullText.split(' ');
    let wordIndex = 0;
    let cancelled = false;

    const intervalId = setInterval(() => {
      if (cancelled) {
        clearInterval(intervalId);
        return;
      }

      if (wordIndex < words.length) {
        const partialTranscript = words.slice(0, wordIndex + 1).join(' ');
        const progressRatio = (wordIndex + 1) / words.length;

        // Emit Transcript
        this.emit('TRANSCRIPT_UPDATE', {
          transcript: partialTranscript,
          latestWord: words[wordIndex],
          isFinal: wordIndex === words.length - 1,
        });

        // Emit Acoustic
        const acousticIdx = Math.min(
          Math.floor(progressRatio * acousticTimeline.length),
          acousticTimeline.length - 1
        );
        const currentAcoustic = acousticTimeline[acousticIdx] || {
          pitch: 35 + Math.round(progressRatio * 30),
          energy: 40 + Math.round(progressRatio * 35),
          speechRate: 50 + Math.round(progressRatio * 20),
          pauses: 20 + Math.round(progressRatio * 40),
        };
        this.emit('ACOUSTIC_UPDATE', currentAcoustic);

        // Emit Progressive SVI
        const currentSVIValue = Math.round(finalSVI.score * progressRatio);
        this.emit('SVI_UPDATE', {
          score: currentSVIValue,
          progress: progressRatio,
        });

        if (onProgress) {
          onProgress(words[wordIndex], currentSVIValue);
        }

        wordIndex++;
      } else {
        clearInterval(intervalId);

        // Emit NLP indicators
        this.emit('NLP_UPDATE', { indicators });

        // Emit Final Complete
        this.emit('ASSESSMENT_COMPLETE', {
          svi: finalSVI,
          transcript: fullText,
          indicators,
        });

        if (onComplete) {
          onComplete();
        }
      }
    }, 280);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }
}

export const mockWebSocket = new MockWebSocketClient();
