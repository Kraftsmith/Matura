import React from 'react';
import { Globe, Languages } from 'lucide-react';
import type { TranslationLang } from '../types';
import type { UiLang } from '../i18n';
import { useSettings } from '../useSettings';

const uiLangOptions: { id: UiLang; label: string }[] = [
  { id: 'pl', label: 'Polski' },
  { id: 'en', label: 'English' },
];

const translationLangOptions: { id: TranslationLang; label: string }[] = [
  { id: 'pl', label: 'Polski' },
  { id: 'ru', label: 'Русский' },
];

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
  <div className="grid grid-cols-2 gap-1 rounded-lg bg-chip p-1 sm:w-72" role="radiogroup" aria-label={label}>
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

/** One setting: an icon, a name, a short explanation and the control. */
const Row: React.FC<{ icon: React.ReactNode; title: string; hint: string; children: React.ReactNode }> = ({ icon, title, hint, children }) => (
  <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-ink-2">{icon}</span>
      <div>
        <p className="text-base leading-6 font-semibold text-ink">{title}</p>
        <p className="text-sm leading-5 text-ink-2">{hint}</p>
      </div>
    </div>
    {children}
  </div>
);

/** #ustawienia: the interface and translation languages. Both are stored in the account (Spec - Rejestracja §6). */
export const SettingsPage: React.FC = () => {
  const { translationLang, setTranslationLang, uiLang, setUiLang, t } = useSettings();

  return (
    <div className="mx-auto grid w-full max-w-2xl gap-5">
      <h1 className="text-3xl leading-10 font-medium">{t('settings.title')}</h1>
      <section className="grid gap-5 card p-5">
        <h2 className="text-xl leading-7 font-semibold">{t('settings.languages')}</h2>
        <Row icon={<Globe className="h-5 w-5" />} title={t('nav.uiLang')} hint={t('settings.uiLangHint')}>
          <Segmented options={uiLangOptions} value={uiLang} onChange={setUiLang} label={t('nav.uiLang')} />
        </Row>
        <div className="border-t border-line-soft" />
        <Row icon={<Languages className="h-5 w-5" />} title={t('nav.translationLang')} hint={t('settings.translationLangHint')}>
          <Segmented options={translationLangOptions} value={translationLang} onChange={setTranslationLang} label={t('nav.translationLang')} />
        </Row>
        <p className="text-sm leading-5 text-ink-2">{t('settings.saved')}</p>
      </section>
    </div>
  );
};
