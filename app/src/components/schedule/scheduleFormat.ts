import { useCallback } from 'react';
import { describeTarget, parseTarget } from '../../courseTargets';
import { homeworkProgress, type ItemStatus } from '../../homework';
import { pluralForm, type I18nKey } from '../../i18n';
import type { HomeworkItem, Lesson, LessonStatus, Participant } from '../../schedule';
import { dayOf, formatDate } from '../../time';
import { useProgress } from '../../useProgress';
import { useSettings } from '../../useSettings';

export const useLocale = () => {
  const { uiLang } = useSettings();
  return uiLang === 'en' ? 'en-GB' : 'pl-PL';
};

/** "Człowiek · Słownictwo · A rollercoaster of emotions", or the item's own text. */
export const useItemLabel = () => {
  const { t } = useSettings();
  return useCallback(
    (item: Pick<HomeworkItem, 'kind' | 'target' | 'text'>): string => {
      if (item.kind === 'text' || !item.target) return item.text;
      const target = parseTarget(item.target);
      const label = target && describeTarget(target);
      if (!label) return t('hw.unknownPage');
      const parts = [label.topic, t(label.section)];
      if (label.item) parts.push(label.item.key ? `${t(label.item.key, { n: label.item.n ?? '' })}${label.item.text ? ` · ${label.item.text}` : ''}` : label.item.text);
      return parts.join(' · ');
    },
    [t],
  );
};

export const statusKey: Record<LessonStatus, I18nKey> = { planned: 'lesson.planned', held: 'lesson.held', cancelled: 'lesson.cancelled', moved: 'lesson.moved' };

/** "Maria", "Maria, Evgeny", "Maria, Evgeny +2". */
export const namesOf = (participants: Participant[], max = 2): string => {
  const names = participants.map((p) => p.name);
  return names.length <= max ? names.join(', ') : `${names.slice(0, max).join(', ')} +${names.length - max}`;
};

/** "Zajęcia grupowe · 3 osoby" for a learner, who does not see who else comes. */
export const useGroupLabel = () => {
  const { t } = useSettings();
  return useCallback((n: number) => t('lesson.group', { people: t(pluralForm(n) === 'Few' ? 'lesson.peopleFew' : 'lesson.peopleMany', { n }) }), [t]);
};

/** The score part of an item line: "8/10", "72%", "140 słów", "Opanowane: 12 / 40". */
export const useEvidenceText = () => {
  const { t } = useSettings();
  const locale = useLocale();
  return useCallback(
    (s: ItemStatus): string[] => {
      const bits: string[] = [];
      const { evidence } = s;
      if (evidence.score) {
        if (evidence.kind === 'deck') bits.push(t('hw.mastered', { k: evidence.score.value, n: evidence.score.of ?? 0 }));
        else if (evidence.score.unit === 'percent') bits.push(`${evidence.score.value}%`);
        else if (evidence.score.unit === 'words') bits.push(t('work.words', { n: evidence.score.value }));
        else bits.push(`${evidence.score.value}/${evidence.score.of ?? 0}`);
      }
      if (evidence.revealed) bits.push(t('hw.withHint'));
      if (s.state === 'earlier' && evidence.at) bits.push(t('hw.earlier', { date: formatDate(dayOf(evidence.at), locale) }));
      if (s.tick) bits.push(t(s.tick.by === 'teacher' ? 'hw.byTeacher' : 'hw.byStudent'));
      return bits;
    },
    [t, locale],
  );
};

/** The homework line of a lesson card: learners done of all for a group, items done of all for one learner. */
export const useHomeworkLine = () => {
  const { t } = useSettings();
  const locale = useLocale();
  const { allStates } = useProgress();
  return useCallback(
    (lesson: Lesson): string | undefined => {
      const hw = lesson.homework[0];
      if (!hw) return undefined;
      const date = formatDate(dayOf(hw.dueAt), locale);
      if (hw.students.length === 1) {
        const p = homeworkProgress(hw, hw.students[0].id, allStates[hw.students[0].id]);
        return t('cal.hwLine', { done: p.done, total: p.total, date });
      }
      const done = hw.students.filter((s) => homeworkProgress(hw, s.id, allStates[s.id]).complete).length;
      return t('cal.hwLine', { done, total: hw.students.length, date });
    },
    [t, locale, allStates],
  );
};
