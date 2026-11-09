import { describe, expect, it } from 'vitest';
import { autoCounted, describeTarget, moduleTargets, parseTarget, targetKind, targetString } from './courseTargets';

describe('course targets', () => {
  it('accepts real pages and rejects everything else', () => {
    expect(parseTarget('czlowiek/slownictwo/czl-txt-2')).toEqual({ moduleId: 'czlowiek', section: 'slownictwo', item: 'czl-txt-2' });
    expect(parseTarget('czlowiek/gramatyka/test')).toEqual({ moduleId: 'czlowiek', section: 'gramatyka', item: 'test' });
    expect(parseTarget('czlowiek/pisanie')).toEqual({ moduleId: 'czlowiek', section: 'pisanie', item: undefined });
    expect(parseTarget('fiszki/czlowiek')).toEqual({ moduleId: 'czlowiek', section: 'fiszki' });
    expect(parseTarget('czlowiek/slownictwo/nope')).toBeUndefined();
    expect(parseTarget('nope/slownictwo')).toBeUndefined();
    expect(parseTarget('czlowiek/dashboard')).toBeUndefined();
    expect(parseTarget('czlowiek/fiszki')).toBeUndefined();
    expect(parseTarget('fiszki/czlowiek/extra')).toBeUndefined();
    expect(parseTarget('czlowiek/slownictwo/czl-txt-2/more')).toBeUndefined();
  });

  it('writes a target back as the same route', () => {
    for (const route of ['czlowiek/slownictwo/czl-txt-2', 'czlowiek/pisanie', 'fiszki/czlowiek']) expect(targetString(parseTarget(route)!)).toBe(route);
  });

  it('knows which pages count by themselves', () => {
    expect(targetKind(parseTarget('czlowiek/slownictwo/czl-txt-1')!)).toBe('gap');
    expect(targetKind(parseTarget('czlowiek/srodki/czl-sj-1')!)).toBe('exercise');
    expect(targetKind(parseTarget('czlowiek/gramatyka/test')!)).toBe('test');
    expect(targetKind(parseTarget('czlowiek/pisanie')!)).toBe('essay');
    expect(targetKind(parseTarget('fiszki/czlowiek')!)).toBe('deck');
    expect(targetKind(parseTarget('czlowiek/gramatyka/gram-1')!)).toBe('manual');
    expect(targetKind(parseTarget('czlowiek/opis-foto')!)).toBe('manual');
    expect(autoCounted(parseTarget('czlowiek/pisanie')!)).toBe(true);
    expect(autoCounted(parseTarget('fiszki/czlowiek')!)).toBe(false);
    expect(autoCounted(parseTarget('czlowiek/slownictwo')!)).toBe(false);
  });

  it('names a target for the screen', () => {
    const text = describeTarget(parseTarget('czlowiek/slownictwo/czl-txt-1')!)!;
    expect(text.topic).toBe('Człowiek');
    expect(text.section).toBe('tab.vocabulary');
    expect(text.item?.text.length).toBeGreaterThan(0);
    const exercise = describeTarget(parseTarget('czlowiek/srodki/czl-sj-2')!)!;
    expect(exercise.item).toMatchObject({ key: 'hw.exerciseN', n: 2 });
    expect(describeTarget(parseTarget('czlowiek/gramatyka/test')!)!.item).toEqual({ text: '', key: 'hdr.test' });
    expect(describeTarget({ moduleId: 'nope', section: 'pisanie' })).toBeUndefined();
  });

  it('lists every page of a topic once, in tab order', () => {
    const list = moduleTargets('czlowiek').map(targetString);
    expect(list[0]).toBe('czlowiek/opis-foto');
    expect(list).toContain('czlowiek/gramatyka/test');
    expect(list).toContain('czlowiek/slownictwo/czl-txt-1');
    expect(list).toContain('czlowiek/srodki/czl-sj-1');
    expect(list.at(-2)).toBe('czlowiek/pisanie');
    expect(list.at(-1)).toBe('fiszki/czlowiek');
    expect(new Set(list).size).toBe(list.length);
    expect(moduleTargets('nope')).toEqual([]);
  });
});
