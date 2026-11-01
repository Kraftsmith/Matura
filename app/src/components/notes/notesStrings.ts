import { useCallback } from 'react';
import { format, type UiLang } from '../../i18n';
import { useSettings } from '../../useSettings';
import type { NoteTag } from './notesApi';

/**
 * Kept out of i18n.ts on purpose: that file ships to every learner, this one only reaches the teacher's
 * browser, in the lazy chunk loaded after sign-in.
 */
const pl = {
  'notes.tabProgress': 'Postępy',
  'notes.tabNotes': 'Notatki',
  'notes.tabsLabel': 'Widok ucznia',
  'notes.private': 'Widoczne tylko dla Ciebie. Uczeń nie widzi tych notatek.',
  'notes.hide': 'Ukryj notatki',
  'notes.show': 'Pokaż notatki',
  'notes.placeholder': 'Co warto zapamiętać o {name}?',
  'notes.newLabel': 'Nowa notatka',
  'notes.topic': 'Temat',
  'notes.noTopic': 'Bez tematu',
  'notes.add': 'Dodaj notatkę',
  'notes.all': 'Wszystkie',
  'notes.search': 'Szukaj w notatkach',
  'notes.filters': 'Filtruj notatki',
  'notes.tagLabel': 'Kategoria',
  'notes.empty': 'Brak notatek o {name}. Zapisz pierwszą obserwację, np. typowe błędy albo zadanie domowe.',
  'notes.noMatches': 'Żadna notatka nie pasuje do filtrów.',
  'notes.clearFilters': 'Wyczyść filtry',
  'notes.loading': 'Wczytywanie notatek…',
  'notes.loadFailed': 'Nie udało się wczytać notatek.',
  'notes.retry': 'Spróbuj ponownie',
  'notes.notSaved': 'Nie zapisano',
  'notes.more': 'Pokaż więcej',
  'notes.less': 'Pokaż mniej',
  'notes.edited': 'edytowano',
  'notes.pin': 'Przypnij',
  'notes.unpin': 'Odepnij',
  'notes.edit': 'Edytuj',
  'notes.delete': 'Usuń',
  'notes.save': 'Zapisz',
  'notes.cancel': 'Anuluj',
  'notes.deleted': 'Notatka usunięta',
  'notes.deleteFailed': 'Nie udało się usunąć notatki.',
  'notes.undo': 'Cofnij',
  'notes.resetKeeps': 'Notatki nauczyciela zostaną zachowane.',
  'notes.topicBadge': 'Notatki do tematu: {n}',
  'notes.card': 'Notatki: {n} · ostatnia {when}',
  'notes.cardNone': 'Notatki: brak',
  'tag.general': 'Ogólne',
  'tag.mistakes': 'Typowe błędy',
  'tag.homework': 'Zadanie domowe',
  'tag.lesson': 'Z lekcji',
  'tag.parents': 'Rodzice',
};

type NotesKey = keyof typeof pl;

const en: Record<NotesKey, string> = {
  'notes.tabProgress': 'Progress',
  'notes.tabNotes': 'Notes',
  'notes.tabsLabel': 'Student view',
  'notes.private': 'Visible only to you. The student cannot see these notes.',
  'notes.hide': 'Hide notes',
  'notes.show': 'Show notes',
  'notes.placeholder': 'What is worth remembering about {name}?',
  'notes.newLabel': 'New note',
  'notes.topic': 'Topic',
  'notes.noTopic': 'No topic',
  'notes.add': 'Add note',
  'notes.all': 'All',
  'notes.search': 'Search notes',
  'notes.filters': 'Filter notes',
  'notes.tagLabel': 'Category',
  'notes.empty': 'No notes about {name} yet. Save a first observation, e.g. common mistakes or homework.',
  'notes.noMatches': 'No notes match the filters.',
  'notes.clearFilters': 'Clear filters',
  'notes.loading': 'Loading notes…',
  'notes.loadFailed': 'Could not load the notes.',
  'notes.retry': 'Try again',
  'notes.notSaved': 'Not saved',
  'notes.more': 'Show more',
  'notes.less': 'Show less',
  'notes.edited': 'edited',
  'notes.pin': 'Pin',
  'notes.unpin': 'Unpin',
  'notes.edit': 'Edit',
  'notes.delete': 'Delete',
  'notes.save': 'Save',
  'notes.cancel': 'Cancel',
  'notes.deleted': 'Note deleted',
  'notes.deleteFailed': 'Could not delete the note.',
  'notes.undo': 'Undo',
  'notes.resetKeeps': 'Teacher notes will be kept.',
  'notes.topicBadge': 'Notes for this topic: {n}',
  'notes.card': 'Notes: {n} · latest {when}',
  'notes.cardNone': 'Notes: none',
  'tag.general': 'General',
  'tag.mistakes': 'Common mistakes',
  'tag.homework': 'Homework',
  'tag.lesson': 'From the lesson',
  'tag.parents': 'Parents',
};

const dictionaries: Record<UiLang, Record<NotesKey, string>> = { pl, en };

export const tagKey = (tag: NoteTag): NotesKey => `tag.${tag}`;

export const useNotesStrings = () => {
  const { uiLang } = useSettings();
  return useCallback((key: NotesKey, vars?: Record<string, string | number>) => format(dictionaries[uiLang][key], vars), [uiLang]);
};
