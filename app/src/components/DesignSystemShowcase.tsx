import React, { useState } from 'react';
import { Volume2, RotateCw, Copy, Check, Search, ChevronRight } from 'lucide-react';
import {
  Button, Chip, KeyTag, TextField, TextArea, InlineInput, Tabs, OptionCard, Card, ListRow, Callout, SectionTitle,
} from './ui';
import type { OptionState } from './ui';

const colorTokens: { name: string; token: string; hex: string; use: string }[] = [
  { name: 'Primary', token: 'primary', hex: '#0056D2', use: 'przyciski, linki, aktywna zakładka' },
  { name: 'Primary hover', token: 'primary-hover', hex: '#00419E', use: 'stan hover przycisku' },
  { name: 'Primary tint', token: 'primary-tint', hex: '#EBF3FF', use: 'tło aktywnego wiersza, hover secondary' },
  { name: 'Ink', token: 'ink', hex: '#0D0F12', use: 'tekst główny' },
  { name: 'Ink 2', token: 'ink-2', hex: '#48546E', use: 'tekst pomocniczy, obramowanie pól' },
  { name: 'Ink 3', token: 'ink-3', hex: '#6B7589', use: 'placeholder, disabled' },
  { name: 'Line', token: 'line', hex: '#D9DEE6', use: 'obramowanie kart' },
  { name: 'Hero', token: 'hero', hex: '#F0F6F9', use: 'pas nagłówka modułu, hover wiersza' },
  { name: 'Chip', token: 'chip', hex: '#DAE1ED', use: 'neutralne etykiety, disabled' },
  { name: 'Success', token: 'success', hex: '#1E7F3C', use: 'poprawna odpowiedź, opanowane' },
  { name: 'Error', token: 'error', hex: '#C62828', use: 'błędna odpowiedź, koniec czasu' },
  { name: 'Warning', token: 'warning', hex: '#8A5A00', use: 'pułapki egzaminacyjne' },
];

const Spec: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="grid gap-3">
    <p className="text-sm leading-5 text-ink-2">{label}</p>
    {children}
  </div>
);

export const DesignSystemShowcase: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [selected, setSelected] = useState<string | null>('B');
  const [checked, setChecked] = useState(false);
  const [kwt, setKwt] = useState('has lived');
  const [kwtState, setKwtState] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [timer, setTimer] = useState(45);
  const [running, setRunning] = useState(false);
  const [search, setSearch] = useState('');
  const [essay, setEssay] = useState('In this essay, I will discuss the advantages and disadvantages of remote education...');
  const [tab, setTab] = useState<'fiszki' | 'test' | 'gramatyka'>('fiszki');

  React.useEffect(() => {
    if (!running || timer <= 0) return;
    const id = setInterval(() => setTimer((t) => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [running, timer]);

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text).catch(() => undefined);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-GB';
      window.speechSynthesis.speak(u);
    }
  };

  const words = essay.trim() === '' ? 0 : essay.trim().split(/\s+/).length;
  const options = [
    { key: 'A', text: 'is consisting of several elements' },
    { key: 'B', text: 'consists of several elements' },
    { key: 'C', text: 'has been consisted of several elements' },
    { key: 'D', text: 'was consisting of several elements' },
  ];
  const optionState = (key: string): OptionState => {
    if (!checked) return selected === key ? 'selected' : 'idle';
    if (key === 'B') return 'correct';
    if (selected === key) return 'wrong';
    return 'idle';
  };

  return (
    <div className="mx-auto grid max-w-5xl gap-12 pb-12">
      <div className="grid gap-2">
        <h2 className="text-3xl leading-10 font-semibold">Design system</h2>
        <p className="max-w-[72ch] text-ink-2">
          Komponenty interfejsu Matura English. Jeden kolor akcentu, jedna skala szarości, kolory semantyczne tylko dla
          rzeczywistego wyniku ucznia. Wszystkie elementy pochodzą z <code className="rounded bg-chip px-1 text-sm">src/components/ui</code>.
        </p>
      </div>

      {/* 1. Tokens */}
      <section className="grid gap-5">
        <SectionTitle title="Kolory" description="Tokeny z @theme w index.css. W klasach Tailwind: bg-primary, text-ink-2, border-line itd." />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {colorTokens.map((c) => (
            <div key={c.token} className="overflow-hidden rounded-lg border border-line">
              <div className="h-11" style={{ backgroundColor: c.hex }} />
              <div className="grid gap-0.5 px-3 py-2 text-sm leading-5">
                <span className="font-semibold">{c.name}</span>
                <code className="text-xs text-ink-2">{c.token} · {c.hex}</code>
                <span className="text-xs text-ink-2">{c.use}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-5">
        <SectionTitle title="Typografia" description="Source Sans 3. Nagłówki 600, tekst 400, bez wagi 900 i bez wersalików z trackingiem." />
        <Card className="grid gap-4">
          <p className="text-4xl leading-12 font-semibold">Nagłówek strony 36/48</p>
          <p className="text-2xl leading-8 font-semibold">Nagłówek sekcji 24/32</p>
          <p className="text-xl leading-7 font-semibold">Nagłówek karty 20/28</p>
          <p className="text-base leading-6">Tekst podstawowy 16/24. He moved to Madrid three years ago and still lives there.</p>
          <p className="text-sm leading-5 text-ink-2">Tekst pomocniczy 14/20 w kolorze ink-2: podpisy, metadane, podpowiedzi pod polem.</p>
          <p className="text-xs leading-4 text-ink-2">Najmniejszy rozmiar 12/16, tylko w małych etykietach.</p>
        </Card>
      </section>

      {/* 2. Buttons */}
      <section className="grid gap-5">
        <SectionTitle title="Przyciski" description="Trzy warianty jednego koloru. Na ekranie jeden przycisk primary. Ikony tylko obok tekstu, nigdy zamiast niego." />
        <Card className="grid gap-6">
          <Spec label="Warianty">
            <div className="flex flex-wrap items-center gap-3">
              <Button>Zatwierdź odpowiedź</Button>
              <Button variant="secondary">Pokaż wskazówkę</Button>
              <Button variant="ghost">Pomiń</Button>
              <Button disabled>Zablokowany</Button>
            </div>
          </Spec>
          <Spec label="Rozmiar sm w paskach narzędzi">
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm" variant="secondary" onClick={() => handleSpeak('Perseverance is key to mastering advanced English.')}>
                <Volume2 className="h-4 w-4" /> Odsłuchaj
              </Button>
              <Button size="sm" variant="secondary" onClick={() => handleCopy('In the foreground, there are two teenagers.')}>
                {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Skopiowano' : 'Kopiuj'}
              </Button>
              <Button size="sm" variant="ghost">
                <RotateCw className="h-4 w-4" /> Obróć (Spacja)
              </Button>
              <Button size="icon" variant="secondary" aria-label="Odsłuchaj wymowę">
                <Volume2 className="h-5 w-5" />
              </Button>
            </div>
          </Spec>
          <Spec label="Ocena fiszki: secondary / primary zamiast pary czerwony-zielony">
            <div className="flex max-w-md gap-3">
              <Button variant="secondary" full>Powtórz</Button>
              <Button full>Umiem</Button>
            </div>
          </Spec>
        </Card>
      </section>

      {/* 3. Navigation */}
      <section className="grid gap-5">
        <SectionTitle title="Nawigacja" description="Zakładki z podkreśleniem, ścieżka okruszków, lista wierszy z niebieskim znacznikiem aktywnej pozycji." />
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="grid gap-5">
            <Spec label="Zakładki (Tabs)">
              <Tabs
                items={[
                  { id: 'fiszki', label: 'Fiszki', count: 25 },
                  { id: 'test', label: 'Test', count: 15 },
                  { id: 'gramatyka', label: 'Gramatyka' },
                ]}
                value={tab}
                onChange={setTab}
              />
            </Spec>
            <Spec label="Ścieżka">
              <nav className="flex items-center gap-1.5 text-sm text-ink-2">
                <span>Moduły</span><ChevronRight className="h-3.5 w-3.5" />
                <span>Moduł 1</span><ChevronRight className="h-3.5 w-3.5" />
                <span className="font-semibold text-ink">Fiszki</span>
              </nav>
            </Spec>
            <Spec label="Linki">
              <p>
                <a href="#design-system" className="font-semibold text-primary hover:underline">Pokaż więcej</a>
                <span className="mx-3 text-line">|</span>
                <a href="#design-system" className="text-ink underline underline-offset-[3px]">Guenther Walther</a>
              </p>
            </Spec>
          </Card>
          <Card padding="none" className="overflow-hidden">
            <ListRow active>
              <span><span className="block">1. Człowiek</span><span className="block text-sm font-normal text-ink-2">25 fiszek · 4 opanowane</span></span>
              <span className="text-sm font-normal text-ink-2">B1+</span>
            </ListRow>
            <ListRow>
              <span><span className="block">2. Miejsce zamieszkania</span><span className="block text-sm text-ink-2">22 fiszki</span></span>
              <span className="text-sm text-ink-2">B1+</span>
            </ListRow>
            <ListRow>
              <span><span className="block">3. Edukacja</span><span className="block text-sm text-ink-2">30 fiszek</span></span>
              <span className="text-sm text-ink-2">B2</span>
            </ListRow>
          </Card>
        </div>
      </section>

      {/* 4. Chips */}
      <section className="grid gap-5">
        <SectionTitle title="Etykiety" description="Neutralny chip domyślnie. Kolor tylko dla faktycznego wyniku. Słowo-klucz w ramce, bez wypełnienia." />
        <Card className="grid gap-5">
          <Spec label="Neutralne: poziom, część mowy, temat">
            <div className="flex flex-wrap gap-2">
              <Chip>B1+</Chip><Chip>B2 / B2+</Chip><Chip>przymiotnik</Chip><Chip>Present Perfect</Chip><Chip>Człowiek</Chip>
            </div>
          </Spec>
          <Spec label="Status">
            <div className="flex flex-wrap gap-2">
              <Chip tone="success">24/25 opanowane</Chip>
              <Chip tone="warning">Wynik 87%</Chip>
              <Chip tone="error">Do powtórki</Chip>
              <Chip tone="primary">Nowe</Chip>
              <Chip size="sm">mały</Chip>
            </div>
          </Spec>
          <Spec label="Słowo-klucz i wyraz bazowy">
            <div className="flex flex-wrap gap-2"><KeyTag>DEPEND</KeyTag><KeyTag>LIVING</KeyTag></div>
          </Spec>
        </Card>
      </section>

      {/* 5. Fields */}
      <section className="grid gap-5">
        <SectionTitle title="Pola" description="Etykieta nad polem zwykłym tekstem, podpowiedź pod polem w ink-2. Obramowanie 1 px, promień 4 px, fokus niebieski." />
        <Card className="grid gap-6">
          <TextField
            label="Szukaj"
            placeholder="Słowo, reguła lub zwrot"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leadingIcon={<Search />}
            className="max-w-md"
          />
          <div className="grid gap-3">
            <p className="font-semibold">Przekształć zdanie, używając podanego słowa</p>
            <p>He moved to Madrid three years ago and still lives there.</p>
            <div className="flex flex-wrap items-center gap-2">
              <KeyTag>LIVING</KeyTag>
              <span>He</span>
              <InlineInput value={kwt} state={kwtState} onChange={(e) => { setKwt(e.target.value); setKwtState('idle'); }} aria-label="Odpowiedź" />
              <span>in Madrid for three years.</span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm" onClick={() => setKwtState(/^has been living$/i.test(kwt.trim()) ? 'correct' : 'wrong')}>Sprawdź</Button>
              <span className="text-sm text-ink-2">Użyj od 2 do 5 słów, w tym słowa podanego.</span>
            </div>
          </div>
          <TextArea
            label="Wypracowanie"
            value={essay}
            onChange={(e) => setEssay(e.target.value)}
            rows={3}
            trailing={<><b className="font-semibold text-ink tabular-nums">{words}</b> słów</>}
            hint="Limit 200–250 słów."
            error={words > 250 ? 'Przekroczono limit 250 słów.' : undefined}
          />
          <TextField label="Pole zablokowane" value="Niedostępne" disabled readOnly className="max-w-xs" />
        </Card>
      </section>

      {/* 6. Options */}
      <section className="grid gap-5">
        <SectionTitle
          title="Warianty odpowiedzi"
          description="Przycisk radiowy po lewej, jedna ramka. Po sprawdzeniu zmienia się tło, ikona i pojawia się wyjaśnienie. Tekst nie zmienia wagi ani nie jest przekreślany."
          action={<Button size="sm" variant="secondary" onClick={() => setChecked(!checked)}>{checked ? 'Wróć do wyboru' : 'Sprawdź'}</Button>}
        />
        <Card className="grid gap-2">
          <p className="mb-2">The committee <b>___</b> several elements.</p>
          {options.map((o) => {
            const st = optionState(o.key);
            return (
              <OptionCard
                key={o.key}
                letter={o.key}
                state={st}
                disabled={checked}
                onSelect={() => setSelected(o.key)}
                feedback={
                  st === 'correct' ? <>Poprawnie. Czasownik <i>consist</i> jest stanowy i nie występuje w formie ciągłej.</>
                  : st === 'wrong' ? 'Twoja odpowiedź. Czasowniki stanowe nie tworzą form Continuous.'
                  : undefined
                }
              >
                {o.text}
              </OptionCard>
            );
          })}
        </Card>
      </section>

      {/* 7. Widgets */}
      <section className="grid gap-5">
        <SectionTitle title="Widżety egzaminacyjne" description="Timer z dużą cyfrą 36/44 i paskiem postępu. Ostrzeżenie jako karta z kolorowym paskiem po lewej." />
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="grid gap-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm text-ink-2">Czas na odpowiedź</p>
                <p className={`text-4xl leading-11 font-semibold tabular-nums ${timer <= 10 ? 'text-error' : 'text-ink'}`}>
                  0:{timer.toString().padStart(2, '0')}
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => setRunning(!running)}>{running ? 'Wstrzymaj' : 'Start'}</Button>
                <Button size="sm" variant="ghost" onClick={() => { setRunning(false); setTimer(45); }}>Reset</Button>
              </div>
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-line-soft" role="progressbar" aria-valuemin={0} aria-valuemax={60} aria-valuenow={timer}>
              <div className={`h-full transition-[width] duration-1000 ease-linear ${timer <= 10 ? 'bg-error' : 'bg-primary'}`} style={{ width: `${(timer / 60) * 100}%` }} />
            </div>
          </Card>
          <div className="grid gap-3">
            <Callout tone="warning" title="Uwaga na maturze">
              <p>Konstrukcja <b>would + infinitive</b> opisuje tylko powtarzalne czynności w przeszłości. Nie używa się jej do stanów.</p>
              <div className="mt-2 grid gap-1 border-t border-line-soft pt-2 text-[15px]">
                <span className="text-error">✕ When I was a child, I would have a dog.</span>
                <span className="font-semibold text-success">✓ When I was a child, I used to have a dog.</span>
              </div>
            </Callout>
            <Callout tone="info" title="Wskazówka">Zacznij od tego, co widać na pierwszym planie, potem przejdź do tła.</Callout>
            <Callout tone="success" title="Zapisano wynik">Test modułu 1: 87%.</Callout>
          </div>
        </div>
      </section>

      {/* 8. Rules */}
      <section className="grid gap-5">
        <SectionTitle title="Zasady" />
        <Card>
          <ul className="grid list-disc gap-2 pl-5">
            <li>Jeden przycisk primary na ekran. Reszta to secondary lub ghost.</li>
            <li>Kolor semantyczny tylko dla wyniku ucznia: poprawnie, błędnie, opanowane. Nigdy jako dekoracja.</li>
            <li>Karty: promień 16 px, obramowanie 1 px line, bez cienia. Przyciski i pola: promień 8 px i 4 px.</li>
            <li>Ikony lucide 16–20 px w kolorze tekstu, zawsze obok etykiety tekstowej.</li>
            <li>Bez wersalików z trackingiem, bez wagi 900, bez gradientów, bez animate-pulse.</li>
            <li>Minimalny rozmiar tekstu 12 px, tekst pomocniczy 14 px w kolorze ink-2.</li>
          </ul>
        </Card>
      </section>
    </div>
  );
};
