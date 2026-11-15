import { describe, expect, it } from 'vitest';
import { workForItem } from './homework';
import { emptyModuleProgress, type ProgressState } from './progress-context';
import type { HomeworkItem } from './schedule';

const item = (target: string): HomeworkItem => ({ id: `item-${target}`, position: 0, kind: 'link', target, text: '', createdAt: '2026-11-01T10:00:00Z' });

const state = (module: Partial<ReturnType<typeof emptyModuleProgress>>): ProgressState => ({ version: 1, modules: { czlowiek: { ...emptyModuleProgress(), ...module } }, cards: {} });

describe('workForItem', () => {
  it('lists a matching exercise as prompt → chosen reply, marked once checked', () => {
    const s = state({ exerciseWork: { 'czl-sj-1': { answers: { '1': 'c', '2': 'a' }, checked: true, at: '2026-11-02T10:00:00Z' } } });
    const work = workForItem(item('czlowiek/srodki/czl-sj-1'), s);
    expect(work?.answers).toEqual([
      { label: 'Thank you very much for your help.', answer: "c. Don't mention it.", correct: true },
      { label: 'Could you help me for a second?', answer: "a. It's OK, don't worry about it.", correct: false },
    ]);
  });

  it('leaves the marks out until the exercise is checked', () => {
    const s = state({ exerciseWork: { 'czl-sj-1': { answers: { '1': 'c' }, checked: false, at: '2026-11-02T10:00:00Z' } } });
    expect(workForItem(item('czlowiek/srodki/czl-sj-1'), s)?.answers?.[0].correct).toBeUndefined();
  });

  it('shows nothing once the key was revealed, or when nothing was done', () => {
    const s = state({ exerciseWork: { 'czl-sj-1': { answers: { '1': 'c' }, checked: true, revealed: true, at: '2026-11-02T10:00:00Z' } } });
    expect(workForItem(item('czlowiek/srodki/czl-sj-1'), s)).toBeUndefined();
    expect(workForItem(item('czlowiek/srodki/czl-sj-1'), state({}))).toBeUndefined();
    expect(workForItem(item('czlowiek/srodki/czl-sj-1'), undefined)).toBeUndefined();
  });

  it('returns the essay text', () => {
    const s = state({ essay: { text: 'Dear Sir,\nI am writing…', at: '2026-11-02T10:00:00Z' } });
    expect(workForItem(item('czlowiek/pisanie'), s)).toEqual({ text: 'Dear Sir,\nI am writing…' });
  });

  it('knows nothing about pages the site cannot count', () => {
    expect(workForItem(item('fiszki/czlowiek'), state({}))).toBeUndefined();
    expect(workForItem({ id: 't', position: 0, kind: 'text', text: 'Read chapter 3', createdAt: '2026-11-01T10:00:00Z' }, state({}))).toBeUndefined();
  });
});
