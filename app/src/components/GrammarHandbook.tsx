import React, { useState } from 'react';
import { ArrowRight, Search } from 'lucide-react';
import type { GrammarRule } from '../types';
import { Drawer, TextField, buttonClass } from './ui';
import { useSettings } from '../useSettings';
import { pluralForm } from '../i18n';
import { toHash } from '../routing';
import { ruleAnchor, tasksAnchor } from '../grammarAnchors';
import { searchHandbook } from '../grammarHandbook';

interface GrammarHandbookProps {
  onClose: () => void;
}

/**
 * The grammar handbook: every rule of the course in brief, each with a link to the tasks that drill it
 * and to the full rule in its topic. A drawer, so it opens over any page without leaving it.
 */
export const GrammarHandbook: React.FC<GrammarHandbookProps> = ({ onClose }) => {
  const { t, tr } = useSettings();
  const [query, setQuery] = useState('');
  const found = searchHandbook(query);

  const levelLabel = (level: GrammarRule['level']) => (level === 'R' ? t('gram.levelR') : level === 'P' ? t('gram.levelP') : t('gram.levelPR'));

  /** The drawer closes and the address does the rest. The same address again fires no hashchange, so the page is scrolled here. */
  const follow = (path: string, anchor: string) => () => {
    onClose();
    if (window.location.hash === `#${path}`) document.getElementById(anchor)?.scrollIntoView({ block: 'start' });
  };

  return (
    <Drawer
      title={t('nav.handbook')}
      description={t('hb.desc')}
      onClose={onClose}
      toolbar={
        <TextField
          type="search"
          aria-label={t('hb.search')}
          placeholder={t('hb.searchPlaceholder')}
          leadingIcon={<Search />}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      }
    >
      {found.length === 0 && <p className="py-6 text-sm leading-5 text-ink-2">{t('hb.empty')}</p>}

      <ul className="divide-y divide-line-soft">
        {found.map(({ module, rule, tasks }) => {
          const rulePath = toHash({ moduleId: module.id, section: 'gramatyka', item: rule.id });
          const tasksPath = toHash({ moduleId: module.id, section: 'gramatyka', item: rule.id, tasks: true });
          const example = rule.examples[0];
          return (
            <li key={`${module.id}/${rule.id}`} className="grid gap-3 py-5">
              <div className="grid gap-1">
                <p className="text-sm leading-5 text-ink-2">
                  {module.number}. {module.titlePl} · {levelLabel(rule.level)}
                </p>
                <h3 className="text-base leading-6 font-semibold text-ink">{rule.title}</h3>
              </div>

              {rule.formula && <p className="rounded-lg bg-primary-tint/60 px-3 py-2 text-sm leading-5 font-semibold text-primary-hover">{rule.formula}</p>}

              <p className="text-sm leading-5 text-ink">{rule.ruleSummary}</p>

              {example && (
                <p className="rounded-lg bg-hero px-3 py-2 text-sm leading-5">
                  <span className="font-semibold text-ink">{example.english}</span>
                  <span className="block text-ink-2">{tr(example.polish, example.russian)}</span>
                </p>
              )}

              <div className="flex flex-wrap gap-2">
                {tasks > 0 && (
                  <a href={`#${tasksPath}`} onClick={follow(tasksPath, tasksAnchor(rule.id))} className={buttonClass('secondary', 'sm')}>
                    {t('hb.practice')}: {tasks} {t(`plural.task${pluralForm(tasks)}`)}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                )}
                <a href={`#${rulePath}`} onClick={follow(rulePath, ruleAnchor(rule.id))} className={buttonClass('ghost', 'sm')}>
                  {t('hb.fullRule')}
                </a>
              </div>
            </li>
          );
        })}
      </ul>
    </Drawer>
  );
};
