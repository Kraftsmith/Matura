const STUDENT_IDS = ['maria', 'evgeny'];
const TAGS = ['general', 'mistakes', 'homework', 'lesson', 'parents'];
const MAX_TEXT = 5000;

/** Same ids as allModules; the module data itself is too heavy to load into a function. */
const MODULE_IDS = [
  'czlowiek',
  'miejsce-zamieszkania',
  'edukacja',
  'praca',
  'zycie-prywatne',
  'zywienie',
  'zakupy',
  'podroze',
  'kultura',
  'sport',
  'zdrowie',
  'nauka-technika',
  'przyroda',
  'panstwo-spoleczenstwo',
];

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const isStudentId = (id: string | undefined): id is string => STUDENT_IDS.includes(id ?? '');
export const isNoteId = (id: string | undefined): id is string => UUID.test(id ?? '');

export const validText = (v: unknown): v is string => typeof v === 'string' && v.trim().length >= 1 && v.length <= MAX_TEXT;
export const validTag = (v: unknown): v is string => typeof v === 'string' && TAGS.includes(v);
export const validModule = (v: unknown): v is string | null => v === null || (typeof v === 'string' && MODULE_IDS.includes(v));

export const toNote = (r: Record<string, unknown>) => ({
  id: r.id,
  studentId: r.student_id,
  text: r.text,
  tag: r.tag,
  moduleId: r.module_id ?? undefined,
  pinned: r.pinned,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});
