import { lazy, Suspense, useState, useEffect, useCallback, useMemo } from 'react';
import type { SectionType } from './types';
import { allModules } from './data/modulesData';
import { vocabularyTextsByModule } from './data/vocabularyTexts';
import { languageUseExercisesByModule } from './data/languageUseExercises';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ModuleHeader } from './components/ModuleHeader';
import { DashboardView } from './components/DashboardView';
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
import { ProfilePage } from './components/ProfilePage';
import { HomeworkBanner } from './components/schedule/HomeworkBanner';
import { ChevronRight } from 'lucide-react';
import { useProgress } from './useProgress';
import { EXERCISE_PASS_SCORE } from './progress-context';
import { useUser } from './useUser';
import { useSettings } from './useSettings';
import { useSchedule } from './useSchedule';
import { useTeacherCards } from './useTeacherCards';
import { deckCounts, deckOf } from './decks';
import { myHomeworkProgress } from './homework';
import { useNow } from './useNow';
import { DEFAULT_MODULE, DEFAULT_SECTION, REVIEW_ITEM, TEACHER_FILTER_ITEM, isStandalone, pageTargets, parseHash, toHash, type Route } from './routing';

// Loaded only for the role the server gave: a learner's browser never receives this code.
const TeacherStudentPage = lazy(() => import('./components/notes/TeacherStudentPage'));
const TeacherClassPage = lazy(() => import('./components/notes/TeacherClassPage'));
const CalendarPage = lazy(() => import('./components/schedule/CalendarPage'));
const StudentLessonsPage = lazy(() => import('./components/schedule/StudentLessonsPage'));

export function App() {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [handbookOpen, setHandbookOpen] = useState(false);
  const { user, students, classLoaded, markSignedOut } = useUser();
  const { t } = useSettings();
  const { state: progress, setCardStatus, saveTestResult, saveExerciseResult, touchModule } = useProgress();
  const schedule = useSchedule();
  const now = useNow();
  const isTeacher = user.role === 'teacher';

  const { cardsOf, setLive } = useTeacherCards();

  const { moduleId: currentModuleId, section: activeSection } = route;
  const inFiszkiModule = activeSection === 'fiszki-hub' || !!route.fromHub;
  const inModulePage = !isStandalone(activeSection) && !route.fromHub;

  useEffect(() => {
    const onHashChange = (e: HashChangeEvent) => setRoute(parseHash(new URL(e.newURL).hash));
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = useCallback((next: Route) => {
    setRoute(next);
    window.location.hash = toHash(next);
  }, []);

  // Keep the address bar canonical (e.g. "#test" becomes "#czlowiek/gramatyka"): every page has its own shareable link.
  useEffect(() => {
    // Only the teacher can look at another learner's page; for a student the extra segment is dropped.
    const shown = isTeacher ? route : { ...route, viewUserId: undefined, item: route.section === 'dashboard' ? undefined : route.item };
    const canonical = `#${toHash(shown)}`;
    if (window.location.hash !== canonical) window.history.replaceState(null, '', canonical);
  }, [route, isTeacher]);

  // The calendar is the teacher's, the lessons page the learner's: the other role lands on its dashboard.
  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect
    if ((activeSection === 'kalendarz' && !isTeacher) || (activeSection === 'zajecia' && isTeacher)) navigate({ moduleId: DEFAULT_MODULE, section: 'dashboard' });
  }, [activeSection, isTeacher, navigate]);

  // Remember the module the learner worked in last, so the dashboard can offer "Kontynuuj".
  useEffect(() => {
    if (inModulePage && !isTeacher) touchModule(currentModuleId);
  }, [inModulePage, currentModuleId, touchModule, isTeacher]);

  // The learner's check for new cards runs only where a new card makes a difference.
  useEffect(() => {
    setLive(activeSection === 'slownictwo' || activeSection === 'fiszki' || activeSection === 'fiszki-hub');
  }, [activeSection, setLive]);

  const handleSectionChange = (section: SectionType) => navigate({ moduleId: currentModuleId, section });
  const handleModuleChange = (moduleId: string) => navigate({ moduleId, section: DEFAULT_SECTION });
  const handleOpenFromDashboard = (moduleId: string, section: SectionType) => navigate({ moduleId, section });
  const handleOpenDeck = (moduleId: string) => navigate({ moduleId, section: 'fiszki', fromHub: true });
  const handleOpenReview = () => navigate({ moduleId: DEFAULT_MODULE, section: 'fiszki-hub', item: REVIEW_ITEM });
  const handleOpenHub = () => navigate({ moduleId: DEFAULT_MODULE, section: 'fiszki-hub' });
  const handleOpenStudent = (userId: string) => navigate({ moduleId: DEFAULT_MODULE, section: 'dashboard', viewUserId: userId });
  const handleBackToClass = () => navigate({ moduleId: DEFAULT_MODULE, section: 'dashboard' });
  const handleOpenLesson = useCallback((id: string) => navigate({ moduleId: DEFAULT_MODULE, section: 'kalendarz', lessonId: id }), [navigate]);
  const handleCalendar = useCallback((day: string | undefined, lessonId?: string) => navigate({ moduleId: DEFAULT_MODULE, section: 'kalendarz', item: day, lessonId }), [navigate]);
  const handleOpenSchedule = () => navigate({ moduleId: DEFAULT_MODULE, section: isTeacher ? 'kalendarz' : 'zajecia' });

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

  // The learner's "Zajęcia" row: open items of homework still in time, and whether anything is overdue.
  const scheduleRow = useMemo(() => {
    if (isTeacher) return { label: t('cal.title'), active: activeSection === 'kalendarz' };
    if (schedule.myLessons.length === 0 && schedule.myHomework.length === 0) return undefined;
    let open = 0;
    let overdue = false;
    for (const h of schedule.myHomework) {
      const p = myHomeworkProgress(h, progress, now);
      if (p.overdue) overdue = true;
      else if (!p.complete) open += p.total - p.done;
    }
    return { label: t('zaj.title'), active: activeSection === 'zajecia', hint: open > 0 ? t('hw.sidebarCount', { n: open }) : undefined, alert: overdue };
  }, [isTeacher, activeSection, schedule.myLessons, schedule.myHomework, progress, now, t]);

  const handleScoreSave = (score: number) => saveTestResult(currentModule.id, score);

  const currentExercises = languageUseExercisesByModule[currentModule.id] ?? [];
  const exercisesPassed = currentExercises.filter((e) => (currentProgress?.exercises?.[e.id]?.best ?? 0) >= EXERCISE_PASS_SCORE).length;

  const masteredIds = useMemo(() => new Set(currentProgress?.mastered ?? []), [currentProgress]);
  const reviewIds = useMemo(() => new Set(currentProgress?.review ?? []), [currentProgress]);

  // Which dashboard to show: the teacher sees the class, or one learner when the URL names one.
  const viewedStudent = isTeacher && route.viewUserId ? students.find((s) => s.id === route.viewUserId) : undefined;
  const dashboard =
    activeSection !== 'dashboard' ? null : isTeacher ? (
      !classLoaded ? null : viewedStudent ? (
        <Suspense fallback={null}>
          <TeacherStudentPage
            key={`${viewedStudent.id}-${route.item ?? ''}`}
            modules={allModules}
            student={viewedStudent}
            initialTab={route.item ? 'cards' : undefined}
            onOpen={handleOpenFromDashboard}
            onOpenDeck={handleOpenDeck}
            onOpenLesson={handleOpenLesson}
            onBackToClass={handleBackToClass}
            onSignedOut={markSignedOut}
          />
        </Suspense>
      ) : (
        <Suspense fallback={null}>
          <TeacherClassPage modules={allModules} students={students} onOpenStudent={handleOpenStudent} onOpenLesson={handleOpenLesson} onSignedOut={markSignedOut} />
        </Suspense>
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

  const banner = !isTeacher && (inModulePage || route.fromHub) ? <HomeworkBanner targets={pageTargets(route)} /> : null;

  return (
    <FlashcardDialogProvider teacherSignedIn={isTeacher ? true : undefined} signIn={null} onSignedOut={markSignedOut}>
    <div className="flex min-h-screen flex-col bg-page font-sans text-ink antialiased">
      <Navbar
        activeSection={activeSection}
        onOpenHandbook={() => setHandbookOpen(true)}
        onOpenSidebar={() => setSidebarOpen(true)}
        onSectionChange={handleSectionChange}
      />

      <div className="flex w-full flex-1">
        <Sidebar
          modules={allModules}
          currentModuleId={isStandalone(activeSection) || inFiszkiModule ? null : currentModuleId}
          masteredCardsMap={masteredCardsMap}
          deckSizeMap={deckSizeMap}
          reviewCount={reviewCount}
          fiszkiActive={inFiszkiModule}
          testScoresMap={testScoresMap}
          showProgress={!isTeacher}
          dashboardLabel={t('side.myProgress')}
          showDashboard={!isTeacher}
          dashboardActive={activeSection === 'dashboard'}
          scheduleRow={scheduleRow}
          onSelectModule={handleModuleChange}
          onSelectDashboard={handleBackToClass}
          onSelectFiszki={handleOpenHub}
          onSelectSchedule={handleOpenSchedule}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="w-full min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          {activeSection === 'design-system' && (
            <nav className="mb-6 flex items-center gap-1.5 text-sm text-ink-2" aria-label={t('misc.path')}>
              <a href="#dashboard" className="hover:text-primary hover:underline">
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

          {banner}

          {dashboard}

          {activeSection === 'kalendarz' && isTeacher && (
            <Suspense fallback={null}>
              <CalendarPage day={route.item} lessonId={route.lessonId} onNavigate={handleCalendar} onSignedOut={markSignedOut} />
            </Suspense>
          )}

          {activeSection === 'zajecia' && !isTeacher && (
            <Suspense fallback={null}>
              <StudentLessonsPage />
            </Suspense>
          )}

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
              teacherSignedIn={isTeacher}
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

          {activeSection === 'profile' && <ProfilePage />}
        </main>
      </div>

      <GrammarHandbookModal isOpen={handbookOpen} onClose={() => setHandbookOpen(false)} />
    </div>
    </FlashcardDialogProvider>
  );
}

export default App;
