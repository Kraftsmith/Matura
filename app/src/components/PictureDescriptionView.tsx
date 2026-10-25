import React, { useCallback, useState } from 'react';
import type { PictureDescriptionData } from '../types';
import { Volume2, ChevronDown, ChevronUp, Copy, Check, Clock, Lightbulb, Maximize2 } from 'lucide-react';
import { Button } from './ui';
import { ImageLightbox } from './ImageLightbox';
import { useSettings } from '../useSettings';

interface PictureDescriptionViewProps {
  data: PictureDescriptionData;
  moduleTitle: string;
}

export const PictureDescriptionView: React.FC<PictureDescriptionViewProps> = ({ data, moduleTitle }) => {
  const { tr } = useSettings();
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({});
  const [copiedPhrase, setCopiedPhrase] = useState<string | null>(null);
  const [userNotes, setUserNotes] = useState<Record<number, string>>({});
  const [timerSeconds, setTimerSeconds] = useState<number | null>(null);
  const [timerActive, setTimerActive] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  const toggleRevealAnswer = (qNum: number) => {
    setRevealedAnswers((prev) => ({ ...prev, [qNum]: !prev[qNum] }));
  };

  const handleCopyPhrase = (phrase: string) => {
    navigator.clipboard.writeText(phrase);
    setCopiedPhrase(phrase);
    setTimeout(() => setCopiedPhrase(null), 2000);
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-GB';
      utterance.rate = 0.92;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Exam timer simulation (60s response practice)
  const startTimer = (seconds: number) => {
    setTimerSeconds(seconds);
    setTimerActive(true);
  };

  React.useEffect(() => {
    if (!timerActive || timerSeconds === null || timerSeconds <= 0) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev !== null && prev > 1) return prev - 1;
        setTimerActive(false);
        return 0;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds]);

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-8">
      {/* Title & CKE Guidance Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <span className="text-xs font-semibold text-primary">Część Ustna • Zadanie 2 ({moduleTitle})</span>
          <h2 className="text-2xl font-semibold text-ink">Opis ilustracji i pytania: {data.title}</h2>
          <p className="text-sm text-ink-2 mt-1">{data.situation}</p>
        </div>

        {/* Practice Timer */}
        <div className="flex items-center space-x-2 bg-hero px-3.5 py-2 rounded-lg border border-line">
          <Clock className="w-4 h-4 text-ink-2" />
          {timerSeconds !== null ? (
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-semibold  ${timerSeconds <= 10 ? 'text-error ' : 'text-ink'}`}>
                {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
              </span>
              <button
                onClick={() => {
                  setTimerActive(false);
                  setTimerSeconds(null);
                }}
                className="text-xs text-ink-3 hover:text-ink-2 underline"
              >
                Reset
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-ink-2">
              <span>Stoper odpowiedzi:</span>
              <button
                onClick={() => startTimer(60)}
                className="px-2 py-0.5 rounded-md bg-surface border border-line hover:bg-line-soft transition"
              >
                1 min
              </button>
              <button
                onClick={() => startTimer(90)}
                className="px-2 py-0.5 rounded-md bg-surface border border-line hover:bg-line-soft transition"
              >
                1.5 min
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Photo on the left, 6-Step breakdown on the right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Photo Box */}
        <div className="lg:col-span-5 space-y-4">
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            title="Powiększ ilustrację"
            aria-label="Powiększ ilustrację"
            className="group relative block w-full cursor-zoom-in overflow-hidden rounded-2xl border border-line bg-ink text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <img
              src={data.imageSrc}
              alt={data.imageAlt}
              className="w-full h-auto max-h-[460px] object-cover transition duration-300 group-hover:scale-102"
            />
            <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-lg bg-ink/70 px-2.5 py-1.5 text-xs font-semibold text-white">
              <Maximize2 className="h-3.5 w-3.5" />
              Powiększ
            </span>
            <span className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink/70 via-transparent to-transparent p-4 text-xs text-white opacity-0 transition group-hover:opacity-100">
              <span className="font-semibold">{data.title}</span>
              <span className="text-line text-xs">{data.imageAlt}</span>
            </span>
          </button>

          <ImageLightbox
            isOpen={lightboxOpen}
            src={data.imageSrc}
            alt={data.imageAlt}
            caption={data.imageAlt}
            onClose={closeLightbox}
          />

          {/* Full Model Spoken Answer Drawer */}
          <div className="bg-surface rounded-2xl p-5 border border-line space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-base font-semibold text-ink">Wzorcowa wypowiedź ustna</h3>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => speakText(data.fullModelAnswer)}
                title="Posłuchaj wzorcowego monologu"
              >
                <Volume2 className="w-4 h-4" />
                Odsłuchaj
              </Button>
            </div>
            <p className="text-sm text-ink-2 italic leading-relaxed">"{data.fullModelAnswer}"</p>
          </div>
        </div>

        {/* 6-Step Interactive Guide */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ink">6 Kroków Konstrukcji Opisu (Formuła CKE)</h3>
            <span className="text-xs text-primary font-semibold">
              Krok {activeStepIndex + 1} z {data.steps.length}
            </span>
          </div>

          {/* Steps Horizontal Tabs */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 bg-line-soft p-1.5 rounded-2xl">
            {data.steps.map((step, idx) => (
              <button
                key={idx}
                onClick={() => setActiveStepIndex(idx)}
                className={`py-2 px-1 rounded-lg text-center text-xs font-semibold transition flex flex-col items-center justify-center ${
                  activeStepIndex === idx
                    ? 'bg-surface text-primary-hover border border-line'
                    : 'text-ink-2 hover:text-ink'
                }`}
              >
                <span className="text-xs opacity-70">0{idx + 1}</span>
                <span className="truncate w-full text-xs">{tr(step.stepNamePl, step.stepNameRu)}</span>
              </button>
            ))}
          </div>

          {/* Active Step Card */}
          {data.steps[activeStepIndex] && (
            <div className="bg-surface rounded-2xl border border-line p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-line-soft pb-3">
                <div>
                  <span className="text-xs font-semibold text-primary uppercase">
                    Krok {activeStepIndex + 1}: {data.steps[activeStepIndex].stepName}
                  </span>
                  <h4 className="text-base font-semibold text-ink">{tr(data.steps[activeStepIndex].stepNamePl, data.steps[activeStepIndex].stepNameRu)}</h4>
                </div>
                <button
                  onClick={() => speakText(data.steps[activeStepIndex].modelExample)}
                  className="p-2 rounded-lg text-primary hover:bg-primary-tint transition"
                  title="Posłuchaj wymowy zdania wzorcowego"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs sm:text-sm text-ink-2">{data.steps[activeStepIndex].description}</p>

              {/* Useful Phrases */}
              <div>
                <span className="text-xs font-semibold text-ink-3 block mb-2">
                  Przydatne banki zwrotów (kliknij, aby skopiować):
                </span>
                <div className="space-y-1.5">
                  {data.steps[activeStepIndex].recommendedPhrases.map((phrase, pIdx) => (
                    <button
                      key={pIdx}
                      onClick={() => handleCopyPhrase(phrase)}
                      className="w-full text-left flex items-center justify-between p-2.5 rounded-lg bg-hero border border-line-soft hover:bg-primary-tint/50 hover:border-line transition text-xs text-ink group"
                    >
                      <span>{phrase}</span>
                      <span className="text-ink-3 group-hover:text-primary transition shrink-0 ml-2">
                        {copiedPhrase === phrase ? (
                          <Check className="w-3.5 h-3.5 text-success" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Model phrase box */}
              <div className="bg-success-tint/70 border border-success-tint rounded-lg p-3.5 text-xs sm:text-sm text-success">
                <span className="font-semibold block text-success text-xs uppercase mb-1">
                  Przykład zdania w tym kroku:
                </span>
                "{data.steps[activeStepIndex].modelExample}"
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3 Examination Questions */}
      <div className="space-y-6 pt-4 border-t border-line">
        <div>
          <span className="text-xs font-semibold text-primary">Pytania Egzaminatora CKE</span>
          <h3 className="text-xl font-semibold text-ink">3 Pytania Rozszerzające z Wzorcowymi Odpowiedziami</h3>
          <p className="text-xs sm:text-sm text-ink-2">
            Na maturze ustnej egzaminator zada 3 powiązane pytania (interpretacja zdjęcia, doświadczenie z przeszłości,
            pytanie abstrakcyjne/opinia).
          </p>
        </div>

        <div className="space-y-4">
          {data.examQuestions.map((q) => {
            const isRevealed = !!revealedAnswers[q.questionNumber];
            return (
              <div key={q.questionNumber} className="bg-surface rounded-2xl border border-line p-6 space-y-4">
                {/* Question Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-primary-tint text-primary-hover border border-primary-tint">
                      Pytanie {q.questionNumber}
                    </span>
                    <h4 className="text-base sm:text-lg font-semibold text-ink">{q.questionText}</h4>
                  </div>

                  <button
                    onClick={() => speakText(q.questionText)}
                    className="p-2 rounded-lg text-ink-2 hover:text-primary hover:bg-primary-tint transition shrink-0"
                    title="Posłuchaj pytania"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Hints and Useful Phrases */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-hero p-3 rounded-lg border border-line-soft space-y-1.5">
                    <div className="flex items-center space-x-1.5 font-semibold text-ink">
                      <Lightbulb className="w-3.5 h-3.5 text-warning" />
                      <span>Kluczowe punkty do poruszenia:</span>
                    </div>
                    <ul className="list-disc list-inside text-ink-2 space-y-0.5">
                      {q.hints.map((hint, hIdx) => (
                        <li key={hIdx}>{hint}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-primary-tint/50 p-3 rounded-lg border border-primary-tint space-y-1.5">
                    <span className="font-semibold text-primary-hover block">Przydatne zwroty na poziomie B2/B2+:</span>
                    <ul className="text-primary-hover space-y-0.5">
                      {q.usefulPhrases.map((phrase, phIdx) => (
                        <li key={phIdx} className="text-xs">
                          • {phrase}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* User Response Notebook */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs text-ink-3">
                    <span>Twój szkic / notatki do odpowiedzi (opcjonalnie):</span>
                    <span>{userNotes[q.questionNumber]?.length || 0} znaków</span>
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Wpisz swoje kluczowe argumenty po angielsku przed odsłuchaniem wzorca..."
                    value={userNotes[q.questionNumber] || ''}
                    onChange={(e) => setUserNotes({ ...userNotes, [q.questionNumber]: e.target.value })}
                    className="w-full text-xs p-3 rounded-lg border border-line focus:border-primary focus:ring-1 focus:ring-primary outline-hidden transition resize-y"
                  />
                </div>

                {/* Model Answer Toggle */}
                <div className="pt-2 border-t border-line-soft">
                  <button
                    onClick={() => toggleRevealAnswer(q.questionNumber)}
                    className="flex items-center space-x-2 text-xs font-semibold text-primary hover:text-primary-hover transition"
                  >
                    {isRevealed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    <span>{isRevealed ? 'Ukryj wzorcową odpowiedź CKE' : 'Pokaż wzorcową odpowiedź egzaminatora'}</span>
                  </button>

                  {isRevealed && (
                    <div className="mt-3 p-4 rounded-lg bg-primary border border-success-tint text-xs sm:text-sm text-ink space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-success uppercase text-xs">
                          Model Answer (Band 100% CKE):
                        </span>
                        <button
                          onClick={() => speakText(q.modelAnswer)}
                          className="flex items-center space-x-1 text-xs text-success hover:text-success font-semibold"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Posłuchaj</span>
                        </button>
                      </div>
                      <p className="leading-relaxed italic">"{q.modelAnswer}"</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
