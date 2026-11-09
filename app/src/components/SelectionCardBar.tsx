import React, { useEffect, useRef, useState } from 'react';
import { Plus, Volume2 } from 'lucide-react';
import type { VocabularyText } from '../types';
import { Button } from './ui';
import { speak } from '../speech';
import { cleanSelection, fitsOnCard, lowerSentenceStart, sentenceWith } from '../text';
import { useAddFlashcard } from '../useAddFlashcard';
import { useSettings } from '../useSettings';

const SCROLL_LIMIT = 40;

interface Picked {
  phrase: string;
  paragraph: string;
  textId: string;
  top: number;
  left: number;
  scrollY: number;
}

interface SelectionCardBarProps {
  moduleId: string;
  texts: VocabularyText[];
  /** The learner the teacher is adding cards for. */
  targetUserId?: string;
}

const paragraphOf = (node: Node | null) => (node instanceof Element ? node : node?.parentElement)?.closest<HTMLElement>('[data-card-text]');

/** The selected phrase, if it can become a card: inside one paragraph of a text, and short enough. */
const readSelection = (): Picked | undefined => {
  const selection = window.getSelection();
  if (!selection || selection.isCollapsed || selection.rangeCount === 0) return undefined;
  const paragraph = paragraphOf(selection.anchorNode);
  if (!paragraph || paragraph !== paragraphOf(selection.focusNode)) return undefined;
  const phrase = cleanSelection(selection.toString());
  if (!fitsOnCard(phrase)) return undefined;
  const box = selection.getRangeAt(0).getBoundingClientRect();
  return { phrase, paragraph: paragraph.textContent ?? '', textId: paragraph.dataset.cardText ?? '', top: box.top, left: box.left + box.width / 2, scrollY: window.scrollY };
};

/** "Add to flashcards" next to a selected word: a floating panel with a mouse, a bar at the bottom on a touch screen. */
export const SelectionCardBar: React.FC<SelectionCardBarProps> = ({ moduleId, texts, targetUserId }) => {
  const { t } = useSettings();
  const add = useAddFlashcard(moduleId, targetUserId);
  const [picked, setPicked] = useState<Picked>();
  const panel = useRef<HTMLDivElement>(null);
  // Known only in a browser; the component is also rendered to HTML at build time for the public site.
  const [touch, setTouch] = useState(false);
  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect
    setTouch(window.matchMedia('(pointer: coarse)').matches);
  }, []);

  useEffect(() => {
    let dragging = false;
    const onChange = () => {
      if (!dragging) setPicked(readSelection());
    };
    const onDown = (e: MouseEvent) => {
      if (!panel.current?.contains(e.target as Node)) dragging = true;
    };
    const onUp = () => {
      dragging = false;
      setPicked(readSelection());
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPicked(undefined);
    };
    const onScroll = () => {
      setPicked((p) => (p && !touch && Math.abs(window.scrollY - p.scrollY) > SCROLL_LIMIT ? undefined : p));
    };
    document.addEventListener('selectionchange', onChange);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('keydown', onKey);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      document.removeEventListener('selectionchange', onChange);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onScroll);
    };
  }, [touch]);

  if (!picked) return null;

  const addPicked = () => {
    const sentence = sentenceWith(picked.paragraph, picked.phrase);
    const text = texts.find((x) => x.id === picked.textId);
    add.open({ front: lowerSentenceStart(picked.phrase, sentence), exampleSentence: sentence, category: text?.subtopic, source: 'slownictwo-text', sourceRef: picked.textId });
    setPicked(undefined);
  };

  // Keeps the selection alive while the button is pressed.
  const keepSelection = (e: React.MouseEvent) => e.preventDefault();

  if (touch) {
    return (
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface p-3">
        <Button full onClick={addPicked}>
          <Plus className="h-4 w-4 shrink-0" />
          <span className="truncate">{t('add.selectionBar', { w: picked.phrase })}</span>
        </Button>
      </div>
    );
  }

  return (
    <div
      ref={panel}
      onMouseDown={keepSelection}
      style={{ top: Math.max(picked.top - 52, 72), left: picked.left }}
      className="fixed z-40 flex -translate-x-1/2 items-center gap-1 rounded-lg border border-line bg-surface p-1 shadow-lg"
    >
      <Button size="sm" variant="ghost" onClick={addPicked}>
        <Plus className="h-4 w-4" />
        {t('add.toCards')}
      </Button>
      <Button size="icon" variant="ghost" onClick={() => speak(picked.phrase)} aria-label={t('cards.listen')} title={t('cards.listen')}>
        <Volume2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
