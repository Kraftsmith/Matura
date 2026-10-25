import type { MaturaModule } from '../../types';

export const module1Czlowiek: MaturaModule = {
  id: 'czlowiek',
  number: 1,
  titlePl: 'Człowiek',
  titleEn: 'Human / People',
  shortDescription: 'Dane osobowe, wygląd zewnętrzny, cechy charakteru, uczucia i emocje, zainteresowania oraz autorytety.',
  iconName: 'User',
  badge: 'B1+',
  subtopics: [
    'Dane osobowe i okresy życia',
    'Wygląd zewnętrzny i ubrania',
    'Cechy charakteru i osobowość',
    'Uczucia, emocje i mowa ciała',
    'Umiejętności, zainteresowania i autorytety'
  ],
  grammarSummary: 'Present Simple vs Continuous (stative verbs), used to / get used to + -ing, kolejność przymiotników, zdania rozszczepione (cleft sentences).',
  
  // ==========================================
  // FISZKI (FLASHCARDS)
  // ==========================================
  flashcards: [
    {
      id: 'czl-1',
      front: 'conscientious',
      phonetic: '/ˌkɒn.ʃiˈen.ʃəs/',
      partOfSpeech: 'adjective',
      backMeaningPl: 'sumienny, skrupulatny', backMeaningRu: 'добросовестный, скрупулёзный',
      backMeaningEn: 'putting a lot of effort into your work and doing things carefully and correctly',
      exampleSentence: 'Julia is a conscientious student who always double-checks her essays before submitting them.',
      exampleTranslation: 'Julia jest sumienną uczennicą, która zawsze sprawdza swoje wypracowania przed oddaniem.', exampleTranslationRu: 'Юлия — добросовестная ученица, которая всегда перепроверяет свои сочинения перед сдачей.',
      derivatives: ['conscientiousness (rzeczownik)', 'conscientiously (przysłówek)', 'conscience (sumienie)'],
      collocations: ['conscientious worker', 'conscientious approach', 'conscientious objector'],
      category: 'Cechy charakteru'
    },
    {
      id: 'czl-2',
      front: 'trustworthy',
      phonetic: '/ˈtrʌstˌwɜː.ði/',
      partOfSpeech: 'adjective',
      backMeaningPl: 'godny zaufania, niezawodny', backMeaningRu: 'заслуживающий доверия, надёжный',
      backMeaningEn: 'able to be relied on as honest or truthful',
      exampleSentence: 'If you want a trustworthy friend to keep your secrets, Mark is the ideal person.',
      exampleTranslation: 'Jeśli szukasz godnego zaufania przyjaciela, który zachowa twoje sekrety, Mark jest idealną osobą.', exampleTranslationRu: 'Если ты ищешь надёжного друга, который сохранит твои секреты, Марк — идеальный человек.',
      derivatives: ['untrustworthy (antonim)', 'trustworthiness (rzeczownik)'],
      collocations: ['trustworthy source', 'trustworthy partner', 'prove trustworthy'],
      category: 'Cechy charakteru'
    },
    {
      id: 'czl-3',
      front: 'absent-minded',
      phonetic: '/ˌæb.səntˈmaɪn.dɪd/',
      partOfSpeech: 'adjective',
      backMeaningPl: 'roztargniony, zapominalski', backMeaningRu: 'рассеянный, забывчивый',
      backMeaningEn: 'so lost in thought that one does not notice what one is doing or what is happening around',
      exampleSentence: 'The professor is notoriously absent-minded; he often forgets where he left his glasses.',
      exampleTranslation: 'Profesor jest powszechnie znany z roztargnienia; często zapomina, gdzie położył okulary.', exampleTranslationRu: 'Профессор известен своей рассеянностью; он часто забывает, куда положил очки.',
      derivatives: ['absent-mindedness (rzeczownik)', 'absent-mindedly (przysłówek)'],
      collocations: ['absent-minded professor', 'absent-minded smile'],
      category: 'Cechy charakteru'
    },
    {
      id: 'czl-4',
      front: 'stubborn',
      phonetic: '/ˈstʌb.ən/',
      partOfSpeech: 'adjective',
      backMeaningPl: 'uparty, nieustępliwy', backMeaningRu: 'упрямый, несговорчивый',
      backMeaningEn: 'determined not to change your opinion or attitude despite good reasons to do so',
      exampleSentence: 'He is as stubborn as a mule and will never admit he was mistaken.',
      exampleTranslation: 'Jest uparty jak osioł i nigdy nie przyzna, że się pomylił.', exampleTranslationRu: 'Он упрям как осёл и никогда не признает, что ошибся.',
      derivatives: ['stubbornness (rzeczownik)', 'stubbornly (przysłówek)'],
      collocations: ['stubborn as a mule', 'stubborn refusal', 'stubborn habit'],
      category: 'Cechy charakteru'
    },
    {
      id: 'czl-5',
      front: 'look up to',
      phonetic: '/lʊk ʌp tuː/',
      partOfSpeech: 'phrasal_verb',
      backMeaningPl: 'podziwiać kogoś, brać z kogoś przykład', backMeaningRu: 'восхищаться кем-либо, брать с кого-либо пример',
      backMeaningEn: 'to admire and have a great deal of respect for someone',
      exampleSentence: 'Many teenagers look up to athletes and try to emulate their hard work.',
      exampleTranslation: 'Wielu nastolatków podziwia sportowców i stara się naśladować ich ciężką pracę.', exampleTranslationRu: 'Многие подростки восхищаются спортсменами и стараются подражать их упорному труду.',
      derivatives: ['look down on (antonim: patrzeć z góry na)'],
      collocations: ['look up to older siblings', 'look up to role models'],
      category: 'Autorytety'
    },
    {
      id: 'czl-6',
      front: 'take after',
      phonetic: '/teɪk ˈɑːf.tər/',
      partOfSpeech: 'phrasal_verb',
      backMeaningPl: 'być podobnym do (odziedziczyć cechy po kimś z rodziny)', backMeaningRu: 'быть похожим на (унаследовать черты от кого-либо из семьи)',
      backMeaningEn: 'to resemble an older relative in appearance or character',
      exampleSentence: 'In terms of patience and musical talent, she definitely takes after her grandmother.',
      exampleTranslation: 'Jeśli chodzi o cierpliwość i talent muzyczny, zdecydowanie wdała się w babcię.', exampleTranslationRu: 'Что касается терпения и музыкального таланта, она определённо пошла в бабушку.',
      collocations: ['take after one’s father', 'take after in temperament'],
      category: 'Rodzina i charakter'
    },
    {
      id: 'czl-7',
      front: 'see eye to eye',
      phonetic: '/siː aɪ tuː aɪ/',
      partOfSpeech: 'idiom',
      backMeaningPl: 'zgadzać się w zupełności, mieć takie samo zdanie', backMeaningRu: 'полностью соглашаться, быть одного мнения',
      backMeaningEn: 'to agree fully with someone on a particular issue',
      exampleSentence: 'My parents and I do not always see eye to eye on my future career choices.',
      exampleTranslation: 'Moi rodzice i ja nie zawsze zgadzamy się w kwestii moich przyszłych wyborów zawodowych.', exampleTranslationRu: 'Мы с родителями не всегда сходимся во мнениях о моём будущем выборе профессии.',
      collocations: ['not see eye to eye with somebody', 'see eye to eye on politics'],
      category: 'Relacje i emocje'
    },
    {
      id: 'czl-8',
      front: 'bring up',
      phonetic: '/brɪŋ ʌp/',
      partOfSpeech: 'phrasal_verb',
      backMeaningPl: 'wychowywać (dziecko); poruszać temat', backMeaningRu: 'воспитывать (ребёнка); поднимать тему',
      backMeaningEn: 'to care for a child until it is an adult; to mention a topic',
      exampleSentence: 'She was brought up in a bilingual household by very supportive parents.',
      exampleTranslation: 'Została wychowana w dwujęzycznym domu przez bardzo wspierających rodziców.', exampleTranslationRu: 'Она выросла в двуязычной семье, где родители её всегда поддерживали.',
      derivatives: ['upbringing (rzeczownik: wychowanie)'],
      collocations: ['strict upbringing', 'bring up a subject', 'well brought up'],
      category: 'Okresy życia'
    },
    {
      id: 'czl-9',
      front: 'self-conscious',
      phonetic: '/ˌselfˈkɒn.ʃəs/',
      partOfSpeech: 'adjective',
      backMeaningPl: 'skrępowany, niepewny siebie, zakompleksiony', backMeaningRu: 'стеснительный, неуверенный в себе, закомплексованный',
      backMeaningEn: 'uncomfortable because you are worried about what other people think about you',
      exampleSentence: 'He felt self-conscious about wearing braces in his first year of secondary school.',
      exampleTranslation: 'Czuł się skrępowany noszeniem aparatu na zęby w pierwszej klasie liceum.', exampleTranslationRu: 'В первом классе лицея он стеснялся носить брекеты.',
      derivatives: ['self-consciousness (rzeczownik)'],
      collocations: ['feel self-conscious', 'self-conscious smile'],
      category: 'Uczucia i emocje'
    },
    {
      id: 'czl-10',
      front: 'down-to-earth',
      phonetic: '/ˌdaʊn.tuˈɜːθ/',
      partOfSpeech: 'adjective',
      backMeaningPl: 'twardo stąpający po ziemi, praktyczny, bezpretensjonalny', backMeaningRu: 'твёрдо стоящий на ногах, практичный, без претензий',
      backMeaningEn: 'practical, realistic, and with no illusions or pretensions',
      exampleSentence: 'Despite her international fame as an author, she remains remarkably down-to-earth.',
      exampleTranslation: 'Pomimo międzynarodowej sławy jako pisarka, pozostaje niezwykle twardo stąpająca po ziemi.', exampleTranslationRu: 'Несмотря на международную известность как писательницы, она остаётся на редкость приземлённой.',
      collocations: ['down-to-earth attitude', 'down-to-earth advice'],
      category: 'Cechy charakteru'
    },
    {
      id: 'czl-11',
      front: 'open-minded',
      phonetic: '/ˌəʊ.pənˈmaɪn.dɪd/',
      partOfSpeech: 'adjective',
      backMeaningPl: 'otwarty na nowe idee, wolny od uprzedzeń', backMeaningRu: 'открытый новым идеям, свободный от предрассудков',
      backMeaningEn: 'willing to consider new ideas, opinions, and experiences',
      exampleSentence: 'Travelling abroad teaches young people to be more open-minded and tolerant.',
      exampleTranslation: 'Podróżowanie za granicę uczy młodych ludzi bycia bardziej otwartymi i tolerancyjnymi.', exampleTranslationRu: 'Поездки за границу учат молодых людей быть более открытыми и терпимыми.',
      derivatives: ['narrow-minded (antonim)', 'open-mindedness (rzeczownik)'],
      collocations: ['open-minded approach', 'remain open-minded'],
      category: 'Cechy charakteru'
    },
    {
      id: 'czl-12',
      front: 'gullible',
      phonetic: '/ˈɡʌl.ə.bəl/',
      partOfSpeech: 'adjective',
      backMeaningPl: 'łatwowierny, naiwny', backMeaningRu: 'легковерный, наивный',
      backMeaningEn: 'easily deceived or tricked because of believing everything that is said',
      exampleSentence: 'Fake news campaigns tend to prey on gullible internet users.',
      exampleTranslation: 'Kampanie fałszywych wiadomości zazwyczaj polują na łatwowiernych internautów.', exampleTranslationRu: 'Кампании фейковых новостей обычно охотятся на легковерных пользователей интернета.',
      derivatives: ['gullibility (rzeczownik)'],
      collocations: ['gullible victim', 'naive and gullible'],
      category: 'Cechy charakteru'
    },
    {
      id: 'czl-13',
      front: 'complexion',
      phonetic: '/kəmˈplek.ʃən/',
      partOfSpeech: 'noun',
      backMeaningPl: 'karnacja, cera', backMeaningRu: 'цвет лица, кожа лица',
      backMeaningEn: 'the natural appearance, skin colour and texture of the face',
      exampleSentence: 'Staying hydrated and using sunscreen helps to maintain a healthy, glowing complexion.',
      exampleTranslation: 'Nawadnianie organizmu i stosowanie kremu z filtrem pomaga utrzymać zdrową, promienną cerę.', exampleTranslationRu: 'Достаточное питьё и солнцезащитный крем помогают сохранить здоровую, сияющую кожу.',
      collocations: ['pale complexion', 'fair complexion', 'flawless complexion', 'dark complexion'],
      category: 'Wygląd zewnętrzny'
    },
    {
      id: 'czl-14',
      front: 'freckles',
      phonetic: '/ˈfrek.əlz/',
      partOfSpeech: 'noun',
      backMeaningPl: 'piegi', backMeaningRu: 'веснушки',
      backMeaningEn: 'small, pale brown spots on the skin, especially on face and arms, that darken in the sun',
      exampleSentence: 'Her face is dotted with charming freckles whenever she spends a weekend outdoors.',
      exampleTranslation: 'Jej twarz pokrywa się uroczymi piegami, ilekroć spędza weekend na świeżym powietrzu.', exampleTranslationRu: 'Её лицо покрывается милыми веснушками всякий раз, когда она проводит выходные на свежем воздухе.',
      derivatives: ['freckled (przymiotnik: piegowaty)'],
      collocations: ['sprinkling of freckles', 'freckled cheeks'],
      category: 'Wygląd zewnętrzny'
    },
    {
      id: 'czl-15',
      front: 'wrinkles',
      phonetic: '/ˈrɪŋ.kəlz/',
      partOfSpeech: 'noun',
      backMeaningPl: 'zmarszczki', backMeaningRu: 'морщины',
      backMeaningEn: 'small lines in the skin caused by old age or repeated facial expressions',
      exampleSentence: 'My grandfather has laughter wrinkles around his eyes that make him look very kind.',
      exampleTranslation: 'Mój dziadek ma wokół oczu zmarszczki od śmiechu, które sprawiają, że wygląda bardzo dobrodusznie.', exampleTranslationRu: 'У моего дедушки морщинки от смеха вокруг глаз, из-за которых он выглядит очень добродушным.',
      derivatives: ['wrinkled (przymiotnik: pomarszczony)'],
      collocations: ['facial wrinkles', 'iron out wrinkles', 'crow’s feet'],
      category: 'Wygląd zewnętrzny'
    },
    {
      id: 'czl-16',
      front: 'slender',
      phonetic: '/ˈslen.dər/',
      partOfSpeech: 'adjective',
      backMeaningPl: 'smukły, szczupły (w pozytywnym sensie)', backMeaningRu: 'стройный, худощавый (в положительном смысле)',
      backMeaningEn: 'thin in an attractive or graceful way',
      exampleSentence: 'The ballerina had a slender, athletic build and graceful posture.',
      exampleTranslation: 'Baletnica miała smukłą, wysportowaną sylwetkę i pełną gracji postawę.', exampleTranslationRu: 'У балерины была стройная спортивная фигура и грациозная осанка.',
      derivatives: ['slenderness (rzeczownik)'],
      collocations: ['slender waist', 'slender fingers', 'slender build'],
      category: 'Wygląd zewnętrzny'
    },
    {
      id: 'czl-17',
      front: 'stocky',
      phonetic: '/ˈstɒk.i/',
      partOfSpeech: 'adjective',
      backMeaningPl: 'krępy, przysadzisty', backMeaningRu: 'коренастый, приземистый',
      backMeaningEn: 'short, solid, and strongly built',
      exampleSentence: 'The rugby player had a stocky build with broad shoulders and strong legs.',
      exampleTranslation: 'Gracz rugby miał krępą budowę ciała z szerokimi ramionami i mocnymi nogami.', exampleTranslationRu: 'У регбиста было коренастое телосложение с широкими плечами и сильными ногами.',
      collocations: ['stocky build', 'stocky frame', 'short and stocky'],
      category: 'Wygląd zewnętrzny'
    },
    {
      id: 'czl-18',
      front: 'vain',
      phonetic: '/veɪn/',
      partOfSpeech: 'adjective',
      backMeaningPl: 'próżny, zadufany w sobie', backMeaningRu: 'тщеславный, самодовольный',
      backMeaningEn: 'too interested in your own appearance or other people’s opinion of you',
      exampleSentence: 'He is far too vain to wear reading glasses in public.',
      exampleTranslation: 'Jest zbyt próżny, by nosić okulary do czytania w miejscach publicznych.', exampleTranslationRu: 'Он слишком тщеславен, чтобы носить очки для чтения на людях.',
      derivatives: ['vanity (rzeczownik: próżność)'],
      collocations: ['vain attempt', 'vanity mirror', 'vain person'],
      category: 'Cechy charakteru'
    },
    {
      id: 'czl-19',
      front: 'empathy',
      phonetic: '/ˈem.pə.θi/',
      partOfSpeech: 'noun',
      backMeaningPl: 'empatia, współodczuwanie', backMeaningRu: 'эмпатия, сопереживание',
      backMeaningEn: 'the ability to share someone else’s feelings or experiences by imagining what it would be like',
      exampleSentence: 'A good doctor must combine technical medical knowledge with genuine empathy.',
      exampleTranslation: 'Dobry lekarz musi łączyć techniczną wiedzę medyczną z autentyczną empatią.', exampleTranslationRu: 'Хороший врач должен сочетать медицинские знания с искренней эмпатией.',
      derivatives: ['empathise (czasownik)', 'empathetic / empathic (przymiotnik)'],
      collocations: ['feel empathy towards', 'lack empathy', 'demonstrate empathy'],
      category: 'Cechy charakteru'
    },
    {
      id: 'czl-20',
      front: 'shrug one’s shoulders',
      phonetic: '/ʃrʌɡ wʌnz ˈʃəʊl.dəz/',
      partOfSpeech: 'idiom',
      backMeaningPl: 'wzruszyć ramionami', backMeaningRu: 'пожать плечами',
      backMeaningEn: 'to raise your shoulders and then lower them in order to say you do not know or do not care',
      exampleSentence: 'When asked where the car keys were, he simply shrugged his shoulders.',
      exampleTranslation: 'Zapytany, gdzie są kluczyki do samochodu, po prostu wzruszył ramionami.', exampleTranslationRu: 'Когда его спросили, где ключи от машины, он просто пожал плечами.',
      category: 'Mowa ciała'
    },
    {
      id: 'czl-21',
      front: 'frown',
      phonetic: '/fraʊn/',
      partOfSpeech: 'verb',
      backMeaningPl: 'marszczyć brwi, krzywić się z dezaprobatą', backMeaningRu: 'хмурить брови, морщиться с неодобрением',
      backMeaningEn: 'to bring your eyebrows together so that there are lines on your face, showing anger or worry',
      exampleSentence: 'The teacher frowned as she noticed several mistakes in the introductory paragraph.',
      exampleTranslation: 'Nauczycielka zmarszczyła brwi, gdy zauważyła kilka błędów w akapicie wstępnym.', exampleTranslationRu: 'Учительница нахмурилась, заметив несколько ошибок во вступительном абзаце.',
      derivatives: ['frown upon (nie pochwalać czegoś)'],
      collocations: ['frown in confusion', 'deep frown', 'frown upon bad behaviour'],
      category: 'Mowa ciała'
    },
    {
      id: 'czl-22',
      front: 'indecisive',
      phonetic: '/ˌɪn.dɪˈsaɪ.sɪv/',
      partOfSpeech: 'adjective',
      backMeaningPl: 'niezdecydowany, chwiejny', backMeaningRu: 'нерешительный, колеблющийся',
      backMeaningEn: 'not good at making decisions or unable to make a decision quickly',
      exampleSentence: 'Being indecisive can cause you to miss great career opportunities.',
      exampleTranslation: 'Bycie niezdecydowanym może sprawić, że przegapisz wspaniałe okazje zawodowe.', exampleTranslationRu: 'Нерешительность может стоить тебе отличных карьерных возможностей.',
      derivatives: ['decisive (zdecydowany)', 'indecision (rzeczownik)', 'decide (czasownik)'],
      collocations: ['indecisive leader', 'remain indecisive'],
      category: 'Cechy charakteru'
    },
    {
      id: 'czl-23',
      front: 'quick-tempered',
      phonetic: '/ˌkwɪkˈtem.pəd/',
      partOfSpeech: 'adjective',
      backMeaningPl: 'porywczy, wybuchowy', backMeaningRu: 'вспыльчивый, взрывной',
      backMeaningEn: 'becoming angry very easily and quickly',
      exampleSentence: 'He is generally generous, but can be quick-tempered when under extreme pressure.',
      exampleTranslation: 'Na ogół jest hojny, ale bywa porywczy, gdy znajduje się pod silną presją.', exampleTranslationRu: 'Обычно он щедр, но бывает вспыльчивым, когда находится под сильным давлением.',
      derivatives: ['bad-tempered', 'good-tempered', 'even-tempered'],
      collocations: ['quick-tempered individual', 'lose one’s temper'],
      category: 'Cechy charakteru'
    },
    {
      id: 'czl-24',
      front: 'ecstatic',
      phonetic: '/ɪkˈstæt.ɪk/',
      partOfSpeech: 'adjective',
      backMeaningPl: 'zachwycony, wniebowzięty, rozentuzjazmowany', backMeaningRu: 'в восторге, на седьмом небе, воодушевлённый',
      backMeaningEn: 'extremely happy and excited',
      exampleSentence: 'She was ecstatic when she learned that she had achieved 100% on her English Matura exam.',
      exampleTranslation: 'Była zachwycona, gdy dowiedziała się, że zdobyła 100% z matury z języka angielskiego.', exampleTranslationRu: 'Она была в восторге, узнав, что набрала 100% на экзамене по английскому.',
      derivatives: ['ecstasy (rzeczownik)'],
      collocations: ['ecstatic fans', 'ecstatic crowd', 'absolutely ecstatic'],
      category: 'Uczucia i emocje'
    },
    {
      id: 'czl-25',
      front: 'apprehensive',
      phonetic: '/ˌæp.rɪˈhen.sɪv/',
      partOfSpeech: 'adjective',
      backMeaningPl: 'pełen obaw, niespokojny, lękliwy', backMeaningRu: 'полный опасений, тревожный, боязливый',
      backMeaningEn: 'feeling worried or nervous about something that might happen in the future',
      exampleSentence: 'Many students feel apprehensive about speaking English in front of an examiner.',
      exampleTranslation: 'Wielu uczniów odczuwa niepokój przed mówieniem po angielsku w obecności egzaminatora.', exampleTranslationRu: 'Многие ученики испытывают тревогу перед тем, как говорить по-английски в присутствии экзаменатора.',
      derivatives: ['apprehension (rzeczownik)', 'apprehensively (przysłówek)'],
      collocations: ['feel apprehensive about', 'apprehensive look'],
      category: 'Uczucia i emocje'
    }
  ],

  // ==========================================
  // OPIS ILUSTRACJI (PICTURE DESCRIPTION)
  // ==========================================
  pictureDescription: {
    imageSrc: '/images/matura_04_family.jpg',
    imageAlt: 'Young couple and a woman cooking and preparing food together in a modern kitchen',
    title: 'Wspólne gotowanie i relacje domowe (Cooking and Relationships)',
    situation: 'Młodzi ludzie wspólnie przygotowują posiłek w nowoczesnej, jasnej kuchni.',
    steps: [
      {
        stepName: 'Introduction',
        stepNamePl: 'Wprowadzenie ogólne', stepNameRu: 'Общее вступление',
        description: 'Zacznij od jednego jasnego zdania określającego ogólny temat i nastrój zdjęcia.',
        recommendedPhrases: [
          'In this photograph, I can see...',
          'The picture depicts a group of young people...',
          'At first glance, the image shows...'
        ],
        modelExample: 'In this photograph, I can see a young man and woman happily cooking and preparing food together in a stylish, modern kitchen.'
      },
      {
        stepName: 'Where & Location',
        stepNamePl: 'Miejsce i tło', stepNameRu: 'Место и фон',
        description: 'Wskaż precyzyjnie miejsce (indoors/outdoors), pierwszy plan i elementy otoczenia.',
        recommendedPhrases: [
          'The scene is set indoors in a spacious...',
          'In the foreground, there is a large wooden kitchen island with...',
          'In the background, we can notice kitchen cabinets, white tiled walls and shelves...'
        ],
        modelExample: 'The scene is set indoors, in a bright and well-equipped kitchen. In the foreground, there is a wooden kitchen island with a turquoise cooking pot, olive oil, and glass jars. In the background, there are white subway tiles, wooden open shelves, and a microwave.'
      },
      {
        stepName: 'Who & Appearance',
        stepNamePl: 'Osoby i wygląd zewnętrzny', stepNameRu: 'Люди и внешность',
        description: 'Opisz wiek, wygląd, ubrania i charakterystyczne cechy postaci (fryzury, okulary).',
        recommendedPhrases: [
          'There are three people in the picture, seemingly in their twenties...',
          'The young man is wearing stylish glasses and a dark blue apron over a green T-shirt...',
          'The woman on the right has long dark hair and is wearing a cozy knitted sweater...'
        ],
        modelExample: 'There is a cheerful young man wearing stylish glasses and a dark apron over an olive T-shirt. Standing next to him is an attractive young woman with long dark wavy hair wearing a cozy cream knitted sweater. In the background, another person in a blue shirt is busy by the sink.'
      },
      {
        stepName: 'What they are doing (Present Continuous)',
        stepNamePl: 'Czynności w toku (Present Continuous)', stepNameRu: 'Действия в процессе (Present Continuous)',
        description: 'Używaj wyłącznie czasu Present Continuous do opisywania wykonywanych czynności.',
        recommendedPhrases: [
          'The man is tasting the soup using a wooden spoon...',
          'The woman is leaning against the counter and smiling warmly...',
          'They are cooperating and chatting while preparing a home-cooked meal...'
        ],
        modelExample: 'The young man is carefully holding a spoon to taste whatever they are cooking in the pot, while the young woman is holding a jar and smiling warmly at him. They appear to be sharing a friendly conversation and cooperating smoothly.'
      },
      {
        stepName: 'Atmosphere & Deductions',
        stepNamePl: 'Atmosfera i dedukcja', stepNameRu: 'Атмосфера и выводы',
        description: 'Wyraź domysły na temat relacji i nastroju, używając czasowników modalnych i zwrotów dedukcyjnych.',
        recommendedPhrases: [
          'Judging by their broad smiles, the atmosphere is relaxed, joyful and intimate...',
          'They might be a couple or close friends sharing an evening dinner...',
          'It looks as if they truly enjoy each other\'s company...'
        ],
        modelExample: 'Judging by their warm facial expressions, the atmosphere is pleasant, cozy, and relaxed. They might be a romantic couple or close flatmates enjoying quality time together while cooking dinner after a long day.'
      },
      {
        stepName: 'Conclusion & Personal Attitude',
        stepNamePl: 'Podsumowanie i opinia osobista', stepNameRu: 'Итог и личное мнение',
        description: 'Zakończ krótką refleksją lub powiązaniem z własnym doświadczeniem.',
        recommendedPhrases: [
          'Personally, I find this picture very heartwarming because...',
          'In my opinion, cooking together is one of the best ways to bond with loved ones...',
          'To sum up, the photograph highlights the beauty of simple daily moments...'
        ],
        modelExample: 'Personally, I find this picture very heartwarming because in my view, cooking together is one of the most effective and genuine ways to bond with people you care about.'
      }
    ],
    examQuestions: [
      {
        questionNumber: 1,
        questionText: 'Why do you think the people in the picture look so cheerful while preparing food?',
        questionTextPl: 'Dlaczego Twoim zdaniem osoby na zdjęciu wyglądają na tak radosne podczas przygotowywania jedzenia?', questionTextRu: 'Почему, по-твоему, люди на фото выглядят такими радостными, готовя еду?',
        hints: [
          'Cooking as a creative, fun hobby rather than a stressful chore',
          'Good company, emotional connection, and casual conversation',
          'Anticipation of eating a delicious, healthy meal together'
        ],
        usefulPhrases: [
          'In my opinion, preparing a meal together is...',
          'It is a great opportunity to catch up and unwind...',
          'They seem to perceive cooking not as a chore, but as quality time...'
        ],
        modelAnswer: 'In my opinion, they are cheerful because cooking together is not seen as an exhausting household chore, but rather as an enjoyable social activity. Being in good company allows them to relax, share laughs, and forget about everyday stress while looking forward to a tasty home-cooked meal.'
      },
      {
        questionNumber: 2,
        questionText: 'Tell me about a memorable meal or family celebration you took part in.',
        questionTextPl: 'Opowiedz o pamiętnym posiłku lub uroczystości rodzinnej, w której brałeś/brałaś udział.', questionTextRu: 'Расскажи о памятном ужине или семейном празднике, в котором ты участвовал(а).',
        hints: [
          'Name the occasion (e.g. Christmas Eve, birthday party, Sunday dinner)',
          'Mention who was there and what you ate',
          'Explain why it left a lasting positive impression on you'
        ],
        usefulPhrases: [
          'A memorable occasion that immediately comes to mind was...',
          'All my relatives gathered at my grandparents\' house...',
          'We talked for hours and the atmosphere was unforgettable...'
        ],
        modelAnswer: 'A memorable occasion that immediately comes to mind was my grandmother\'s 70th birthday last summer. All my extended family gathered in her garden for an open-air barbecue. We prepared traditional dishes, looked through vintage photo albums, and listened to family stories. What made it special was that relatives from abroad came over, so we hadn\'t seen each other in years.'
      },
      {
        questionNumber: 3,
        questionText: 'Do you agree that modern teenagers rely too much on takeaway food and should learn basic culinary skills? Why or why not?',
        questionTextPl: 'Czy zgadzasz się, że współcześni nastolatkowie w zbyt dużym stopniu polegają na jedzeniu na wynos i powinni uczyć się podstawowych umiejętności kulinarnych? Dlaczego?', questionTextRu: 'Согласен(на) ли ты, что современные подростки слишком полагаются на еду навынос и должны учиться основам кулинарии? Почему?',
        hints: [
          'Fast food vs nutrition and physical health',
          'Financial aspect: takeaways are significantly more expensive than cooking',
          'Independence and essential adult life skills'
        ],
        usefulPhrases: [
          'I wholeheartedly agree with this statement because...',
          'Relying on food delivery apps leads to unhealthy dietary habits...',
          'Cooking is an indispensable life skill that fosters self-reliance...'
        ],
        modelAnswer: 'I wholeheartedly agree that teenagers should learn how to cook. While food delivery apps offer convenient shortcuts, relying exclusively on takeaways often leads to consuming unhealthy amounts of salt, sugar, and processed ingredients. Furthermore, cooking at home saves a substantial amount of money and teaches independence, which is vital when moving away for university.'
      }
    ],
    fullModelAnswer: 'In this photograph, I can see a young man and woman happily cooking and preparing food together in a stylish, modern kitchen. The scene is set indoors, in a bright, well-equipped room with open wooden shelves and white tiled walls. In the foreground, on the wooden kitchen counter, there are colorful pots, jars, and bottles of olive oil. The man is wearing fashionable spectacles and a navy apron, and he is holding a spoon to taste the dish. The woman standing beside him has long dark hair, is dressed in a cozy cream sweater, and has a warm, radiant smile. Judging by their playful expressions, they are enjoying each other\'s company immensely. The atmosphere feels cozy, intimate, and harmonious. Personally, I really appreciate this scene because cooking together is a wonderful way to build meaningful relationships and relax.'
  },

  // ==========================================
  // INTERAKTYWNY TEST MODUŁU (15 PYTAŃ CKE)
  // ==========================================
  testQuestions: [
    {
      id: 'test-1',
      type: 'multiple-choice',
      prompt: 'Wybierz słowo, które poprawnie uzupełnia lukę w zdaniu:',
      sentencePrefix: 'I find it remarkable that despite her international fame, she has remained remarkably ',
      sentenceSuffix: ' and approachable.',
      options: ['down-to-earth', 'absent-minded', 'narrow-minded', 'quick-tempered'],
      correctAnswers: ['down-to-earth'],
      explanation: 'Wyrażenie "down-to-earth" oznacza "twardo stąpający po ziemi, skromny, bezpretensjonalny", co idealnie łączy się ze słowem "approachable" (przystępny, bezpośredni). Pozostałe opcje mają zabarwienie negatywne (roztargniony, ciasny umysłowo, porywczy).',
      level: 'Rozszerzony',
      grammarRef: {
        topic: 'Cechy charakteru i przymiotniki złożone'
      }
    },
    {
      id: 'test-2',
      type: 'word-formation',
      prompt: 'Uzupełnij lukę, przekształcając słowo w nawiasie tak, aby powstało poprawne zdanie:',
      sentencePrefix: 'Martin is an exceptionally ',
      sentenceSuffix: ' worker who never leaves tasks unfinished. (CONSCIENCE)',
      targetWord: 'CONSCIENCE',
      correctAnswers: ['conscientious'],
      explanation: 'Od rzeczownika "conscience" (sumienie) tworzymy przymiotnik "conscientious" (sumienny, rzetelny). Zwróć uwagę na pisownię "-tious".',
      level: 'Rozszerzony',
      grammarRef: {
        topic: 'Słowotwórstwo: tworzenie przymiotników od rzeczowników'
      }
    },
    {
      id: 'test-3',
      type: 'word-formation',
      prompt: 'Uzupełnij lukę, przekształcając słowo w nawiasie tak, aby powstało poprawne zdanie:',
      sentencePrefix: 'His constant ',
      sentenceSuffix: ' during meetings irritated his business partners. (DECIDE)',
      targetWord: 'DECIDE',
      correctAnswers: ['indecision', 'indecisiveness'],
      explanation: 'Po zaimku dzierżawczym i przymiotniku "constant" potrzebny jest rzeczownik o negatywnym zabarwieniu: "indecision" lub "indecisiveness" (niezdecydowanie).',
      level: 'Rozszerzony',
      grammarRef: {
        topic: 'Słowotwórstwo: przedrostki negatywne i rzeczowniki abstrakcyjne'
      }
    },
    {
      id: 'test-4',
      type: 'key-word-transformation',
      prompt: 'Wykorzystaj podane słowo, aby uzupełnić lukę tak, by zachować znaczenie zdania wyjściowego. Użyj od 2 do 5 słów, wliczając słowo kluczowe.',
      sentencePrefix: 'When she was a child, she had the habit of biting her nails when nervous. (USED)\nWhen she was a child, she ',
      sentenceSuffix: ' her nails when nervous.',
      targetWord: 'USED',
      correctAnswers: ['used to bite'],
      explanation: 'Konstrukcja "used to + bezokolicznik" opisuje przeszłe nawyki lub stany, które nie mają już miejsca ("used to bite").',
      level: 'Podstawowy',
      grammarRef: {
        topic: 'Used to dla przeszłych nawyków',
        ruleId: 'gram-2',
      }
    },
    {
      id: 'test-5',
      type: 'key-word-transformation',
      prompt: 'Wykorzystaj podane słowo, aby uzupełnić lukę tak, by zachować znaczenie zdania wyjściowego. Użyj od 2 do 5 słów.',
      sentencePrefix: 'Living in a bustling capital city is no longer strange or overwhelming to Mark. (GOT)\nMark has ',
      sentenceSuffix: ' in a bustling capital city.',
      targetWord: 'GOT',
      correctAnswers: ['got used to living'],
      explanation: 'Zwrot "get used to + gerund (-ing)" oznacza "przyzwyczaić się do czegoś". W czasie Present Perfect: "has got used to living".',
      level: 'Rozszerzony',
      grammarRef: {
        topic: 'Be / Get used to + Gerund (-ing)',
        ruleId: 'gram-2',
      }
    },
    {
      id: 'test-6',
      type: 'multiple-choice',
      prompt: 'Wybierz poprawną formę czasownika:',
      sentencePrefix: 'Why ',
      sentenceSuffix: ' at me like that? Have I said something offensive?',
      options: ['are you looking', 'do you look', 'did you look', 'have you looked'],
      correctAnswers: ['are you looking'],
      explanation: 'Czasownik "look" w znaczeniu dynamicznym ("patrzeć, spoglądać fizycznie w tej chwili") występuje w czasie Present Continuous ("are you looking"). Gdyby oznaczał stan ("wyglądać np. na zmęczonego"), byłby czasem Present Simple.',
      level: 'Podstawowy',
      grammarRef: {
        topic: 'Stative vs Dynamic Verbs',
        ruleId: 'gram-1',
      }
    },
    {
      id: 'test-7',
      type: 'translation',
      prompt: 'Przetłumacz fragment podany w nawiasie na język angielski:',
      sentencePrefix: 'My younger brother ',
      sentenceSuffix: ' (zawsze pożycza) my clothes without asking for my permission!',
      correctAnswers: ['is always borrowing', 'is constantly borrowing'],
      explanation: 'Konstrukcja "Present Continuous + always / constantly" służy do wyrażania irytacji lub zniecierpliwienia powtarzającymi się nawykami drugiej osoby ("is always borrowing").',
      level: 'Rozszerzony',
      grammarRef: {
        topic: 'Present Continuous do wyrażania irytacji z przysłówkiem always',
        ruleId: 'gram-1',
      }
    },
    {
      id: 'test-8',
      type: 'multiple-choice',
      prompt: 'Wskaż zdanie o poprawnej kolejności przymiotników opisujących wygląd:',
      sentencePrefix: 'She was wearing a ',
      sentenceSuffix: ' jacket at the party.',
      options: [
        'gorgeous modern black Italian leather',
        'leather gorgeous Italian black modern',
        'modern Italian gorgeous leather black',
        'black leather Italian modern gorgeous'
      ],
      correctAnswers: ['gorgeous modern black Italian leather'],
      explanation: 'Oficjalna reguła kolejności przymiotników w języku angielskim: Opinion (gorgeous) -> Age (modern) -> Colour (black) -> Origin (Italian) -> Material (leather).',
      level: 'Rozszerzony',
      grammarRef: {
        topic: 'Kolejność przymiotników przed rzeczownikiem (OSASCOMP)',
        ruleId: 'gram-3',
      }
    },
    {
      id: 'test-9',
      type: 'word-formation',
      prompt: 'Uzupełnij lukę, przekształcając słowo w nawiasie tak, aby powstało poprawne zdanie:',
      sentencePrefix: 'You shouldn\'t trust everything you read online; being too ',
      sentenceSuffix: ' can get you into trouble. (GULL)',
      targetWord: 'GULL',
      correctAnswers: ['gullible'],
      explanation: 'Od rdzenia tworzymy przymiotnik "gullible" (łatwowierny, naiwny).',
      level: 'Rozszerzony',
      grammarRef: {
        topic: 'Słowotwórstwo: przymiotniki z sufiksem -ible'
      }
    },
    {
      id: 'test-10',
      type: 'mini-dialogue',
      prompt: 'Uzupełnij brakującą wypowiedź w minidialogu, wybierając poprawną opcję:',
      sentencePrefix: 'X: Do you get along well with your stepbrother?\nY: Not really. We almost never ',
      sentenceSuffix: ' on anything.',
      options: ['see eye to eye', 'turn a blind eye', 'pull someone\'s leg', 'keep an eye out'],
      correctAnswers: ['see eye to eye'],
      explanation: 'Idiom "see eye to eye" oznacza "zgadzać się w zupełności". "Turn a blind eye" to przymykać oko, a "pull someone\'s leg" to nabierać kogoś.',
      level: 'Podstawowy',
      grammarRef: {
        topic: 'Idiomy relacji międzyludzkich'
      }
    },
    {
      id: 'test-11',
      type: 'key-word-transformation',
      prompt: 'Przekształć zdanie z użyciem podanego słowa klucza (od 2 do 5 słów):',
      sentencePrefix: 'I dislike his arrogance the most. (WHAT)\n',
      sentenceSuffix: ' is his arrogance.',
      targetWord: 'WHAT',
      correctAnswers: ['What I dislike the most', 'What I dislike most'],
      explanation: 'Zdanie rozszczepione (cleft sentence) z zaimkiem "What" służy do emfatycznego wyróżnienia elementu: "What I dislike the most is...".',
      level: 'Rozszerzony',
      grammarRef: {
        topic: 'Zdania rozszczepione (Cleft sentences) dla emfazy',
        ruleId: 'gram-4',
      }
    },
    {
      id: 'test-12',
      type: 'translation',
      prompt: 'Przetłumacz fragment zdania w nawiasie:',
      sentencePrefix: 'She resembles her grandmother so much that everyone says she ',
      sentenceSuffix: ' (wdała się w nią).',
      correctAnswers: ['takes after her'],
      explanation: 'Czasownik frazowy "take after somebody" oznacza "być podobnym do kogoś z rodziny / wdać się w kogoś". W czasie teraźniejszym 3. os. lp.: "takes after her".',
      level: 'Podstawowy',
      grammarRef: {
        topic: 'Phrasal verbs: take after'
      }
    },
    {
      id: 'test-13',
      type: 'word-formation',
      prompt: 'Uzupełnij lukę poprawną formą słowa w nawiasie:',
      sentencePrefix: 'Her grandfather is well known for his immense ',
      sentenceSuffix: ' and readiness to help neighbours. (GENEROUS)',
      targetWord: 'GENEROUS',
      correctAnswers: ['generosity'],
      explanation: 'Od przymiotnika "generous" tworzymy rzeczownik abstrakcyjny "generosity" (hojność, wspaniałomyślność).',
      level: 'Podstawowy',
      grammarRef: {
        topic: 'Słowotwórstwo: sufiks rzeczownikowy -ity'
      }
    },
    {
      id: 'test-14',
      type: 'multiple-choice',
      prompt: 'Wybierz opcję, która poprawnie uzupełnia lukę:',
      sentencePrefix: 'When she was rejected by her dream university, she was utterly ',
      sentenceSuffix: ' for weeks.',
      options: ['devastated', 'exhilarated', 'indifferent', 'flattered'],
      correctAnswers: ['devastated'],
      explanation: 'Słowo "devastated" oznacza "zdruzgotany, załamany emocjonalnie". Pozostałe oznaczają: podekscytowany (exhilarated), obojętny (indifferent), zaszczycony (flattered).',
      level: 'Rozszerzony',
      grammarRef: {
        topic: 'Przymiotniki określające silne stany emocjonalne'
      }
    },
    {
      id: 'test-15',
      type: 'translation',
      prompt: 'Przetłumacz fragment podany w nawiasie:',
      sentencePrefix: 'Do you mind ',
      sentenceSuffix: ' (że poczekasz) here while I talk to the coordinator?',
      correctAnswers: ['waiting'],
      explanation: 'Po czasowniku "mind" w konstrukcji "Do you mind...?" stosujemy formę gerund (-ing): "waiting".',
      level: 'Rozszerzony',
      grammarRef: {
        topic: 'Formy gerundialne po czasownikach takich jak mind, avoid, enjoy'
      }
    }
  ],

  // ==========================================
  // GRAMATYKA MODUŁU
  // ==========================================
  grammarRules: [
    {
      id: 'gram-1',
      title: 'Present Simple vs Present Continuous: Czasowniki statyczne i dynamiczne',
      level: 'P/R',
      formula: 'Stative (stan): Present Simple | Dynamic (czynność): Present Continuous',
      ruleSummary: 'Czasowniki opisujące zmysły, emocje i stan umysłu (np. see, hear, smell, taste, think, feel, look, appear, have) nie występują standardowo w czasie Continuous, chyba że opisują aktywną, fizyczną czynność w trakcie jej trwania.',
      examples: [
        {
          english: 'This soup tastes delicious. (Stan / smak potrawy)',
          polish: 'Ta zupa smakuje wyśmienicie.', russian: 'Этот суп на вкус превосходен.'
        },
        {
          english: 'The chef is tasting the soup to see if it needs salt. (Aktywna czynność)',
          polish: 'Szef kuchni próbuje zupy, aby sprawdzić, czy wymaga soli.', russian: 'Шеф-повар пробует суп, чтобы проверить, не нужно ли посолить.'
        },
        {
          english: 'I think you are right. (Opinia / przekonanie)',
          polish: 'Sądzę, że masz rację.', russian: 'Думаю, ты прав.'
        },
        {
          english: 'I am thinking about moving abroad next year. (Proces myślowy w toku)',
          polish: 'Rozważam / myślę o przeprowadzce za granicę w przyszłym roku.', russian: 'Я подумываю о переезде за границу в следующем году.'
        }
      ],
      maturaTrap: 'Uważaj na czasownik "look": "You look tired" (wyglądasz na zmęczonego — stan), ale "Why are you looking at me?" (dlaczego się na mnie patrzysz — czynność).'
    },
    {
      id: 'gram-2',
      title: 'Przeszłe nawyki i stany: used to vs would vs be/get used to',
      level: 'R',
      formula: 'used to + infinitive | would + infinitive (tylko czynności!) | be/get used to + -ing / noun',
      ruleSummary: 'Konstrukcja "used to" służy do opisywania zarówno przeszłych nawyków, jak i stanów, które już minęły. "Would" opisuje powtarzające się czynności z przeszłości, ale NIGDY stany (stative verbs)! Z kolei "be used to + -ing" oznacza "być przyzwyczajonym do czegoś", a "get used to + -ing" to proces przyzwyczajania się.',
      examples: [
        {
          english: 'I used to have long curly hair when I was younger. (Stan — NIE WOLNO użyć would!)',
          polish: 'Kiedy byłem młodszy, miałem długie kręcone włosy.', russian: 'Когда я был младше, у меня были длинные кудрявые волосы.'
        },
        {
          english: 'Every Sunday, my grandfather would take us to the amusement park. (Powtarzająca się czynność)',
          polish: 'W każdą niedzielę dziadek zabierał nas do wesołego miasteczka.', russian: 'Каждое воскресенье дедушка водил нас в парк аттракционов.'
        },
        {
          english: 'I am gradually getting used to waking up at 6 a.m. (Proces adaptacji)',
          polish: 'Stopniowo przyzwyczajam się do wstawania o 6 rano.', russian: 'Я постепенно привыкаю вставать в 6 утра.'
        }
      ],
      maturaTrap: 'Na maturze w transformacjach częstym błędem jest zapomnienie o końcówce -ing po "be/get used to". Pamiętaj: "get used to living", a nie "get used to live"!'
    },
    {
      id: 'gram-3',
      title: 'Kolejność przymiotników przed rzeczownikiem (OSASCOMP)',
      level: 'P/R',
      formula: 'Opinion -> Size -> Age -> Shape -> Colour -> Origin -> Material -> Purpose + Rzeczownik',
      ruleSummary: 'Gdy przed jednym rzeczownikiem stawiamy dwa lub więcej przymiotników, obowiązuje ścisły porządek logiczny.',
      examples: [
        {
          english: 'A charming (Opinion) tall (Size) young (Age) French (Origin) student.',
          polish: 'Czarujący wysoki młody francuski student.', russian: 'Очаровательный высокий молодой французский студент.'
        },
        {
          english: 'A pair of trendy (Opinion) black (Colour) leather (Material) boots.',
          polish: 'Para modnych czarnych skórzanych butów.', russian: 'Пара модных чёрных кожаных ботинок.'
        }
      ],
      maturaTrap: 'Zawsze opinia subiektywna (np. elegant, stunning, awful) stoi na samym początku przed cechami obiektywnymi.'
    },
    {
      id: 'gram-4',
      title: 'Zdania rozszczepione (Cleft sentences) w opisie ludzi',
      level: 'R',
      formula: 'It is/was [element] that/who... | What [podmiot] [czasownik] is/was [element]',
      ruleSummary: 'Zdania rozszczepione służą do silnego wyakcentowania konkretnej cechy lub osoby w wypracowaniu maturalnym.',
      examples: [
        {
          english: 'It was his outstanding honesty that made everyone respect him.',
          polish: 'To właśnie jego niezwykła uczciwość sprawiła, że wszyscy go szanowali.', russian: 'Именно его исключительная честность заставила всех его уважать.'
        },
        {
          english: 'What impressed me most about my role model was her determination.',
          polish: 'Tym, co najbardziej zaimponowało mi w moim autorytecie, była jej determinacja.', russian: 'Больше всего в моём кумире меня впечатлила её целеустремлённость.'
        }
      ],
      maturaTrap: 'Użycie zdań rozszczepionych w eseju lub artykule gwarantuje najwyższą punktację w kryterium bogactwa środków językowych (Range of Language).'
    }
  ],

  // ==========================================
  // SŁOWNICTWO (VOCABULARY LIST)
  // ==========================================
  vocabularyList: [
    { id: 'v-1', english: 'birthmark', polish: 'znamię, pieprzyk', russian: 'родимое пятно, родинка', category: 'Wygląd zewnętrzny', level: 'P', example: 'He has a tiny birthmark on his right shoulder.' },
    { id: 'v-2', english: 'resemblance', polish: 'podobieństwo', russian: 'сходство', category: 'Wygląd zewnętrzny', level: 'R', example: 'There is an uncanny resemblance between the two cousins.' },
    { id: 'v-3', english: 'broad-shouldered', polish: 'szeroki w ramionach', russian: 'широкоплечий', category: 'Wygląd zewnętrzny', level: 'P', example: 'Swimmers typically develop a broad-shouldered physique.' },
    { id: 'v-4', english: 'scruffy', polish: 'niechlujny, zaniedbany', russian: 'неряшливый, неухоженный', category: 'Wygląd zewnętrzny', level: 'P', example: 'He showed up to the meeting in a scruffy pair of jeans.' },
    { id: 'v-5', english: 'impeccable', polish: 'nienaganny, bez zarzutu', russian: 'безупречный, безукоризненный', category: 'Wygląd i maniery', level: 'R', example: 'Her taste in clothing is always impeccable.' },
    { id: 'v-6', english: 'temperament', polish: 'temperament, usposobienie', russian: 'темперамент, нрав', category: 'Cechy charakteru', level: 'P', example: 'She has a calm temperament and never panics.' },
    { id: 'v-7', english: 'hypocritical', polish: 'obłudny, hipokrytyczny', russian: 'лицемерный, двуличный', category: 'Cechy charakteru', level: 'R', example: 'It was hypocritical of him to criticise others for being late.' },
    { id: 'v-8', english: 'compassionate', polish: 'pełen współczucia, litościwy', russian: 'сострадательный, милосердный', category: 'Cechy charakteru', level: 'R', example: 'Volunteering requires a compassionate and patient attitude.' },
    { id: 'v-9', english: 'role model', polish: 'wzór do naśladowania, autorytet', russian: 'образец для подражания, авторитет', category: 'Autorytety', level: 'P', example: 'Teachers should strive to be inspiring role models for their pupils.' },
    { id: 'v-10', english: 'emulate', polish: 'naśladować, wzorować się na', russian: 'подражать, брать пример с', category: 'Autorytety', level: 'R', example: 'Young musicians often attempt to emulate their idols.' }
  ],

  // ==========================================
  // WYPOWIEDŹ PISEMNA (WRITING PROMPT)
  // ==========================================
  writingPrompt: {
    type: 'Rozprawka',
    level: 'Rozszerzony',
    title: 'Autorytety współczesnej młodzieży: celebryci czy naukowcy?',
    taskPrompt: 'Współczesna młodzież coraz częściej czerpie inspirację z mediów społecznościowych, traktując influencerów jako swoje główne autorytety życiowe. Napisz rozprawkę, w której przedstawisz dobre i złe strony uznawania internetowych celebrytów za wzorce do naśladowania przez nastolatków.',
    wordLimit: {
      min: 200,
      max: 250
    },
    bulletPoints: [
      'Wstęp: zdefiniowanie fenomenu influencerów jako nowych autorytetów',
      'Argumenty za: promowanie przedsiębiorczości, zdrowego stylu życia i autentyczności',
      'Argumenty przeciw: powierzchowność, promowanie konsumpcjonizmu i nierealistycznych standardów piękna',
      'Zakończenie: wyważone podsumowanie i własna opinia'
    ],
    usefulPhrases: [
      'It is widely acknowledged that...',
      'On the one hand, proponents argue that...',
      'On the other hand, a substantial drawback lies in...',
      'Consequently, young people may fall victim to...',
      'All things considered, I am inclined to believe that...'
    ],
    samplePlan: [
      'Introduction (35-45 słów): Teza wprowadzająca zarysowująca obecność influencerów w życiu młodzieży.',
      'Body Paragraph 1 (70-80 słów): Zalety — motywacja, rozwijanie pasji, dostępność wzorców.',
      'Body Paragraph 2 (70-80 słów): Wady — fałszywy obraz rzeczywistości, manipulacja komercyjna, presja rówieśnicza.',
      'Conclusion (35-45 słów): Wyważona synteza z podsumowaniem konieczności krytycznego myślenia.'
    ],
    modelAnswer: `In today's digital era, the nature of role models has undergone a profound transformation. While previous generations looked up to historical figures, scientists, or parents, contemporary teenagers increasingly draw inspiration from social media influencers. This phenomenon has sparked intense debate concerning its overall impact on youth development.

On the one hand, influential online creators can serve as powerful sources of motivation. Many modern influencers actively promote physical fitness, entrepreneurial mindsets, and philanthropic initiatives. Unlike distant historical figures, their relatability makes self-improvement appear accessible to ordinary adolescents. For instance, watching a young programmer document their journey into software engineering can inspire students to pursue ambitious educational paths.

On the other hand, the superficial nature of much online content poses genuine psychological hazards. Internet personalities frequently project carefully curated, unrealistic lifestyles that foster unhealthy comparisons and low self-esteem among impressionable followers. Moreover, the commercialized essence of social media often reduces influencers to disguised advertisers promoting unnecessary consumerism. Consequently, teenagers may prioritize materialistic pursuits over fundamental human values such as integrity and genuine education.

All things considered, while social media influencers possess the undeniable potential to inspire, they can also promote distorted priorities. In my view, it is crucial that young individuals cultivate media literacy and critical thinking, ensuring they distinguish authentic inspirational figures from mere commercial entertainers.`
  }
};
