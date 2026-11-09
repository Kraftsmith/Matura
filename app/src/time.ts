/**
 * Lessons happen in Poland: every date and time here is read and shown in Europe/Warsaw, whatever the browser's
 * own zone is. Days are plain "YYYY-MM-DD" strings; instants are ISO strings from the server.
 */
export const TIME_ZONE = 'Europe/Warsaw';

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const TIME = /^\d{2}:\d{2}$/;

export const isDay = (v: unknown): v is string => typeof v === 'string' && DATE.test(v) && !Number.isNaN(Date.parse(`${v}T00:00:00Z`));
export const isClock = (v: unknown): v is string => typeof v === 'string' && TIME.test(v) && Number(v.slice(0, 2)) < 24 && Number(v.slice(3)) < 60;

const parts = (date: Date, locale: string, options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(locale, { timeZone: TIME_ZONE, ...options }).formatToParts(date);

/** The calendar day in Warsaw of an instant. */
export const dayOf = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const p = Object.fromEntries(parts(d, 'en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }).map((x) => [x.type, x.value]));
  return `${p.year}-${p.month}-${p.day}`;
};

export const today = (): string => dayOf(new Date());

/** Wall-clock "HH:MM" in Warsaw of an instant. */
export const clockOf = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const p = Object.fromEntries(parts(d, 'en-GB', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).map((x) => [x.type, x.value]));
  return `${p.hour}:${p.minute}`;
};

/** The Warsaw wall clock of an instant, read back as if it were UTC: the difference to the instant is the zone's offset. */
const wallAsUtc = (date: Date): number => {
  const p = Object.fromEntries(parts(date, 'en-GB', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).map((x) => [x.type, x.value]));
  return Date.UTC(Number(p.year), Number(p.month) - 1, Number(p.day), Number(p.hour), Number(p.minute));
};

/** The instant at which Warsaw clocks show this day and time. Two passes settle the days the clocks change. */
export const fromWarsaw = (day: string, clock: string): string => {
  const [h, m] = clock.split(':').map(Number);
  const [y, mo, d] = day.split('-').map(Number);
  const wanted = Date.UTC(y, mo - 1, d, h, m);
  let guess = wanted;
  for (let i = 0; i < 2; i++) guess += wanted - wallAsUtc(new Date(guess));
  return new Date(guess).toISOString();
};

/** Value for an <input type="datetime-local"> showing the instant in Warsaw time. */
export const toLocalInput = (iso: string): string => `${dayOf(iso)}T${clockOf(iso)}`;

/** Noon UTC of a day: formatting it in any European zone gives that same day, so it is safe for calendar arithmetic. */
export const noonOf = (day: string): Date => new Date(`${day}T12:00:00Z`);

export const addDays = (day: string, n: number): string => {
  const d = noonOf(day);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};

/** ISO weekday of a day: 1 = Monday … 7 = Sunday. */
export const weekdayOf = (day: string): number => ((noonOf(day).getUTCDay() + 6) % 7) + 1;

/** The Monday of the week that holds the day. */
export const weekStart = (day: string): string => addDays(day, 1 - weekdayOf(day));

export const weekDays = (monday: string): string[] => Array.from({ length: 7 }, (_, i) => addDays(monday, i));

export const daysBetween = (from: string, to: string): number => Math.round((noonOf(to).getTime() - noonOf(from).getTime()) / 86_400_000);

export const addMinutes = (iso: string, minutes: number): string => new Date(new Date(iso).getTime() + minutes * 60_000).toISOString();

/** "wtorek, 11 listopada" / "Tuesday, 11 November". */
export const formatDayLong = (day: string, locale: string): string => new Intl.DateTimeFormat(locale, { timeZone: TIME_ZONE, weekday: 'long', day: 'numeric', month: 'long' }).format(noonOf(day));

/** "wt 11.11" / "Tue 11/11". */
export const formatDayShort = (day: string, locale: string): string => new Intl.DateTimeFormat(locale, { timeZone: TIME_ZONE, weekday: 'short', day: '2-digit', month: '2-digit' }).format(noonOf(day));

/** "11.11" / "11/11". */
export const formatDate = (day: string, locale: string): string => new Intl.DateTimeFormat(locale, { timeZone: TIME_ZONE, day: '2-digit', month: '2-digit' }).format(noonOf(day));

/** "10–16 listopada 2026", or "27 października – 2 listopada 2026" when the week spans two months. */
export const formatWeek = (monday: string, locale: string): string => {
  const sunday = addDays(monday, 6);
  const sameMonth = monday.slice(0, 7) === sunday.slice(0, 7);
  const full: Intl.DateTimeFormatOptions = { timeZone: TIME_ZONE, day: 'numeric', month: 'long', year: 'numeric' };
  if (sameMonth) {
    const day = new Intl.DateTimeFormat(locale, { timeZone: TIME_ZONE, day: 'numeric' }).format(noonOf(monday));
    return `${day}–${new Intl.DateTimeFormat(locale, full).format(noonOf(sunday))}`;
  }
  const start = new Intl.DateTimeFormat(locale, { timeZone: TIME_ZONE, day: 'numeric', month: 'long' }).format(noonOf(monday));
  return `${start} – ${new Intl.DateTimeFormat(locale, full).format(noonOf(sunday))}`;
};

/** "wtorek 11.11, 17:00" / "Tuesday 11/11, 17:00": a lesson's moment in one phrase. */
export const formatMoment = (iso: string, locale: string): string => `${formatDayShort(dayOf(iso), locale)}, ${clockOf(iso)}`;

/** "17:00–18:00". */
export const formatSpan = (iso: string, durationMin: number): string => `${clockOf(iso)}–${clockOf(addMinutes(iso, durationMin))}`;

/** Weekday names in order Monday…Sunday, for column headers. */
export const weekdayNames = (locale: string, style: 'short' | 'long' = 'short'): string[] => {
  const monday = '2024-01-01';
  return weekDays(monday).map((d) => new Intl.DateTimeFormat(locale, { timeZone: TIME_ZONE, weekday: style }).format(noonOf(d)));
};

/** End of the school year the day belongs to: 30 June, this year or the next. */
export const schoolYearEnd = (day: string): string => {
  const year = Number(day.slice(0, 4));
  return day <= `${year}-06-30` ? `${year}-06-30` : `${year + 1}-06-30`;
};

/** Minutes since midnight in Warsaw, to order lessons within a day. */
export const minutesOf = (iso: string): number => {
  const [h, m] = clockOf(iso).split(':').map(Number);
  return h * 60 + m;
};
