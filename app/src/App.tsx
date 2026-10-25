import { useState, useEffect, useCallback, useMemo } from 'react';
import type { SectionType } from './types';
import { allModules } from './data/modulesData';
import { vocabularyTextsByModule } from './data/vocabularyTexts';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ModuleHeader } from './components/ModuleHeader';
import { DashboardView } from './components/DashboardView';
import { TeacherDashboardView } from './components/TeacherDashboardView';
import { FlashcardsView } from './components/FlashcardsView';
import { PictureDescriptionView } from './components/PictureDescriptionView';
import { GrammarSectionView } from './components/GrammarSectionView';
import { VocabularyView } from './components/VocabularyView';
import { WritingTrainerView } from './components/WritingTrainerView';
import { GrammarHandbookModal } from './components/GrammarHandbookModal';
import { DesignSystemShowcase } from './components/DesignSystemShowcase';
import { ChevronRight } from 'lucide-react';
import { useProgress } from './useProgress';
import { useUser } from './useUser';
import { useSettings } from './useSettings';
import { findUser, students } from './users';

const moduleSections: SectionType[] = ['opis-foto', 'gramatyka', 'slownictwo', 'pisanie', 'fiszki'];
/** Section shown when a module is opened without an explicit section (the first tab). */
const DEFAULT_SECTION: SectionType = moduleSections[0];
const standaloneSections: SectionType[] = ['dashboard', 'design-system'];
const validSections: SectionType[] = [...moduleSections, ...standaloneSections];
const DEFAULT_MODULE = allModules[0].id;

/** Old links: the test used to be its own tab, now it lives at the bottom of the grammar section. */
const legacySections: Record<string, SectionType> = { test: 'gramatyka' };

interface Route {
  moduleId: string;
  section: SectionType;
  /** Dashboard only: a learner's id when the teacher opens that learner's page. */
  viewUserId?: string;
}

const isStandalone = (s: SectionType) => standaloneSections.includes(s);

/**
 * URL scheme: #<moduleId>/<section>, e.g. #praca/opis-foto.
 * Also accepted: #<section> (default module), #<moduleId> (flashcards), #design-system,
 * #dashboard/<studentId> (teacher looking at one learner).
 * An empty hash (app start) opens the dashboard.
 */
const parseHash = (hash: string): Route => {
  const raw = decodeURIComponent(hash.replace(/^#\/?/, '')).replace(/\/$/, '');
  const [a, rawB] = raw.split('/');
  const b = rawB && legacySections[rawB] ? legacySections[rawB] : rawB;
  const isModule = (id: string) => allModules.some((m) => m.id === id);
  const isSection = (s: string): s is SectionType => validSections.includes(s as SectionType);

  if (!raw || a === 'dashboard') {
    const student = b && findUser(b)?.role === 'student' ? b : undefined;
    return { moduleId: DEFAULT_MODULE, section: 'dashboard', viewUserId: student };
  }
  if (a === 'design-system') return { moduleId: DEFAULT_MODULE, section: 'design-system' };
  if (isModule(a)) return { moduleId: a, section: b && isSection(b) && !isStandalone(b) ? b : DEFAULT_SECTION };
  const a2 = legacySections[a] ?? a;
  if (isSection(a2)) return { moduleId: DEFAULT_MODULE, section: a2 };
  return { moduleId: DEFAULT_MODULE, section: 'dashboard' };
};

const toHash = (r: Route): string => {
  if (r.section === 'dashboard') return r.viewUserId ? `dashboard/${r.viewUserId}` : 'dashboard';
  if (isStandalone(r.section)) return r.section;
  return `${r.moduleId}/${r.section}`;
};

export function App() {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [handbookOpen, setHandbookOpen] = useState(false);
  const { user } = useUser();
  const { t } = useSettings();
  const { state: progress, setCardStatus, saveTestResult, touchModule } = useProgress();
  const isTeacher = user.role === 'teacher';

  const { moduleId: currentModuleId, section: activeSection } = route;

  useEffect(() => {
    const onHashChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Keep the address bar canonical (e.g. "#test" becomes "#czlowiek/gramatyka") so every page has a shareable link.
  useEffect(() => {
    const canonical = '#' + toHash(route);
    if (window.location.hash !== canonical) window.history.replaceState(null, '', canonical);
  }, [route]);

  // Remember the module the learner worked in last, so the dashboard can offer "Kontynuuj".
  useEffect(() => {
    if (!isStandalone(activeSection) && !isTeacher) touchModule(currentModuleId);
  }, [activeSection, currentModuleId, touchModule, isTeacher]);

  const navigate = useCallback((next: Route) => {
    setRoute(next);
    window.location.hash = toHash(next);
  }, []);

  // Switching the signed-in user always lands on that user's dashboard.
  const [prevUserId, setPrevUserId] = useState(user.id);
  if (prevUserId !== user.id) {
    setPrevUserId(user.id);
    navigate({ moduleId: DEFAULT_MODULE, section: 'dashboard' });
  }

  const handleSectionChange = (section: SectionType) => navigate({ moduleId: currentModuleId, section });
  const handleModuleChange = (moduleId: string) => navigate({ moduleId, section: DEFAULT_SECTION });
  const handleOpenFromDashboard = (moduleId: string, section: SectionType) => navigate({ moduleId, section });
  const handleOpenStudent = (userId: string) => navigate({ moduleId: DEFAULT_MODULE, section: 'dashboard', viewUserId: userId });
  const handleBackToClass = () => navigate({ moduleId: DEFAULT_MODULE, section: 'dashboard' });

  const currentModule = allModules.find((m) => m.id === currentModuleId) || allModules[0];
  const currentProgress = progress.modules[currentModule.id];

  // Sidebar counters: only ids that still exist in the deck, in case data changed between sessions.
  const masteredCardsMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const m of allModules) {
      const ids = new Set(m.flashcards.map((c) => c.id));
      map[m.id] = (progress.modules[m.id]?.mastered ?? []).filter((id) => ids.has(id)).length;
    }
    return map;
  }, [progress]);

  const testScoresMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const m of allModules) {
      const best = progress.modules[m.id]?.test?.best;
      if (best !== undefined) map[m.id] = best;
    }
    return map;
  }, [progress]);

  const handleScoreSave = (score: number) => saveTestResult(currentModule.id, score);

  const masteredIds = useMemo(() => new Set(currentProgress?.mastered ?? []), [currentProgress]);
  const reviewIds = useMemo(() => new Set(currentProgress?.review ?? []), [currentProgress]);

  // Which dashboard to show: the teacher sees the class, or one learner when the URL names one.
  const viewedStudent = isTeacher && route.viewUserId ? findUser(route.viewUserId) : undefined;
  const dashboard =
    activeSection !== 'dashboard' ? null : isTeacher ? (
      viewedStudent ? (
        <DashboardView modules={allModules} user={viewedStudent} teacherView onOpen={handleOpenFromDashboard} onBackToClass={handleBackToClass} />
      ) : (
        <TeacherDashboardView modules={allModules} students={students} onOpenStudent={handleOpenStudent} />
      )
    ) : (
      <DashboardView modules={allModules} user={user} onOpen={handleOpenFromDashboard} />
    );

  return (
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
          currentModuleId={activeSection === 'dashboard' ? null : currentModuleId}
          masteredCardsMap={masteredCardsMap}
          testScoresMap={testScoresMap}
          showProgress={!isTeacher}
          dashboardLabel={isTeacher ? t('side.teacherPanel') : t('side.myProgress')}
          onSelectModule={handleModuleChange}
          onSelectDashboard={handleBackToClass}
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

          {!isStandalone(activeSection) && (
            <ModuleHeader
              module={currentModule}
              activeSection={activeSection}
              onSectionChange={handleSectionChange}
              masteredCardsCount={masteredCardsMap[currentModule.id] || 0}
              testScore={testScoresMap[currentModule.id] ?? null}
            />
          )}

          {dashboard}

          {activeSection === 'fiszki' && (
            <FlashcardsView
              key={currentModule.id}
              cards={currentModule.flashcards}
              moduleTitle={currentModule.titlePl}
              masteredIds={masteredIds}
              reviewIds={reviewIds}
              onCardStatus={(cardId, status) => setCardStatus(currentModule.id, cardId, status)}
            />
          )}

          {activeSection === 'opis-foto' && (
            <PictureDescriptionView key={currentModule.id} data={currentModule.pictureDescription} moduleTitle={currentModule.titlePl} />
          )}

          {activeSection === 'gramatyka' && (
            <GrammarSectionView
              key={currentModule.id}
              rules={currentModule.grammarRules}
              questions={currentModule.testQuestions}
              moduleTitle={currentModule.titlePl}
              onScoreSave={handleScoreSave}
            />
          )}

          {activeSection === 'slownictwo' && (
            <VocabularyView
              key={currentModule.id}
              texts={vocabularyTextsByModule[currentModule.id] ?? []}
              vocabulary={currentModule.vocabularyList}
              moduleTitle={currentModule.titlePl}
            />
          )}

          {activeSection === 'pisanie' && (
            <WritingTrainerView key={currentModule.id} prompt={currentModule.writingPrompt} moduleTitle={currentModule.titlePl} />
          )}

          {activeSection === 'design-system' && <DesignSystemShowcase />}
        </main>
      </div>

      <GrammarHandbookModal isOpen={handbookOpen} onClose={() => setHandbookOpen(false)} />
    </div>
  );
}

export default App;
