# Спецификация: Календарь занятий и домашние задания

**Статус:** сделано, см. §16; не закоммичено · **Дата:** 08.11.2026, реализовано 09.11.2026 · **Связано с:** [Spec - Student cabinet and teacher notes.md](Spec%20-%20Student%20cabinet%20and%20teacher%20notes.md), [Регистрация пользователя.md](Регистрация%20пользователя.md), [Spec - Fiszki.md](Spec%20-%20Fiszki.md), [design_system.md](design_system.md)

---

## 1. Цель

1. У учителя есть **календарь занятий**: он ставит занятия на даты, в том числе повторяющиеся («каждый вторник в 17:00»), индивидуальные и групповые.
2. После занятия учитель отмечает, **как оно прошло**: состоялось, отменено или перенесено, кто был, что делали. Прошедшие занятия образуют журнал.
3. К каждому занятию учитель задаёт **домашнее задание**. Ученик видит его у себя, со сроком и ссылками на нужные разделы сайта.
4. Задания, которые есть на сайте (текст с упражнениями, тест, упражнение Środki językowe, эссе), **засчитываются сами** по сохранённой работе ученика. Задания вне сайта («przeczytaj rozdział 3») ученик отмечает сам кнопкой «Zrobione».

Главный вопрос учителя перед занятием: «что я задавал и сделано ли». Ответ должен помещаться на одном экране, без поиска по заметкам.

---

## 2. Как устроено сейчас

| Что | Как сейчас | Где в коде |
|---|---|---|
| Класс | Ученики присоединяются к учителю по ссылке-приглашению, таблица `teacher_students` | [db-migrate.mjs](../app/scripts/db-migrate.mjs), [class.ts](../app/api/class.ts) |
| Заметки учителя | Приватный текст об ученике с тегами `homework` и `lesson`. Ученик их не видит. Дат занятий, сроков и статусов нет | [TeacherNotesPanel.tsx](../app/src/components/notes/TeacherNotesPanel.tsx), [notes.ts](../app/api/_lib/notes.ts) |
| Страница ученика у учителя | План (дата экзамена, уровень, цель), карточки от учителя, заметки, сохранённые работы | [TeacherStudentPage.tsx](../app/src/components/notes/TeacherStudentPage.tsx), [StudentPlanPanel.tsx](../app/src/components/notes/StudentPlanPanel.tsx) |
| Ссылка на задание | У каждого текста, упражнения и теста свой адрес (`#czlowiek/slownictwo/czl-txt-2`, `#czlowiek/srodki/czl-sj-2`, `#czlowiek/gramatyka/test`). «Kopiuj link» копирует его, чтобы отправить как домашнее задание | [App.tsx](../app/src/App.tsx), [CopyLinkButton.tsx](../app/src/components/CopyLinkButton.tsx) |
| Работа ученика | На сервере, по модулю. Есть время сохранения: `gapWork[textId].at`, `exercises[id].lastAt`, `test.lastAt`, `essay.at` | [progress-context.ts](../app/src/progress-context.ts), [progress.ts](../app/api/progress.ts) |
| Занятие в реальном времени | `LessonBar`: учитель выбирает ученика и добавляет ему карточки, пока они вместе читают текст | [LessonBar.tsx](../app/src/components/LessonBar.tsx) |
| API | 11 файлов в `app/api`. На тарифе Hobby можно не больше 12 функций | [Регистрация пользователя.md §19](Регистрация%20пользователя.md) |

**Следствия:**

- Домашнее задание сейчас живёт в приватной заметке учителя или в мессенджере. Ученик не видит его на сайте, учитель вручную сверяет, сделано ли.
- Сайт уже знает, сделал ли ученик упражнение и когда: это готовое основание для автозачёта.
- Новый API должен занять **один** файл, иначе следующему понадобится платный тариф (§9).

---

## 3. Решения

| # | Вопрос | Решение | Почему |
|---|---|---|---|
| 1 | Что в календаре | Расписание будущих занятий и журнал прошедших, одна сущность «занятие» | Решение 08.11.2026 |
| 2 | Повторяющиеся занятия | Серия «раз в неделю», занятия серии создаются в базе по мере того, как учитель листает календарь (§6.2) | Отдельные строки нужны, чтобы у каждого занятия были свой статус и своя домашка |
| 3 | Индивидуальные или групповые | Оба вида. В занятии 1 или больше учеников из класса | Решение 08.11.2026 |
| 4 | Кто видит домашку | Ученик, которому она задана. Статус «сделано» виден ему и учителю | Решение 08.11.2026 |
| 5 | Как засчитывается | Задание-ссылка засчитывается само по работе, сохранённой **после** того, как его задали. Задание-текст ученик отмечает сам. Учитель может засчитать вручную любое | §7.3 |
| 6 | Статусы занятия | Zaplanowane, Odbyte, Odwołane, Przeniesione | Решение 08.11.2026 |
| 7 | Оплата | Не делаем: ни цен, ни платежей, ни долгов. Сайт не ведёт деньги учителя | Решение 08.11.2026 |
| 8 | Видит ли ученик других участников группы | Нет. Видит «Zajęcia grupowe · 3 osoby» | Ученики одного учителя могут быть незнакомы; имя и почта — их данные |
| 9 | Часовой пояс | Все времена в `Europe/Warsaw`. В базе `timestamptz`, серии считаются в местном времени | Переход на летнее время не должен сдвигать «вторник 17:00» |
| 10 | Вид календаря | Неделя (7 колонок с карточками занятий) на широком экране, список по дням на узком. Без сетки по часам | Сетка по часам сильно дороже, а у репетитора 5–20 занятий в неделю. См. §14 |
| 11 | Приватная заметка о занятии | Не новое поле, а обычная заметка учителя с привязкой к занятию | Заметки уже защищены правилами §8.4 спеки кабинета; второй приватный текст — второе место, где можно ошибиться |
| 12 | Прошедшее занятие без отметки | Остаётся «Zaplanowane», в списке «Do uzupełnienia» | Журнал отражает то, что отметил учитель, а не догадку сайта |

---

## 4. Понятия

- **Zajęcia (занятие)** — время начала, длительность, участники, статус. Два текста: **Plan** (что будем делать, пишется до занятия) и **Co robiliśmy** (что сделали, пишется после). Оба видят участники.
- **Seria (серия)** — правило «каждую неделю в такой-то день и час, с такими-то учениками, с даты по дату». Порождает занятия.
- **Uczestnik (участник)** — ученик в занятии. У него своя явка.
- **Zadanie domowe (домашнее задание)** — набор пунктов со сроком, заданный одному или нескольким ученикам. Обычно привязано к занятию, на котором его задали.
- **Punkt (пункт задания)** — либо **ссылка** на раздел сайта, либо **текст**.

### 4.1. Статусы занятия

| Статус | Когда |
|---|---|
| `planned` — Zaplanowane | Создано, ещё не отмечено |
| `held` — Odbyte | Учитель отметил, что состоялось |
| `cancelled` — Odwołane | Отменено. Хранится, кто отменил: uczeń / nauczyciel |
| `moved` — Przeniesione | Перенесено на другое время. Создаётся новое занятие, у старого ссылка «→ 14.11, 17:00» |

Явка участника в состоявшемся занятии: `present` — obecny, `absent` — nieobecny, `excused` — usprawiedliwiony. По умолчанию `present`.

---

## 5. Роли и права

| Действие | Ученик | Учитель |
|---|---|---|
| Видеть занятия | ✅ только те, где он участник | ✅ свои |
| Видеть Plan и Co robiliśmy | ✅ своих занятий | ✅ |
| Видеть имена других участников | ❌ только число | ✅ |
| Создавать, менять, переносить, отменять занятия | ❌ | ✅ |
| Видеть домашку | ✅ заданную ему | ✅ свою |
| Отметить пункт-текст «Zrobione» | ✅ свой | ✅ за ученика |
| Засчитать пункт-ссылку вручную | ❌ | ✅ |
| Видеть статусы домашки других участников | ❌ | ✅ |
| Видеть приватную заметку о занятии | ❌ | ✅ |

Правило доступа то же, что для заметок: чужое занятие, чужая домашка или ученик не из класса — ответ `404`.

---

## 6. Календарь учителя

### 6.1. Где он

- Адрес `#kalendarz` открывает текущую неделю. `#kalendarz/2026-11-16` — неделя, в которую входит эта дата. `#kalendarz/z/<lessonId>` — открытое занятие (§6.4).
- Пункт **«Kalendarz»** в боковой панели учителя над списком модулей и в меню пользователя рядом с «Panel nauczyciela».
- Standalone-раздел в терминах `App.tsx`, как `dashboard`: `SectionType` получает `kalendarz`.

### 6.2. Неделя

Сверху вниз:

1. **Шапка** на `bg-hero`: «Kalendarz», под ним «10–16 listopada 2026». Кнопки ‹ / Dziś / › и **«Nowe zajęcia»** (primary).
2. **Плашка «Do uzupełnienia»**, если есть прошедшие занятия со статусом `planned`: «3 zajęcia czekają na uzupełnienie» и ссылки на них. Пропадает, когда все отмечены.
3. **Семь колонок** Pn–Nd. Сегодняшняя колонка выделена. В колонке карточки занятий по времени:

```
┌─────────────────────────┐
│ 17:00–18:00             │
│ Maria                   │
│ ● Zaplanowane           │
│ Zad. dom.: 2/3 · do 14.11│
└─────────────────────────┘
```

- Групповое занятие: имена через запятую, если не помещаются — «Maria, Evgeny +2».
- Цвет полосы слева по статусу: `planned` — нейтральный, `held` — success, `cancelled` и `moved` — приглушённый, текст зачёркнут.
- Строка домашки показывает задание, **заданное на этом занятии**: сколько учеников сделали всё / сколько всего и срок. У индивидуального занятия — сколько пунктов сделано: «2/3».
- Пустой день: ничего. Клик по пустому месту колонки открывает «Nowe zajęcia» с этой датой.

На узком экране (меньше `lg`) вместо колонок список: заголовок дня, под ним карточки; пустые дни пропускаются, сегодняшний день помечен «Dziś».

**Занятия серий.** При запросе недели сервер создаёт недостающие занятия всех серий учителя на эту неделю (§9). Так в базе есть только те занятия, которые кто-то видел, а не бесконечный ряд вперёд.

### 6.3. Новое занятие

Диалог (`Dialog` из `ui`). Поля:

| Поле | Значение по умолчанию | Правила |
|---|---|---|
| Uczniowie | Ученик, со страницы которого открыли, иначе пусто | 1 и больше из класса, мультивыбор чипами |
| Data | Выбранный день или сегодня | |
| Godzina | 17:00 | Шаг 15 минут |
| Czas trwania | 60 min | 30, 45, 60, 90, 120 или своё 15–240 |
| Powtarzaj | Nie | Nie / Co tydzień |
| Do kiedy | Дата экзамена ученика, иначе 30.06 текущего учебного года | Только при «Co tydzień» |
| Plan | Пусто | До 2000 символов, виден ученикам |

Если в это время у учителя уже есть занятие, под полем времени предупреждение «Masz już zajęcia o tej porze: Maria, 17:00–18:00». Сохранить всё равно можно.

### 6.4. Занятие

Открывается панелью справа поверх календаря (на узком экране — на весь экран), адрес `#kalendarz/z/<lessonId>`. Тот же вид открывается со страницы ученика.

1. **Заголовок**: «Wtorek, 11 listopada · 17:00–18:00», участники, статус-чип. Если занятие из серии — «Co tydzień we wtorki».
2. **Кнопки статуса** (видны, пока статус `planned`): «Odbyte», «Odwołaj», «Przenieś».
   - «Odwołaj» спрашивает, кто отменил (uczeń / nauczyciel).
   - «Przenieś» спрашивает новые дату и время. Создаётся новое занятие с теми же участниками и планом, домашка остаётся на старом. Старое получает `moved` и ссылку на новое.
   - Статус можно вернуть в `planned` («Cofnij»), кроме `moved`: перенос отменяется удалением нового занятия.
3. **Uczestnicy**: строка на каждого — имя (ссылка на страницу ученика), явка (у `held`). У группы — кнопка «Dodaj ucznia».
4. **Plan** и **Co robiliśmy** — два текстовых поля с автосохранением, как у заметок. Подпись «Widzą uczniowie».
5. **Fiszki z zajęć**: если в день занятия учитель добавил участникам карточки (`LessonBar`), здесь их число и ссылка: «Dodane fiszki: 8 (Maria)». Только чтение.
6. **Zadanie domowe** — редактор (§7.1).
7. **Prywatna notatka** — кнопка «Dodaj notatkę o zajęciach»: открывает обычный редактор заметки учителя с тегом `lesson`, привязанной к этому занятию (§8.2). Уже созданные заметки показываются здесь списком. Подпись «Widzisz tylko ty».

**Изменение занятия серии.** Если учитель меняет время, длительность или участников у занятия серии, спрашивается: «Tylko te zajęcia» / «Te i następne». Второе закрывает серию накануне этой даты и открывает новую с этой даты; уже созданные будущие занятия старой серии, у которых статус `planned`, нет домашки, текстов и заметок, удаляются и создаются заново по новой серии. Остальные будущие занятия не трогаются и показываются в предупреждении.

**Удаление.** «Usuń zajęcia» доступно только у `planned` без домашки, текстов и заметок. В остальных случаях — только отмена: журнал не должен терять записи. У занятия серии удаление удаляет одно занятие и запоминает дату как исключение (§8.1, `lesson_series_skips`), иначе сервер создаст его снова.

### 6.5. Панель класса

На [TeacherClassPage](../app/src/components/notes/TeacherClassPage.tsx) над списком учеников блок **«Dziś»**: сегодняшние занятия карточками, как в календаре, и ссылка «Cały kalendarz». Если занятий нет — «Dziś nie masz zajęć. Najbliższe: czwartek, 17:00 · Evgeny».

В карточке ученика две новые строки:

- «Następne zajęcia: wt 11.11, 17:00».
- «Zadanie domowe: 2/3 · do 14.11» или «Zaległe: 1» (error-тон), если срок прошёл.

### 6.6. Страница ученика

На [TeacherStudentPage](../app/src/components/notes/TeacherStudentPage.tsx) два новых раздела:

1. **Zajęcia** — ближайшее занятие и журнал прошедших, новые сверху: дата, статус, первые 120 символов «Co robiliśmy», домашка «3/3 ✓». Кнопка «Nowe zajęcia» с этим учеником.
2. **Zadania domowe** — все задания ученика, новые сверху, с пунктами и статусами (§7.3).

---

## 7. Домашнее задание

### 7.1. Как учитель задаёт

**Из занятия.** В панели занятия блок «Zadanie domowe»:

- «Dla kogo»: все участники (по умолчанию) или выбранные. Пункты одни на всех.
- «Termin»: начало следующего занятия этого ученика (у группы — следующего занятия этой группы или серии), иначе через 7 дней в 23:59. Меняется вручную.
- Пункты, по порядку, перетаскиваются:
  - **«Dodaj z kursu»** — выбор раздела сайта: тема → раздел → элемент (текст, упражнение, тест, правило, колода). Выбор сохраняет адрес вида `czlowiek/slownictwo/czl-txt-2`.
  - **«Dodaj tekstem»** — свободный текст до 500 символов: «Przeczytaj rozdział 3», «Napisz e-mail w zeszycie».
  - К пункту-ссылке можно дописать комментарий до 200 символов: «tylko zadania 1–3».

**Из курса.** Рядом с «Kopiuj link» у учителя кнопка **«Zadaj»** (иконка `ClipboardList`). Она открывает маленький диалог: кому (ученики класса, по умолчанию тот, кто выбран в `LessonBar`), куда — «Do zadania z ostatnich zajęć» (если задание на последнем прошедшем занятии ещё не просрочено) или «Do następnych zajęć». Пункт добавляется в домашку, при необходимости она создаётся. Так учитель собирает задание, пока листает материал.

**Без занятия.** Если у ученика нет ни прошлых, ни будущих занятий, «Zadaj» создаёт задание без занятия со сроком через 7 дней.

Изменения домашки видны ученику сразу. Отдельного «опубликовать» нет.

### 7.2. Что видит ученик

1. **Панель «Twoje postępy»** ([DashboardView](../app/src/components/DashboardView.tsx)) — первым блоком **«Zadanie domowe»**, если есть несданное:

```
Zadanie domowe · do czwartku 13.11, 17:00
  ✓ Człowiek · Słownictwo · „A rollercoaster of emotions”    8/10
  ○ Człowiek · Środki językowe · Ćwiczenie 2           [Otwórz]
  ○ Przeczytaj rozdział 3                           [Zrobione]
Następne zajęcia: wtorek 11.11, 17:00
```

   Пункт-ссылка открывает раздел. Пункт-текст отмечается кнопкой «Zrobione», повторный клик снимает отметку. Когда всё сделано, блок сворачивается в строку «Zadanie domowe zrobione ✓» и пропадает после срока.

2. **Страница «Zajęcia»** (`#zajecia`, пункт в боковой панели ученика, если у него есть хотя бы одно занятие или задание): ближайшие занятия, текущие задания, ниже журнал прошедших занятий с «Co robiliśmy» и заданной на них домашкой. Групповое занятие подписано «Zajęcia grupowe · 3 osoby».

3. **Счётчик** в боковой панели у пункта «Zajęcia»: число несделанных пунктов в заданиях, срок которых не прошёл. Просроченные — отдельной красной точкой.

4. **Внутри раздела**, открытого из домашки, над содержимым плашка «To jest zadanie domowe na 13.11» (по адресу раздела и списку заданий). Плашка исчезает, когда пункт засчитан.

### 7.3. Засчитывание

Статус пункта для одного ученика:

| Статус | Значение |
|---|---|
| `todo` — Do zrobienia | Работы после выдачи нет |
| `done` — Zrobione | Засчитано (сайтом, учеником или учителем) |
| `earlier` — Zrobione wcześniej | Работа есть, но сохранена до выдачи. Учитель видит дату и может засчитать одним кликом |

Правила для пунктов-ссылок. Время выдачи — момент, когда пункт добавили этому ученику (`assigned_at`).

| Раздел | Засчитывается, когда | Что показывается |
|---|---|---|
| Słownictwo, текст | `gapWork[textId].checked` и `at` ≥ выдачи | Лучший результат `best`/число пропусков; «z podpowiedzią», если `revealed` |
| Środki językowe, упражнение | `exercises[id].lastAt` ≥ выдачи | `best` %; ниже `EXERCISE_PASS_SCORE` — тон warning |
| Gramatyka, тест | `test.lastAt` ≥ выдачи | `last` %; ниже `GRAMMAR_PASS_SCORE` — тон warning |
| Pisanie | `essay.at` ≥ выдачи и в эссе есть текст | Число слов |
| Gramatyka, правило | Не считается сам: нет сигнала, что ученик прочитал | Ученик отмечает «Zrobione» |
| Opis zdjęcia | Не считается сам: у заметок нет времени | Ученик отмечает «Zrobione» |
| Fiszki, колода | Не считается сам: у статусов карточек нет времени | Ученик отмечает «Zrobione», рядом «Opanowane: 12 / 40» |

Если у ученика `revealed` (подсмотрел ответы), пункт засчитывается, но учитель видит пометку «z podpowiedzią». Отказывать в зачёте сайт не должен: решает учитель.

Статус считается **на клиенте** чистой функцией `homeworkItemStatus(item, progressState, assignedAt, tick)` из `ModuleProgress`, который уже есть и у ученика, и у учителя (`allStates`). Сервер хранит только ручные отметки (§8.2). Так засчитывание не нужно поддерживать в двух местах.

Учитель может у любого пункта: «Zalicz» (ставит отметку `teacher`) и «Cofnij zaliczenie». Ручная отметка учителя сильнее автоматики.

Статус задания для ученика: **Zrobione** — все пункты `done`; **Po terminie** — срок прошёл и не всё `done`; иначе **Do zrobienia** с «2/3».

---

## 8. Данные

### 8.1. Занятия

```sql
create table lesson_series (
  id uuid primary key default gen_random_uuid(),
  teacher_id text not null references users (id) on delete cascade,
  weekday smallint not null check (weekday between 1 and 7),     -- 1 = poniedziałek
  start_time time not null,                                        -- czas lokalny Europe/Warsaw
  duration_min smallint not null check (duration_min between 15 and 240),
  starts_on date not null,
  ends_on date not null,
  plan text not null default '' check (char_length(plan) <= 2000),
  created_at timestamptz not null default now()
);

create table lesson_series_students (
  series_id uuid not null references lesson_series (id) on delete cascade,
  student_id text not null references users (id) on delete cascade,
  primary key (series_id, student_id)
);

create table lesson_series_skips (                                 -- usunięte pojedyncze terminy serii
  series_id uuid not null references lesson_series (id) on delete cascade,
  occurrence_date date not null,
  primary key (series_id, occurrence_date)
);

create table lessons (
  id uuid primary key default gen_random_uuid(),
  teacher_id text not null references users (id) on delete cascade,
  series_id uuid references lesson_series (id) on delete set null,
  occurrence_date date,                                            -- dzień z serii; nie zmienia się przy edycji
  starts_at timestamptz not null,
  duration_min smallint not null check (duration_min between 15 and 240),
  status text not null default 'planned' check (status in ('planned', 'held', 'cancelled', 'moved')),
  cancelled_by text check (cancelled_by in ('student', 'teacher')),
  moved_to uuid references lessons (id) on delete set null,
  plan text not null default '' check (char_length(plan) <= 2000),
  summary text not null default '' check (char_length(summary) <= 5000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (series_id, occurrence_date)
);
create index lessons_teacher_time on lessons (teacher_id, starts_at);

create table lesson_participants (
  lesson_id uuid not null references lessons (id) on delete cascade,
  student_id text not null references users (id) on delete cascade,
  attendance text check (attendance in ('present', 'absent', 'excused')),
  primary key (lesson_id, student_id)
);
create index lesson_participants_student on lesson_participants (student_id);
```

### 8.2. Домашка

```sql
create table homework (
  id uuid primary key default gen_random_uuid(),
  teacher_id text not null references users (id) on delete cascade,
  lesson_id uuid references lessons (id) on delete set null,
  due_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table homework_items (
  id uuid primary key default gen_random_uuid(),
  homework_id uuid not null references homework (id) on delete cascade,
  position smallint not null,
  kind text not null check (kind in ('link', 'text')),
  target text,                                -- 'czlowiek/slownictwo/czl-txt-2' dla 'link'
  text text not null default '' check (char_length(text) <= 500),
  created_at timestamptz not null default now(),
  check ((kind = 'link') = (target is not null))
);

create table homework_students (
  homework_id uuid not null references homework (id) on delete cascade,
  student_id text not null references users (id) on delete cascade,
  assigned_at timestamptz not null default now(),
  primary key (homework_id, student_id)
);

create table homework_ticks (
  item_id uuid not null references homework_items (id) on delete cascade,
  student_id text not null references users (id) on delete cascade,
  by text not null check (by in ('student', 'teacher')),
  done_at timestamptz not null default now(),
  primary key (item_id, student_id)
);

alter table teacher_notes add column lesson_id uuid references lessons (id) on delete set null;
```

Если пункт добавлен в уже выданное задание, временем выдачи считается момент добавления пункта. Поэтому время выдачи пункта ученику — большее из `homework_students.assigned_at` и `homework_items.created_at`.

`target` проверяется на сервере тем же разбором, что `parseHash`: модуль, раздел и элемент должны существовать. Для этого `validItem` и данные модулей выносятся из `App.tsx` в общий модуль, доступный и функции API (§13, этап 1).

### 8.3. Удаление

- Ученик удаляет аккаунт: каскадом уходят его участие и отметки (RODO). Занятие, в котором не осталось участников, удаляется, если оно `planned` и в будущем; прошедшее остаётся у учителя без участников.
- Учитель убирает ученика из класса: ученик убирается из будущих `planned` занятий и серий. Прошлые занятия и домашка остаются, чтобы не испортить журнал; на странице такого ученика у учителя — плашка «Uczeń nie należy już do klasy». Ученик эти данные больше не видит.

---

## 9. API

Всё в **одном** файле `app/api/schedule.ts`, адресация по `?resource=` и методу, как в `auth.ts`. Тогда функций станет 12 из 12; следующий новый API придётся вписывать в существующий файл (§15, вопрос 2).

### 9.1. Учитель

| Метод | `resource` | Что делает |
|---|---|---|
| GET | `lessons&from=&to=` | Занятия в интервале (не больше 42 дней) с участниками и сводкой домашки. Перед ответом создаёт недостающие занятия серий в этом интервале |
| GET | `lesson&id=` | Одно занятие: участники, домашка, отметки, заметки с `lesson_id` |
| POST | `lessons` | Новое занятие или серия (`repeat: 'weekly', until`) |
| PATCH | `lesson&id=` | Поля занятия; для серии `scope: 'one' \| 'following'` |
| POST | `lesson-status&id=` | Статус, кто отменил, явка |
| POST | `lesson-move&id=` | Перенос: новое время → новое занятие |
| DELETE | `lesson&id=` | Удаление по правилам §6.4 |
| POST / PATCH / DELETE | `homework` | Задание: срок, ученики, пункты |
| POST / DELETE | `tick&item=&student=` | Ручной зачёт учителем |

### 9.2. Ученик

| Метод | `resource` | Что делает |
|---|---|---|
| GET | `my-lessons&from=&to=` | Свои занятия: время, длительность, статус, `plan`, `summary`, число участников. Без имён и явки других |
| GET | `my-homework` | Свои задания с пунктами и своими отметками. Без чужих отметок и списка учеников |
| POST / DELETE | `my-tick&item=` | Своя отметка «Zrobione»; только у пунктов `text` и у ссылок, которые не считаются сами (§7.3) |

### 9.3. Проверки

1. Каждый запрос учителя проверяет, что занятие или задание принадлежит ему (`teacher_id`), а ученик в его классе. Иначе `404`.
2. Ответы ученику собираются **отдельными запросами** с явным списком полей, а не урезанием ответа учителя: так имя или чужая явка не утекут при добавлении поля.
3. Заметки с `lesson_id` по-прежнему отдаются только из `/api/students/<id>/notes`; `schedule.ts` для ученика к `teacher_notes` не обращается вообще.
4. Тексты `plan` и `summary` выводятся как обычный текст, без HTML.
5. Лимиты: не больше 200 занятий в сутки на учителя (защита от ошибки в цикле), через существующий `rate_limits`.

---

## 10. Связь с тем, что уже есть

- **LessonBar.** Если сейчас идёт занятие (от начала до конца, плюс 15 минут), в нём заранее выбраны его участники, а в полоске написано «Zajęcia: Maria, 17:00–18:00». Карточки, добавленные в это время, попадают в блок «Fiszki z zajęć» (§6.4).
- **Заметки.** Тег `homework` в заметках остаётся для приватных мыслей о домашке. В подсказке под редактором заметки с этим тегом: «Zadanie, które ma zobaczyć uczeń, dodaj w kalendarzu».
- **Kopiuj link.** Не меняется; «Zadaj» стоит рядом и только у учителя.
- **Учитель без класса.** Календарь открывается, «Nowe zajęcia» показывает «Najpierw zaproś ucznia» и ссылку-приглашение.

---

## 11. Тексты интерфейса (pl / en)

| Ключ | pl | en |
|---|---|---|
| `cal.title` | Kalendarz | Calendar |
| `cal.new` | Nowe zajęcia | New lesson |
| `cal.today` | Dziś | Today |
| `cal.toFill` | {n} zajęcia czekają na uzupełnienie | {n} lessons need updating |
| `cal.repeat` | Powtarzaj co tydzień | Repeat weekly |
| `cal.until` | Do kiedy | Until |
| `cal.conflict` | Masz już zajęcia o tej porze: {who}, {time} | You already have a lesson then: {who}, {time} |
| `lesson.planned` / `held` / `cancelled` / `moved` | Zaplanowane / Odbyte / Odwołane / Przeniesione | Planned / Held / Cancelled / Moved |
| `lesson.plan` | Plan | Plan |
| `lesson.summary` | Co robiliśmy | What we did |
| `lesson.studentsSee` | Widzą uczniowie | Students can see this |
| `lesson.onlyYou` | Widzisz tylko ty | Only you can see this |
| `lesson.cancelBy` | Kto odwołał? Uczeń / Nauczyciel | Who cancelled? Student / Teacher |
| `lesson.scopeOne` / `scopeFollowing` | Tylko te zajęcia / Te i następne | This lesson only / This and following |
| `lesson.group` | Zajęcia grupowe · {n} osoby | Group lesson · {n} people |
| `hw.title` | Zadanie domowe | Homework |
| `hw.due` | do {date} | due {date} |
| `hw.fromCourse` | Dodaj z kursu | Add from the course |
| `hw.asText` | Dodaj tekstem | Add as text |
| `hw.assign` | Zadaj | Assign |
| `hw.done` | Zrobione | Done |
| `hw.earlier` | Zrobione wcześniej ({date}) | Done earlier ({date}) |
| `hw.overdue` | Po terminie | Overdue |
| `hw.accept` | Zalicz | Accept |
| `hw.withHint` | z podpowiedzią | with the key shown |
| `hw.banner` | To jest zadanie domowe na {date} | This is homework for {date} |

Даты: `pl-PL` / `en-GB`, день недели словом («wtorek 11.11»), время 24-часовое.

---

## 12. Критерии приёмки

**Календарь**

1. Учитель создаёт серию «вторник 17:00, 60 мин, Maria, до 30.06». На каждой неделе до 30.06 во вторник есть занятие; в неделе перехода на летнее время оно тоже в 17:00.
2. Учитель листает на 10 недель вперёд и обратно: занятия серии не дублируются (`unique (series_id, occurrence_date)`).
3. Удалённое занятие серии не появляется снова.
4. «Te i następne» со сменой времени на 18:00 меняет будущие пустые занятия, а занятие с уже заданной домашкой остаётся в 17:00 и попадает в предупреждение.
5. Перенос создаёт новое занятие; у старого статус «Przeniesione» и ссылка на новое; домашка осталась на старом.
6. Прошедшее неотмеченное занятие есть в «Do uzupełnienia».
7. На экране 375 px календарь — список по дням без горизонтальной прокрутки.

**Домашка**

8. Учитель задаёт Maria текст Słownictwo и пункт-текст. Maria видит задание первым блоком панели; ссылка открывает текст с плашкой «To jest zadanie domowe…».
9. Maria проверяет упражнения текста — пункт сам становится «Zrobione» у неё и у учителя, без перезагрузки у Maria и после обновления у учителя.
10. Если Maria делала этот текст до выдачи, пункт «Zrobione wcześniej (дата)», учитель засчитывает одним кликом.
11. Пункт-текст Maria отмечает «Zrobione» и снимает отметку. Пункт-ссылку на упражнение отметить вручную не может.
12. «Zadaj» из раздела курса добавляет пункт в задание последнего занятия, если оно не просрочено, иначе в задание следующего.
13. В групповом задании Evgeny не видит, сделала ли Maria, и не видит её имени.

**Доступ**

14. Ученик, подставивший чужой `id` занятия или задания в запрос, получает `404`.
15. Ни в одном ответе ученику нет имён других участников, их явки и отметок, заметок учителя. Проверяется тестом на каждый ответ из §9.2.
16. Файлов в `app/api` не больше 12.

---

## 13. Задачи

### Этап 1. Подготовка
1. Вынести разбор адреса (`parseHash`, `validItem`) и список модулей из `App.tsx` в модуль, который можно импортировать в функцию API без React.
2. Утилиты времени для `Europe/Warsaw`: «местные дата и время → `timestamptz`», начало и конец недели. Без новых зависимостей, через `Intl.DateTimeFormat`.

### Этап 2. База и API
1. Таблицы §8 в [db-migrate.mjs](../app/scripts/db-migrate.mjs), повторяемо.
2. `app/api/schedule.ts` и `_lib/schedule.ts`: занятия, серии, создание недостающих занятий, статусы, перенос.
3. Домашка и отметки.
4. Тесты прав (§12, 14–16).

### Этап 3. Календарь учителя
1. Раздел `kalendarz`: неделя, список на узком экране, «Do uzupełnienia».
2. Диалог «Nowe zajęcia», конфликт по времени.
3. Панель занятия: статусы, перенос, участники, Plan / Co robiliśmy, приватная заметка.
4. Пункт в боковой панели и в меню пользователя.

### Этап 4. Домашка
1. `homeworkItemStatus` и тесты на каждую строку таблицы §7.3.
2. Редактор задания в панели занятия, выбор раздела курса.
3. Кнопка «Zadaj» рядом с «Kopiuj link».
4. Блок на панели ученика, страница `#zajecia`, счётчик в боковой панели, плашка в разделе.

### Этап 5. Связи и выпуск
1. Блок «Dziś» и строки в карточке ученика на панели класса.
2. `LessonBar` выбирает участников текущего занятия.
3. Проверка на тестовых аккаунтах учителя и двух учеников, скриншоты 375 / 1280 px.

---

## 14. Вне объёма

- Сетка по часам, вид месяца, перетаскивание занятий мышью.
- Синхронизация с Google Calendar и выгрузка `.ics`.
- Напоминания по почте о занятии и о сроке домашки (письма уже умеет Resend, это следующий шаг).
- Ученик сам записывается, просит перенос или отменяет занятие.
- Комментарий учителя к выполненной домашке, оценки.
- Оплата в любом виде: цены занятий, ставки, платежи, долги, пакеты, счета (решение 08.11.2026).
- Ссылка на видеозвонок у занятия.
- Повторы реже или чаще, чем раз в неделю.

---

## 15. Открытые вопросы

1. **Отмечать прошедшие занятия автоматически?** Сейчас неотмеченное занятие висит в «Do uzupełnienia». Можно через 24 часа считать его «Odbyte».
2. **Лимит функций Vercel.** После `schedule.ts` занято 12 из 12. Перейти на Pro или заранее собрать мелкие файлы (`me`, `notes-summary`) в один?
3. **Срок «до следующего занятия» у группы, где у учеников разные следующие занятия.** Сейчас берётся следующее занятие этой группы или серии; если его нет — 7 дней.

---

## 16. Как сделано (09.11.2026)

Все этапы §13 выполнены. Где код расходится с текстом выше — ниже; сама спека не правилась.

**Где что лежит**

| Что | Файлы |
|---|---|
| Маршруты, вынесенные из `App.tsx` | [routing.ts](../app/src/routing.ts): `parseHash`, `toHash`, `validItem`, `pageTargets` |
| Цели домашки | [courseTargets.ts](../app/src/courseTargets.ts): разбор `czlowiek/slownictwo/czl-txt-2`, подписи, список страниц темы |
| Засчитывание | [homework.ts](../app/src/homework.ts): `homeworkItemStatus`, `selfTickable`, `homeworkProgress`, `defaultDueAt` |
| Время | [time.ts](../app/src/time.ts): всё в `Europe/Warsaw` через `Intl`, в том числе `fromWarsaw` для ввода даты и времени |
| Данные в браузере | [scheduleProvider.tsx](../app/src/scheduleProvider.tsx): у учителя занятия −10…+31 день и домашка класса, у ученика свои занятия и задания, опрос раз в минуту |
| Сервер | [api/schedule.ts](../app/api/schedule.ts) (12-я и последняя функция), [api/_lib/schedule.ts](../app/api/_lib/schedule.ts), [api/_lib/scheduleShapes.ts](../app/api/_lib/scheduleShapes.ts) |
| Экраны | [components/schedule/](../app/src/components/schedule/): `CalendarPage`, `LessonPanel`, `LessonFormDialog`, `HomeworkEditor`, `AssignDialog`, `StudentScheduleTabs`, `TodayBlock`, `HomeworkBlock`, `StudentLessonsPage`, `HomeworkBanner` |
| Тесты | `vitest` (новая dev-зависимость, `npm test`): время и переход на летнее время, каждая строка таблицы §7.3, разбор целей и адресов, формы ответов ученику без лишних полей, проверки тела запроса |

**Отличия от текста спеки**

- **Цель на сервере проверяется по форме, а не по данным курса** (§8.2). Данные модулей (~400 КБ) в функцию не загружаются, как и раньше у заметок: сервер проверяет id темы, имя раздела и синтаксис элемента; настоящие страницы предлагает только клиент («Dodaj z kursu» и «Zadaj»). Если страница из курса исчезнет, пункт покажется как «Strona, której już nie ma» и останется ручным.
- **Порядок пунктов** меняется стрелками «wyżej / niżej», не перетаскиванием (§7.1).
- **Домашка сохраняется кнопкой «Zapisz»**, а не на лету; «Plan» и «Co robiliśmy» — на лету, как заметки (§6.4).
- **Заметка о занятии** создаётся и читается только через `/api/students/<id>/notes` (с новым полем `lessonId`); `schedule.ts` к `teacher_notes` не обращается ни для кого, строже, чем §9.1.
- **Обзор для панели класса и «Zadaj»** — один запрос `GET ?resource=overview` (занятия −10…+31 день плюс домашка со сроком не старше 30 дней); отдельного `GET student&id=` для страницы ученика тоже хватило.
- **«Do uzupełnienia»** считается из обзора и открытой недели, поэтому занятие, прошедшее больше 10 дней назад и не отмеченное, попадёт в плашку только когда откроют его неделю.
- **Участников занятия** меняют в диалоге «Zmień termin» (там же серия: «Tylko te zajęcia / Te i następne»); кнопка «Dodaj ucznia» ведёт туда же.
- **`LessonBar`**: при идущем занятии (от начала до конца + 15 минут) выбирается его первый участник и показывается «Zajęcia: Maria, 17:00–18:00».
- **Удаление ученика из класса** убирает его из будущих запланированных занятий и серий; **удаление аккаунта** ученика стирает запланированные занятия, в которых никого не осталось (§8.3).
- Проверка на 375 px делалась только по вёрстке (список по дням ниже `lg`), скриншота узкого экрана нет: headless Chrome на Windows не держит ширину меньше ~500 px.

**Что проверено вручную** на `vercel dev` с тестовыми аккаунтами `design-teacher` (учитель) и `design-test` (ученик в его классе): создание еженедельной серии, панель занятия, домашка из панели (страница курса + текст), «Zadaj» из раздела Środki językowe («Do następnych zajęć»), серия на следующей неделе, у ученика — блок на панели со статусом «Zrobione wcześniej» для упражнения, сделанного до выдачи, отметка «Zrobione» и «Odznacz», счётчик в боковой панели, страница `#zajecia`, плашка «To jest zadanie domowe…» в тексте.
