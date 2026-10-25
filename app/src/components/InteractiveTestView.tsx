import React, { useState } from 'react';
import type { GrammarRule, TestQuestion } from '../types';
import { CheckCircle2, XCircle, RotateCcw, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button, Chip, KeyTag, OptionCard, InlineInput } from './ui';
import { useSettings } from '../useSettings';
import { pluralForm } from '../i18n';

interface InteractiveTestViewProps {
  questions: TestQuestion[];
  /** When given, tasks are grouped under the rule they check (grammarRef.ruleId). */
  rules?: GrammarRule[];
  moduleTitle: string;
  onScoreSave?: (score: number) => void;
  /** Inside the grammar section: no own page header. */
  embedded?: boolean;
}

interface TaskGroup {
  id: string;
  title: string;
  ruleId?: string;
  questions: TestQuestion[];
}

export const InteractiveTestView: React.FC<InteractiveTestViewProps> = ({ questions, rules = [], moduleTitle, onScoreSave, embedded = false }) => {
  const { t } = useSettings();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checkedIds, setCheckedIds] = useState<Record<string, boolean>>({});
  const [onlyIncorrectFilter, setOnlyIncorrectFilter] = useState(false);

  const handleInputChange = (id: string, value: string) => setAnswers((prev) => ({ ...prev, [id]: value }));
  const handleOptionSelect = (id: string, option: string) => setAnswers((prev) => ({ ...prev, [id]: option }));

  const isQuestionCorrect = (q: TestQuestion): boolean => {
    const rawAnswer = answers[q.id]?.trim().toLowerCase() || '';
    if (!rawAnswer) return false;
    return q.correctAnswers.some((ans) => ans.trim().toLowerCase() === rawAnswer);
  };

  /** Called once every question has been checked, whether in one go or one by one: the attempt is complete. */
  const finishAttempt = () => {
    const correctCount = questions.filter((q) => isQuestionCorrect(q)).length;
    const scorePercent = Math.round((correctCount / questions.length) * 100);
    onScoreSave?.(scorePercent);
    return scorePercent;
  };

  const checkSingleQuestion = (id: string) => {
    const next = { ...checkedIds, [id]: true };
    setCheckedIds(next);
    if (questions.every((q) => next[q.id])) finishAttempt();
  };

  const checkAllQuestions = () => {
    const allChecked: Record<string, boolean> = {};
    questions.forEach((q) => {
      allChecked[q.id] = true;
    });
    setCheckedIds(allChecked);
    const scorePercent = finishAttempt();
    if (scorePercent >= 80) confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
  };

  const resetTest = () => {
    setAnswers({});
    setCheckedIds({});
    setOnlyIncorrectFilter(false);
  };

  const checkedCount = Object.keys(checkedIds).length;
  const correctCount = questions.filter((q) => checkedIds[q.id] && isQuestionCorrect(q)).length;
  const scorePercent = checkedCount > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
  const wrongCount = questions.filter((q) => checkedIds[q.id] && !isQuestionCorrect(q)).length;

  // Tasks grouped by the rule they check, in the order of the rules; the rest go into one trailing group.
  const groups: TaskGroup[] = [];
  if (rules.length > 0) {
    for (const r of rules) {
      const qs = questions.filter((q) => q.grammarRef?.ruleId === r.id);
      if (qs.length) groups.push({ id: r.id, title: r.title, ruleId: r.id, questions: qs });
    }
    const rest = questions.filter((q) => !rules.some((r) => r.id === q.grammarRef?.ruleId));
    if (rest.length) groups.push({ id: 'other', title: t('gram.otherGroup'), questions: rest });
  } else {
    groups.push({ id: 'all', title: '', questions });
  }

  // Global task numbers follow the grouped order.
  const numberOf = new Map<string, number>();
  groups.flatMap((g) => g.questions).forEach((q, i) => numberOf.set(q.id, i + 1));

  const ruleTitle = (q: TestQuestion) => rules.find((r) => r.id === q.grammarRef?.ruleId)?.title ?? q.grammarRef?.topic;

  const visible = (q: TestQuestion) => !onlyIncorrectFilter || (checkedIds[q.id] && !isQuestionCorrect(q));

  return (
    <div className={embedded ? 'grid gap-6' : 'mx-auto grid max-w-4xl gap-8 px-4 py-6'}>
      <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-line bg-surface p-6 sm:p-8 md:flex-row md:items-center">
        <div>
          {!embedded && (
            <>
              <span className="text-sm text-ink-2">{t('gram.testKicker')}</span>
              <h2 className="mt-1 text-2xl font-semibold text-ink">
                {t('test.header')}: {moduleTitle}
              </h2>
            </>
          )}
          <p className={`text-sm text-ink-2 ${embedded ? '' : 'mt-1'}`}>{t('test.count', { n: questions.length })}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="mr-2">
            <div className="text-sm text-ink-2">{t('test.score')}</div>
            <div className="text-2xl leading-8 font-semibold tabular-nums text-ink">
              {correctCount} / {questions.length}
              <span className={`ml-2 text-base font-normal ${checkedCount > 0 && scorePercent >= 80 ? 'text-success' : 'text-ink-2'}`}>{scorePercent}%</span>
            </div>
          </div>
          <Button onClick={checkAllQuestions}>{t('test.checkAll')}</Button>
          <Button variant="secondary" size="icon" onClick={resetTest} title={t('test.restart')} aria-label={t('test.restart')}>
            <RotateCcw className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {checkedCount > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Button size="sm" variant={!onlyIncorrectFilter ? 'primary' : 'secondary'} onClick={() => setOnlyIncorrectFilter(false)}>
              {t('test.all')} ({questions.length})
            </Button>
            <Button size="sm" variant={onlyIncorrectFilter ? 'primary' : 'secondary'} onClick={() => setOnlyIncorrectFilter(true)}>
              {t('test.onlyWrong')} ({wrongCount})
            </Button>
          </div>
          <span className="text-ink-2">
            {t('test.checked')}: {checkedCount} / {questions.length}
          </span>
        </div>
      )}

      {groups.map((g) => {
        const shown = g.questions.filter(visible);
        if (shown.length === 0) return null;
        return (
          <section key={g.id} id={g.ruleId ? `task-group-${g.ruleId}` : undefined} className="grid gap-4 scroll-mt-24">
            {g.title && (
              <div className="flex flex-wrap items-center gap-3 border-b border-line pb-2">
                <h3 className="text-lg leading-7 font-semibold text-ink">{g.title}</h3>
                <span className="text-sm text-ink-2">
                  {g.questions.length} {t(`plural.task${pluralForm(g.questions.length)}`)}
                </span>
                {g.ruleId && (
                  <a href={`#rule-${g.ruleId}`} onClick={(e) => { e.preventDefault(); document.getElementById(`rule-${g.ruleId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }} className="ml-auto inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                    <BookOpen className="h-4 w-4" />
                    {t('test.seeRule')}
                  </a>
                )}
              </div>
            )}

            <div className="grid gap-6">
              {shown.map((q) => {
                const isChecked = !!checkedIds[q.id];
                const isCorrect = isChecked && isQuestionCorrect(q);
                const currentAnswer = answers[q.id] || '';
                const levelKey = q.level === 'Rozszerzony' ? 'level.Rozszerzony' : 'level.Podstawowy';

                return (
                  <div key={q.id} className={`rounded-2xl border bg-surface p-6 ${isChecked ? (isCorrect ? 'border-success' : 'border-error') : 'border-line'}`}>
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2 text-sm text-ink-2">
                          <span className="font-semibold text-ink">
                            {t('test.task')} {numberOf.get(q.id)}
                          </span>
                          <Chip size="sm">{t(`type.${q.type}` as const)}</Chip>
                          <span>
                            {t('test.level')} {t(levelKey)}
                          </span>
                        </div>
                        <h4 className="pt-1 text-base font-semibold text-ink">{q.prompt}</h4>
                      </div>
                      {isChecked && (
                        <div>
                          {isCorrect ? (
                            <Chip tone="success">
                              <CheckCircle2 className="h-4 w-4" /> {t('test.correct')}
                            </Chip>
                          ) : (
                            <Chip tone="error">
                              <XCircle className="h-4 w-4" /> {t('test.wrong')}
                            </Chip>
                          )}
                        </div>
                      )}
                    </div>

                    {q.targetWord && (
                      <div className="mb-3 flex items-center gap-2 text-sm text-ink-2">
                        <span>{q.type === 'key-word-transformation' ? t('test.keyWord') : t('test.baseWord')}</span>
                        <KeyTag>{q.targetWord}</KeyTag>
                      </div>
                    )}

                    <div className="mb-4 text-base leading-relaxed text-ink">
                      {q.type === 'multiple-choice' || q.type === 'mini-dialogue' ? (
                        <div>
                          <div className="mb-4 whitespace-pre-line">
                            {q.sentencePrefix}
                            <span className="mx-1 font-semibold text-primary underline underline-offset-4">{currentAnswer || '______'}</span>
                            {q.sentenceSuffix}
                          </div>
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2" role="radiogroup">
                            {q.options?.map((option, optIdx) => {
                              const isSelected = currentAnswer === option;
                              const isRight = q.correctAnswers.some((a) => a.trim().toLowerCase() === option.trim().toLowerCase());
                              const state = !isChecked ? (isSelected ? 'selected' : 'idle') : isRight ? 'correct' : isSelected ? 'wrong' : 'idle';
                              return (
                                <OptionCard
                                  key={optIdx}
                                  letter={String.fromCharCode(65 + optIdx)}
                                  state={state}
                                  disabled={isChecked}
                                  onSelect={() => handleOptionSelect(q.id, option)}
                                >
                                  {option}
                                </OptionCard>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div className="whitespace-pre-line">
                          <span>{q.sentencePrefix}</span>
                          <InlineInput
                            type="text"
                            value={currentAnswer}
                            onChange={(e) => handleInputChange(q.id, e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') checkSingleQuestion(q.id);
                            }}
                            disabled={isChecked}
                            placeholder={t('test.placeholder')}
                            aria-label={t('test.answer')}
                            state={isChecked ? (isCorrect ? 'correct' : 'wrong') : 'idle'}
                            className="mx-1.5"
                          />
                          <span>{q.sentenceSuffix}</span>
                        </div>
                      )}
                    </div>

                    {!isChecked && (
                      <div className="flex justify-end">
                        <Button size="sm" variant="secondary" onClick={() => checkSingleQuestion(q.id)} disabled={!currentAnswer.trim()}>
                          {t('test.check')}
                        </Button>
                      </div>
                    )}

                    {isChecked && (
                      <div className="mt-4 grid gap-2 border-t border-line-soft pt-4 text-sm leading-5">
                        <p>
                          <span className="text-ink-2">{t('test.correctAnswer')}: </span>
                          <span className="font-semibold text-success">{q.correctAnswers.join(' / ')}</span>
                        </p>
                        <p className="text-ink-2">
                          <span className="font-semibold text-ink">{t('test.explanation')}: </span>
                          {q.explanation}
                        </p>
                        {q.grammarRef && (
                          <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            <span className="inline-flex items-center gap-1.5 text-ink-2">
                              <BookOpen className="h-4 w-4" />
                              {t('test.rule')}: {ruleTitle(q)}
                            </span>
                            {q.grammarRef.ruleId && (
                              <button
                                type="button"
                                onClick={() => document.getElementById(`rule-${q.grammarRef!.ruleId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                                className="cursor-pointer font-semibold text-primary hover:underline"
                              >
                                {t('test.seeRule')}
                              </button>
                            )}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
};
