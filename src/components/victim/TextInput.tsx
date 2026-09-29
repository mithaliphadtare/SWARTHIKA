import React, { useState } from 'react';
import { useSessionStore } from '../../store/sessionStore';
import { useTranslation } from '../../hooks/useTranslation';
import { useCaseStore } from '../../store/caseStore';
import { mockApi } from '../../lib/mockApi';
import {
  Send,
  Mic,
  MessageSquare,
  Sparkles,
  Loader2,
  CheckCircle,
  User,
  Bot,
} from 'lucide-react';
import { SilentSOSButton } from './SilentSOSButton';

export const TextInput: React.FC = () => {
  const {
    language,
    transcript,
    isProcessing,
    setTranscript,
    processAssessment,
    setStep,
    setInteractionMode,
    setGeneratedCaseId,
  } = useSessionStore();

  const { t } = useTranslation();
  const addCase = useCaseStore((s) => s.addCase);

  const [inputVal, setInputVal] = useState('');
  const [messages, setMessages] = useState<{ sender: 'user' | 'system'; text: string; time: string }[]>([
    {
      sender: 'system',
      text: 'You are connected to the confidential SWARTHIKA intake portal. Please describe your situation in your own words.',
      time: 'Just now',
    },
  ]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isProcessing) return;

    const userText = inputVal.trim();
    setInputVal('');

    const newMsgs = [
      ...messages,
      { sender: 'user' as const, text: userText, time: 'Just now' },
    ];
    setMessages(newMsgs);

    const updatedTranscript = transcript ? `${transcript} ${userText}` : userText;
    setTranscript(updatedTranscript);

    // Trigger mock NLP analysis
    await processAssessment(updatedTranscript);

    setMessages((prev) => [
      ...prev,
      {
        sender: 'system',
        text: 'Assessment indicators updated. You may share additional details or submit your assessment for counsellor review.',
        time: 'Just now',
      },
    ]);
  };

  const handleComplete = async () => {
    if (!transcript) return;
    await processAssessment();
    const currentState = useSessionStore.getState();

    const newCase = await mockApi.createCase({
      language,
      channel: 'Text',
      status: currentState.isSOS ? 'Escalated' : 'New',
      riskLevel: currentState.riskLevel,
      sviScore: currentState.currentSVI,
      confidence: currentState.sviResult?.confidence || 86,
      sviDetails: currentState.sviResult || ({} as any),
      transcript: currentState.transcript,
      transcriptEntries: messages.map((m) => ({
        speaker: m.sender === 'user' ? 'Victim' : 'System',
        text: m.text,
        timestamp: m.time,
      })),
      indicators: currentState.indicators || ({} as any),
      recommendations: [
        {
          id: 'rec-txt-1',
          title: 'Text-Based Review & Support',
          priority: currentState.currentSVI > 60 ? 'High' : 'Medium',
          category: 'Counselling',
          description: 'A designated officer will follow up confidentially via verified communication channel.',
        },
      ],
      isSOS: currentState.isSOS,
      isDemo: false,
      consentGiven: true,
      piiRedacted: true,
      notes: 'Submitted via citizen text assessment portal.',
    });

    addCase(newCase);
    setGeneratedCaseId(newCase.id);
    setStep('confirmation');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 md:py-8 space-y-5 animate-fadeIn">
      {/* Top Controls */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3 shadow-xs">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-tealbrand-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            {t('type_title')}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setInteractionMode('Voice')}
            className="text-xs font-semibold text-slate-600 hover:text-brand-600 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Mic className="w-3.5 h-3.5 text-brand-600" />
            <span>{t('switch_to_voice')}</span>
          </button>
          <SilentSOSButton />
        </div>
      </div>

      {/* Message Stream */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs min-h-[300px] max-h-[420px] overflow-y-auto space-y-4">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${
              m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                m.sender === 'user'
                  ? 'bg-brand-600 text-white'
                  : 'bg-tealbrand-100 text-tealbrand-800'
              }`}
            >
              {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-brand-600 text-white rounded-tr-none'
                  : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
              }`}
            >
              <p>{m.text}</p>
              <span
                className={`block text-[10px] mt-1 ${
                  m.sender === 'user' ? 'text-brand-200' : 'text-slate-400'
                }`}
              >
                {m.time}
              </span>
            </div>
          </div>
        ))}

        {isProcessing && (
          <div className="flex items-center gap-2 text-xs text-brand-600 bg-brand-50 p-2.5 rounded-xl border border-brand-100 animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>AI analyzing linguistic and distress markers...</span>
          </div>
        )}
      </div>

      {/* Input Field & Submit Action */}
      <form onSubmit={handleSendMessage} className="bg-white border border-slate-200 rounded-2xl p-2.5 flex items-center gap-2 shadow-xs">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder={t('type_placeholder')}
          disabled={isProcessing}
          className="flex-1 px-4 py-2.5 text-sm sm:text-base text-slate-800 focus:outline-none placeholder:text-slate-400"
        />
        <button
          type="submit"
          disabled={!inputVal.trim() || isProcessing}
          className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">{t('send_message')}</span>
        </button>
      </form>

      {/* Complete Assessment Action */}
      {transcript && (
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleComplete}
            disabled={isProcessing}
            className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <CheckCircle className="w-4 h-4" />
            <span>{t('complete_assessment')}</span>
          </button>
        </div>
      )}
    </div>
  );
};
