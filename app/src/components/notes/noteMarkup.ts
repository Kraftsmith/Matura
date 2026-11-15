/**
 * The small markup of teacher notes: **bold**, _italic_, "- " bullets and "1. " numbers, one item per line.
 * It is a subset of Markdown, so a note pasted elsewhere still reads well, and the stored text stays plain:
 * search, the class-page preview and e-mails work on it without a parser.
 */

export type Inline = { kind: 'text'; text: string } | { kind: 'bold' | 'italic'; children: Inline[] };

export type Block = { kind: 'paragraph'; lines: Inline[][] } | { kind: 'list'; ordered: boolean; items: Inline[][] };

const BULLET = /^[-*]\s+(.*)$/;
const NUMBER = /^\d+[.)]\s+(.*)$/;
/** The earliest marker in a line; `**` is tried before `_` so "**a_b**" bolds the whole thing. */
const MARKER = /\*\*(.+?)\*\*|_(.+?)_/;

export const parseInline = (text: string): Inline[] => {
  const out: Inline[] = [];
  let rest = text;
  while (rest) {
    const m = MARKER.exec(rest);
    if (!m) {
      out.push({ kind: 'text', text: rest });
      break;
    }
    if (m.index > 0) out.push({ kind: 'text', text: rest.slice(0, m.index) });
    out.push(m[1] !== undefined ? { kind: 'bold', children: parseInline(m[1]) } : { kind: 'italic', children: parseInline(m[2]) });
    rest = rest.slice(m.index + m[0].length);
  }
  return out;
};

export const parseNote = (text: string): Block[] => {
  const blocks: Block[] = [];
  // The block the next line may join; a blank line closes it.
  let open: Block | undefined;
  for (const raw of text.replace(/\r\n?/g, '\n').split('\n')) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      open = undefined;
      continue;
    }
    const bullet = BULLET.exec(line);
    const number = bullet ? null : NUMBER.exec(line);
    if (bullet || number) {
      const ordered = !!number;
      const item = parseInline((bullet ?? number)![1]);
      if (open?.kind === 'list' && open.ordered === ordered) open.items.push(item);
      else blocks.push((open = { kind: 'list', ordered, items: [item] }));
    } else if (open?.kind === 'paragraph') {
      open.lines.push(parseInline(line));
    } else {
      blocks.push((open = { kind: 'paragraph', lines: [parseInline(line)] }));
    }
  }
  return blocks;
};

/** The note as plain words, for one-line previews. */
export const stripNoteMarkup = (text: string): string =>
  text
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((line) => line.replace(BULLET, '$1').replace(NUMBER, '$1'))
    .join('\n')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/_(.+?)_/g, '$1');

/** Whether a note uses any markup at all: a plain note keeps its old, cheaper rendering. */
export const hasNoteMarkup = (text: string): boolean => /\*\*.+?\*\*|_.+?_|^[-*]\s+\S|^\d+[.)]\s+\S/m.test(text);

export interface Wrapped {
  text: string;
  /** Where the caret or selection ends up afterwards. */
  start: number;
  end: number;
}

/** Puts a marker around the selection, or takes it away again when it is already there. */
export const toggleWrap = (text: string, start: number, end: number, marker: string): Wrapped => {
  const n = marker.length;
  const selected = text.slice(start, end);
  if (selected.startsWith(marker) && selected.endsWith(marker) && selected.length >= 2 * n) {
    const inner = selected.slice(n, -n);
    return { text: text.slice(0, start) + inner + text.slice(end), start, end: start + inner.length };
  }
  if (text.slice(start - n, start) === marker && text.slice(end, end + n) === marker) {
    return { text: text.slice(0, start - n) + selected + text.slice(end + n), start: start - n, end: end - n };
  }
  return { text: text.slice(0, start) + marker + selected + marker + text.slice(end), start: start + n, end: end + n };
};

/** Starts every selected line with a bullet or a number, or takes the markers away when every line has one. */
export const toggleList = (text: string, start: number, end: number, ordered: boolean): Wrapped => {
  const from = text.lastIndexOf('\n', start - 1) + 1;
  const lineEnd = text.indexOf('\n', end);
  const to = lineEnd === -1 ? text.length : lineEnd;
  const lines = text.slice(from, to).split('\n');
  const pattern = ordered ? NUMBER : BULLET;
  const allMarked = lines.every((l) => pattern.test(l) || !l.trim());
  const next = lines.map((l, i) => {
    if (!l.trim()) return l;
    const bare = l.replace(BULLET, '$1').replace(NUMBER, '$1');
    return allMarked ? bare : ordered ? `${i + 1}. ${bare}` : `- ${bare}`;
  });
  const block = next.join('\n');
  return { text: text.slice(0, from) + block + text.slice(to), start: from, end: from + block.length };
};
