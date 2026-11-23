import React, { useState } from 'react';
import { ArrowRight, Search } from 'lucide-react';
import { Drawer, TextField } from './ui';
import { useSettings } from '../useSettings';
import { toHash } from '../routing';
import { taskAnchor } from '../grammarAnchors';
import { searchHandbook } from '../grammarHandbook';

interface GrammarHandbookProps {
  onClose: () => void;
}

/**
 * The grammar handbook: a menu of the grammar points of the course, each with its structure and a link
 * to every exercise that drills it. A drawer, so it opens over any page without leaving it.
 */
export const GrammarHandbook: React.FC<GrammarHandbookProps> = ({ onClose }) => {
  const { t } = useSettings();
  const [query, setQuery] = useState('');
  const found = searchHandbook(query);

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
        {found.map(({ module, rule, tasks }) => (
          <li key={`${module.id}/${rule.id}`} className="grid gap-3 py-5">
            <h3 className="text-base leading-6 font-semibold text-ink">{rule.title}</h3>

            {rule.formula && <p className="rounded-lg bg-primary-tint/60 px-3 py-2 text-sm leading-5 font-semibold text-primary-hover">{rule.formula}</p>}

            <ul className="grid gap-2">
              {tasks.map((task, i) => {
                const path = toHash({ moduleId: module.id, section: 'gramatyka', item: 'test', task: task.id });
                return (
                  <li key={task.id}>
                    <a
                      href={`#${path}`}
                      onClick={follow(path, taskAnchor(task.id))}
                      className="inline-flex items-center gap-1.5 rounded text-sm leading-5 font-semibold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      {t('hw.exerciseN', { n: i + 1 })}
                      <span className="font-normal text-ink-2">· {t(`type.${task.type}`)}</span>
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ul>
    </Drawer>
  );
};
