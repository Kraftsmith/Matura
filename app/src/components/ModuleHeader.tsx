import React from 'react';
import { ChevronRight } from 'lucide-react';
import type { MaturaModule, SectionType } from '../types';
import { Tabs } from './ui';
import { useSettings } from '../useSettings';

interface ModuleHeaderProps {
  module: MaturaModule;
  activeSection: SectionType;
  onSectionChange: (section: SectionType) => void;
  masteredCardsCount: number;
  testScore: number | null;
}

export const ModuleHeader: React.FC<ModuleHeaderProps> = ({ module, activeSection, onSectionChange, masteredCardsCount, testScore }) => {
  const { t } = useSettings();

  const tabs: { id: SectionType; label: string; count?: number }[] = [
    { id: 'fiszki', label: t('tab.flashcards'), count: module.flashcards.length },
    { id: 'opis-foto', label: t('tab.picture') },
    { id: 'gramatyka', label: t('tab.grammar'), count: module.testQuestions.length },
    { id: 'slownictwo', label: t('tab.vocabulary') },
    { id: 'pisanie', label: t('tab.writing') },
  ];

  const levelName = module.badge === 'B1+' ? t('hdr.levelBasic') : t('hdr.levelExtended');

  const meta: React.ReactNode[] = [
    <span key="lvl">
      <b className="font-semibold text-ink">{module.badge}</b> {levelName}
    </span>,
    <span key="cards">
      <b className="font-semibold text-ink">{module.flashcards.length}</b> {t('hdr.cards')}
    </span>,
  ];
  if (masteredCardsCount > 0)
    meta.push(
      <span key="m">
        <b className="font-semibold text-ink">{masteredCardsCount}</b> {t('hdr.mastered')}
      </span>,
    );
  if (testScore !== null)
    meta.push(
      <span key="t">
        {t('hdr.test')}: <b className="font-semibold text-ink">{testScore}%</b>
      </span>,
    );

  return (
    <div className="-mx-4 -mt-4 mb-6 sm:-mx-6 sm:-mt-6 lg:-mx-8 lg:-mt-8">
      <div className="bg-hero px-4 pt-6 pb-5 sm:px-6 lg:px-8">
        <nav className="mb-2 flex items-center gap-1.5 text-sm text-ink-2" aria-label={t('misc.path')}>
          <span>{t('hdr.modules')}</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-semibold text-ink">
            {t('hdr.module')} {module.number}
          </span>
        </nav>
        <h1 className="text-3xl leading-10 font-semibold sm:text-4xl sm:leading-12">
          {module.titlePl} <span className="font-normal text-ink-2">({module.titleEn})</span>
        </h1>
        <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-2">{meta}</p>
      </div>
      <div className="px-4 sm:px-6 lg:px-8">
        <Tabs items={tabs} value={activeSection} onChange={onSectionChange} ariaLabel={t('hdr.sections')} />
      </div>
    </div>
  );
};
