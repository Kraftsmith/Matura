# Design System: Matura English Exam Companion

Дизайн-система определяет визуальный язык, компонентную базу, интерактивные паттерны и состояния всех контролов образовательного веб-приложения для подготовки к польскому экзамену Matura English (Formuła 2023, CKE).

---

## Принципы дизайна

* **CKE-ориентированность и академическая четкость:** Все контролы и карточки спроектированы так, чтобы повторять структуру экзаменационных листов CKE, минимизируя когнитивную нагрузку при переходе от приложения к реальному экзамену.
* **Микрофидбек и динамическая реактивность:** Каждое действие пользователя (клик, ввод буквы, переворот карточки, копирование фразы, отправка ответа) сопровождается моментальным визуальным и тактильным откликом без перезагрузки экрана.
* **Иерархия сложности (P vs R):** Четкое цветовое и бейджевое разделение заданий базового уровня (Podstawowy, B1/B1+) и расширенного уровня (Rozszerzony, B2/B2+).
* **Доступность и сенсорное взаимодействие:** Поддержка клавиатурных шорткатов (Space для переворота карточки, стрелки для навигации), встроенный синтез речи (Web Speech API) и высокая контрастность текста (WCAG AA/AAA).

---

## Токены дизайна

### Цветовая палитра и семантические роли

Палитра базируется на современной системе Tailwind CSS с акцентом на академический индиго и глубокий сланцевый нейтральный фон:

| Семантическая роль | Цвет Tailwind | HEX / Значение | Назначение в интерфейсе |
| :--- | :--- | :--- | :--- |
| **Primary Brand** | `indigo-600` / `indigo-700` | `#4F46E5` / `#4338CA` | Главные кнопки действий, активные вкладки, логотип |
| **Primary Light** | `indigo-50` / `indigo-100` | `#EEF2FF` / `#E0E7FF` | Фоны бейджей, подсветка активного пункта меню |
| **Accent / Advanced** | `purple-600` / `purple-700` | `#9333EA` / `#7E22CE` | Элементы уровня Rozszerzony (R), продвинутая грамматика |
| **Accent Light** | `purple-50` / `purple-100` | `#FAF5FF` / `#F3E8FF` | Плашки уровня R, бейджи эссе |
| **Success / Mastered**| `emerald-600` / `emerald-500`| `#059669` / `#10B981` | Статус "Усвоено", верный ответ, оптимальный объем слов |
| **Success Light** | `emerald-50` / `emerald-100`| `#ECFDF5` / `#D1FAE5` | Фон успешной валидации, бейдж освоенных карточек |
| **Danger / Needs Review**| `rose-600` / `rose-500` | `#E11D48` / `#F43F5E` | Статус "На повторение", ошибка в тесте, перебор слов |
| **Danger Light** | `rose-50` / `rose-100` | `#FFF1F2` / `#FFE4E6` | Фон блока с ошибкой, алерт перебора объема |
| **Warning / Exam Trap**| `amber-500` / `amber-600` | `#F59E0B` / `#D97706` | Экзаменационные ловушки CKE, справочник, таймер (<10s) |
| **Warning Light** | `amber-50` / `amber-100` | `#FFFBEB` / `#FEF3C7` | Плашки подсказок и предупреждений CKE |
| **Surface Neutral** | `slate-50` / `slate-100` | `#F8FAFC` / `#F1F5F9` | Основной фон страницы, треки прогресс-баров |
| **Card Surface** | `white` | `#FFFFFF` | Карточки заданий, модальные окна, сайдбар |
| **Border Neutral** | `slate-200` / `slate-300` | `#E2E8F0` / `#CBD5E1` | Разделители, контуры инпутов, неактивные карточки |
| **Text Primary** | `slate-900` / `slate-800` | `#0F172A` / `#1E293B` | Заголовки, формулировки заданий, английский текст |
| **Text Secondary** | `slate-600` / `slate-500` | `#475569` / `#64748B` | Описания, метаданные, транскрипция, лейблы |
| **Text Muted** | `slate-400` | `#94A3B8` | Плейсхолдеры, вспомогательные подсказки шорткатов |

### Типографика

Используется системный шрифт без засечек (Inter / San Francisco / Segoe UI) в паре с моноширинным шрифтом для фонетики, грамматических формул и полей ввода ответов:

* **Display Title:** `text-2xl font-bold tracking-tight text-slate-900` (Заголовки экранов модулей).
* **Section Title:** `text-xl font-bold text-slate-900` (Названия разделов, заголовки карточек).
* **Card Headline:** `text-lg font-bold text-slate-800` (Лицевая сторона карточки, вопрос теста).
* **Body Normal:** `text-sm text-slate-700 leading-relaxed` (Основной текст заданий, пояснения, примеры).
* **Body Small:** `text-xs text-slate-500` (Мета-информация, счетчики, категории).
* **Code / Phonetics:** `font-mono text-sm tracking-wide text-indigo-700` (IPA транскрипция, ключевые слова transformacji).
* **Micro Badge:** `text-[10px] sm:text-[11px] font-bold uppercase tracking-wider` (Бейджи P/R, статус SRS).

### Высоты, тени и скругления

* **Border Radius:**
  * `rounded-lg` (8px): Малые кнопки, бейджи категорий, инпуты поиска.
  * `rounded-xl` (12px): Кнопки действий, поля ввода трансформаций, опции выбора A/B/C/D.
  * `rounded-2xl` (16px): Карточки вопросов, информационные блоки, контейнеры таймера.
  * `rounded-3xl` (24px): 3D флэш-карточка, модальное окно справочника, диалоговые окна.
  * `rounded-full`: Круглые бейджи баллов, аватары модулей, переключатели.
* **Shadow Hierarchy:**
  * `shadow-xs`: Тонкое приподнятие карточки над фоном (`0 1px 2px 0 rgb(0 0 0 / 0.05)`).
  * `shadow-sm`: Интерактивные карточки опций и кнопки в состоянии покоя.
  * `shadow-md` / `shadow-lg`: Наведение курсора (hover) на активные элементы.
  * `shadow-xl` / `shadow-2xl`: Выпадающие слои, 3D переворачиваемые карточки, модальные окна.
* **3D Perspective & Transforms:**
  * Контейнер сцены: `perspective: 1000px`.
  * Поворотная карта: `transform-style: preserve-3d; transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)`.
  * Стороны карточки: `backface-visibility: hidden`.
  * Задняя сторона: `transform: rotateY(180deg)`.

---

## Кнопки и контролы действий

### Основная кнопка действия (Primary Action)

Применяется для ключевых шагов: переход к следующему вопросу, проверка теста, запуск таймера.

* **Анатомия:** Текст действия + иконка со стрелкой / галочкой.
* **Стилизация:** `bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-5 rounded-xl shadow-xs transition-all duration-150 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2`.
* **Disabled:** `bg-slate-200 text-slate-400 cursor-not-allowed opacity-70 shadow-none`.

### Вторичная / Контурная кнопка (Secondary / Outline)

Применяется для второстепенных действий: показать подсказку, сбросить фильтр, предыдущая карточка.

* **Стилизация:** `bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 font-semibold py-2 px-4 rounded-xl transition-colors active:scale-[0.98]`.

### Кнопки интервального повторения (SRS Rating Buttons)

Специализированная двухпозиционная панель оценки запоминания карточки:

* **Кнопка "Powtórz" (Needs Review):**
  * `flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold border border-rose-200 transition-all active:scale-95`.
  * Иконка: `XCircle` (красная).
* **Кнопка "Umiem" (Mastered):**
  * `flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold border border-emerald-200 transition-all active:scale-95`.
  * Иконка: `CheckCircle2` (зеленая).

### Иконочные кнопки (Ghost / Icon Buttons)

Применяются для компактных действий в строке: синтез речи (TTS), копирование в буфер, закрытие модалки.

* **Кнопка озвучки (Audio TTS):**
  * `p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors focus:outline-none`.
  * Иконка: `Volume2`. При активном воспроизведении добавляется пульсирующий эффект `animate-pulse text-indigo-600`.
* **Кнопка копирования (Copy to Clipboard):**
  * `p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors`.
  * Состояние "Скопировано": моментальная смена иконки `Copy` на `Check` цвета `emerald-600` на 2000 мс.
* **Кнопка закрытия (Close Modal):**
  * `p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors`.
  * Иконка: `X`.

---

## Поля ввода и экзаменационные инпуты

### Поле поиска (Search Field)

Применяется в каталоге словаря и в модальном окне грамматического справочника.

* **Анатомия:** Префиксная иконка `Search`, текстовый инпут с плейсхолдером, кнопка очистки `X` при наличии текста.
* **Стилизация:** `w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`.

### Поле экзаменационной трансформации (Inline Key Word Blank)

Используется в заданиях на трансформацию со словом-ключом (*Key word transformation*).

* **Анатомия:** Контекстное предложение с визуально выделенным пропуском, в который встроен инпут с моноширинным шрифтом.
* **Стилизация в нейтральном состоянии:** `font-mono text-sm px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-w-[200px]`.
* **Состояние "Верно" (Correct):** `bg-emerald-50 border-emerald-500 text-emerald-900 font-bold`.
* **Состояние "Неверно" (Incorrect):** `bg-rose-50 border-rose-500 text-rose-900 line-through`.

### Поле словообразования (Word Formation Box)

Используется в экзаменационных заданиях CKE, где требуется трансформировать базовое слово в скобках.

* **Анатомия:** Базовое капслочное слово в контрастном бейдже (`[APPEAR]`) + поле для ввода производной формы.
* **Стилизация бейджа базы:** `px-2.5 py-1 bg-indigo-50 border border-indigo-200 text-indigo-800 font-mono font-bold text-xs rounded-md`.

### Текстовая область письменного тренажера (Writing Textarea)

Используется в разделе Wypowiedź pisemna для написания эссе, писем и статей.

* **Стилизация:** `w-full min-h-[220px] p-4 bg-white border border-slate-200 rounded-2xl text-slate-800 text-sm leading-relaxed placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y shadow-xs`.
* **Панель статуса под инпутом:**
  * Индикатор количества слов с динамической цветовой сигнализацией:
    * Желтый (`text-amber-600`): Меньше минимального порога (например, < 200).
    * Зеленый (`text-emerald-600`): В оптимальном экзаменационном диапазоне (200–250).
    * Красный (`text-rose-600`): Превышение максимального порога (> 250).

---

## Навигационные и селективные контролы

### Элемент списка модулей (Sidebar Module Item)

* **Анатомия:** Номер модуля, иконка тематики, польское название, английский подзаголовок, бейдж уровня сложности (B1 / B2 / B2+).
* **Активное состояние:** `bg-indigo-600 text-white shadow-xs font-bold`. Бейдж: `bg-white/20 text-white`.
* **Неактивное состояние:** `text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-medium`. Бейдж: `bg-slate-100 text-slate-600`.

### Панель вкладок разделов (Navbar Tab Bar)

Горизонтальная навигация по 6 разделам модуля с иконками:

* **Вкладки:** Fiszki (Карточки), Opis ilustracji (Фото), Test (Тест), Gramatyka (Правила), Słownictwo (Словарь), Pisanie (Письмо).
* **Стилизация активной вкладки:** `bg-white text-indigo-700 shadow-xs border-b-2 border-indigo-600 font-bold`.
* **Стилизация неактивной вкладки:** `text-slate-500 hover:text-slate-800 hover:bg-white/50 font-medium`.

### Фильтр-чипсы (Segmented Filter Chips)

Применяется в тренажере карточек для фильтрации: "Wszystkie", "Do powtórki", "Opanowane".

* **Активный чип:** `bg-indigo-600 text-white font-bold text-xs py-1.5 px-3.5 rounded-full shadow-xs`.
* **Неактивный чип:** `bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium text-xs py-1.5 px-3.5 rounded-full transition-colors`.

### Карточка опции множественного выбора (Multiple Choice Option Card)

Используется в закрытых экзаменационных заданиях теста (A, B, C, D).

* **Анатомия:** Буквенный круговой бейдж (A / B / C / D) + формулировка ответа.
* **Состояние покоя:** `p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/30 cursor-pointer transition-all flex items-center space-x-3`.
* **Выбранный вариант (до проверки):** `border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20`.
* **Правильный ответ (после проверки):** `border-emerald-500 bg-emerald-50/70 text-emerald-950 font-medium`. Буквенный бейдж: `bg-emerald-600 text-white`.
* **Неправильно выбранный ответ:** `border-rose-400 bg-rose-50/70 text-rose-950`. Буквенный бейдж: `bg-rose-600 text-white`.

---

## Специализированные предметные контролы

### 3D Карточка (Flashcard Component)

* **Лицевая сторона (Recto):**
  * Верхний бар: Бейдж уровня (`B1+` / `B2`), кнопка озвучки (`Volume2`), индикатор стороны ("Przód").
  * Центр: Ключевое английское слово крупным шрифтом (`text-2xl font-black text-slate-900`), транскрипция в квадратных скобках (`font-mono text-sm text-indigo-600`), контекстное предложение с пропуском или выделением.
  * Нижний бар: Подсказка клавиатурного действия ("Naciśnij spację lub kliknij, aby obrócić").
* **Обратная сторона (Verso):**
  * Верхний бар: Польский перевод с грамматической категорией (`rzeczownik`, `czasownik`, `przymiotnik`).
  * Центр: Четкое английское толкование (Definition), блок коллокаций и устойчивых сочетаний, словообразовательное гнездо (Word Family).
  * Нижний бар: Контекстный экзаменационный пример употребления с выделением целевой лексики.

### Виджет экзаменационного таймера (Examination Timer)

Имитирует лимит времени ответа на устном экзамене CKE (1 минута на описание и ответы).

* **Анатомия:** Иконка таймера `Clock`, цифровой счетчик `MM:SS`, кнопка сброса/паузы.
* **Стандартный режим (> 10 сек):** `font-mono font-bold text-slate-800 bg-slate-100 border-slate-200`.
* **Критический режим (<= 10 сек):** `font-mono font-bold text-rose-600 animate-pulse bg-rose-50 border-rose-200`.

### Карточка шага описания фотографии (Photo Step Navigation)

Реализует официальный 6-шаговый алгоритм CKE:

* **Индикатор текущего шага:** Горизонтальный ряд из 6 пронумерованных сегментов с бейджами (Wstęp, Miejsce, Osoby, Czynności, Hipotezy, Opinia).
* **Банк фраз (Phrase Bank):** Интерактивные чипсы с готовыми языковыми клише CKE. При клике фраза копируется в буфер обмена с мгновенной анимацией галочки.

### Аккордеон экзаменационного вопроса (Exam Question Drawer)

* **Закрытое состояние:** Номер вопроса, экзаменационный вопрос на английском, кнопка озвучки вопроса, кнопка "Pokaż wzorcową odpowiedź".
* **Раскрытое состояние:**
  * Блок подсказки к структуре ответа (Hints & Structure).
  * Эталонный ответ экзаменатора (Model Answer CKE) с выделением связующих фраз и продвинутых структур.

### Баннер ловушки CKE (Grammar Trap Alert)

Используется в разделе Gramatyka для акцентирования типичных ошибок абитуриентов.

* **Анатомия:** Иконка предупреждающего треугольника `AlertTriangle`, заголовок "Uwaga na maturze!", сравнительный блок "Źle vs Dobrze".
* **Стилизация:** `bg-amber-50/80 border border-amber-200 rounded-2xl p-4 text-amber-950`.
* **Выделение ошибки:** `line-through text-rose-600`.
* **Выделение правильного варианта:** `font-bold text-emerald-700`.

---

## Модальные окна и оверлеи

### Модальное окно справочника (Grammar Handbook Modal)

* **Бэкдроп:** `fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4`.
* **Контейнер:** `bg-white rounded-3xl w-full max-w-3xl max-h-[85vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200`.
* **Шапка:** Иконка книги, название справочника, поле мгновенной фильтрации тем, кнопка закрытия `X`.
* **Тело:** Скроллируемый список тем с формулами, правилами, примерами и бейджами P/R.

### Сайдбар на мобильных устройствах (Slide-over Offcanvas)

* Выдвижная панель слева при нажатии на гамбургер-кнопку.
* Анимация плавного выезда `transition-transform duration-300 ease-in-out`.
* Полупрозрачный затемняющий слой с закрытием по клику вне панели.

---

## Состояния компонентов (Component States Matrix)

| Элемент | Покой (Default) | Наведение (Hover) | Фокус (Focus) | Активен (Active) | Недоступен (Disabled) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Primary Button** | `bg-indigo-600 text-white` | `bg-indigo-700 shadow-md` | `ring-2 ring-indigo-500 ring-offset-2` | `scale-[0.98]` | `bg-slate-200 text-slate-400` |
| **Outline Button** | `bg-white border-slate-200`| `bg-slate-50 border-slate-300` | `ring-2 ring-slate-400` | `scale-[0.98]` | `opacity-50 pointer-events-none` |
| **Option Card** | `bg-white border-slate-200`| `border-indigo-300 bg-indigo-50/20`| `ring-2 ring-indigo-400` | `bg-indigo-50 border-indigo-600`| `opacity-60 cursor-not-allowed` |
| **Text Input** | `bg-slate-50 border-slate-200`| `border-slate-300` | `bg-white ring-2 ring-indigo-500`| `bg-white` | `bg-slate-100 text-slate-400` |
| **Chip Filter** | `bg-slate-100 text-slate-600`| `bg-slate-200 text-slate-800` | `ring-2 ring-slate-400` | `bg-indigo-600 text-white` | `opacity-40` |
| **Flashcard** | `rotateY(0deg)` лицевая | `scale-[1.008] shadow-xl` | `outline-indigo-500` | `rotateY(180deg)` обратная | — |

---

## Адаптивность и контрольные точки (Breakpoints)

* **Mobile (< 640px):**
  * Полноэкранные карточки с отступами `p-3`.
  * Скрытие бокового меню в выдвижной drawer с кнопкой вызова в шапке.
  * Горизонтальная прокрутка панели разделов (`overflow-x-auto no-scrollbar`).
  * Стек кнопок SRS вертикально или в компактную строку с сокращенным текстом.
* **Tablet (640px – 1024px):**
  * Двухколоночные сетки вариантов ответов теста (`grid grid-cols-1 sm:grid-cols-2`).
  * Сбалансированный размер фото в описании иллюстрации.
* **Desktop (>= 1024px):**
  * Постоянно видимый боковой каталог всех 14 модулей слева (ширина `w-72` или `w-80`).
  * Просторная рабочая область с максимальной шириной `max-w-7xl mx-auto`.
  * Двухпанельный режим для описания фото: изображение слева, пошаговый разбор и вопросы справа.

