import { describe, expect, it } from 'vitest';
import { allModules } from './data/modulesData';
import { handbookEntries, searchHandbook } from './grammarHandbook';

describe('the grammar handbook', () => {
  it('lists every rule of every topic', () => {
    expect(handbookEntries).toHaveLength(allModules.reduce((n, m) => n + m.grammarRules.length, 0));
    expect(handbookEntries.find((e) => e.rule.id === 'gram-2')).toMatchObject({ module: { id: 'czlowiek' }, tasks: [{ id: 'test-4' }, { id: 'test-5' }] });
  });

  it('has an exercise for every rule', () => {
    expect(handbookEntries.filter((e) => e.tasks.length === 0).map((e) => `${e.module.id}/${e.rule.id}`)).toEqual([]);
  });

  it('links tasks only to rules of their own topic', () => {
    const dangling = allModules.flatMap((m) =>
      m.testQuestions.filter((q) => q.grammarRef?.ruleId && !m.grammarRules.some((r) => r.id === q.grammarRef?.ruleId)).map((q) => `${m.id}/${q.id}`),
    );
    expect(dangling).toEqual([]);
  });

  it('finds a rule by its title, structure or Polish typed without its letters, not by the topic it sits in', () => {
    const ids = (query: string) => searchHandbook(query).map((e) => e.rule.id);
    expect(ids('')).toHaveLength(handbookEntries.length);
    expect(ids('used to')).toEqual(['gram-2']);
    expect(ids('INWERSJA')).toEqual(['pod-g1', 'pan-g1']);
    expect(ids('mowa zalezna')).toEqual(['praca-g1']);
    expect(ids('will have')).toContain('nt-g1');
    expect(ids('edukacja')).toEqual([]);
    expect(ids('xyzzy')).toEqual([]);
  });
});
