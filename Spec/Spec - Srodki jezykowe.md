# Спецификация: Раздел «Środki językowe» в каждом модуле

**Статус:** реализовано, ждёт вычитки содержания учителем · **Дата:** 25.10.2026, обновлено 01.11.2026 · **Связано с:** [Spec for Matura.md](Spec%20for%20Matura.md), [Spec - Student cabinet and teacher notes.md](Spec%20-%20Student%20cabinet%20and%20teacher%20notes.md), [design_system.md](design_system.md)

---

## 1. Цель

В каждом из 14 тематических модулей появляется шестой раздел — **«Środki językowe»** (вкладка рядом с «Gramatyka» и «Słownictwo»).

Это **не грамматика и не чтение**. Это упражнения на применение языка в ситуации: что сказать, когда тебя благодарят, как попросить об услуге, как отреагировать на плохую новость, как ответить на вопрос так, чтобы реплика подходила ко всему диалогу. На экзамене этот навык проверяет часть «Znajomość środków językowych» (poziom podstawowy, zadania typu *minidialogi*, *dobieranie*, *uzupełnianie luk*).

Чем раздел отличается от соседних:

| Раздел | Что тренирует | Пример задания |
|---|---|---|
| Gramatyka | **Как построить** форму: правила модуля и тест (słowotwórstwo, transformacje, tłumaczenie) | *I dislike his arrogance the most. (WHAT) → What I dislike most is…* |
| Słownictwo | **Какие слова** есть по теме: тексты, ключевая лексика, пропуски под текстом | *He goes to the gym every day, so he is very ___ (well-built).* |
| **Środki językowe** | **Что сказать в ситуации**: функции языка (funkcje językowe) и готовые реплики | *X: Thank you very much for your help. Y: ___ → Don't mention it.* |

Три типа упражнений в первой версии (все из экзаменационной практики, см. [mini_dialogi_i_vybor.md](../Грамматика%20и%20лексика%20(Znajomość%20środków%20językowych)/mini_dialogi_i_vybor.md) и [zapolnenie_propuskov.md](../Грамматика%20и%20лексика%20(Znajomość%20środków%20językowych)/zapolnenie_propuskov.md)):

1. **Dopasowanie** — «Match sentences 1–5 to possible replies a–e».
2. **Bank słów** — «Uzupełnij zdania wyrazami z ramki» (favour, lot, shall, should, so → *Thanks a ___.*).
3. **Minidialogi** — «Uzupełnij minidialogi 1–3. Wybierz brakującą wypowiedź A, B lub C». Диалог из двух или трёх реплик; в трёхрепличном правильный ответ должен подходить **ко всему диалогу**, а не только к реплике перед пропуском.

---

## 2. Как устроено сейчас (важно для решения)

| Что | Как сейчас | Где в коде |
|---|---|---|
| Разделы модуля | Пять вкладок: `opis-foto`, `gramatyka`, `slownictwo`, `pisanie`, `fiszki`; список `moduleSections` | [App.tsx](../app/src/App.tsx), [ModuleHeader.tsx](../app/src/components/ModuleHeader.tsx), тип `SectionType` в [types/index.ts](../app/src/types/index.ts) |
| Адреса | `#<user>/<module>/<section>[/<item>]`; `item` проверяется функцией `validItem` только для `slownictwo` (id текста) и `gramatyka` (id правила или `test`) | [App.tsx](../app/src/App.tsx) |
| Минидиалоги | Уже есть как тип вопроса `mini-dialogue` в **тесте по грамматике** (один вопрос `test-10` в модуле Człowiek); отображаются как обычный multiple choice | [InteractiveTestView.tsx](../app/src/components/InteractiveTestView.tsx), [module1_czlowiek.ts](../app/src/data/modules/module1_czlowiek.ts) |
| Пропуски с вводом | Компонент `GapFillExercise` под текстами в Słownictwo: поля `InlineInput`, кнопки «Sprawdź / Spróbuj ponownie / Pokaż odpowiedzi / Bank słów», сравнение ответов через `normalise` | [VocabularyView.tsx](../app/src/components/VocabularyView.tsx), [vocabularyExercises.ts](../app/src/data/vocabularyExercises.ts) |
| Варианты A/B/C | Примитив `OptionCard` (состояния idle / selected / correct / wrong) | [ui/OptionCard.tsx](../app/src/components/ui/OptionCard.tsx) |
| Прогресс | `ModuleProgress` хранит только `mastered`, `review` и `test` (лучший результат теста по грамматике). Результаты упражнений под текстами **не сохраняются** | [progress-context.ts](../app/src/progress-context.ts), [progress.tsx](../app/src/progress.tsx) |
| Сводка прогресса | `summarizeModule` считает слова и тест; кабинет и панель учителя показывают только это | [progressSummary.ts](../app/src/progressSummary.ts), [DashboardView.tsx](../app/src/components/DashboardView.tsx) |

**Следствия:**

- Половина механики уже есть: ввод в пропуски, варианты A/B/C, кнопки проверки, ссылки на отдельный элемент раздела. Новый раздел собирается из тех же примитивов, новый только тип «Dopasowanie».
- Минидиалоги сейчас живут в тесте по грамматике, хотя проверяют не грамматику. Новый раздел — их естественное место (см. открытый вопрос 1).
- Чтобы результат упражнений был виден в кабинете ученика и учителю, нужно расширить `ModuleProgress`. Это совместимо со спекой кабинета: прогресс по модулю целиком уходит на сервер через `PUT /api/progress/:userId/:moduleId`.

---

## 3. Место в модуле и адреса

- Новый `SectionType`: `'srodki'`.
- Порядок вкладок: **Opis ilustracji · Gramatyka · Słownictwo · Środki językowe · Wypowiedź pisemna · Fiszki**. Раздел стоит рядом со Słownictwo, потому что опирается на лексику модуля.
- Подпись вкладки: pl «Środki językowe», en «Use of English». В счётчике вкладки — число упражнений (как у Gramatyka число заданий).
- Адрес раздела: `#maria/czlowiek/srodki`. Адрес одного упражнения: `#maria/czlowiek/srodki/czl-sj-2` — так же, как у текста в Słownictwo: открывается только это упражнение, сверху ссылка «← Wszystkie ćwiczenia (5)». Это нужно для домашних заданий: учитель копирует ссылку кнопкой «Kopiuj link» и отправляет ученику.
- `validItem` для `srodki` принимает id упражнения из данных модуля; неизвестный id открывает весь раздел.
- В шапке модуля (`ModuleHeader`) к метаданным добавляется «Środki: 3/5» — сколько упражнений зачтено, если ученик уже что-то решал.

---

## 4. Содержание раздела

### 4.1. Состав

- В каждом модуле **4–6 упражнений**, по **5–6 пунктов** в каждом. Типы чередуются: минимум по одному упражнению каждого из трёх типов на модуль.
- Каждое упражнение привязано к **функции языка** (funkcja językowa) из каталога CKE и к теме модуля. Упражнение имеет уровень `P` или `R`; в первой версии почти всё — `P`, потому что именно на podstawowy эти типы заданий есть на экзамене.
- Содержание — британский английский, естественные реплики. Инструкция к упражнению — по-польски, как на экзамене (например, «Dobierz do zdań 1–5 odpowiednie reakcje a–e»). Пояснения к ответам — по-польски, с необязательным русским вариантом (отображается через `tr(polish, russian)`, как в остальном приложении).

### 4.2. Функции языка по модулям

Ориентир для авторов содержания. Для каждого модуля — какие ситуации тренирует раздел.

| Модуль | Функции языка |
|---|---|
| Człowiek | podziękowania, przeprosiny, prośby i oferty pomocy, prośba o radę, reakcje na wiadomości (sympathy, encouragement), opinie o ludziach |
| Miejsce zamieszkania | zapraszanie, oprowadzanie po domu, skarga do właściciela, pytanie o drogę w okolicy |
| Edukacja | prośba o pozwolenie, prośba o wyjaśnienie, usprawiedliwianie się, zachęcanie |
| Praca | rozmowa kwalifikacyjna, polecenia i prośby, zgoda i odmowa, rozmowa telefoniczna |
| Życie prywatne | zaproszenia, przyjmowanie i odrzucanie, gratulacje, współczucie, umawianie się |
| Żywienie | zamawianie, skarga w restauracji, częstowanie, upodobania |
| Zakupy i usługi | pytanie o cenę i rozmiar, zwrot towaru, reklamacja, w banku |
| Podróżowanie i turystyka | pytanie o drogę, kupowanie biletów, zameldowanie w hotelu, prośba o informację |
| Kultura | polecanie, opinie o filmie i książce, zgadzanie się i niezgadzanie, kupowanie biletów |
| Sport | dopingowanie, proponowanie aktywności, wyniki, reakcje na wiadomości |
| Zdrowie | u lekarza, objawy, udzielanie rad, wyrażanie troski |
| Nauka i technika | prośba o pomoc z urządzeniem, opisywanie usterki, instrukcje |
| Świat przyrody | rozmowa o pogodzie, ostrzeżenia, wyrażanie obaw, przekonywanie |
| Państwo i społeczeństwo | wyrażanie opinii, uprzejme niezgadzanie się, propozycje, argumentowanie |

### 4.3. Правила составления

1. **Dopasowanie:** реплики справа перемешаны и не совпадают по порядку с левыми; каждая реплика подходит ровно к одному предложению. Пары не должны угадываться по одному слову (например, *help* слева и *help* справа).
2. **Bank słów:** каждое слово используется один раз; допускается одно лишнее слово (дистрактор), как на экзамене. Пропуск принимает одно слово; варианты написания — через `alternatives`.
3. **Minidialogi:** 2 или 3 реплики, пропуск у `Y` (или у второй реплики `X` в трёхрепличном диалоге). Два неверных варианта правдоподобны, но не подходят либо логически, либо грамматически. В трёхрепличном диалоге хотя бы один дистрактор должен подходить к первой реплике и **не подходить** ко второй — это и есть то, что проверяет задание. В пояснении написать, почему остальные варианты не подходят.
4. У каждого упражнения может быть **подсказка** (`tip`) — текст в рамке над заданием, как «Minidialogi występujące w zadaniu tego typu mogą składać się z dwóch lub trzech kwestii…».

### 4.4. Первое наполнение: модуль Człowiek

Четыре упражнения с готовыми ключами, чтобы раздел можно было показать сразу после сборки.

**czl-sj-1 · Dopasowanie · P** — «Dobierz do zdań 1–5 odpowiednie reakcje a–e.»
Tip: «Zwróć uwagę na funkcję wypowiedzi: podziękowanie, prośba, przeprosiny, oferta pomocy, prośba o radę.»

| # | Zdanie | Reakcja |
|---|---|---|
| 1 | Thank you very much for your help. | c. Don't mention it. |
| 2 | Could you help me for a second? | e. With pleasure. |
| 3 | I'm sorry. It's all my fault. | a. It's OK, don't worry about it. |
| 4 | Would you like me to help you? | b. Thank you, I can manage. |
| 5 | What's your advice? | d. If I were you, I wouldn't do it. |

**czl-sj-2 · Bank słów · P** — «Uzupełnij zdania wyrazami z ramki.» Ramka: *favour, lot, shall, should, so*.

1. Thanks a **lot**. · 2. Could you do me a **favour**? · 3. **Shall** I help you? · 4. I'm **so** sorry! · 5. What do you think I **should** do?

**czl-sj-3 · Minidialogi · P** — «Uzupełnij minidialogi 1–3. Wybierz spośród podanych opcji brakującą wypowiedź A, B lub C.»

1. X: ___ I forgot to introduce my new friend to you. / Y: It's OK. Don't worry about it. → **A. I apologise.** (B «Don't mention it» to odpowiedź na podziękowanie; C «I'm sorry to hear that» to reakcja na złą wiadomość.)
2. X: Do you like Joanna's new hat? / Y: ___ / X: Neither do I. → **A. No, I don't like it at all.** («Neither do I» zgadza się tylko z przeczeniem; B i C są twierdzące.)
3. X: What does your girlfriend like? / Y: ___ → **C. She is keen on fashion and loves books.** (Pytanie o upodobania, nie o wygląd — A — ani o charakter — B. Por. *What is she like?* / *What does she look like?*)

**czl-sj-4 · Minidialogi · P** — «Uzupełnij minidialogi 1–2. Wybierz brakującą wypowiedź a, b lub c.»
Tip: «Minidialogi mogą składać się z dwóch lub trzech kwestii. W dialogu z trzech kwestii poprawna odpowiedź musi pasować pod względem logicznym i gramatycznym do całego minidialogu, a nie tylko do kwestii przed luką.»

1. X: Have you got any idea what nationality Paul is? / Y: ___ / X: Great, I can practise my French with him then. → **b. He comes from France.** (a i c pasują do pytania, ale nie do trzeciej kwestii.)
2. X: Jenny, what's wrong? You look a bit depressed. / Y: ___ / X: Oh, come on, cheer up! There are only two weeks before the Christmas break. → **a. I'm fed up with school.** (Trzecia kwestia mówi o szkole; b jest o siostrze, c to reakcja na cudzą złą wiadomość.)

Остальные 13 модулей наполняются по таблице §4.2 (задачи этапа 5).

---

## 5. Данные

### 5.1. Типы

```ts
export type LanguageUseExerciseType = 'matching' | 'word-bank' | 'mini-dialogue';

interface LanguageUseExerciseBase {
  id: string;                  // '<префикс модуля>-sj-<n>', например 'czl-sj-1'
  type: LanguageUseExerciseType;
  /** Польская инструкция, как на экзамене. */
  instruction: string;
  /** Необязательная подсказка в рамке над заданием. */
  tip?: string;
  /** Функция языка, например 'Podziękowania i przeprosiny'; показывается чипом. */
  functionLabel: string;
  level: 'P' | 'R';
}

/** Dopasowanie: предложения 1–n и реплики a–n. */
export interface MatchingExercise extends LanguageUseExerciseBase {
  type: 'matching';
  /** Левая колонка, по порядку 1…n. */
  prompts: { id: string; text: string }[];
  /** Правая колонка в том порядке, в каком показывается (a…n). */
  replies: { id: string; text: string }[];
  /** promptId → replyId. */
  answers: Record<string, string>;
  /** Пояснения к парам (по promptId), показываются после проверки. */
  explanations?: Record<string, { pl: string; ru?: string }>;
}

/** Bank słów: предложения с одним пропуском ___ и рамка слов. */
export interface WordBankExercise extends LanguageUseExerciseBase {
  type: 'word-bank';
  /** Слова рамки в показываемом порядке, включая лишнее слово. */
  bank: string[];
  items: {
    sentence: string;          // ровно один ___
    answer: string;            // одно из слов рамки
    alternatives?: string[];
    explanation?: { pl: string; ru?: string };
  }[];
}

/** Minidialogi: 2–3 реплики, одна с пропуском, варианты A/B/C. */
export interface MiniDialogueExercise extends LanguageUseExerciseBase {
  type: 'mini-dialogue';
  items: {
    id: string;
    /** Реплики по порядку; та, где стоит пропуск, имеет text === null. */
    lines: { speaker: 'X' | 'Y'; text: string | null }[];
    options: string[];         // 3 варианта
    correctIndex: number;
    explanation: { pl: string; ru?: string };
  }[];
}

export type LanguageUseExercise = MatchingExercise | WordBankExercise | MiniDialogueExercise;
```

Файл данных: `app/src/data/languageUseExercises.ts`, экспорт `languageUseExercisesByModule: Record<string, LanguageUseExercise[]>` — по образцу `vocabularyTextsByModule`. Проверка данных при сборке (как для текстов): id уникальны, в `matching` число реплик равно числу предложений и каждый `answers[promptId]` существует, в `word-bank` каждый `answer` есть в `bank`, в `mini-dialogue` ровно одна реплика с `null` и `correctIndex` в пределах `options`.

### 5.2. Прогресс

В `ModuleProgress` добавляется поле:

```ts
/** Results of the "Środki językowe" exercises, keyed by exercise id. Saved every time an exercise is checked. */
exercises?: Record<string, {
  best: number;      // 0–100
  last: number;
  attempts: number;
  lastAt: string;    // ISO
}>;
```

- Упражнение считается **зачтённым** при `best ≥ 80` (константа `EXERCISE_PASS_SCORE`, та же планка, что `GRAMMAR_PASS_SCORE`).
- Новый метод контекста `saveExerciseResult(moduleId, exerciseId, scorePercent)` по образцу `saveTestResult`.
- Ключ `localStorage` остаётся `matura.progress.v3`: поле необязательное, старые данные читаются без миграции.
- Для спеки кабинета: событие `exercise_checked` в журнале с `payload.score` и `payload.exerciseId`.

---

## 6. Интерфейс

### 6.1. Страница раздела

Сверху вниз (стиль как у Słownictwo и Gramatyka, те же примитивы из `components/ui`):

1. `SectionTitle`: «Środki językowe: Człowiek», описание «{n} ćwiczeń z funkcji językowych tego tematu: dopasowanie, bank słów, minidialogi. Rozwiąż, sprawdź, przeczytaj wyjaśnienia.» Справа — переключатель переводов пояснений (тот же, что в Słownictwo).
2. Список **карточек упражнений** (как `TextCard`). Шапка карточки: номер, название функции (`functionLabel`) чипом, тип упражнения чипом (Dopasowanie / Bank słów / Minidialogi), уровень, кнопка «Kopiuj link»; справа — чип результата «4 / 5» после проверки и «Zaliczone ✓», если лучший результат ≥ 80 %.
3. Внутри карточки: подсказка (`tip`) в `Callout`, инструкция, тело упражнения, ряд кнопок.

Кнопки одинаковые для всех трёх типов, как в `GapFillExercise`: **«Sprawdź»** → после проверки **«Spróbuj ponownie»**; рядом **«Pokaż odpowiedzi»**. Проверяется всё упражнение целиком, по пунктам подсвечивается верно / неверно, у неверных показывается правильный ответ и пояснение. Результат сохраняется при каждом «Sprawdź» (как у теста: `best`, `last`, `attempts`). «Pokaż odpowiedzi» результат **не** сохраняет.

Открытие одного упражнения по ссылке `…/srodki/<id>`: показывается только оно, сверху «← Wszystkie ćwiczenia (n)», страница прокручивается к началу.

### 6.2. Dopasowanie

- Две колонки на ширине ≥ 640 px: слева предложения 1–n, справа реплики a–n. На узком экране — одна колонка: сначала список реплик a–n (чтобы их видеть), затем предложения.
- **Выбор:** под каждым предложением ряд чипов-букв `a … n`. Нажатие выбирает реплику для этого предложения; буква, уже занятая другим предложением, показывается приглушённо, но выбрать её можно — тогда она снимается с предыдущего. Так одна реплика не может стоять у двух предложений.
- Линии между колонками, как на сайте учебника, **не рисуем**: на телефоне они не работают, а с клавиатуры недоступны. Чипы-буквы решают то же самое.
- После проверки: верная пара — чип зелёный; неверная — красный, рядом буква правильного ответа и пояснение. Реплика в правой колонке после проверки получает номер предложения, к которому относится.
- `Enter` в фокусе чипа выбирает; `Tab` ходит по чипам.

### 6.3. Bank słów

- Рамка слов вверху карточки: чипы в заданном порядке (`bank`). Использованное слово приглушается; если слово лишнее, оно остаётся активным до конца.
- Под рамкой предложения с `InlineInput` на месте `___` (как в `GapFillExercise`). Два способа заполнить: **напечатать** слово или **нажать чип**, тогда слово вставляется в первый пустой пропуск (или в пропуск с фокусом). Нажатие чипа, уже стоящего в каком-то пропуске, ничего не делает.
- Сравнение ответов через ту же функцию `normalise` (регистр, дефисы, лишние пробелы). Заглавная буква в начале предложения («Shall») не влияет.
- После проверки: пропуск зелёный / красный, у неверного — правильное слово и пояснение.

### 6.4. Minidialogi

- Пункты по порядку, в одну колонку (на широком экране допускается сетка 2 колонки, если у всех диалогов по 2 реплики). В каждом пункте: реплики с подписями `X:` / `Y:` приглушённым цветом, пропуск показан как пустая строка `Y: ___`; ниже три `OptionCard` с буквами A / B / C.
- Выбор варианта — `OptionCard` в состоянии `selected`. Проверка всего упражнения кнопкой «Sprawdź». После проверки: выбранный верный — `correct`; выбранный неверный — `wrong`, а верный подсвечивается `correct`; под пунктом пояснение, почему остальные варианты не подходят.
- Если не выбран ни один вариант в каком-то пункте, «Sprawdź» всё равно срабатывает: пункт считается неверным, подсказка «Nie wybrano odpowiedzi».

### 6.5. Тексты интерфейса

Все строки через [i18n.ts](../app/src/i18n.ts), ключи `srodki.*` на польском и английском: `tab.srodki`, `srodki.title`, `srodki.desc`, `srodki.allExercises`, `srodki.check`, `srodki.tryAgain`, `srodki.showAnswers`, `srodki.passed`, `srodki.noAnswer`, `srodki.type.matching`, `srodki.type.word-bank`, `srodki.type.mini-dialogue`, `srodki.bank`, `hdr.srodki`. Содержание упражнений (инструкции, подсказки, реплики, пояснения) — в данных, не в i18n.

---

## 7. Кабинет ученика и панель учителя

- В `summarizeModule` добавляются `exercisesTotal` и `exercisesPassed`. В таблице тем кабинета — колонка «Środki językowe: 3/5». В плитках сверху — «Ćwiczenia zaliczone: 12 / 68».
- В панели класса у учителя — та же цифра в карточке ученика. На странице ученика учитель видит по каждому модулю список упражнений с лучшим результатом и датой последней попытки.
- Кнопки «Kontynuuj» и «Wyczyść postęp» работают как раньше; очистка удаляет и `exercises`. Текст подтверждения расширить: «(fiszki, wyniki testów i ćwiczeń)».
- Правила в кабинете (`dash.rules`): добавить фразу «Ćwiczenie ze środków językowych jest zaliczone od {n}%».

---

## 8. Критерии приёмки

1. В каждом модуле есть вкладка «Środki językowe» между «Słownictwo» и «Wypowiedź pisemna»; счётчик показывает число упражнений модуля.
2. `#maria/czlowiek/srodki` открывает четыре упражнения из §4.4; `#maria/czlowiek/srodki/czl-sj-3` — только минидиалоги с ссылкой «← Wszystkie ćwiczenia (4)». «Kopiuj link» на карточке копирует именно этот адрес.
3. Dopasowanie: выбрать все пять пар по ключу §4.4 → «Sprawdź» → чип «5 / 5» и «Zaliczone». Поставить одну букву двум предложениям невозможно: при выборе занятой буквы она снимается с предыдущего предложения.
4. Bank słów: нажатие чипа «lot» вставляет слово в первый пустой пропуск, чип приглушается; напечатанное «shall» в пропуске 3 засчитывается, несмотря на заглавную букву в ключе.
5. Minidialogi: в czl-sj-4 выбор «a. He speaks excellent English» в первом диалоге после проверки показывает неверно, подсвечивает «b» и пояснение про третью реплику.
6. После «Sprawdź» и перезагрузки страницы результат виден на карточке («Zaliczone» или лучший результат) и в кабинете («Środki językowe: 1/4» у модуля Człowiek). «Pokaż odpowiedzi» результат не сохраняет.
7. Старый прогресс в `matura.progress.v3` без поля `exercises` читается без ошибок.
8. На ширине 360 px все три типа работают без горизонтальной прокрутки; Dopasowanie показывается в одну колонку.
9. Все три типа проходятся с клавиатуры: `Tab` по чипам и вариантам, `Enter` / `Space` выбирает, `Enter` в поле ввода запускает проверку.
10. Все новые строки интерфейса есть на польском и английском; проверка данных при сборке падает на упражнении с неверным ключом.

---

## 9. Вне объёма (можно сделать позже)

- Другие экзаменационные типы в этом разделе: wybór leksykalny w zdaniach (A/B/C внутри предложения), parafrazy, tłumaczenie fragmentów — пока остаются в тесте по грамматике.
- Перетаскивание слов из рамки в пропуски и линии между колонками (как на сайте учебника).
- Озвучивание диалогов («Listen») и диктовка ответа голосом.
- Автоматическая генерация упражнений из лексики модуля.
- Сквозной тренажёр «Środki językowe» по всем модулям сразу (случайные 10 упражнений из разных тем).

---

## 10. Открытые вопросы

Вопросы закрыты: реализованы значения в скобках.

1. Переносить ли существующие вопросы типа `mini-dialogue` из теста по грамматике в новый раздел? (Да: новые минидиалоги пишутся только сюда; единственный вопрос `test-10` в Człowiek переносится в `czl-sj-3` как четвёртый пункт, тип `mini-dialogue` из `QuestionType` теста убирается.)
2. Английская подпись вкладки: «Use of English» или «Language in use»? («Use of English»)
3. Порог зачёта упражнения: 80 % или 100 %? (80 %, как у теста; упражнения короткие, но ошибка в одном пункте из пяти не должна обнулять зачёт.)
4. Нужен ли переключатель «Pokaż tłumaczenia» для пояснений в этом разделе, если язык переводов в настройках — русский? (Да, тот же переключатель, что в Słownictwo.)
5. Сколько упражнений на модуль в первой версии: 4 или 6? (4 на модуль, 56 всего; потом доводим до 6.)

---

## 11. Отступления при реализации

- Спека писалась до сохранения работы ученика. `normalise` и `isGapCorrect` уже были вынесены, поэтому `app/src/lib/answers.ts` не создан, а логика проверки лежит в `app/src/languageUse.ts`.
- Сохраняется только результат (`best`, `last`, `attempts`, `lastAt`), как в §5.2. Ответы, введённые в упражнение, живут до ухода со страницы, в отличие от `gapWork` под текстами.
- «Sprawdź» на полностью пустом упражнении показывает ключ, но попыткой не считается, как у пропусков под текстами.
- Событие `exercise_checked` не отправляется: журнала событий в приложении пока нет.
- Строка диалога с пропуском получила необязательное поле `after`: в `czl-sj-3` пункт 1 текст идёт после пропуска.
- `test-10` стал минидиалогом с целыми репликами и тремя вариантами (четвёртый вариант убран), поэтому инструкция `czl-sj-3` говорит о пунктах 1–4. В `czl-sj-4` инструкция называет варианты A, B, C, как в интерфейсе.
- Ряд чипов Dopasowanie имеет `role="group"` и `aria-pressed`, а не `radiogroup`: `Tab` должен ходить по каждому чипу.
- Варианты минидиалогов, которых нет в §4.4, дописаны при наполнении.
- Текст подтверждения очистки: «(statusy fiszek, wyniki testów i ćwiczeń, wykonane zadania)», чтобы сохранить уже существующее упоминание о заданиях.
- Сводка по упражнениям для ученика и учителя показана в блоке «Wykonane zadania».
- Проверка данных подключена плагином в `vite.config.ts`: запускается при старте `vite` и при сборке.

---

## 12. Чеклист задач

**Выполнено: 63 / 67.** Порядок важен: после каждого этапа сайт собирается (`npm run build`) и остаётся рабочим. Отмечать `[x]` по мере выполнения, рядом с задачей можно дописывать коммит.

Решения по открытым вопросам §10 для этого чеклиста: минидиалоги переносим из теста в новый раздел, подпись «Use of English», зачёт от 80 %, переводы пояснений через общий переключатель, 4 упражнения на модуль.

### Этап 1. Типы, данные, прогресс

Готово, когда: `npm run build` проходит, в данных есть четыре упражнения Człowiek, в `localStorage` можно сохранить результат упражнения. В интерфейсе пока ничего не меняется.

- [x] **1.1** [types/index.ts](../app/src/types/index.ts): добавить `'srodki'` в `SectionType`.
- [x] **1.2** [types/index.ts](../app/src/types/index.ts): типы `LanguageUseExerciseType`, `LanguageUseExerciseBase`, `MatchingExercise`, `WordBankExercise`, `MiniDialogueExercise`, `LanguageUseExercise` по §5.1.
- [x] **1.3** Создать `app/src/data/languageUseExercises.ts` с `languageUseExercisesByModule: Record<string, LanguageUseExercise[]>` и комментарием о формате (как в `vocabularyExercises.ts`).
- [x] **1.4** Наполнить `czl-sj-1` (Dopasowanie) по §4.4 с ключом и пояснениями к каждой паре.
- [x] **1.5** Наполнить `czl-sj-2` (Bank słów) по §4.4; `alternatives` не нужны.
- [x] **1.6** Наполнить `czl-sj-3` (Minidialogi, 3 пункта) по §4.4 с пояснениями, почему другие варианты не подходят.
- [x] **1.7** Наполнить `czl-sj-4` (Minidialogi, 2 пункта, с `tip`) по §4.4.
- [x] **1.8** Функция `validateLanguageUseExercises()` рядом с данными: id уникальны во всех модулях; `matching` — число реплик равно числу предложений, каждый `answers[promptId]` указывает на существующую реплику, каждая реплика использована ровно один раз; `word-bank` — ровно один `___` в предложении, `answer` есть в `bank`; `mini-dialogue` — ровно одна реплика `null`, три `options`, `correctIndex` в пределах. Вызывать при старте в `main.tsx` в `import.meta.env.DEV` и в существующем скрипте проверки данных, если он есть.
- [x] **1.9** [progress-context.ts](../app/src/progress-context.ts): поле `exercises?` в `ModuleProgress` по §5.2, константа `EXERCISE_PASS_SCORE = 80`, метод `saveExerciseResult` в `ProgressValue`.
- [x] **1.10** [progress.tsx](../app/src/progress.tsx): реализовать `saveExerciseResult(moduleId, exerciseId, scorePercent)` по образцу `saveTestResult` (ограничение 0–100, `best`, `last`, `attempts + 1`, `lastAt`), добавить в `value`.
- [x] **1.11** Проверить вручную в консоли, что старый `matura.progress.v3` без `exercises` читается и после сохранения результата поле появляется только у нужного модуля.

### Этап 2. Маршрут и вкладка

Готово, когда: вкладка «Środki językowe» видна в каждом модуле, `#maria/czlowiek/srodki` и `#maria/czlowiek/srodki/czl-sj-2` открываются (пока с заглушкой), неизвестный id падает на весь раздел.

- [x] **2.1** [App.tsx](../app/src/App.tsx): `'srodki'` в `moduleSections` между `'slownictwo'` и `'pisanie'`.
- [x] **2.2** [App.tsx](../app/src/App.tsx): ветка `section === 'srodki'` в `validItem` — id из `languageUseExercisesByModule[moduleId]`.
- [x] **2.3** [i18n.ts](../app/src/i18n.ts): `tab.srodki` («Środki językowe» / «Use of English»), `hdr.srodki` («Środki» / «Use of English»).
- [x] **2.4** [ModuleHeader.tsx](../app/src/components/ModuleHeader.tsx): вкладка `srodki` с `count` = число упражнений модуля; новый проп `exercisesPassed` и строка метаданных «Środki: n/m», когда `n > 0`.
- [x] **2.5** [App.tsx](../app/src/App.tsx): временная заглушка `activeSection === 'srodki'` → `<div>` с названием модуля, чтобы этап можно было проверить до компонентов.
- [x] **2.6** Проверить адреса: `#maria/czlowiek/srodki`, `#maria/czlowiek/srodki/czl-sj-2`, `#maria/czlowiek/srodki/nope` (→ весь раздел), `#srodki` (→ первый модуль).

### Этап 3. Общие части раздела

Готово, когда: раздел показывает карточки четырёх упражнений с шапкой, подсказкой, инструкцией и кнопками, но тело упражнения ещё пустое; режим одного упражнения работает.

- [x] **3.1** [i18n.ts](../app/src/i18n.ts): строки `srodki.title`, `srodki.desc`, `srodki.allExercises`, `srodki.check`, `srodki.tryAgain`, `srodki.showAnswers`, `srodki.passed`, `srodki.noAnswer`, `srodki.bank`, `srodki.type.matching`, `srodki.type.word-bank`, `srodki.type.mini-dialogue`, `srodki.result` («Wynik» / «Score») на pl и en.
- [x] **3.2** Вынести `normalise` и `isGapCorrect` из [VocabularyView.tsx](../app/src/components/VocabularyView.tsx) в `app/src/lib/answers.ts`; `VocabularyView` импортирует их оттуда. Поведение не меняется. *(не понадобилось: `normalise` уже в [text.ts](../app/src/text.ts), `isGapCorrect` в [progressSummary.ts](../app/src/progressSummary.ts))*
- [x] **3.3** Создать `app/src/components/language-use/LanguageUseView.tsx`: `SectionTitle` с названием и описанием, переключатель переводов (как в Słownictwo), список карточек, режим одного упражнения по `exerciseId` с ссылкой «← Wszystkie ćwiczenia (n)», `scrollTo(0)` при смене `exerciseId`, пустое состояние «Ćwiczenia dla tego tematu wkrótce».
- [x] **3.4** Создать `app/src/components/language-use/ExerciseCard.tsx`: шапка (номер, чип `functionLabel`, чип типа, чип уровня, `CopyLinkButton` с `rest = <module>/srodki/<id>`), `Callout` с `tip`, инструкция, слот для тела, ряд кнопок «Sprawdź / Spróbuj ponownie / Pokaż odpowiedzi», чип результата «k / n» и «Zaliczone ✓» при `best ≥ EXERCISE_PASS_SCORE`.
- [x] **3.5** В `ExerciseCard` общая машина состояний: `idle → checked`, `reset`, `reveal`; `onCheck` считает `score` и вызывает `saveExerciseResult`; `reveal` результат не сохраняет; `Enter` в теле упражнения вызывает `check`.
- [x] **3.6** [App.tsx](../app/src/App.tsx): заменить заглушку на `LanguageUseView` с пропсами `moduleId`, `exercises`, `exerciseId={route.item}`, `moduleTitle`, `results={currentProgress?.exercises}`, `onResult`.
- [x] **3.7** `ModuleHeader` получает `exercisesPassed` из прогресса (считать в `App.tsx` рядом с `masteredCardsMap`).

### Этап 4. Три типа упражнений

Готово, когда: все критерии приёмки 3–5 и 9 из §8 проходят на Człowiek.

- [x] **4.1** `MatchingBody.tsx`: раскладка две колонки ≥ 640 px / одна колонка ниже (реплики сверху), предложения 1–n, реплики a–n.
- [x] **4.2** `MatchingBody.tsx`: чипы-буквы под каждым предложением; выбор занятой буквы снимает её с предыдущего предложения; занятая буква приглушена; `role="radiogroup"` на ряд, `aria-pressed` на чипе.
- [x] **4.3** `MatchingBody.tsx`: после проверки зелёный / красный чип, у неверного — буква правильного ответа и пояснение; у реплики справа — номер предложения; `reveal` расставляет все пары.
- [x] **4.4** `WordBankBody.tsx`: рамка чипов из `bank`; использованное слово приглушено (`disabled`), лишнее остаётся активным.
- [x] **4.5** `WordBankBody.tsx`: предложения с `InlineInput` на месте `___`; клик по чипу вставляет слово в пропуск с фокусом, иначе в первый пустой; проверка через `isGapCorrect`.
- [x] **4.6** `WordBankBody.tsx`: после проверки подсветка, правильное слово и пояснение у неверного; `reveal` заполняет все пропуски.
- [x] **4.7** `MiniDialogueBody.tsx`: пункты с репликами `X:` / `Y:` (подписи приглушённые), пропуск `___`, три `OptionCard` A / B / C, `selected` при выборе.
- [x] **4.8** `MiniDialogueBody.tsx`: после проверки `correct` / `wrong`, верный вариант подсвечен всегда, пояснение под пунктом; пункт без выбора — неверный с подписью «Nie wybrano odpowiedzi».
- [x] **4.9** `ExerciseCard` выбирает тело по `exercise.type`; `score = верных / всех × 100`.
- [x] **4.10** Проверка с клавиатуры всех трёх типов: `Tab`, `Enter` / `Space`, `Enter` в поле запускает проверку.
- [x] **4.11** Проверка на 360 px: без горизонтальной прокрутки, Dopasowanie в одну колонку, `OptionCard` не обрезает текст.

### Этап 5. Кабинет ученика и панель учителя

Готово, когда: критерий приёмки 6 из §8 проходит, панель учителя показывает число зачтённых упражнений.

- [x] **5.1** [progressSummary.ts](../app/src/progressSummary.ts): `exercisesTotal` и `exercisesPassed` в `ModuleSummary`, суммы в `UserSummary`; `startedModules` учитывает упражнения.
- [x] **5.2** [DashboardView.tsx](../app/src/components/DashboardView.tsx): плитка «Ćwiczenia zaliczone: k / n» и колонка «Środki językowe» в таблице тем; кнопка «Środki» рядом с «Fiszki» / «Gramatyka» в строке темы.
- [x] **5.3** [TeacherDashboardView.tsx](../app/src/components/TeacherDashboardView.tsx): число зачтённых упражнений в карточке ученика.
- [x] **5.4** Страница ученика у учителя: раскрывающийся список упражнений модуля с лучшим результатом, попытками и датой последней попытки.
- [x] **5.5** [i18n.ts](../app/src/i18n.ts): `dash.rules` дополнить фразой про зачёт упражнений от {n}%; `dash.resetConfirmMine` / `dash.resetConfirmStudent` — «(fiszki, wyniki testów i ćwiczeń)»; `dash.exercises`, `teacher.exercises`.
- [x] **5.6** Проверить «Wyczyść postęp»: поле `exercises` очищается вместе с остальным.

### Этап 6. Перенос минидиалогов из теста

Готово, когда: в тестах по грамматике нет типа `mini-dialogue`, а `test-10` живёт в `czl-sj-3`.

- [x] **6.1** Перенести `test-10` из [module1_czlowiek.ts](../app/src/data/modules/module1_czlowiek.ts) в `czl-sj-3` четвёртым пунктом (вариант с `see eye to eye`), пояснение из `explanation`.
- [x] **6.2** Убрать `'mini-dialogue'` из `QuestionType`, ветку в [InteractiveTestView.tsx](../app/src/components/InteractiveTestView.tsx) и ключи `type.mini-dialogue` из i18n.
- [x] **6.3** [i18n.ts](../app/src/i18n.ts): `test.count` без «minidialogi» (pl и en).
- [x] **6.4** Проверить, что тест Człowiek показывает на один вопрос меньше и счётчик вкладки «Gramatyka» совпадает.

### Этап 7. Наполнение остальных модулей

Готово, когда: в каждом из 14 модулей четыре упражнения (`matching` + `word-bank` + 2 × `mini-dialogue`), валидация данных проходит.

- [x] **7.1** Miejsce zamieszkania (`dom-sj-1…4`)
- [x] **7.2** Edukacja (`edu-sj-1…4`)
- [x] **7.3** Praca (`praca-sj-1…4`)
- [x] **7.4** Życie prywatne (`zp-sj-1…4`)
- [x] **7.5** Żywienie (`zyw-sj-1…4`)
- [x] **7.6** Zakupy i usługi (`zak-sj-1…4`)
- [x] **7.7** Podróżowanie i turystyka (`pod-sj-1…4`)
- [x] **7.8** Kultura (`kul-sj-1…4`)
- [x] **7.9** Sport (`sp-sj-1…4`)
- [x] **7.10** Zdrowie (`zd-sj-1…4`)
- [x] **7.11** Nauka i technika (`nt-sj-1…4`)
- [x] **7.12** Świat przyrody (`prz-sj-1…4`)
- [x] **7.13** Państwo i społeczeństwo (`pan-sj-1…4`)
- [ ] **7.14** Вычитка всего наполнения учителем: естественность реплик, правдоподобие дистракторов, польские пояснения, уровень P/R. *(ждёт учителя: черновик написан без его вычитки)*

### Этап 8. Проверка и выпуск

- [x] **8.1** Пройти критерии приёмки §8 локально под Maria и в панели учителя без входа на сервер.
- [x] **8.2** Проверка доступности раздела: имена у чипов и вариантов.
- [x] **8.3** Обновить [README.md](../README.md): новый раздел, формат данных `languageUseExercises.ts`, как добавить упражнение.
- [x] **8.4** Обновить [Spec for Matura.md](Spec%20for%20Matura.md): в «Архитектуре каждого модуля» шесть разделов, минидиалоги в Środki językowe.
- [x] **8.5** Закрыть открытые вопросы §10.
- [ ] **8.6** Пройти критерии приёмки §8 на Preview под Maria и под учителем со входом на сервер.
- [ ] **8.7** Lighthouse и контраст состояний correct / wrong.
- [ ] **8.8** Отметить в этой спеке статус «готово» (после 7.14, 8.6 и 8.7).
