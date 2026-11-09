import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { allModules } from '../../data/modulesData';
import { describeTarget, moduleTargets, targetString } from '../../courseTargets';
import { Button, fieldClass } from '../ui';
import { useSettings } from '../../useSettings';

/** Topic → page of the course, for a homework item. */
export const TargetPicker: React.FC<{ onPick: (target: string) => void }> = ({ onPick }) => {
  const { t } = useSettings();
  const [moduleId, setModuleId] = useState(allModules[0].id);
  const targets = moduleTargets(moduleId);
  const [target, setTarget] = useState(targetString(targets[0]));

  const changeModule = (id: string) => {
    setModuleId(id);
    setTarget(targetString(moduleTargets(id)[0]));
  };

  const pageLabel = (value: string) => {
    const label = describeTarget(targets.find((x) => targetString(x) === value)!);
    if (!label) return value;
    const section = t(label.section);
    if (!label.item) return section;
    return `${section}: ${label.item.key ? `${t(label.item.key, { n: label.item.n ?? '' })}${label.item.text ? ` · ${label.item.text}` : ''}` : label.item.text}`;
  };

  return (
    <div className="grid gap-2 sm:grid-cols-[1fr_1.4fr_auto] sm:items-end">
      <label className="grid gap-1.5">
        <span className="text-sm leading-5 font-semibold text-ink">{t('hw.topic')}</span>
        <select className={fieldClass} value={moduleId} onChange={(e) => changeModule(e.target.value)}>
          {allModules.map((m) => (
            <option key={m.id} value={m.id}>
              {m.number}. {m.titlePl}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1.5">
        <span className="text-sm leading-5 font-semibold text-ink">{t('hw.page')}</span>
        <select className={fieldClass} value={target} onChange={(e) => setTarget(e.target.value)}>
          {targets.map((x) => {
            const value = targetString(x);
            return (
              <option key={value} value={value}>
                {pageLabel(value)}
              </option>
            );
          })}
        </select>
      </label>
      <Button size="sm" variant="secondary" onClick={() => onPick(target)}>
        <Plus className="h-4 w-4" />
        {t('hw.fromCourse')}
      </Button>
    </div>
  );
};
