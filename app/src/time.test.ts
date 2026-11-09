import { describe, expect, it } from 'vitest';
import { addDays, clockOf, dayOf, daysBetween, formatMoment, formatSpan, formatWeek, fromWarsaw, schoolYearEnd, toLocalInput, weekStart, weekdayOf } from './time';

describe('Warsaw time', () => {
  it('reads the Warsaw day and clock of an instant in winter and in summer', () => {
    expect(dayOf('2026-11-11T16:00:00Z')).toBe('2026-11-11');
    expect(clockOf('2026-11-11T16:00:00Z')).toBe('17:00');
    expect(clockOf('2026-07-01T15:00:00Z')).toBe('17:00');
    // Late evening UTC is already the next day in Warsaw.
    expect(dayOf('2026-11-11T23:30:00Z')).toBe('2026-11-12');
  });

  it('turns a Warsaw day and clock into the instant, across the clock changes', () => {
    expect(fromWarsaw('2026-11-11', '17:00')).toBe('2026-11-11T16:00:00.000Z');
    expect(fromWarsaw('2026-07-01', '17:00')).toBe('2026-07-01T15:00:00.000Z');
    // Clocks go forward on 29 March 2026 and back on 25 October 2026: 17:00 stays 17:00 on both days.
    expect(fromWarsaw('2026-03-29', '17:00')).toBe('2026-03-29T15:00:00.000Z');
    expect(fromWarsaw('2026-10-25', '17:00')).toBe('2026-10-25T16:00:00.000Z');
    expect(clockOf(fromWarsaw('2026-03-29', '17:00'))).toBe('17:00');
  });

  it('round-trips through the datetime-local value', () => {
    const iso = fromWarsaw('2026-11-13', '23:59');
    expect(toLocalInput(iso)).toBe('2026-11-13T23:59');
  });

  it('does calendar arithmetic on plain days', () => {
    expect(addDays('2026-11-11', 7)).toBe('2026-11-18');
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
    expect(daysBetween('2026-11-09', '2026-11-15')).toBe(6);
    expect(weekdayOf('2026-11-09')).toBe(1);
    expect(weekdayOf('2026-11-15')).toBe(7);
    expect(weekStart('2026-11-11')).toBe('2026-11-09');
    expect(weekStart('2026-11-15')).toBe('2026-11-09');
    expect(weekStart('2026-11-09')).toBe('2026-11-09');
  });

  it('knows when the school year ends', () => {
    expect(schoolYearEnd('2026-11-08')).toBe('2027-06-30');
    expect(schoolYearEnd('2026-03-01')).toBe('2026-06-30');
    expect(schoolYearEnd('2026-06-30')).toBe('2026-06-30');
  });

  it('formats in Polish and English', () => {
    expect(formatWeek('2026-11-09', 'pl-PL')).toMatch(/^9–15 listopada 2026$/);
    expect(formatWeek('2026-10-26', 'pl-PL')).toContain('października');
    expect(formatSpan('2026-11-11T16:00:00Z', 60)).toBe('17:00–18:00');
    expect(formatMoment('2026-11-11T16:00:00Z', 'en-GB')).toBe('Wed 11/11, 17:00');
    // 11 November 2026 is a Wednesday.
    expect(formatMoment('2026-11-11T16:00:00Z', 'pl-PL')).toMatch(/^śr\.?,? 11\.11, 17:00$/);
  });
});
