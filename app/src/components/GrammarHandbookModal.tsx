import React, { useState } from 'react';
import { X, Search, BookOpen } from 'lucide-react';

interface GrammarHandbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic?: string | null;
}

interface QuickTopic {
  title: string;
  category: string;
  level: 'P' | 'R';
  summary: string;
  formula?: string;
  example: string;
}

const quickTopics: QuickTopic[] = [
  {
    title: 'Present Simple vs Present Continuous (Stative Verbs)',
    category: 'Czasy gramatyczne',
    level: 'P',
    summary:
      'Czasowniki statyczne (stany umysłu, zmysły, emocje) nie występują w Continuous, chyba że oznaczają aktywną czynność fizyczną (np. taste potrawy vs szef kuchni próbuje zupę).',
    formula: 'Continuous: am/is/are + -ing | Simple: V1 / V1+s',
    example: 'I think you are right (opinia) vs I am thinking about moving (proces myślowy).',
  },
  {
    title: 'used to vs would vs be/get used to',
    category: 'Przeszłość i nawyki',
    level: 'R',
    summary:
      'used to = przeszłe stany i nawyki; would = tylko powtarzalne czynności (nigdy stany!); be/get used to + -ing = być / przyzwyczajać się.',
    formula: 'used to + inf | would + inf (tylko actions!) | get used to + -ing',
    example: 'He used to be shy (nie wolno would!). She is getting used to working remotely.',
  },
  {
    title: 'Inwersja stylistyczna (Inversion)',
    category: 'Struktury emfatyczne',
    level: 'R',
    summary: 'Występuje po ujemnych lub ograniczających okolicznikach na początku zdania. Szyk jak w pytaniu.',
    formula: 'Negative Word + Auxiliary Verb + Subject + Main Verb',
    example: 'Not only did he arrive late, but he also forgot the documents.',
  },
  {
    title: 'Mieszane okresy warunkowe (Mixed Conditionals)',
    category: 'Tryby warunkowe',
    level: 'R',
    summary: 'Łączenie przeszłej przyczyny z teraźniejszym skutkiem (Past cause -> Present result) lub odwrotnie.',
    formula: 'If + Past Perfect, would + infinitive',
    example: 'If I had taken that job in London, I would be living there now.',
  },
  {
    title: 'Modals in the Past (Czasowniki modalne w przeszłości)',
    category: 'Czasowniki modalne',
    level: 'R',
    summary:
      "should have + V3 (należało było zrobić), needn't have + V3 (niepotrzebnie zrobiono), must have + V3 (na pewno zrobiono).",
    formula: 'Modal + have + Past Participle (V3)',
    example: "You shouldn't have stayed up so late before the exam.",
  },
  {
    title: 'Zdania rozszczepione (Cleft Sentences)',
    category: 'Emfaza i styl',
    level: 'R',
    summary: 'Struktury podkreślające dany element zdania (podmiot, dopełnienie, okolicznik).',
    formula: 'It was [X] that... | What I really enjoyed was [X]',
    example: 'It was her dedication that impressed the entire committee.',
  },
  {
    title: 'Passive Voice & Causative have/get done',
    category: 'Strona bierna',
    level: 'P',
    summary: 'Strona bierna: be + V3. Konstrukcja kauzatywna (zlecanie usługi komuś innemu): have/get + thing + V3.',
    formula: 'Subject + have/get + Object + Past Participle',
    example: 'We had our roof repaired last week by professionals.',
  },
  {
    title: 'Mowa zależna: Reporting Verbs',
    category: 'Mowa zależna',
    level: 'R',
    summary: 'Zamiast "said that", stosuj czasowniki: suggest, insist, admit, deny, remind, refuse, urge.',
    formula: 'verb + preposition + -ing | verb + object + to inf',
    example: 'He apologized for being late and insisted on paying for lunch.',
  },
];

export const GrammarHandbookModal: React.FC<GrammarHandbookModalProps> = ({ isOpen, onClose, initialTopic }) => {
  const [searchTerm, setSearchTerm] = useState(initialTopic || '');

  if (!isOpen) return null;

  const filtered = quickTopics.filter(
    (t) =>
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.summary.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="fixed inset-0 z-50 bg-ink/50 flex items-center justify-center p-4">
      <div className="bg-surface rounded-2xl w-full max-w-3xl max-h-[85vh] border border-line flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-line-soft flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-warning text-white flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-ink">Podręczne Repetytorium Gramatyczne CKE</h2>
              <p className="text-xs text-ink-2">Kluczowe reguły maturalne (B1+ do B2+) z formułami i pułapkami</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-lg text-ink-3 hover:text-ink hover:bg-line-soft transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-line-soft bg-hero">
          <div className="relative">
            <Search className="w-4 h-4 text-ink-3 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Wyszukaj zagadnienie gramatyczne (np. used to, inwersja, passiv...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-line focus:border-primary focus:ring-1 focus:ring-primary outline-hidden bg-surface"
            />
          </div>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-4">
          {filtered.map((topic, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl border border-line bg-surface hover:border-line transition space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-warning-tint text-warning border border-warning-tint">
                  {topic.category}
                </span>
                <span className="text-xs font-semibold text-primary-hover">Poziom {topic.level}</span>
              </div>

              <h3 className="text-sm font-semibold text-ink">{topic.title}</h3>

              {topic.formula && (
                <div className="p-2 rounded-lg bg-hero border border-line-soft text-xs text-primary-hover">
                  {topic.formula}
                </div>
              )}

              <p className="text-xs text-ink-2 leading-relaxed">{topic.summary}</p>

              <div className="text-xs text-ink italic bg-warning-tint/50 p-2 rounded-lg border border-warning-tint">
                <strong>Przykład: </strong>
                {topic.example}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
