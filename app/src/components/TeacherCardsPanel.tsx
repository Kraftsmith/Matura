import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import type { MaturaModule } from '../types';
import type { UserProfile } from '../users';
import { Card, SectionTitle } from './ui';
import { useFlashcardDialog } from '../useAddFlashcard';
import { useSettings } from '../useSettings';
import { useTeacherCards } from '../useTeacherCards';

/** The cards the teacher added for one learner, by topic, newest first. */
export const TeacherCardsPanel: React.FC<{ student: UserProfile; modules: MaturaModule[] }> = ({ student, modules }) => {
  const { t, tr } = useSettings();
  const { cardsOf } = useTeacherCards();
  const { open, removeForStudent } = useFlashcardDialog();
  const cards = cardsOf(student.id);
  const topics = modules.filter((m) => cards[m.id]?.length);

  if (topics.length === 0) return <p className="card p-8 text-center text-base leading-6 text-ink-2">{t('lesson.tabEmpty')}</p>;

  return (
    <section className="grid gap-4">
      <SectionTitle title={`${t('lesson.tab')}: ${student.name}`} description={t('lesson.tabDesc')} />
      {topics.map((m) => (
        <Card key={m.id} as="section" padding="none">
          <h3 className="border-b border-line-soft px-5 py-3 text-base leading-6 font-semibold">
            {m.number}. {m.titlePl}
          </h3>
          <ul>
            {[...cards[m.id]].reverse().map((card) => (
              <li key={card.id} className="flex items-start justify-between gap-3 border-b border-line-soft px-5 py-3 last:border-b-0">
                <div className="min-w-0">
                  <p className="text-base leading-6 font-semibold text-ink">{card.front}</p>
                  <p className="text-sm leading-5 text-ink-2">{tr(card.backMeaningPl, card.backMeaningRu) || card.backMeaningRu || card.backMeaningEn}</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button type="button" onClick={() => open({ editing: card })} aria-label={`${t('cards.edit')}: ${card.front}`} title={t('cards.edit')} className="grid h-8 w-8 cursor-pointer place-items-center rounded text-ink-3 hover:bg-primary-tint hover:text-primary">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => removeForStudent(card)} aria-label={`${t('cards.delete')}: ${card.front}`} title={t('cards.delete')} className="grid h-8 w-8 cursor-pointer place-items-center rounded text-ink-3 hover:bg-primary-tint hover:text-primary">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      ))}
    </section>
  );
};
