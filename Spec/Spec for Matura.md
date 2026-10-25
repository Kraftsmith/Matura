# Спецификация приложения: Подготовка к Matura English по тематическим модулям Repetytorium

Приложение структурировано в точном соответствии с официальным польским репетиторием (**Spis treści Repetytorium Maturalnego — Formuła 2023**, CKE) и включает 14 основных тематических модулей с прогрессией от простого к сложному, а также сквозной модуль нормативной грамматики.

Каждый модуль объединяет в себе все виды речевой деятельности (устная речь, письмо, аудирование, чтение), имеет обязательный тренажер описания фотографии, колоду интерактивных флэш-карточек и итоговый интерактивный тест. Модули находятся в строгой двусторонней взаимосвязи с лексическим каталогом CKE и грамматическим справочником: [grammaticheskiy_spravochnik_rozszerzona.md](file:///c:/Users/User/Documents/Projects/Matura%20Angelski/%D0%93%D1%80%D0%B0%D0%BC%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0%20%D0%B8%20%D0%BB%D0%B5%D0%BA%D1%81%D0%B8%D0%BA%D0%B0%20(Znajomo%C5%9B%C4%87%20%C5%9Brodk%C3%B3w%20j%C4%99zykowych)/grammaticheskiy_spravochnik_rozszerzona.md).

---

## Архитектура каждого тематического модуля

Внутри каждого из 14 модулей материал строго стандартизирован и содержит обязательные компоненты:

* **Интерактивные флэш-карточки (Fiszki / Flashcards):**
  * Полный набор двусторонних карточек по активной лексике, фразовым глаголам, коллокациям и деривационным парам модуля.
  * *Лицевая сторона:* английское слово / идиома в контекстном предложении с пропуском или польский перевод.
  * *Обратная сторона:* определение на английском, польский эквивалент, транскрипция, пример употребления, словообразовательное гнездо (существительное, прилагательное, глагол, наречие, антонимы).
  * *Алгоритм:* интервальное повторение (Spaced Repetition System — SRS) с режимами «Знаю» / «Повторить» и отслеживанием кривой забывания.
* **Словарный запас (Słownictwo):**
  * Тематический активный словарь по официальным подтемам каталога CKE.
  * Списки слов (*Lista słownictwa*), коллокации, фразовые глаголы, идиомы и словообразование (*Słowotwórstwo*).
* **Грамматический фокус и языковые средства (Gramatyka i środki językowe):**
  * Отработка грамматических правил модуля на базе [grammaticheskiy_spravochnik_rozszerzona.md](file:///c:/Users/User/Documents/Projects/Matura%20Angelski/%D0%93%D1%80%D0%B0%D0%BC%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0%20%D0%B8%20%D0%BB%D0%B5%D0%BA%D1%81%D0%B8%D0%BA%D0%B0%20(Znajomo%C5%9B%C4%87%20%C5%9Brodk%C3%B3w%20j%C4%99zykowych)/grammaticheskiy_spravochnik_rozszerzona.md).
  * Практикум CKE: мини-диалоги, множественный выбор, словообразование, парафразы со словом-ключом, перевод фрагментов и Open Cloze.
* **Тренажер устной речи — Описание фотографии (Zadanie 2: Opis ilustracji):**
  * Профильная фотография высокого качества по теме модуля.
  * Пошаговый разбор по 6 обязательным ступеням CKE:
    1. *Вводная фраза (Introduction)*
    2. *Место действия (Where)*
    3. *Персонажи и внешность (Who & Appearance)*
    4. *Действия персонажей (What they are doing — Present Continuous)*
    5. *Атмосфера и предположения (Atmosphere & Deductions)*
    6. *Заключение и личное отношение (Conclusion & Personal Attitude)*
  * 3 обязательных экзаменационных вопроса комиссии (интерпретация деталей, личный опыт по теме, гипотетическая ситуация или случай в прошлом) с подсказками и эталонными ответами.
  * Связанный сборник: [zadanie_2_opis_ilustracji.md](file:///c:/Users/User/Documents/Projects/Matura%20Angelski/%D0%A3%D1%81%D1%82%D0%BD%D0%B0%D1%8F%20%D1%87%D0%B0%D1%81%D1%82%D1%8C%20(Cz%C4%99%C5%9B%C4%87%20ustna)/zadanie_2_opis_ilustracji.md).
* **Интерактивный итоговый тест модуля (Interaktywny test modułu):**
  * Полноформатное тестирование усвоения модуля в интерактивном интерфейсе.
  * Задания: множественный выбор (*multiple choice*), ввод словообразовательной формы, трансформация со словом-ключом (*key word transformation*), перевод фрагментов (*translation*).
  * Мгновенная валидация, подсчет баллов, пояснение ошибок со ссылками на справочник и автосохранение сложных вопросов в персональный трек для доработки.
* **Аудирование и чтение (Słuchanie i Czytanie):**
  * Аудиозаписи и тексты уровней P и R с экзаменационными заданиями (сопоставление, множественный выбор, вставка пропущенных предложений).
* **Письменная речь (Wypowiedź pisemna):**
  * Базовый уровень (P): e-mail / письмо / пост в блоге (80–130 слов).
  * Расширенный уровень (R): эссе (*rozprawka*), статья (*artykuł*) или формальное письмо (200–250 слов).
  * Асинхронная проверка по 4 критериям CKE: раскрытие темы, композиция и связность, лексико-грамматический диапазон, корректность.

---

## Корреляция тематических модулей с лексикой, грамматикой, фотографиями, карточками и тестами

Каждый модуль выстроен с учетом дидактической прогрессии: от базовых осязаемых тем повседневного общения (B1/B1+) к сложным аналитическим и социокультурным темам (B2/B2+).

### Модуль: Człowiek (Человек)
* **Лексический фокус (Słownictwo):**
  * *Подтемы CKE:* Dane osobowe, okresy życia, wygląd zewnętrzny, rzeczy osobiste, cechy charakteru, uczucia i emocje, mowa ciała, umiejętności i zainteresowania, autorytety.
  * *Фразовые глаголы:* look up to, take after, bring up, show off, fit in.
  * *Словообразование:* суффиксы черт характера (`-able, -ive, -ous, -ful, -less`), отрицательные приставки (`un-, im-, dis-`).
* **Грамматический фокус (Gramatyka):**
  * *Уровень P:* Present Simple (постоянные черты) vs Present Continuous (текущие состояния); Stative verbs (*look, feel, seem*); порядок прилагательных при описании внешности.
  * *Уровень R:* *used to* vs *be/get used to + -ing*; глаголы чувств и эмоций с герундием и инфинитивом; расщепленные предложения (*It is his arrogance that I dislike*).
  * *Справочник:* [Времена глагола](file:///c:/Users/User/Documents/Projects/Matura%20Angelski/%D0%93%D1%80%D0%B0%D0%BC%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0%20%D0%B8%20%D0%BB%D0%B5%D0%BA%D1%81%D0%B8%D0%BA%D0%B0%20(Znajomo%C5%9B%C4%87%20%C5%9Brodk%C3%B3w%20j%C4%99zykowych)/grammaticheskiy_spravochnik_rozszerzona.md#vremena-glagola-tenses-and-aspects), [Неличные формы](file:///c:/Users/User/Documents/Projects/Matura%20Angelski/%D0%93%D1%80%D0%B0%D0%BC%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0%20%D0%B8%20%D0%BB%D0%B5%D0%BA%D1%81%D0%B8%D0%BA%D0%B0%20(Znajomo%C5%9B%C4%87%20%C5%9Brodk%C3%B3w%20j%C4%99zykowych)/grammaticheskiy_spravochnik_rozszerzona.md#nelichnye-formy-glagola-gerund-infinitive-and-participles).
* **Описание фотографии (Opis ilustracji):**
  * *Сюжет:* Пожилой дедушка учит внучку играть в шахматы в уютной гостиной.
  * *Вопросы комиссии:* 1. Почему дедушка улыбается? 2. С кем из членов семьи вы проводите больше всего времени? 3. Расскажите о семейном празднике, который вам запомнился.
* **Интерактивные флэш-карточки (Fiszki):** колода из 50 карточек (черты характера: *conscientious, stubborn, trustworthy*; эмоции: *ecstatic, apprehensive*; идиомы: *see eye to eye, be down in the dumps*).
* **Интерактивный тест модуля:** 15 заданий (5 на словообразование, 5 парафраз с *used to / get used to / stative verbs*, 5 мини-диалогов).

### Модуль: Miejsce zamieszkania (Место жительства)
* **Лексический фокус (Słownictwo):**
  * *Подтемы CKE:* Dom i jego okolica, rodzaje domów i mieszkań (detached, semi-detached, terraced house, block of flats), wyposażenie domu, przymiotniki (spacious, cosy, cramped, suburban), architektura, wynajem/kupno, prace domowe.
  * *Фразовые глаголы:* move in/out, settle down, put up with, tidy up, convert into.
  * *Словообразование:* деривации жилья (`accommodate $\rightarrow$ accommodation, reside $\rightarrow$ residential / resident`).
* **Грамматический фокус (Gramatyka):**
  * *Уровень P:* Конструкции *there is / are*; предлоги места; неисчисляемые существительные интерьера (*furniture, equipment* — всегда ед. число).
  * *Уровень R:* Придаточные определительные (*Relative Clauses: where, which, whose, in which*); пассивный залог (*the house is being redecorated / was erected*).
  * *Справочник:* [Относительные придаточные](file:///c:/Users/User/Documents/Projects/Matura%20Angelski/%D0%93%D1%80%D0%B0%D0%BC%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0%20%D0%B8%20%D0%BB%D0%B5%D0%BA%D1%81%D0%B8%D0%BA%D0%B0%20(Znajomo%C5%9B%C4%87%20%C5%9Brodk%C3%B3w%20j%C4%99zykowych)/grammaticheskiy_spravochnik_rozszerzona.md#otnositelnye-pridatochnye-predlozheniya-relative-clauses), [Пассивный залог](file:///c:/Users/User/Documents/Projects/Matura%20Angelski/%D0%93%D1%80%D0%B0%D0%BC%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0%20%D0%B8%20%D0%BB%D0%B5%D0%BA%D1%81%D0%B8%D0%BA%D0%B0%20(Znajomo%C5%9B%C4%87%20%C5%9Brodk%C3%B3w%20j%C4%99zykowych)/grammaticheskiy_spravochnik_rozszerzona.md#passivnyy-zalog-i-kauzativnye-konstruktsii-passive-voice-and-causatives).
* **Описание фотографии (Opis ilustracji):**
  * *Сюжет:* Молодая семья распаковывает картонные коробки в новой светлой просторной квартире.
  * *Вопросы комиссии:* 1. Какие эмоции испытывают жильцы? 2. Вы бы предпочли жить в центре города или в тихом пригороде? 3. Опишите случай, когда вам пришлось делать ремонт или переставлять мебель.
* **Интерактивные флэш-карточки (Fiszki):** колода из 45 карточек (виды жилья, мебель, бытовая техника, арендная терминология: *landlord, tenant, utility bills, mortgage*).
* **Интерактивный тест модуля:** 15 заданий (парафразы с *Relative Clauses*, словообразование, перевод фрагментов с предлогами места).

### Модуль: Edukacja (Образование)
* **Лексический фокус (Słownictwo):**
  * *Подтемы CKE:* System oświaty, przedmioty nauczania, szkoła i pomieszczenia, osoby w szkole, przybory, życie szkoły, uczenie się, egzaminy i oceny.
  * *Фразовые глаголы:* fall behind, catch up with, drop out of, brush up on, get through.
  * *Словообразование:* `educate $\rightarrow$ education $\rightarrow$ educational, know $\rightarrow$ knowledge, graduate $\rightarrow$ graduation`.
* **Грамматический фокус (Gramatyka):**
  * *Уровень P:* Модальные глаголы обязательства и правил (*must, have to, don't have to, should, ought to, can, be allowed to*); нулевой артикль со словом *school/university*.
  * *Уровень R:* Модальные глаголы упрека и сожаления в прошлом (*should have revised, needn't have worried vs didn't need to*); глаголы с изменением значения с герундием и инфинитивом (*remember to do / remember doing*); союзы цели (*so that, in order to*).
  * *Справочник:* [Модальные глаголы](file:///c:/Users/User/Documents/Projects/Matura%20Angelski/%D0%93%D1%80%D0%B0%D0%BC%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0%20%D0%B8%20%D0%BB%D0%B5%D0%BA%D1%81%D0%B8%D0%BA%D0%B0%20(Znajomo%C5%9B%C4%87%20%C5%9Brodk%C3%B3w%20j%C4%99zykowych)/grammaticheskiy_spravochnik_rozszerzona.md#modalnye-glagoly-modal-verbs-and-modals-in-the-past), [Неличные формы глагола](file:///c:/Users/User/Documents/Projects/Matura%20Angelski/%D0%93%D1%80%D0%B0%D0%BC%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0%20%D0%B8%20%D0%BB%D0%B5%D0%BA%D1%81%D0%B8%D0%BA%D0%B0%20(Znajomo%C5%9B%C4%87%20%C5%9Brodk%C3%B3w%20j%C4%99zykowych)/grammaticheskiy_spravochnik_rozszerzona.md#nelichnye-formy-glagola-gerund-infinitive-and-participles).
* **Описание фотографии (Opis ilustracji):**
  * *Сюжет:* [matura_01_education.jpg](file:///c:/Users/User/Documents/Projects/Matura%20Angelski/%D0%A3%D1%81%D1%82%D0%BD%D0%B0%D1%8F%20%D1%87%D0%B0%D1%81%D1%82%D1%8C%20(Cz%C4%99%C5%9B%C4%87%20ustna)/images/matura_01_education.jpg) — группа студентов готовится к проекту в библиотеке вокруг стола с ноутбуком и книгами.
  * *Вопросы комиссии:* 1. Почему студенты решили заниматься вместе? 2. Расскажите о школьном проекте, в котором вы принимали участие. 3. Заменят ли цифровые устройства бумажные книги в школах?
* **Интерактивные флэш-карточки (Fiszki):** колода из 50 карточек (академические термины: *curriculum, tuition fees, compulsory, pass with flying colours, flunk an exam*).
* **Интерактивный тест модуля:** 15 заданий (трансформации с *modals in the past*, словообразование, выбор предлогов).

### Модуль: Praca (Работа)
* **Лексический фокус (Słownictwo):**
  * *Подтемы CKE:* Zawody, przymiotniki opisujące pracę (demanding, rewarding, lucrative, repetitive), poszukiwanie pracy, w pracy, warunki zatrudnienia, praca dorywcza.
  * *Коллокации:* earn a livelihood, meet deadlines, hand in notice, work on shifts, climb the career ladder.
  * *Словообразование:* суффиксы профессий (`-er, -or, -ant, -ist, -ian: employer, applicant, accountant`).
* **Грамматический фокус (Gramatyka):**
  * *Уровень P:* Present Perfect vs Past Simple в контексте карьеры (*I have worked here since 2021* vs *I graduated in 2020*).
  * *Уровень R:* Каузативные конструкции руководства (*make sb do $\rightarrow$ be made to do*, *get someone to finish*); безличный пассив и Complex Subject (*He is reported to earn a high salary*).
  * *Справочник:* [Пассивный залог и каузативные конструкции](file:///c:/Users/User/Documents/Projects/Matura%20Angelski/%D0%93%D1%80%D0%B0%D0%BC%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0%20%D0%B8%20%D0%BB%D0%B5%D0%BA%D1%81%D0%B8%D0%BA%D0%B0%20(Znajomo%C5%9B%C4%87%20%C5%9Brodk%C3%B3w%20j%C4%99zykowych)/grammaticheskiy_spravochnik_rozszerzona.md#passivnyy-zalog-i-kauzativnye-konstruktsii-passive-voice-and-causatives).
* **Описание фотографии (Opis ilustracji):**
  * *Сюжет:* [matura_02_work.jpg](file:///c:/Users/User/Documents/Projects/Matura%20Angelski/%D0%A3%D1%81%D1%82%D0%BD%D0%B0%D1%8F%20%D1%87%D0%B0%D1%81%D1%82%D1%8C%20(Cz%C4%99%C5%9B%C4%87%20ustna)/images/matura_02_work.jpg) — молодые специалисты в стиле smart-casual работают за ноутбуками в светлом коворкинге.
  * *Вопросы комиссии:* 1. Почему люди выбирают удаленную работу или коворкинг? 2. Какая профессия подошла бы вам больше всего и почему? 3. Опишите опыт первой работы или летней подработки.
* **Интерактивные флэш-карточки (Fiszki):** колода из 50 карточек (условия труда: *flexible hours, perk, severance pay, probation period, teleworking*).
* **Интерактивный тест модуля:** 15 заданий (парафразы с Complex Subject и каузативом, словообразование суффиксов профессий).

### Модуль: Życie prywatne (Личная и семейная жизнь)
* **Лексический фокус (Słownictwo):**
  * *Подтемы CKE:* Członkowie rodziny, życie rodzinne, znajomi i przyjaciele, czynności dnia codziennego, formy spędzania wolnego czasu, określanie czasu, święta i uroczystości, styl życia, konflikty.
  * *Фразовые глаголы:* fall out with, make up, look down on, get along with, break up, rely on.
* **Грамматический фокус (Gramatyka):**
  * *Уровень P:* Past Simple vs Past Continuous (фоновые и прерывающие действия в рассказах о семейных событиях).
  * *Уровень R:* Прошлые привычки (*used to* vs *would*); сослагательное наклонение (*I'd rather you didn't interfere / I wish my parents would understand*); глаголы передачи речи (*apologise for, accuse sb of*).
  * *Справочник:* [Прошедшие времена](file:///c:/Users/User/Documents/Projects/Matura%20Angelski/%D0%93%D1%80%D0%B0%D0%BC%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0%20%D0%B8%20%D0%BB%D0%B5%D0%BA%D1%81%D0%B8%D0%BA%D0%B0%20(Znajomo%C5%9B%C4%87%20%C5%9Brodk%C3%B3w%20j%C4%99zykowych)/grammaticheskiy_spravochnik_rozszerzona.md#proshedshie-vremena-past-tenses), [Конструкции с wish и would rather](file:///c:/Users/User/Documents/Projects/Matura%20Angelski/%D0%93%D1%80%D0%B0%D0%BC%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0%20%D0%B8%20%D0%BB%D0%B5%D0%BA%D1%81%D0%B8%D0%BA%D0%B0%20(Znajomo%C5%9B%C4%87%20%C5%9Brodk%C3%B3w%20j%C4%99zykowych)/grammaticheskiy_spravochnik_rozszerzona.md#konstruktsii-s-wish-if-only-i-nerealnym-nakloneniem).
* **Описание фотографии (Opis ilustracji):**
  * *Сюжет:* [matura_04_family.jpg](file:///c:/Users/User/Documents/Projects/Matura%20Angelski/%D0%A3%D1%81%D1%82%D0%BD%D0%B0%D1%8F%20%D1%87%D0%B0%D1%81%D1%82%D1%8C%20(Cz%C4%99%C5%9B%C4%87%20ustna)/images/matura_04_family.jpg) — большая семья из трех поколений собирается за праздничным обедом на открытой террасе.
  * *Вопросы комиссии:* 1. Что указывает на то, что это особый семейный повод? 2. Как вы предпочитаете проводить свободное время с друзьями? 3. Расскажите о семейном споре или недопонимании и о том, как вы его решили.
* **Интерактивные флэш-карточки (Fiszki):** колода из 45 карточек (отношения, праздники, идиомы: *tie the knot, split up, keep in touch, be the apple of sb's eye*).
* **Интерактивный тест модуля:** 15 заданий (трансформации с *would rather / wish*, перевод фраз с предлогами отношений, мини-диалоги).

### Модуль: Żywienie (Питание)
* **Лексический фокус (Słownictwo):**
  * *Подтемы CKE:* Artykuły spożywcze, przymiotniki jedzenia (bland, savory, stale, crunchy, bitter), posiłki i przygotowanie (chop, dice, simmer, bake), diety, lokale gastronomiczne, idiomy kulinarne (*a piece of cake, spill the beans*).
* **Грамматический фокус (Gramatyka):**
  * *Уровень P:* Исчисляемые/неисчисляемые продукты; квантификаторы (*few / little / much / many*).
  * *Уровень R:* Пассивный залог в инструкциях приготовления (*The ingredients are thoroughly mixed*); придаточные условия (*unless seasoned properly*); глаголы с предлогом + герундий.
  * *Справочник:* [Артикли и существительные](file:///c:/Users/User/Documents/Projects/Matura%20Angelski/%D0%93%D1%80%D0%B0%D0%BC%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0%20%D0%B8%20%D0%BB%D0%B5%D0%BA%D1%81%D0%B8%D0%BA%D0%B0%20(Znajomo%C5%9B%C4%87%20%C5%9Brodk%C3%B3w%20j%C4%99zykowych)/grammaticheskiy_spravochnik_rozszerzona.md#artikli-sushchestvitelnye-i-kvantifikatory-articles-nouns-and-quantifiers).
* **Описание фотографии (Opis ilustracji):**
  * *Сюжет:* Повар проводит кулинарный мастер-класс для группы подростков на современной открытой кухне.
  * *Вопросы комиссии:* 1. Почему молодым людям полезно уметь готовить? 2. Какая ваша любимая еда и готовите ли вы ее сами? 3. Опишите поход в ресторан или кафе, который вас разочаровал или приятно удивил.
* **Интерактивные флэш-карточки (Fiszki):** колода из 50 карточек (кулинарные процессы, вкус, диеты: *whisk, marinate, wholesome, dairy-free, balanced diet*).
* **Интерактивный тест модуля:** 15 заданий (квантификаторы *few/little*, пассивные формы в рецептах, множественный выбор).

### Модуль: Zakupy i usługi (Покупки и услуги)
* **Лексический фокус (Słownictwo):**
  * *Подтемы CKE:* Rodzaje sklepów i towary, cechy towarów, sprzedaż i kupno, ubrania, ceny i okazje, środki płatnicze, bankowość, reklama, usługi, reklamacje.
  * *Фразовые глаголы:* rip off, pay off, run out of, take back, splash out on.
* **Грамматический фокус (Gramatyka):**
  * *Уровень P:* Степени сравнения (*as... as, significantly cheaper, far better*); вежливые просьбы (*Could you..., Would you mind helping...?*).
  * *Уровень R:* Каузативные конструкции услуг (*have one's car serviced, get one's watch repaired*); параллельное сравнение (*The higher the discount, the more people buy*); косвенные вопросы в жалобах.
  * *Справочник:* [Пассив и каузатив](file:///c:/Users/User/Documents/Projects/Matura%20Angelski/%D0%93%D1%80%D0%B0%D0%BC%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0%20%D0%B8%20%D0%BB%D0%B5%D0%BA%D1%81%D0%B8%D0%BA%D0%B0%20(Znajomo%C5%9B%C4%87%20%C5%9Brodk%C3%B3w%20j%C4%99zykowych)/grammaticheskiy_spravochnik_rozszerzona.md#passivnyy-zalog-i-kauzativnye-konstruktsii-passive-voice-and-causatives), [Сравнения](file:///c:/Users/User/Documents/Projects/Matura%20Angelski/%D0%93%D1%80%D0%B0%D0%BC%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0%20%D0%B8%20%D0%BB%D0%B5%D0%BA%D1%81%D0%B8%D0%BA%D0%B0%20(Znajomo%C5%9B%C4%87%20%C5%9Brodk%C3%B3w%20j%C4%99zykowych)/grammaticheskiy_spravochnik_rozszerzona.md#stepeni-sravneniya-i-modifikatory-comparisons-and-modifiers).
* **Описание фотографии (Opis ilustracji):**
  * *Сюжет:* [matura_06_shopping.jpg](file:///c:/Users/User/Documents/Projects/Matura%20Angelski/%D0%A3%D1%81%D1%82%D0%BD%D0%B0%D1%8F%20%D1%87%D0%B0%D1%81%D1%82%D1%8C%20(Cz%C4%99%C5%9B%C4%87%20ustna)/images/matura_06_shopping.jpg) — оживленный фермерский уличный рынок с покупателями у прилавков со свежими фруктами и овощами.
  * *Вопросы комиссии:* 1. Почему люди предпочитают покупать продукты на открытом рынке, а не в супермаркете? 2. Вы чаще покупаете вещи онлайн или в обычных магазинах? 3. Расскажите о случае, когда вам пришлось вернуть или обменять бракованный товар.
* **Интерактивные флэш-карточки (Fiszki):** колода из 50 карточек (торговля, платежи: *bargain, receipt, refund, consumer rights, counterfeit*).
* **Интерактивный тест модуля:** 15 заданий (парафразы со структурой *have sth done*, косвенные вопросы, словообразование).

### Модуль: Podróżowanie i turystyka (Путешествия и туризм)
* **Лексический фокус (Słownictwo):**
  * *Подтемы CKE:* Środki transportu, podróżowanie, rezerwacje, podróż morska, lądowa, lotnicza, orientacja, noclegi, wycieczki, wypadki i awarie, bezpieczeństwo.
  * *Словообразование:* `depart $\rightarrow$ departure, arrive $\rightarrow$ arrival, explore $\rightarrow$ exploration`.
* **Грамматический фокус (Gramatyka):**
  * *Уровень P:* Артикли с географическими названиями (страны, горы, острова, реки); способы выражения будущего в поездках.
  * *Уровень R:* Past Perfect Simple & Continuous (*By the time the flight boarded, we had been waiting for hours*); формальная инверсия времени (*Hardly had we arrived when... / No sooner had we checked in than...*).
  * *Справочник:* [Прошедшие времена](file:///c:/Users/User/Documents/Projects/Matura%20Angelski/%D0%93%D1%80%D0%B0%D0%BC%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0%20%D0%B8%20%D0%BB%D0%B5%D0%BA%D1%81%D0%B8%D0%BA%D0%B0%20(Znajomo%C5%9B%C4%87%20%C5%9Brodk%C3%B3w%20j%C4%99zykowych)/grammaticheskiy_spravochnik_rozszerzona.md#proshedshie-vremena-past-tenses), [Инверсия](file:///c:/Users/User/Documents/Projects/Matura%20Angelski/%D0%93%D1%80%D0%B0%D0%BC%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0%20%D0%B8%20%D0%BB%D0%B5%D0%BA%D1%81%D0%B8%D0%BA%D0%B0%20(Znajomo%C5%9B%C4%87%20%C5%9Brodk%C3%B3w%20j%C4%99zykowych)/grammaticheskiy_spravochnik_rozszerzona.md#inversiya-i-emfaticheskie-konstruktsii-inversion-and-cleft-sentences).
* **Описание фотографии (Opis ilustracji):**
  * *Сюжет:* [matura_03_travel.jpg](file:///c:/Users/User/Documents/Projects/Matura%20Angelski/%D0%A3%D1%81%D1%82%D0%BD%D0%B0%D1%8F%20%D1%87%D0%B0%D1%81%D1%82%D1%8C%20(Cz%C4%99%C5%9B%C4%87%20ustna)/images/matura_03_travel.jpg) — двое туристов с рюкзаками изучают карту на фоне старинного европейского города.
  * *Вопросы комиссии:* 1. Какие преимущества самостоятельных путешествий перед пакетными турами? 2. Какая страна или город произвели на вас наибольшее впечатление? 3. Опишите непредвиденную проблему, с которой вы столкнулись в поездке.
* **Интерактивные флэш-карточки (Fiszki):** колода из 50 карточек (туризм, бронирование, транспорт: *itinerary, sightseeing, boarding pass, off the beaten track*).
* **Интерактивный тест модуля:** 15 заданий (парафразы с Past Perfect и отрицательной инверсией, артикли с топонимами).

### Модуль: Kultura (Культура и искусство)
* **Лексический фокус (Słownictwo):**
  * *Подтемы CKE:* Dziedziny kultury, twórcy i dzieła, uczestnictwo w kulturze (teatr, wystawy, koncerty, kino), tradycje i zwyczaje, media.
  * *Термины рецензирования:* masterpiece, plot twist, cast, box-office hit, captivating, thought-provoking.
* **Грамматический фокус (Gramatyka):**
  * *Уровень P:* Пассивный залог (*The novel was published in 1925*); определительные придаточные (*who, which, that*).
  * *Уровень R:* Безличный пассив и Complex Subject (*The artist is believed to have painted...*); причастные обороты (*Adapted from a best-selling novel, the film became an instant classic*).
  * *Справочник:* [Пассив и Complex Subject](file:///c:/Users/User/Documents/Projects/Matura%20Angelski/%D0%93%D1%80%D0%B0%D0%BC%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0%20%D0%B8%20%D0%BB%D0%B5%D0%BA%D1%81%D0%B8%D0%BA%D0%B0%20(Znajomo%C5%9B%C4%87%20%C5%9Brodk%C3%B3w%20j%C4%99zykowych)/grammaticheskiy_spravochnik_rozszerzona.md#passivnyy-zalog-i-kauzativnye-konstruktsii-passive-voice-and-causatives), [Причастные обороты](file:///c:/Users/User/Documents/Projects/Matura%20Angelski/%D0%93%D1%80%D0%B0%D0%BC%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0%20%D0%B8%20%D0%BB%D0%B5%D0%BA%D1%81%D0%B8%D0%BA%D0%B0%20(Znajomo%C5%9B%C4%87%20%C5%9Brodk%C3%B3w%20j%C4%99zykowych)/grammaticheskiy_spravochnik_rozszerzona.md#prichastnye-oboroty-participle-clauses).
* **Описание фотографии (Opis ilustracji):**
  * *Сюжет:* [matura_07_culture.jpg](file:///c:/Users/User/Documents/Projects/Matura%20Angelski/%D0%A3%D1%81%D1%82%D0%BD%D0%B0%D1%8F%20%D1%87%D0%B0%D1%81%D1%82%D1%8C%20(Cz%C4%99%C5%9B%C4%87%20ustna)/images/matura_07_culture.jpg) — посетители современной художественной галереи рассматривают абстрактную скульптуру.
  * *Вопросы комиссии:* 1. Почему современное искусство вызывает противоречивые мнения? 2. Вы предпочитаете ходить в кинотеатр или смотреть фильмы дома? 3. Опишите запоминающийся концерт или спектакль, который вы посетили.
* **Интерактивные флэш-карточки (Fiszki):** колода из 45 карточек (искусство, кино, литература: *exhibition, protagonist, genre, acclaimed, live performance*).
* **Интерактивный тест модуля:** 15 заданий (Complex Subject со словами-ключами, причастные обороты, открытый пропуск).

### Модуль: Sport (Спорт)
* **Лексический фокус (Słownictwo):**
  * *Подтемы CKE:* Dyscypliny sportu, sprzęt, obiekty, osoby (referee, coach, spectator, rival), imprezy, uprawianie sportu, skutki, problemy sportu (doping, commercialization).
  * *Коллокации:* break a record, qualify for the finals, score an equalizer, concede defeat.
* **Грамматический фокус (Gramatyka):**
  * *Уровень P:* Модальные глаголы способности (*can, could, be able to*); First Conditional для исходов матчей.
  * *Уровень R:* Модальные глаголы дедукции в прошлом (*They can't have lost fairly / The athlete must have trained intensely*); сослагательное наклонение сожалений (*I wish our team hadn't conceded that goal*).
  * *Справочник:* [Дедукция и Modals in the Past](file:///c:/Users/User/Documents/Projects/Matura%20Angelski/%D0%93%D1%80%D0%B0%D0%BC%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0%20%D0%B8%20%D0%BB%D0%B5%D0%BA%D1%81%D0%B8%D0%BA%D0%B0%20(Znajomo%C5%9B%C4%87%20%C5%9Brodk%C3%B3w%20j%C4%99zykowych)/grammaticheskiy_spravochnik_rozszerzona.md#deduktsiya-i-stepen-uverennosti-modals-of-deduction), [Wish и If only](file:///c:/Users/User/Documents/Projects/Matura%20Angelski/%D0%93%D1%80%D0%B0%D0%BC%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0%20%D0%B8%20%D0%BB%D0%B5%D0%BA%D1%81%D0%B8%D0%BA%D0%B0%20(Znajomo%C5%9B%C4%87%20%C5%9Brodk%C3%B3w%20j%C4%99zykowych)/grammaticheskiy_spravochnik_rozszerzona.md#konstruktsii-s-wish-if-only-i-nerealnym-nakloneniem).
* **Описание фотографии (Opis ilustracji):**
  * *Сюжет:* [matura_05_sport.jpg](file:///c:/Users/User/Documents/Projects/Matura%20Angelski/%D0%A3%D1%81%D1%82%D0%BD%D0%B0%D1%8F%20%D1%87%D0%B0%D1%81%D1%82%D1%8C%20(Cz%C4%99%C5%9B%C4%87%20ustna)/images/matura_05_sport.jpg) — бегуны на открытом стадионе на финишной прямой легкоатлетического забега.
  * *Вопросы комиссии:* 1. Какие качества необходимы профессиональным спортсменам? 2. Занимаетесь ли вы спортом регулярно и почему? 3. Расскажите о спортивном соревновании, за которым вы наблюдали с трибун или по ТВ.
* **Интерактивные флэш-карточки (Fiszki):** колода из 45 карточек (спорт, экипировка, правила: *athletics track, tournament, stamina, rigorous training*).
* **Интерактивный тест модуля:** 15 заданий (парафразы с *must have / can't have done*, конструкции с *wish*, мини-диалоги).

### Модуль: Zdrowie (Здоровье и медицина)
* **Лексический фокус (Słownictwo):**
  * *Подтемы CKE:* Ludzkie ciało, choroby, urazy i objawy, leczenie i pierwsza pomoc, służba zdrowia, niepełnosprawność, samopoczucie, zdrowy styl życia, uzależnienia.
  * *Фразовые глаголы:* come down with, pass out, fight off, pull through, cut down on.
* **Грамматический фокус (Gramatyka):**
  * *Уровень P:* Модальные глаголы рекомендаций и запретов (*should, shouldn't, ought to, mustn't, had better*); герундий после глаголов образа жизни (*stop smoking, avoid eating sugar*).
  * *Уровень R:* Second & Third Conditionals (*If he hadn't ignored the symptoms, he wouldn't have ended up in hospital*); конструкции *It's high time you visited a doctor*; союз *in case*.
  * *Справочник:* [Условные предложения](file:///c:/Users/User/Documents/Projects/Matura%20Angelski/%D0%93%D1%80%D0%B0%D0%BC%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0%20%D0%B8%20%D0%BB%D0%B5%D0%BA%D1%81%D0%B8%D0%BA%D0%B0%20(Znajomo%C5%9B%C4%87%20%C5%9Brodk%C3%B3w%20j%C4%99zykowych)/grammaticheskiy_spravochnik_rozszerzona.md#uslovnye-predlozheniya-soslagatelnoe-naklonenie-i-zhelaniya-conditionals-subjunctive-wishes).
* **Описание фотографии (Opis ilustracji):**
  * *Сюжет:* [matura_10_health.jpg](file:///c:/Users/User/Documents/Projects/Matura%20Angelski/%D0%A3%D1%81%D1%82%D0%BD%D0%B0%D1%8F%20%D1%87%D0%B0%D1%81%D1%82%D1%8C%20(Cz%C4%99%C5%9B%C4%87%20ustna)/images/matura_10_health.jpg) — врач-педиатр в белом халате доброжелательно осматривает ребенка в современной клинике.
  * *Вопросы комиссии:* 1. Почему доверие между врачом и пациентом так важно? 2. Что вы делаете для поддержания хорошего иммунитета? 3. Опишите случай, когда вам или вашим близким потребовалась медицинская помощь.
* **Интерактивные флэш-карточки (Fiszki):** колода из 50 карточек (симптомы, лекарства, травмы: *prescription, symptom, diagnosis, recover from, sprained ankle*).
* **Интерактивный тест модуля:** 15 заданий (трансформации с *It's high time / Third Conditional*, словообразование медицинских терминов).

### Модуль: Nauka i technika (Наука и технологии)
* **Лексический фокус (Słownictwo):**
  * *Подтемы CKE:* Naukowcy i dziedziny nauki, odkrycia i wynalazki, obsługa urządzeń, technologie informacyjno-komunikacyjne, szanse i zagrożenia technologiczne, idiomy techniczne (*re-invent the wheel, blow a fuse*).
  * *Словообразование:* `innovate $\rightarrow$ innovation, invent $\rightarrow$ invention, artificial $\rightarrow$ artificially`.
* **Грамматический фокус (Gramatyka):**
  * *Уровень P:* Формы будущего времени (*will, be going to, Future Continuous*); пассивный залог в описании принципа работы устройств.
  * *Уровень R:* Future Perfect Simple & Continuous (*By 2040, quantum computers will have transformed cybersecurity*); расщепленные предложения (*It was the invention of AI that revolutionized industry*).
  * *Справочник:* [Будущие времена](file:///c:/Users/User/Documents/Projects/Matura%20Angelski/%D0%93%D1%80%D0%B0%D0%BC%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0%20%D0%B8%20%D0%BB%D0%B5%D0%BA%D1%81%D0%B8%D0%BA%D0%B0%20(Znajomo%C5%9B%C4%87%20%C5%9Brodk%C3%B3w%20j%C4%99zykowych)/grammaticheskiy_spravochnik_rozszerzona.md#budushchie-vremena-i-sposoby-vyrazheniya-budushchego-future-forms), [Расщепленные предложения](file:///c:/Users/User/Documents/Projects/Matura%20Angelski/%D0%93%D1%80%D0%B0%D0%BC%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0%20%D0%B8%20%D0%BB%D0%B5%D0%BA%D1%81%D0%B8%D0%BA%D0%B0%20(Znajomo%C5%9B%C4%87%20%C5%9Brodk%C3%B3w%20j%C4%99zykowych)/grammaticheskiy_spravochnik_rozszerzona.md#rasshcheplennye-predlozheniya-cleft-sentences-for-emphasis).
* **Описание фотографии (Opis ilustracji):**
  * *Сюжет:* [matura_08_technology.jpg](file:///c:/Users/User/Documents/Projects/Matura%20Angelski/%D0%A3%D1%81%D1%82%D0%BD%D0%B0%D1%8F%20%D1%87%D0%B0%D1%81%D1%82%D1%8C%20(Cz%C4%99%C5%9B%C4%87%20ustna)/images/matura_08_technology.jpg) — исследователь в лаборатории настраивает роботизированную руку с дисплеями данных.
  * *Вопросы комиссии:* 1. Как роботы и автоматизация изменят рынок труда? 2. Какое приложение или гаджет больше всего помогает вам в повседневной жизни? 3. Расскажите о технической неполадке, с которой вы столкнулись недавно.
* **Интерактивные флэш-карточки (Fiszki):** колода из 50 карточек (IT, гаджеты, открытия: *breakthrough, automated, cybersecurity, cutting-edge*).
* **Интерактивный тест модуля:** 15 заданий (парафразы с Future Perfect и Cleft sentences, словообразование).

### Модуль: Świat przyrody (Природа и экология)
* **Лексический фокус (Słownictwo):**
  * *Подтемы CKE:* Pogoda i klimat, rośliny i zwierzęta, krajobraz, zagrożenia i ochrona środowiska (carbon footprint, renewable energy, endangered species, global warming), kosmos, klęski żywiołowe.
* **Грамматический фокус (Gramatyka):**
  * *Уровень P:* Связки причины, следствия и контраста (*due to, because of, despite, although, so that*); пассивный залог в описании климатических процессов.
  * *Уровень R:* Смешанные условные предложения (*Mixed Conditionals: If we had adopted green energy sooner, our cities wouldn't suffer from severe smog today*); инверсия в условных предложениях (*Had stricter laws been enacted...*); ограничительная инверсия (*Under no circumstances should rainforests be cleared*).
  * *Справочник:* [Смешанные условные предложения](file:///c:/Users/User/Documents/Projects/Matura%20Angelski/%D0%93%D1%80%D0%B0%D0%BC%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0%20%D0%B8%20%D0%BB%D0%B5%D0%BA%D1%81%D0%B8%D0%BA%D0%B0%20(Znajomo%C5%9B%C4%87%20%C5%9Brodk%C3%B3w%20j%C4%99zykowych)/grammaticheskiy_spravochnik_rozszerzona.md#smeshannye-uslovnye-predlozheniya-mixed-conditionals), [Инверсия в условных](file:///c:/Users/User/Documents/Projects/Matura%20Angelski/%D0%93%D1%80%D0%B0%D0%BC%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0%20%D0%B8%20%D0%BB%D0%B5%D0%BA%D1%81%D0%B8%D0%BA%D0%B0%20(Znajomo%C5%9B%C4%87%20%C5%9Brodk%C3%B3w%20j%C4%99zykowych)/grammaticheskiy_spravochnik_rozszerzona.md#inversiya-v-uslovnyh-predlozheniyah-formal-inversion).
* **Описание фотографии (Opis ilustracji):**
  * *Сюжет:* [matura_09_environment.jpg](file:///c:/Users/User/Documents/Projects/Matura%20Angelski/%D0%A3%D1%81%D1%82%D0%BD%D0%B0%D1%8F%20%D1%87%D0%B0%D1%81%D1%82%D1%8C%20(Cz%C4%99%C5%9B%C4%87%20ustna)/images/matura_09_environment.jpg) — волонтеры убирают пластиковый мусор на морском побережье.
  * *Вопросы комиссии:* 1. Насколько эффективны волонтерские экологические акции? 2. Какие экологические привычки вы соблюдаете в повседневной жизни? 3. Опишите природную катастрофу или экстремальную погоду, о которой вы читали или были свидетелем.
* **Интерактивные флэш-карточки (Fiszki):** колода из 50 карточек (экология, флора и фауна: *biodiversity, pollution, drought, deforestation, renewable*).
* **Интерактивный тест модуля:** 15 заданий (трансформации со смешанными условными и инверсией, открытый пропуск, множественный выбор).

### Модуль: Państwo i społeczeństwo (Государство и общество)
* **Лексический фокус (Słownictwo):**
  * *Подтемы CKE:* Urzędy i struktura państwa, organizacje społeczne i międzynarodowe, problemy współczesnego świata (poverty, human rights violations, migration, unemployment), wydarzenia społeczne, religie i ideologie.
* **Грамматический фокус (Gramatyka):**
  * *Уровень P:* Модальные глаголы юридических прав и обязанностей (*be obliged to, be entitled to, be forbidden to*); логические коннекторы официального дискурса (*furthermore, nonetheless*).
  * *Уровень R:* Формальная отрицательная инверсия высшего уровня (*Not only did the parliament pass the bill, but it also... / Seldom have citizens been so engaged*); сослагательное наклонение в резолюциях (*The committee demanded that the law be revised*); причастные обороты.
  * *Справочник:* [Инверсия](file:///c:/Users/User/Documents/Projects/Matura%20Angelski/%D0%93%D1%80%D0%B0%D0%BC%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0%20%D0%B8%20%D0%BB%D0%B5%D0%BA%D1%81%D0%B8%D0%BA%D0%B0%20(Znajomo%C5%9B%C4%87%20%C5%9Brodk%C3%B3w%20j%C4%99zykowych)/grammaticheskiy_spravochnik_rozszerzona.md#inversiya-i-emfaticheskie-konstruktsii-inversion-and-cleft-sentences), [Глаголы передачи речи](file:///c:/Users/User/Documents/Projects/Matura%20Angelski/%D0%93%D1%80%D0%B0%D0%BC%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0%20%D0%B8%20%D0%BB%D0%B5%D0%BA%D1%81%D0%B8%D0%BA%D0%B0%20(Znajomo%C5%9B%C4%87%20%C5%9Brodk%C3%B3w%20j%C4%99zykowych)/grammaticheskiy_spravochnik_rozszerzona.md#modeli-glagolov-peredachi-rechi-reporting-verbs-patterns).
* **Описание фотографии (Opis ilustracji):**
  * *Сюжет:* Мирный гражданский митинг у здания парламента с плакатами за права человека и справедливое правосудие.
  * *Вопросы комиссии:* 1. Почему для граждан важно иметь право выражать свое мнение? 2. Участвовали ли вы когда-либо в школьном самоуправлении или благотворительных акциях? 3. Расскажите о важном социальном или политическом событии, которое повлияло на вашу страну.
* **Интерактивные флэш-карточки (Fiszki):** колода из 50 карточек (политика, право, социум: *legislation, constitutional, referendum, minority rights, civic engagement*).
* **Интерактивный тест модуля:** 15 заданий (парафразы с продвинутой инверсией со словом-ключом, перевод фрагментов с юридической и общественной лексикой).

---

## Сквозной грамматический раздел (Gramatyka)

В соответствии с учебником, грамматический блок вынесен также в отдельный системный практикум и справочник: [grammaticheskiy_spravochnik_rozszerzona.md](file:///c:/Users/User/Documents/Projects/Matura%20Angelski/%D0%93%D1%80%D0%B0%D0%BC%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0%20%D0%B8%20%D0%BB%D0%B5%D0%BA%D1%81%D0%B8%D0%BA%D0%B0%20(Znajomo%C5%9B%C4%87%20%C5%9Brodk%C3%B3w%20j%C4%99zykowych)/grammaticheskiy_spravochnik_rozszerzona.md), доступный в приложении как сквозной теоретический и тренировочный модуль.

---

## Формат взаимодействия и оценка заданий (без реалтайма)

Приложение функционирует исключительно в **асинхронном пошаговом режиме (Turn-by-turn / Request-Response)** через стандартный REST API без WebSockets и потокового реалтайма:

* **Устная часть — Описание фото (Mówienie: Opis ilustracji):**
  * Студент видит фотокарточку задания и структуру ответа.
  * Запись ответа запускается по кнопке, наговаривается на встроенный диктофон (с визуальным таймером подготовки и ответа) и отправляется на проверку завершенным аудиофайлом (либо текстовым вводом).
  * Сервер/API выполняет транскрибацию и асинхронную проверку по критериям CKE, возвращая экран разбора:
    * Оценка по официальным критериям CKE (раскрытие аспектов, диапазон лексики и грамматики, корректность, связность).
    * Текст расшифровки с выделением ошибок и неточностей.
    * Рекомендации по лексике B2/B2+.
    * Образцовый ответ (*Model Answer*) для самопроверки.
* **Интерактивные тесты и флэш-карточки:**
  * Мгновенный интерактивный отклик в браузере: переворот флэш-карточки, проверка выбранного или введенного ответа теста, показ разбора и ссылки на грамматическое правило без задержек.
* **Письменная речь (Wypowiedź pisemna):**
  * Пошаговое написание эссе/письма с подсчетом слов и асинхронной экспертной оценкой CKE по кнопке «Проверить».
