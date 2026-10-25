import React from 'react';
import type { MaturaModule } from '../types';
import { LayoutDashboard, X } from 'lucide-react';
import { ListRow } from './ui';
import { useSettings } from '../useSettings';

interface SidebarProps {
  modules: MaturaModule[];
  /** null while the dashboard is open: no module row is highlighted. */
  currentModuleId: string | null;
  masteredCardsMap: Record<string, number>;
  testScoresMap: Record<string, number>;
  /** False for the teacher: module rows show deck size instead of personal progress. */
  showProgress?: boolean;
  dashboardLabel?: string;
  onSelectModule: (moduleId: string) => void;
  onSelectDashboard: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  modules,
  currentModuleId,
  masteredCardsMap,
  testScoresMap,
  showProgress = true,
  dashboardLabel,
  onSelectModule,
  onSelectDashboard,
  isOpen,
  onClose,
}) => {
  const { t } = useSettings();
  const dashboardActive = currentModuleId === null;
  return (
    <>
      {isOpen && <div className="fixed inset-0 z-40 bg-ink/40 lg:hidden" onClick={onClose} aria-hidden />}

      <aside
        className={`fixed top-0 z-50 h-screen w-80 shrink-0 overflow-y-auto border-r border-line bg-surface transition-transform duration-300 ease-in-out lg:sticky lg:top-16 lg:z-10 lg:h-[calc(100vh-4rem)] lg:w-72 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        aria-label={t('side.modules')}
      >
        <div className="flex items-center justify-between gap-3 px-4 pt-5 pb-3">
          <div>
            <h2 className="text-xl leading-7 font-semibold">{t('side.modules')}</h2>
            <p className="text-sm text-ink-2">
              {modules.length} {t('side.topics')}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg text-ink-2 hover:bg-hero lg:hidden"
            aria-label={t('side.close')}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="border-t border-line-soft">
          <ListRow
            active={dashboardActive}
            aria-current={dashboardActive ? 'page' : undefined}
            onClick={() => {
              onSelectDashboard();
              onClose();
            }}
          >
            <span className="flex min-w-0 items-center gap-2">
              <LayoutDashboard className="h-5 w-5 shrink-0 text-ink-2" />
              <span className="block truncate">{dashboardLabel ?? t('side.myProgress')}</span>
            </span>
          </ListRow>

          {modules.map((mod) => {
            const active = mod.id === currentModuleId;
            const mastered = masteredCardsMap[mod.id] ?? 0;
            const score = testScoresMap[mod.id];
            const parts = showProgress
              ? [`${mastered}/${mod.flashcards.length} ${t('side.words')}`]
              : [`${mod.flashcards.length} ${t('side.cards')}`];
            if (showProgress && score !== undefined) parts.push(`${t('side.test')} ${score}%`);
            return (
              <ListRow
                key={mod.id}
                active={active}
                aria-current={active ? 'page' : undefined}
                onClick={() => {
                  onSelectModule(mod.id);
                  onClose();
                }}
              >
                <span className="min-w-0">
                  <span className="block truncate">
                    {mod.number}. {mod.titlePl}
                  </span>
                  <span className="block truncate text-sm font-normal text-ink-2">{parts.join(' · ')}</span>
                </span>
                <span className="shrink-0 text-sm font-normal text-ink-2">{mod.badge}</span>
              </ListRow>
            );
          })}
        </nav>
      </aside>
    </>
  );
};
