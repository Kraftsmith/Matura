import React, { useState } from 'react';
import type { WritingPrompt } from '../types';
import { CheckCircle2, Sparkles, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

interface WritingTrainerViewProps {
  prompt: WritingPrompt;
  moduleTitle: string;
}

export const WritingTrainerView: React.FC<WritingTrainerViewProps> = ({ prompt, moduleTitle }) => {
  const [essayText, setEssayText] = useState('');
  const [showModel, setShowModel] = useState(false);
  const [copied, setCopied] = useState(false);

  // Word count calculation
  const words = essayText.trim().split(/\s+/).filter(Boolean);
  const wordCount = essayText.trim() === '' ? 0 : words.length;

  const isUnderMin = wordCount < prompt.wordLimit.min;
  const isOverMax = wordCount > prompt.wordLimit.max;
  const isWithinLimit = wordCount >= prompt.wordLimit.min && wordCount <= prompt.wordLimit.max;

  const handleCopyModel = () => {
    navigator.clipboard.writeText(prompt.modelAnswer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-semibold text-primary">
          Wypowiedź Pisemna • {prompt.type} ({moduleTitle})
        </span>
        <h2 className="text-2xl font-semibold text-ink mt-1">{prompt.title}</h2>
        <div className="flex items-center space-x-2 mt-2">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary-tint text-primary-hover border border-line">
            Poziom {prompt.level}
          </span>
          <span className="text-xs text-ink-2">
            Limit słów:{' '}
            <strong>
              {prompt.wordLimit.min}–{prompt.wordLimit.max} słów
            </strong>
          </span>
        </div>
      </div>

      {/* Task Prompt Box */}
      <div className="bg-surface rounded-2xl border border-line p-6 space-y-4">
        <h3 className="text-sm font-semibold text-ink">Treść polecenia egzaminacyjnego:</h3>
        <p className="text-sm text-ink leading-relaxed font-medium bg-hero p-4 rounded-lg border border-line-soft">
          {prompt.taskPrompt}
        </p>

        {/* Bullet points */}
        <div className="space-y-1.5 pt-2">
          <span className="text-xs font-semibold text-ink-3 block">Elementy do uwzględnienia w pracy:</span>
          <ul className="space-y-1">
            {prompt.bulletPoints.map((bp, idx) => (
              <li key={idx} className="flex items-start space-x-2 text-xs sm:text-sm text-ink">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>{bp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Editor & Word Counter */}
      <div className="bg-surface rounded-2xl border border-line p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-line-soft pb-3">
          <h3 className="text-sm font-semibold text-ink">Pole edycji wypracowania</h3>

          {/* Word Count Pill */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-ink-2 font-medium">Liczba słów:</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                isWithinLimit
                  ? 'bg-success-tint text-success border border-success'
                  : isOverMax
                    ? 'bg-error-tint text-error border border-error'
                    : 'bg-warning-tint text-warning border border-warning'
              }`}
            >
              {wordCount} / {prompt.wordLimit.min}–{prompt.wordLimit.max}
            </span>
          </div>
        </div>

        <textarea
          rows={12}
          value={essayText}
          onChange={(e) => setEssayText(e.target.value)}
          placeholder="Zacznij pisać swoją pracę tutaj... (np. In today's digital era...)"
          className="w-full p-4 rounded-lg border border-line focus:border-primary focus:ring-1 focus:ring-primary outline-hidden font-sans text-sm sm:text-base leading-relaxed text-ink resize-y"
        />

        {/* Word count feedback message */}
        <div className="text-xs text-ink-2 flex items-center justify-between">
          <span>
            {isWithinLimit && 'Świetnie! Długość tekstu mieści się w dopuszczalnym limicie CKE.'}
            {isUnderMin && `Brakuje jeszcze ${prompt.wordLimit.min - wordCount} słów do dolnego limitu.`}
            {isOverMax && `Przekroczono limit o ${wordCount - prompt.wordLimit.max} słów.`}
          </span>
          <button onClick={() => setEssayText('')} className="text-ink-3 hover:text-ink-2 underline">
            Wyczyść
          </button>
        </div>
      </div>

      {/* Useful Phrases & Plan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Phrases */}
        <div className="bg-primary-tint/60 rounded-2xl p-5 border border-primary-tint space-y-3">
          <span className="text-xs font-semibold text-primary-hover block">
            Przydatne spójniki i wyrażenia (Linking phrases):
          </span>
          <div className="space-y-1.5 text-xs text-primary-hover">
            {prompt.usefulPhrases.map((phrase, idx) => (
              <div key={idx} className="bg-surface p-2 rounded-lg border border-primary-tint">
                {phrase}
              </div>
            ))}
          </div>
        </div>

        {/* Plan */}
        <div className="bg-hero rounded-2xl p-5 border border-line space-y-3">
          <span className="text-xs font-semibold text-ink block">Zalecana kompozycja akapitów:</span>
          <div className="space-y-2 text-xs text-ink">
            {prompt.samplePlan.map((step, idx) => (
              <div key={idx} className="bg-surface p-2.5 rounded-lg border border-line">
                {step}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Model Answer Accordion */}
      <div className="bg-surface rounded-2xl border border-line p-6 space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowModel(!showModel)}
            className="flex items-center space-x-2 text-sm font-semibold text-primary hover:text-primary-hover transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>{showModel ? 'Ukryj wzorcową pracę CKE' : 'Pokaż wzorcową pracę CKE (Model Essay)'}</span>
            {showModel ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showModel && (
            <button
              onClick={handleCopyModel}
              className="flex items-center space-x-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-line-soft text-ink-2 hover:bg-line transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Skopiowano' : 'Kopiuj tekst'}</span>
            </button>
          )}
        </div>

        {showModel && (
          <div className="p-5 rounded-lg bg-hero border border-line text-xs sm:text-sm text-ink leading-relaxed font-normal whitespace-pre-line">
            {prompt.modelAnswer}
          </div>
        )}
      </div>
    </div>
  );
};
