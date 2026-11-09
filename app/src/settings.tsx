import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SettingsContext } from './settings-context';
import type { TranslationLang } from './types';
import { dictionaries, format, type I18nKey, type UiLang } from './i18n';

const STORAGE_KEY = 'matura.translationLang';
const UI_LANG_KEY = 'matura.uiLang';

const readStored = (): TranslationLang => {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === 'ru' ? 'ru' : 'pl';
  } catch {
    return 'pl';
  }
};

const readStoredUiLang = (): UiLang => {
  try {
    const v = window.localStorage.getItem(UI_LANG_KEY);
    return v === 'en' ? 'en' : 'pl';
  } catch {
    return 'pl';
  }
};

/**
 * Both languages start as Polish and the stored choice arrives in an effect: the same component is rendered
 * to HTML for the public site, where there is no browser, and that HTML must match the first client render.
 */
export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [translationLang, setLang] = useState<TranslationLang>('pl');
  const [uiLang, setUiLangState] = useState<UiLang>('pl');
  const loaded = useRef(false);

  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect
    setLang(readStored());
    setUiLangState(readStoredUiLang());
    loaded.current = true;
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, translationLang);
    } catch {
      /* storage unavailable: keep in memory only */
    }
  }, [translationLang]);

  useEffect(() => {
    if (!loaded.current) return;
    try {
      window.localStorage.setItem(UI_LANG_KEY, uiLang);
    } catch {
      /* storage unavailable: keep in memory only */
    }
    document.documentElement.lang = uiLang;
  }, [uiLang]);

  const setTranslationLang = useCallback((lang: TranslationLang) => setLang(lang), []);
  const setUiLang = useCallback((lang: UiLang) => setUiLangState(lang), []);

  const tr = useCallback(
    (pl: string | undefined, ru: string | undefined) => (translationLang === 'ru' && ru ? ru : pl),
    [translationLang],
  );

  const t = useCallback(
    (key: I18nKey, vars?: Record<string, string | number>) => format(dictionaries[uiLang][key] ?? dictionaries.pl[key] ?? key, vars),
    [uiLang],
  );

  const value = useMemo(
    () => ({ translationLang, setTranslationLang, tr, uiLang, setUiLang, t }),
    [translationLang, setTranslationLang, tr, uiLang, setUiLang, t],
  );
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};
