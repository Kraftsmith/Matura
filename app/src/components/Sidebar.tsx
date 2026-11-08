import React from 'react';
import type { MaturaModule } from '../types';
import { Layers, LayoutDashboard, X } from 'lucide-react';
import { useSettings } from '../useSettings';

interface SidebarProps {
  modules: MaturaModule[];
  /** null while the dashboard is open: no module row is highlighted. */
  currentModuleId: string | null;
  masteredCardsMap: Record<string, number>;
  /** Cards in each module's deck for this user. */
  deckSizeMap: Record<string, number>;
  /** Cards marked "Do powtórki" across all decks. */
  reviewCount: number;
  fiszkiActive: boolean;
  testScoresMap: Record<string, number>;
  /** False for the teacher: module rows show deck size instead of personal progress. */
  showProgress?: boolean;
  dashboardLabel?: string;
  /** False for the teacher: their panel opens from the user menu instead. */
  showDashboard?: boolean;
  onSelectModule: (moduleId: string) => void;
  onSelectDashboard: () => void;
  onSelectFiszki: () => void;
  isOpen: boolean;
  onClose: () => void;
}

/** Row of the dark sidebar: light text, a teal marker and a darker background for the active one. */
const SideRow: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }> = ({ active, className = '', children, ...rest }) => (
  <button
    type="button"
    className={`flex w-full items-center justify-between gap-3 border-b border-side-line border-l-4 px-4 py-3.5 text-left text-base leading-6 transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white ${
      active ? 'border-l-primary bg-side-2 font-semibold text-white' : 'cursor-pointer border-l-transparent text-side-text hover:bg-side-2'
    } ${className}`}
    {...rest}
  >
    {children}
  </button>
);

export const Sidebar: React.FC<SidebarProps> = ({
  modules,
  currentModuleId,
  masteredCardsMap,
  deckSizeMap,
  reviewCount,
  fiszkiActive,
  testScoresMap,
  showProgress = true,
  dashboardLabel,
  showDashboard = true,
  onSelectModule,
  onSelectDashboard,
  onSelectFiszki,
  isOpen,
  onClose,
}) => {
  const { t } = useSettings();
  const dashboardActive = currentModuleId === null && !fiszkiActive;
  return (
    <>
      {isOpen && <div className="fixed inset-0 z-40 bg-ink/40 lg:hidden" onClick={onClose} aria-hidden />}

      <aside
        className={`fixed top-0 z-50 h-screen w-80 shrink-0 overflow-y-auto bg-side text-side-text transition-transform duration-300 ease-in-out lg:sticky lg:top-16 lg:z-10 lg:h-[calc(100vh-4rem)] lg:w-72 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        aria-label={t('side.modules')}
      >
        <div className="flex items-center justify-between gap-3 px-4 pt-5 pb-3">
          <div>
            <h2 className="text-xl leading-7 font-semibold text-white">{t('side.modules')}</h2>
            <p className="text-sm text-side-muted">
              {modules.length} {t('side.topics')}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg text-side-muted hover:bg-side-2 hover:text-white lg:hidden"
            aria-label={t('side.close')}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="border-t border-side-line">
{showDashboard && (
          <SideRow
            active={dashboardActive}
            aria-current={dashboardActive ? 'page' : undefined}
            onClick={() => {
              onSelectDashboard();
              onClose();
            }}
          >
            <span className="flex min-w-0 items-center gap-2">
              <LayoutDashboard className="h-5 w-5 shrink-0 text-side-muted" />
              <span className="block truncate">{dashboardLabel ?? t('side.myProgress')}</span>
            </span>
          </SideRow>
          )}

          <SideRow
            active={fiszkiActive}
            aria-current={fiszkiActive ? 'page' : undefined}
            onClick={() => {
              onSelectFiszki();
              onClose();
            }}
          >
            <span className="flex min-w-0 items-center gap-2">
              <Layers className="h-5 w-5 shrink-0 text-side-muted" />
              <span className="min-w-0">
                <span className="block truncate">{t('side.flashcards')}</span>
                {showProgress && reviewCount > 0 && <span className="block truncate text-sm font-normal text-side-muted">{t('side.toReview', { n: reviewCount })}</span>}
              </span>
            </span>
          </SideRow>

          {modules.map((mod) => {
            const active = mod.id === currentModuleId;
            const mastered = masteredCardsMap[mod.id] ?? 0;
            const score = testScoresMap[mod.id];
            // Only real progress earns a second line; deck sizes alone are noise here.
            const parts: string[] = [];
            if (showProgress && mastered > 0) parts.push(`${mastered}/${deckSizeMap[mod.id] ?? mod.flashcards.length} ${t('side.words')}`);
            if (showProgress && score !== undefined) parts.push(`${t('side.test')} ${score}%`);
            return (
              <SideRow
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
                  {parts.length > 0 && (
                    <span className="block truncate text-sm font-normal text-side-muted">{parts.join(' · ')}</span>
                  )}
                </span>
                <span className="shrink-0 text-sm font-normal text-side-muted">{mod.badge}</span>
              </SideRow>
            );
          })}
        </nav>
      </aside>
    </>
  );
};
