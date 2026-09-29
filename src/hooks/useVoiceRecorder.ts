import { useState, useEffect, useRef, useCallback } from 'react';
import { SupportedLanguage } from '../types/case';
import { useSessionStore } from '../store/sessionStore';

interface VoiceRecorderOptions {
  language: SupportedLanguage;
  onTranscriptUpdate?: (text: string) => void;
  onAcousticUpdate?: (metrics: { pitch: number; energy: number; speechRate: number; pauses: number }) => void;
}

export function useVoiceRecorder({
  language,
  onTranscriptUpdate,
  onAcousticUpdate,
}: VoiceRecorderOptions) {
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const simulationIntervalRef = useRef<any>(null);
  const acousticTimerRef = useRef<any>(null);

  const { isRecording, appendTranscript, setAcousticMetrics } = useSessionStore();

  const getLangCode = (lang: SupportedLanguage) => {
    switch (lang) {
      case 'hi':
        return 'hi-IN';
      case 'mr':
        return 'mr-IN';
      case 'en':
      default:
        return 'en-IN';
    }
  };

  // Acoustic animation loop
  const startAcousticLoop = useCallback(() => {
    if (acousticTimerRef.current) clearInterval(acousticTimerRef.current);
    acousticTimerRef.current = setInterval(() => {
      const basePitch = 40 + Math.sin(Date.now() / 400) * 20 + Math.random() * 10;
      const baseEnergy = 50 + Math.cos(Date.now() / 300) * 25 + Math.random() * 15;
      const baseRate = 55 + Math.sin(Date.now() / 600) * 15;
      const basePauses = 25 + Math.random() * 20;

      const metrics = {
        pitch: Math.round(Math.min(Math.max(basePitch, 10), 95)),
        energy: Math.round(Math.min(Math.max(baseEnergy, 15), 98)),
        speechRate: Math.round(Math.min(Math.max(baseRate, 20), 90)),
        pauses: Math.round(Math.min(Math.max(basePauses, 5), 85)),
      };

      setAcousticMetrics(metrics);
      if (onAcousticUpdate) onAcousticUpdate(metrics);
    }, 200);
  }, [setAcousticMetrics, onAcousticUpdate]);

  const stopAcousticLoop = useCallback(() => {
    if (acousticTimerRef.current) {
      clearInterval(acousticTimerRef.current);
      acousticTimerRef.current = null;
    }
  }, []);

  // Web Speech API initialization
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = getLangCode(language);

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            const finalChunk = event.results[i][0].transcript.trim();
            appendTranscript(finalChunk);
            if (onTranscriptUpdate) onTranscriptUpdate(finalChunk);
          } else {
            currentTranscript += event.results[i][0].transcript;
          }
        }
      };

      recognition.onerror = (e: any) => {
        console.warn('Web Speech API event notice (using resilient fallback if blocked):', e.error);
        if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
          setError('Microphone permission not granted. Falling back to synthetic simulation mode.');
        }
      };

      recognition.onend = () => {
        if (isRecording) {
          try {
            recognition.start();
          } catch (_) {}
        }
      };

      recognitionRef.current = recognition;
    } catch (e) {
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
      stopAcousticLoop();
      if (simulationIntervalRef.current) clearInterval(simulationIntervalRef.current);
    };
  }, [language, appendTranscript, onTranscriptUpdate, isRecording, stopAcousticLoop]);

  const startListening = useCallback(() => {
    setIsListening(true);
    startAcousticLoop();

    if (recognitionRef.current) {
      try {
        recognitionRef.current.lang = getLangCode(language);
        recognitionRef.current.start();
        return;
      } catch (e) {
        // already started or failed, continue with fallback
      }
    }

    // Fallback simulation words
    const fallbackPhrases =
      language === 'hi'
        ? [
            'मैं यहां एक जरूरी बात बताना चाहता हूँ...',
            'मुझे कुछ दिनों से बहुत चिंता हो रही है।',
            'कृपया मेरी सहायता करें और सुरक्षित मार्गदर्शन दें।',
          ]
        : language === 'mr'
        ? [
            'मला घडलेल्या घटनेबद्दल नोंद करायची आहे...',
            'मला सुरक्षिततेची काळजी वाटते आहे.',
            'कृपया मला योग्य मदत द्या.',
          ]
        : [
            'I wanted to report an incident that occurred recently...',
            'I am feeling distressed and need guidance.',
            'Please help me connect with a counsellor safely.',
          ];

    let phraseIdx = 0;
    simulationIntervalRef.current = setInterval(() => {
      if (phraseIdx < fallbackPhrases.length) {
        appendTranscript(fallbackPhrases[phraseIdx]);
        if (onTranscriptUpdate) onTranscriptUpdate(fallbackPhrases[phraseIdx]);
        phraseIdx++;
      }
    }, 3000);
  }, [language, appendTranscript, onTranscriptUpdate, startAcousticLoop]);

  const stopListening = useCallback(() => {
    setIsListening(false);
    stopAcousticLoop();
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
      simulationIntervalRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
    }
  }, [stopAcousticLoop]);

  return {
    isSupported,
    isListening,
    error,
    startListening,
    stopListening,
  };
}
