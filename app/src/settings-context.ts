import { createContext } from 'react';
import type { TranslationLang } from './types';
import type { I18nKey, UiLang } from './i18n';

export interface SettingsValue {
  translationLang: TranslationLang;
  setTranslationLang: (lang: TranslationLang) => void;
  /** Picks the Russian string when the learner chose Russian and it exists, otherwise the Polish one. */
  tr: (pl: string | undefined, ru: string | undefined) => string | undefined;
  /** Interface language (navigation, buttons, labels). Learning content is not affected. */
  uiLang: UiLang;
  setUiLang: (lang: UiLang) => void;
  /** Interface string by key, with optional {placeholders}. */
  t: (key: I18nKey, vars?: Record<string, string | number>) => string;
}

export const SettingsContext = createContext<SettingsValue | null>(null);
