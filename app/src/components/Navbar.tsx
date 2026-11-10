import React, { useEffect, useRef, useState } from 'react';
import { BookOpen, CalendarDays, Menu, Palette, LayoutDashboard, ChevronDown, LogOut, Settings, UserPlus, UserRound } from 'lucide-react';
import { INVITE_SCROLL_KEY } from './ClassInvite';
import type { SectionType } from '../types';
import { Button } from './ui';
import { useSettings } from '../useSettings';
import { useProgress } from '../useProgress';
import { useUser } from '../useUser';
import { Avatar } from './GrammarStatusChip';

interface NavbarProps {
  activeSection: SectionType;
  onOpenHandbook: () => void;
  onOpenSidebar: () => void;
  onSectionChange: (section: SectionType) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, onOpenHandbook, onOpenSidebar, onSectionChange }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { t } = useSettings();
  const { user, signOut } = useUser();
  const { flush } = useProgress();

  useEffect(() => {
    if (!userMenuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [userMenuOpen]);

  const handleSignOut = async () => {
    setUserMenuOpen(false);
    if ((await flush()) || window.confirm(t('auth.unsaved'))) await signOut();
  };

  return (
    <header className="sticky top-0 z-40 bg-surface shadow-card">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="-ml-2 grid h-10 w-10 cursor-pointer place-items-center rounded-lg text-ink hover:bg-hero focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:hidden"
            aria-label={t('nav.openModules')}
          >
            <Menu className="h-6 w-6" />
          </button>
          <a href={`#${user.id}/dashboard`} className="text-lg leading-none font-semibold tracking-tight text-ink sm:text-[22px]" aria-label={t('nav.home')}>
            matura<span className="text-primary">english</span>
          </a>
          <span className="ml-2 hidden text-sm text-ink-2 sm:inline">{t('dash.subtitle')}</span>
        </div>

        <div className="flex items-center gap-2">
          {user.role !== 'teacher' && (
            <Button
              variant={activeSection === 'dashboard' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onSectionChange('dashboard')}
              title={t('nav.progress')}
              className="max-sm:!hidden"
            >
              <LayoutDashboard className="h-4 w-4" />
              {t('nav.progress')}
            </Button>
          )}

          <Button variant="secondary" size="sm" onClick={onOpenHandbook} title={t('nav.handbook')}>
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">{t('nav.handbook')}</span>
            <span className="sr-only sm:hidden">{t('nav.handbookShort')}</span>
          </Button>

          <div className="relative" ref={userMenuRef}>
            <button
              type="button"
              onClick={() => setUserMenuOpen((o) => !o)}
              aria-haspopup="menu"
              aria-expanded={userMenuOpen}
              aria-label={`${t('nav.signedIn')}: ${user.name}`}
              title={user.name}
              className={`flex h-10 cursor-pointer items-center gap-2 rounded-lg pr-2 pl-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                userMenuOpen ? 'bg-primary-tint' : 'hover:bg-hero'
              }`}
            >
              <Avatar initials={user.initials} size="sm" />
              <span className="hidden text-sm leading-5 font-semibold text-ink md:inline">{user.name}</span>
              <ChevronDown className="h-4 w-4 text-ink-2" />
            </button>

            {userMenuOpen && (
              <div role="menu" className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-lg border border-line bg-surface py-1">
                <div className="px-4 pt-2 pb-2">
                  <p className="truncate text-base leading-6 font-semibold text-ink">{user.name}</p>
                  <p className="truncate text-xs leading-4 text-ink-2">{user.email}</p>
                </div>
                <div className="my-1 border-t border-line-soft" />
                {user.role === 'teacher' && (
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setUserMenuOpen(false);
                      onSectionChange('dashboard');
                    }}
                    className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left text-base leading-6 text-ink hover:bg-hero focus-visible:bg-hero focus-visible:outline-none"
                  >
                    <LayoutDashboard className="h-5 w-5 text-ink-2" />
                    {t('side.teacherPanel')}
                  </button>
                )}
                {user.role === 'teacher' && (
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setUserMenuOpen(false);
                      onSectionChange('kalendarz');
                    }}
                    className={`flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left text-base leading-6 hover:bg-hero focus-visible:bg-hero focus-visible:outline-none ${
                      activeSection === 'kalendarz' ? 'font-semibold text-primary' : 'text-ink'
                    }`}
                  >
                    <CalendarDays className="h-5 w-5 text-ink-2" />
                    {t('cal.title')}
                  </button>
                )}
                <a
                  href="#profile"
                  role="menuitem"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-base leading-6 text-ink hover:bg-hero focus-visible:bg-hero focus-visible:outline-none"
                >
                  <UserRound className="h-5 w-5 text-ink-2" />
                  {t('nav.profile')}
                </a>
                {user.role === 'teacher' && (
                  <a
                    href="#profile"
                    role="menuitem"
                    onClick={() => {
                      setUserMenuOpen(false);
                      try {
                        window.sessionStorage.setItem(INVITE_SCROLL_KEY, '1');
                      } catch {
                        /* storage unavailable: the profile opens at the top */
                      }
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-base leading-6 text-ink hover:bg-hero focus-visible:bg-hero focus-visible:outline-none"
                  >
                    <UserPlus className="h-5 w-5 text-ink-2" />
                    {t('nav.invite')}
                  </a>
                )}
                <div className="my-1 border-t border-line-soft" />
                <a
                  href="#ustawienia"
                  role="menuitem"
                  onClick={() => setUserMenuOpen(false)}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-base leading-6 hover:bg-hero focus-visible:bg-hero focus-visible:outline-none ${
                    activeSection === 'ustawienia' ? 'font-semibold text-primary' : 'text-ink'
                  }`}
                >
                  <Settings className="h-5 w-5 text-ink-2" />
                  {t('nav.settings')}
                </a>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setUserMenuOpen(false);
                    onSectionChange('design-system');
                  }}
                  className={`flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left text-base leading-6 hover:bg-hero focus-visible:bg-hero focus-visible:outline-none ${
                    activeSection === 'design-system' ? 'font-semibold text-primary' : 'text-ink'
                  }`}
                >
                  <Palette className="h-5 w-5 text-ink-2" />
                  {t('nav.designSystem')}
                </button>
                <div className="my-1 border-t border-line-soft" />
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => void handleSignOut()}
                  className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left text-base leading-6 text-ink hover:bg-hero focus-visible:bg-hero focus-visible:outline-none"
                >
                  <LogOut className="h-5 w-5 text-ink-2" />
                  {t('auth.signOut')}
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
