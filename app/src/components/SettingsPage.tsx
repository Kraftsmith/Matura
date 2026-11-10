import React, { useState } from 'react';
import { Globe, Languages, Mail, MessageSquare } from 'lucide-react';
import type { TranslationLang } from '../types';
import type { UiLang } from '../i18n';
import { patchMe } from '../accountApi';
import { useSettings } from '../useSettings';
import { useUser } from '../useUser';

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

/** An on/off setting, saved to the account as soon as it changes. */
const Switch: React.FC<{ label: string; checked: boolean; onChange: (v: boolean) => void }> = ({ label, checked, onChange }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={() => onChange(!checked)}
    className={`relative h-7 w-12 shrink-0 cursor-pointer rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${checked ? 'bg-primary' : 'bg-chip'}`}
  >
    <span className={`absolute top-1 h-5 w-5 rounded-full bg-surface shadow-card transition-[left] ${checked ? 'left-6' : 'left-1'}`} />
  </button>
);

/** Which mails come (Spec - Powiadomienia §7.6). Notifications on the site are always on. */
const NotificationSettings: React.FC = () => {
  const { t } = useSettings();
  const { user, setAccount } = useUser();
  const [failed, setFailed] = useState(false);

  const save = (patch: { notifyMailMessage?: boolean; notifyMailDigest?: boolean }) => {
    setAccount({ ...user, ...patch });
    patchMe(patch).then(setAccount, () => setFailed(true));
  };

  return (
    <section className="grid gap-5 card p-5">
      <h2 className="text-xl leading-7 font-semibold">{t('profile.notifications')}</h2>
      {user.role === 'student' && (
        <>
          <Row icon={<MessageSquare className="h-5 w-5" />} title={t('profile.mailMessage')} hint={t('profile.mailMessageHint')}>
            <Switch label={t('profile.mailMessage')} checked={user.notifyMailMessage} onChange={(v) => save({ notifyMailMessage: v })} />
          </Row>
          <div className="border-t border-line-soft" />
        </>
      )}
      <Row icon={<Mail className="h-5 w-5" />} title={t('profile.mailDigest')} hint={t(user.role === 'teacher' ? 'profile.mailDigestHintTeacher' : 'profile.mailDigestHint')}>
        <Switch label={t('profile.mailDigest')} checked={user.notifyMailDigest} onChange={(v) => save({ notifyMailDigest: v })} />
      </Row>
      <p className="text-sm leading-5 text-ink-2">{failed ? t('save.failed') : t('profile.siteAlways')}</p>
    </section>
  );
};

/** #ustawienia: the interface and translation languages, and which mails come. All stored in the account. */
export const SettingsPage: React.FC = () => {
  const { translationLang, setTranslationLang, uiLang, setUiLang, t } = useSettings();

  return (
    <div className="mx-auto grid w-full max-w-2xl gap-5">
      <h1 className="text-3xl leading-10 font-medium">{t('settings.title')}</h1>
      <NotificationSettings />
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
