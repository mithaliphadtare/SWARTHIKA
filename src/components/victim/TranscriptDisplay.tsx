import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { MessageSquareQuote, Sparkles } from 'lucide-react';

interface TranscriptDisplayProps {
  transcript: string;
  isStreaming?: boolean;
}

export const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({
  transcript,
  isStreaming = false,
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <MessageSquareQuote className="w-4 h-4 text-brand-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            {t('live_transcript_title')}
          </h4>
        </div>
        {isStreaming && (
          <span className="flex items-center gap-1.5 text-xs text-brand-600 font-medium">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>Transcribing in real-time</span>
          </span>
        )}
      </div>

      <div className="min-h-[110px] max-h-[220px] overflow-y-auto pr-2">
        {transcript ? (
          <p className="text-base sm:text-lg text-slate-800 font-sans leading-relaxed transition-all">
            {transcript}
            {isStreaming && (
              <span className="inline-block w-2 h-4 bg-brand-600 ml-1.5 animate-pulse rounded-xs" />
            )}
          </p>
        ) : (
          <div className="flex items-center justify-center h-24 text-slate-400 text-sm italic">
            {t('waiting_for_speech')}
          </div>
        )}
      </div>
    </div>
  );
};
