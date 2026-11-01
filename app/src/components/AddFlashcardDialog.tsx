import React, { useId, useState } from 'react';
import { Volume2, X } from 'lucide-react';
import type { PartOfSpeech, TeacherFlashcard, UserFlashcard } from '../types';
import { allModules } from '../data/modulesData';
import { findInDeck, isTeacherCard } from '../decks';
import type { CardRequest } from '../flashcard-dialog-context';
import { speak } from '../speech';
import { CardsSignedOutError, DuplicateCardError, type CardDraft } from '../teacherCardsApi';
import { looksInflected } from '../text';
import { useTargetDeck } from '../useAddFlashcard';
import { useProgress } from '../useProgress';
import { useSettings } from '../useSettings';
import { useTeacherCards } from '../useTeacherCards';
import { useUser } from '../useUser';
import { StudentChoice } from './LessonBar';
import { Button, Chip, TextArea, TextField, fieldClass } from './ui';

const PARTS_OF_SPEECH: PartOfSpeech[] = ['noun', 'verb', 'adjective', 'adverb', 'idiom', 'phrasal_verb', 'phrase'];

interface AddFlashcardDialogProps {
  request: CardRequest;
  lessonStudent: string | undefined;
  onChooseStudent: (id: string | undefined) => void;
  teacherSignedIn: boolean | undefined;
  signIn: React.ReactNode;
  onSignedOut: () => void;
  onClose: () => void;
  onAdded: (moduleId: string, deckTitle: string, card: UserFlashcard) => void;
  onAddedForStudent: (card: TeacherFlashcard) => void;
  onRemoveOwn: (moduleId: string, card: UserFlashcard) => void;
  onRemoveForStudent: (card: TeacherFlashcard) => void;
}

const moduleOfOwn = (cards: Record<string, UserFlashcard[]> | undefined, id: string) => Object.entries(cards ?? {}).find(([, list]) => list.some((c) => c.id === id))?.[0];

export const AddFlashcardDialog: React.FC<AddFlashcardDialogProps> = ({ request, lessonStudent, onChooseStudent, teacherSignedIn, signIn, onSignedOut, onClose, onAdded, onAddedForStudent, onRemoveOwn, onRemoveForStudent }) => {
  const { t, translationLang } = useSettings();
  const { user, students } = useUser();
  const progress = useProgress();
  const teacherCards = useTeacherCards();
  const titleId = useId();

  const { editing, prefill } = request;
  const teacherCard = editing && isTeacherCard(editing) ? editing : undefined;
  const targetUserId = teacherCard?.studentId ?? (editing ? undefined : lessonStudent);
  const needsSignIn = !editing && user.role === 'teacher' && teacherSignedIn === false;
  const startModule = teacherCard?.moduleId ?? (editing && moduleOfOwn(progress.state.cards, editing.id)) ?? request.moduleId ?? progress.state.lastDeckId ?? allModules[0].id;
  const start = { ...prefill, ...editing };
  const rus = translationLang === 'ru';

  const [moduleId, setModuleId] = useState(startModule);
  const [front, setFront] = useState(start.front ?? '');
  const [pos, setPos] = useState<PartOfSpeech>(start.partOfSpeech ?? (start.front?.includes(' ') ? 'phrase' : 'noun'));
  const [meaningPl, setMeaningPl] = useState(start.backMeaningPl ?? '');
  const [meaningRu, setMeaningRu] = useState(start.backMeaningRu ?? '');
  const [meaningEn, setMeaningEn] = useState(start.backMeaningEn ?? '');
  const [example, setExample] = useState(start.exampleSentence ?? '');
  const [exampleTr, setExampleTr] = useState((rus ? start.exampleTranslationRu : start.exampleTranslation) ?? '');
  const [category, setCategory] = useState(start.category ?? t('add.categoryDefault'));
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState<'save' | 'session' | 'duplicate'>();

  const module = allModules.find((m) => m.id === moduleId) ?? allModules[0];
  const deck = useTargetDeck(moduleId, targetUserId);
  const duplicate = findInDeck(deck, front);
  const isDuplicate = (!!duplicate && duplicate.id !== editing?.id) || failure === 'duplicate';
  const hasMeaning = [meaningPl, meaningRu, meaningEn].some((m) => m.trim());
  const canSave = !!front.trim() && hasMeaning && !isDuplicate && !busy;
  // Moving a card with the learner's status is possible only for the card kept in this browser.
  const deckFixed = !!teacherCard || (!editing && !!request.moduleId);
  const showInflectionHint = !editing && prefill?.source === 'slownictwo-text' && looksInflected(front);

  const duplicateLink =
    duplicate &&
    (targetUserId && isTeacherCard(duplicate) ? `#dashboard/${targetUserId}/fiszki` : `#${moduleId}/fiszki/${duplicate.id}`);

  const submit = async () => {
    if (!canSave) return;
    const draft: CardDraft = {
      front: front.trim(),
      partOfSpeech: pos,
      backMeaningPl: meaningPl.trim(),
      backMeaningRu: meaningRu.trim() || undefined,
      backMeaningEn: meaningEn.trim() || undefined,
      exampleSentence: example.trim(),
      exampleTranslation: rus ? start.exampleTranslation : exampleTr.trim() || undefined,
      exampleTranslationRu: rus ? exampleTr.trim() || undefined : start.exampleTranslationRu,
      category: category.trim() || t('add.categoryDefault'),
      sourceRef: start.sourceRef,
    };

    if (!targetUserId) {
      if (!editing) onAdded(moduleId, module.titlePl, progress.addCard(moduleId, { ...draft, source: prefill?.source ?? 'manual' }));
      else if (moduleId === startModule) progress.updateCard(moduleId, editing.id, draft);
      else progress.moveCard(startModule, moduleId, editing.id, draft);
      onClose();
      return;
    }

    setBusy(true);
    setFailure(undefined);
    try {
      if (teacherCard) await teacherCards.updateCard(teacherCard, draft);
      else onAddedForStudent(await teacherCards.createCard(targetUserId, moduleId, draft));
      onClose();
    } catch (e) {
      setBusy(false);
      if (e instanceof CardsSignedOutError) {
        onSignedOut();
        setFailure('session');
      } else {
        setFailure(e instanceof DuplicateCardError ? 'duplicate' : 'save');
      }
    }
  };

  const remove = () => {
    if (teacherCard) onRemoveForStudent(teacherCard);
    else if (editing) onRemoveOwn(startModule, editing);
    onClose();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) void submit();
  };

  const meaningFields = [
    <TextField key="pl" label={t('add.meaningPl')} value={meaningPl} autoFocus={!!start.front && !rus} onChange={(e) => setMeaningPl(e.target.value)} />,
    <TextField key="ru" label={t('add.meaningRu')} value={meaningRu} autoFocus={!!start.front && rus} onChange={(e) => setMeaningRu(e.target.value)} />,
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-center bg-ink/50 sm:items-center sm:p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onKeyDown={onKeyDown}
        className="flex max-h-full w-full flex-col overflow-hidden bg-surface sm:max-w-[560px] sm:rounded-2xl sm:border sm:border-line"
      >
        <div className="flex items-center justify-between gap-3 border-b border-line-soft px-5 py-4">
          <h2 id={titleId} className="text-xl leading-7 font-semibold">
            {editing ? t('add.editTitle') : t('add.title')}
          </h2>
          <button type="button" onClick={onClose} aria-label={t('add.cancel')} className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg text-ink-2 hover:bg-hero">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-4 overflow-y-auto px-5 py-4">
          <div className="grid gap-1 text-sm leading-5 text-ink-2">
            {deckFixed ? (
              <p>
                {t('add.deck')}: <b className="font-semibold text-ink">{module.titlePl}</b>
              </p>
            ) : (
              <label className="grid gap-1.5 text-base font-semibold text-ink">
                {t('add.deck')}
                <select className={`${fieldClass} font-normal`} value={moduleId} onChange={(e) => setModuleId(e.target.value)}>
                  {allModules.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.number}. {m.titlePl}
                    </option>
                  ))}
                </select>
              </label>
            )}
            {teacherCard && <p>{t('lesson.forStudent', { name: students.find((s) => s.id === teacherCard.studentId)?.name ?? teacherCard.studentId })}</p>}
            {!editing && teacherSignedIn && (
              <div className="mt-2">
                <StudentChoice student={lessonStudent} onChoose={onChooseStudent} />
              </div>
            )}
            {targetUserId && <p className="mt-1">{t('lesson.visible')}</p>}
            {needsSignIn && (
              <div className="mt-2 grid justify-items-start gap-2">
                <p>{t('lesson.signInHint')}</p>
                {signIn}
              </div>
            )}
          </div>

          <div className="grid gap-1.5">
            <TextField
              label={t('add.front')}
              value={front}
              maxLength={100}
              autoFocus={!start.front}
              onChange={(e) => {
                setFront(e.target.value);
                if (failure === 'duplicate') setFailure(undefined);
              }}
              trailing={
                <button type="button" onClick={() => speak(front)} disabled={!front.trim()} aria-label={t('cards.listen')} title={t('cards.listen')} className="cursor-pointer text-primary disabled:cursor-default disabled:text-ink-3">
                  <Volume2 className="h-5 w-5" />
                </button>
              }
              hint={showInflectionHint && !isDuplicate ? t('add.baseFormHint') : undefined}
            />
            {isDuplicate && (
              <p className="text-sm leading-5 text-error">
                {t('add.duplicate', { w: front.trim(), deck: module.titlePl })}
                {duplicateLink && duplicate.id !== editing?.id && (
                  <>
                    {' '}
                    <a href={duplicateLink} onClick={onClose} className="font-semibold underline">
                      {t('add.open')}
                    </a>
                  </>
                )}
              </p>
            )}
          </div>

          <label className="grid gap-1.5 text-base font-semibold text-ink">
            {t('add.pos')}
            <select className={`${fieldClass} font-normal`} value={pos} onChange={(e) => setPos(e.target.value as PartOfSpeech)}>
              {PARTS_OF_SPEECH.map((p) => (
                <option key={p} value={p}>
                  {t(`add.pos.${p}`)}
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">{rus ? [...meaningFields].reverse() : meaningFields}</div>
          <TextField label={t('add.meaningEn')} value={meaningEn} onChange={(e) => setMeaningEn(e.target.value)} hint={hasMeaning ? undefined : t('add.needMeaning')} />
          <TextArea label={t('add.example')} value={example} onChange={(e) => setExample(e.target.value)} />
          <TextField label={t('add.exampleTranslation')} value={exampleTr} onChange={(e) => setExampleTr(e.target.value)} />

          <div className="grid gap-2">
            <TextField label={t('add.category')} value={category} onChange={(e) => setCategory(e.target.value)} />
            <div className="flex flex-wrap gap-1.5">
              {module.subtopics.map((s) => (
                <button key={s} type="button" onClick={() => setCategory(s)} className="cursor-pointer">
                  <Chip size="sm" tone={s === category ? 'primary' : 'neutral'}>
                    {s}
                  </Chip>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-2 border-t border-line-soft px-5 py-4">
          {failure === 'save' && <p className="text-sm leading-5 text-error">{t('lesson.saveFailed')}</p>}
          {failure === 'session' && !needsSignIn && !teacherSignedIn && (
            <div className="grid gap-2">
              <p className="text-sm leading-5 text-error">{t('lesson.signedOut')}</p>
              {signIn}
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <Button disabled={!canSave} onClick={() => void submit()}>
              {editing ? t('add.save') : t('add.submit')}
            </Button>
            <Button variant="secondary" onClick={onClose}>
              {t('add.cancel')}
            </Button>
            {editing && (
              <Button variant="ghost" onClick={remove} className="ml-auto">
                {t('add.remove')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
