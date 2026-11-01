// The extension is spelled out because vite.config.ts imports this file to check the data at build time.
import type { DialogueLine, LanguageUseExercise, LocalizedText } from '../types/index.ts';
import { normalise } from '../text.ts';

/**
 * "Środki językowe" exercises, keyed by module id. Ids are '<module prefix>-sj-<n>' and work as link addresses,
 * so an exercise keeps its id for good. Every module mixes the three types of LanguageUseExercise:
 *  - matching: replies are shuffled against the prompts and each reply fits exactly one prompt;
 *  - word-bank: one ___ per sentence, each word used once, at most one extra word in the frame;
 *  - mini-dialogue: 2–3 lines, the gap is a line with text null, three options; in a three-line dialogue
 *    at least one wrong option fits the first line but not the last one.
 * Content is British English; instructions and explanations are in Polish, the Russian version is optional.
 * validateLanguageUseExercises() below stops the build on a broken key.
 */

const MATCH = 'Dobierz do zdań 1–5 odpowiednie reakcje a–e.';
const BANK = 'Uzupełnij zdania wyrazami z ramki.';
const BANK_EXTRA = 'Uzupełnij zdania wyrazami z ramki. Jeden wyraz został podany dodatkowo i nie pasuje do żadnej luki.';
const MINI = (n: number) => `Uzupełnij minidialogi 1–${n}. Wybierz spośród podanych opcji brakującą wypowiedź A, B lub C.`;
const MINI_TIP =
  'Minidialogi mogą składać się z dwóch lub trzech kwestii. W dialogu z trzech kwestii poprawna odpowiedź musi pasować pod względem logicznym i gramatycznym do całego minidialogu, a nie tylko do kwestii przed luką.';

const X = (text: string | null, after?: string): DialogueLine => ({ speaker: 'X', text, after });
const Y = (text: string | null): DialogueLine => ({ speaker: 'Y', text });
const gapY = Y(null);
const say = (pl: string, ru: string): LocalizedText => ({ pl, ru });

export const languageUseExercisesByModule: Record<string, LanguageUseExercise[]> = {
  czlowiek: [
    {
      id: 'czl-sj-1',
      type: 'matching',
      level: 'P',
      functionLabel: 'Podziękowania, prośby, przeprosiny',
      instruction: MATCH,
      tip: 'Zwróć uwagę na funkcję wypowiedzi: podziękowanie, prośba, przeprosiny, oferta pomocy, prośba o radę.',
      prompts: [
        { id: '1', text: 'Thank you very much for your help.' },
        { id: '2', text: 'Could you help me for a second?' },
        { id: '3', text: "I'm sorry. It's all my fault." },
        { id: '4', text: 'Would you like me to help you?' },
        { id: '5', text: "What's your advice?" },
      ],
      replies: [
        { id: 'a', text: "It's OK, don't worry about it." },
        { id: 'b', text: 'Thank you, I can manage.' },
        { id: 'c', text: "Don't mention it." },
        { id: 'd', text: "If I were you, I wouldn't do it." },
        { id: 'e', text: 'With pleasure.' },
      ],
      answers: { '1': 'c', '2': 'e', '3': 'a', '4': 'b', '5': 'd' },
      explanations: {
        '1': say('„Don’t mention it” to odpowiedź na podziękowanie: „Nie ma za co”.', '«Don’t mention it» — ответ на благодарность: «Не за что».'),
        '2': say('„With pleasure” (z przyjemnością) to zgoda na prośbę.', '«With pleasure» (с удовольствием) — согласие выполнить просьбу.'),
        '3': say('Na przeprosiny reagujemy uspokojeniem: „Nic się nie stało”.', 'На извинение отвечаем успокаивая: «Ничего страшного».'),
        '4': say('„I can manage” to grzeczna odmowa pomocy: „Poradzę sobie”.', '«I can manage» — вежливый отказ от помощи: «Я справлюсь».'),
        '5': say('Radę dajemy m.in. konstrukcją „If I were you, I would…”.', 'Совет часто дают конструкцией «If I were you, I would…».'),
      },
    },
    {
      id: 'czl-sj-2',
      type: 'word-bank',
      level: 'P',
      functionLabel: 'Prośby i oferty pomocy',
      instruction: BANK,
      bank: ['favour', 'lot', 'shall', 'should', 'so'],
      items: [
        { sentence: 'Thanks a ___.', answer: 'lot', explanation: say('Stałe wyrażenie: „Thanks a lot” (wielkie dzięki).', 'Устойчивое выражение: «Thanks a lot» (большое спасибо).') },
        { sentence: 'Could you do me a ___?', answer: 'favour', explanation: say('„Do somebody a favour” to wyświadczyć komuś przysługę.', '«Do somebody a favour» — оказать кому-то услугу.') },
        { sentence: '___ I help you?', answer: 'Shall', explanation: say('„Shall I…?” to propozycja: „Czy mam…?”.', '«Shall I…?» — предложение: «Мне…?».') },
        { sentence: "I'm ___ sorry!", answer: 'so', explanation: say('„So” wzmacnia przymiotnik: „tak bardzo mi przykro”.', '«So» усиливает прилагательное: «мне так жаль».') },
        { sentence: 'What do you think I ___ do?', answer: 'should', explanation: say('Pytając o radę, używamy „should”.', 'Спрашивая совета, используем «should».') },
      ],
    },
    {
      id: 'czl-sj-3',
      type: 'mini-dialogue',
      level: 'P',
      functionLabel: 'Reakcje i opinie o ludziach',
      instruction: MINI(4),
      items: [
        {
          id: 'czl-sj-3-1',
          lines: [X(null, 'I forgot to introduce my new friend to you.'), Y("It's OK. Don't worry about it.")],
          options: ['I apologise.', "Don't mention it.", "I'm sorry to hear that."],
          correctIndex: 0,
          explanation: say('Y reaguje na przeprosiny. „Don’t mention it” to odpowiedź na podziękowanie, a „I’m sorry to hear that” to reakcja na złą wiadomość.', 'Y отвечает на извинение. «Don’t mention it» — ответ на благодарность, а «I’m sorry to hear that» — реакция на плохую новость.'),
        },
        {
          id: 'czl-sj-3-2',
          lines: [X("Do you like Joanna's new hat?"), gapY, X('Neither do I.')],
          options: ["No, I don't like it at all.", 'Yes, it looks really nice.', "I think it's quite stylish."],
          correctIndex: 0,
          explanation: say('„Neither do I” zgadza się tylko z przeczeniem. Opcje B i C są twierdzące.', '«Neither do I» согласуется только с отрицанием. Варианты B и C утвердительные.'),
        },
        {
          id: 'czl-sj-3-3',
          lines: [X('What does your girlfriend like?'), gapY],
          options: ['She is tall and slim.', 'She is friendly and very helpful.', 'She is keen on fashion and loves books.'],
          correctIndex: 2,
          explanation: say('Pytanie dotyczy upodobań, nie wyglądu (A) ani charakteru (B). Por. „What is she like?” i „What does she look like?”.', 'Вопрос об увлечениях, а не о внешности (A) и не о характере (B). Ср. «What is she like?» и «What does she look like?».'),
        },
        {
          id: 'czl-sj-3-4',
          lines: [X('Do you get along well with your stepbrother?'), gapY],
          options: ['Not really. We almost never see eye to eye on anything.', 'Not really. We almost never turn a blind eye to anything.', "Not really. We almost never pull each other's legs."],
          correctIndex: 0,
          explanation: say('Idiom „see eye to eye” oznacza „zgadzać się”. „Turn a blind eye” to przymykać oko, a „pull someone’s leg” to nabierać kogoś.', 'Идиома «see eye to eye» значит «сходиться во мнениях». «Turn a blind eye» — закрывать глаза на что-то, а «pull someone’s leg» — подшучивать над кем-то.'),
        },
      ],
    },
    {
      id: 'czl-sj-4',
      type: 'mini-dialogue',
      level: 'P',
      functionLabel: 'Reakcje na wiadomości',
      instruction: MINI(2),
      tip: MINI_TIP,
      items: [
        {
          id: 'czl-sj-4-1',
          lines: [X('Have you got any idea what nationality Paul is?'), gapY, X('Great, I can practise my French with him then.')],
          options: ['He speaks excellent English.', 'He comes from France.', "He's lived in Spain for years."],
          correctIndex: 1,
          explanation: say('A i C pasują do pytania, ale nie do trzeciej kwestii: X chce ćwiczyć francuski, więc Paul musi być z Francji.', 'A и C подходят к вопросу, но не к третьей реплике: X хочет практиковать французский, значит, Пол из Франции.'),
        },
        {
          id: 'czl-sj-4-2',
          lines: [X("Jenny, what's wrong? You look a bit depressed."), gapY, X('Oh, come on, cheer up! There are only two weeks before the Christmas break.')],
          options: ["I'm fed up with school.", 'I miss my sister terribly.', "I'm so sorry to hear that."],
          correctIndex: 0,
          explanation: say('Trzecia kwestia mówi o szkole i przerwie świątecznej. B jest o siostrze, a C to reakcja na cudzą złą wiadomość.', 'Третья реплика о школе и рождественских каникулах. B — о сестре, а C — реакция на чужую плохую новость.'),
        },
      ],
    },
  ],

  'miejsce-zamieszkania': [
    {
      id: 'dom-sj-1',
      type: 'matching',
      level: 'P',
      functionLabel: 'Zapraszanie i oprowadzanie po domu',
      instruction: MATCH,
      prompts: [
        { id: '1', text: 'Would you like to come round for dinner on Friday?' },
        { id: '2', text: 'And this is the living room.' },
        { id: '3', text: 'Make yourself at home.' },
        { id: '4', text: 'Do you mind if I open the window?' },
        { id: '5', text: 'Could you show me where the bathroom is?' },
      ],
      replies: [
        { id: 'a', text: "Thanks, that's very kind of you." },
        { id: 'b', text: "Sure, it's the second door on the left." },
        { id: 'c', text: "I'd love to. What time?" },
        { id: 'd', text: "Wow, it's so bright and spacious!" },
        { id: 'e', text: "Not at all. It's a bit stuffy in here." },
      ],
      answers: { '1': 'c', '2': 'd', '3': 'a', '4': 'e', '5': 'b' },
      explanations: {
        '1': say('Przyjęcie zaproszenia: „I’d love to”.', 'Принимаем приглашение: «I’d love to».'),
        '2': say('Gość reaguje na pokazywany pokój komplementem.', 'Гость отвечает комплиментом комнате, которую ему показали.'),
        '3': say('„Make yourself at home” to „czuj się jak u siebie”, więc gość dziękuje.', '«Make yourself at home» — «чувствуй себя как дома», поэтому гость благодарит.'),
        '4': say('Po „Do you mind…?” zgoda brzmi „Not at all”: „Ależ skąd”.', 'После «Do you mind…?» согласие звучит как «Not at all»: «Нисколько».'),
        '5': say('Prośba o wskazanie miejsca: odpowiedź podaje położenie.', 'Просьба показать, где что-то находится: в ответе называем место.'),
      },
    },
    {
      id: 'dom-sj-2',
      type: 'word-bank',
      level: 'P',
      functionLabel: 'Skarga do właściciela',
      instruction: BANK_EXTRA,
      bank: ['afraid', 'complain', 'fixed', 'keep', 'right', 'wrong'],
      items: [
        { sentence: "I'm calling to ___ about the heating.", answer: 'complain', explanation: say('„Complain about something” to skarżyć się na coś.', '«Complain about something» — жаловаться на что-то.') },
        { sentence: "I'm ___ the shower isn't working.", answer: 'afraid', explanation: say('„I’m afraid” łagodzi złą wiadomość: „Obawiam się, że…”.', '«I’m afraid» смягчает плохую новость: «Боюсь, что…».') },
        { sentence: "There's something ___ with the washing machine.", answer: 'wrong', explanation: say('„There’s something wrong with…” to „coś jest nie tak z…”.', '«There’s something wrong with…» — «что-то не так с…».') },
        { sentence: 'When can you get it ___?', answer: 'fixed', explanation: say('„Get something fixed” to oddać coś do naprawy, zlecić naprawę.', '«Get something fixed» — организовать ремонт чего-либо.') },
        { sentence: 'The neighbours ___ me awake all night.', answer: 'keep', explanation: say('„Keep somebody awake” to nie dawać komuś spać.', '«Keep somebody awake» — не давать кому-то спать.') },
      ],
    },
    {
      id: 'dom-sj-3',
      type: 'mini-dialogue',
      level: 'P',
      functionLabel: 'Pytanie o drogę w okolicy',
      instruction: MINI(3),
      items: [
        {
          id: 'dom-sj-3-1',
          lines: [X("Excuse me, is there a chemist's near here?"), gapY],
          options: ["Yes, there's one just round the corner.", "No, I've never been ill.", "It's open until six."],
          correctIndex: 0,
          explanation: say('X pyta, czy apteka jest w pobliżu. B mówi o zdrowiu, a C o godzinach otwarcia.', 'X спрашивает, есть ли рядом аптека. B — о здоровье, C — о часах работы.'),
        },
        {
          id: 'dom-sj-3-2',
          lines: [X('How far is the bus stop from your flat?'), gapY],
          options: ["It's the number 12.", 'About five minutes on foot.', 'I usually go by bus.'],
          correctIndex: 1,
          explanation: say('„How far” pyta o odległość. A podaje numer autobusu, a C środek transportu.', '«How far» — вопрос о расстоянии. A называет номер автобуса, C — вид транспорта.'),
        },
        {
          id: 'dom-sj-3-3',
          lines: [X('Could you tell me how to get to the library?'), gapY],
          options: ['You can borrow books there.', 'It was built in 1990.', 'Go straight on and take the second left.'],
          correctIndex: 2,
          explanation: say('X prosi o wskazanie drogi. A i B mówią o bibliotece, ale nie wskazują drogi.', 'X просит объяснить дорогу. A и B говорят о библиотеке, но дорогу не объясняют.'),
        },
      ],
    },
    {
      id: 'dom-sj-4',
      type: 'mini-dialogue',
      level: 'P',
      functionLabel: 'Wynajem i problemy w domu',
      instruction: MINI(3),
      tip: MINI_TIP,
      items: [
        {
          id: 'dom-sj-4-1',
          lines: [X("Hello, I'm calling about the flat you advertised. Is it still available?"), gapY, X('Great! Could I come and see it tomorrow?')],
          options: ['I\'m afraid it was rented out yesterday.', 'Yes, nobody has taken it yet.', "It's on the third floor."],
          correctIndex: 1,
          explanation: say('A pasuje do pytania, ale po „wynajęte” X nie chciałby go oglądać. C nie odpowiada na pytanie.', 'A подходит к вопросу, но если квартира сдана, X не стал бы просить её посмотреть. C не отвечает на вопрос.'),
        },
        {
          id: 'dom-sj-4-2',
          lines: [X("How's the new house?"), gapY, X('Oh no! Have you told the landlord?')],
          options: ["It's wonderful. We love it.", "We've got a lovely garden.", "Not great. The roof's leaking."],
          correctIndex: 2,
          explanation: say('„Oh no!” i pytanie o właściciela wskazują na problem. A i B są pozytywne.', '«Oh no!» и вопрос о владельце указывают на проблему. A и B позитивные.'),
        },
        {
          id: 'dom-sj-4-3',
          lines: [X('Do you fancy coming over to watch the match tonight?'), gapY, X('No problem. Maybe next week, then.')],
          options: ['Sorry, I have to help my parents paint the kitchen.', "Sure, I'll bring some snacks.", 'What time does it start?'],
          correctIndex: 0,
          explanation: say('„Maybe next week” pasuje tylko do odmowy. B i C oznaczają zainteresowanie zaproszeniem.', '«Maybe next week» подходит только после отказа. B и C означают интерес к приглашению.'),
        },
      ],
    },
  ],

  edukacja: [
    {
      id: 'edu-sj-1',
      type: 'matching',
      level: 'P',
      functionLabel: 'Pozwolenie, wyjaśnienia, zachęta',
      instruction: MATCH,
      prompts: [
        { id: '1', text: 'May I leave the room for a moment?' },
        { id: '2', text: 'Why are you late again?' },
        { id: '3', text: "I don't understand this exercise." },
        { id: '4', text: "I'm sure I'm going to fail the test." },
        { id: '5', text: 'Can I borrow your notes from Monday?' },
      ],
      replies: [
        { id: 'a', text: "I missed the bus, sir. It won't happen again." },
        { id: 'b', text: "Come on, you can do it! You've worked so hard." },
        { id: 'c', text: "Of course. I'll bring them tomorrow." },
        { id: 'd', text: 'Yes, but come straight back.' },
        { id: 'e', text: 'Let me explain it once more.' },
      ],
      answers: { '1': 'd', '2': 'a', '3': 'e', '4': 'b', '5': 'c' },
      explanations: {
        '1': say('Nauczyciel pozwala wyjść i prosi o szybki powrót.', 'Учитель разрешает выйти и просит быстро вернуться.'),
        '2': say('Pytanie „Why…?” wymaga usprawiedliwienia.', 'Вопрос «Why…?» требует объяснения причины.'),
        '3': say('Na brak zrozumienia reagujemy ponownym wyjaśnieniem.', 'Если что-то непонятно, объясняем ещё раз.'),
        '4': say('Obawy łagodzi zachęta: „Come on, you can do it!”.', 'Страх снимает ободрение: «Come on, you can do it!».'),
        '5': say('„Them” odnosi się do notatek (notes).', '«Them» относится к конспектам (notes).'),
      },
    },
    {
      id: 'edu-sj-2',
      type: 'word-bank',
      level: 'P',
      functionLabel: 'Prośba o wyjaśnienie, usprawiedliwianie się',
      instruction: BANK_EXTRA,
      bank: ['could', 'make', 'mean', 'repeat', 'sorry', 'up'],
      items: [
        { sentence: '___ you explain that again, please?', answer: 'Could', explanation: say('„Could you…?” to uprzejma prośba.', '«Could you…?» — вежливая просьба.') },
        { sentence: 'What does this word ___?', answer: 'mean', explanation: say('„What does it mean?” to „Co to znaczy?”.', '«What does it mean?» — «Что это значит?».') },
        { sentence: 'Could you ___ the question, please?', answer: 'repeat', explanation: say('„Repeat the question” to powtórzyć pytanie.', '«Repeat the question» — повторить вопрос.') },
        { sentence: "I'm ___ I haven't done my homework.", answer: 'sorry', explanation: say('„I’m sorry (that)…” to przeprosiny za coś, co się stało.', '«I’m sorry (that)…» — извинение за то, что произошло.') },
        { sentence: "Don't give ___! You're nearly there.", answer: 'up', explanation: say('„Give up” to poddać się.', '«Give up» — сдаваться.') },
      ],
    },
    {
      id: 'edu-sj-3',
      type: 'mini-dialogue',
      level: 'P',
      functionLabel: 'Usprawiedliwianie się i zachęcanie',
      instruction: MINI(3),
      items: [
        {
          id: 'edu-sj-3-1',
          lines: [X("Why didn't you hand in your essay yesterday?"), gapY],
          options: ["I was ill, so I couldn't finish it.", "Because it's very interesting.", 'Yes, I handed it in.'],
          correctIndex: 0,
          explanation: say('Pytanie o przyczynę wymaga usprawiedliwienia. B nie wyjaśnia, a C przeczy pytaniu i nie odpowiada na „why”.', 'Вопрос о причине требует объяснения. B ничего не объясняет, а C противоречит вопросу и не отвечает на «why».'),
        },
        {
          id: 'edu-sj-3-2',
          lines: [X("I got a C in maths again. I'm hopeless!"), gapY],
          options: ['Congratulations! Well done!', "Don't be so hard on yourself. A C isn't that bad.", "You're welcome."],
          correctIndex: 1,
          explanation: say('X jest przygnębiony, więc pasuje pocieszenie. A to gratulacje, a C to odpowiedź na podziękowanie.', 'X расстроен, поэтому нужно утешение. A — поздравление, C — ответ на благодарность.'),
        },
        {
          id: 'edu-sj-3-3',
          lines: [X('Excuse me, may I ask a question?'), gapY],
          options: ['Yes, I may.', 'Thank you for asking.', 'Of course. Go ahead.'],
          correctIndex: 2,
          explanation: say('Na prośbę o pozwolenie odpowiadamy „Of course”. A ma złą osobę: pozwalamy komuś, więc „you may”.', 'На просьбу о разрешении отвечаем «Of course». В A неверное лицо: разрешаем другому, значит, «you may».'),
        },
      ],
    },
    {
      id: 'edu-sj-4',
      type: 'mini-dialogue',
      level: 'P',
      functionLabel: 'Prośba o pomoc i o pozwolenie',
      instruction: MINI(3),
      tip: MINI_TIP,
      items: [
        {
          id: 'edu-sj-4-1',
          lines: [X('Did you understand the physics homework?'), gapY, X("Don't worry, I'll show you how to do it after lunch.")],
          options: ['Yes, it was really easy.', 'Not a word, to be honest.', "Yes, I've already finished it."],
          correctIndex: 1,
          explanation: say('Pomoc w trzeciej kwestii ma sens tylko wtedy, gdy Y nic nie rozumie. A i C pasują do pytania, ale nie do reszty dialogu.', 'Помощь в третьей реплике имеет смысл, только если Y ничего не понял. A и C подходят к вопросу, но не ко всему диалогу.'),
        },
        {
          id: 'edu-sj-4-2',
          lines: [X('Can I copy your answers?'), gapY, X("OK, you're right. I'll do it myself.")],
          options: ['Sure, here they are.', 'Of course. Take my notebook.', "No way. That's cheating."],
          correctIndex: 2,
          explanation: say('„You’re right. I’ll do it myself” to reakcja na odmowę. A i B to zgoda.', '«You’re right. I’ll do it myself» — реакция на отказ. A и B — согласие.'),
        },
        {
          id: 'edu-sj-4-3',
          lines: [X('Mr Brown, could I hand in my project on Monday?'), gapY, X("Thank you, sir. I promise it'll be ready.")],
          options: ['All right, but not a day later.', 'No, the deadline was last week.', "I'm afraid that's impossible."],
          correctIndex: 0,
          explanation: say('Uczeń dziękuje i obiecuje, więc nauczyciel się zgodził. B i C to odmowy.', 'Ученик благодарит и обещает, значит, учитель согласился. B и C — отказы.'),
        },
      ],
    },
  ],

  praca: [
    {
      id: 'praca-sj-1',
      type: 'matching',
      level: 'P',
      functionLabel: 'Rozmowa telefoniczna',
      instruction: MATCH,
      prompts: [
        { id: '1', text: 'Could I speak to Mrs Evans, please?' },
        { id: '2', text: 'Can I take a message?' },
        { id: '3', text: "Who's calling, please?" },
        { id: '4', text: 'Could you hold on for a moment?' },
        { id: '5', text: "Sorry, I think you've got the wrong number." },
      ],
      replies: [
        { id: 'a', text: "It's Tom Reed from Smith & Co." },
        { id: 'b', text: 'Oh, I do apologise for disturbing you.' },
        { id: 'c', text: "I'm afraid she's in a meeting at the moment." },
        { id: 'd', text: "Yes, no problem. I'll wait." },
        { id: 'e', text: 'Yes, please. Could you ask her to call me back?' },
      ],
      answers: { '1': 'c', '2': 'e', '3': 'a', '4': 'd', '5': 'b' },
      explanations: {
        '1': say('„I’m afraid…” grzecznie informuje, że osoba jest niedostępna.', '«I’m afraid…» вежливо сообщает, что человек недоступен.'),
        '2': say('„Take a message” to przyjąć wiadomość; dzwoniący prosi o oddzwonienie.', '«Take a message» — принять сообщение; звонящий просит перезвонить.'),
        '3': say('W telefonie przedstawiamy się: „It’s…”, a nie „I am…”.', 'По телефону представляемся так: «It’s…», а не «I am…».'),
        '4': say('„Hold on” to poczekać przy telefonie.', '«Hold on» — подождать у телефона.'),
        '5': say('Po pomyłce przepraszamy za kłopot.', 'Ошибившись номером, извиняемся за беспокойство.'),
      },
    },
    {
      id: 'praca-sj-2',
      type: 'word-bank',
      level: 'P',
      functionLabel: 'Rozmowa kwalifikacyjna',
      instruction: BANK_EXTRA,
      bank: ['apply', 'experience', 'hours', 'looking', 'wages', 'work'],
      items: [
        { sentence: "I'm writing to ___ for the position of sales assistant.", answer: 'apply', explanation: say('„Apply for a job” to ubiegać się o pracę.', '«Apply for a job» — претендовать на работу.') },
        { sentence: 'Do you have any ___ of working with customers?', answer: 'experience', explanation: say('„Experience of doing something” to doświadczenie w czymś.', '«Experience of doing something» — опыт в чём-либо.') },
        { sentence: 'What are the working ___?', answer: 'hours', explanation: say('„Working hours” to godziny pracy.', '«Working hours» — рабочие часы.') },
        { sentence: "I'm ___ forward to hearing from you.", answer: 'looking', explanation: say('„Look forward to + -ing” to czekać na coś z niecierpliwością.', '«Look forward to + -ing» — с нетерпением ждать чего-либо.') },
        { sentence: 'Why do you want to ___ for our company?', answer: 'work', explanation: say('„Work for a company” to pracować dla firmy.', '«Work for a company» — работать на компанию.') },
      ],
    },
    {
      id: 'praca-sj-3',
      type: 'mini-dialogue',
      level: 'P',
      functionLabel: 'Polecenia, zgoda i odmowa',
      instruction: MINI(3),
      items: [
        {
          id: 'praca-sj-3-1',
          lines: [X('Could you finish this report by five?'), gapY],
          options: ["Sure, I'll get on with it right away.", 'I finish at five every day.', "You're welcome."],
          correctIndex: 0,
          explanation: say('To prośba szefa, więc pasuje zgoda. B mówi o godzinach pracy, a C to odpowiedź na podziękowanie.', 'Это просьба начальника, поэтому нужно согласие. B — о графике работы, C — ответ на благодарность.'),
        },
        {
          id: 'praca-sj-3-2',
          lines: [X('Would you mind working this Saturday?'), gapY],
          options: ['Yes, with pleasure.', "Sorry, I can't. I've got a family wedding.", "No, I wouldn't work."],
          correctIndex: 1,
          explanation: say('Po „Would you mind…?” „Yes” oznacza sprzeciw, więc A jest sprzeczne. Zgoda to „Not at all”. C nie brzmi jak uprzejma odpowiedź.', 'После «Would you mind…?» «Yes» означает возражение, поэтому A противоречит себе. Согласие — «Not at all». C не звучит как вежливый ответ.'),
        },
        {
          id: 'praca-sj-3-3',
          lines: [X('What made you apply for this job?'), gapY],
          options: ['I started last month.', 'The salary is paid monthly.', "I've always wanted to work with children."],
          correctIndex: 2,
          explanation: say('Pytanie dotyczy motywacji. A mówi o czasie, a B o wypłacie.', 'Вопрос о мотивации. A — о времени, B — о зарплате.'),
        },
      ],
    },
    {
      id: 'praca-sj-4',
      type: 'mini-dialogue',
      level: 'P',
      functionLabel: 'Praca: rozmowy i ustalenia',
      instruction: MINI(3),
      tip: MINI_TIP,
      items: [
        {
          id: 'praca-sj-4-1',
          lines: [X('Have you had any experience in sales?'), gapY, X("That's useful. What did you do there exactly?")],
          options: ['No, this would be my first job.', "Not yet, but I'd like to try.", 'Yes, I worked in a shoe shop last summer.'],
          correctIndex: 2,
          explanation: say('„There” w trzeciej kwestii wymaga wskazania miejsca pracy. A i B to odpowiedzi przeczące.', '«There» в третьей реплике требует названного места работы. A и B — отрицательные ответы.'),
        },
        {
          id: 'praca-sj-4-2',
          lines: [X('Can I speak to Mr Lee, please?'), gapY, X("OK, I'll ring back after lunch.")],
          options: ["He's out at the moment.", 'Speaking. How can I help?', "Just a second, I'll put you through."],
          correctIndex: 0,
          explanation: say('X oddzwoni później, bo pana Lee nie ma. B i C pozwalają od razu rozmawiać.', 'X перезвонит позже, потому что господина Ли нет. B и C позволяют поговорить сразу.'),
        },
        {
          id: 'praca-sj-4-3',
          lines: [X('Could you possibly stay late tonight?'), gapY, X('Thanks a lot. I owe you one.')],
          options: ['Sorry, I have to pick up my son.', 'Yes, I can do that.', "I'm afraid I've got other plans."],
          correctIndex: 1,
          explanation: say('X dziękuje, więc Y się zgodził. A i C to odmowy.', 'X благодарит, значит, Y согласился. A и C — отказы.'),
        },
      ],
    },
  ],

  'zycie-prywatne': [
    {
      id: 'zp-sj-1',
      type: 'matching',
      level: 'P',
      functionLabel: 'Gratulacje, współczucie, zaproszenia',
      instruction: MATCH,
      prompts: [
        { id: '1', text: "We're getting married in June!" },
        { id: '2', text: 'My grandfather died last week.' },
        { id: '3', text: 'Would you like to come to my birthday party?' },
        { id: '4', text: 'Shall we meet at seven?' },
        { id: '5', text: 'Have a great time at the wedding!' },
      ],
      replies: [
        { id: 'a', text: 'Let\'s make it eight. I finish work late.' },
        { id: 'b', text: "Congratulations! That's wonderful news." },
        { id: 'c', text: "Thanks, I'm sure we will." },
        { id: 'd', text: "I'm so sorry. You must really miss him." },
        { id: 'e', text: "I'd love to, thanks for asking." },
      ],
      answers: { '1': 'b', '2': 'd', '3': 'e', '4': 'a', '5': 'c' },
      explanations: {
        '1': say('Na dobrą wiadomość reagujemy gratulacjami.', 'На хорошую новость отвечаем поздравлением.'),
        '2': say('Współczucie wyrażamy zwrotem „I’m so sorry”.', 'Сочувствие выражаем фразой «I’m so sorry».'),
        '3': say('Przyjęcie zaproszenia: „I’d love to”.', 'Принимаем приглашение: «I’d love to».'),
        '4': say('„Let’s make it eight” proponuje inną godzinę.', '«Let’s make it eight» предлагает другое время.'),
        '5': say('Na życzenia dziękujemy; „we will” nawiązuje do „have a great time”.', 'На пожелание отвечаем благодарностью; «we will» отсылает к «have a great time».'),
      },
    },
    {
      id: 'zp-sj-2',
      type: 'word-bank',
      level: 'P',
      functionLabel: 'Umawianie się',
      instruction: BANK_EXTRA,
      bank: ['afraid', 'free', 'how', 'love', 'much', 'time'],
      items: [
        { sentence: 'Are you ___ on Saturday evening?', answer: 'free', explanation: say('„Are you free?” to „Czy masz czas?”.', '«Are you free?» — «Ты свободен?».') },
        { sentence: '___ about going out for a pizza?', answer: 'How', explanation: say('„How about + -ing?” to propozycja: „Może…?”.', '«How about + -ing?» — предложение: «Как насчёт…?».') },
        { sentence: "I'd ___ to, but I'm babysitting.", answer: 'love', explanation: say('„I’d love to, but…” to uprzejma odmowa.', '«I’d love to, but…» — вежливый отказ.') },
        { sentence: 'What ___ shall we meet?', answer: 'time', explanation: say('„What time…?” to pytanie o godzinę.', '«What time…?» — вопрос о времени.') },
        { sentence: "I'm ___ I can't make it tomorrow.", answer: 'afraid', explanation: say('„I can’t make it” to „nie dam rady przyjść”; „I’m afraid” łagodzi odmowę.', '«I can’t make it» — «я не смогу прийти»; «I’m afraid» смягчает отказ.') },
      ],
    },
    {
      id: 'zp-sj-3',
      type: 'mini-dialogue',
      level: 'P',
      functionLabel: 'Przyjmowanie i odrzucanie zaproszeń',
      instruction: MINI(3),
      items: [
        {
          id: 'zp-sj-3-1',
          lines: [X('Would you like to come to the cinema with us?'), gapY],
          options: ["I'd love to, but I've got to study.", 'I like it very much.', 'Yes, I went yesterday.'],
          correctIndex: 0,
          explanation: say('„Would you like to…?” to zaproszenie, a nie pytanie o upodobania (B). C nie odpowiada na zaproszenie.', '«Would you like to…?» — приглашение, а не вопрос о вкусах (B). C не отвечает на приглашение.'),
        },
        {
          id: 'zp-sj-3-2',
          lines: [X("Sorry I can't come to your party."), gapY],
          options: ['Yes, you can.', 'Never mind. Maybe next time.', "You're welcome."],
          correctIndex: 1,
          explanation: say('Na odmowę reagujemy „Never mind”. „You’re welcome” to odpowiedź na podziękowanie.', 'На отказ отвечаем «Never mind». «You’re welcome» — ответ на благодарность.'),
        },
        {
          id: 'zp-sj-3-3',
          lines: [X("I've just got engaged!"), gapY],
          options: ['What a pity!', 'Get well soon!', "That's fantastic news! Congratulations!"],
          correctIndex: 2,
          explanation: say('Zaręczyny to dobra wiadomość. A wyraża żal, a B to życzenia dla chorego.', 'Помолвка — хорошая новость. A выражает сожаление, B — пожелание больному.'),
        },
      ],
    },
    {
      id: 'zp-sj-4',
      type: 'mini-dialogue',
      level: 'P',
      functionLabel: 'Współczucie i umawianie się',
      instruction: MINI(3),
      tip: MINI_TIP,
      items: [
        {
          id: 'zp-sj-4-1',
          lines: [X('How did your driving test go?'), gapY, X('Never mind. You can take it again next month.')],
          options: ['I failed it again.', 'I passed first time!', 'It went really well.'],
          correctIndex: 0,
          explanation: say('„Never mind” i powtórka egzaminu wskazują na porażkę. B i C mówią o sukcesie.', '«Never mind» и пересдача указывают на неудачу. B и C — об успехе.'),
        },
        {
          id: 'zp-sj-4-2',
          lines: [X('Are we still meeting on Sunday?'), gapY, X("OK then, let's say Monday instead.")],
          options: ['Yes, see you at three.', "Sorry, something's come up.", "Yes, I'm looking forward to it."],
          correctIndex: 1,
          explanation: say('„Monday instead” oznacza zmianę terminu, więc Y nie może w niedzielę. A i C potwierdzają spotkanie.', '«Monday instead» означает перенос, значит, Y не может в воскресенье. A и C подтверждают встречу.'),
        },
        {
          id: 'zp-sj-4-3',
          lines: [X('Did you hear that Kate and Mark have split up?'), gapY, X("Yes, it's sad. They've been together for years.")],
          options: ["Really? That's wonderful!", "Yes, I'm going to their wedding.", "No! I can't believe it. What a shame."],
          correctIndex: 2,
          explanation: say('X odpowiada „Yes, it’s sad”, zgadzając się z żalem Y. A jest radosne, a B przeczy rozstaniu.', 'X отвечает «Yes, it’s sad», соглашаясь с сожалением Y. A радостное, а B противоречит расставанию.'),
        },
      ],
    },
  ],

  zywienie: [
    {
      id: 'zyw-sj-1',
      type: 'matching',
      level: 'P',
      functionLabel: 'W restauracji',
      instruction: MATCH,
      prompts: [
        { id: '1', text: 'Are you ready to order?' },
        { id: '2', text: 'Would you like some more cake?' },
        { id: '3', text: 'How would you like your steak?' },
        { id: '4', text: 'Excuse me, this soup is cold.' },
        { id: '5', text: 'Could we have the bill, please?' },
      ],
      replies: [
        { id: 'a', text: "No, thanks. I'm full." },
        { id: 'b', text: "Certainly. I'll be right back." },
        { id: 'c', text: 'Medium rare, please.' },
        { id: 'd', text: "Yes, I'll have the fish, please." },
        { id: 'e', text: "I'm terribly sorry. I'll bring you another one." },
      ],
      answers: { '1': 'd', '2': 'a', '3': 'c', '4': 'e', '5': 'b' },
      explanations: {
        '1': say('Zamawiamy zwrotem „I’ll have…”.', 'Заказываем фразой «I’ll have…».'),
        '2': say('Odmawiamy grzecznie: „No, thanks. I’m full”.', 'Вежливо отказываемся: «No, thanks. I’m full».'),
        '3': say('„Medium rare” to stopień wysmażenia steku.', '«Medium rare» — степень прожарки стейка.'),
        '4': say('Na skargę kelner przeprasza i proponuje rozwiązanie.', 'На жалобу официант извиняется и предлагает решение.'),
        '5': say('Prośba o rachunek: kelner zgadza się i zaraz wróci.', 'Просьба принести счёт: официант соглашается и сейчас вернётся.'),
      },
    },
    {
      id: 'zyw-sj-2',
      type: 'word-bank',
      level: 'P',
      functionLabel: 'Częstowanie i zamawianie',
      instruction: BANK_EXTRA,
      bank: ['help', 'like', 'menu', 'rather', 'table', 'try'],
      items: [
        { sentence: "I'd like to book a ___ for two, please.", answer: 'table', explanation: say('„Book a table” to zarezerwować stolik.', '«Book a table» — забронировать столик.') },
        { sentence: 'Please ___ yourself to some salad.', answer: 'help', explanation: say('„Help yourself” to „częstuj się”.', '«Help yourself» — «угощайся».') },
        { sentence: 'Would you ___ anything to drink?', answer: 'like', explanation: say('„Would you like…?” to uprzejma propozycja.', '«Would you like…?» — вежливое предложение.') },
        { sentence: "I'd ___ have tea than coffee.", answer: 'rather', explanation: say('„I’d rather… than…” to „wolałbym… niż…”.', '«I’d rather… than…» — «я бы предпочёл…, чем…».') },
        { sentence: "You must ___ this cheesecake. It's delicious!", answer: 'try', explanation: say('„Try” to spróbować potrawy.', '«Try» — попробовать блюдо.') },
      ],
    },
    {
      id: 'zyw-sj-3',
      type: 'mini-dialogue',
      level: 'P',
      functionLabel: 'Częstowanie i upodobania',
      instruction: MINI(3),
      items: [
        {
          id: 'zyw-sj-3-1',
          lines: [X('Can I get you something to drink?'), gapY],
          options: ['Just a glass of water, please.', "I don't eat meat.", 'Yes, I can.'],
          correctIndex: 0,
          explanation: say('„Can I get you…?” to propozycja, więc mówimy, co chcemy. C powtarza „can” bez sensu, a B dotyczy jedzenia.', '«Can I get you…?» — предложение, поэтому говорим, что хотим. C бессмысленно повторяет «can», а B — о еде.'),
        },
        {
          id: 'zyw-sj-3-2',
          lines: [X('Do you fancy Italian or Chinese tonight?'), gapY],
          options: ['Yes, I do.', "I'm not keen on noodles, so Italian.", 'It was delicious.'],
          correctIndex: 1,
          explanation: say('Pytanie z „or” wymaga wyboru, a nie „yes”. C jest w czasie przeszłym, a mowa o dzisiejszym wieczorze.', 'Вопрос с «or» требует выбора, а не «yes». C в прошедшем времени, а речь о сегодняшнем вечере.'),
        },
        {
          id: 'zyw-sj-3-3',
          lines: [X("What's the soup of the day?"), gapY],
          options: ["I'd like some, please.", "It's very hot today.", 'Tomato with basil.'],
          correctIndex: 2,
          explanation: say('Pytanie dotyczy rodzaju zupy. A to zamówienie, a B mówi o pogodzie.', 'Вопрос о том, какой суп сегодня. A — заказ, B — о погоде.'),
        },
      ],
    },
    {
      id: 'zyw-sj-4',
      type: 'mini-dialogue',
      level: 'P',
      functionLabel: 'Skarga i propozycje przy stole',
      instruction: MINI(3),
      tip: MINI_TIP,
      items: [
        {
          id: 'zyw-sj-4-1',
          lines: [X('Is everything all right with your meal?'), gapY, X("I'm so sorry. I'll ask the chef to cook it a bit longer.")],
          options: ['Actually, the chicken is still raw inside.', 'Yes, it\'s delicious, thank you.', "Yes, everything's perfect."],
          correctIndex: 0,
          explanation: say('Przeprosiny kelnera mają sens tylko po skardze. B i C to zadowolenie gościa.', 'Извинения официанта имеют смысл только после жалобы. B и C выражают довольство гостя.'),
        },
        {
          id: 'zyw-sj-4-2',
          lines: [X('Would you like to try my curry?'), gapY, X("Don't worry, I'll make you a sandwich instead.")],
          options: ['Yes, please. It smells great.', "Thanks, but I can't eat anything spicy.", "Mmm, that's lovely."],
          correctIndex: 1,
          explanation: say('„Instead” oznacza, że Y odmówił. A i C przyjmują poczęstunek.', '«Instead» значит, что Y отказался. A и C принимают угощение.'),
        },
        {
          id: 'zyw-sj-4-3',
          lines: [X('Shall I cook tonight?'), gapY, X("Fine, but you're paying this time.")],
          options: ["Yes, please. I'm starving.", 'Good idea. What are you making?', "No need. Let's just order a pizza."],
          correctIndex: 2,
          explanation: say('„You’re paying” pasuje do zamawiania jedzenia. A i B przyjmują propozycję gotowania.', '«You’re paying» подходит к заказу еды. A и B принимают предложение приготовить.'),
        },
      ],
    },
  ],

  zakupy: [
    {
      id: 'zak-sj-1',
      type: 'matching',
      level: 'P',
      functionLabel: 'W sklepie: cena, rozmiar, zwrot',
      instruction: MATCH,
      prompts: [
        { id: '1', text: 'Can I help you?' },
        { id: '2', text: 'How much are these jeans?' },
        { id: '3', text: 'Do you have this in a medium?' },
        { id: '4', text: 'Can I try it on?' },
        { id: '5', text: "I'd like to return this shirt." },
      ],
      replies: [
        { id: 'a', text: "They're £30, but there's 20% off today." },
        { id: 'b', text: 'Of course. The changing rooms are over there.' },
        { id: 'c', text: "No, thanks. I'm just looking." },
        { id: 'd', text: 'Have you got the receipt?' },
        { id: 'e', text: 'Let me check in the stockroom.' },
      ],
      answers: { '1': 'c', '2': 'a', '3': 'e', '4': 'b', '5': 'd' },
      explanations: {
        '1': say('„I’m just looking” to „tylko się rozglądam”.', '«I’m just looking» — «я просто смотрю».'),
        '2': say('„Jeans” to liczba mnoga, stąd „They’re”.', '«Jeans» — множественное число, поэтому «They’re».'),
        '3': say('Sprzedawca sprawdza, czy ma rozmiar na zapleczu.', 'Продавец проверяет наличие размера на складе.'),
        '4': say('„Try on” to przymierzyć; przymierzalnia to „changing room”.', '«Try on» — примерить; примерочная — «changing room».'),
        '5': say('Przy zwrocie sprzedawca prosi o paragon.', 'При возврате продавец просит чек.'),
      },
    },
    {
      id: 'zak-sj-2',
      type: 'word-bank',
      level: 'P',
      functionLabel: 'Płatności i reklamacje',
      instruction: BANK_EXTRA,
      bank: ['account', 'bargain', 'cash', 'fit', 'receipt', 'refund'],
      items: [
        { sentence: "I'd like my money back. Could I have a ___?", answer: 'refund', explanation: say('„Refund” to zwrot pieniędzy.', '«Refund» — возврат денег.') },
        { sentence: "These shoes don't ___ me. They're too small.", answer: 'fit', explanation: say('„Fit” dotyczy rozmiaru, a „suit” wyglądu.', '«Fit» — о размере, а «suit» — о том, идёт ли вещь.') },
        { sentence: 'Would you like to pay by card or in ___?', answer: 'cash', explanation: say('„Pay in cash” to płacić gotówką.', '«Pay in cash» — платить наличными.') },
        { sentence: "I'd like to open a savings ___.", answer: 'account', explanation: say('„Savings account” to konto oszczędnościowe.', '«Savings account» — сберегательный счёт.') },
        { sentence: "I'm afraid we can't exchange it without a ___.", answer: 'receipt', explanation: say('„Receipt” to paragon.', '«Receipt» — чек.') },
      ],
    },
    {
      id: 'zak-sj-3',
      type: 'mini-dialogue',
      level: 'P',
      functionLabel: 'Porady przy zakupach, reklamacja',
      instruction: MINI(3),
      items: [
        {
          id: 'zak-sj-3-1',
          lines: [X('Does this jacket suit me?'), gapY],
          options: ['Yes, it looks great on you.', 'Yes, it costs a lot.', "It's in the sale."],
          correctIndex: 0,
          explanation: say('„Suit” dotyczy wyglądu, a B i C mówią o cenie.', '«Suit» — о том, идёт ли вещь, а B и C — о цене.'),
        },
        {
          id: 'zak-sj-3-2',
          lines: [X("I bought this kettle here last week and it doesn't work."), gapY],
          options: ['Enjoy your kettle!', "I'm sorry about that. Would you like a replacement?", "You're right, it's cheap."],
          correctIndex: 1,
          explanation: say('Na reklamację sprzedawca przeprasza i proponuje wymianę. A i C ignorują problem.', 'На жалобу продавец извиняется и предлагает замену. A и C игнорируют проблему.'),
        },
        {
          id: 'zak-sj-3-3',
          lines: [X('How would you like the money?'), gapY],
          options: ['Not much, thanks.', "I've got an account here.", 'In twenties, please.'],
          correctIndex: 2,
          explanation: say('Kasjer pyta o nominały: „in twenties” to w banknotach dwudziestofuntowych.', 'Кассир спрашивает о номинале: «in twenties» — купюрами по двадцать фунтов.'),
        },
      ],
    },
    {
      id: 'zak-sj-4',
      type: 'mini-dialogue',
      level: 'P',
      functionLabel: 'Reklamacja i w banku',
      instruction: MINI(3),
      tip: MINI_TIP,
      items: [
        {
          id: 'zak-sj-4-1',
          lines: [X('Excuse me, do these trousers come in black?'), gapY, X("What a pity. I'll have to try another shop.")],
          options: ["I'm afraid we've sold out.", 'Yes, here you are.', 'Yes, what size do you need?'],
          correctIndex: 0,
          explanation: say('„What a pity” i szukanie innego sklepu oznaczają, że spodni nie ma. B i C potwierdzają dostępność.', '«What a pity» и поиски другого магазина значат, что брюк нет. B и C подтверждают наличие.'),
        },
        {
          id: 'zak-sj-4-2',
          lines: [X("What's wrong with the laptop?"), gapY, X('In that case, we can repair it for free.')],
          options: ["I've spilt coffee on it.", "It stopped working and it's still under guarantee.", "I don't like the colour."],
          correctIndex: 1,
          explanation: say('Darmowa naprawa ma sens tylko na gwarancji. A to wina klienta, a C nie jest usterką.', 'Бесплатный ремонт возможен только по гарантии. A — вина клиента, а C — не неисправность.'),
        },
        {
          id: 'zak-sj-4-3',
          lines: [X("I'd like to withdraw £500, please."), gapY, X('Here you are.')],
          options: ["Certainly. Here's your cash.", "I'm sorry, the bank's closed.", 'Certainly. Could I see your ID, please?'],
          correctIndex: 2,
          explanation: say('„Here you are” mówimy, podając coś: tu klient podaje dowód. A pasuje do pierwszej kwestii, ale wtedy to kasjer podawałby pieniądze.', '«Here you are» говорят, подавая что-то: здесь клиент подаёт документ. A подходит к первой реплике, но тогда деньги подаёт кассир.'),
        },
      ],
    },
  ],

  podroze: [
    {
      id: 'pod-sj-1',
      type: 'matching',
      level: 'P',
      functionLabel: 'Bilety, droga, hotel',
      instruction: MATCH,
      prompts: [
        { id: '1', text: 'A return to Leeds, please.' },
        { id: '2', text: 'Excuse me, does this train stop at York?' },
        { id: '3', text: 'I have a reservation in the name of Nowak.' },
        { id: '4', text: 'How do I get to the city centre?' },
        { id: '5', text: 'What time is breakfast served?' },
      ],
      replies: [
        { id: 'a', text: 'No, you need to change at Doncaster.' },
        { id: 'b', text: "Take the number 7 bus. It's the quickest way." },
        { id: 'c', text: 'From seven till ten in the dining room.' },
        { id: 'd', text: "That's £24. Platform 2." },
        { id: 'e', text: 'Yes, here it is. Could you fill in this form?' },
      ],
      answers: { '1': 'd', '2': 'a', '3': 'e', '4': 'b', '5': 'c' },
      explanations: {
        '1': say('„A return” to bilet powrotny; kasjer podaje cenę.', '«A return» — билет туда и обратно; кассир называет цену.'),
        '2': say('„Change at…” to przesiadka.', '«Change at…» — пересадка.'),
        '3': say('Recepcjonista znajduje rezerwację i prosi o wypełnienie formularza.', 'Администратор находит бронь и просит заполнить форму.'),
        '4': say('Pytanie o drogę: odpowiedź wskazuje sposób dotarcia.', 'Вопрос о дороге: в ответе называем способ добраться.'),
        '5': say('„What time” pyta o godzinę.', '«What time» — вопрос о времени.'),
      },
    },
    {
      id: 'pod-sj-2',
      type: 'word-bank',
      level: 'P',
      functionLabel: 'Zameldowanie w hotelu',
      instruction: BANK_EXTRA,
      bank: ['booked', 'check', 'key', 'leave', 'trip', 'view'],
      items: [
        { sentence: "I've ___ a room for three nights.", answer: 'booked', explanation: say('„Book a room” to zarezerwować pokój.', '«Book a room» — забронировать номер.') },
        { sentence: 'What time do we have to ___ out?', answer: 'check', explanation: say('„Check out” to wymeldować się z hotelu.', '«Check out» — выехать из отеля.') },
        { sentence: 'Could I have a room with a sea ___?', answer: 'view', explanation: say('„Sea view” to widok na morze.', '«Sea view» — вид на море.') },
        { sentence: "Here's your ___. Your room is on the fourth floor.", answer: 'key', explanation: say('Recepcjonista wręcza klucz do pokoju.', 'Администратор вручает ключ от номера.') },
        { sentence: 'What time does the next bus ___?', answer: 'leave', explanation: say('„Leave” to odjeżdżać.', '«Leave» — отправляться.') },
      ],
    },
    {
      id: 'pod-sj-3',
      type: 'mini-dialogue',
      level: 'P',
      functionLabel: 'Prośba o informację',
      instruction: MINI(3),
      items: [
        {
          id: 'pod-sj-3-1',
          lines: [X('Excuse me, how far is the museum from here?'), gapY],
          options: ["It's about a ten-minute walk.", 'It opens at nine.', 'By taxi, I think.'],
          correctIndex: 0,
          explanation: say('„How far” pyta o odległość. B podaje godzinę otwarcia, a C środek transportu.', '«How far» — вопрос о расстоянии. B называет время открытия, C — транспорт.'),
        },
        {
          id: 'pod-sj-3-2',
          lines: [X('Is this seat taken?'), gapY],
          options: ['Yes, please sit down.', 'No, go ahead.', "I'm going to Kraków."],
          correctIndex: 1,
          explanation: say('„Taken” to „zajęte”, więc zgoda to „No”. W A „Yes” przeczy „please sit down”.', '«Taken» значит «занято», поэтому согласие — «No». В A «Yes» противоречит «please sit down».'),
        },
        {
          id: 'pod-sj-3-3',
          lines: [X('Do I need to book in advance?'), gapY],
          options: ['I went there last year.', "It's not far.", "Yes, it's always busy in summer."],
          correctIndex: 2,
          explanation: say('Pytanie wymaga odpowiedzi „tak” lub „nie” z powodem. A i B nie mówią o rezerwacji.', 'На вопрос нужно ответить «да» или «нет» с причиной. A и B не о бронировании.'),
        },
      ],
    },
    {
      id: 'pod-sj-4',
      type: 'mini-dialogue',
      level: 'P',
      functionLabel: 'Podróż: pytania i problemy',
      instruction: MINI(3),
      tip: MINI_TIP,
      items: [
        {
          id: 'pod-sj-4-1',
          lines: [X('Has the flight to Gdańsk landed yet?'), gapY, X('Oh no, my sister will be so tired.')],
          options: ["No, it's three hours late.", 'Yes, ten minutes ago.', 'Yes, right on time.'],
          correctIndex: 0,
          explanation: say('„Oh no” i zmęczenie siostry wskazują na opóźnienie. B i C mówią o locie bez problemów.', '«Oh no» и усталость сестры указывают на задержку. B и C — о полёте без проблем.'),
        },
        {
          id: 'pod-sj-4-2',
          lines: [X('Excuse me, are you from around here?'), gapY, X("Never mind. I'll ask someone else.")],
          options: ["Yes, I've lived here all my life.", "Sorry, I'm a tourist myself.", 'Yes, how can I help?'],
          correctIndex: 1,
          explanation: say('X pyta kogoś innego, bo Y nie jest stąd. A i C oznaczają, że Y mógłby pomóc.', 'X спросит кого-то другого, потому что Y не местный. A и C означают, что Y мог бы помочь.'),
        },
        {
          id: 'pod-sj-4-3',
          lines: [X('Could I change my ticket to tomorrow?'), gapY, X("That's fine. Here's my card.")],
          options: ["I'm afraid this ticket can't be changed.", 'No, there are no seats left.', "Yes, but there's a £10 fee."],
          correctIndex: 2,
          explanation: say('Klient wyjmuje kartę, więc jest coś do zapłacenia. A i B to odmowy.', 'Клиент достаёт карту, значит, нужно что-то оплатить. A и B — отказы.'),
        },
      ],
    },
  ],

  kultura: [
    {
      id: 'kul-sj-1',
      type: 'matching',
      level: 'P',
      functionLabel: 'Polecanie i opinie',
      instruction: MATCH,
      prompts: [
        { id: '1', text: 'What was the film like?' },
        { id: '2', text: 'Can you recommend a good book?' },
        { id: '3', text: 'I think the ending was brilliant.' },
        { id: '4', text: "Two tickets for tonight's show, please." },
        { id: '5', text: "Who's in it?" },
      ],
      replies: [
        { id: 'a', text: "I couldn't agree more." },
        { id: 'b', text: 'Emma Stone plays the main role.' },
        { id: 'c', text: "Try The Hobbit. I couldn't put it down." },
        { id: 'd', text: "I'm sorry, we're fully booked." },
        { id: 'e', text: 'Boring. I nearly fell asleep.' },
      ],
      answers: { '1': 'e', '2': 'c', '3': 'a', '4': 'd', '5': 'b' },
      explanations: {
        '1': say('„What was it like?” pyta o opinię, a nie o upodobania.', '«What was it like?» — вопрос о впечатлении, а не о вкусах.'),
        '2': say('„I couldn’t put it down” to „nie mogłem się oderwać”.', '«I couldn’t put it down» — «не мог оторваться».'),
        '3': say('„I couldn’t agree more” to pełna zgoda.', '«I couldn’t agree more» — полное согласие.'),
        '4': say('„Fully booked” to brak wolnych miejsc.', '«Fully booked» — свободных мест нет.'),
        '5': say('„Who’s in it?” pyta o obsadę.', '«Who’s in it?» — вопрос об актёрах.'),
      },
    },
    {
      id: 'kul-sj-2',
      type: 'word-bank',
      level: 'P',
      functionLabel: 'Opinie o filmie i książce',
      instruction: BANK_EXTRA,
      bank: ['about', 'agree', 'good', 'miss', 'opinion', 'worth'],
      items: [
        { sentence: 'In my ___, the book is better than the film.', answer: 'opinion', explanation: say('„In my opinion” to „moim zdaniem”.', '«In my opinion» — «по моему мнению».') },
        { sentence: 'That new musical is really ___ seeing.', answer: 'worth', explanation: say('„Worth + -ing” to „warto coś zrobić”.', '«Worth + -ing» — «стоит что-то сделать».') },
        { sentence: "I don't ___ with you. I thought it was awful.", answer: 'agree', explanation: say('„Agree with somebody” to zgadzać się z kimś.', '«Agree with somebody» — соглашаться с кем-то.') },
        { sentence: "You mustn't ___ this exhibition!", answer: 'miss', explanation: say('„Miss” to przegapić, stracić okazję.', '«Miss» — пропустить, упустить.') },
        { sentence: "What's the film ___?", answer: 'about', explanation: say('„What’s it about?” to „O czym to jest?”.', '«What’s it about?» — «О чём это?».') },
      ],
    },
    {
      id: 'kul-sj-3',
      type: 'mini-dialogue',
      level: 'P',
      functionLabel: 'Zgadzanie się i niezgadzanie',
      instruction: MINI(3),
      items: [
        {
          id: 'kul-sj-3-1',
          lines: [X("That was the best concert I've ever been to!"), gapY],
          options: ['You\'re right, it was amazing.', "Yes, I've never been there.", 'Thank you very much.'],
          correctIndex: 0,
          explanation: say('Reagujemy na opinię zgodą. B jest niespójne, a C to podziękowanie.', 'Отвечаем на мнение согласием. B нелогично, а C — благодарность.'),
        },
        {
          id: 'kul-sj-3-2',
          lines: [X('Have you seen the new Bond film?'), gapY],
          options: ["Yes, I'm seeing.", 'Not yet. Is it any good?', "He's a spy."],
          correctIndex: 1,
          explanation: say('Na pytanie w Present Perfect odpowiadamy „Not yet”. A jest niepoprawne gramatycznie, a C nie odpowiada na pytanie.', 'На вопрос в Present Perfect отвечаем «Not yet». A грамматически неверно, а C не отвечает на вопрос.'),
        },
        {
          id: 'kul-sj-3-3',
          lines: [X('I think modern art is a waste of money.'), gapY],
          options: ["Yes, it's on the first floor.", "I don't, thanks.", "I'm not so sure. Some of it is really interesting."],
          correctIndex: 2,
          explanation: say('„I’m not so sure” to uprzejmy brak zgody. A i B nie odnoszą się do opinii.', '«I’m not so sure» — вежливое несогласие. A и B не связаны с мнением.'),
        },
      ],
    },
    {
      id: 'kul-sj-4',
      type: 'mini-dialogue',
      level: 'P',
      functionLabel: 'Bilety i polecanie',
      instruction: MINI(3),
      tip: MINI_TIP,
      items: [
        {
          id: 'kul-sj-4-1',
          lines: [X('Are there any tickets left for Saturday?'), gapY, X("OK, we'll come on Sunday then.")],
          options: ['Sorry, Saturday is sold out.', 'Yes, plenty.', 'Yes, how many would you like?'],
          correctIndex: 0,
          explanation: say('X zmienia dzień, więc na sobotę biletów nie ma. B i C potwierdzają ich dostępność.', 'X меняет день, значит, на субботу билетов нет. B и C подтверждают наличие.'),
        },
        {
          id: 'kul-sj-4-2',
          lines: [X('How was the play?'), gapY, X('Really? I thought you liked Shakespeare.')],
          options: ['Fantastic! You have to see it.', 'To be honest, I left at the interval.', 'One of the best I\'ve seen.'],
          correctIndex: 1,
          explanation: say('Zdziwienie X ma sens po złej opinii. A i C to pochwały.', 'Удивление X имеет смысл после плохого отзыва. A и C — похвала.'),
        },
        {
          id: 'kul-sj-4-3',
          lines: [X("I'm not sure what to read next."), gapY, X("Thanks, I'll look for it in the library.")],
          options: ['Me neither.', "I don't read much.", "Try this crime novel. It's great."],
          correctIndex: 2,
          explanation: say('„It” w trzeciej kwestii to książka polecona przez Y. A i B nie polecają niczego.', '«It» в третьей реплике — книга, которую посоветовал Y. A и B ничего не советуют.'),
        },
      ],
    },
  ],

  sport: [
    {
      id: 'sp-sj-1',
      type: 'matching',
      level: 'P',
      functionLabel: 'Wyniki, propozycje, doping',
      instruction: MATCH,
      prompts: [
        { id: '1', text: 'Who won the match?' },
        { id: '2', text: 'Fancy a game of tennis after school?' },
        { id: '3', text: 'We lost again!' },
        { id: '4', text: 'Come on! One more lap!' },
        { id: '5', text: 'I came first in the 100 metres!' },
      ],
      replies: [
        { id: 'a', text: "You'll do better next time. Bad luck!" },
        { id: 'b', text: "Well done! You must be so proud." },
        { id: 'c', text: 'It was a draw, two all.' },
        { id: 'd', text: "I can't! I'm completely out of breath." },
        { id: 'e', text: "Sorry, I've hurt my wrist." },
      ],
      answers: { '1': 'c', '2': 'e', '3': 'a', '4': 'd', '5': 'b' },
      explanations: {
        '1': say('„A draw” to remis, czyli nikt nie wygrał.', '«A draw» — ничья, то есть никто не выиграл.'),
        '2': say('„Fancy…?” to propozycja; kontuzja nadgarstka jest powodem odmowy.', '«Fancy…?» — предложение; травма запястья — причина отказа.'),
        '3': say('Po porażce pocieszamy: „Bad luck!”.', 'После поражения утешаем: «Bad luck!».'),
        '4': say('Doping na bieżni: biegacz odpowiada, że nie ma już siły.', 'Подбадривание на дорожке: бегун отвечает, что сил уже нет.'),
        '5': say('Sukces: gratulujemy zwrotem „Well done!”.', 'Успех: поздравляем фразой «Well done!».'),
      },
    },
    {
      id: 'sp-sj-2',
      type: 'word-bank',
      level: 'P',
      functionLabel: 'Propozycje i doping',
      instruction: BANK_EXTRA,
      bank: ['beat', 'go', 'join', 'luck', 'score', 'why'],
      items: [
        { sentence: 'Good ___ in the final tomorrow!', answer: 'luck', explanation: say('„Good luck” to życzenia powodzenia.', '«Good luck» — пожелание удачи.') },
        { sentence: 'Come on, you can ___ them!', answer: 'beat', explanation: say('„Beat somebody” to pokonać kogoś; „win” łączy się z meczem, nie z rywalem.', '«Beat somebody» — победить кого-то; «win» сочетается с матчем, а не с соперником.') },
        { sentence: "___ don't we go for a run?", answer: 'Why', explanation: say('„Why don’t we…?” to propozycja.', '«Why don’t we…?» — предложение.') },
        { sentence: 'Would you like to ___ us for a swim?', answer: 'join', explanation: say('„Join somebody” to dołączyć do kogoś.', '«Join somebody» — присоединиться к кому-то.') },
        { sentence: 'What was the ___? Did we win?', answer: 'score', explanation: say('„Score” to wynik meczu.', '«Score» — счёт матча.') },
      ],
    },
    {
      id: 'sp-sj-3',
      type: 'mini-dialogue',
      level: 'P',
      functionLabel: 'Proponowanie aktywności i zachęta',
      instruction: MINI(3),
      items: [
        {
          id: 'sp-sj-3-1',
          lines: [X('Shall we go cycling on Saturday?'), gapY],
          options: ["Good idea. Let's meet at ten.", "I've got a bike.", 'Yes, I cycled.'],
          correctIndex: 0,
          explanation: say('„Shall we…?” to propozycja, więc reagujemy zgodą lub odmową. C jest w czasie przeszłym.', '«Shall we…?» — предложение, поэтому отвечаем согласием или отказом. C в прошедшем времени.'),
        },
        {
          id: 'sp-sj-3-2',
          lines: [X("What's the score?"), gapY],
          options: ["It's on Channel 5.", "We're winning 3–1.", "It's a football match."],
          correctIndex: 1,
          explanation: say('„Score” to wynik. A mówi o kanale, a C o rodzaju wydarzenia.', '«Score» — счёт. A — о канале, C — о типе события.'),
        },
        {
          id: 'sp-sj-3-3',
          lines: [X("I've been training for months and I still can't run 5 km."), gapY],
          options: ['Well done! You won!', "I'm glad to hear that.", "Don't give up. You're getting better all the time."],
          correctIndex: 2,
          explanation: say('X jest zniechęcony, więc potrzebuje zachęty. A i B to reakcje na dobrą wiadomość.', 'X расстроен, ему нужна поддержка. A и B — реакции на хорошую новость.'),
        },
      ],
    },
    {
      id: 'sp-sj-4',
      type: 'mini-dialogue',
      level: 'P',
      functionLabel: 'Reakcje na wiadomości',
      instruction: MINI(3),
      tip: MINI_TIP,
      items: [
        {
          id: 'sp-sj-4-1',
          lines: [X('Did you watch the final last night?'), gapY, X('You missed a great game, then.')],
          options: ['No, I had to work.', 'Yes, it was brilliant.', 'Yes, what a goal in the last minute!'],
          correctIndex: 0,
          explanation: say('„You missed” oznacza, że Y nie oglądał. B i C mówią, że oglądał.', '«You missed» значит, что Y не смотрел. B и C говорят, что смотрел.'),
        },
        {
          id: 'sp-sj-4-2',
          lines: [X("How's your knee?"), gapY, X("Great! So you'll be able to play on Saturday.")],
          options: ["Still painful, I'm afraid.", 'Much better, thanks.', "I've got to see a doctor."],
          correctIndex: 1,
          explanation: say('Radość X i gra w sobotę wskazują na poprawę. A i C oznaczają, że kolano nadal boli.', 'Радость X и игра в субботу указывают на улучшение. A и C означают, что колено ещё болит.'),
        },
        {
          id: 'sp-sj-4-3',
          lines: [X('Do you want to join our basketball team?'), gapY, X("Don't worry, height isn't everything.")],
          options: ["Yes, I'd love to!", 'When do you train?', "I'm not sure. I'm rather short."],
          correctIndex: 2,
          explanation: say('X odnosi się do wzrostu, więc Y musiał o nim wspomnieć. A i B pasują tylko do pytania.', 'X говорит о росте, значит, Y о нём упомянул. A и B подходят только к вопросу.'),
        },
      ],
    },
  ],

  zdrowie: [
    {
      id: 'zd-sj-1',
      type: 'matching',
      level: 'P',
      functionLabel: 'U lekarza',
      instruction: MATCH,
      prompts: [
        { id: '1', text: 'What seems to be the problem?' },
        { id: '2', text: 'I feel dizzy.' },
        { id: '3', text: 'Are you allergic to anything?' },
        { id: '4', text: 'How often should I take the tablets?' },
        { id: '5', text: 'Are you feeling any better?' },
      ],
      replies: [
        { id: 'a', text: 'Only to penicillin, doctor.' },
        { id: 'b', text: "I've had a terrible headache since Monday." },
        { id: 'c', text: 'Twice a day after meals.' },
        { id: 'd', text: "Yes, thanks. The fever's gone." },
        { id: 'e', text: 'You should sit down and have some water.' },
      ],
      answers: { '1': 'b', '2': 'e', '3': 'a', '4': 'c', '5': 'd' },
      explanations: {
        '1': say('Pacjent opisuje objawy. „Since Monday” łączy się z Present Perfect.', 'Пациент описывает симптомы. «Since Monday» сочетается с Present Perfect.'),
        '2': say('Na złe samopoczucie reagujemy radą: „You should…”.', 'На плохое самочувствие отвечаем советом: «You should…».'),
        '3': say('„Allergic to” to uczulony na coś.', '«Allergic to» — с аллергией на что-то.'),
        '4': say('„How often” pyta o częstotliwość.', '«How often» — вопрос о частоте.'),
        '5': say('„The fever’s gone” to „gorączka minęła”.', '«The fever’s gone» — «температура спала».'),
      },
    },
    {
      id: 'zd-sj-2',
      type: 'word-bank',
      level: 'P',
      functionLabel: 'Objawy i rady',
      instruction: BANK_EXTRA,
      bank: ['appointment', 'better', 'care', 'cough', 'matter', 'sore'],
      items: [
        { sentence: "I'd like to make an ___ with Dr Smith.", answer: 'appointment', explanation: say('„Make an appointment” to umówić się na wizytę.', '«Make an appointment» — записаться на приём.') },
        { sentence: "I've got a ___ throat and a runny nose.", answer: 'sore', explanation: say('„Sore throat” to ból gardła.', '«Sore throat» — боль в горле.') },
        { sentence: "What's the ___? You look pale.", answer: 'matter', explanation: say('„What’s the matter?” to „Co się stało?”.', '«What’s the matter?» — «Что случилось?».') },
        { sentence: "You'd ___ stay in bed for a few days.", answer: 'better', explanation: say('„You’d better + bezokolicznik” to mocna rada.', '«You’d better + инфинитив» — настойчивый совет.') },
        { sentence: 'Take ___ of yourself!', answer: 'care', explanation: say('„Take care of yourself” to „dbaj o siebie”.', '«Take care of yourself» — «береги себя».') },
      ],
    },
    {
      id: 'zd-sj-3',
      type: 'mini-dialogue',
      level: 'P',
      functionLabel: 'Wyrażanie troski i rady',
      instruction: MINI(3),
      items: [
        {
          id: 'zd-sj-3-1',
          lines: [X("You don't look well. Are you OK?"), gapY],
          options: ['Actually, I feel a bit sick.', 'Yes, you look great.', "I'm sorry to hear that."],
          correctIndex: 0,
          explanation: say('Y mówi, jak się czuje. B mówi o wyglądzie X, a C to reakcja na czyjąś złą wiadomość.', 'Y говорит о самочувствии. B — о внешности X, а C — реакция на чужую плохую новость.'),
        },
        {
          id: 'zd-sj-3-2',
          lines: [X("I can't sleep at night."), gapY],
          options: ['Sleep well!', 'Have you tried cutting down on coffee?', 'I slept very well, thanks.'],
          correctIndex: 1,
          explanation: say('„Have you tried…?” to rada. A to życzenie na dobranoc, a C mówi o samym Y.', '«Have you tried…?» — совет. A — пожелание на ночь, а C — о самом Y.'),
        },
        {
          id: 'zd-sj-3-3',
          lines: [X('How long have you had this rash?'), gapY],
          options: ['On my arm.', 'Next week, I think.', 'For about a week.'],
          correctIndex: 2,
          explanation: say('Pytanie „How long…?” z Present Perfect wymaga „for”. A wskazuje miejsce, a B przyszłość.', 'Вопрос «How long…?» с Present Perfect требует «for». A называет место, B — будущее.'),
        },
      ],
    },
    {
      id: 'zd-sj-4',
      type: 'mini-dialogue',
      level: 'P',
      functionLabel: 'Objawy i rozmowa z lekarzem',
      instruction: MINI(3),
      tip: MINI_TIP,
      items: [
        {
          id: 'zd-sj-4-1',
          lines: [X("I've got a terrible toothache."), gapY, X("I know, but I'm scared of dentists!")],
          options: ['You should see a dentist.', 'Poor you! Does it hurt?', 'Take an aspirin and go to bed.'],
          correctIndex: 0,
          explanation: say('Trzecia kwestia odnosi się do rady, by iść do dentysty. B i C pasują tylko do pierwszej kwestii.', 'Третья реплика отвечает на совет пойти к стоматологу. B и C подходят только к первой реплике.'),
        },
        {
          id: 'zd-sj-4-2',
          lines: [X('Is it serious, doctor?'), gapY, X('Thank goodness! I was so worried.')],
          options: ['I\'m afraid you need an operation.', "No, it's just a cold.", 'We have to do more tests.'],
          correctIndex: 1,
          explanation: say('Ulga w trzeciej kwestii wymaga dobrej wiadomości. A i C nie uspokajają.', 'Облегчение в третьей реплике требует хорошей новости. A и C не успокаивают.'),
        },
        {
          id: 'zd-sj-4-3',
          lines: [X('Shall I call an ambulance?'), gapY, X("All right, but I'll stay with you until you feel better.")],
          options: ['Yes, please hurry!', 'Yes, my leg really hurts.', "No, don't. I just need to rest."],
          correctIndex: 2,
          explanation: say('„All right, but…” to niechętna zgoda na odmowę: X nie dzwoni, ale zostaje. A i B proszą o karetkę.', '«All right, but…» — неохотное согласие с отказом: X не звонит, но остаётся. A и B просят вызвать скорую.'),
        },
      ],
    },
  ],

  'nauka-technika': [
    {
      id: 'nt-sj-1',
      type: 'matching',
      level: 'P',
      functionLabel: 'Pomoc z urządzeniem',
      instruction: MATCH,
      prompts: [
        { id: '1', text: 'My computer keeps freezing.' },
        { id: '2', text: 'Could you show me how to send a photo?' },
        { id: '3', text: "What's the Wi-Fi password?" },
        { id: '4', text: "The printer isn't working." },
        { id: '5', text: "I've lost all my files!" },
      ],
      replies: [
        { id: 'a', text: 'Sure. Just tap this icon and choose the file.' },
        { id: 'b', text: "It's probably out of paper." },
        { id: 'c', text: 'Have you tried restarting it?' },
        { id: 'd', text: "Don't panic. They might be in the cloud." },
        { id: 'e', text: "It's on the back of the router." },
      ],
      answers: { '1': 'c', '2': 'a', '3': 'e', '4': 'b', '5': 'd' },
      explanations: {
        '1': say('„Keep + -ing” to „ciągle coś robić”; rada to ponowne uruchomienie.', '«Keep + -ing» — «постоянно что-то делать»; совет — перезагрузить.'),
        '2': say('Prośba o instrukcję: odpowiedź podaje kroki.', 'Просьба показать: в ответе называем шаги.'),
        '3': say('„It” to hasło zapisane na routerze.', '«It» — пароль, написанный на роутере.'),
        '4': say('„Out of paper” dotyczy tylko drukarki.', '«Out of paper» относится только к принтеру.'),
        '5': say('„They” to pliki; „might” wyraża przypuszczenie.', '«They» — файлы; «might» выражает предположение.'),
      },
    },
    {
      id: 'nt-sj-2',
      type: 'word-bank',
      level: 'P',
      functionLabel: 'Instrukcje i usterki',
      instruction: BANK_EXTRA,
      bank: ['button', 'charge', 'down', 'log', 'plug', 'slowly'],
      items: [
        { sentence: 'First, ___ the cable into the socket.', answer: 'plug', explanation: say('„Plug into” to podłączyć do gniazdka.', '«Plug into» — подключить к розетке.') },
        { sentence: 'Then press the green ___.', answer: 'button', explanation: say('„Press a button” to nacisnąć przycisk.', '«Press a button» — нажать кнопку.') },
        { sentence: "My phone's battery is dead. I need to ___ it.", answer: 'charge', explanation: say('„Charge a phone” to naładować telefon.', '«Charge a phone» — зарядить телефон.') },
        { sentence: 'You have to ___ in with your password.', answer: 'log', explanation: say('„Log in” to zalogować się.', '«Log in» — войти в систему.') },
        { sentence: 'The system has gone ___ again. Nothing works.', answer: 'down', explanation: say('„Go down” mówimy o systemie, który przestał działać.', '«Go down» говорят о системе, которая перестала работать.') },
      ],
    },
    {
      id: 'nt-sj-3',
      type: 'mini-dialogue',
      level: 'P',
      functionLabel: 'Instrukcje i prośby o pomoc',
      instruction: MINI(3),
      items: [
        {
          id: 'nt-sj-3-1',
          lines: [X('How does this coffee machine work?'), gapY],
          options: ['Just put a capsule in and press start.', 'It was made in Italy.', "I don't drink coffee."],
          correctIndex: 0,
          explanation: say('„How does it work?” wymaga instrukcji. B mówi o pochodzeniu, a C o nawykach.', '«How does it work?» требует инструкции. B — о происхождении, C — о привычках.'),
        },
        {
          id: 'nt-sj-3-2',
          lines: [X('Can you help me with my phone? The screen has gone black.'), gapY],
          options: ['Yes, I bought a new one.', 'Let me have a look.', "It's very expensive."],
          correctIndex: 1,
          explanation: say('Reakcja na prośbę o pomoc to „Let me have a look”. A i C nie odpowiadają na prośbę.', 'Реакция на просьбу о помощи — «Let me have a look». A и C на просьбу не отвечают.'),
        },
        {
          id: 'nt-sj-3-3',
          lines: [X("What's this app for?"), gapY],
          options: ["It's free.", 'A friend told me about it.', 'It translates text from photos.'],
          correctIndex: 2,
          explanation: say('„What is it for?” pyta o zastosowanie. A mówi o cenie, a B o źródle informacji.', '«What is it for?» — вопрос о назначении. A — о цене, B — об источнике.'),
        },
      ],
    },
    {
      id: 'nt-sj-4',
      type: 'mini-dialogue',
      level: 'P',
      functionLabel: 'Opisywanie usterki',
      instruction: MINI(3),
      tip: MINI_TIP,
      items: [
        {
          id: 'nt-sj-4-1',
          lines: [X('Have you backed up your files?'), gapY, X('You\'d better do it now, before something goes wrong.')],
          options: ['Not yet.', 'Yes, last night.', "Yes, they're all on a hard drive."],
          correctIndex: 0,
          explanation: say('Rada „do it now” ma sens, jeśli kopii jeszcze nie ma. B i C mówią, że już jest.', 'Совет «do it now» имеет смысл, если копии ещё нет. B и C говорят, что она есть.'),
        },
        {
          id: 'nt-sj-4-2',
          lines: [X("I'm calling about my new tablet. It won't switch on."), gapY, X("Yes, I've charged it for hours and it still doesn't work.")],
          options: ['Thank you for your order.', 'Have you tried charging it?', 'How much did you pay for it?'],
          correctIndex: 1,
          explanation: say('X odpowiada na pytanie o ładowanie. A i C pomijają problem.', 'X отвечает на вопрос о зарядке. A и C обходят проблему.'),
        },
        {
          id: 'nt-sj-4-3',
          lines: [X('Can you fix my laptop?'), gapY, X("OK, I'll take it to a repair shop instead.")],
          options: ['Sure, give it to me.', "Of course. What's wrong with it?", "Sorry, I don't know anything about computers."],
          correctIndex: 2,
          explanation: say('„Instead” oznacza, że Y nie pomoże. A i B to zgoda.', '«Instead» значит, что Y не поможет. A и B — согласие.'),
        },
      ],
    },
  ],

  przyroda: [
    {
      id: 'prz-sj-1',
      type: 'matching',
      level: 'P',
      functionLabel: 'Pogoda, ostrzeżenia, obawy',
      instruction: MATCH,
      prompts: [
        { id: '1', text: "What's the weather like?" },
        { id: '2', text: 'Watch out! That snake is dangerous!' },
        { id: '3', text: "Don't feed the animals, please." },
        { id: '4', text: "I'm worried about climate change." },
        { id: '5', text: 'Why should I recycle?' },
      ],
      replies: [
        { id: 'a', text: 'So am I. We have to do something.' },
        { id: 'b', text: "It's pouring. Take an umbrella." },
        { id: 'c', text: "Sorry, I didn't see the sign." },
        { id: 'd', text: 'Because it saves energy and reduces waste.' },
        { id: 'e', text: "Don't worry, I won't go any closer." },
      ],
      answers: { '1': 'b', '2': 'e', '3': 'c', '4': 'a', '5': 'd' },
      explanations: {
        '1': say('„It’s pouring” to „leje jak z cebra”.', '«It’s pouring» — «льёт как из ведра».'),
        '2': say('Na ostrzeżenie reagujemy obietnicą ostrożności.', 'На предупреждение отвечаем обещанием быть осторожным.'),
        '3': say('Zwrócono nam uwagę, więc przepraszamy i wyjaśniamy.', 'Нам сделали замечание, поэтому извиняемся и объясняем.'),
        '4': say('„So am I” zgadza się z „I’m worried”.', '«So am I» согласуется с «I’m worried».'),
        '5': say('Pytanie „Why…?” wymaga argumentu.', 'Вопрос «Why…?» требует аргумента.'),
      },
    },
    {
      id: 'prz-sj-2',
      type: 'word-bank',
      level: 'P',
      functionLabel: 'Rozmowa o pogodzie, ostrzeżenia',
      instruction: BANK_EXTRA,
      bank: ['careful', 'clear', 'forecast', 'freezing', 'plenty', 'supposed'],
      items: [
        { sentence: "What's the weather ___ for tomorrow?", answer: 'forecast', explanation: say('„Weather forecast” to prognoza pogody.', '«Weather forecast» — прогноз погоды.') },
        { sentence: 'Be ___! The path is very slippery.', answer: 'careful', explanation: say('„Be careful!” to ostrzeżenie: „Uważaj!”.', '«Be careful!» — предупреждение: «Осторожно!».') },
        { sentence: "It's ___ outside. Put your coat on.", answer: 'freezing', explanation: say('„Freezing” to „lodowato zimno”.', '«Freezing» — «очень холодно».') },
        { sentence: "It's ___ to rain this afternoon.", answer: 'supposed', explanation: say('„Be supposed to” to „podobno ma…”.', '«Be supposed to» — «должно, как говорят…».') },
        { sentence: 'I hope the sky is ___ tonight so we can see the stars.', answer: 'clear', explanation: say('„Clear sky” to bezchmurne niebo.', '«Clear sky» — ясное небо.') },
      ],
    },
    {
      id: 'prz-sj-3',
      type: 'mini-dialogue',
      level: 'P',
      functionLabel: 'Przekonywanie i obawy',
      instruction: MINI(3),
      items: [
        {
          id: 'prz-sj-3-1',
          lines: [X('Why should I stop using plastic bags?'), gapY],
          options: ['Because they stay in the environment for centuries.', 'You can buy them here.', "I've got two."],
          correctIndex: 0,
          explanation: say('Pytanie „Why…?” wymaga argumentu. B i C nim nie są.', 'Вопрос «Why…?» требует аргумента. B и C им не являются.'),
        },
        {
          id: 'prz-sj-3-2',
          lines: [X("I'm afraid of spiders."), gapY],
          options: ['Yes, I did.', "Don't be silly, that one can't hurt you.", 'They have eight legs.'],
          correctIndex: 1,
          explanation: say('Na obawę reagujemy uspokojeniem. W A jest zły operator, bo w zdaniu X jest „am”, a C to tylko fakt.', 'На страх отвечаем успокаивая. В A неверный вспомогательный глагол, в реплике X стоит «am», а C — просто факт.'),
        },
        {
          id: 'prz-sj-3-3',
          lines: [X('Look at those black clouds!'), gapY],
          options: ["Yes, let's sunbathe.", "It's been dry for weeks.", "You're right. We'd better go home before it rains."],
          correctIndex: 2,
          explanation: say('Czarne chmury zapowiadają deszcz. A i B nie pasują do tej sytuacji.', 'Чёрные тучи предвещают дождь. A и B не подходят к ситуации.'),
        },
      ],
    },
    {
      id: 'prz-sj-4',
      type: 'mini-dialogue',
      level: 'P',
      functionLabel: 'Pogoda i zagrożenia',
      instruction: MINI(3),
      tip: MINI_TIP,
      items: [
        {
          id: 'prz-sj-4-1',
          lines: [X('Do you think it\'ll snow this weekend?'), gapY, X('Great! Then we can go skiing.')],
          options: ['Yes, the forecast says it will.', "I doubt it. It's too warm.", "No, it's going to be sunny."],
          correctIndex: 0,
          explanation: say('Radość z nart wymaga śniegu. B i C mówią, że go nie będzie.', 'Радость от лыж требует снега. B и C говорят, что его не будет.'),
        },
        {
          id: 'prz-sj-4-2',
          lines: [X('Have you heard about the floods in the south?'), gapY, X('The river burst its banks and thousands of people had to leave their homes.')],
          options: ["Yes, it's terrible.", 'No, what happened?', 'Yes, I saw it on the news.'],
          correctIndex: 1,
          explanation: say('X opowiada szczegóły, bo Y o nich nie wie. A i C oznaczają, że Y już słyszał.', 'X рассказывает подробности, потому что Y о них не знает. A и C означают, что Y уже слышал.'),
        },
        {
          id: 'prz-sj-4-3',
          lines: [X("Let's walk through the forest."), gapY, X("Don't worry, I've got a map and a torch.")],
          options: ['Good idea. I love walking.', "OK, let's go.", "Isn't it dangerous? It's getting dark."],
          correctIndex: 2,
          explanation: say('„Don’t worry” odpowiada na obawę. A i B to zgoda bez obaw.', '«Don’t worry» отвечает на опасение. A и B — согласие без опасений.'),
        },
      ],
    },
  ],

  'panstwo-spoleczenstwo': [
    {
      id: 'pan-sj-1',
      type: 'matching',
      level: 'P',
      functionLabel: 'Opinie i propozycje',
      instruction: MATCH,
      prompts: [
        { id: '1', text: "What's your opinion on the new law?" },
        { id: '2', text: 'Voting should be compulsory.' },
        { id: '3', text: 'We should do something about homelessness.' },
        { id: '4', text: "Young people aren't interested in politics." },
        { id: '5', text: 'Why do you support the ban?' },
      ],
      replies: [
        { id: 'a', text: "You're right. Why don't we volunteer at the shelter?" },
        { id: 'b', text: 'Because it will make the streets safer.' },
        { id: 'c', text: "As far as I'm concerned, it's unfair." },
        { id: 'd', text: "That's not true. Many of my friends are activists." },
        { id: 'e', text: 'I see your point, but people should be free to choose.' },
      ],
      answers: { '1': 'c', '2': 'e', '3': 'a', '4': 'd', '5': 'b' },
      explanations: {
        '1': say('„As far as I’m concerned” to „jeśli o mnie chodzi”.', '«As far as I’m concerned» — «что касается меня».'),
        '2': say('„I see your point, but…” to uprzejmy brak zgody.', '«I see your point, but…» — вежливое несогласие.'),
        '3': say('„Why don’t we…?” to konkretna propozycja działania.', '«Why don’t we…?» — конкретное предложение.'),
        '4': say('Przykład z życia podważa uogólnienie.', 'Пример из жизни опровергает обобщение.'),
        '5': say('„Why…?” wymaga argumentu z „because”.', '«Why…?» требует аргумента с «because».'),
      },
    },
    {
      id: 'pan-sj-2',
      type: 'word-bank',
      level: 'P',
      functionLabel: 'Wyrażanie opinii',
      instruction: BANK_EXTRA,
      bank: ['concerned', 'disagree', 'never', 'opinion', 'point', 'suggest'],
      items: [
        { sentence: 'In my ___, taxes are too high.', answer: 'opinion', explanation: say('„In my opinion” wprowadza opinię.', '«In my opinion» вводит мнение.') },
        { sentence: "I'm afraid I ___ with you on that.", answer: 'disagree', explanation: say('„I’m afraid I disagree” to uprzejmy brak zgody.', '«I’m afraid I disagree» — вежливое несогласие.') },
        { sentence: "As far as I'm ___, the government should act now.", answer: 'concerned', explanation: say('Stałe wyrażenie: „as far as I’m concerned”.', 'Устойчивое выражение: «as far as I’m concerned».') },
        { sentence: 'I ___ we organise a petition.', answer: 'suggest', explanation: say('„I suggest (that) we…” to propozycja.', '«I suggest (that) we…» — предложение.') },
        { sentence: "That's a good ___, but it's not the whole story.", answer: 'point', explanation: say('„That’s a good point” to uznanie cudzego argumentu.', '«That’s a good point» — признание чужого аргумента.') },
      ],
    },
    {
      id: 'pan-sj-3',
      type: 'mini-dialogue',
      level: 'P',
      functionLabel: 'Uprzejme niezgadzanie się i propozycje',
      instruction: MINI(3),
      items: [
        {
          id: 'pan-sj-3-1',
          lines: [X('Do you think the town needs more cycle lanes?'), gapY],
          options: ['Definitely. It would reduce traffic.', 'I cycled there yesterday.', "It's next to the town hall."],
          correctIndex: 0,
          explanation: say('X pyta o opinię, więc odpowiadamy opinią z uzasadnieniem. B i C nie są opiniami.', 'X спрашивает мнение, поэтому отвечаем мнением с обоснованием. B и C — не мнения.'),
        },
        {
          id: 'pan-sj-3-2',
          lines: [X('I think we should ban cars from the city centre.'), gapY],
          options: ['Yes, there are many cars.', "I'm not sure that's a good idea. What about the shop owners?", "Thanks, I'd love one."],
          correctIndex: 1,
          explanation: say('B to uprzejmy brak zgody z argumentem. A tylko stwierdza fakt, a C reaguje na propozycję poczęstunku.', 'B — вежливое несогласие с аргументом. A только констатирует факт, а C — ответ на угощение.'),
        },
        {
          id: 'pan-sj-3-3',
          lines: [X('What can we do to help the refugees?'), gapY],
          options: ['They came last month.', 'Yes, we can.', 'How about collecting clothes and food?'],
          correctIndex: 2,
          explanation: say('„What can we do?” wymaga propozycji. „How about + -ing” ją wyraża, a A i B nie.', '«What can we do?» требует предложения. Его выражает «How about + -ing», а A и B — нет.'),
        },
      ],
    },
    {
      id: 'pan-sj-4',
      type: 'mini-dialogue',
      level: 'P',
      functionLabel: 'Argumentowanie',
      instruction: MINI(3),
      tip: MINI_TIP,
      items: [
        {
          id: 'pan-sj-4-1',
          lines: [X('Are you going to vote in the elections?'), gapY, X("But if you don't vote, you can't complain!")],
          options: ["No, I don't think it makes any difference.", 'Yes, of course.', "Yes, I've already decided who for."],
          correctIndex: 0,
          explanation: say('„But if you don’t vote…” odpowiada na niechęć do głosowania. B i C oznaczają udział w wyborach.', '«But if you don’t vote…» отвечает на нежелание голосовать. B и C означают участие в выборах.'),
        },
        {
          id: 'pan-sj-4-2',
          lines: [X('I think the police should have more power.'), gapY, X("Maybe, but the streets aren't safe at night.")],
          options: ["I couldn't agree more.", "I disagree. They've got enough power already.", "You're absolutely right."],
          correctIndex: 1,
          explanation: say('„Maybe, but…” to odpowiedź na sprzeciw. A i C to pełna zgoda.', '«Maybe, but…» — ответ на возражение. A и C — полное согласие.'),
        },
        {
          id: 'pan-sj-4-3',
          lines: [X("Why don't we write to the mayor about the park?"), gapY, X("Fine, I'll start a draft tonight.")],
          options: ["It won't do any good.", "I don't think he'll read it.", 'Good idea. We can ask our neighbours to sign it, too.'],
          correctIndex: 2,
          explanation: say('X zabiera się do pisania, więc Y się zgodził. A i B odrzucają pomysł.', 'X берётся писать, значит, Y согласился. A и B отвергают идею.'),
        },
      ],
    },
  ],
};

/** Everything wrong with the data, in words; empty when it is fine. */
export const validateLanguageUseExercises = (byModule: Record<string, LanguageUseExercise[]> = languageUseExercisesByModule): string[] => {
  const problems: string[] = [];
  const seen = new Set<string>();

  for (const [moduleId, exercises] of Object.entries(byModule)) {
    for (const type of ['matching', 'word-bank', 'mini-dialogue']) {
      if (!exercises.some((e) => e.type === type)) problems.push(`${moduleId}: no ${type} exercise`);
    }
    for (const ex of exercises) {
      const report = (problem: string) => problems.push(`${ex.id}: ${problem}`);
      if (seen.has(ex.id)) report('duplicate id');
      seen.add(ex.id);

      if (ex.type === 'matching') {
        if (ex.replies.length !== ex.prompts.length) report('replies and prompts differ in number');
        const replyIds = ex.replies.map((r) => r.id);
        const used = ex.prompts.map((p) => ex.answers[p.id]);
        for (const p of ex.prompts) if (!replyIds.includes(ex.answers[p.id])) report(`prompt ${p.id} has no existing reply`);
        if (new Set(used).size !== used.length) report('a reply is used twice');
        if (used.every((reply, i) => reply === replyIds[i])) report('replies are in the order of the prompts');
      } else if (ex.type === 'word-bank') {
        const bank = ex.bank.map(normalise);
        if (new Set(bank).size !== bank.length) report('a word stands twice in the frame');
        if (ex.bank.length > ex.items.length + 1) report('more than one extra word in the frame');
        const keys = ex.items.map((item) => normalise(item.answer));
        if (new Set(keys).size !== keys.length) report('a word is the answer twice');
        for (const item of ex.items) {
          if (item.sentence.split('___').length !== 2) report(`not exactly one gap: "${item.sentence}"`);
          if (!bank.includes(normalise(item.answer))) report(`answer "${item.answer}" is not in the frame`);
        }
      } else {
        for (const item of ex.items) {
          if (item.lines.filter((l) => l.text === null).length !== 1) report(`${item.id}: not exactly one gap`);
          if (item.options.length !== 3) report(`${item.id}: not three options`);
          if (new Set(item.options).size !== item.options.length) report(`${item.id}: options repeat`);
          if (!Number.isInteger(item.correctIndex) || item.correctIndex < 0 || item.correctIndex >= item.options.length) report(`${item.id}: correctIndex out of range`);
        }
      }
    }
  }
  return problems;
};
