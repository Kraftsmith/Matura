import { describe, expect, it } from 'vitest';
import { hasNoteMarkup, parseInline, parseNote, stripNoteMarkup, toggleList, toggleWrap } from './noteMarkup';

describe('parseInline', () => {
  it('finds bold and italic in order', () => {
    expect(parseInline('a **b** c _d_')).toEqual([
      { kind: 'text', text: 'a ' },
      { kind: 'bold', children: [{ kind: 'text', text: 'b' }] },
      { kind: 'text', text: ' c ' },
      { kind: 'italic', children: [{ kind: 'text', text: 'd' }] },
    ]);
  });

  it('nests italic inside bold', () => {
    expect(parseInline('**a _b_**')).toEqual([{ kind: 'bold', children: [{ kind: 'text', text: 'a ' }, { kind: 'italic', children: [{ kind: 'text', text: 'b' }] }] }]);
  });

  it('leaves a lone marker alone', () => {
    expect(parseInline('snake_case and 2*3')).toEqual([{ kind: 'text', text: 'snake_case and 2*3' }]);
  });
});

describe('parseNote', () => {
  it('groups list lines and separates paragraphs by blank lines', () => {
    const blocks = parseNote('Intro\nsecond line\n\n- one\n- two\n1. first\n2) second\n\n\nOutro');
    expect(blocks.map((b) => b.kind)).toEqual(['paragraph', 'list', 'list', 'paragraph']);
    expect(blocks[0]).toMatchObject({ lines: [[{ kind: 'text', text: 'Intro' }], [{ kind: 'text', text: 'second line' }]] });
    expect(blocks[1]).toMatchObject({ ordered: false, items: [[{ kind: 'text', text: 'one' }], [{ kind: 'text', text: 'two' }]] });
    expect(blocks[2]).toMatchObject({ ordered: true });
  });

  it('gives nothing for an empty note', () => {
    expect(parseNote('\n\n')).toEqual([]);
  });
});

describe('stripNoteMarkup / hasNoteMarkup', () => {
  it('strips markers for previews', () => {
    expect(stripNoteMarkup('- **Past Simple**: _ok_\n2. done')).toBe('Past Simple: ok\ndone');
  });

  it('tells plain notes from marked ones', () => {
    expect(hasNoteMarkup('plain text, 2 * 3')).toBe(false);
    expect(hasNoteMarkup('- a list')).toBe(true);
    expect(hasNoteMarkup('a **word**')).toBe(true);
  });
});

describe('toggleWrap', () => {
  it('wraps, then unwraps, a selection', () => {
    const on = toggleWrap('say hello now', 4, 9, '**');
    expect(on).toEqual({ text: 'say **hello** now', start: 6, end: 11 });
    expect(toggleWrap(on.text, on.start, on.end, '**')).toEqual({ text: 'say hello now', start: 4, end: 9 });
  });

  it('unwraps when the markers are inside the selection', () => {
    expect(toggleWrap('a _b_ c', 2, 5, '_')).toEqual({ text: 'a b c', start: 2, end: 3 });
  });

  it('inserts an empty pair at the caret', () => {
    expect(toggleWrap('ab', 1, 1, '_')).toEqual({ text: 'a__b', start: 2, end: 2 });
  });
});

describe('toggleList', () => {
  it('marks every selected line and numbers them from one', () => {
    expect(toggleList('a\nb\nc', 2, 3, true).text).toBe('a\n1. b\nc');
    expect(toggleList('a\nb\nc', 0, 5, false).text).toBe('- a\n- b\n- c');
  });

  it('removes markers when every selected line has one, and swaps bullets for numbers', () => {
    expect(toggleList('- a\n- b', 0, 7, false).text).toBe('a\nb');
    expect(toggleList('- a\n- b', 0, 7, true).text).toBe('1. a\n2. b');
  });
});
