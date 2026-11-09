import { describe, expect, it } from 'vitest';
import { addDays, autoCounted, daysBetween, parseItems, parseTarget, validClock, validDay, validDuration, validInstant } from './schedule.js';

describe('target syntax on the server', () => {
  it('accepts the shapes the client produces', () => {
    expect(parseTarget('czlowiek/slownictwo/czl-txt-2')).toEqual({ moduleId: 'czlowiek', section: 'slownictwo', item: 'czl-txt-2' });
    expect(parseTarget('czlowiek/pisanie')).toEqual({ moduleId: 'czlowiek', section: 'pisanie', item: undefined });
    expect(parseTarget('fiszki/praca')).toEqual({ moduleId: 'praca', section: 'fiszki' });
  });

  it('rejects unknown modules, sections and odd items', () => {
    expect(parseTarget('nope/pisanie')).toBeNull();
    expect(parseTarget('czlowiek/dashboard')).toBeNull();
    expect(parseTarget('czlowiek/fiszki')).toBeNull();
    expect(parseTarget('czlowiek/slownictwo/Has Spaces')).toBeNull();
    expect(parseTarget('czlowiek/slownictwo/a/b')).toBeNull();
    expect(parseTarget(42)).toBeNull();
    expect(parseTarget('x'.repeat(121))).toBeNull();
  });

  it('matches the client on what counts by itself', () => {
    expect(autoCounted(parseTarget('czlowiek/slownictwo/czl-txt-1')!)).toBe(true);
    expect(autoCounted(parseTarget('czlowiek/srodki/czl-sj-1')!)).toBe(true);
    expect(autoCounted(parseTarget('czlowiek/gramatyka/test')!)).toBe(true);
    expect(autoCounted(parseTarget('czlowiek/pisanie')!)).toBe(true);
    expect(autoCounted(parseTarget('czlowiek/gramatyka/gram-1')!)).toBe(false);
    expect(autoCounted(parseTarget('czlowiek/opis-foto')!)).toBe(false);
    expect(autoCounted(parseTarget('fiszki/czlowiek')!)).toBe(false);
  });
});

describe('homework items from the body', () => {
  it('trims and keeps ids of known items', () => {
    expect(parseItems([{ kind: 'text', text: '  Rozdział 3 ' }, { id: '3f2504e0-4f89-11d3-9a0c-0305e82c3301', kind: 'link', target: 'czlowiek/pisanie', text: 'tylko wstęp' }])).toEqual([
      { id: undefined, kind: 'text', target: null, text: 'Rozdział 3' },
      { id: '3f2504e0-4f89-11d3-9a0c-0305e82c3301', kind: 'link', target: 'czlowiek/pisanie', text: 'tylko wstęp' },
    ]);
  });

  it('refuses what cannot be an item', () => {
    expect(parseItems('nope')).toBeNull();
    expect(parseItems([{ kind: 'text', text: '' }])).toBeNull();
    expect(parseItems([{ kind: 'text', text: 'x'.repeat(501) }])).toBeNull();
    expect(parseItems([{ kind: 'link', text: '' }])).toBeNull();
    expect(parseItems([{ kind: 'link', target: 'nope/pisanie', text: '' }])).toBeNull();
    expect(parseItems([{ kind: 'link', target: 'czlowiek/pisanie', text: 'x'.repeat(201) }])).toBeNull();
    expect(parseItems([{ kind: 'audio', text: 'x' }])).toBeNull();
    expect(parseItems([{ id: 'not-a-uuid', kind: 'text', text: 'x' }])).toBeNull();
    expect(parseItems(Array.from({ length: 31 }, () => ({ kind: 'text', text: 'x' })))).toBeNull();
  });
});

describe('dates and clocks', () => {
  it('validates days, clocks, durations and instants', () => {
    expect(validDay('2026-11-11')).toBe(true);
    expect(validDay('2026-13-11')).toBe(false);
    expect(validDay('11.11.2026')).toBe(false);
    expect(validClock('17:00')).toBe(true);
    expect(validClock('24:00')).toBe(false);
    expect(validClock('7:00')).toBe(false);
    expect(validDuration(60)).toBe(true);
    expect(validDuration(10)).toBe(false);
    expect(validDuration(60.5)).toBe(false);
    expect(validInstant('2026-11-11T16:00:00.000Z')).toBe(true);
    expect(validInstant('soon')).toBe(false);
  });

  it('counts days without a zone', () => {
    expect(daysBetween('2026-11-09', '2026-11-15')).toBe(6);
    expect(addDays('2026-10-25', 7)).toBe('2026-11-01');
  });
});
