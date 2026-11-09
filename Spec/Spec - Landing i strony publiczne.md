# Спецификация: Лендинг и публичные страницы (продажи и SEO)

**Статус:** сделано в первом приближении, см. §20; не закоммичено · **Дата:** 09.11.2026, реализовано 09.11.2026 · **Связано с:** [Social Media/Концепция.md](../Social%20Media/Концепция.md), [Регистрация пользователя.md](Регистрация%20пользователя.md), [Spec for Matura.md](Spec%20for%20Matura.md), [design_system.md](design_system.md), [Illustrations for Antigravity.md](Illustrations%20for%20Antigravity.md)

Язык сайта: **польский**. Спека написана по-русски, как остальные; все тексты страниц, адреса и мета-теги в ней даны по-польски и идут в продукт как есть, после вычитки носителем (§16).

---

## 1. Цель

1. **Продавать.** Посетитель из поиска или из соцсетей за одну сессию понимает, что это за продукт, проходит целую тему «Człowiek» без регистрации и заводит бесплатный аккаунт. Родитель понимает, за что платит, и оставляет почту или покупает доступ, когда появится оплата.
2. **Приводить людей из Google.** Польские запросы про матуру из английского («matura z angielskiego słownictwo», «opis obrazka matura angielski», «środki językowe matura ćwiczenia», «jak przygotować się do matury z angielskiego») должны находить наши страницы. Это постоянный бесплатный канал в дополнение к соцсетям.
3. **Быть посадочной для соцсетей.** Ссылка из профиля TikTok, Instagram и YouTube ведёт не на экран входа, а на страницу, где видно задание и продукт.

Главный сценарий ученика: Maria увидела видео про word formation → перешла по ссылке в профиле на страницу темы «Człowiek» → нажала «Otwórz bez logowania» → в приложении без аккаунта прочитала текст, сделала упражнения Środki językowe и тест по грамматике → захотела открыть «Edukacja» → увидела «Ten temat wymaga darmowego konta» → зарегистрировалась, её ответы из «Człowiek» сохранились на аккаунте.

Главный сценарий родителя: мама гуглит «ile punktów trzeba na maturze z angielskiego» → попадает на статью о порогах → читает «Jak sprawdzić, czy dziecko jest gotowe» → открывает `/dla-rodzicow` → оставляет почту в списке ожидания или покупает доступ.

---

## 2. Как устроено сейчас

| Что | Как сейчас | Где в коде |
|---|---|---|
| Весь сайт | Одностраничное приложение, адреса после `#` (`#czlowiek/slownictwo`). Без сессии виден только вход и регистрация | [App.tsx](../app/src/App.tsx), [AuthGate.tsx](../app/src/components/auth/AuthGate.tsx), [routing.ts](../app/src/routing.ts) |
| Для Google | Один HTML с пустым `<div id="root">`, заголовок «Matura Angielski 2026», нет описания, OG-тегов, `sitemap.xml`, `robots.txt`. Адреса после `#` поисковик не индексирует. Фактически сайта для поисковика нет | [index.html](../app/index.html) |
| Публичные страницы | `#login`, `#register`, `#forgot`, `#join`, `#verify`, `#reset`, заглушки `#regulamin` и `#prywatnosc` | [userRoute.ts](../app/src/userRoute.ts), [AuthScreens.tsx](../app/src/components/auth/AuthScreens.tsx) |
| Открытый контент | Нет. Решение 7 спеки регистрации: «без сессии виден только экран входа». Открытый вопрос 2 там же: оставить ли часть открытой | [Регистрация пользователя.md §3, §17](Регистрация%20пользователя.md) |
| Хостинг | Vercel, тариф Hobby, `angelskimatura.vercel.app`. **12 функций из 12** заняты в `app/api`. Домена нет, имени продукта нет | [Регистрация пользователя.md §19](Регистрация%20пользователя.md), [Концепция.md §12](../Social%20Media/Концепция.md) |
| Контент | 14 тем CKE, 19 текстов с упражнениями, 56 упражнений Środki językowe, правила грамматики с тестами, описания фото по 6 шагам, тренажёр письма, колоды фишек. Всё в TypeScript-данных, адрес у каждого элемента | [modulesData.ts](../app/src/data/modulesData.ts), [vocabularyTexts.ts](../app/src/data/vocabularyTexts.ts), [languageUseExercises.ts](../app/src/data/languageUseExercises.ts) |
| Дизайн | Nunito с Google Fonts, токены в `index.css`: акцент `#17818F`, серая страница, карточки с тенью, тёмная боковая панель | [index.css](../app/src/index.css), [index.html](../app/index.html) |
| Иллюстрации | 18 плоских векторных картинок к текстам, один стиль | [Illustrations for Antigravity.md](Illustrations%20for%20Antigravity.md), `app/public/images/vocab/` |
| Языки | Интерфейс `pl`/`en`, переводы слов `pl`/`ru` | [i18n.ts](../app/src/i18n.ts) |
| Воронка из соцсетей | Описана: видео → ссылка на бесплатное упражнение → бесплатный слой (1–2 модуля) → платный слой; до запуска оплаты вместо продукта лист ожидания | [Концепция.md §9](../Social%20Media/Концепция.md) |
| Оплата | Не спроектирована: ни цен, ни платежей, ни тарифов | — |

**Следствия:**

- Поисковик не видит ни одной страницы: продающую и SEO-часть нельзя сделать внутри приложения с адресами после `#`, нужны обычные HTML-страницы с обычными адресами, и открытый контент должен лежать именно там.
- Функций API в приложении больше не добавить. Форма сбора почты может быть только новым действием в существующем файле.
- Ссылка из видео сейчас ведёт на экран входа: человек с TikTok ничего не увидит, пока не зарегистрируется. Нужен открытый кусок продукта, в который можно войти без аккаунта.
- В спеке регистрации уже есть перенос прогресса из браузера в новый аккаунт (§12.4). На нём можно построить гостевой режим: гость занимается, прогресс лежит в браузере, при регистрации переезжает.
- Без имени и домена сайт нельзя ни запустить, ни оформить аккаунты в соцсетях. Это блокер этапа 0 и здесь, и в концепции соцсетей.

---

## 3. Решения

| # | Вопрос | Решение | Почему |
|---|---|---|---|
| 1 | Где живут публичные страницы | **Статический сайт** в папке `site/` рядом с `app/`, на корневом домене `maturaenglish.pl`. Приложение переезжает на путь `maturaenglish.pl/app/` (адреса после `#` внутри остаются). Один домен, один проект Vercel | Приложение с адресами после `#` и входом невидимо для Google; его роутинг не трогаем. Один домен нужен, чтобы прогресс гостя (`localStorage`) и сессия были видны и сайту, и приложению; поддомен ломает это. Подробно §3.1 |
| 2 | Технология | **Astro** со статическим выводом, Tailwind 4 с теми же токенами, что в `index.css`. Интерактивные части (упражнения открытой темы, форма, отсчёт) — React-островки из **тех же компонентов, что в приложении**; данные тем импортируются из `app/src/data` | Готовый HTML на каждой странице, в том числе с текстами и упражнениями: Google видит содержимое, а не пустой `div`. Автоматические `sitemap.xml` и мета-теги, Markdown для блога, страницы генерируются из данных. Запасной вариант: Vite в режиме нескольких страниц с пререндером, но тогда блог и генерация страниц пишутся руками |
| 3 | Источник контента для страниц тем | Страницы `/tematy/<id>` собираются **из данных приложения** во время сборки (`app/src/data`), а не копируются | Одна правда: добавили текст или упражнение в приложение — страница темы обновилась сама. Числа «56 ćwiczeń», «14 tematów» тоже считаются при сборке |
| 4 | Что открыто без входа | **Все 14 тем имеют полное дерево страниц на сайте** (§8): каждая вкладка, каждый текст, упражнение и правило — страница с настоящим адресом и готовым HTML, открытая для захода и для Google. У **открытых** тем (`openModules`, сейчас «Człowiek») содержимое целиком и интерактив в островках, прогресс гостя в браузере и переносится в аккаунт. У **закрытых** тем страница показывает начало содержимого и плашку «Ten temat jest w pełnym dostępie: kup dostęp albo zaloguj się» (§8.6) | Решение 09.11.2026. Индексируются все темы, а не одна: сотни адресов с реальными словами и правилами. Закрытая страница честно говорит, что внутри и сколько стоит, вместо `404` или редиректа на вход. Это меняет решение 7 спеки регистрации («без сессии виден только вход») и закрывает её открытый вопрос 2 |
| 5 | Аудитория и порядок | Герой лендинга говорит с **учеником**; раздел и страница `/dla-rodzicow` — с **родителем** (он платит); страница `/dla-nauczycieli` есть, но только в подвале и в меню «Więcej» | По концепции соцсетей родитель — ЛПР, ученик — пользователь, учителя пока не аудитория. Панель учителя в продукте есть, поэтому страницу делаем, но не выносим вперёд (вопрос 2 в §18) |
| 6 | Целевое действие | До запуска оплаты: **бесплатная регистрация** (ученик) и **почта в список ожидания** (родитель). После: покупка на `/cennik` | То, что уже можно сделать сегодня. Список ожидания нужен и концепции соцсетей |
| 7 | Страница цен | Есть с первого дня: «Za darmo» и «Pełny dostęp» рядом, цена как заглушка `{cena}` до решения; кнопка платного тарифа до запуска оплаты ведёт на список ожидания | Родитель ищет цену первой; страница без цен лучше, чем без страницы. Сами платежи — отдельная спека |
| 8 | Аналитика | Без cookie: **Vercel Web Analytics** (уже на Vercel) или Plausible. Собственные события через тот же инструмент. Без Google Analytics и без баннера согласия | Баннер cookie снижает конверсию и требует управления согласием (RODO). Счётчики без cookie баннера не требуют |
| 9 | Форма сбора почты | Действия `lead` в существующем файле `app/api/account.ts` (`action=lead-subscribe|lead-confirm|lead-unsubscribe|contact`), таблица `leads` в той же базе Neon, **двойное подтверждение** письмом через Resend | Проект один, лимит 12 функций общий и исчерпан: новый файл невозможен, а группировка действий в одном файле уже принята в спеках уведомлений и регистрации. Подтверждение адреса нужно по RODO и отсекает мусор |
| 10 | Блог | Да, Markdown в `site/src/content/blog`, адреса `/blog/<slug>`. Каждый «атом» из соцсетей получает текстовую версию | Длинный хвост запросов; тот же контент, что уже производится для видео, без второй редакции |
| 11 | Факты об экзамене | Только из официальных материалов CKE (Informator, arkusze, sprawozdania) со ссылкой и датой «stan na». Никаких «100% zdawalności» | Тон концепции: спокойная уверенность, не обещаем результат. Ошибка в баллах роняет доверие родителя |
| 12 | Имя и домен | В спеке заглушки `{Nazwa}` и `maturaenglish.pl`. Без них этап 0 не закрывается | Решение владельца, критерии в [Концепция.md §4](../Social%20Media/Концепция.md) |
| 13 | Языки сайта | На запуске только польский. Адреса сразу без префикса для `pl`, с резервом `/ru/…` и `/en/…` на вторую очередь; `hreflang` появится вместе с ними | Основной рынок польский. Русская версия для семей мигрантов — отдельная очередь, но структура адресов не должна меняться |
| 14 | Дизайн | Та же система, что в приложении: Nunito, токены, карточки. Для сайта: крупнее типографика, иллюстрации из набора Antigravity, скриншоты приложения | Блог, сайт и продукт должны выглядеть одним целым ([Концепция.md §7](../Social%20Media/Концепция.md)) |
| 15 | Шрифт | Nunito **самостоятельно хостится** на сайте и в приложении, не с Google Fonts | Скорость (нет третьего домена в критическом пути) и RODO: загрузка с серверов Google передаёт им IP посетителя |
| 16 | Обратный отсчёт | На лендинге «Do matury {rok}: {n} dni», дата из конфига сайта | Создаёт срочность без паники; дата меняется раз в год |
| 17 | Приложение для поисковика | `maturaenglish.pl/app/` закрыт: `<meta name="robots" content="noindex">` в его `index.html`, `Disallow: /app/` в `robots.txt` сайта | Внутри нет ничего индексируемого сверх того, что уже есть на сайте, а экран входа в выдаче вредит |

### 3.1. Архитектура под SEO

Требование: сайт оптимизирован под поиск, и архитектура это поддерживает, а не борется с этим. Пять правил, из которых следует всё остальное.

1. **Контент — данные, а не экраны.** Темы, тексты, слова, упражнения и правила уже лежат в TypeScript-модулях `app/src/data`. Это единственный источник и для приложения, и для сайта. Ничего не копируется в Markdown руками; если странице сайта чего-то не хватает в данных (например, подтем CKE), поле добавляется в данные.
2. **Два слоя отрисовки, один набор компонентов.** Сайт (Astro) отдаёт каждую публичную страницу готовым HTML, собранным при сборке: текст, список слов, правило, условие упражнения — всё в разметке. Интерактив (проверка ответов, переворот карточки, счётчик слов) дорисовывают островки React. Островки — это **те же компоненты разделов**, что в приложении, поэтому у сайта и приложения не бывает двух версий одного упражнения.
3. **Компоненты разделов не знают, где работают.** Чтобы один компонент рендерился и в HTML при сборке, и в приложении, он получает данные через свойства, не трогает `window` во время рендера (только в эффектах) и пишет прогресс через интерфейс `ProgressStore` с двумя реализациями: серверной (аккаунт, как сейчас) и браузерной (гость, `localStorage`). Это главный рефакторинг спеки (задача 4.1); после него открытие ещё одной темы — одна строка в конфиге.
4. **У каждой публичной единицы контента настоящий адрес.** `/tematy/czlowiek/srodki/czl-sj-2` на сайте и `#czlowiek/srodki/czl-sj-2` в приложении — один и тот же объект; обе формы строит одна функция из `routing.ts` (`siteUrl(route)` и `appUrl(route)`), чтобы ссылки «Otwórz w aplikacji» и обратные «Zobacz na stronie» никогда не расходились с данными. Правила адресов — §5.
5. **Один домен.** Сайт на `maturaenglish.pl/`, приложение на `maturaenglish.pl/app/`. Общий `localStorage` переносит прогресс гостя в аккаунт без обходных путей, общая сессия позволяет сайту показать «Masz konto: otwórz w aplikacji», аналитика и Search Console в одном месте. Поддомен `app.` отвергнут: разные источники не делят ни хранилище, ни cookie без специальных костылей.

Что это даёт поисковику: не одну пустую страницу, а сотни адресов с содержанием (14 обзоров тем, все страницы открытой темы, хаб экзамена, статьи), связанных ссылками, с готовым HTML, одним `H1`, мета-тегами и разметкой schema.org. Что это даёт продукту: открытые и закрытые темы обслуживает один код, закрытое отличается от открытого только конфигом.

Чего архитектура **не** делает сейчас, но допускает: перенос самого приложения на обычные адреса внутри того же Astro-проекта (`/app/czlowiek/slownictwo` вместо `/app/#czlowiek/slownictwo`) как клиентские маршруты. Пока адреса после `#` не мешают: приложение закрыто от индексации, а его ссылки остаются рабочими.

---

## 4. Понятия

- **Strona (сайт)** — статические публичные страницы на `maturaenglish.pl`: лендинг, темы, статьи, цены. Без входа.
- **Aplikacja (приложение)** — то, что есть сейчас, на `maturaenglish.pl/app/`. Со входом.
- **Landing** — главная страница `/`. Одна цель: регистрация.
- **Strona tematyczna** — страница одной из 14 тем CKE на сайте, собранная из данных приложения.
- **Otwarty temat (открытая тема)** — тема, все страницы которой есть на сайте целиком и работают без аккаунта. Список в конфиге сайта: `openModules = ['czlowiek']`.
- **Gość (гость)** — посетитель открытой темы без сессии. Его прогресс живёт в `localStorage` под ключом `matura.guest.v1`.
- **ProgressStore** — интерфейс записи и чтения прогресса, который компоненты разделов получают извне: серверный в приложении, браузерный у гостя.
- **Lead** — почта, оставленная в форме на сайте, с ролью (uczeń / rodzic / nauczyciel) и источником.
- **CTA** — кнопка целевого действия. Главная на всём сайте одна: «Zacznij za darmo» → регистрация.
- **Atom** — единица контента из концепции соцсетей; на сайте становится статьёй.

---

## 5. Карта сайта

Очередь 1 — к запуску соцсетей (этап 1 концепции, декабрь 2026). Очередь 2 — до пика спроса (февраль 2027).

| Адрес | Что | Для кого | Главный запрос | CTA | Очередь |
|---|---|---|---|---|---|
| `/` | Лендинг (§6) | Ученик, родитель | `matura z angielskiego online`, `przygotowanie do matury z angielskiego` | Zacznij za darmo | 1 |
| `/tematy` | 14 тем CKE, сетка | Ученик | `tematy maturalne angielski`, `słownictwo maturalne angielski` | Открыть тему | 1 |
| `/tematy/<id>` ×14 | Обзор темы (§7.1) | Ученик | `<temat> matura angielski słownictwo`, например `człowiek matura angielski słownictwo` | Открытая: ссылки на разделы; закрытая: Zacznij za darmo | 1 |
| `/tematy/<id>/<sekcja>` ×6 ×14 | Раздел темы: slownictwo, srodki, gramatyka, opis-ilustracji, pisanie, fiszki (§8). Открытая тема — целиком; закрытая — начало и плашка доступа | Ученик | `słownictwo człowiek angielski`, `opis obrazka człowiek matura` | Открытая: следующий раздел; закрытая: Zobacz cennik / Zaloguj się | 1 |
| `/tematy/<id>/slownictwo/<textId>`, `/srodki/<exId>`, `/gramatyka/<ruleId>`, `/gramatyka/test` | Один текст, упражнение, правило или тест (§8), для всех 14 тем | Ученик | Длинный хвост: слова и правила из содержимого | Как у раздела | 1 |
| `/matura-z-angielskiego` | Как устроен экзамен (§7.2) | Родитель, ученик | `matura z angielskiego 2027`, `jak wygląda matura z angielskiego` | Dla rodziców / Zacznij | 1 |
| `/matura-z-angielskiego/punkty-i-progi` | Баллы, порог 30%, как считают | Родитель | `ile punktów trzeba na maturze z angielskiego`, `próg zdawalności matura angielski` | Dla rodziców | 1 |
| `/matura-z-angielskiego/czesc-ustna` | Устная часть, 6 шагов описания фото | Ученик | `matura ustna angielski opis obrazka`, `jak opisać obrazek matura angielski` | Opis ilustracji «Człowiek» bez logowania | 1 |
| `/matura-z-angielskiego/srodki-jezykowe` | Типы заданий Środki językowe | Ученик | `środki językowe matura angielski ćwiczenia`, `transformacje zdań matura angielski` | Ćwiczenia «Człowiek» bez logowania | 1 |
| `/matura-z-angielskiego/wypowiedz-pisemna` | E-mail, wpis na blogu, rozprawka, 4 критерия | Ученик | `rozprawka matura angielski`, `wypowiedź pisemna matura angielski przykłady` | Zacznij | 2 |
| `/matura-z-angielskiego/terminy` | Даты экзамена текущего года, что сдают когда | Родитель | `matura 2027 terminy angielski` | Lista oczekujących | 1 |
| `/dla-rodzicow` | Для родителя (§7.3) | Родитель | `jak pomóc dziecku przygotować się do matury z angielskiego` | Lista oczekujących / Zacznij | 1 |
| `/dla-nauczycieli` | Для учителя и репетитора (§7.4) | Учитель | `platforma dla korepetytora angielskiego`, `zadania domowe online dla uczniów` | Załóż konto nauczyciela | 2 |
| `/cennik` | Цены (§7.5) | Родитель | `{Nazwa} cennik` | Kup / Lista oczekujących | 1 |
| `/blog`, `/blog/<slug>` | Статьи (§7.6) | Все | Длинный хвост | По статье | 1 (5 статей), далее постоянно |
| `/gramatyka`, `/gramatyka/<ruleId>` | Правила из справочника с примерами | Ученик | `<правило> matura angielski`, например `mowa zależna matura angielski` | Test в приложении | 2 |
| `/o-nas` | Кто делает, метод (§7.7) | Родитель | `{Nazwa} opinie` | Kontakt | 1 |
| `/kontakt` | Почта, форма | Все | — | — | 1 |
| `/regulamin`, `/polityka-prywatnosci` | Юридические тексты | Все | — | — | 1 |
| `/404` | Не найдено, поиск по темам | — | — | Tematy | 1 |
| `/sitemap.xml`, `/robots.txt`, `/og/<strona>.png` | Технические | Google, соцсети | — | — | 1 |

Правила адресов: строчные буквы, без диакритики, дефисы (`/tematy/zycie-prywatne`, `/tematy/panstwo-spoleczenstwo`); идентификаторы тем, разделов и элементов те же, что в приложении, и адреса строятся одной функцией (§3.1, правило 4): `/tematy/czlowiek/srodki/czl-sj-2` ↔ `maturaenglish.pl/app/#czlowiek/srodki/czl-sj-2`. Раздел `opis-foto` приложения на сайте называется `opis-ilustracji` (так его ищут), соответствие в той же функции. Без завершающего слэша; второй вариант отвечает `301`. Приложение целиком под `/app/`, его `index.html` с `noindex`.

---

## 6. Лендинг `/`

Одна колонка, ширина контента 1120 px, на телефоне всё в один столбец. Порядок блоков фиксирован: сначала то, что нужно ученику, потом родителю.

### 6.1. Шапка

Слева логотип `{Nazwa}`. Меню: **Tematy**, **Matura**, **Cennik**, **Dla rodziców**, **Blog**. Справа: ссылка «Zaloguj się» → `/app/#login` и кнопка (primary) «Zacznij za darmo» → `/app/#register`. На телефоне меню за кнопкой, две правые ссылки остаются видны. Шапка прилипает при прокрутке, уменьшаясь по высоте.

### 6.2. Герой

```
┌──────────────────────────────────────────────────────────────┐
│  Do matury 2027: 178 dni                          (chip)     │
│                                                              │
│  Przygotuj się do matury z angielskiego                      │
│  tak, jak sprawdza ją CKE                              (H1)  │
│                                                              │
│  14 tematów, ćwiczenia jak w arkuszu, opis ilustracji        │
│  w 6 krokach i fiszki, które pamiętają, czego nie umiesz.    │
│                                                              │
│  [ Zacznij za darmo ]   Zobacz, jak to działa ↓              │
│  Bez karty. Konto w minutę.                                  │
│                                              ┌─────────────┐ │
│                                              │ zrzut ekranu│ │
│                                              │ ćwiczenia   │ │
│                                              └─────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

- Чип с отсчётом: дата из `site.config.ts` (`maturaDate`), число дней считается при сборке и уточняется скриптом на клиенте; после даты экзамена чип показывает «Matura {rok+1}: zaczynamy od nowa» и ссылку на `/matura-z-angielskiego/terminy`.
- Справа скриншот упражнения Środki językowe с проверенным ответом (зелёная подсветка). Файл в `site/public/screens/`, снимается с тестового аккаунта, `width`/`height` заданы, формат AVIF с запасным WebP.
- H1 один на странице. Вторая кнопка прокручивает к §6.4.

### 6.3. Что проверяет экзамен

Заголовок: **Matura nie sprawdza „całego angielskiego”. Sprawdza konkretne rzeczy.**

Четыре карточки по частям письменного экзамена: Rozumienie ze słuchu, Rozumienie tekstów pisanych, Znajomość środków językowych, Wypowiedź pisemna, плюс пятая Część ustna. В каждой: что это, число баллов, какой узел языка за этим стоит, одна строка «U nas: …» с тем, что есть в продукте. Баллы берутся из `site.config.ts` (`examPoints`) со ссылкой на Informator CKE и датой «stan na». Карточки для слушания и чтения честно пишут «Tego jeszcze u nas nie ma» — обещаем только то, что есть (решение 11).

### 6.4. Как это работает

Три шага в ряд, иллюстрации из набора Antigravity:

1. **Wybierz temat.** Te same 14 tematów, co w Informatorze CKE: od „Człowiek” po „Państwo i społeczeństwo”.
2. **Ćwicz jak w arkuszu.** Transformacje, słowotwórstwo, minidialogi, opis ilustracji w 6 krokach. Od razu widzisz, co i dlaczego jest źle.
3. **Widzisz postęp.** Każdy temat ma swój pasek, każde słowo, którego nie znasz, trafia do fiszek.

### 6.5. Открытая тема

Заголовок: **Cały temat „Człowiek” za darmo. Bez logowania.**

Подзаголовок: «Nie pokazujemy wycinka. Pierwszy temat z Informatora CKE jest otwarty w całości: tak samo wygląda każdy z 14.»

Карточка темы в стиле плитки из §6.7, а под ней шесть строк по разделам, каждая — обычная ссылка на страницу открытой темы на сайте:

| Строка | Текст | Ссылка |
|---|---|---|
| Słownictwo | {t} teksty z lukami, {k} słów z przykładami | `/tematy/czlowiek/slownictwo` |
| Środki językowe | {e} ćwiczenia: dopasowanie, bank słów, minidialogi | `/tematy/czlowiek/srodki` |
| Gramatyka | {g} reguły i test na koniec | `/tematy/czlowiek/gramatyka` |
| Opis ilustracji | zdjęcie, 6 kroków, 3 pytania egzaminatora | `/tematy/czlowiek/opis-ilustracji` |
| Pisanie | e-mail z licznikiem słów i listą kontrolną | `/tematy/czlowiek/pisanie` |
| Fiszki | talia tematu, powtórka tego, czego nie umiesz | `/tematy/czlowiek/fiszki` |

Числа считаются при сборке из данных. Большая кнопка (primary) под списком: «Otwórz temat bez logowania» → `/tematy/czlowiek`. Строка под ней: «Postęp zapisze się w tej przeglądarce. Załóż konto, a przeniesiemy go na konto.» Это обычные ссылки: блок работает без JavaScript и передаёт вес страницам темы.

Событие аналитики `guest_open` с полем `section`.

### 6.6. Что внутри

Пять блоков с чередованием «текст слева, скриншот справа»:

| Блок | Заголовок | Текст | Ссылка |
|---|---|---|---|
| Słownictwo | **Słownictwo w tekstach, nie w tabelkach** | Każdy temat ma teksty z lukami i listę słów z przykładami. Zaznaczasz słowo, którego nie znasz, i jednym kliknięciem robisz z niego fiszkę. | `/tematy` |
| Środki językowe | **Te same typy zadań, co w arkuszu** | Dopasowanie, bank słów, minidialogi. Po sprawdzeniu dostajesz wyjaśnienie, dlaczego akurat ta forma. | `/matura-z-angielskiego/srodki-jezykowe` |
| Opis ilustracji | **Opis ilustracji w 6 krokach** | Wstęp, miejsce, osoby, czynności, atmosfera, własne zdanie. Do każdego zdjęcia trzy pytania egzaminatora z przykładowymi odpowiedziami. | `/matura-z-angielskiego/czesc-ustna` |
| Gramatyka | **Gramatyka z testem na końcu** | Reguły z przykładami i pułapkami, a po nich test, który pokazuje, co jeszcze do powtórki. | `/gramatyka` (очередь 2: до неё → `/tematy`) |
| Fiszki | **Fiszki, które pamiętają za Ciebie** | Talia do każdego tematu, powtórka tego, co oznaczyłeś. Nauczyciel może dodać Ci fiszkę w trakcie lekcji. | `/tematy` |

### 6.7. 14 тем

Сетка 7×2 (на телефоне 2 колонки): номер, польское название, уровень, число слов и упражнений из данных. Каждая плитка ведёт на `/tematy/<id>`. Это главная внутренняя перелинковка сайта.

### 6.8. Для родителей

Фон `hero`, иллюстрация. Заголовок: **Rodzicu, zobacz, co naprawdę się dzieje.**

Текст: «Korepetytor mówi „idzie dobrze”. Tu widać, które tematy są zrobione, ile słów zostało do powtórki i kiedy ostatnio dziecko ćwiczyło. Data matury i cel są ustawione w profilu, a postęp liczy się sam.» Кнопка (secondary) «Dla rodziców» → `/dla-rodzicow`. Под ней строка «Raport dla rodzica na e-mail: wkrótce. Zostaw adres.» с полем почты (§10), роль `rodzic`.

### 6.9. Цены коротко

Две карточки рядом, как на `/cennik`, без подробностей: «Za darmo» (что входит) и «Pełny dostęp» (`{cena}`, что добавляется). Кнопка платной карточки до запуска оплаты: «Powiadom mnie o starcie» → форма с ролью `rodzic`. Ссылка «Pełny cennik» → `/cennik`.

### 6.10. FAQ

Аккордеон, разметка `FAQPage` (schema.org). Вопросы:

1. **Czy to działa na telefonie?** Tak, w przeglądarce, bez instalowania. Postęp jest zapisany na koncie, więc możesz zacząć na telefonie i skończyć na komputerze.
2. **Czy materiały są zgodne z Formułą 2023?** Tak. Tematy, typy zadań i kryteria bierzemy z Informatora CKE. Nie jesteśmy związani z CKE.
3. **Co jest za darmo?** Temat „Człowiek” w całości bez logowania. Darmowe konto dodaje zapis postępu, fiszki ze wszystkich tematów i {n} tematów. Reszta w pełnym dostępie, zobacz cennik.
4. **Czy jest poziom rozszerzony?** Tak, zadania są oznaczone P i R; reguły gramatyczne mają obie warstwy.
5. **Czy rodzic widzi postęp?** Dziś przez konto dziecka. Raport na e-mail dla rodzica jest w przygotowaniu.
6. **Czy nauczyciel może korzystać z uczniami?** Tak: klasa, kalendarz zajęć, zadania domowe z linkami, fiszki od nauczyciela. Zobacz „Dla nauczycieli”.
7. **Jak usunąć konto?** W profilu, jednym przyciskiem. Dane są usuwane od razu.

Число `{n}` в вопросе 3 зависит от решения об объёме бесплатного слоя (вопрос 3 в §18).

### 6.11. Последний призыв и подвал

Полоса с заголовком **Zacznij dziś. Matura nie przesunie się na później.** и кнопкой «Zacznij za darmo».

Подвал, четыре колонки: **Produkt** (Tematy, Matura, Cennik, Blog), **Dla kogo** (Dla uczniów → `/`, Dla rodziców, Dla nauczycieli), **Firma** (O nas, Kontakt, Regulamin, Polityka prywatności), **Obserwuj** (ссылки на польские аккаунты TikTok, Instagram, YouTube; русские и английские — на страницах `/ru/`, `/en/`, когда появятся). Внизу: «© {rok} {Nazwa}. Materiały opracowane na podstawie Informatora CKE (Formuła 2023). Nie jesteśmy powiązani z Centralną Komisją Egzaminacyjną.»

---

## 7. Остальные страницы

У каждой страницы: один H1, хлебные крошки (`BreadcrumbList`), блок «Dalej» с двумя-тремя ссылками на соседние страницы, дата «Ostatnia aktualizacja» из frontmatter или даты сборки.

### 7.1. Страница темы `/tematy/<id>`

Генерируется из `allModules`, `vocabularyTextsByModule`, `languageUseExercisesByModule`. Для 14 тем — один шаблон.

1. **Шапка темы:** «{n}. {Tytuł} ({titleEn})», уровень, одна строка подтем CKE (из `Spec for Matura.md`, перенести в данные модуля полем `ckeSubtopics`, если его ещё нет).
2. **Czego wymaga CKE w tym temacie:** подтемы списком, фразовые глаголы, словообразование — то, что в спеке модуля названо «Лексический фокус».
3. **Słownictwo:** первые 12 слов списка с переводом и примером; дальше «Pełna lista: {n} słów» → для открытой темы `/tematy/<id>/slownictwo`, для закрытой `/app/#<id>/slownictwo`.
4. **Przykładowy tekst:** один текст целиком (первый в модуле) с иллюстрацией, без упражнения на пропуски; под ним «Ćwiczenie do tego tekstu» → адрес текста (на сайте или в приложении по тому же правилу).
5. **Środki językowe:** список упражнений темы названиями и типами, каждое — ссылка на свой адрес.
6. **Gramatyka tematu:** название правила и первые два абзаца, «Reguła w całości i test» → `…/gramatyka`.
7. **Opis ilustracji:** фото темы, шесть шагов названиями, первый шаг с примером, остальные свёрнуты.
8. **Dalej:** предыдущая и следующая тема, `/tematy`.

Шаблон один для 14 тем, и все ссылки ведут на страницы темы на сайте. Различие задаёт `openModules`: у открытой темы ссылки подписаны «Otwórz bez logowania» и в шапке плашка «Ten temat jest otwarty w całości, bez logowania»; у закрытой — подпись «Zobacz» и плашка «Ten temat jest w pełnym dostępie» со ссылкой на цены и на вход, а ниже «Temat „Człowiek” możesz przejść bez logowania → `/tematy/czlowiek`». Страницы разделов и элементов есть у всех тем (§8.6).

Мета: `title` «{Tytuł}: słownictwo, gramatyka i ćwiczenia na maturę z angielskiego | {Nazwa}»; `description` «Temat „{Tytuł}” z Informatora CKE: {k} słów z przykładami, {t} tekstów z lukami, {e} ćwiczeń środków językowych, opis ilustracji w 6 krokach.» Для `czlowiek` описание заканчивается «Cały temat bez logowania.», для остальных — «Konto za darmo.»

### 7.2. `/matura-z-angielskiego` и подстраницы

Хаб: что такое матура из английского в Formule 2023, два уровня, письменная и устная часть, какие части за что и сколько баллов, что считается сданным. Таблица частей со ссылками на подстраницы. Разметка `Article`. Подстраницы по §5: каждая отвечает на один вопрос из заголовка, 600–1200 слов, таблица или схема, в конце «Jak to ćwiczyć u nas» с одной ссылкой в продукт.

Все числа (баллы, минуты, пороги, даты) живут в `site.config.ts` → `exam`, а не в тексте страниц, и выводятся через компонент `<Fact id="…" />`, который добавляет сноску со ссылкой на источник CKE. Так одно изменение Informatora правится в одном месте.

### 7.3. `/dla-rodzicow`

H1: **Jak pomóc dziecku zdać maturę z angielskiego, nie znając angielskiego**

1. Чем матура отличается от «знания английского»: короткое объяснение частей и порога (ссылки на §7.2).
2. «Jak sprawdzić, czy dziecko jest gotowe»: три признака с привязкой к продукту (зелёные темы, повторка фишек, последняя активность).
3. Чем системная подготовка отличается от репетитора: таблица «Korepetytor / {Nazwa} / Razem» (не против репетитора: вместе лучше, это снимает спор).
4. Что видно родителю сегодня и что будет (отчёт на почту): честно.
5. Цена и что в неё входит → `/cennik`.
6. Форма «Powiadom mnie o raporcie dla rodzica» (роль `rodzic`).
7. FAQ родителя: оплата, отмена, RODO, возраст 16+.

### 7.4. `/dla-nauczycieli`

H1: **Klasa, kalendarz i zadania domowe w jednym miejscu**. Что есть: ссылка-приглашение в класс, страница ученика с прогрессом и заметками, календарь занятий и журнал, домашка со ссылками, которая засчитывается сама, фишки ученику во время занятия. Скриншоты панели класса и календаря. Честно: оплаты и чата нет. CTA «Załóż konto nauczyciela» → `#register` с переключателем на учителя (параметр `?role=teacher` — вопрос 7 в §18). Очередь 2.

### 7.5. `/cennik`

Две карточки и таблица сравнения.

| | Bez konta | Za darmo | Pełny dostęp |
|---|---|---|---|
| Цена | 0 zł | 0 zł | `{cena}` za `{okres}` |
| Темы | „Człowiek” w całości | `{n}` tematów w całości | 14 tematów |
| Postęp | tylko w tej przeglądarce | na koncie, na każdym urządzeniu | ✅ |
| Fiszki | talia „Człowiek” | wszystkie talie, powtórka | ✅ |
| Opis ilustracji, pisanie | w „Człowiek” | w darmowych tematach | все темы |
| Raport dla rodzica | — | — | wkrótce |
| Klasa nauczyciela | — | ✅ | ✅ |

Колонка «Bez konta» показывает, что открытая тема — не урезанное демо: в ней есть всё, кроме сохранения на аккаунте.

Под таблицей: «Ceny zawierają VAT. Możesz zrezygnować w każdej chwili» — текст зависит от решения о модели (вопрос 4 в §18). До запуска оплаты кнопка платной карточки — «Powiadom mnie o starcie». Разметка `Product` с `Offer` появляется только с настоящей ценой.

### 7.6. Блог

Frontmatter: `title`, `description`, `date`, `updated`, `author`, `tags` (части экзамена и темы CKE), `cover`, `atomId` (ссылка на атом из соцсетей), `lang`. Шаблон: заголовок, дата и автор, оглавление при трёх и более H2, текст, блок «Ćwicz to u nas» с одной ссылкой, автор-бокс (E-E-A-T: кто и почему разбирается), «Czytaj dalej» из трёх статей по тегам. Разметка `Article`.

Первые пять статей (очередь 1), по одной на рубрику концепции:

1. `jak-wyglada-matura-z-angielskiego-2027` — Экзамен изнутри.
2. `slowotworstwo-na-maturze-jedna-zasada` — Структура языка (word formation).
3. `transformacje-zdan-matura-angielski-jak-rozwiazywac` — Разбор задания.
4. `opis-obrazka-matura-angielski-6-krokow` — Устная часть.
5. `jak-uczyc-sie-slowek-do-matury-fiszki` — Лексика.

### 7.7. `/o-nas` и `/kontakt`

`/o-nas`: кто делает продукт (автор как методист, см. [Концепция.md §4](../Social%20Media/Концепция.md)), как устроен метод (структура языка + знание экзамена), откуда материалы, что не обещаем. Фото и имя — вопрос 8 в §18. `/kontakt`: почта `kontakt@maturaenglish.pl`, форма (тема, текст, почта) через ту же функцию `lead` с `kind: 'contact'`, без двойного подтверждения.

### 7.8. Юридические страницы

`/regulamin` и `/polityka-prywatnosci` переезжают из заглушек приложения на сайт. Тексты от владельца и юриста (шаги 0.2 и 7.8 спеки регистрации). В приложении `#regulamin` и `#prywatnosc` становятся переадресацией на сайт (§12).

---

## 8. Открытая тема на сайте

Все 14 тем работают на сайте, а не только в приложении: каждый раздел и элемент — страница с готовым HTML, которую Google индексирует, а посетитель открывает без аккаунта. У открытой темы на странице всё содержимое и интерактив из компонентов приложения (§3.1); у закрытой — начало содержимого и плашка доступа (§8.6). Дерево адресов и шаблоны у всех тем одинаковые.

### 8.1. Страницы открытой темы

| Адрес | HTML при сборке (видит Google) | Островок (видит посетитель) |
|---|---|---|
| `/tematy/czlowiek` | Обзор по §7.1 со ссылками на все разделы | Полоска прогресса из `matura.guest.v1` |
| `/tematy/czlowiek/slownictwo` | Полный список слов с переводом, категорией и примером; список текстов с иллюстрациями и первыми абзацами | Озвучка, «Dodaj do fiszek» |
| `/tematy/czlowiek/slownictwo/<textId>` | Текст целиком с иллюстрацией, условие упражнения на пропуски, список слов текста | Упражнение на пропуски с проверкой, выделение слова → фишка |
| `/tematy/czlowiek/srodki` | Список упражнений: тип, условие, число пунктов | Статусы «zrobione» из прогресса гостя |
| `/tematy/czlowiek/srodki/<exId>` | Условие и все элементы упражнения (пары, банк слов, реплики диалога); объяснения **не** в HTML, только после проверки | Решение, проверка, объяснения, «Następne» |
| `/tematy/czlowiek/gramatyka` | Список правил с первыми абзацами, ссылка на тест | — |
| `/tematy/czlowiek/gramatyka/<ruleId>` | Правило целиком: формулы, примеры, ловушки | Озвучка примеров |
| `/tematy/czlowiek/gramatyka/test` | Условия заданий без ответов | Тест с результатом и разбором |
| `/tematy/czlowiek/opis-ilustracji` | Фото, шесть шагов с фразами, три вопроса | Запись ответа, озвучка образца, чек-лист |
| `/tematy/czlowiek/pisanie` | Задание, требования, образец | Редактор со счётчиком слов и чек-листом |
| `/tematy/czlowiek/fiszki` | Список карточек колоды: слово, перевод, пример (`canonical` на `/tematy/czlowiek/slownictwo`: это тот же словарь в другом виде) | Тренажёр карточек, статусы «Umiem / Powtórz» |

Ответы, ключи и объяснения в HTML не попадают: страница содержит условие, а решение приходит в островок как данные после гидратации. Иначе ответы индексировались бы и копировались.

Чтобы открыть вторую тему целиком, её идентификатор добавляется в `openModules`; при следующей сборке её страницы теряют плашку и получают полное содержимое. Адреса при этом не меняются.

### 8.2. Каркас страниц темы

Тот же визуальный каркас, что у темы в приложении, чтобы переход в приложение после регистрации не ощущался сменой продукта:

- **Шапка сайта** (§6.1), под ней **шапка темы**: номер, название, уровень, вкладки разделов обычными ссылками, полоска прогресса гостя.
- **Полоса гостя** над содержимым (не закрывается): «Przeglądasz bez konta. Postęp zapisuje się tylko w tej przeglądarce.» и ссылка «Załóż konto, a go przeniesiemy» → `/app/#register?src=open-topic&next=<route>`. Если островок видит сессию (`GET /api/me` отвечает `200`, тот же домен), полоса меняется на «Masz konto. Otwórz ten temat w aplikacji, tam postęp zapisze się na koncie» → адрес в приложении.
- **Боковой список тем**: 14 тем, открытые как ссылки на сайт, закрытые с подписью «darmowe konto» и ссылкой на их обзор `/tematy/<id>` (не на регистрацию: обзор сам продаёт и несёт ключевые слова).
- **Низ страницы**: «Dalej» (следующий элемент или раздел), хлебные крошки, блок «Ten temat w aplikacji» с одной кнопкой.

### 8.3. Прогресс гостя

- `localStorage`, ключ `matura.guest.v1`, формат `{ module, cards }` как у серверного прогресса ([Регистрация пользователя.md §12](Регистрация%20пользователя.md)). Пишется через браузерную реализацию `ProgressStore`; принимает только модули из `openModules`.
- Ни одного запроса к API, кроме `GET /api/me` для полосы из §8.2 (один раз за загрузку страницы; ответ `401` у гостя — норма, не ошибка).
- **Перенос в аккаунт.** Сайт и приложение на одном домене, поэтому приложение читает тот же `localStorage`. Механизм §12.4 спеки регистрации («Перенос из браузера») получает второй источник: после первого входа, если есть `matura.guest.v1`, диалог «Przenieść postęp z tej przeglądarki? Temat „Człowiek”: {n} ćwiczeń, {m} fiszek» с кнопками «Przenieś» и «Pomiń». После переноса или отказа ключ удаляется. При конфликте с прогрессом аккаунта побеждает более поздняя запись по каждому элементу.
- Выход из аккаунта гостевой прогресс не создаёт; гость после «Wyloguj» начинает заново.

### 8.4. Регистрация из открытой темы

`/app/#register?src=open-topic&next=<route>`: форма регистрации как сейчас, с плашкой «Załóż darmowe konto: postęp z tematu „Człowiek” przeniesiemy na konto, a pozostałe tematy się otworzą.» После подтверждения почты открывается адрес приложения, соответствующий `next`, перед этим — диалог переноса из §8.3. Ссылка «Wróć do tematu» под формой ведёт обратно на сайт.

### 8.5. Что меняется в коде приложения ради открытой темы

| Что | Где | Изменение |
|---|---|---|
| Прогресс через интерфейс | [progress.tsx](../app/src/progress.tsx), [progress-context.ts](../app/src/progress-context.ts) | Выделить `ProgressStore` (чтение, запись, подписка). Текущая серверная логика становится одной реализацией; браузерная для гостя — второй, в `app/src/guestStore.ts` |
| Компоненты разделов | [VocabularyView.tsx](../app/src/components/VocabularyView.tsx), [language-use/](../app/src/components/language-use/), [GrammarSectionView.tsx](../app/src/components/GrammarSectionView.tsx), [PictureDescriptionView.tsx](../app/src/components/PictureDescriptionView.tsx), [WritingTrainerView.tsx](../app/src/components/WritingTrainerView.tsx), [FlashcardsView.tsx](../app/src/components/FlashcardsView.tsx) | Данные и `ProgressStore` через свойства или контекст, который сайт может подставить; никакого `window` при рендере (проверяется рендером в Node при сборке сайта); учительские части (`LessonBar`, «Fiszki dla:», сохранённые работы) вынесены в обёртки приложения |
| Настройки | [settings.tsx](../app/src/settings.tsx) | Чтение `localStorage` в инициализаторе состояния переносится в эффект или за проверку `typeof window` |
| Адреса | [routing.ts](../app/src/routing.ts) | `siteUrl(route)` рядом с `toHash`; соответствие `opis-foto` ↔ `opis-ilustracji` |
| Перенос | [FirstRun.tsx](../app/src/components/auth/FirstRun.tsx), §12.4 спеки регистрации | Второй источник `matura.guest.v1`; параметры `src` и `next` на регистрации |

Серверные функции не меняются: гость ничего не пишет и не читает. У гостя нет ни одной серверной привилегии.

### 8.6. Закрытые темы: страницы с замком

Решение 09.11.2026: страница закрытой темы существует, открыта для захода и для индексации, но содержимое показано не целиком, а под ним стоит плашка доступа. Так Google видит у каждой из 14 тем реальные слова, тексты и правила, а посетитель понимает, что внутри и как это открыть.

| Страница | Что видно у закрытой темы | Что скрыто |
|---|---|---|
| Обзор `/tematy/<id>` | Всё как у открытой: подтемы CKE, 12 слов, первый текст, список упражнений, первые абзацы правила, шесть шагов описания | Ничего; обзор продаёт тему |
| `…/slownictwo` | Первые 12 слов с переводом и примером; карточки текстов с иллюстрацией, названием и первым абзацем | Остальные слова, тексты целиком |
| `…/slownictwo/<textId>` | Иллюстрация, название, первый абзац, список слов текста (термины без определений) | Остальные абзацы, упражнение на пропуски |
| `…/srodki` | Список упражнений: тип, функция языка, условие, число пунктов | — |
| `…/srodki/<exId>` | Условие, подсказка, первый пункт без вариантов | Остальные пункты, проверка, объяснения |
| `…/gramatyka` | Названия правил и первые абзацы | — |
| `…/gramatyka/<ruleId>` | Название, уровень, `ruleSummary`, один пример | Формула, остальные примеры, ловушка |
| `…/gramatyka/test` | Условие, число заданий, типы | Задания |
| `…/opis-ilustracji` | Фото, ситуация, названия шести шагов, первый шаг с фразами, три вопроса | Остальные шаги, образцы ответов, запись |
| `…/pisanie` | Тип, уровень, тема задания, лимит слов | Пункты задания, фразы, план, образец, редактор |
| `…/fiszki` | Число карточек, 12 первых карточек лицом (слово и перевод) | Остальные, тренажёр |

**Плашка доступа** (один компонент `AccessWall`, сразу под видимой частью, без наложения на текст):

- Заголовок: «Ten temat jest w pełnym dostępie».
- Текст: «Kup dostęp, a otworzysz wszystkie 14 tematów: teksty z lukami, ćwiczenia środków językowych, testy, opis ilustracji i fiszki. Postęp zapisze się na koncie.»
- Кнопки: «Zobacz cennik» (primary) → `/cennik`; «Mam konto: zaloguj się» → `/app/#login?next=<route>`.
- Строка: «Temat „Człowiek” możesz przejść w całości bez logowania → `/tematy/czlowiek`».
- Для тем из `pricing.freeAccountModules` заголовок «Ten temat otwiera darmowe konto», кнопка «Załóż darmowe konto» → `/app/#register?src=wall&next=<route>`.

Пока оплаты нет (`pricing.monthly` и `pricing.untilMatura` пусты), текст кнопки цен не меняется: `/cennik` сам объясняет, что платный доступ стартует позже, и предлагает лист ожидания. Плашка не врёт, что доступ уже можно купить: заголовок говорит, где тема находится, а не «купи сейчас».

**Разметка.** Страницы закрытых тем получают schema.org `isAccessibleForFree: false` и `hasPart` с `cssSelector: ".paywall-teaser"` на видимой части, как рекомендует Google для платного контента; открытые — `isAccessibleForFree: true`. Скрытая часть в HTML **не** присутствует (ни в разметке, ни в данных островков): показывается только то, что перечислено в таблице.

**Сервер** по-прежнему не участвует: плашка статическая; проверка «Mam konto» ведёт на вход в приложение, а не открывает тему на сайте.

---

## 9. SEO: технические требования

### 9.1. Для каждой страницы

- Готовый HTML с контентом без JavaScript. Островки только для формы, отсчёта и меню на телефоне.
- Один `<h1>`, иерархия заголовков без пропусков.
- `<title>` до 60 знаков, с `| {Nazwa}` в конце; `<meta name="description">` 120–155 знаков; `<link rel="canonical">`; `<html lang="pl">`.
- Open Graph и Twitter Card: `og:title`, `og:description`, `og:image` 1200×630 (генерируется при сборке из заголовка и иллюстрации в стиле сайта), `og:locale: pl_PL`.
- Schema.org в JSON-LD: `Organization` и `WebSite` на всех; `SoftwareApplication` (категория `EducationalApplication`, `offers` с ценой 0 и, позже, платной) на `/` и `/cennik`; `FAQPage` где есть FAQ; `Article` на статьях и страницах хаба; `BreadcrumbList` везде, кроме `/`.
- Изображения: `width` и `height`, `loading="lazy"` ниже первого экрана, `alt` по-польски, AVIF/WebP с запасным PNG.
- Внутренние ссылки обычными `<a href>`, без `#` и без JavaScript. Ссылки между страницами открытой темы (вкладки, «Dalej», список упражнений) — тоже обычные ссылки, а не переключение состояния островка.
- На страницах открытой темы ответы и объяснения не входят в HTML (§8.1); на страницах закрытой темы в HTML нет ничего сверх таблицы §8.6, а в JSON-LD стоит `isAccessibleForFree: false` с `hasPart.cssSelector` на видимую часть.

### 9.2. Для сайта

- `sitemap.xml` из сборки (интеграция `@astrojs/sitemap`), `robots.txt` с `Sitemap:`. Исключены `/404` и служебные.
- `/app/`: `noindex` в `index.html` приложения, `Disallow: /app/` и `Disallow: /api/` в `robots.txt` сайта (решение 17).
- Переадресации `301`: `angelskimatura.vercel.app/*` → `maturaenglish.pl/app/*` (с сохранением `#`: он не доходит до сервера, браузер переносит сам); `www.maturaenglish.pl` → `maturaenglish.pl`; старые адреса при смене структуры — в таблице `site/redirects.json`, из неё собирается `vercel.json`.
- Скорость: Lighthouse на телефоне ≥ 95 по Performance, SEO, Accessibility, Best Practices для `/`, страницы темы и статьи; LCP ≤ 2,5 с, CLS ≤ 0,1, INP ≤ 200 мс в Vercel Speed Insights через месяц после запуска.
- Шрифт Nunito в `woff2`, `font-display: swap`, два начертания (400, 700) плюс курсив 400 только там, где он нужен; `<link rel="preload">` для основного.
- Google Search Console и Bing Webmaster: домен подтверждён, карта сайта отправлена, в первую неделю проверены ошибки индексации.
- Один аналитический скрипт, без менеджеров тегов.

### 9.3. Содержание

- Язык польский, формы «ty» к ученику, «Państwo» нигде: к родителю тоже «ty» (так пишут польские edtech-сервисы для семей; вопрос 9 в §18, если владелец хочет иначе).
- Один главный запрос на страницу, он в H1, `title`, первом абзаце и одном подзаголовке. Побочные — в подзаголовках. Запросы из §5 — гипотезы, частотность проверяется в Google Keyword Planner или Senuto до написания текстов (шаг 0.6).
- Каждая страница ссылается минимум на три другие страницы сайта и на одно место в приложении.
- Факты об экзамене — только через `<Fact>` со ссылкой на источник (§7.2).
- Запрещено: «gwarancja», «100%», «zdasz na pewno», сравнения с конкретными конкурентами по имени, «najlepszy».
- Числа о продукте («56 ćwiczeń») — только из данных при сборке, никогда руками.

---

## 10. Форма сбора почты и API

### 10.1. Форма

Поля: **E-mail**, роль (чипы: Uczeń / Rodzic / Nauczyciel; на `/dla-rodzicow` предвыбрана Rodzic), галочка «Chcę otrzymywać informacje o starcie i nowościach {Nazwa}. Mogę zrezygnować w każdej chwili. [Polityka prywatności]». Скрытые: `source` (страница и блок), `utm_*` из адреса, `lang`. Поле-ловушка для ботов (`website`, скрыто, должно остаться пустым).

После отправки всегда один текст: «Sprawdź skrzynkę i potwierdź adres.» Письмо «Potwierdź zapis» со ссылкой `/maturaenglish.pl/potwierdz?token=…` (действует 24 часа, один раз). Страница подтверждения: «Gotowe. Napiszemy, kiedy wystartuje pełny dostęp.» и кнопка «Zacznij za darmo już teraz».

Каждое письмо списку содержит ссылку отписки `/wypisz?token=…`; отписка одним кликом без входа.

### 10.2. API (`app/api/account.ts`, действия `lead`)

| Метод | `action` | Что делает |
|---|---|---|
| POST | `subscribe` | Проверяет почту, ловушку, лимит (5 запросов в час с IP, 3 на адрес в сутки). Создаёт или обновляет `leads` со статусом `pending`, шлёт письмо подтверждения. Всегда `202` |
| POST | `confirm` | По токену: статус `confirmed`, `confirmed_at`. Токен одноразовый |
| POST | `unsubscribe` | По токену: статус `unsubscribed` |
| POST | `contact` | Сообщение с `/kontakt`: пишет в `leads` с `kind: 'contact'` и пересылает на `kontakt@maturaenglish.pl` через Resend. Лимит 3 в час с IP |

Действия живут в [account.ts](../app/api/account.ts) как `action=lead-subscribe|lead-confirm|lead-unsubscribe|contact`, без сессии; это не новая функция, лимит 12 не нарушен. Письма через Resend тем же способом, что в [mail.ts](../app/api/_lib/mail.ts): `fetch`, без SDK, `waitUntil`. Ссылки в письмах строятся от `APP_URL` (теперь это `https://maturaenglish.pl`), страницы подтверждения и отписки — на сайте.

### 10.3. Таблица

```sql
create table leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  kind text not null default 'subscribe' check (kind in ('subscribe', 'contact')),
  role text check (role in ('student', 'parent', 'teacher')),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'unsubscribed')),
  source text,                      -- strona i blok, np. 'landing/parents'
  utm jsonb,                        -- utm_source, utm_medium, utm_campaign, utm_content
  lang text not null default 'pl',
  message text check (char_length(message) <= 2000),   -- tylko kind = 'contact'
  token_hash text,
  token_expires_at timestamptz,
  confirmed_at timestamptz,
  created_at timestamptz not null default now()
);
create unique index leads_email_subscribe on leads (lower(email)) where kind = 'subscribe';
```

Миграция добавляется в [db-migrate.mjs](../app/scripts/db-migrate.mjs): база одна. Экспорт списка для рассылки — SQL-запрос, рассылка на первом этапе — вручную через Resend Broadcasts (вопрос 10 в §18).

### 10.4. RODO

Администратор данных — владелец `{Nazwa}`; цель — информирование о продукте; основание — согласие; срок — до отписки, непотверждённые удаляются через 7 дней (при каждом новом `subscribe`, как в регистрации). Всё это в `/polityka-prywatnosci`. Форма контакта хранит сообщение 12 месяцев.

---

## 11. Аналитика и события

Инструмент по решению 8. События с полем `page`:

| Событие | Где | Поля |
|---|---|---|
| `cta_register` | Любая кнопка «Zacznij za darmo» | `block` (hero, demo, topics, final…) |
| `cta_login` | «Zaloguj się» | — |
| `guest_open` | Любая ссылка в открытую тему с сайта | `section`, `block` |
| `lead_submit` | Отправка формы | `role`, `block` |
| `lead_confirm` | Подтверждение | `role` |
| `pricing_view` | Открытие `/cennik` | — |
| `pricing_notify` | «Powiadom mnie o starcie» | — |
| `topic_open_app` | Любая ссылка «w aplikacji» со страницы темы | `topic`, `section` |

Что смотрим раз в месяц (связка с [Концепция.md §10](../Social%20Media/Концепция.md)): переходы с каждого языка и площадки по `utm_source`/`utm_campaign`, доля `guest_open` среди посетителей, регистрации в приложении (считаются в базе по `users.created_at`), из них с `signup_source = 'guest'` — те, кто пришёл из открытой темы (вопрос 6 в §18). В приложении аналитики нет; сколько гость прошёл до регистрации, видно по перенесённому прогрессу.

Параметр `src` ставится на ссылку регистрации в момент клика (`/app/#register?src=open-topic`, `src=landing-hero`, `src=pricing`), а UTM соцсетей сайт хранит в `sessionStorage` и добавляет к `src` через точку: `open-topic.tiktok-pl`. Так источник не теряется за время занятий в открытой теме.

Ссылки для соцсетей: `maturaenglish.pl/tematy/<id>?utm_source=tiktok&utm_medium=social&utm_campaign=pl&utm_content=<atomId>`. Лендинг не должен ломаться от любых параметров.

---

## 12. Что меняется в приложении

1. **Путь `/app/`.** `base: '/app/'` в `vite.config.ts`, сборка в `dist/app`. Адреса после `#` не меняются; `shareLink` уже строит ссылку от `origin + pathname`, поэтому «Kopiuj link» даст `maturaenglish.pl/app/#…` без правок. `APP_URL` → `https://maturaenglish.pl`, ссылки в письмах → `{APP_URL}/app/#verify/…`.
2. **Для поисковика:** `<meta name="robots" content="noindex">`, `<title>` → «{Nazwa}: aplikacja»; Nunito локально (решение 15).
3. `#regulamin` и `#prywatnosc`: вместо заглушек переадресация на `/regulamin` и `/polityka-prywatnosci` сайта; ссылки на форме регистрации и в профиле ведут туда напрямую, в новой вкладке.
4. Экран входа и регистрации: ссылка «← Strona główna» → `/`.
5. Регистрация принимает `?src=`, `?next=` и `?role=` (вопросы 6 и 7 в §18); `src` сохраняется в `users.signup_source`.
6. Рефакторинг под открытую тему по §8.5: `ProgressStore`, компоненты разделов без `window` при рендере, `siteUrl`. Поведение приложения для ученика и учителя не меняется, это проверяется существующими тестами и сценариями спек разделов.
7. Переадресация `angelskimatura.vercel.app` → `maturaenglish.pl/app/` в `vercel.json`.

Остальное не трогается: роутинг после `#`, сессии, серверные функции (кроме действий `lead` в `account.ts`, §10.2).

---

## 13. Структура проекта

```
app/                      — приложение и API, как сейчас; корень проекта Vercel
  api/                    — 12 функций, действия lead в account.ts
  src/data/               — единственный источник контента для сайта и приложения
  src/components/         — компоненты разделов, пригодные для сборки в HTML (§8.5)
  src/routing.ts          — toHash, siteUrl, appUrl
  vite.config.ts          — base '/app/', outDir 'dist/app'
  dist/                   — результат: сайт в корне, приложение в dist/app
site/                     — Astro, собирается в ../app/dist
  astro.config.mjs        — статический вывод, sitemap, интеграция React и Tailwind
  site.config.ts          — name, domain, maturaDate, exam (баллы, минуты, пороги, источники), prices, social, openModules
  redirects.json          — старые адреса → новые; из него собирается app/vercel.json
  src/
    layouts/Base.astro    — <head>, шапка, подвал, JSON-LD Organization/WebSite
    layouts/Topic.astro   — каркас страницы темы (§8.2)
    components/           — Hero, Countdown, Fact, TopicGrid, OpenTopic, Pricing, Faq, Breadcrumbs
    islands/              — обёртки React над компонентами app/src: GapText, LanguageUse, GrammarTest, PictureDescription, Writing, Flashcards, GuestBar, LeadForm
    pages/                — index.astro, tematy/[id].astro, tematy/[id]/[section].astro, tematy/[id]/[section]/[item].astro, matura-z-angielskiego/*.astro, dla-rodzicow.astro, cennik.astro, blog/[...slug].astro, potwierdz.astro, wypisz.astro, …
    content/blog/*.md
    styles/tokens.css     — импорт токенов из ../app/src/index.css (общий файл, не копия)
  public/                 — fonts/, screens/, robots.txt
```

Сборка на Vercel (корень `app`): `npm run build:site` (Astro → `app/dist`) и затем `npm run build` (Vite → `app/dist/app`, `emptyOutDir: false`). Страницы тем генерируются через `getStaticPaths` из `allModules` и `openModules`: обзоры для всех 14, разделы и элементы только для открытых. Островки импортируют компоненты из `../app/src` напрямую; `tsconfig` сайта наследует пути приложения. Переменные окружения общие.

---

## 14. Тексты интерфейса

Повторяющиеся строки сайта (остальные в §6–§8):

| Ключ | pl |
|---|---|
| `cta.start` | Zacznij za darmo |
| `cta.login` | Zaloguj się |
| `cta.inApp` | Otwórz w aplikacji |
| `cta.notify` | Powiadom mnie o starcie |
| `cta.parents` | Dla rodziców |
| `countdown` | Do matury {rok}: {n} dni |
| `countdown.after` | Matura {rok}: zaczynamy od nowa |
| `open.title` | Cały temat „Człowiek” za darmo. Bez logowania. |
| `open.cta` | Otwórz temat bez logowania |
| `open.note` | Postęp zapisze się w tej przeglądarce. Załóż konto, a przeniesiemy go na konto. |
| `topic.openFree` | Otwórz bez logowania |
| `topic.openAccount` | Otwórz (darmowe konto) |
| `lead.consent` | Chcę otrzymywać informacje o starcie i nowościach {Nazwa}. Mogę zrezygnować w każdej chwili. |
| `lead.sent` | Sprawdź skrzynkę i potwierdź adres. |
| `lead.confirmed` | Gotowe. Napiszemy, kiedy wystartuje pełny dostęp. |
| `lead.unsubscribed` | Wypisano. Nie wyślemy już nic. |
| `fact.source` | Źródło: {źródło}, stan na {data} |
| `footer.disclaimer` | Materiały opracowane na podstawie Informatora CKE (Formuła 2023). Nie jesteśmy powiązani z Centralną Komisją Egzaminacyjną. |
| `updated` | Ostatnia aktualizacja: {data} |
| `404.title` | Nie ma takiej strony |
| `404.text` | Może szukasz jednego z 14 tematów? |

Тексты полосы гостя и регистрации из открытой темы (полоса — на сайте, диалог переноса и плашка — в приложении, ключи в `i18n.ts`, pl и en):

| Ключ | pl |
|---|---|
| `guest.bar` | Przeglądasz bez konta. Postęp zapisuje się tylko w tej przeglądarce. |
| `guest.barLink` | Załóż konto, a go przeniesiemy |
| `guest.register` | Załóż darmowe konto |
| `guest.locked` | darmowe konto |
| `guest.hasAccount` | Masz konto. Otwórz ten temat w aplikacji, tam postęp zapisze się na koncie. |
| `guest.reason` | Załóż darmowe konto: postęp z tematu „Człowiek” przeniesiemy na konto, a pozostałe tematy się otworzą. |
| `guest.back` | Wróć do tematu „Człowiek” |
| `guest.transfer` | Przenieść postęp z tej przeglądarki? Temat „Człowiek”: {n} ćwiczeń, {m} fiszek |

Шаблоны мета-тегов:

| Страница | `title` | `description` |
|---|---|---|
| `/` | Matura z angielskiego online: ćwiczenia jak w arkuszu CKE \| {Nazwa} | 14 tematów CKE, środki językowe, opis ilustracji w 6 krokach, fiszki i postęp. Spróbuj bez logowania, konto za darmo. |
| `/tematy` | 14 tematów maturalnych z angielskiego: słownictwo i ćwiczenia \| {Nazwa} | Wszystkie tematy z Informatora CKE: od „Człowiek” po „Państwo i społeczeństwo”. Słówka, teksty, gramatyka i ćwiczenia do każdego. |
| `/matura-z-angielskiego` | Jak wygląda matura z angielskiego {rok}: części, punkty, progi \| {Nazwa} | Poziom podstawowy i rozszerzony, część pisemna i ustna, ile punktów za co i co znaczy „zdana”. Na podstawie Informatora CKE. |
| `/dla-rodzicow` | Jak pomóc dziecku przygotować się do matury z angielskiego \| {Nazwa} | Jak sprawdzić, czy dziecko jest gotowe, czym systematyczna nauka różni się od korepetycji i co widać w postępie. |
| `/cennik` | Cennik \| {Nazwa} | Co jest za darmo, co w pełnym dostępie i ile to kosztuje. Bez zobowiązań. |

---

## 15. Дизайн

- Токены из `index.css` без изменений: `primary #17818F`, `ink`, `page`, `surface`, `radius-2xl` для карточек, `shadow-card`. Фон сайта `hero` (`#F5F6F8`) и белые секции попеременно; тёмный подвал цветом `side`.
- Типографика крупнее приложения: H1 44/52 px на десктопе и 32/38 на телефоне, 700; H2 32 px; текст 18 px. Nunito.
- Кнопки, чипы, поля, аккордеон — те же компоненты `ui`, что в приложении (импорт из `app/src/components/ui`), чтобы переход с сайта в открытую тему не ощущался сменой продукта.
- Иллюстрации: набор Antigravity, тот же стиль. Для §6.4 и §6.8 нужны 4 новые (бриф по образцу [Illustrations for Antigravity.md](Illustrations%20for%20Antigravity.md), задача 2.4).
- Скриншоты приложения: тестовый аккаунт с заполненным прогрессом, ширина 1440, без личных данных; обновляются при каждом заметном изменении интерфейса (список в `site/public/screens/README.md`).
- Доступность: контраст AA, фокус виден, меню и аккордеон с клавиатуры, `prefers-reduced-motion` отключает анимацию отсчёта.

---

## 16. Критерии приёмки

1. `maturaenglish.pl/` отдаёт готовый HTML: при отключённом JavaScript видны герой, открытая тема со ссылками, 14 тем, FAQ и подвал.
2. Все страницы очереди 1 из §5 существуют, у каждой уникальные `title`, `description`, `canonical`, `og:image`; валидатор Rich Results принимает JSON-LD без ошибок.
3. `/sitemap.xml` содержит все страницы очереди 1, включая страницы открытой темы, и ни одной служебной; `robots.txt` запрещает `/app/` и `/api/`, в HTML приложения есть `noindex`.
4. Lighthouse (телефон, медленный 4G) для `/`, `/tematy/czlowiek` и одной статьи: ≥ 95 во всех четырёх категориях.
5. Страницы тем: числа слов, текстов и упражнений совпадают с приложением; после добавления упражнения в `languageUseExercises.ts` и пересборки сайт показывает новое число без правок на сайте.
6. Все страницы открытой темы из §8.1 существуют, и при отключённом JavaScript на каждой виден её контент: слова, текст, условие упражнения, правило. В HTML нет ответов и объяснений (проверка поиском по исходнику страницы `srodki/<exId>` строки из объяснения).
6a. Гость в чистом браузере проходит все разделы темы на сайте: пропуски проверяются, упражнения Środki językowe и тест показывают результат и объяснения, слово добавляется в фишки, письмо считает слова. В сети только статика и один `GET /api/me` с ответом `401`. После перезагрузки прогресс на месте; в другом браузере его нет.
6b. Гость нажимает «Załóż konto» в полосе, регистрируется, подтверждает почту: предложение переноса с верными числами, после «Przenieś» на панели виден прогресс «Człowiek», открывается адрес из `next`. Ключ `matura.guest.v1` удалён. Вошедший пользователь на странице открытой темы видит полосу «Masz konto…».
6c. Для закрытой темы `/tematy/praca/srodki/praca-sj-1` существует, отдаёт `200`, показывает условие и первый пункт, плашку «Ten temat jest w pełnym dostępie» с кнопками «Zobacz cennik» и «Mam konto: zaloguj się»; в исходнике страницы нет остальных пунктов и объяснений; в JSON-LD `isAccessibleForFree: false`. `/tematy/edukacja/...` показывает вариант плашки с «Załóż darmowe konto».
7. Форма: отправка → письмо → подтверждение → запись `confirmed`; повторная отправка того же адреса не создаёт вторую запись; отписка по ссылке работает без входа; ловушка заполнена → `202` без записи.
8. «Zacznij za darmo» ведёт на `/app/#register`, регистрация завершается, после входа открывается приложение. `maturaenglish.pl/app/#czlowiek/slownictwo/czl-txt-2` открывает тот же текст, что и раньше на `vercel.app`; «Kopiuj link» копирует адрес с `/app/`.
9. `angelskimatura.vercel.app/#czlowiek` переадресует на `maturaenglish.pl/app/#czlowiek`.
9a. Ученик и учитель в приложении не замечают рефакторинга §8.5: `npm test` зелёный, сценарии приёмки спек Fiszki, Środki językowe и домашки проходят как раньше.
10. Ни одного числа об экзамене в тексте страниц вне `<Fact>`; у каждого факта есть ссылка на CKE и дата.
11. Все польские тексты вычитаны носителем или проверенным редактором (требование [Концепция.md §7](../Social%20Media/Концепция.md)), отметка в задаче 7.2.
12. Домен подтверждён в Google Search Console, карта сайта отправлена, через 7 дней нет ошибок «Страница с переадресацией» и «noindex» для страниц сайта.
13. На сайте нет cookie, кроме технически необходимых (проверка в DevTools после прохода по всем страницам), баннера согласия нет.
14. Regulamin и Polityka prywatności — настоящие тексты, с данными администратора и разделом о списке рассылки.

---

## 17. Вне объёма

- Оплата, корзина, счета, возвраты — спека «Płatności».
- Аккаунт родителя и отчёт на почту — спека «Raport dla rodzica».
- Русская и английская версии сайта (`/ru/`, `/en/`), `hreflang`.
- Страницы грамматики `/gramatyka/*` и `/dla-nauczycieli`, `/matura-z-angielskiego/wypowiedz-pisemna` — очередь 2, после запуска.
- Автоматическая рассылка (дайджест, серия писем) — на первом этапе вручную.
- A/B-тесты заголовков и кнопок.
- Отзывы и оценки: до первых настоящих пользователей блока «Opinie» нет; выдуманных отзывов не будет.
- Вторая открытая тема: одна, пока не измерим, сколько гостей регистрируется. Архитектурно это одна строка в `openModules`.
- Серверное хранение гостевого прогресса (анонимные сессии): гость живёт только в браузере.
- Перенос самого приложения на обычные адреса внутри Astro: допускается §3.1, делается отдельно, когда понадобится.

---

## 18. Открытые вопросы

Пока нет ответа, действует значение по умолчанию (в скобках).

1. **Имя продукта и домен** (нет значения: блокер этапа 0). Критерии в концепции соцсетей; домен `.pl` предпочтителен для польской выдачи, `.com` — если планируются `/ru/` и `/en/`.
2. Выносить ли учителей вперёд: страница `/dla-nauczycieli` в главном меню или только в подвале? Продукт последние недели растёт именно учительскими функциями. (в подвале и в «Więcej», пересмотреть после первых регистраций)
3. Сколько тем даёт бесплатный аккаунт сверх открытой «Człowiek»? От этого зависят FAQ, цены и текст страниц тем. (ещё одна: Edukacja; остальные 12 за платным доступом)
4. Модель оплаты: месячная подписка, пропуск «do matury» разовым платежом или оба? Цена? (оба варианта на `/cennik`, цены `{cena}`; решить до запуска оплаты)
5. Аналитика: Vercel Web Analytics или Plausible? (Vercel: уже есть, бесплатный лимит хватит)
6. Связывать ли сайт и регистрацию (`?src=` → `users.signup_source`)? Нужно поле в базе и правка `auth.ts`. (да, в очереди 1, одна строка в таблице)
7. Параметр `?role=teacher` на регистрации, чтобы с `/dla-nauczycieli` сразу открывался переключатель на учителя. (да, вместе с вопросом 6)
8. Автор на `/o-nas`: имя, фото, биография? По концепции автор «иногда в кадре» как методист. (имя и роль без фото до решения)
9. Обращение к родителю: «ty» или «Państwo»? (ty)
10. Чем рассылать письма списку: Resend Broadcasts вручную или своя функция? (вручную; при 500+ адресах пересмотреть)
11. Кто вычитывает польский? Тот же вопрос, что в концепции соцсетей. (нет значения)
12. Даты матуры 2027 и баллы по частям — проверить по актуальному Informatorowi и harmonogramowi CKE перед заполнением `site.config.ts`. (заполнить при задаче 1.3, со ссылками)
13. Нужна ли страница `/dla-uczniow` отдельно от лендинга? (нет: лендинг и есть страница ученика)
14. Путь `/app/` или поддомен `app.`? Путь выбран ради общего `localStorage` и сессии (§3.1); поддомен потребовал бы передавать прогресс гостя через адрес. (путь)
15. Выпускать ли открытую тему раньше остального сайта, чтобы ссылки из соцсетей заработали до домена? Сайт можно поднять на `vercel.app` с одной темой «Człowiek» и лендингом. (да: этапы 1, 2 и 4 первыми)
16. ~~Давать ли закрытым темам страницы разделов с частью контента ради ключевых слов?~~ Решено 09.11.2026: да, у всех тем полное дерево страниц с началом содержимого и плашкой доступа (§8.6).
17. Сколько показывать на закрытой странице? Таблица §8.6 — отправная точка; при жалобах на тонкие страницы в Search Console можно показывать больше, при утечке содержимого — меньше. (как в §8.6)

---

## 19. Задачи

### Этап 0. Подготовка

- [ ] 0.1. Имя, домен, DNS: `maturaenglish.pl` → проект (вопрос 1).
- [ ] 0.2. Проект Vercel: команда сборки сайт + приложение, `outputDirectory: dist`, Resend на домене (закрывает шаг 1.1 спеки регистрации).
- [ ] 0.3. Google Search Console и Bing Webmaster на домен.
- [ ] 0.4. Аналитика включена (вопрос 5).
- [ ] 0.5. Юридические тексты заказаны (владелец, юрист), раздел о рассылке включён в ТЗ.
- [ ] 0.6. Проверка частотности запросов из §5, правка главных запросов страниц.
- [ ] 0.7. Решения по вопросам 2, 3, 4, 8, 9.

### Этап 1. Каркас сайта

- [x] 1.1. `site/` на Astro: статический вывод, React, Tailwind, sitemap; импорт токенов из `app/src/index.css`; Nunito локально.
- [x] 1.2. `Base.astro`: шапка, подвал, мета-теги, JSON-LD `Organization`/`WebSite`, генерация `og:image`.
- [x] 1.3. `site.config.ts` с фактами об экзамене и источниками (вопрос 12); компонент `<Fact>`.
- [x] 1.4. Компоненты: `Countdown`, `TopicGrid`, `Faq`, `Pricing`, `Breadcrumbs`, карточки.
- [x] 1.5. `/404`, `redirects.json` → `vercel.json`.

### Этап 2. Лендинг

- [x] 2.1. Блоки §6.1–6.4, 6.6–6.11 по текстам спеки.
- [x] 2.2. Скриншоты приложения с тестового аккаунта.
- [x] 2.3. FAQ с разметкой.
- [ ] 2.4. Бриф и генерация 4 иллюстраций для §6.4 и §6.8.

### Этап 3. Страницы

- [x] 3.1. `/tematy` и шаблон `/tematy/[id]` из данных приложения; поле `ckeSubtopics` в данных модулей, если его нет.
- [x] 3.2. `/matura-z-angielskiego` и подстраницы `punkty-i-progi`, `czesc-ustna`, `srodki-jezykowe`, `terminy`.
- [x] 3.3. `/dla-rodzicow`, `/cennik`, `/o-nas`, `/kontakt`.
- [x] 3.4. `/regulamin`, `/polityka-prywatnosci` с текстами из 0.5.

### Этап 4. Открытая тема на сайте (можно выпустить вместе с этапами 1–2 первым, вопрос 15)

- [x] 4.1. `ProgressStore`: интерфейс, серверная реализация из текущего `progress.tsx`, браузерная `guestStore.ts` с ключом `matura.guest.v1` и фильтром `openModules`.
- [x] 4.2. Компоненты разделов без `window` при рендере и без учительских частей внутри; тест, который рендерит каждый раздел темы `czlowiek` через `renderToString` в Node.
- [x] 4.3. `siteUrl`/`appUrl` в `routing.ts`, соответствие `opis-foto` ↔ `opis-ilustracji`, тесты.
- [x] 4.4. Страницы `tematy/[id]/[section]` и `[section]/[item]` с `getStaticPaths` для всех 14 тем; у открытых — полное содержимое без ответов и объяснений, у закрытых — таблица §8.6 и `AccessWall`; `Topic.astro`.
- [x] 4.5. Островки `islands/*` над компонентами приложения, `GuestBar` с проверкой сессии.
- [x] 4.6. Приложение: `?src=`, `?next=`; перенос `matura.guest.v1` через механизм §12.4 спеки регистрации, диалог с числами, удаление ключа.
- [x] 4.7. Проверка в браузере по критериям 6, 6a, 6c, 9a (скриншоты и исходник страниц); 6b (перенос после регистрации) ждёт домена и почты.

### Этап 5. Форма и аналитика

- [x] 5.1. Таблица `leads` в `db-migrate.mjs`; действия `lead` в `account.ts` с лимитами и ловушкой.
- [x] 5.2. `LeadForm`, страницы `/potwierdz` и `/wypisz`, письма «Potwierdź zapis» и «Wiadomość z formularza».
- [~] 5.3. События аналитики из §11: на кнопках стоят `data-event`/`data-block`, сам счётчик не подключён (вопрос 5 в §18).

### Этап 6. Блог

- [x] 6.1. Коллекция `blog`, шаблон статьи, автор-бокс, «Czytaj dalej».
- [x] 6.2. Пять статей из §7.6, написаны и вычитаны.

### Этап 7. Приложение и домен

- [x] 7.1. `base: '/app/'`, сборка в `dist/app`, общая команда сборки с сайтом; `noindex`, новый `<title>`, Nunito локально.
- [x] 7.2. `#regulamin`/`#prywatnosc` → переадресация на сайт; ссылка «Strona główna» на экранах входа.
- [ ] 7.3. `APP_URL = https://maturaenglish.pl`, домен на проект, письма с домена и ссылки с `/app/#`; `user:create` для учителя, Maria и Evgeny (шаг 4.6 спеки регистрации).
- [x] 7.4. `users.signup_source` и `?role=` на регистрации (вопросы 6, 7).
- [x] 7.5. Переадресация старых ссылок: проект тот же, поэтому сервера не касается; главная страница пересылает `/#<адрес приложения>` на `/app/#<адрес>` скриптом (хэш до сервера не доходит).

### Этап 8. Проверка и выпуск

- [ ] 8.1. Критерии §16 на Preview: Lighthouse, Rich Results, отключённый JavaScript, форма, гостевой режим, переадресации.
- [ ] 8.2. Вычитка носителем всех польских текстов (вопрос 11).
- [ ] 8.3. Выпуск, отправка карты сайта, проверка индексации через 7 дней.
- [ ] 8.4. Ссылки в профилях соцсетей обновлены на `maturaenglish.pl/tematy/…` с UTM (этап 1 концепции).

---

## 20. Как сделано (09.11.2026)

Сделано за один заход после решения об открытости всех тем (§8.6). Отличия от текста выше и что осталось:

- **Сайт:** `site/` на Astro 7, 228 статических страниц: лендинг, `/tematy` и все 14 тем с деревом разделов и элементов (обзор, 6 разделов, каждый текст, упражнение, правило, тест), хаб `/matura-z-angielskiego` с пятью подстраницами (в том числе `wypowiedz-pisemna` из очереди 2), `/dla-rodzicow`, `/dla-nauczycieli` (очередь 2, сделана сразу, потому что дёшево), `/cennik`, `/o-nas`, `/kontakt`, `/regulamin` и `/polityka-prywatnosci` (черновики с пометкой), блог с пятью статьями, `/potwierdz`, `/wypisz`, `/404`, `sitemap-index.xml`, `robots.txt`.
- **Открытая тема** работает через островки из компонентов приложения (`site/src/islands/*`), прогресс гостя в `matura.guest.v1` через `GuestProgressProvider` (`app/src/guest/`), общие операции прогресса вынесены в `app/src/progressOps.ts`. Тест `app/src/guest/ssr.test.ts` рендерит каждый раздел темы в Node и проверяет, что объяснений нет в HTML. Перенос в аккаунт добавлен в `progress.tsx` рядом с переносом старого `localStorage`.
- **Закрытые темы** показывают начало содержимого и `AccessWall` по §8.6; JSON-LD `LearningResource` с `isAccessibleForFree`. Страницы правил грамматики статические (без островка) у всех тем; у открытой темы правило целиком, у закрытой — резюме и один пример. `…/gramatyka/test` каноникализирован на `…/gramatyka`, `…/fiszki` — на `…/slownictwo`.
- **Приложение** под `/app/` (`base`, `outDir dist/app`), `noindex`, Nunito локально из `app/public/fonts` с `@font-face` в общем `tokens.css`; токены вынесены из `index.css` в `tokens.css`, сайт импортирует тот же файл. `#regulamin`/`#prywatnosc` пересылают на сайт; регистрация и вход принимают `src`, `next`, `role`; `users.signup_source`.
- **Форма** живёт в `app/api/account.ts` (`lead-subscribe`, `lead-confirm`, `lead-unsubscribe`, `contact`), таблица `leads` с отдельным токеном отписки; письма `leadConfirm` и `contactCopy`. `APP_URL` теперь origin сайта, ссылки приложения в письмах — `/app/#…`.
- **Картинки:** 18 иллюстраций по 1,2–2,8 МБ PNG сжаты в WebP по 50–240 КБ, фото описания тоже; данные указывают на `.webp`, PNG остаются исходниками для брифа Antigravity, `check-vocab-images.mjs` это учитывает. Скриншоты для лендинга сняты с открытой темы на самом сайте (`site/src/assets/screens`) и оптимизируются Astro при сборке.
- **Сборка:** один проект Vercel с корнем `app`; `npm run build:all` = сайт в `dist/` + приложение в `dist/app/`; `vercel.json` с `cleanUrls`, `X-Robots-Tag: noindex` для `/app/`, кэшем шрифтов.
- **Имя и домен** — заглушка «Matura Angielski» и `angelskimatura.vercel.app` в `site.config.ts`; при смене домена меняются `SITE_URL`, `robots.txt` и `APP_URL`.
- **Lighthouse** (телефон, локальный preview, 09.11.2026): лендинг 100/96/100/100, обзор темы 99/96/96/100, упражнение открытой темы 99/96/96/100, закрытая страница 100/95/100/100, статья 100/96/100/100 (performance/accessibility/best-practices/SEO). Четвёрка «best practices» у страниц с островком теряет 4 балла на запросе `GET /api/me`, который у гостя отвечает `401`: это заложено в §8.2.
- **Отсчёт:** дата матуры 2027 не подтверждена (`dateConfirmed: false`), чип показывает «Matura 2027: maj»; после комуниката CKE вписать дату.

### Что осталось

1. Этап 0: имя продукта (пока «Matura Angielski»), Search Console, выбор счётчика, юридические тексты, проверка частотности запросов. Домен `maturaenglish.pl` подключён и отдаёт сайт с 10.11.2026; `www` ещё не переадресован на apex (настройка домена в Vercel, вопрос владельца).
2. ~~Применить миграцию~~ (сделано 10.11.2026: таблица `leads` и `users.signup_source` есть). Задать в Vercel `APP_URL=https://maturaenglish.pl`, `RESEND_API_KEY`, `MAIL_FROM`, `CONTACT_TO`; проверить письмо подтверждения на настоящем адресе.
3. Проверить в браузере перенос прогресса гостя после регистрации (критерий 6b) и регистрацию с `?next=`.
4. Вычитка носителем всех польских текстов сайта (критерий 11) и пяти статей.
5. Подключить аналитику к `data-event` (вопрос 5 в §18).
6. `/gramatyka/*` (общий справочник, очередь 2) и `/ru/`, `/en/`.
7. Закоммитить: в рабочем дереве также лежит нереализованный коммитом календарь (см. спеку календаря §16), коммит делать владельцу или отдельно по файлам.
