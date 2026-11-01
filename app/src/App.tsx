import { lazy, Suspense, useState, useEffect, useCallback, useMemo } from 'react';
import type { SectionType } from './types';
import { allModules } from './data/modulesData';
import { vocabularyTextsByModule } from './data/vocabularyTexts';
import { languageUseExercisesByModule } from './data/languageUseExercises';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ModuleHeader } from './components/ModuleHeader';
import { DashboardView } from './components/DashboardView';
import { TeacherDashboardView } from './components/TeacherDashboardView';
import { FlashcardsView } from './components/FlashcardsView';
import { DeckPage, DeckTabActions, FlashcardsHubView, ReviewSession } from './components/FlashcardsHubView';
import { FlashcardDialogProvider } from './components/FlashcardDialogProvider';
import { PictureDescriptionView } from './components/PictureDescriptionView';
import { GrammarSectionView } from './components/GrammarSectionView';
import { VocabularyView } from './components/VocabularyView';
import { LanguageUseView } from './components/language-use/LanguageUseView';
import { WritingTrainerView } from './components/WritingTrainerView';
import { GrammarHandbookModal } from './components/GrammarHandbookModal';
import { DesignSystemShowcase } from './components/DesignSystemShowcase';
import { TeacherAccess } from './components/TeacherAccess';
import { ChevronRight } from 'lucide-react';
import { useProgress } from './useProgress';
import { EXERCISE_PASS_SCORE } from './progress-context';
import { useUser } from './useUser';
import { useSettings } from './useSettings';
import { useTeacherSession } from './useTeacherSession';
import { useTeacherCards } from './useTeacherCards';
import { deckCounts, deckOf } from './decks';
import { findUser, students } from './users';
import { buildHash, splitUserHash } from './userRoute';

// Loaded only after the server confirmed the teacher: a learner's browser never receives this code.
const TeacherStudentPage = lazy(() => import('./components/notes/TeacherStudentPage'));
const TeacherClassPage = lazy(() => import('./components/notes/TeacherClassPage'));

const moduleSections: SectionType[] = ['opis-foto', 'gramatyka', 'slownictwo', 'srodki', 'pisanie', 'fiszki'];
/** Section shown when a module is opened without an explicit section (the first tab). */
const DEFAULT_SECTION: SectionType = moduleSections[0];
const standaloneSections: SectionType[] = ['dashboard', 'fiszki-hub', 'design-system'];
const validSections: SectionType[] = [...moduleSections, ...standaloneSections];
const DEFAULT_MODULE = allModules[0].id;

/** Old links: the test used to be its own tab, now it lives at the bottom of the grammar section. */
const legacySections: Record<string, SectionType> = { test: 'gramatyka' };

/** Second segment of #fiszki: the review across all decks. No module has this id. */
const REVIEW_ITEM = 'powtorka';
/** Item of a deck address: the deck opened on the cards from the teacher. */
const TEACHER_FILTER_ITEM = 'od-nauczyciela';

interface Route {
  moduleId: string;
  section: SectionType;
  /** Dashboard only: a learner's id when the teacher opens that learner's page. */
  viewUserId?: string;
  /** One item inside the section: a vocabulary text id, a grammar rule id, "test", an exercise id or a flashcard id. */
  item?: string;
  /** The deck was opened inside the Fiszki module, not from its topic. */
  fromHub?: boolean;
}

const isStandalone = (s: SectionType) => standaloneSections.includes(s);

/**
 * URL scheme: #<userId>/<moduleId>/<section>[/<item>], e.g. #maria/praca/opis-foto,
 * #maria/czlowiek/slownictwo/czl-txt-2 (one text), #maria/czlowiek/srodki/czl-sj-2 (one exercise), #maria/czlowiek/gramatyka/test.
 * The profile segment is handled by UserProvider; here we parse what follows it.
 * Also accepted: #<section> (default module), #<moduleId> (first tab), #design-system,
 * #dashboard/<studentId> (teacher looking at one learner, /fiszki opens their cards),
 * #fiszki (all decks), #fiszki/powtorka (review of all decks), #fiszki/<moduleId>[/<cardId>] (one deck).
 * A bare #<userId> or an empty hash opens the dashboard.
 */
/** Keeps the item only if it exists in that module's section; unknown items fall back to the whole section. */
const validItem = (moduleId: string, section: SectionType, item?: string): string | undefined => {
  if (!item) return undefined;
  if (section === 'slownictwo') return (vocabularyTextsByModule[moduleId] ?? []).some((t) => t.id === item) ? item : undefined;
  if (section === 'srodki') return (languageUseExercisesByModule[moduleId] ?? []).some((e) => e.id === item) ? item : undefined;
  if (section === 'gramatyka') {
    const module = allModules.find((m) => m.id === moduleId);
    return item === 'test' || module?.grammarRules.some((r) => r.id === item) ? item : undefined;
  }
  if (section === 'fiszki') {
    // Own and teacher's cards are not known here; FlashcardsView opens on the first card if the id is gone.
    const module = allModules.find((m) => m.id === moduleId);
    return item === TEACHER_FILTER_ITEM || /^[ut]-/.test(item) || module?.flashcards.some((c) => c.id === item) ? item : undefined;
  }
  return undefined;
};

const parseHash = (hash: string): Route => {
  const raw = splitUserHash(hash).rest;
  const [a, rawB, c] = raw.split('/');
  const b = rawB && legacySections[rawB] ? legacySections[rawB] : rawB;
  const isModule = (id: string) => allModules.some((m) => m.id === id);
  const isSection = (s: string): s is SectionType => validSections.includes(s as SectionType);

  if (!raw || a === 'dashboard') {
    const student = b && findUser(b)?.role === 'student' ? b : undefined;
    return { moduleId: DEFAULT_MODULE, section: 'dashboard', viewUserId: student, item: student && c === 'fiszki' ? c : undefined };
  }
  if (a === 'fiszki') {
    if (b === REVIEW_ITEM) return { moduleId: DEFAULT_MODULE, section: 'fiszki-hub', item: REVIEW_ITEM };
    if (b && isModule(b)) return { moduleId: b, section: 'fiszki', fromHub: true, item: validItem(b, 'fiszki', c) };
    return { moduleId: DEFAULT_MODULE, section: 'fiszki-hub' };
  }
  if (a === 'design-system') return { moduleId: DEFAULT_MODULE, section: 'design-system' };
  if (isModule(a)) {
    const section = b && isSection(b) && !isStandalone(b) ? b : DEFAULT_SECTION;
    return { moduleId: a, section, item: validItem(a, section, c) };
  }
  const a2 = legacySections[a] ?? a;
  if (isSection(a2)) return { moduleId: DEFAULT_MODULE, section: a2 };
  return { moduleId: DEFAULT_MODULE, section: 'dashboard' };
};

const toHash = (r: Route): string => {
  if (r.section === 'dashboard') return r.viewUserId ? `dashboard/${r.viewUserId}${r.item ? `/${r.item}` : ''}` : 'dashboard';
  if (r.section === 'fiszki-hub') return r.item ? `fiszki/${r.item}` : 'fiszki';
  if (r.fromHub) return r.item ? `fiszki/${r.moduleId}/${r.item}` : `fiszki/${r.moduleId}`;
  if (isStandalone(r.section)) return r.section;
  return r.item ? `${r.moduleId}/${r.section}/${r.item}` : `${r.moduleId}/${r.section}`;
};

export function App() {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [handbookOpen, setHandbookOpen] = useState(false);
  const { user } = useUser();
  const { t } = useSettings();
  const { state: progress, setCardStatus, saveTestResult, saveExerciseResult, touchModule } = useProgress();
  const isTeacher = user.role === 'teacher';
  const teacherSession = useTeacherSession(isTeacher);

  const { cardsOf, setLive } = useTeacherCards();

  const { moduleId: currentModuleId, section: activeSection } = route;
  const inFiszkiModule = activeSection === 'fiszki-hub' || !!route.fromHub;
  const inModulePage = !isStandalone(activeSection) && !route.fromHub;

  useEffect(() => {
    const onHashChange = (e: HashChangeEvent) => setRoute(parseHash(new URL(e.newURL).hash));
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Keep the address bar canonical (e.g. "#test" becomes "#maria/czlowiek/gramatyka"): every page of every
  // profile has its own shareable link.
  useEffect(() => {
    // Only the teacher can look at another learner's page; for a student the extra segment is dropped.
    const shown = isTeacher ? route : { ...route, viewUserId: undefined, item: route.section === 'dashboard' ? undefined : route.item };
    const canonical = '#' + buildHash(user.id, toHash(shown));
    if (window.location.hash !== canonical) window.history.replaceState(null, '', canonical);
  }, [route, user.id, isTeacher]);

  // Remember the module the learner worked in last, so the dashboard can offer "Kontynuuj".
  useEffect(() => {
    if (inModulePage && !isTeacher) touchModule(currentModuleId);
  }, [inModulePage, currentModuleId, touchModule, isTeacher]);

  // The learner's check for new cards runs only where a new card makes a difference.
  useEffect(() => {
    setLive(activeSection === 'slownictwo' || activeSection === 'fiszki' || activeSection === 'fiszki-hub');
  }, [activeSection, setLive]);

  const navigate = useCallback(
    (next: Route) => {
      setRoute(next);
      window.location.hash = buildHash(user.id, toHash(next));
    },
    [user.id],
  );

  const handleSectionChange = (section: SectionType) => navigate({ moduleId: currentModuleId, section });
  const handleModuleChange = (moduleId: string) => navigate({ moduleId, section: DEFAULT_SECTION });
  const handleOpenFromDashboard = (moduleId: string, section: SectionType) => navigate({ moduleId, section });
  const handleOpenDeck = (moduleId: string) => navigate({ moduleId, section: 'fiszki', fromHub: true });
  const handleOpenReview = () => navigate({ moduleId: DEFAULT_MODULE, section: 'fiszki-hub', item: REVIEW_ITEM });
  const handleOpenHub = () => navigate({ moduleId: DEFAULT_MODULE, section: 'fiszki-hub' });
  const handleOpenStudent = (userId: string) => navigate({ moduleId: DEFAULT_MODULE, section: 'dashboard', viewUserId: userId });
  const handleBackToClass = () => navigate({ moduleId: DEFAULT_MODULE, section: 'dashboard' });

  const currentModule = allModules.find((m) => m.id === currentModuleId) || allModules[0];
  const currentProgress = progress.modules[currentModule.id];

  const decks = useMemo(() => {
    const teacherCards = cardsOf(user.id);
    return Object.fromEntries(allModules.map((m) => [m.id, deckOf(m, progress, teacherCards)]));
  }, [progress, cardsOf, user.id]);
  const currentDeck = decks[currentModule.id];

  // Sidebar counters: only ids that still exist in the deck, in case data changed between sessions.
  const { masteredCardsMap, deckSizeMap, reviewCount } = useMemo(() => {
    const mastered: Record<string, number> = {};
    const sizes: Record<string, number> = {};
    let review = 0;
    for (const m of allModules) {
      const counts = deckCounts(decks[m.id], progress.modules[m.id]);
      mastered[m.id] = counts.mastered;
      sizes[m.id] = decks[m.id].length;
      review += counts.review;
    }
    return { masteredCardsMap: mastered, deckSizeMap: sizes, reviewCount: review };
  }, [decks, progress]);

  const testScoresMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const m of allModules) {
      const best = progress.modules[m.id]?.test?.best;
      if (best !== undefined) map[m.id] = best;
    }
    return map;
  }, [progress]);

  const handleScoreSave = (score: number) => saveTestResult(currentModule.id, score);

  const currentExercises = languageUseExercisesByModule[currentModule.id] ?? [];
  const exercisesPassed = currentExercises.filter((e) => (currentProgress?.exercises?.[e.id]?.best ?? 0) >= EXERCISE_PASS_SCORE).length;

  const masteredIds = useMemo(() => new Set(currentProgress?.mastered ?? []), [currentProgress]);
  const reviewIds = useMemo(() => new Set(currentProgress?.review ?? []), [currentProgress]);

  // Which dashboard to show: the teacher sees the class, or one learner when the URL names one.
  const viewedStudent = isTeacher && route.viewUserId ? findUser(route.viewUserId) : undefined;
  const teacherAccess = <TeacherAccess session={teacherSession} />;
  const studentForTeacher = viewedStudent && (
    <DashboardView modules={allModules} user={viewedStudent} teacherView onOpen={handleOpenFromDashboard} onOpenDeck={handleOpenDeck} onBackToClass={handleBackToClass} headerAction={teacherAccess} />
  );
  const classForTeacher = <TeacherDashboardView modules={allModules} students={students} onOpenStudent={handleOpenStudent} headerAction={teacherAccess} />;
  const dashboard =
    activeSection !== 'dashboard' ? null : isTeacher ? (
      viewedStudent ? (
        teacherSession.signedIn ? (
          <Suspense fallback={studentForTeacher}>
            <TeacherStudentPage
              key={`${viewedStudent.id}-${route.item ?? ''}`}
              modules={allModules}
              student={viewedStudent}
              initialTab={route.item ? 'cards' : undefined}
              headerAction={teacherAccess}
              onOpen={handleOpenFromDashboard}
              onOpenDeck={handleOpenDeck}
              onBackToClass={handleBackToClass}
              onSignedOut={teacherSession.markSignedOut}
            />
          </Suspense>
        ) : (
          studentForTeacher
        )
      ) : teacherSession.signedIn ? (
        <Suspense fallback={classForTeacher}>
          <TeacherClassPage modules={allModules} students={students} headerAction={teacherAccess} onOpenStudent={handleOpenStudent} onSignedOut={teacherSession.markSignedOut} />
        </Suspense>
      ) : (
        classForTeacher
      )
    ) : (
      <DashboardView modules={allModules} user={user} onOpen={handleOpenFromDashboard} onOpenDeck={handleOpenDeck} onOpenReview={handleOpenReview} />
    );

  const deckView = (
    <FlashcardsView
      key={`${currentModule.id}-${route.item === TEACHER_FILTER_ITEM}`}
      cards={currentDeck}
      moduleTitle={currentModule.titlePl}
      moduleId={currentModule.id}
      masteredIds={masteredIds}
      reviewIds={reviewIds}
      focusCardId={route.item === TEACHER_FILTER_ITEM ? undefined : route.item}
      initialFilter={route.item === TEACHER_FILTER_ITEM ? 'teacher' : undefined}
      hideTitle={route.fromHub}
      onCardStatus={(cardId, status) => setCardStatus(currentModule.id, cardId, status)}
    />
  );

  return (
    <FlashcardDialogProvider signIn={teacherAccess} onSignedOut={teacherSession.markSignedOut}>
    <div className="flex min-h-screen flex-col bg-surface font-sans text-ink antialiased">
      <Navbar
        activeSection={activeSection}
        onOpenHandbook={() => setHandbookOpen(true)}
        onOpenSidebar={() => setSidebarOpen(true)}
        onSectionChange={handleSectionChange}
      />

      <div className="mx-auto flex w-full max-w-7xl flex-1">
        <Sidebar
          modules={allModules}
          currentModuleId={activeSection === 'dashboard' || inFiszkiModule ? null : currentModuleId}
          masteredCardsMap={masteredCardsMap}
          deckSizeMap={deckSizeMap}
          reviewCount={reviewCount}
          fiszkiActive={inFiszkiModule}
          testScoresMap={testScoresMap}
          showProgress={!isTeacher}
          dashboardLabel={isTeacher ? t('side.teacherPanel') : t('side.myProgress')}
          onSelectModule={handleModuleChange}
          onSelectDashboard={handleBackToClass}
          onSelectFiszki={handleOpenHub}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="w-full min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          {activeSection === 'design-system' && (
            <nav className="mb-6 flex items-center gap-1.5 text-sm text-ink-2" aria-label={t('misc.path')}>
              <a href={`#${buildHash(user.id, 'dashboard')}`} className="hover:text-primary hover:underline">
                {isTeacher ? t('side.teacherPanel') : t('nav.progress')}
              </a>
              <ChevronRight className="h-3.5 w-3.5" />
              <span>{t('misc.settings')}</span>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="font-semibold text-ink">{t('nav.designSystem')}</span>
            </nav>
          )}

          {inModulePage && (
            <ModuleHeader
              module={currentModule}
              activeSection={activeSection}
              onSectionChange={handleSectionChange}
              shareRest={toHash({ moduleId: currentModule.id, section: activeSection })}
              deckSize={currentDeck.length}
              masteredCardsCount={masteredCardsMap[currentModule.id] || 0}
              testScore={testScoresMap[currentModule.id] ?? null}
              exercisesTotal={currentExercises.length}
              exercisesPassed={exercisesPassed}
            />
          )}

          {dashboard}

          {activeSection === 'fiszki-hub' && (route.item === REVIEW_ITEM ? <ReviewSession modules={allModules} /> : <FlashcardsHubView modules={allModules} />)}

          {activeSection === 'fiszki' &&
            (route.fromHub ? (
              <DeckPage module={currentModule} cards={currentDeck}>
                {deckView}
              </DeckPage>
            ) : (
              <>
                <DeckTabActions moduleId={currentModule.id} />
                {deckView}
              </>
            ))}

          {activeSection === 'opis-foto' && (
            <PictureDescriptionView key={currentModule.id} moduleId={currentModule.id} data={currentModule.pictureDescription} moduleTitle={currentModule.titlePl} />
          )}

          {activeSection === 'gramatyka' && (
            <GrammarSectionView
              key={currentModule.id}
              moduleId={currentModule.id}
              focusId={route.item}
              rules={currentModule.grammarRules}
              questions={currentModule.testQuestions}
              moduleTitle={currentModule.titlePl}
              onScoreSave={handleScoreSave}
            />
          )}

          {activeSection === 'slownictwo' && (
            <VocabularyView
              key={currentModule.id}
              moduleId={currentModule.id}
              textId={route.item}
              texts={vocabularyTextsByModule[currentModule.id] ?? []}
              vocabulary={currentModule.vocabularyList}
              moduleTitle={currentModule.titlePl}
              teacherSignedIn={isTeacher && !!teacherSession.signedIn}
            />
          )}

          {activeSection === 'srodki' && (
            <LanguageUseView
              key={currentModule.id}
              moduleId={currentModule.id}
              exercises={currentExercises}
              exerciseId={route.item}
              moduleTitle={currentModule.titlePl}
              results={currentProgress?.exercises}
              onResult={(exerciseId, score) => saveExerciseResult(currentModule.id, exerciseId, score)}
            />
          )}

          {activeSection === 'pisanie' && (
            <WritingTrainerView key={currentModule.id} moduleId={currentModule.id} prompt={currentModule.writingPrompt} moduleTitle={currentModule.titlePl} />
          )}

          {activeSection === 'design-system' && <DesignSystemShowcase />}
        </main>
      </div>

      <GrammarHandbookModal isOpen={handbookOpen} onClose={() => setHandbookOpen(false)} />
    </div>
    </FlashcardDialogProvider>
  );
}

export default App;
