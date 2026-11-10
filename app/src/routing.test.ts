import { describe, expect, it } from 'vitest';
import { appUrl, pageTargets, parseHash, sectionFromSiteSlug, siteSectionSlug, siteUrl, toHash } from './routing';

const LESSON = '3f2504e0-4f89-11d3-9a0c-0305e82c3301';

describe('routes for the calendar and the lessons page', () => {
  it('parses the teacher\'s calendar addresses', () => {
    expect(parseHash('#kalendarz')).toMatchObject({ section: 'kalendarz' });
    expect(parseHash('#kalendarz').item).toBeUndefined();
    expect(parseHash('#kalendarz').lessonId).toBeUndefined();
    expect(parseHash('#kalendarz/2026-11-16')).toMatchObject({ section: 'kalendarz', item: '2026-11-16' });
    expect(parseHash('#kalendarz/not-a-date').item).toBeUndefined();
    expect(parseHash(`#kalendarz/z/${LESSON}`)).toMatchObject({ section: 'kalendarz', lessonId: LESSON });
    expect(parseHash('#kalendarz/z/not-an-id').lessonId).toBeUndefined();
  });

  it('parses the learner\'s lessons page', () => {
    expect(parseHash('#zajecia')).toMatchObject({ section: 'zajecia' });
    expect(parseHash('#maria/zajecia')).toMatchObject({ section: 'zajecia' });
  });

  it('parses the settings page', () => {
    expect(parseHash('#ustawienia')).toMatchObject({ section: 'ustawienia' });
    expect(toHash(parseHash('#ustawienia'))).toBe('ustawienia');
    expect(siteUrl(parseHash('#ustawienia'))).toBe('/app/#ustawienia');
  });

  it('writes the same addresses back', () => {
    for (const hash of ['kalendarz', 'kalendarz/2026-11-16', `kalendarz/z/${LESSON}`, 'zajecia', 'czlowiek/slownictwo/czl-txt-1', 'fiszki/czlowiek']) {
      expect(toHash(parseHash(`#${hash}`))).toBe(hash);
    }
  });

  it('still parses the old addresses', () => {
    expect(parseHash('')).toMatchObject({ section: 'dashboard' });
    expect(parseHash('#czlowiek/slownictwo/czl-txt-2')).toMatchObject({ moduleId: 'czlowiek', section: 'slownictwo', item: 'czl-txt-2' });
    expect(parseHash('#test')).toMatchObject({ section: 'gramatyka' });
    expect(parseHash('#dashboard/maria/fiszki')).toMatchObject({ section: 'dashboard', viewUserId: 'maria', item: 'fiszki' });
  });

  it('builds the public address of a page and the app address of the same page', () => {
    expect(siteUrl(parseHash('#czlowiek'))).toBe('/tematy/czlowiek');
    expect(siteUrl(parseHash('#czlowiek/opis-foto'))).toBe('/tematy/czlowiek');
    expect(siteUrl(parseHash('#czlowiek/slownictwo'))).toBe('/tematy/czlowiek/slownictwo');
    expect(siteUrl(parseHash('#czlowiek/slownictwo/czl-txt-2'))).toBe('/tematy/czlowiek/slownictwo/czl-txt-2');
    expect(siteUrl(parseHash('#czlowiek/srodki/czl-sj-2'))).toBe('/tematy/czlowiek/srodki/czl-sj-2');
    expect(siteUrl(parseHash('#czlowiek/gramatyka/test'))).toBe('/tematy/czlowiek/gramatyka/test');
    expect(siteUrl(parseHash('#czlowiek/fiszki'))).toBe('/tematy/czlowiek/fiszki');
    expect(siteUrl(parseHash('#czlowiek/fiszki/od-nauczyciela'))).toBe('/tematy/czlowiek/fiszki');
    expect(siteUrl(parseHash('#fiszki/czlowiek'))).toBe('/tematy/czlowiek/fiszki');
    expect(siteUrl(parseHash('#dashboard'))).toBe('/app/#dashboard');
    expect(siteUrl(parseHash('#kalendarz'))).toBe('/app/#kalendarz');
    expect(appUrl(parseHash('#czlowiek/srodki/czl-sj-2'))).toBe('/app/#czlowiek/srodki/czl-sj-2');
  });

  it('spells the picture section the way people search for it', () => {
    expect(siteSectionSlug('opis-foto')).toBe('opis-ilustracji');
    expect(siteSectionSlug('srodki')).toBe('srodki');
    expect(sectionFromSiteSlug('opis-ilustracji')).toBe('opis-foto');
    expect(sectionFromSiteSlug('gramatyka')).toBe('gramatyka');
    expect(sectionFromSiteSlug('opis-foto')).toBeUndefined();
    expect(sectionFromSiteSlug('dashboard')).toBeUndefined();
  });

  it('names the homework targets a page can satisfy, most specific first', () => {
    expect(pageTargets(parseHash('#czlowiek/slownictwo/czl-txt-2'))).toEqual(['czlowiek/slownictwo/czl-txt-2', 'czlowiek/slownictwo']);
    expect(pageTargets(parseHash('#czlowiek/pisanie'))).toEqual(['czlowiek/pisanie']);
    expect(pageTargets(parseHash('#fiszki/czlowiek'))).toEqual(['fiszki/czlowiek']);
    expect(pageTargets(parseHash('#czlowiek/fiszki'))).toEqual(['fiszki/czlowiek', 'czlowiek/fiszki']);
    expect(pageTargets(parseHash('#czlowiek/fiszki/od-nauczyciela'))).toEqual(['fiszki/czlowiek', 'czlowiek/fiszki']);
    expect(pageTargets(parseHash('#dashboard'))).toEqual([]);
    expect(pageTargets(parseHash('#kalendarz'))).toEqual([]);
  });
});
