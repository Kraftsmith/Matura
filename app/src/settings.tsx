import React, { useCallback, useEffect, useMemo, useState } from 'react';
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

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [translationLang, setLang] = useState<TranslationLang>(readStored);
  const [uiLang, setUiLangState] = useState<UiLang>(readStoredUiLang);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, translationLang);
    } catch {
      /* storage unavailable: keep in memory only */
    }
  }, [translationLang]);

  useEffect(() => {
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
