import React, { useMemo, useState } from 'react';
import { Lock, Pencil, Pin, PinOff, Search, Trash2 } from 'lucide-react';
import type { MaturaModule } from '../../types';
import { Button, Chip, TextArea, TextField, fieldClass } from '../ui';
import { useSettings } from '../../useSettings';
import { formatRelative } from '../../progressSummary';
import { NOTE_TAGS, type NoteTag } from './notesApi';
import { tagKey, useNotesStrings } from './notesStrings';
import type { ShownNote, useStudentNotes } from './useStudentNotes';

/** Grows with the text up to 12 lines, as far as the browser supports it. */
const growing: React.CSSProperties = { fieldSizing: 'content', maxHeight: '19rem' } as React.CSSProperties;
const LONG_NOTE_CHARS = 320;
const LONG_NOTE_LINES = 5;

const TagPicker: React.FC<{ value: NoteTag; onChange: (tag: NoteTag) => void }> = ({ value, onChange }) => {
  const nt = useNotesStrings();
  return (
    <div role="group" aria-label={nt('notes.tagLabel')} className="flex flex-wrap gap-2">
      {NOTE_TAGS.map((tag) => (
        <button key={tag} type="button" aria-pressed={tag === value} onClick={() => onChange(tag)} className="cursor-pointer rounded-full">
          <Chip tone={tag === value ? 'primary' : 'neutral'}>{nt(tagKey(tag))}</Chip>
        </button>
      ))}
    </div>
  );
};

const TopicSelect: React.FC<{ modules: MaturaModule[]; value: string; onChange: (id: string) => void }> = ({ modules, value, onChange }) => {
  const nt = useNotesStrings();
  return (
    <select aria-label={nt('notes.topic')} value={value} onChange={(e) => onChange(e.target.value)} className={fieldClass}>
      <option value="">{nt('notes.noTopic')}</option>
      {modules.map((m) => (
        <option key={m.id} value={m.id}>
          {m.number}. {m.titlePl}
        </option>
      ))}
    </select>
  );
};

const draftKey = (studentId: string) => `matura.noteDraft.${studentId}`;

const readDraft = (studentId: string): string => {
  try {
    return window.localStorage.getItem(draftKey(studentId)) ?? '';
  } catch {
    return '';
  }
};

const writeDraft = (studentId: string, text: string) => {
  try {
    if (text) window.localStorage.setItem(draftKey(studentId), text);
    else window.localStorage.removeItem(draftKey(studentId));
  } catch {
    /* storage unavailable: the draft just does not survive a reload */
  }
};

const NewNote: React.FC<{ studentId: string; studentName: string; modules: MaturaModule[]; initialModule: string; onAdd: ReturnType<typeof useStudentNotes>['add'] }> = ({
  studentId,
  studentName,
  modules,
  initialModule,
  onAdd,
}) => {
  const nt = useNotesStrings();
  const [text, setText] = useState(() => readDraft(studentId));
  const [tag, setTag] = useState<NoteTag>('general');
  const [moduleId, setModuleId] = useState(initialModule);

  const change = (value: string) => {
    setText(value);
    writeDraft(studentId, value);
  };

  const submit = () => {
    if (!text.trim()) return;
    onAdd({ text: text.trim(), tag, moduleId: moduleId || undefined });
    change('');
    setTag('general');
    setModuleId(initialModule);
  };

  return (
    <div className="grid gap-3 rounded-2xl border border-line bg-surface p-5">
      <TextArea
        label={nt('notes.newLabel')}
        placeholder={nt('notes.placeholder', { name: studentName })}
        rows={3}
        maxLength={5000}
        style={growing}
        value={text}
        onChange={(e) => change(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && e.ctrlKey) submit();
        }}
      />
      <TagPicker value={tag} onChange={setTag} />
      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-48 flex-1">
          <TopicSelect modules={modules} value={moduleId} onChange={setModuleId} />
        </div>
        <Button disabled={!text.trim()} onClick={submit}>
          {nt('notes.add')}
        </Button>
      </div>
    </div>
  );
};

const NoteCard: React.FC<{ note: ShownNote; modules: MaturaModule[]; actions: ReturnType<typeof useStudentNotes> }> = ({ note, modules, actions }) => {
  const nt = useNotesStrings();
  const { t, uiLang } = useSettings();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(note.text);
  const [draftTag, setDraftTag] = useState(note.tag);
  const [draftModule, setDraftModule] = useState(note.moduleId ?? '');
  const [expanded, setExpanded] = useState(false);
  const locale = uiLang === 'en' ? 'en-GB' : 'pl-PL';
  const module = modules.find((m) => m.id === note.moduleId);
  const long = note.text.length > LONG_NOTE_CHARS || note.text.split('\n').length > LONG_NOTE_LINES;
  const notOnServer = note.id.startsWith('local-');
  const saving = notOnServer && !note.unsaved;

  const startEdit = () => {
    setDraft(note.text);
    setDraftTag(note.tag);
    setDraftModule(note.moduleId ?? '');
    setEditing(true);
  };

  const saveEdit = () => {
    if (!draft.trim()) return;
    actions.update(note, { text: draft.trim(), tag: draftTag, moduleId: draftModule || null });
    setEditing(false);
  };

  if (editing) {
    return (
      <article className="grid gap-3 rounded-2xl border border-primary bg-surface p-5">
        <TextArea aria-label={nt('notes.edit')} rows={3} maxLength={5000} style={growing} value={draft} onChange={(e) => setDraft(e.target.value)} />
        <TagPicker value={draftTag} onChange={setDraftTag} />
        <TopicSelect modules={modules} value={draftModule} onChange={setDraftModule} />
        <div className="flex flex-wrap gap-2">
          <Button size="sm" disabled={!draft.trim()} onClick={saveEdit}>
            {nt('notes.save')}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
            {nt('notes.cancel')}
          </Button>
        </div>
      </article>
    );
  }

  return (
    <article className={`grid gap-3 rounded-2xl border bg-surface p-5 ${note.unsaved ? 'border-error' : 'border-line'}`}>
      <p className={`text-base leading-6 break-words whitespace-pre-wrap text-ink ${long && !expanded ? 'line-clamp-6' : ''}`}>{note.text}</p>
      {long && (
        <button type="button" onClick={() => setExpanded(!expanded)} className="cursor-pointer justify-self-start text-sm leading-5 font-semibold text-primary hover:underline">
          {expanded ? nt('notes.less') : nt('notes.more')}
        </button>
      )}
      {note.unsaved && (
        <p role="alert" className="flex flex-wrap items-center gap-2 text-sm leading-5 font-semibold text-error">
          {nt('notes.notSaved')}
          <button type="button" onClick={() => actions.retry(note)} className="cursor-pointer text-primary hover:underline">
            {nt('notes.retry')}
          </button>
        </p>
      )}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 flex-wrap items-center gap-2 text-sm leading-5 text-ink-2">
          {note.pinned && <Pin className="h-4 w-4 text-primary" aria-label={nt('notes.unpin')} />}
          <Chip size="sm">{nt(tagKey(note.tag))}</Chip>
          {module && <span>{module.titlePl}</span>}
          <span title={new Date(note.createdAt).toLocaleString(locale)}>{formatRelative(note.createdAt, t, locale)}</span>
          {note.updatedAt !== note.createdAt && <span>· {nt('notes.edited')}</span>}
        </div>
        <div className="flex gap-1">
          {!notOnServer && (
            <Button variant="ghost" size="icon" aria-label={note.pinned ? nt('notes.unpin') : nt('notes.pin')} title={note.pinned ? nt('notes.unpin') : nt('notes.pin')} onClick={() => actions.update(note, { pinned: !note.pinned })}>
              {note.pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
            </Button>
          )}
          <Button variant="ghost" size="icon" disabled={saving} aria-label={nt('notes.edit')} title={nt('notes.edit')} onClick={startEdit}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" disabled={saving} aria-label={nt('notes.delete')} title={nt('notes.delete')} onClick={() => actions.remove(note)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </article>
  );
};

interface TeacherNotesPanelProps {
  studentId: string;
  studentName: string;
  modules: MaturaModule[];
  notesState: ReturnType<typeof useStudentNotes>;
  moduleFilter: string;
  onModuleFilter: (id: string) => void;
}

export const TeacherNotesPanel: React.FC<TeacherNotesPanelProps> = ({ studentId, studentName, modules, notesState, moduleFilter, onModuleFilter }) => {
  const nt = useNotesStrings();
  const [tagFilter, setTagFilter] = useState<NoteTag | 'all'>('all');
  const [query, setQuery] = useState('');
  const { notes, status, load } = notesState;

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return notes.filter((n) => (tagFilter === 'all' || n.tag === tagFilter) && (!moduleFilter || n.moduleId === moduleFilter) && (!q || n.text.toLowerCase().includes(q)));
  }, [notes, tagFilter, moduleFilter, query]);

  const filtered = tagFilter !== 'all' || !!moduleFilter || !!query.trim();
  const clearFilters = () => {
    setTagFilter('all');
    setQuery('');
    onModuleFilter('');
  };

  return (
    <div className="grid gap-4">
      <p className="flex items-center gap-2 rounded-lg bg-primary-tint px-4 py-3 text-sm leading-5 text-ink">
        <Lock className="h-4 w-4 shrink-0 text-primary" />
        {nt('notes.private')}
      </p>

      <NewNote key={`${studentId}/${moduleFilter}`} studentId={studentId} studentName={studentName} modules={modules} initialModule={moduleFilter} onAdd={notesState.add} />

      {notes.length > 0 && (
        <div className="grid gap-3" role="group" aria-label={nt('notes.filters')}>
          <div className="flex flex-wrap gap-2">
            {(['all', ...NOTE_TAGS] as const).map((tag) => (
              <button key={tag} type="button" aria-pressed={tag === tagFilter} onClick={() => setTagFilter(tag)} className="cursor-pointer rounded-full">
                <Chip tone={tag === tagFilter ? 'primary' : 'neutral'}>{tag === 'all' ? nt('notes.all') : nt(tagKey(tag))}</Chip>
              </button>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <TextField aria-label={nt('notes.search')} placeholder={nt('notes.search')} leadingIcon={<Search />} value={query} onChange={(e) => setQuery(e.target.value)} />
            <TopicSelect modules={modules} value={moduleFilter} onChange={onModuleFilter} />
          </div>
        </div>
      )}

      {status === 'loading' && <p className="text-base leading-6 text-ink-2">{nt('notes.loading')}</p>}

      {status === 'failed' && (
        <p role="alert" className="flex flex-wrap items-center gap-3 text-base leading-6 text-error">
          {nt('notes.loadFailed')}
          <Button size="sm" variant="secondary" onClick={load}>
            {nt('notes.retry')}
          </Button>
        </p>
      )}

      {status === 'ready' && notes.length === 0 && <p className="text-base leading-6 text-ink-2">{nt('notes.empty', { name: studentName })}</p>}

      {status === 'ready' && notes.length > 0 && shown.length === 0 && filtered && (
        <p className="flex flex-wrap items-center gap-3 text-base leading-6 text-ink-2">
          {nt('notes.noMatches')}
          <Button size="sm" variant="ghost" onClick={clearFilters}>
            {nt('notes.clearFilters')}
          </Button>
        </p>
      )}

      {shown.map((note) => (
        <NoteCard key={note.id} note={note} modules={modules} actions={notesState} />
      ))}
    </div>
  );
};
