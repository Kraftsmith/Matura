import type { MaturaModule } from '../types';
import { module1Czlowiek } from './modules/module1_czlowiek';

export const allModules: MaturaModule[] = [
  module1Czlowiek,
  {
    id: 'miejsce-zamieszkania',
    number: 2,
    titlePl: 'Miejsce zamieszkania',
    titleEn: 'Home & Living Environment',
    shortDescription: 'Dom i jego okolica, rodzaje domów i mieszkań, wyposażenie wnętrz, wynajem, prace domowe.',
    iconName: 'Home',
    badge: 'B1+',
    subtopics: [
      'Rodzaje budynków mieszkalnych',
      'Pokoje i wyposażenie wnętrz',
      'Lokalizacja i sąsiedztwo (urban, suburban, rural)',
      'Wynajem, kupno i koszty utrzymania',
      'Prace i obowiązki domowe'
    ],
    grammarSummary: 'There is / There are, Relative Clauses (who, which, where, whose), Passive Voice w opisie wnętrz i renowacji.',
    flashcards: [
      {
        id: 'dom-1',
        front: 'spacious',
        phonetic: '/ˈspeɪ.ʃəs/',
        partOfSpeech: 'adjective',
        backMeaningPl: 'przestronny, pojemny', backMeaningRu: 'просторный, вместительный',
        backMeaningEn: 'large and with a lot of space for people or things',
        exampleSentence: 'The modern apartment has a spacious living room overlooking the park.',
        category: 'Wyposażenie i opis'
      },
      {
        id: 'dom-2',
        front: 'cramped',
        phonetic: '/kræmpt/',
        partOfSpeech: 'adjective',
        backMeaningPl: 'ciasny, stłoczony', backMeaningRu: 'тесный, набитый',
        backMeaningEn: 'not having enough space or room for movement',
        exampleSentence: 'They lived in a cramped studio flat before buying a house.',
        category: 'Wyposażenie i opis'
      },
      {
        id: 'dom-3',
        front: 'semi-detached house',
        phonetic: '/ˌsem.i.dɪˈtætʃt haʊs/',
        partOfSpeech: 'noun',
        backMeaningPl: 'bliźniak (dom połączony jedną ścianą)', backMeaningRu: 'дом на две семьи (с общей стеной)',
        backMeaningEn: 'a house that is joined to another house on one side only',
        exampleSentence: 'They recently purchased a charming semi-detached house in the suburbs.',
        category: 'Rodzaje domów'
      },
      {
        id: 'dom-4',
        front: 'landlord',
        phonetic: '/ˈlænd.lɔːd/',
        partOfSpeech: 'noun',
        backMeaningPl: 'właściciel mieszkania / wynajmujący', backMeaningRu: 'владелец квартиры / арендодатель',
        backMeaningEn: 'a person who owns a building and rents it to tenants',
        exampleSentence: 'The landlord agreed to replace the broken refrigerator immediately.',
        category: 'Wynajem i kupno'
      },
      {
        id: 'dom-5',
        front: 'convert into',
        phonetic: '/kənˈvɜːt ˈɪn.tuː/',
        partOfSpeech: 'phrasal_verb',
        backMeaningPl: 'przekształcić w (np. strych na sypialnię)', backMeaningRu: 'переоборудовать в (напр. чердак в спальню)',
        backMeaningEn: 'to change something so that it can have a different use',
        exampleSentence: 'We plan to convert the dusty attic into a cozy guest bedroom.',
        category: 'Remont'
      }
    ],
    pictureDescription: {
      imageSrc: '/images/matura_12_home.jpg',
      imageAlt: 'Bright modern open-plan living room with a dining area',
      title: 'Nowoczesne wnętrze i życie domowe (Modern Home & Living Room)',
      situation: 'Mieszkańcy spędzają czas w przestronnym, zmodernizowanym salonie połączonym z jadalnią.',
      steps: [
        {
          stepName: 'Introduction',
          stepNamePl: 'Wprowadzenie', stepNameRu: 'Вступление',
          description: 'Określenie typu pomieszczenia i ogólnego wystroju.',
          recommendedPhrases: ['In the photograph, I can see a bright, well-furnished living room...'],
          modelExample: 'In the photograph, I can see a spacious modern living room decorated with stylish wooden furniture, bookshelves and houseplants.'
        },
        {
          stepName: 'Where & Details',
          stepNamePl: 'Miejsce i szczegóły wyposażenia', stepNameRu: 'Место и детали обстановки',
          description: 'Wskazanie elementów wyposażenia wnętrza i aranżacji.',
          recommendedPhrases: ['In the foreground, there is a large wooden dining table...'],
          modelExample: 'In the foreground, there is a large wooden dining table being laid for a meal, while a grey sofa, tall bookshelves and floor-to-ceiling windows can be seen in the background.'
        },
        {
          stepName: 'Atmosphere',
          stepNamePl: 'Klimat i wygoda', stepNameRu: 'Атмосфера и уют',
          description: 'Opis atmosfery panującej we wnętrzu (przytulne, funkcjonalne).',
          recommendedPhrases: ['The space looks exceptionally cozy, welcoming, and tidy...'],
          modelExample: 'The atmosphere looks very cozy and homey, striking a balance between modern aesthetics and practical convenience.'
        }
      ],
      examQuestions: [
        {
          questionNumber: 1,
          questionText: 'Would you prefer to live in a modern apartment in a city center or a detached house in the countryside? Why?',
          questionTextPl: 'Czy wolał(a)byś mieszkać w nowoczesnym apartamencie w centrum miasta, czy w domu jednorodzinnym na wsi? Dlaczego?', questionTextRu: 'Ты предпочёл(ла) бы жить в современной квартире в центре города или в частном доме за городом? Почему?',
          hints: ['Commuting and infrastructure vs quietness and fresh air', 'Maintenance and costs'],
          usefulPhrases: ['I would personally lean towards...', 'While city centers offer vibrant life...'],
          modelAnswer: 'I would definitely prefer living in a city center apartment. Having schools, shops, and public transport within walking distance saves countless hours each week, even if city apartments are somewhat smaller.'
        },
        {
          questionNumber: 2,
          questionText: 'Tell me about a renovation or furniture redecoration you or your family carried out.',
          questionTextPl: 'Opowiedz o remoncie lub przemeblowaniu, które przeprowadzałeś/aś wraz z rodziną.', questionTextRu: 'Расскажи о ремонте или перестановке, которые вы делали вместе с семьёй.',
          hints: ['What room was changed', 'Painting walls, assembling furniture', 'Final result'],
          usefulPhrases: ['Last year, we decided to give my room a makeover...', 'It was exhausting but deeply rewarding...'],
          modelAnswer: 'Last spring, my parents and I decided to renovate our living room. We spent a whole weekend repainting the walls light grey and assembling a new bookcase. Although it was tiring, the room now feels much brighter and more spacious.'
        },
        {
          questionNumber: 3,
          questionText: 'Why do so many young adults choose to share a flat with roommates instead of renting alone?',
          questionTextPl: 'Dlaczego tak wielu młodych dorosłych decyduje się na wynajem mieszkania ze współlokatorami?', questionTextRu: 'Почему так много молодых людей решают снимать жильё с соседями?',
          hints: ['Financial burden of sky-high rents and utilities', 'Loneliness vs social companionship'],
          usefulPhrases: ['The primary driver is undeniably financial...', 'Splitting utility bills relieves pressure...'],
          modelAnswer: 'The primary reason is undoubtedly financial. Sharing a flat allows young people to split steep monthly rents, internet bills, and utilities. In addition, living with peers prevents loneliness when moving away from home.'
        }
      ],
      fullModelAnswer: 'The photograph presents a spacious and beautifully designed open-plan living room. In the foreground, a young woman is laying a solid timber dining table, while a young man is watering the plants by the window. The natural light, wooden floor and bookshelves create an inviting and comfortable living space. Personally, I would love to live in a flat like this because it feels like the beating heart of a home.'
    },
    testQuestions: [
      {
        id: 'dom-t1',
        type: 'word-formation',
        prompt: 'Uzupełnij lukę poprawną formą wyrazu w nawiasie:',
        sentencePrefix: 'The hotel provides comfortable ',
        sentenceSuffix: ' for over three hundred guests. (ACCOMMODATE)',
        targetWord: 'ACCOMMODATE',
        correctAnswers: ['accommodation'],
        explanation: 'Od czasownika "accommodate" tworzymy rzeczownik niepoliczalny "accommodation" (zakwaterowanie).',
        level: 'Podstawowy'
      },
      {
        id: 'dom-t2',
        type: 'key-word-transformation',
        prompt: 'Przekształć zdanie z użyciem słowa kluczowego (2 do 5 słów):',
        sentencePrefix: 'They are redecorating the old cottage right now. (BEING)\nThe old cottage ',
        sentenceSuffix: ' right now.',
        targetWord: 'BEING',
        correctAnswers: ['is being redecorated'],
        explanation: 'Czas Present Continuous w stronie biernej: is/are being + 3. forma (is being redecorated).',
        level: 'Rozszerzony'
      },
      {
        id: 'dom-t3',
        type: 'multiple-choice',
        prompt: 'Wybierz poprawny zaimek względny:',
        sentencePrefix: 'This is the peaceful suburban neighbourhood ',
        sentenceSuffix: ' my grandparents spent their retirement.',
        options: ['where', 'which', 'that', 'whose'],
        correctAnswers: ['where'],
        explanation: 'Określamy miejsce, w którym ktoś spędził czas -> zaimek "where".',
        level: 'Podstawowy'
      }
    ],
    grammarRules: [
      {
        id: 'dom-g1',
        title: 'Zdania przydawkowe (Relative Clauses): defining vs non-defining',
        level: 'P/R',
        formula: 'who (ludzie), which/that (rzeczy), where (miejsca), whose (przynależność)',
        ruleSummary: 'W zdaniach definiujących (bez przecinków) "that" może zastąpić "which" i "who". W zdaniach niedefiniujących (z przecinkami) NIE WOLNO używać "that".',
        examples: [
          {
            english: 'The house that we rented last summer was very close to the beach.',
            polish: 'Dom, który wynajęliśmy zeszłego lata, był bardzo blisko plaży.', russian: 'Дом, который мы снимали прошлым летом, был совсем рядом с пляжем.'
          }
        ]
      }
    ],
    vocabularyList: [
      { id: 'dv-1', english: 'tenant', polish: 'lokator, najemca', russian: 'жилец, арендатор', category: 'Wynajem', level: 'P', example: 'The tenant pays rent on the first day of every month.' },
      { id: 'dv-2', english: 'utility bills', polish: 'opłaty za media (prąd, woda, gaz)', russian: 'коммунальные платежи (электричество, вода, газ)', category: 'Utrzymanie domu', level: 'P', example: 'Heating bills can be high in winter.' }
    ],
    writingPrompt: {
      type: 'Wpis na blogu',
      level: 'Podstawowy',
      title: 'Przeprowadzka do nowego mieszkania (Moving into a new flat)',
      taskPrompt: 'Niedawno przeprowadziłeś/aś się z rodziną do nowego mieszkania. Napisz wpis na swoim blogu (80-130 słów), w którym opiszesz nową okolicę, przedstawisz swój nowy pokój i zaprosisz znajomych na parapetówkę.',
      wordLimit: { min: 80, max: 130 },
      bulletPoints: ['Opis nowego mieszkania i okolicy', 'Opis Twojego pokoju', 'Zaproszenie na housewarming party'],
      usefulPhrases: ['Guess what! We have just moved...', 'My new room is very cozy...', 'I would love to invite you all...'],
      samplePlan: ['Wstęp o przeprowadzce', 'Opis okolicy i pokoju', 'Zaproszenie'],
      modelAnswer: 'Hi everyone! Guess what? We have just moved to a wonderful apartment in a leafy suburb! My new bedroom is spacious and bright, with a large desk overlooking the garden. I am hosting a housewarming party next Saturday at 6 p.m. Let me know if you can make it!'
    }
  },
  {
    id: 'edukacja',
    number: 3,
    titlePl: 'Edukacja',
    titleEn: 'Education & School Life',
    shortDescription: 'Szkoła, przedmioty, uczenie się, egzaminy, życie studenckie i relacje szkolne.',
    iconName: 'GraduationCap',
    badge: 'B1+',
    subtopics: ['System oświaty i przedmioty', 'Życie szkoły i zajęcia pozalekcyjne', 'Egzaminy i ocenianie', 'Uczenie się i technologie w edukacji'],
    grammarSummary: 'Czasowniki modalne zasad i zakazów (must, have to, shouldn\'t), Modals in the past (should have, needn\'t have), bezokolicznik i gerund.',
    flashcards: [
      {
        id: 'edu-1',
        front: 'curriculum',
        phonetic: '/kəˈrɪk.jə.ləm/',
        partOfSpeech: 'noun',
        backMeaningPl: 'program nauczania', backMeaningRu: 'учебная программа',
        backMeaningEn: 'the subjects comprising a course of study in a school or college',
        exampleSentence: 'The modern school curriculum should include financial literacy.',
        category: 'System edukacji'
      },
      {
        id: 'edu-2',
        front: 'pass with flying colours',
        phonetic: '/pɑːs wɪð ˈflaɪ.ɪŋ ˈkʌl.əz/',
        partOfSpeech: 'idiom',
        backMeaningPl: 'zdać śpiewająco / z wyróżnieniem', backMeaningRu: 'сдать блестяще / с отличием',
        backMeaningEn: 'to pass an exam with a very high mark or score',
        exampleSentence: 'With her diligent revision, she passed her Matura with flying colours.',
        category: 'Egzaminy'
      },
      {
        id: 'edu-3',
        front: 'fall behind',
        phonetic: '/fɔːl bɪˈhaɪnd/',
        partOfSpeech: 'phrasal_verb',
        backMeaningPl: 'mieć zaległości, zostawać w tyle', backMeaningRu: 'отставать, накапливать долги по учёбе',
        backMeaningEn: 'fail to keep up with work, studies, or deadlines',
        exampleSentence: 'After missing two weeks of classes due to illness, he fell behind in physics.',
        category: 'Nauka'
      }
    ],
    pictureDescription: {
      imageSrc: '/images/matura_01_education.jpg',
      imageAlt: 'Students studying together around a wooden table in library',
      title: 'Wspólna nauka w bibliotece (Collaborative Study in Library)',
      situation: 'Grupa licealistów przygotowuje się wspólnie do egzaminu wokół stołu w nowoczesnej bibliotece.',
      steps: [
        {
          stepName: 'Introduction',
          stepNamePl: 'Wprowadzenie', stepNameRu: 'Вступление',
          description: 'Określenie grupy uczniów i miejsca nauki.',
          recommendedPhrases: ['In this picture, I can see a group of students studying together...'],
          modelExample: 'In this picture, I can see several teenage students sitting together at a wooden table in what appears to be a library.'
        },
        {
          stepName: 'Action & Atmosphere',
          stepNamePl: 'Czynności i nastrój', stepNameRu: 'Действия и настроение',
          description: 'Uczniowie dyskutują, robią notatki, pracują z laptopem i podręcznikami.',
          recommendedPhrases: ['They are concentrating on an academic assignment...'],
          modelExample: 'They are discussing an assignment, taking notes in notebooks, and looking at a laptop screen. The atmosphere seems very focused and collaborative.'
        }
      ],
      examQuestions: [
        {
          questionNumber: 1,
          questionText: 'Why do you think the students decided to study together rather than on their own?',
          questionTextPl: 'Dlaczego Twoim zdaniem uczniowie postanowili uczyć się razem, a nie samodzielnie?', questionTextRu: 'Почему, по-твоему, ученики решили заниматься вместе, а не поодиночке?',
          hints: ['Sharing notes and explaining tricky questions', 'Motivation and social support'],
          usefulPhrases: ['Studying in a group fosters brainstorming...', 'They can clarify doubts instantly...'],
          modelAnswer: 'Studying in a group allows students to explain confusing topics to one another and keep each other accountable and motivated.'
        },
        {
          questionNumber: 2,
          questionText: 'Tell me about a school project or presentation you worked on.',
          questionTextPl: 'Opowiedz o projekcie lub prezentacji szkolnej, którą realizowałeś/aś.', questionTextRu: 'Расскажи о школьном проекте или презентации, которые ты делал(а).',
          hints: ['Subject', 'Teamwork', 'Result'],
          usefulPhrases: ['Last semester, we were assigned a project on...', 'We divided the workload...'],
          modelAnswer: 'Last semester, my classmates and I designed a presentation on renewable energy. We divided the research, created slides, and received the highest grade in class.'
        },
        {
          questionNumber: 3,
          questionText: 'Do you believe digital textbooks will ever completely replace paper books in schools?',
          questionTextPl: 'Czy wierzysz, że cyfrowe podręczniki całkowicie zastąpią książki papierowe w szkołach?', questionTextRu: 'Веришь ли ты, что цифровые учебники полностью заменят бумажные книги в школах?',
          hints: ['Portability and updates vs screen fatigue and concentration'],
          usefulPhrases: ['While digital materials offer interactive features...', 'Physical books minimize screen distractions...'],
          modelAnswer: 'I believe paper books will continue to coexist with digital tools. Paper books reduce eye strain and help students focus without notification distractions.'
        }
      ],
      fullModelAnswer: 'In the picture, I can see a group of young students sitting together at a wooden table in a modern study room. They are discussing an assignment, taking notes, and sharing ideas. Everyone looks involved and concentrated on teamwork. The atmosphere is very productive and supportive.'
    },
    testQuestions: [
      {
        id: 'edu-t1',
        type: 'key-word-transformation',
        prompt: 'Przekształć zdanie z użyciem słowa kluczowego (2 do 5 słów):',
        sentencePrefix: 'It was a mistake for you to stay up late before the exam. (SHOULD)\nYou ',
        sentenceSuffix: ' up late before the exam.',
        targetWord: 'SHOULD',
        correctAnswers: ['should not have stayed', "shouldn't have stayed"],
        explanation: 'Modal w przeszłości do wyrażenia ubolewania lub krytyki: should not have + 3. forma (should not have stayed).',
        level: 'Rozszerzony'
      }
    ],
    grammarRules: [
      {
        id: 'edu-g1',
        title: 'Czasowniki modalne w przeszłości (Modals in the Past)',
        level: 'R',
        formula: 'should have + V3 (należało było) | needn\'t have + V3 (niepotrzebnie zrobiono)',
        ruleSummary: 'Służą do oceniania zdarzeń przeszłych, krytyki lub domysłów.',
        examples: [
          { english: 'She needn\'t have revised the whole chapter; it wasn\'t in the test.', polish: 'Niepotrzebnie powtarzała cały rozdział; nie było go w teście.', russian: 'Ей не нужно было повторять всю главу; её не было в тесте.' }
        ]
      }
    ],
    vocabularyList: [
      { id: 'ev-1', english: 'tuition fees', polish: 'czesne za studia', russian: 'плата за обучение', category: 'Edukacja wyższa', level: 'P', example: 'Many students work part-time to cover their tuition fees.' }
    ],
    writingPrompt: {
      type: 'Artykuł',
      level: 'Rozszerzony',
      title: 'Edukacja zdalna a tradycyjna: przyszłość szkoły',
      taskPrompt: 'Napisz artykuł do czasopisma młodzieżowego, w którym omówisz wpływ technologii na współczesne metody nauczania oraz przedstawisz wizję szkoły za 20 lat.',
      wordLimit: { min: 200, max: 250 },
      bulletPoints: ['Wpływ AI i internetu na naukę', 'Rola nauczyciela w cyfrowym świecie', 'Wizja szkoły przyszłości'],
      usefulPhrases: ['There is no denying that technology has revolutionized...', 'Looking ahead to the next decade...'],
      samplePlan: ['Wstęp z tezą', 'Zalety i wyzwania technologii', 'Przyszłość szkolnictwa'],
      modelAnswer: 'Education is experiencing unprecedented transformations powered by digital platforms and AI tools. Classrooms around the world are evolving into dynamic, interactive spaces where students access global knowledge repositories at the touch of a screen.'
    }
  },
  {
    id: 'praca',
    number: 4,
    titlePl: 'Praca',
    titleEn: 'Work & Employment',
    shortDescription: 'Zawody, warunki pracy, rynek zatrudnienia, rozmowa kwalifikacyjna i praca zdalna.',
    iconName: 'Briefcase',
    badge: 'B2',
    subtopics: ['Zawody i obowiązki zawodowe', 'Warunki pracy i wynagrodzenie', 'Poszukiwanie pracy i CV', 'Praca zdalna i workation'],
    grammarSummary: 'Mowa zależna (Reported Speech: reporting verbs), konstrukcje kauzatywne (have/get something done).',
    flashcards: [
      {
        id: 'praca-1',
        front: 'demanding',
        phonetic: '/dɪˈmɑːn.dɪŋ/',
        partOfSpeech: 'adjective',
        backMeaningPl: 'wymagający, trudny', backMeaningRu: 'требовательный, трудный',
        backMeaningEn: 'needing a lot of time, ability, and effort',
        exampleSentence: 'Being a surgeon is a highly demanding career with irregular hours.',
        category: 'Warunki pracy'
      },
      {
        id: 'praca-2',
        front: 'meet deadlines',
        phonetic: '/miːt ˈded.laɪnz/',
        partOfSpeech: 'idiom',
        backMeaningPl: 'dotrzymywać terminów', backMeaningRu: 'соблюдать сроки',
        backMeaningEn: 'to complete tasks or projects before the required date',
        exampleSentence: 'Project managers must ensure their teams meet strict deadlines.',
        category: 'Obowiązki'
      }
    ],
    pictureDescription: {
      imageSrc: '/images/matura_02_work.jpg',
      imageAlt: 'Young professionals working on laptops in a wooden chalet',
      title: 'Praca zdalna w zespole (Remote Teamwork / Workation)',
      situation: 'Zespół młodych programistów i analityków pracuje wspólnie na laptopach w drewnianym domku podczas wyjazdu typu workation.',
      steps: [
        {
          stepName: 'Introduction',
          stepNamePl: 'Wprowadzenie', stepNameRu: 'Вступление',
          description: 'Opis grupy młodych pracowników w swobodnym otoczeniu.',
          recommendedPhrases: ['The photograph depicts a team of professionals working on laptops...'],
          modelExample: 'The photograph shows several young people working together on laptops in an informal rustic wooden setting.'
        }
      ],
      examQuestions: [
        {
          questionNumber: 1,
          questionText: 'Why do you think these professionals are wearing hoodies and casual clothes instead of formal suits?',
          questionTextPl: 'Dlaczego Twoim zdaniem ci specjaliści noszą bluzy i swobodne ubrania zamiast garniturów?', questionTextRu: 'Почему, по-твоему, эти специалисты носят толстовки и повседневную одежду вместо костюмов?',
          hints: ['Modern IT culture', 'Comfort boosts creativity'],
          usefulPhrases: ['Modern creative companies prioritize comfort...'],
          modelAnswer: 'Tech and creative companies prioritize comfort and mental ease because relaxed clothing minimizes unnecessary formality and stimulates innovation.'
        },
        {
          questionNumber: 2,
          questionText: 'Tell me about a summer job or work experience you or your friend undertook.',
          questionTextPl: 'Opowiedz o pracy wakacyjnej lub praktykach, które podjąłeś/aś Ty lub Twój znajomy.', questionTextRu: 'Расскажи о летней подработке или стажировке, которую проходил(а) ты или твой знакомый.',
          hints: ['Role (barista, tutor, courier)', 'Gained skills', 'Earnings'],
          usefulPhrases: ['Last summer, I worked as a barista...', 'It helped me develop communication skills...'],
          modelAnswer: 'Last summer, I worked at a local bookstore. Assisting customers and managing stock taught me customer service skills and financial responsibility.'
        },
        {
          questionNumber: 3,
          questionText: 'What are the main pros and cons of remote work compared to traditional office environments?',
          questionTextPl: 'Jakie są główne zalety i wady pracy zdalnej w porównaniu z biurową?', questionTextRu: 'Каковы главные плюсы и минусы удалённой работы по сравнению с офисной?',
          hints: ['Zero commute vs blurred work-life balance and isolation'],
          usefulPhrases: ['On the plus side, remote work eliminates tedious commutes...'],
          modelAnswer: 'Remote work saves time and money on commuting, yet it can also lead to social isolation and difficulties separating work hours from personal life.'
        }
      ],
      fullModelAnswer: 'In this photograph, we see young remote workers gathered around a wooden table with their laptops open. The atmosphere is relaxed yet highly focused, representing the flexibility of modern agile workspaces.'
    },
    testQuestions: [
      {
        id: 'praca-t1',
        type: 'key-word-transformation',
        prompt: 'Przekształć zdanie z użyciem słowa kluczowego (2 do 5 słów):',
        sentencePrefix: 'The director said: "You must submit your report by Friday." (INSISTED)\nThe director ',
        sentenceSuffix: ' by Friday.',
        targetWord: 'INSISTED',
        correctAnswers: ['insisted on submitting the report', 'insisted on our submitting the report', 'insisted that we submit the report'],
        explanation: 'Konstrukcja: insist on + gerund (-ing) lub insist that + podmiot + bezokolicznik.',
        level: 'Rozszerzony'
      }
    ],
    grammarRules: [
      {
        id: 'praca-g1',
        title: 'Mowa zależna: czasowniki zaawansowane (Reporting Verbs)',
        level: 'R',
        formula: 'verb + that... | verb + sb + to inf | verb + preposition + -ing',
        ruleSummary: 'Zastąp standardowe "said that" precyzyjnymi czasownikami: recommend, insist, persuade, apologize for.',
        examples: [
          { english: 'He admitted making a grave calculation error.', polish: 'Przyznał się do popełnienia poważnego błędu w obliczeniach.', russian: 'Он признался, что допустил серьёзную ошибку в расчётах.' }
        ]
      }
    ],
    vocabularyList: [
      { id: 'pv-1', english: 'climb the career ladder', polish: 'piąć się po szczeblach kariery', russian: 'подниматься по карьерной лестнице', category: 'Kariera', level: 'R', example: 'Hard work helped her climb the career ladder rapidly.' }
    ],
    writingPrompt: {
      type: 'Rozprawka',
      level: 'Rozszerzony',
      title: 'Praca zdalna: szansa czy zagrożenie dla relacji pracowniczych?',
      taskPrompt: 'Coraz więcej firm decyduje się na stałą pracę zdalną. Napisz rozprawkę, w której przedstawisz zalety i wady tego modelu zatrudnienia.',
      wordLimit: { min: 200, max: 250 },
      bulletPoints: ['Zalety: elastyczność i brak dojazdów', 'Wady: alienacja i brak pracy zespołowej', 'Własne podsumowanie'],
      usefulPhrases: ['On the one hand, telecommuting offers unparalleled freedom...', 'Conversely, interpersonal camaraderie often suffers...'],
      samplePlan: ['Wstęp', 'Argumenty za', 'Argumenty przeciw', 'Konkluzja'],
      modelAnswer: 'The rise of remote work has profoundly transformed the global employment landscape, offering both compelling advantages and tangible dilemmas for modern professionals.'
    }
  },
  {
    id: 'zycie-prywatne',
    number: 5,
    titlePl: 'Życie prywatne',
    titleEn: 'Private Life & Relationships',
    shortDescription: 'Rodzina, przyjaciele, święta, konflikty pokoleniowe i codzienne rytuały.',
    iconName: 'Heart',
    badge: 'B1+',
    subtopics: ['Struktura rodziny i krewni', 'Przyjaźń i związki', 'Uroczystości i święta rodzinne', 'Czas wolny w gronie bliskich'],
    grammarSummary: 'Past Simple vs Past Continuous vs Past Perfect, czasowniki wyrażające nawyki w przeszłości.',
    flashcards: [
      {
        id: 'zp-1',
        front: 'get on well with',
        phonetic: '/ɡet ɒn wel wɪð/',
        partOfSpeech: 'phrasal_verb',
        backMeaningPl: 'mieć dobre relacje z kimś', backMeaningRu: 'иметь хорошие отношения с кем-либо',
        backMeaningEn: 'to have a friendly relationship with someone',
        exampleSentence: 'I get on exceptionally well with my cousins despite our age gap.',
        category: 'Relacje'
      }
    ],
    pictureDescription: {
      imageSrc: '/images/matura_04_family.jpg',
      imageAlt: 'Family cooking dinner together',
      title: 'Rodzinne przygotowywanie obiadu (Family Cooking)',
      situation: 'Wspólny obiad w gronie najbliższych tworzący ciepłe więzi rodzinne.',
      steps: [
        {
          stepName: 'Introduction',
          stepNamePl: 'Wstęp', stepNameRu: 'Вступление',
          description: 'Ciepłe przedstawienie sceny rodzinnej.',
          recommendedPhrases: ['This heartwarming photo shows family members cooking together...'],
          modelExample: 'This heartwarming photo shows family members preparing food together in their kitchen.'
        }
      ],
      examQuestions: [
        {
          questionNumber: 1,
          questionText: 'Why is spending quality time together essential for maintaining strong family bonds?',
          questionTextPl: 'Dlaczego spędzanie wartościowego czasu razem jest kluczowe dla silnych więzi rodzinnych?', questionTextRu: 'Почему совместно проведённое качественное время так важно для крепких семейных связей?',
          hints: ['Communication', 'Emotional security'],
          usefulPhrases: ['Sharing daily moments builds mutual trust...'],
          modelAnswer: 'Quality time provides an uninterrupted space to talk and support each other through life’s triumphs and hardships.'
        },
        {
          questionNumber: 2,
          questionText: 'Describe a family celebration you remember with fond emotions.',
          questionTextPl: 'Opisz uroczystość rodzinną, którą wspominasz z ciepłymi uczuciami.', questionTextRu: 'Опиши семейный праздник, который вспоминаешь с теплотой.',
          hints: ['Anniversary or holiday', 'Joyful moments'],
          usefulPhrases: ['One event that stands out in my memory...'],
          modelAnswer: 'Last Christmas Eve at my grandparents’ home stands out because the entire extended family was together laughing and singing carols.'
        },
        {
          questionNumber: 3,
          questionText: 'Do you think generation gaps between teenagers and parents are inevitable? Why?',
          questionTextPl: 'Czy Twoim zdaniem różnice pokoleniowe między nastolatkami a rodzicami są nieuniknione? Dlaczego?', questionTextRu: 'Считаешь ли ты, что разногласия между поколениями подростков и родителей неизбежны? Почему?',
          hints: ['Different cultural influences, tech adoption'],
          usefulPhrases: ['Differences in technological habits often cause misunderstandings...'],
          modelAnswer: 'Yes, because each generation grows up in different technological and cultural realities, though open communication can bridge this gap.'
        }
      ],
      fullModelAnswer: 'This image captures family intimacy at its best, reminding us that genuine happiness is rooted in simple shared moments.'
    },
    testQuestions: [
      {
        id: 'zp-t1',
        type: 'multiple-choice',
        prompt: 'Wybierz poprawną formę czasu przeszłego:',
        sentencePrefix: 'By the time my parents arrived home, we ',
        sentenceSuffix: ' the entire dinner.',
        options: ['had already prepared', 'already prepared', 'have already prepared', 'were preparing'],
        correctAnswers: ['had already prepared'],
        explanation: 'Czynność wcześniejsza od innej czynności w przeszłości (Past Perfect: had + 3. forma).',
        level: 'Podstawowy'
      }
    ],
    grammarRules: [
      {
        id: 'zp-g1',
        title: 'Past Perfect Simple & Continuous: Uprzedniość czasowa',
        level: 'P/R',
        formula: 'had + past participle | had been + -ing',
        ruleSummary: 'Past Perfect stosujemy, by zaznaczyć, że jedno wydarzenie w przeszłości miało miejsce przed innym punktem w przeszłości.',
        examples: [
          { english: 'When she knocked on the door, he had already left.', polish: 'Gdy zapukała do drzwi, on już wyszedł.', russian: 'Когда она постучала в дверь, он уже ушёл.' }
        ]
      }
    ],
    vocabularyList: [
      { id: 'zpv-1', english: 'extended family', polish: 'rodzina wielopokoleniowa / dalsza rodzina', russian: 'расширенная семья / дальние родственники', category: 'Rodzina', level: 'P', example: 'We see our extended family mostly at weddings.' }
    ],
    writingPrompt: {
      type: 'E-mail',
      level: 'Podstawowy',
      title: 'Zaproszenie na spotkanie po latach',
      taskPrompt: 'Napisz e-mail do dawnego przyjaciela z dzieciństwa (80-130 słów), w którym zaprosisz go na spotkanie i przypomnisz zabawne wspomnienie ze szkoły.',
      wordLimit: { min: 80, max: 130 },
      bulletPoints: ['Powód kontaktu', 'Wspomnienie ze szkoły', 'Propozycja spotkania'],
      usefulPhrases: ['It\'s been ages since we last talked...', 'Do you remember when we...'],
      samplePlan: ['Powitanie i wstęp', 'Wspomnienie', 'Termin i miejsce'],
      modelAnswer: 'Hi Tom! It has been ages since we last spoke! I was looking through old photos yesterday and found that funny picture from our primary school camping trip. Are you free next Saturday to grab a coffee and catch up?'
    }
  },
  {
    id: 'zywienie',
    number: 6,
    titlePl: 'Żywienie',
    titleEn: 'Food & Nutrition',
    shortDescription: 'Artykuły spożywcze, posiłki, restauracje, dieta, gotowanie i zdrowe nawyki.',
    iconName: 'Utensils',
    badge: 'B1+',
    subtopics: ['Produkty spożywcze i potrawy', 'Nawyki żywieniowe i diety', 'Lokale gastronomiczne', 'Przepisy i techniki kulinarne'],
    grammarSummary: 'Rzeczowniki policzalne i niepoliczalne (quantifiers: few, little, much, many, plenty of), stopnie przymiotników.',
    flashcards: [
      {
        id: 'zyw-1',
        front: 'wholesome',
        phonetic: '/ˈhəʊl.səm/',
        partOfSpeech: 'adjective',
        backMeaningPl: 'pożywny, zdrowy dla organizmu', backMeaningRu: 'питательный, полезный для организма',
        backMeaningEn: 'good for your health and physical well-being',
        exampleSentence: 'A wholesome breakfast packed with fiber provides steady energy throughout the morning.',
        category: 'Dieta i zdrowie'
      }
    ],
    pictureDescription: {
      imageSrc: '/images/matura_06_shopping.jpg',
      imageAlt: 'People choosing fresh fruit at an open-air market',
      title: 'Wybór świeżych produktów (Fresh Produce Market)',
      situation: 'Klienci wybierają świeże owoce i warzywa na straganach targu miejskiego.',
      steps: [
        {
          stepName: 'Introduction',
          stepNamePl: 'Wstęp', stepNameRu: 'Вступление',
          description: 'Opis zakupów spożywczych.',
          recommendedPhrases: ['In the picture, customers are browsing fresh seasonal produce...'],
          modelExample: 'In the picture, shoppers are selecting fresh fruit and vegetables at the stalls of an open-air market.'
        }
      ],
      examQuestions: [
        {
          questionNumber: 1,
          questionText: 'Why are organic and locally sourced products gaining so much popularity?',
          questionTextPl: 'Dlaczego produkty ekologiczne i lokalne zyskują tak dużą popularność?', questionTextRu: 'Почему экологические и местные продукты набирают такую популярность?',
          hints: ['Health, chemical-free, eco footprint'],
          usefulPhrases: ['Consumers are increasingly conscious of additives...'],
          modelAnswer: 'People want to eat healthier food free from pesticides while simultaneously reducing their carbon footprint by supporting local farmers.'
        },
        {
          questionNumber: 2,
          questionText: 'Tell me about a memorable dish you tried while traveling abroad.',
          questionTextPl: 'Opowiedz o pamiętnej potrawie, której spróbowałeś/aś podczas podróży za granicę.', questionTextRu: 'Расскажи о запоминающемся блюде, которое ты попробовал(а) в поездке за границу.',
          hints: ['Cuisine (Italian, Spanish, Asian)', 'Taste sensations'],
          usefulPhrases: ['When I visited Italy, I had authentic Neapolitan pizza...'],
          modelAnswer: 'When I visited Italy, I tasted authentic wood-fired Neapolitan pizza with buffalo mozzarella. The freshness was incomparable to any frozen pizza.'
        },
        {
          questionNumber: 3,
          questionText: 'Should energy drinks and sugary sodas be banned for minors? Why?',
          questionTextPl: 'Czy napoje energetyczne i słodzone napoje gazowane powinny być zakazane dla nieletnich?', questionTextRu: 'Следует ли запретить энергетики и сладкие газированные напитки для несовершеннолетних?',
          hints: ['Cardiovascular issues, sleep deprivation, obesity'],
          usefulPhrases: ['Excessive caffeine poses cardiovascular risks...'],
          modelAnswer: 'Yes, high caffeine and sugar levels can trigger severe sleep disorders and long-term heart issues in developing teenagers.'
        }
      ],
      fullModelAnswer: 'This image highlights the importance of making conscious, healthy dietary choices every day.'
    },
    testQuestions: [
      {
        id: 'zyw-t1',
        type: 'multiple-choice',
        prompt: 'Wybierz poprawne określenie ilości:',
        sentencePrefix: 'There is only a ',
        sentenceSuffix: ' milk left in the bottle, so please buy some on your way home.',
        options: ['little', 'few', 'many', 'lot'],
        correctAnswers: ['little'],
        explanation: 'Rzeczownik niepoliczalny "milk" łączy się z "a little" (trochę). "A few" stosujemy do policzalnych.',
        level: 'Podstawowy'
      }
    ],
    grammarRules: [
      {
        id: 'zyw-g1',
        title: 'Quantifiers: much, many, a few vs few, a little vs little',
        level: 'P',
        formula: 'a few / few + plural countable | a little / little + uncountable',
        ruleSummary: 'Bez rodzajnika ("few", "little") ma wydźwięk negatywny (prawie nic, za mało). Z "a" ("a few", "a little") oznacza wystarczającą, pozytywną ilość.',
        examples: [
          { english: 'I have few ingredients left, so I cannot make a stew.', polish: 'Zostało mi niewiele składników, więc nie ugotuję gulaszu.', russian: 'У меня осталось мало ингредиентов, поэтому я не смогу приготовить рагу.' }
        ]
      }
    ],
    vocabularyList: [
      { id: 'zyv-1', english: 'mouth-watering', polish: 'apetyczny, że aż ślinka cieknie', russian: 'аппетитный, слюнки текут', category: 'Smak', level: 'R', example: 'The bakery window was filled with mouth-watering pastries.' }
    ],
    writingPrompt: {
      type: 'Wpis na blogu',
      level: 'Podstawowy',
      title: 'Tydzień wegetariańskiego wyzwania (Vegetarian Week Challenge)',
      taskPrompt: 'Postanowiłeś/aś przez tydzień jeść wyłącznie posiłki wegetariańskie. Napisz wpis na blogu (80-130 słów), w którym opiszesz swoje doświadczenia i polecisz ciekawy przepis.',
      wordLimit: { min: 80, max: 130 },
      bulletPoints: ['Powód podjęcia wyzwania', 'Największe trudności', 'Ulubione danie'],
      usefulPhrases: ['Last week I decided to give vegetarianism a try...', 'To my surprise, it wasn\'t as hard as...'],
      samplePlan: ['Wstęp', 'Wrażenia', 'Przepis i podsumowanie'],
      modelAnswer: 'Last week I decided to take up a vegetarian diet challenge. At first, I worried I would feel hungry, but cooking lentil curry proved nutritious and delicious!'
    }
  },
  {
    id: 'zakupy',
    number: 7,
    titlePl: 'Zakupy i usługi',
    titleEn: 'Shopping & Services',
    shortDescription: 'Sklepy, zakupy online, prawa konsumenta, reklamacje i reklama.',
    iconName: 'ShoppingBag',
    badge: 'B1+',
    subtopics: ['Rodzaje sklepów i usług', 'Płatności i promocje', 'Zakupy internetowe i kurierzy', 'Reklamacje i prawa konsumenta'],
    grammarSummary: 'Okresy warunkowe (Conditionals 0, 1, 2) oraz wish / if only w kontekście zakupów i decyzji.',
    flashcards: [
      {
        id: 'zak-1',
        front: 'bargain',
        phonetic: '/ˈbɑː.ɡɪn/',
        partOfSpeech: 'noun',
        backMeaningPl: 'okazja cenowa, tani zakup', backMeaningRu: 'выгодная покупка, удачная цена',
        backMeaningEn: 'something on sale at a lower price than its true value',
        exampleSentence: 'At only ten pounds, that winter coat was a real bargain.',
        category: 'Zakupy'
      }
    ],
    pictureDescription: {
      imageSrc: '/images/matura_11_supermarket.jpg',
      imageAlt: 'Woman shopping with a cart in supermarket',
      title: 'Zakupy w supermarkecie (Supermarket Shopping)',
      situation: 'Klientka robi codzienne zakupy w dziale ze świeżymi artykułami.',
      steps: [
        {
          stepName: 'Introduction',
          stepNamePl: 'Wstęp', stepNameRu: 'Вступление',
          description: 'Wprowadzenie do sceny zakupowej.',
          recommendedPhrases: ['In this image, a shopper is pushing a cart...'],
          modelExample: 'In this image, a shopper is walking through a brightly lit modern supermarket.'
        }
      ],
      examQuestions: [
        {
          questionNumber: 1,
          questionText: 'Why do so many consumers prefer shopping in supermarkets rather than local corner shops?',
          questionTextPl: 'Dlaczego tak wielu konsumentów woli robić zakupy w supermarketach niż w małych sklepikach osiedlowych?', questionTextRu: 'Почему так много покупателей предпочитают супермаркеты маленьким магазинам у дома?',
          hints: ['Variety, lower prices, everything in one spot'],
          usefulPhrases: ['Supermarkets provide a comprehensive variety of goods...'],
          modelAnswer: 'Supermarkets offer significantly wider product selections, competitive discounts, and the convenience of getting everything in one trip.'
        },
        {
          questionNumber: 2,
          questionText: 'Describe a situation when you had to return a faulty product to a store or website.',
          questionTextPl: 'Opisz sytuację, gdy musiałeś/aś zwrócić wadliwy produkt do sklepu lub na stronie internetowej.', questionTextRu: 'Опиши ситуацию, когда тебе пришлось вернуть бракованный товар в магазин или на сайте.',
          hints: ['Defective item (headphones, shoes)', 'Refund or exchange'],
          usefulPhrases: ['A couple of months ago, I ordered wireless headphones that stopped charging...'],
          modelAnswer: 'A couple of months ago, I ordered wireless headphones that stopped charging after three days. I contacted customer support, returned them via parcel locker, and received a full refund.'
        },
        {
          questionNumber: 3,
          questionText: 'Do personalized internet advertisements manipulate consumers unfairly? Why or why not?',
          questionTextPl: 'Czy spersonalizowane reklamy internetowe w nieuczciwy sposób manipulują konsumentami?', questionTextRu: 'Манипулирует ли персонализированная интернет-реклама покупателями нечестным образом?',
          hints: ['Algorithms track search habits, impulse purchases'],
          usefulPhrases: ['Algorithms track personal browsing history to induce impulse buying...'],
          modelAnswer: 'Yes, targeted ads exploit our psychological vulnerabilities and encourage compulsive consumerism that people can ill afford.'
        }
      ],
      fullModelAnswer: 'This image depicts everyday consumer culture and underscores how organized retail spaces influence purchasing decisions.'
    },
    testQuestions: [
      {
        id: 'zak-t1',
        type: 'key-word-transformation',
        prompt: 'Przekształć zdanie z użyciem słowa kluczowego (2 do 5 słów):',
        sentencePrefix: 'I regret buying this expensive designer watch. (WISH)\nI ',
        sentenceSuffix: ' that expensive designer watch.',
        targetWord: 'WISH',
        correctAnswers: ['wish I had not bought', "wish I hadn't bought"],
        explanation: 'Żal dotyczący przeszłości wyrażamy konstrukcją: wish + Past Perfect (had not bought).',
        level: 'Rozszerzony'
      }
    ],
    grammarRules: [
      {
        id: 'zak-g1',
        title: 'Konstrukcje z wish i if only dla przeszłości i teraźniejszości',
        level: 'R',
        formula: 'wish + Past Simple (teraźniejszość) | wish + Past Perfect (przeszłość)',
        ruleSummary: 'Wyraża niespełnione pragnienia dotyczące chwili obecnej lub żal za błędy z przeszłości.',
        examples: [
          { english: 'I wish I had kept the receipt.', polish: 'Żałuję, że nie zachowałem paragonu.', russian: 'Жаль, что я не сохранил чек.' }
        ]
      }
    ],
    vocabularyList: [
      { id: 'zv-1', english: 'money-back guarantee', polish: 'gwarancja zwrotu pieniędzy', russian: 'гарантия возврата денег', category: 'Reklamacje', level: 'P', example: 'The online store provides a 30-day money-back guarantee.' }
    ],
    writingPrompt: {
      type: 'E-mail',
      level: 'Podstawowy',
      title: 'Reklamacja wadliwego produktu (Faulty Product Complaint)',
      taskPrompt: 'Kupiłeś/aś w sklepie internetowym uszkodzony zegarek. Napisz e-mail reklamacyjny do działu obsługi klienta (80-130 słów), w którym opiszesz wadę i zażądasz wymiany towaru lub zwrotu pieniędzy.',
      wordLimit: { min: 80, max: 130 },
      bulletPoints: ['Data zakupu i numer zamówienia', 'Opis usterki', 'Żądanie rekompensaty'],
      usefulPhrases: ['I am writing to file a formal complaint regarding...', 'To my great dismay, upon opening the package...'],
      samplePlan: ['Wstęp ze szczegółami zamówienia', 'Opis uszkodzenia', 'Wnioskowane rozwiązanie'],
      modelAnswer: 'Dear Customer Service, I am writing to lodge a formal complaint regarding order #84930 placed on 12th October. Upon unboxing the smartwatch, I discovered the touch display was completely unresponsive. I request a replacement or a full refund.'
    }
  },
  {
    id: 'podroze',
    number: 8,
    titlePl: 'Podróżowanie i turystyka',
    titleEn: 'Travel & Tourism',
    shortDescription: 'Środki transportu, zakwaterowanie, atrakcje turystyczne, wypadki i podróże marzeń.',
    iconName: 'Compass',
    badge: 'B2',
    subtopics: ['Środki transportu i podróżowanie', 'Baza noclegowa i rezerwacje', 'Zwiedzanie i kultura podróżowania', 'Wypadki, opóźnienia i ubezpieczenia'],
    grammarSummary: 'Past Continuous vs Past Simple, Inwersja stylistyczna (Hardly had we arrived... when), spójniki czasu.',
    flashcards: [
      {
        id: 'pod-1',
        front: 'off the beaten track',
        phonetic: '/ɒf ðə ˈbiːtn træk/',
        partOfSpeech: 'idiom',
        backMeaningPl: 'z dala od utartych szlaków turystycznych', backMeaningRu: 'вдали от проторённых туристических маршрутов',
        backMeaningEn: 'isolated and far from where most tourists usually go',
        exampleSentence: 'We preferred staying in a remote cottage completely off the beaten track.',
        category: 'Podróże'
      }
    ],
    pictureDescription: {
      imageSrc: '/images/matura_03_travel.jpg',
      imageAlt: 'Backpacker traveler walking with a backpack',
      title: 'Wyprawa z plecakiem (Solo Backpacking Journey)',
      situation: 'Młody turysta przemierza pieszo malownicze, historyczne uliczki podczas samodzielnej wyprawy z plecakiem.',
      steps: [
        {
          stepName: 'Introduction',
          stepNamePl: 'Wstęp', stepNameRu: 'Вступление',
          description: 'Przedstawienie wędrowca w podróży.',
          recommendedPhrases: ['In this photo, we see a solo traveler on an adventure...'],
          modelExample: 'In this photo, we see an adventurous young traveler carrying a backpack along a sunlit pathway.'
        }
      ],
      examQuestions: [
        {
          questionNumber: 1,
          questionText: 'Why do you think backpackers prefer independence over packaged tour packages?',
          questionTextPl: 'Dlaczego Twoim zdaniem backpackerzy wolą niezależność od wycieczek zorganizowanych?', questionTextRu: 'Почему, по-твоему, бэкпекеры предпочитают самостоятельность организованным турам?',
          hints: ['Spontaneity, authentic local interaction, lower costs'],
          usefulPhrases: ['Backpacking allows spontaneous route adjustments...'],
          modelAnswer: 'Backpackers seek authentic interactions and the freedom to change their schedule spontaneously without being constrained by rigid tour groups.'
        },
        {
          questionNumber: 2,
          questionText: 'Describe an unexpected delay or mishap you experienced during a trip.',
          questionTextPl: 'Opisz nieoczekiwane opóźnienie lub przygodę, która przydarzyła Ci się w podróży.', questionTextRu: 'Опиши неожиданную задержку или приключение, случившееся с тобой в путешествии.',
          hints: ['Cancelled train or flight', 'Resolving the issue'],
          usefulPhrases: ['During a trip to London, our train was cancelled due to signaling failure...'],
          modelAnswer: 'While traveling to the mountains, our train got delayed by three hours in severe blizzard conditions. We ended up singing songs with other passengers.'
        },
        {
          questionNumber: 3,
          questionText: 'Does mass tourism damage fragile ecosystems and historic cities? Explain your view.',
          questionTextPl: 'Czy masowa turystyka niszczy delikatne ekosystemy i historyczne miasta?', questionTextRu: 'Разрушает ли массовый туризм хрупкие экосистемы и исторические города?',
          hints: ['Overtourism, pollution, rising housing costs for locals'],
          usefulPhrases: ['Overtourism leads to overcrowding and environmental strain...'],
          modelAnswer: 'Yes, overtourism strains fragile historic architecture in cities like Venice and harms delicate natural ecosystems through pollution and overcrowding.'
        }
      ],
      fullModelAnswer: 'This striking photograph captures the true romance and self-reliance of modern exploration.'
    },
    testQuestions: [
      {
        id: 'pod-t1',
        type: 'key-word-transformation',
        prompt: 'Przekształć zdanie z użyciem inwersji (2 do 5 słów):',
        sentencePrefix: 'As soon as we arrived at the hotel, the power went out. (SOONER)\nNo ',
        sentenceSuffix: ' at the hotel than the power went out.',
        targetWord: 'SOONER',
        correctAnswers: ['sooner had we arrived'],
        explanation: 'Inwersja ze zwrotem No sooner: No sooner had + podmiot + past participle ... than.',
        level: 'Rozszerzony'
      }
    ],
    grammarRules: [
      {
        id: 'pod-g1',
        title: 'Inwersja ujemna z wyrażeniami czasu: No sooner... than / Hardly... when',
        level: 'R',
        formula: 'No sooner had + S + V3 + than... | Hardly had + S + V3 + when...',
        ruleSummary: 'Stosowana w stylu formalnym do opisu zdarzenia, które nastąpiło natychmiast po innym.',
        examples: [
          { english: 'Hardly had the plane landed when the passengers applauded.', polish: 'Zaledwie samolot wylądował, a pasażerowie zaczęli bić brawo.', russian: 'Едва самолёт приземлился, как пассажиры зааплодировали.' }
        ]
      }
    ],
    vocabularyList: [
      { id: 'pv-tour-1', english: 'breathtaking scenery', polish: 'zapierający dech w piersiach krajobraz', russian: 'захватывающий дух пейзаж', category: 'Atrakcje', level: 'P', example: 'The mountain pass provided breathtaking scenery.' }
    ],
    writingPrompt: {
      type: 'Rozprawka',
      level: 'Rozszerzony',
      title: 'Wpływ tanich linii lotniczych na turystykę',
      taskPrompt: 'Tanie linie lotnicze sprawiły, że podróże stały się dostępne dla milionów ludzi. Napisz rozprawkę, w której przedstawisz pozytywne i negatywne skutki tego zjawiska.',
      wordLimit: { min: 200, max: 250 },
      bulletPoints: ['Dostępność i wymiana kulturowa', 'Wpływ na klimat i emisję spalin', 'Podsumowanie'],
      usefulPhrases: ['Low-cost carriers have democratized travel...', 'On the other hand, aviation emissions significantly accelerate climate change...'],
      samplePlan: ['Wstęp', 'Korzyści', 'Koszty środowiskowe', 'Wnioski'],
      modelAnswer: 'The advent of budget airlines has reshaped international tourism, democratizing aviation and opening unprecedented horizons for travelers worldwide.'
    }
  },
  {
    id: 'kultura',
    number: 9,
    titlePl: 'Kultura',
    titleEn: 'Culture & Entertainment',
    shortDescription: 'Literatura, kino, teatr, sztuka wizualna, muzyka, festiwale i media masowe.',
    iconName: 'Film',
    badge: 'B2',
    subtopics: ['Kino, teatr i spektakle', 'Muzyka i koncerty', 'Literatura i prasa', 'Sztuki plastyczne i muzea'],
    grammarSummary: 'Passive Voice (wszystkie czasy), konstrukcje bezosobowe (It is said that / He is believed to be).',
    flashcards: [
      {
        id: 'kul-1',
        front: 'masterpiece',
        phonetic: '/ˈmɑː.stə.piːs/',
        partOfSpeech: 'noun',
        backMeaningPl: 'arcydzieło', backMeaningRu: 'шедевр',
        backMeaningEn: 'a work of outstanding artistry, skill, or workmanship',
        exampleSentence: 'The novel is widely hailed as a literary masterpiece of the twentieth century.',
        category: 'Sztuka'
      }
    ],
    pictureDescription: {
      imageSrc: '/images/matura_07_culture.jpg',
      imageAlt: 'Musical performance / cultural art event',
      title: 'Wydarzenie kulturalne i koncert (Live Cultural Performance)',
      situation: 'Artyści występują na żywo przed zaangażowaną publicznością podczas koncertu.',
      steps: [
        {
          stepName: 'Introduction',
          stepNamePl: 'Wstęp', stepNameRu: 'Вступление',
          description: 'Opis występu artystycznego.',
          recommendedPhrases: ['In the photograph, musicians are performing live on stage...'],
          modelExample: 'In the photograph, passionate musicians are performing live in front of a captivated audience.'
        }
      ],
      examQuestions: [
        {
          questionNumber: 1,
          questionText: 'Why is experiencing a live concert more intense than listening to recorded music at home?',
          questionTextPl: 'Dlaczego udział w koncercie na żywo wywołuje silniejsze emocje niż słuchanie muzyki w domu?', questionTextRu: 'Почему живой концерт вызывает более сильные эмоции, чем прослушивание музыки дома?',
          hints: ['Collective energy, acoustic vibrations, visual show'],
          usefulPhrases: ['The collective euphoria of the crowd amplifies emotions...'],
          modelAnswer: 'Live concerts generate an electrifying communal energy that stereo headphones cannot replicate.'
        },
        {
          questionNumber: 2,
          questionText: 'Tell me about an engaging museum exhibition or theatre play you attended.',
          questionTextPl: 'Opowiedz o wciągającej wystawie w muzeum lub spektaklu teatralnym, w którym uczestniczyłeś/aś.', questionTextRu: 'Расскажи об увлекательной музейной выставке или спектакле, на котором ты был(а).',
          hints: ['Interactive exhibition, striking impressions'],
          usefulPhrases: ['Last winter, I visited an interactive science and art museum...'],
          modelAnswer: 'Last autumn, I watched a contemporary theatrical adaptation of Macbeth that utilized striking light effects and intense acting.'
        },
        {
          questionNumber: 3,
          questionText: 'Will artificial intelligence undermine human creativity in art and music?',
          questionTextPl: 'Czy sztuczna inteligencja podkopie ludzką kreatywność w sztuce i muzyce?', questionTextRu: 'Подорвёт ли искусственный интеллект человеческое творчество в искусстве и музыке?',
          hints: ['AI generates formulas, human art conveys soul and trauma'],
          usefulPhrases: ['While algorithms mimic patterns, genuine art stems from emotional vulnerability...'],
          modelAnswer: 'While generative AI can replicate styles, genuine art is a manifestation of lived human joy, grief, and emotional consciousness.'
        }
      ],
      fullModelAnswer: 'This image captures the captivating magic of performing arts and human cultural expression.'
    },
    testQuestions: [
      {
        id: 'kul-t1',
        type: 'key-word-transformation',
        prompt: 'Przekształć zdanie w stronę bierną bezosobową (2 do 5 słów):',
        sentencePrefix: 'People believe that the director created a breakthrough film. (IS)\nThe director ',
        sentenceSuffix: ' a breakthrough film.',
        targetWord: 'IS',
        correctAnswers: ['is believed to have created'],
        explanation: 'Konstrukcja Personal Passive: Subject + is believed to have + V3 dla czynności przeszłej.',
        level: 'Rozszerzony'
      }
    ],
    grammarRules: [
      {
        id: 'kul-g1',
        title: 'Konstrukcje bezosobowe w Passive Voice (Personal & Impersonal)',
        level: 'R',
        formula: 'It is said that + clause | Subject + is said to do / to have done',
        ruleSummary: 'Używane w recenzjach i dyskursie formalnym do przytaczania powszechnych opinii.',
        examples: [
          { english: 'The actress is believed to be preparing for a new historical drama.', polish: 'Uważa się, że aktorka przygotowuje się do nowego dramatu historycznego.', russian: 'Считается, что актриса готовится к новой исторической драме.' }
        ]
      }
    ],
    vocabularyList: [
      { id: 'kv-1', english: 'acclaimed', polish: 'cieszący się uznaniem, entuzjastycznie przyjęty', russian: 'признанный, восторженно принятый', category: 'Krytyka', level: 'R', example: 'The critically acclaimed drama received five awards.' }
    ],
    writingPrompt: {
      type: 'Artykuł',
      level: 'Rozszerzony',
      title: 'Czy tradycyjne kina przetrwają erę platform streamingowych?',
      taskPrompt: 'Napisz artykuł do czasopisma kulturalnego, w którym porównasz doświadczenie oglądania filmów w kinie z domowymi serwisami streamingowymi.',
      wordLimit: { min: 200, max: 250 },
      bulletPoints: ['Wygoda streamingu', 'Magia wielkiego ekranu i dźwięku przestrzennego', 'Prognoza na przyszłość'],
      usefulPhrases: ['Streaming giants have revolutionized home entertainment...', 'Yet, nothing compares to the immersive spectacle of the cinema hall...'],
      samplePlan: ['Wstęp', 'Rewolucja streamingu', 'Unikalność kina', 'Konkluzja'],
      modelAnswer: 'With the exponential rise of on-demand streaming platforms, the cinematic landscape has undergone a tectonic shift.'
    }
  },
  {
    id: 'sport',
    number: 10,
    titlePl: 'Sport',
    titleEn: 'Sport & Physical Fitness',
    shortDescription: 'Dyscypliny sportowe, zawody, trening, fair play, zdrowa rywalizacja i igrzyska.',
    iconName: 'Trophy',
    badge: 'B1+',
    subtopics: ['Dyscypliny sportowe indywidualne i zespołowe', 'Sprzęt sportowy i obiekty', 'Zawody, punkty i zwycięstwa', 'Doping, fair play i korzyści zdrowotne'],
    grammarSummary: 'Stopniowanie przymiotników i przysłówków (the more... the better), czasowniki modalne dedukcji.',
    flashcards: [
      {
        id: 'sp-1',
        front: 'stamina',
        phonetic: '/ˈstæm.ɪ.nə/',
        partOfSpeech: 'noun',
        backMeaningPl: 'wytrzymałość, kondycja', backMeaningRu: 'выносливость, физическая форма',
        backMeaningEn: 'the physical or mental strength to do something that takes a long time and is difficult',
        exampleSentence: 'Marathon runners need extraordinary stamina and mental discipline.',
        category: 'Trening'
      }
    ],
    pictureDescription: {
      imageSrc: '/images/matura_05_sport.jpg',
      imageAlt: 'Athletes running outdoors on stadium track',
      title: 'Bieg lekkoatletyczny na stadionie (Athletics Track Race)',
      situation: 'Lekkoatleci rywalizują na bieżni stadionu w pełnym skupieniu.',
      steps: [
        {
          stepName: 'Introduction',
          stepNamePl: 'Wstęp', stepNameRu: 'Вступление',
          description: 'Przedstawienie rywalizacji sportowej.',
          recommendedPhrases: ['In this dynamic photograph, athletes are sprinting on a track...'],
          modelExample: 'In this dynamic photograph, several sprinters are competing fiercely along an athletics track.'
        }
      ],
      examQuestions: [
        {
          questionNumber: 1,
          questionText: 'What psychological qualities are most vital for professional competitors?',
          questionTextPl: 'Jakie cechy psychiczne są najważniejsze dla zawodowych sportowców?', questionTextRu: 'Какие психологические качества важнее всего для профессиональных спортсменов?',
          hints: ['Resilience, focus, handling defeat'],
          usefulPhrases: ['Mental toughness is just as critical as muscular conditioning...'],
          modelAnswer: 'Mental resilience and laser focus under pressure distinguish champions from average competitors.'
        },
        {
          questionNumber: 2,
          questionText: 'Do you engage in regular physical exercise? Why or why not?',
          questionTextPl: 'Czy regularnie uprawiasz sport? Dlaczego?', questionTextRu: 'Ты регулярно занимаешься спортом? Почему?',
          hints: ['Running, gym, cycling', 'Stress relief'],
          usefulPhrases: ['I jog three times a week because it clears my head...'],
          modelAnswer: 'I go swimming twice a week; it relieves academic stress and keeps my spine healthy.'
        },
        {
          questionNumber: 3,
          questionText: 'Should sports events receive state funding over cultural or educational projects?',
          questionTextPl: 'Czy wydarzenia sportowe powinny otrzymywać fundusze państwowe kosztem projektów kulturalnych lub edukacyjnych?', questionTextRu: 'Должны ли спортивные мероприятия получать государственное финансирование в ущерб культурным или образовательным проектам?',
          hints: ['Public health vs intellect, balanced budget'],
          usefulPhrases: ['Funding must strike a balanced equilibrium...'],
          modelAnswer: 'No, funding should be balanced because culture and education are equally indispensable for a well-rounded society.'
        }
      ],
      fullModelAnswer: 'This photograph celebrates perseverance and the relentless human drive to surpass physical boundaries.'
    },
    testQuestions: [
      {
        id: 'sp-t1',
        type: 'multiple-choice',
        prompt: 'Wybierz poprawną konstrukcję podwójnego stopnia wyższego:',
        sentencePrefix: 'The harder you train, ',
        sentenceSuffix: ' you become.',
        options: ['the stronger', 'the more strong', 'stronger', 'more strong'],
        correctAnswers: ['the stronger'],
        explanation: 'Konstrukcja: The + comparative..., the + comparative... (The harder..., the stronger...).',
        level: 'Podstawowy'
      }
    ],
    grammarRules: [
      {
        id: 'sp-g1',
        title: 'Stopniowanie proporcjonalne: The more... the more...',
        level: 'P/R',
        formula: 'The + comparative (adj/adv), the + comparative...',
        ruleSummary: 'Wyraża zależność, w której nasilenie jednej cechy powoduje zmianę drugiej.',
        examples: [
          { english: 'The faster we run, the earlier we finish the route.', polish: 'Im szybciej pobiegniemy, tym wcześniej ukończymy trasę.', russian: 'Чем быстрее мы побежим, тем раньше закончим маршрут.' }
        ]
      }
    ],
    vocabularyList: [
      { id: 'spv-1', english: 'rigorous training', polish: 'rygorystyczny trening', russian: 'жёсткие тренировки', category: 'Trening', level: 'P', example: 'Olympic athletes undergo months of rigorous training.' }
    ],
    writingPrompt: {
      type: 'Rozprawka',
      level: 'Rozszerzony',
      title: 'Zawodowy sport a zdrowie: zyski czy wyniszczenie?',
      taskPrompt: 'Napisz rozprawkę, w której przedstawisz zalety i wady uprawiania sportu na poziomie zawodowym.',
      wordLimit: { min: 200, max: 250 },
      bulletPoints: ['Sława, zarobki i inspiracja', 'Kontuzje i przedwczesne zakończenie kariery', 'Podsumowanie'],
      usefulPhrases: ['Professional athletics offers lucrative sponsorships...', 'However, chronic injuries often inflict lifelong damage...'],
      samplePlan: ['Wstęp', 'Korzyści kariery', 'Ciemna strona sportu', 'Konkluzja'],
      modelAnswer: 'Elite sports captivate audiences globally, yet pursuing athletic perfection at the highest level carries profound personal consequences.'
    }
  },
  {
    id: 'zdrowie',
    number: 11,
    titlePl: 'Zdrowie',
    titleEn: 'Health & Well-being',
    shortDescription: 'Choroby, leczenie, pierwsza pomoc, zdrowie psychiczne, służba zdrowia i nawyki.',
    iconName: 'Activity',
    badge: 'B2',
    subtopics: ['Objawy i powszechne dolegliwości', 'W gabinecie lekarskim i szpitalu', 'Zdrowie psychiczne i stres', 'Zdrowy tryb życia i profilaktyka'],
    grammarSummary: 'Drugi i trzeci okres warunkowy (Second & Third Conditionals), konstrukcje it\'s high time, had better.',
    flashcards: [
      {
        id: 'zd-1',
        front: 'come down with',
        phonetic: '/kʌm daʊn wɪð/',
        partOfSpeech: 'phrasal_verb',
        backMeaningPl: 'rozchorować się na coś (np. grypę)', backMeaningRu: 'заболеть чем-либо (напр. гриппом)',
        backMeaningEn: 'to begin to suffer from an illness, especially a common one',
        exampleSentence: 'I think I am coming down with the flu because my throat feels sore.',
        category: 'Choroby'
      }
    ],
    pictureDescription: {
      imageSrc: '/images/matura_10_health.jpg',
      imageAlt: 'Doctor examining patient in modern clinic',
      title: 'Wizyta lekarska w nowoczesnym gabinecie (Medical Consultation)',
      situation: 'Lekarz w białym fartuchu z empatią bada pacjenta w przyjaznym gabinecie.',
      steps: [
        {
          stepName: 'Introduction',
          stepNamePl: 'Wstęp', stepNameRu: 'Вступление',
          description: 'Opis wizyty medycznej.',
          recommendedPhrases: ['In this picture, a caring physician is examining a patient...'],
          modelExample: 'In this picture, a doctor is consulting with a patient in a bright medical examination room.'
        }
      ],
      examQuestions: [
        {
          questionNumber: 1,
          questionText: 'Why is clear communication and empathy between a doctor and patient so crucial?',
          questionTextPl: 'Dlaczego jasna komunikacja i empatia między lekarzem a pacjentem są tak ważne?', questionTextRu: 'Почему ясное общение и эмпатия между врачом и пациентом так важны?',
          hints: ['Reduces anxiety, accurate diagnosis'],
          usefulPhrases: ['Empathetic bedside manners reduce patient distress...'],
          modelAnswer: 'Empathetic communication makes patients feel safe, encouraging them to disclose all symptoms accurately.'
        },
        {
          questionNumber: 2,
          questionText: 'Tell me about a time when you or someone close to you needed medical assistance.',
          questionTextPl: 'Opowiedz o sytuacji, gdy Ty lub ktoś bliski potrzebował pomocy medycznej.', questionTextRu: 'Расскажи о ситуации, когда тебе или кому-то из близких понадобилась медицинская помощь.',
          hints: ['Sprained ankle, emergency room'],
          usefulPhrases: ['When my friend twisted his ankle during basketball...'],
          modelAnswer: 'When my younger brother sprained his ankle, we rushed to the emergency room where doctors quickly applied a cast.'
        },
        {
          questionNumber: 3,
          questionText: 'What can schools do to combat rising levels of stress and burnout among students?',
          questionTextPl: 'Co szkoły mogą zrobić, aby przeciwdziałać rosnącemu poziomowi stresu i wypalenia u uczniów?', questionTextRu: 'Что могут сделать школы, чтобы противостоять растущему уровню стресса и выгорания у учеников?',
          hints: ['School psychologists, mindfulness, manageable homework loads'],
          usefulPhrases: ['Schools must provide accessible psychological counseling...'],
          modelAnswer: 'Schools should offer accessible counselling services and moderate homework quotas to safeguard teenagers’ mental health.'
        }
      ],
      fullModelAnswer: 'This image emphasizes professional care and trust within the healthcare system.'
    },
    testQuestions: [
      {
        id: 'zd-t1',
        type: 'key-word-transformation',
        prompt: 'Przekształć zdanie z użyciem konstrukcji it is high time (2 do 5 słów):',
        sentencePrefix: 'You ought to consult a doctor about this cough. (TIME)\nIt is ',
        sentenceSuffix: ' a doctor about this cough.',
        targetWord: 'TIME',
        correctAnswers: ['high time you consulted', 'time you consulted'],
        explanation: 'Po konstrukcji It is high time stosujemy czas Past Simple dla teraźniejszości (you consulted).',
        level: 'Rozszerzony'
      }
    ],
    grammarRules: [
      {
        id: 'zd-g1',
        title: 'Konstrukcja It is (high) time + Past Simple',
        level: 'R',
        formula: 'It is high time + subject + Past Simple',
        ruleSummary: 'Oznacza "najwyższy czas, aby ktoś coś zrobił" (wyrzut, że sprawa została opóźniona).',
        examples: [
          { english: 'It is high time we scheduled a health check-up.', polish: 'Najwyższy czas, abyśmy umówili się na badania profilaktyczne.', russian: 'Давно пора записаться на профилактическое обследование.' }
        ]
      }
    ],
    vocabularyList: [
      { id: 'zdv-1', english: 'prescribe', polish: 'przepisać lek na receptę', russian: 'выписать лекарство по рецепту', category: 'Leczenie', level: 'P', example: 'The doctor prescribed antibiotics for her chest infection.' }
    ],
    writingPrompt: {
      type: 'Artykuł',
      level: 'Rozszerzony',
      title: 'Zdrowie psychiczne młodzieży: cicha epidemia',
      taskPrompt: 'Napisz artykuł do magazynu młodzieżowego na temat presji szkolnej i sposobów dbania o dobrostan psychiczny.',
      wordLimit: { min: 200, max: 250 },
      bulletPoints: ['Przyczyny stresu', 'Objawy wypalenia', 'Praktyczne porady redukcji stresu'],
      usefulPhrases: ['Academic expectations often overwhelm teenagers...', 'Prioritizing sleep and mindfulness can restore balance...'],
      samplePlan: ['Wstęp', 'Źródła presji', 'Strategie radzenia sobie', 'Podsumowanie'],
      modelAnswer: 'In an era dominated by relentless academic competition and digital pressure, adolescent mental well-being has become a critical public health concern.'
    }
  },
  {
    id: 'nauka-technika',
    number: 12,
    titlePl: 'Nauka i technika',
    titleEn: 'Science & Technology',
    shortDescription: 'Wynalazki, sztuczna inteligencja, eksploracja kosmosu, cyberbezpieczeństwo i etyka.',
    iconName: 'Cpu',
    badge: 'B2+',
    subtopics: ['Odkrycia i przełomowe wynalazki', 'Komputery, smartfony i internet', 'Sztuczna inteligencja i robotyka', 'Dylematy etyczne nowych technologii'],
    grammarSummary: 'Future Perfect & Future Continuous, zdania podrzędne celu i rezultatu (so that, in order that).',
    flashcards: [
      {
        id: 'nt-1',
        front: 'cutting-edge',
        phonetic: '/ˌkʌt.ɪŋˈedʒ/',
        partOfSpeech: 'adjective',
        backMeaningPl: 'nowatorski, najnowocześniejszy', backMeaningRu: 'новаторский, самый современный',
        backMeaningEn: 'at the latest or most advanced stage in the development of something',
        exampleSentence: 'The research lab is equipped with cutting-edge robotic instruments.',
        category: 'Technologie'
      }
    ],
    pictureDescription: {
      imageSrc: '/images/matura_08_technology.jpg',
      imageAlt: 'Scientist engineering robotic arm with monitors',
      title: 'Laboratorium robotyki i innowacji (Robotics Research Lab)',
      situation: 'Inżynier kalibruje zaawansowane ramię robotyczne przed ekranami z kodem i danymi.',
      steps: [
        {
          stepName: 'Introduction',
          stepNamePl: 'Wstęp', stepNameRu: 'Вступление',
          description: 'Przedstawienie laboratorium technologicznego.',
          recommendedPhrases: ['In this futuristic photo, an engineer is operating a robotic system...'],
          modelExample: 'In this futuristic photo, an engineer is examining a sophisticated robotic arm in an electronics laboratory.'
        }
      ],
      examQuestions: [
        {
          questionNumber: 1,
          questionText: 'How will automation and robotics transform tomorrow’s job market?',
          questionTextPl: 'Jak automatyzacja i robotyka zmienią rynek pracy w przyszłości?', questionTextRu: 'Как автоматизация и робототехника изменят рынок труда в будущем?',
          hints: ['Repetitive tasks disappear, tech supervision increases'],
          usefulPhrases: ['Routine manual labour will increasingly be delegated to machines...'],
          modelAnswer: 'Routine manual tasks will be automated, requiring workers to pivot towards creative design, data interpretation, and programming.'
        },
        {
          questionNumber: 2,
          questionText: 'Tell me about a technological glitch or computer failure you had to resolve.',
          questionTextPl: 'Opowiedz o awarii technologicznej lub problemie z komputerem, który musiałeś/aś rozwiązać.', questionTextRu: 'Расскажи о технической поломке или проблеме с компьютером, которую тебе пришлось решать.',
          hints: ['Lost file, system crash, antivirus'],
          usefulPhrases: ['My laptop crashed right before a submission deadline...'],
          modelAnswer: 'My operating system crashed hours before an essay deadline, forcing me to recover files via cloud backup and reinstall drivers.'
        },
        {
          questionNumber: 3,
          questionText: 'Do you believe artificial general intelligence could pose an existential risk to humanity?',
          questionTextPl: 'Czy wierzysz, że ogólna sztuczna inteligencja może stanowić egzystencjalne zagrożenie dla ludzkości?', questionTextRu: 'Веришь ли ты, что общий искусственный интеллект может представлять экзистенциальную угрозу для человечества?',
          hints: ['Alignment problem, ethical boundaries'],
          usefulPhrases: ['Unregulated autonomous algorithms present ethical concerns...'],
          modelAnswer: 'Without robust ethical safeguards and international regulation, autonomous systems could produce irreversible societal disruptions.'
        }
      ],
      fullModelAnswer: 'This image illustrates humankind’s relentless pursuit of innovation and the frontier of robotics.'
    },
    testQuestions: [
      {
        id: 'nt-t1',
        type: 'key-word-transformation',
        prompt: 'Przekształć zdanie z użyciem Future Perfect (2 do 5 słów):',
        sentencePrefix: 'By the year 2035, scientists will discover effective quantum encryption. (HAVE)\nBy the year 2035, scientists ',
        sentenceSuffix: ' effective quantum encryption.',
        targetWord: 'HAVE',
        correctAnswers: ['will have discovered'],
        explanation: 'Future Perfect: will have + past participle dla czynności, która zakończy się przed określonym momentem w przyszłości.',
        level: 'Rozszerzony'
      }
    ],
    grammarRules: [
      {
        id: 'nt-g1',
        title: 'Future Perfect Simple vs Future Continuous',
        level: 'R',
        formula: 'will have + V3 (zakończy się do punktu) | will be + -ing (będzie trwać w danym momencie)',
        ruleSummary: 'Służy do prognozowania stanu rozwoju technologicznego w określonym horyzoncie czasowym.',
        examples: [
          { english: 'By next decade, autonomous vehicles will have replaced conventional taxis.', polish: 'Do następnej dekady autonomiczne pojazdy zastąpią tradycyjne taksówki.', russian: 'К следующему десятилетию беспилотные автомобили заменят обычные такси.' }
        ]
      }
    ],
    vocabularyList: [
      { id: 'ntv-1', english: 'breakthrough', polish: 'przełom naukowy', russian: 'научный прорыв', category: 'Odkrycia', level: 'P', example: 'A major breakthrough was made in quantum computing.' }
    ],
    writingPrompt: {
      type: 'Rozprawka',
      level: 'Rozszerzony',
      title: 'Czy AI powinno zastąpić ludzi w zawodach prawniczych i medycznych?',
      taskPrompt: 'Napisz rozprawkę, w której przedstawisz argumenty za i przeciw wykorzystywaniu sztucznej inteligencji do podejmowania decyzji prawnych i medycznych.',
      wordLimit: { min: 200, max: 250 },
      bulletPoints: ['Szybkość analizy danych', 'Brak empatii i odpowiedzialności moralnej', 'Wnioski'],
      usefulPhrases: ['AI algorithms process vast data with unmatched accuracy...', 'On the flip side, critical judgments require moral intuition...'],
      samplePlan: ['Wstęp', 'Argumenty za', 'Argumenty przeciw', 'Podsumowanie'],
      modelAnswer: 'The advent of sophisticated artificial intelligence has prompted vigorous debate regarding whether algorithms should be entrusted with life-altering judicial and medical verdicts.'
    }
  },
  {
    id: 'przyroda',
    number: 13,
    titlePl: 'Świat przyrody',
    titleEn: 'Nature & Environment',
    shortDescription: 'Ekologia, ocieplenie klimatu, ochrona gatunków, klęski żywiołowe i energia odnawialna.',
    iconName: 'Leaf',
    badge: 'B2+',
    subtopics: ['Klimat, pogoda i krajobraz', 'Flora i fauna zagrożona wyginięciem', 'Ochrona środowiska i recykling', 'Zanieczyszczenia i źródła energii'],
    grammarSummary: 'Mieszane okresy warunkowe (Mixed Conditionals), inwersja w okresach warunkowych (Had we known...).',
    flashcards: [
      {
        id: 'prz-1',
        front: 'biodiversity',
        phonetic: '/ˌbaɪ.əʊ.daɪˈvɜː.sə.ti/',
        partOfSpeech: 'noun',
        backMeaningPl: 'bioróżnorodność', backMeaningRu: 'биоразнообразие',
        backMeaningEn: 'the variety of plant and animal life in a particular habitat',
        exampleSentence: 'Conserving tropical rainforests is essential for safeguarding global biodiversity.',
        category: 'Ekologia'
      }
    ],
    pictureDescription: {
      imageSrc: '/images/matura_09_environment.jpg',
      imageAlt: 'Eco volunteers cleaning coastal plastic trash',
      title: 'Wolontariat na rzecz czystego środowiska (Coastal Cleanup Action)',
      situation: 'Wolontariusze zbierają plastikowe odpady na wybrzeżu morskim.',
      steps: [
        {
          stepName: 'Introduction',
          stepNamePl: 'Wstęp', stepNameRu: 'Вступление',
          description: 'Opis akcji sprzątania wybrzeża.',
          recommendedPhrases: ['In this inspiring photograph, volunteers are picking up litter...'],
          modelExample: 'In this inspiring photograph, dedicated volunteers are collecting discarded plastic trash along a sandy beach.'
        }
      ],
      examQuestions: [
        {
          questionNumber: 1,
          questionText: 'How effective are grassroot volunteer cleanup campaigns compared to state regulations?',
          questionTextPl: 'Jak skuteczna jest oddolna działalność wolontariuszy w porównaniu z przepisami państwowymi?', questionTextRu: 'Насколько эффективны низовые волонтёрские инициативы по сравнению с государственными законами?',
          hints: ['Grassroots educate, legislation stops corporations'],
          usefulPhrases: ['Volunteer drives raise civic awareness, yet legislation holds polluters accountable...'],
          modelAnswer: 'Volunteering fosters direct civic stewardship, though strict government penalties are necessary to rein in corporate pollution.'
        },
        {
          questionNumber: 2,
          questionText: 'What eco-friendly habits do you maintain in your daily life?',
          questionTextPl: 'Jakie nawyki proekologiczne stosujesz w życiu codziennym?', questionTextRu: 'Какие экологические привычки ты применяешь в повседневной жизни?',
          hints: ['Recycling, reusable water bottles, public transit'],
          usefulPhrases: ['I consistently sort waste and carry reusable canvas bags...'],
          modelAnswer: 'I always carry a reusable water flask, sort household waste meticulously, and commute by bicycle whenever possible.'
        },
        {
          questionNumber: 3,
          questionText: 'Are you optimistic about humanity reversing climate change before 2050?',
          questionTextPl: 'Czy z optymizmem patrzysz na szanse zatrzymania zmian klimatycznych przed 2050 rokiem?', questionTextRu: 'С оптимизмом ли ты смотришь на шансы остановить изменение климата до 2050 года?',
          hints: ['Renewable energy pace vs political inertia'],
          usefulPhrases: ['Solar and wind innovations offer hope, provided political willpower follows...'],
          modelAnswer: 'I remain cautiously optimistic because green technology is scaling rapidly, though systemic political transformation must accelerate.'
        }
      ],
      fullModelAnswer: 'This image serves as a powerful reminder of our collective ecological responsibility to protect our shared planet.'
    },
    testQuestions: [
      {
        id: 'prz-t1',
        type: 'key-word-transformation',
        prompt: 'Przekształć zdanie warunkowe z inwersją formalną (2 do 5 słów):',
        sentencePrefix: 'If we had protected the wetlands earlier, these birds would not be extinct now. (HAD)\n',
        sentenceSuffix: ' the wetlands earlier, these birds would not be extinct now.',
        targetWord: 'HAD',
        correctAnswers: ['Had we protected'],
        explanation: 'Inwersja warunkowa (Third Conditional Inversion): Had + podmiot + past participle zamiast If + podmiot + had.',
        level: 'Rozszerzony'
      }
    ],
    grammarRules: [
      {
        id: 'prz-g1',
        title: 'Mieszane okresy warunkowe (Mixed Conditionals: Past cause -> Present result)',
        level: 'R',
        formula: 'If + Past Perfect (przeszłość), would + infinitive (teraźniejszość)',
        ruleSummary: 'Łączy przeszłe niespełnione warunki z ich obecnymi konsekwencjami.',
        examples: [
          { english: 'If humanity had transitioned to solar earlier, our cities would not be choked with smog today.', polish: 'Gdyby ludzkość wcześniej przeszła na energię słoneczną, nasze miasta nie dusiłyby się dziś w smogu.', russian: 'Если бы человечество раньше перешло на солнечную энергию, наши города сегодня не задыхались бы от смога.' }
        ]
      }
    ],
    vocabularyList: [
      { id: 'przv-1', english: 'carbon footprint', polish: 'ślad węglowy', russian: 'углеродный след', category: 'Ekologia', level: 'P', example: 'Taking trains rather than domestic flights drastically reduces your carbon footprint.' }
    ],
    writingPrompt: {
      type: 'Rozprawka',
      level: 'Rozszerzony',
      title: 'Energia jądrowa: konieczny ratunek dla klimatu czy niebezpieczny kompromis?',
      taskPrompt: 'Napisz rozprawkę, w której przedstawisz zalety i zagrożenia związane z budową elektrowni jądrowych jako rozwiązania problemu kryzysu energetycznego.',
      wordLimit: { min: 200, max: 250 },
      bulletPoints: ['Zerowa emisja CO2 i stabilność dostaw', 'Problem odpadów radioaktywnych i ryzyko awarii', 'Własne podsumowanie'],
      usefulPhrases: ['Nuclear power offers carbon-free baseload energy...', 'Conversely, radioactive waste disposal remains a fraught dilemma...'],
      samplePlan: ['Wstęp', 'Argumenty za', 'Argumenty przeciw', 'Wnioski'],
      modelAnswer: 'The urgent imperative to decarbonize the global energy grid has reignited heated discussions over the role of nuclear fission.'
    }
  },
  {
    id: 'panstwo-spoleczenstwo',
    number: 14,
    titlePl: 'Państwo i społeczeństwo',
    titleEn: 'State & Society',
    shortDescription: 'Prawo, instytucje demokratyczne, prawa człowieka, migracje, wybory i solidarność.',
    iconName: 'Landmark',
    badge: 'B2+',
    subtopics: ['Systemy polityczne i wybory', 'Prawa człowieka i wymiar sprawiedliwości', 'Organizacje pozarządowe i pomoc charytatywna', 'Konflikty zbrojne, imigracja i globalizacja'],
    grammarSummary: 'Ograniczająca inwersja stylistyczna (Not only did... / Seldom have...), tryb łączący (Subjunctive: demand that it be done).',
    flashcards: [
      {
        id: 'pan-1',
        front: 'civic engagement',
        phonetic: '/ˈsɪv.ɪk ɪnˈɡeɪdʒ.mənt/',
        partOfSpeech: 'noun',
        backMeaningPl: 'zaangażowanie obywatelskie', backMeaningRu: 'гражданская активность',
        backMeaningEn: 'individual and collective actions designed to identify and address issues of public concern',
        exampleSentence: 'A healthy democracy relies upon vigorous civic engagement and free speech.',
        category: 'Społeczeństwo'
      }
    ],
    pictureDescription: {
      imageSrc: '/images/matura_city_tourists.png',
      imageAlt: 'Citizens gathering in historic civic square',
      title: 'Obywatele na placu miejskim przed gmachem publicznym (Civic Gathering)',
      situation: 'Obywatele gromadzą się na placu przed gmachem instytucji publicznej, dyskutując o sprawach społecznych.',
      steps: [
        {
          stepName: 'Introduction',
          stepNamePl: 'Wstęp', stepNameRu: 'Вступление',
          description: 'Przedstawienie przestrzeni obywatelskiej.',
          recommendedPhrases: ['In this image, citizens are assembled in a historic town square...'],
          modelExample: 'In this image, citizens are gathered outdoors in front of a majestic public building in a historic city centre.'
        }
      ],
      examQuestions: [
        {
          questionNumber: 1,
          questionText: 'Why is freedom of speech and peaceful assembly essential in a democratic society?',
          questionTextPl: 'Dlaczego wolność słowa i pokojowych zgromadzeń są fundamentalne w społeczeństwie demokratycznym?', questionTextRu: 'Почему свобода слова и мирных собраний являются основополагающими в демократическом обществе?',
          hints: ['Accountability of leaders, protection of minority rights'],
          usefulPhrases: ['Freedom of expression ensures politicians remain accountable...'],
          modelAnswer: 'Freedom of assembly allows ordinary citizens to voice dissent, hold leaders accountable, and champion societal reform.'
        },
        {
          questionNumber: 2,
          questionText: 'Have you ever taken part in a charity drive or school student council initiative?',
          questionTextPl: 'Czy brałeś/aś kiedykolwiek udział w zbiórce charytatywnej lub samorządzie szkolnym?', questionTextRu: 'Участвовал(а) ли ты когда-нибудь в благотворительном сборе или школьном самоуправлении?',
          hints: ['Collecting clothes or books, volunteering'],
          usefulPhrases: ['Last winter, our school council organized a food drive for local shelters...'],
          modelAnswer: 'Last December, I volunteered with our student council to collect warm clothing and food supplies for a local community shelter.'
        },
        {
          questionNumber: 3,
          questionText: 'Should the legal voting age be lowered to 16? Why or why not?',
          questionTextPl: 'Czy wiek uprawniający do głosowania powinien zostać obniżony do 16 lat? Dlaczego?', questionTextRu: 'Следует ли снизить возраст для голосования до 16 лет? Почему?',
          hints: ['Maturity and tax paying vs political manipulation'],
          usefulPhrases: ['Sixteen-year-olds are directly impacted by education and climate policy...'],
          modelAnswer: 'Yes, sixteen-year-olds pay taxes on part-time wages and are heavily affected by policies, so giving them a vote fosters early democratic habits.'
        }
      ],
      fullModelAnswer: 'This image highlights democracy in action and the vital bond between citizens and civic architecture.'
    },
    testQuestions: [
      {
        id: 'pan-t1',
        type: 'key-word-transformation',
        prompt: 'Przekształć zdanie z użyciem inwersji przeczącej (2 do 5 słów):',
        sentencePrefix: 'Citizens rarely participate so passionately in local elections. (SELDOM)\n',
        sentenceSuffix: ' so passionately in local elections.',
        targetWord: 'SELDOM',
        correctAnswers: ['Seldom do citizens participate'],
        explanation: 'Inwersja ze słowem Seldom: Seldom + operator do/does/did + podmiot + czasownik.',
        level: 'Rozszerzony'
      }
    ],
    grammarRules: [
      {
        id: 'pan-g1',
        title: 'Formalna inwersja przecząca: Not only... but also / Seldom / Under no circumstances',
        level: 'R',
        formula: 'Negative Adverbial + Auxiliary Verb + Subject + Main Verb',
        ruleSummary: 'Wymagana na poziomie rozszerzonym w esejach formalnych oraz zadaniach transformacji CKE.',
        examples: [
          { english: 'Under no circumstances should basic civil liberties be curtailed.', polish: 'W żadnym wypadku nie wolno ograniczać podstawowych swobód obywatelskich.', russian: 'Ни при каких обстоятельствах нельзя ограничивать основные гражданские свободы.' }
        ]
      }
    ],
    vocabularyList: [
      { id: 'panv-1', english: 'referendum', polish: 'referendum, głosowanie powszechne', russian: 'референдум, всенародное голосование', category: 'Polityka', level: 'P', example: 'The citizens demanded a nationwide referendum.' }
    ],
    writingPrompt: {
      type: 'Rozprawka',
      level: 'Rozszerzony',
      title: 'Obowiązkowy udział w wyborach: wzmocnienie demokracji czy ograniczenie wolności?',
      taskPrompt: 'W niektórych krajach głosowanie w wyborach jest obowiązkowe pod groźbą grzywny. Napisz rozprawkę, w której przedstawisz zalety i wady wprowadzenia przymusu wyborczego.',
      wordLimit: { min: 200, max: 250 },
      bulletPoints: ['Wysoka frekwencja i legitymizacja władzy', 'Karanie obywateli i przypadkowe głosy', 'Podsumowanie'],
      usefulPhrases: ['Mandatory voting ensures high democratic turnout...', 'On the other hand, compelled participation violates personal liberty...'],
      samplePlan: ['Wstęp', 'Argumenty za', 'Argumenty przeciw', 'Wnioski'],
      modelAnswer: 'Compulsory voting remains one of the most polarizing concepts in political science, pitting the civic obligation to participate against fundamental freedom of choice.'
    }
  }
];
