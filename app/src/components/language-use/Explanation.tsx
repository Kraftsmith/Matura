import React from 'react';
import type { LocalizedText } from '../../types';
import { useSettings } from '../../useSettings';

/** Why an answer is right: in Polish, with the translation under it when translations are on. */
export const Explanation: React.FC<{ text?: LocalizedText; showTranslations: boolean }> = ({ text, showTranslations }) => {
  const { tr } = useSettings();
  if (!text) return null;
  const translated = tr(text.pl, text.ru);
  return (
    <p className="text-sm leading-5 text-ink-2">
      {text.pl}
      {showTranslations && translated !== text.pl && <span className="mt-0.5 block text-ink-3 italic">{translated}</span>}
    </p>
  );
};
