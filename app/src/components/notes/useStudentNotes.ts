import { useCallback, useEffect, useRef, useState } from 'react';
import { createNote, deleteNote, listNotes, patchNote, SignedOutError, type NoteDraft, type NotePatch, type TeacherNote } from './notesApi';

const UNDO_MS = 8000;

export interface ShownNote extends TeacherNote {
  /** What still has to reach the server after a failed save; the text stays on screen until then. */
  unsaved?: { create: NoteDraft } | { patch: NotePatch };
}

interface PendingDelete {
  note: ShownNote;
  timer: ReturnType<typeof setTimeout>;
}

const byPinnedThenNew = (a: ShownNote, b: ShownNote) => Number(b.pinned) - Number(a.pinned) || b.createdAt.localeCompare(a.createdAt);

const isLocal = (id: string) => id.startsWith('local-');

export const useStudentNotes = (studentId: string, onSignedOut: () => void) => {
  const [notes, setNotes] = useState<ShownNote[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'failed'>('loading');
  const [deleted, setDeleted] = useState<ShownNote>();
  const [deleteFailed, setDeleteFailed] = useState(false);
  const pending = useRef<PendingDelete>(undefined);
  const removedIds = useRef(new Set<string>());

  const handleError = useCallback(
    (e: unknown) => {
      if (e instanceof SignedOutError) onSignedOut();
    },
    [onSignedOut],
  );

  const load = useCallback(() => {
    // oxlint-disable-next-line react/set-state-in-effect
    setStatus('loading');
    listNotes(studentId)
      .then((list) => {
        // A slow answer is older than what is on screen: it must not bring back deleted notes or undo new work.
        setNotes((current) => [...current, ...list.filter((n) => !removedIds.current.has(n.id) && !current.some((c) => c.id === n.id))].sort(byPinnedThenNew));
        setStatus('ready');
      })
      .catch((e: unknown) => {
        handleError(e);
        setStatus('failed');
      });
  }, [studentId, handleError]);

  useEffect(load, [load]);

  const replace = (id: string, next: ShownNote) => setNotes((list) => list.map((n) => (n.id === id ? next : n)).sort(byPinnedThenNew));

  const saveNew = useCallback(
    (note: ShownNote, draft: NoteDraft) => {
      createNote(studentId, draft)
        .then((saved) => replace(note.id, saved))
        .catch((e: unknown) => {
          handleError(e);
          replace(note.id, { ...note, unsaved: { create: draft } });
        });
    },
    [studentId, handleError],
  );

  const add = useCallback(
    (draft: NoteDraft) => {
      const now = new Date().toISOString();
      const note: ShownNote = { ...draft, id: `local-${crypto.randomUUID()}`, studentId, pinned: false, createdAt: now, updatedAt: now };
      setNotes((list) => [...list, note].sort(byPinnedThenNew));
      saveNew(note, draft);
    },
    [studentId, saveNew],
  );

  const savePatch = useCallback(
    (note: ShownNote, patch: NotePatch) => {
      patchNote(note.id, patch)
        .then((saved) => replace(note.id, saved))
        .catch((e: unknown) => {
          handleError(e);
          replace(note.id, { ...note, unsaved: { patch } });
        });
    },
    [handleError],
  );

  const update = useCallback(
    (note: ShownNote, patch: NotePatch) => {
      const { moduleId, ...rest } = patch;
      const shown: ShownNote = { ...note, ...rest, ...(moduleId !== undefined ? { moduleId: moduleId ?? undefined } : {}) };
      if (isLocal(note.id)) {
        // Not on the server yet: the retry has to send the edited text, not the first one.
        replace(note.id, { ...shown, unsaved: { create: { text: shown.text, tag: shown.tag, moduleId: shown.moduleId } } });
        return;
      }
      replace(note.id, shown);
      savePatch(shown, note.unsaved && 'patch' in note.unsaved ? { ...note.unsaved.patch, ...patch } : patch);
    },
    [savePatch],
  );

  const retry = useCallback(
    (note: ShownNote) => {
      const { unsaved, ...clean } = note;
      if (!unsaved) return;
      replace(note.id, clean);
      if ('create' in unsaved) saveNew(clean, unsaved.create);
      else savePatch(clean, unsaved.patch);
    },
    [saveNew, savePatch],
  );

  const flushDelete = useCallback(() => {
    const current = pending.current;
    if (!current) return;
    clearTimeout(current.timer);
    pending.current = undefined;
    setDeleted(undefined);
    if (isLocal(current.note.id)) return;
    deleteNote(current.note.id).catch((e: unknown) => {
      handleError(e);
      removedIds.current.delete(current.note.id);
      setNotes((list) => [...list, current.note].sort(byPinnedThenNew));
      setDeleteFailed(true);
    });
  }, [handleError]);

  /** The request goes out only when the undo window closes, so undo needs no restore on the server. */
  const remove = useCallback(
    (note: ShownNote) => {
      flushDelete();
      setDeleteFailed(false);
      removedIds.current.add(note.id);
      setNotes((list) => list.filter((n) => n.id !== note.id));
      setDeleted(note);
      pending.current = { note, timer: setTimeout(flushDelete, UNDO_MS) };
    },
    [flushDelete],
  );

  const undoDelete = useCallback(() => {
    const current = pending.current;
    if (!current) return;
    clearTimeout(current.timer);
    pending.current = undefined;
    setDeleted(undefined);
    removedIds.current.delete(current.note.id);
    setNotes((list) => [...list, current.note].sort(byPinnedThenNew));
  }, []);

  // Leaving the page or the learner ends the undo window: the delete still has to happen.
  useEffect(() => {
    window.addEventListener('pagehide', flushDelete);
    return () => {
      window.removeEventListener('pagehide', flushDelete);
      flushDelete();
    };
  }, [flushDelete]);

  return { notes, status, deleted, deleteFailed, load, add, update, retry, remove, undoDelete };
};
