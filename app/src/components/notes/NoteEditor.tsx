import React, { useRef } from 'react';
import { Bold, Italic, List, ListOrdered } from 'lucide-react';
import { Button, TextArea, type TextAreaProps } from '../ui';
import { toggleList, toggleWrap, type Wrapped } from './noteMarkup';
import { useNotesStrings } from './notesStrings';

interface NoteEditorProps extends Omit<TextAreaProps, 'value' | 'onChange'> {
  value: string;
  onChange: (value: string) => void;
}

/**
 * The note textarea with a small formatting bar above it. The buttons wrap the selection in the note markup
 * (see noteMarkup.ts); Ctrl+B and Ctrl+I do the same from the keyboard, Ctrl+Enter is left to the caller.
 */
export const NoteEditor: React.FC<NoteEditorProps> = ({ value, onChange, onKeyDown, label, ...rest }) => {
  const nt = useNotesStrings();
  const area = useRef<HTMLTextAreaElement>(null);

  const apply = (change: (text: string, start: number, end: number) => Wrapped) => {
    const el = area.current;
    if (!el) return;
    const next = change(value, el.selectionStart, el.selectionEnd);
    onChange(next.text);
    // The new value reaches the textarea on the next render; the selection has to wait for it.
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(next.start, next.end);
    });
  };

  type Change = (text: string, start: number, end: number) => Wrapped;
  const bold: Change = (t, s, e) => toggleWrap(t, s, e, '**');
  const italic: Change = (t, s, e) => toggleWrap(t, s, e, '_');
  const bullets: Change = (t, s, e) => toggleList(t, s, e, false);
  const numbers: Change = (t, s, e) => toggleList(t, s, e, true);

  const keyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey && (e.key === 'b' || e.key === 'i')) {
      e.preventDefault();
      apply(e.key === 'b' ? bold : italic);
      return;
    }
    onKeyDown?.(e);
  };

  // Mousedown would move the focus to the button and lose the selection.
  const keepSelection = (e: React.MouseEvent) => e.preventDefault();

  const tool = (label: string, icon: React.ReactNode, change: Change) => (
    <Button size="icon" variant="ghost" aria-label={label} title={label} onMouseDown={keepSelection} onClick={() => apply(change)}>
      {icon}
    </Button>
  );

  return (
    <div className="grid gap-1.5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        {label ? <span className="text-base font-semibold text-ink">{label}</span> : <span />}
        <div role="toolbar" aria-label={nt('notes.formatting')} className="flex gap-0.5">
          {tool(nt('notes.bold'), <Bold className="h-4 w-4" />, bold)}
          {tool(nt('notes.italic'), <Italic className="h-4 w-4" />, italic)}
          {tool(nt('notes.bullets'), <List className="h-4 w-4" />, bullets)}
          {tool(nt('notes.numbers'), <ListOrdered className="h-4 w-4" />, numbers)}
        </div>
      </div>
      <TextArea ref={area} aria-label={typeof label === 'string' ? label : undefined} value={value} onChange={(e) => onChange(e.target.value)} onKeyDown={keyDown} {...rest} />
    </div>
  );
};
