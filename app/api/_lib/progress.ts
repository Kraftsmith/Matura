import { isModuleId } from './notes.js';

/** Far above any real module; stops a learner filling the database with whatever they like. */
const MAX_BYTES = 256 * 1024;

const stringArray = (v: unknown) => Array.isArray(v) && v.every((s) => typeof s === 'string');

/** One module of a learner's work: what they did in it and the flashcards they added to it. */
export const validModuleData = (v: unknown): v is { module?: Record<string, unknown>; cards?: unknown[] } => {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return false;
  const { module, cards } = v as { module?: { mastered?: unknown; review?: unknown }; cards?: unknown };
  if (module !== undefined && (typeof module !== 'object' || !stringArray(module.mastered) || !stringArray(module.review))) return false;
  if (cards !== undefined && !Array.isArray(cards)) return false;
  return JSON.stringify(v).length <= MAX_BYTES;
};

export const validModuleKey = (id: string | null): id is string => isModuleId(id);

/** Back to the shape the app keeps in memory (ProgressState). */
export const toProgressState = (rows: Record<string, unknown>[], meta: unknown) => {
  const modules: Record<string, unknown> = {};
  const cards: Record<string, unknown> = {};
  for (const row of rows) {
    const data = row.data as { module?: unknown; cards?: unknown };
    if (data.module) modules[row.module_id as string] = data.module;
    if (data.cards) cards[row.module_id as string] = data.cards;
  }
  return { version: 1, modules, cards, ...(meta as object) };
};
