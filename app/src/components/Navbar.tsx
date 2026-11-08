import React, { useEffect, useRef, useState } from 'react';
import { BookOpen, Menu, Settings, Palette, Languages, LayoutDashboard, ChevronDown, Globe, LogOut, UserPlus, UserRound } from 'lucide-react';
import { INVITE_SCROLL_KEY } from './ClassInvite';
import type { SectionType, TranslationLang } from '../types';
import type { UiLang } from '../i18n';
import { Button } from './ui';
import { useSettings } from '../useSettings';
import { useProgress } from '../useProgress';
import { useUser } from '../useUser';
import { Avatar } from './GrammarStatusChip';

const langOptions: { id: TranslationLang; label: string }[] = [
  { id: 'pl', label: 'Polski' },
  { id: 'ru', label: 'Русский' },
];

const uiLangOptions: { id: UiLang; label: string }[] = [
  { id: 'pl', label: 'Polski' },
  { id: 'en', label: 'English' },
];

interface NavbarProps {
  activeSection: SectionType;
  onOpenHandbook: () => void;
  onOpenSidebar: () => void;
  onSectionChange: (section: SectionType) => void;
}

const Segmented = <T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) => (
  <div className="grid grid-cols-2 gap-1 rounded-lg bg-chip p-1" role="radiogroup" aria-label={label}>
    {options.map((o) => {
      const on = value === o.id;
      return (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={on}
          onClick={() => onChange(o.id)}
          className={`cursor-pointer rounded-md px-3 py-1.5 text-sm leading-5 font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary ${
            on ? 'bg-surface text-ink' : 'text-ink-2 hover:text-ink'
          }`}
        >
          {o.label}
        </button>
      );
    })}
  </div>
);

export const Navbar: React.FC<NavbarProps> = ({ activeSection, onOpenHandbook, onOpenSidebar, onSectionChange }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { translationLang, setTranslationLang, uiLang, setUiLang, t } = useSettings();
  const { user, signOut } = useUser();
  const { flush } = useProgress();

  useEffect(() => {
    if (!menuOpen && !userMenuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen, userMenuOpen]);

  const dashboardLabel = user.role === 'teacher' ? t('nav.students') : t('nav.progress');

  const handleSignOut = async () => {
    setUserMenuOpen(false);
    if ((await flush()) || window.confirm(t('auth.unsaved'))) await signOut();
  };

  return (
    <header className="sticky top-0 z-40 bg-surface shadow-card">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
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
          <Button
            variant={activeSection === 'dashboard' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => onSectionChange('dashboard')}
            title={dashboardLabel}
            className="max-sm:!hidden"
          >
            <LayoutDashboard className="h-4 w-4" />
            {dashboardLabel}
          </Button>

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

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-label={t('nav.settings')}
              title={t('nav.settings')}
              className={`grid h-10 w-10 cursor-pointer place-items-center rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                menuOpen || activeSection === 'design-system' ? 'bg-primary-tint text-primary' : 'text-ink-2 hover:bg-hero hover:text-ink'
              }`}
            >
              <Settings className="h-5 w-5" />
            </button>

            {menuOpen && (
              <div role="menu" className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-lg border border-line bg-surface py-1">
                <p className="px-4 pt-2 pb-1 text-xs leading-4 text-ink-2">{t('nav.pageSettings')}</p>

                <div className="px-4 py-2">
                  <div className="mb-2 flex items-center gap-2 text-base leading-6 text-ink">
                    <Globe className="h-5 w-5 text-ink-2" />
                    {t('nav.uiLang')}
                  </div>
                  <Segmented options={uiLangOptions} value={uiLang} onChange={setUiLang} label={t('nav.uiLang')} />
                </div>

                <div className="px-4 py-2">
                  <div className="mb-2 flex items-center gap-2 text-base leading-6 text-ink">
                    <Languages className="h-5 w-5 text-ink-2" />
                    {t('nav.translationLang')}
                  </div>
                  <Segmented options={langOptions} value={translationLang} onChange={setTranslationLang} label={t('nav.translationLang')} />
                </div>

                <div className="my-1 border-t border-line-soft" />
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    onSectionChange('design-system');
                  }}
                  className={`flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left text-base leading-6 hover:bg-hero focus-visible:bg-hero focus-visible:outline-none ${
                    activeSection === 'design-system' ? 'font-semibold text-primary' : 'text-ink'
                  }`}
                >
                  <Palette className="h-5 w-5 text-ink-2" />
                  {t('nav.designSystem')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
