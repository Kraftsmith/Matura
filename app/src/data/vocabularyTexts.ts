import type { VocabularyText } from '../types';

/**
 * Topic reading texts for the "Słownictwo" section, keyed by module id.
 * Glossary terms are marked **like this** inside paragraphs and explained in English below the text.
 * Illustrations live in /public/images/vocab and are produced from the brief in
 * "Spec/Illustrations for Antigravity.md".
 */
export const vocabularyTextsByModule: Record<string, VocabularyText[]> = {
  czlowiek: [
    {
      id: 'czl-txt-1',
      title: 'First impressions',
      subtopic: 'Physical appearance',
      level: 'P',
      image: {
        src: '/images/vocab/czlowiek-1-appearance.png',
        alt: 'Two friends meeting at a railway station: a tall man with a beard and a young woman with shoulder-length hair and freckles.',
      },
      paragraphs: [
        'When Tom stepped off the train, I recognised him at once, even though we had not seen each other for ten years. He was still **broad-shouldered** and **well-built**, but his hair, once jet-black, had started **going grey** at the temples. He looked **in his mid-thirties**, which of course he was.',
        'He was dressed casually, in a slightly **scruffy** jacket and worn jeans, yet somehow he looked **impeccable**, the way some people always do. The small **birthmark** above his left eyebrow was still there, and so was his **cheeky** smile.',
        '"You haven\'t changed a bit," he said. "Same **freckles**, same **shoulder-length** hair." That was not quite true, but it was nice to hear. People say I **take after** my mother, and the older I get, the stronger the **resemblance** becomes.',
      ],
      glossary: [
        { term: 'broad-shouldered', definition: 'having wide shoulders', polish: 'szeroki w ramionach', russian: 'широкоплечий' },
        { term: 'well-built', definition: 'strong and muscular, with a large, solid body', polish: 'dobrze zbudowany', russian: 'крепкого телосложения' },
        { term: 'go grey', definition: 'to start having grey hair because of age', polish: 'siwieć', russian: 'седеть' },
        { term: 'in his mid-thirties', definition: 'about 34 to 36 years old', polish: 'około 35 lat', russian: 'около тридцати пяти' },
        { term: 'scruffy', definition: 'untidy and slightly dirty', polish: 'niechlujny, zaniedbany', russian: 'неряшливый' },
        { term: 'impeccable', definition: 'perfect, without any faults', polish: 'nienaganny', russian: 'безупречный' },
        { term: 'birthmark', definition: 'a mark on the skin that a person has from birth', polish: 'znamię', russian: 'родимое пятно' },
        { term: 'cheeky', definition: 'slightly rude or disrespectful, but in a funny way', polish: 'bezczelny, zawadiacki', russian: 'дерзкий, озорной' },
        { term: 'freckles', definition: 'small brown spots on the skin, often on the face', polish: 'piegi', russian: 'веснушки' },
        { term: 'shoulder-length', definition: 'hair that reaches the shoulders', polish: 'do ramion', russian: 'до плеч' },
        { term: 'take after', definition: 'to look or behave like an older member of your family', polish: 'być podobnym do', russian: 'пойти в (кого-то)' },
        { term: 'resemblance', definition: 'the fact that two people look alike', polish: 'podobieństwo', russian: 'сходство' },
      ],
      talkAbout: [
        'Describe a friend or relative you have not seen for a long time. How have they changed?',
        'Who do you take after in your family? Think about both looks and character.',
      ],
    },
    {
      id: 'czl-txt-2',
      title: 'What makes a good friend?',
      subtopic: 'Personality and character',
      level: 'R',
      image: {
        src: '/images/vocab/czlowiek-2-character.png',
        alt: 'Four teenagers of different personalities working together on a school project around a table.',
      },
      paragraphs: [
        'Ask ten people what they value most in a friend and you will probably get ten different answers. For me, the key quality is being **trustworthy**: a friend who keeps a secret is worth more than a dozen who merely make you laugh. Closely connected to this is being **reliable**. If my friend promises to help me move house, I expect him to turn up.',
        'Of course, nobody is perfect. My best friend Kasia is incredibly **conscientious** at school, but she can also be remarkably **stubborn**. Once she has made up her mind, no argument will change it. Her brother, on the other hand, is so **easy-going** that he never seems to worry about anything, which can be just as annoying when you need a decision.',
        'What I cannot stand is people who are **hypocritical**, who criticise others for things they do themselves, or those who constantly **show off**. A truly **compassionate** person does not need an audience. In the end, a good friend is someone who **brings out the best in** you and helps you **fit in** without pretending to be someone you are not.',
      ],
      glossary: [
        { term: 'trustworthy', definition: 'able to be trusted; honest and reliable', polish: 'godny zaufania', russian: 'заслуживающий доверия' },
        { term: 'reliable', definition: 'someone you can depend on to do what they promised', polish: 'niezawodny, solidny', russian: 'надёжный' },
        { term: 'conscientious', definition: 'careful and putting a lot of effort into your work', polish: 'sumienny', russian: 'добросовестный' },
        { term: 'stubborn', definition: 'refusing to change your opinion or plans', polish: 'uparty', russian: 'упрямый' },
        { term: 'easy-going', definition: 'relaxed and not easily upset or worried', polish: 'wyluzowany, spokojny', russian: 'беззаботный, покладистый' },
        { term: 'hypocritical', definition: 'pretending to have moral standards that you do not actually follow', polish: 'obłudny', russian: 'лицемерный' },
        { term: 'show off', definition: 'to try to impress people by showing your abilities or possessions', polish: 'popisywać się', russian: 'выпендриваться, рисоваться' },
        { term: 'compassionate', definition: 'feeling or showing sympathy for people who suffer', polish: 'współczujący', russian: 'сострадательный' },
        { term: 'bring out the best in', definition: 'to make someone show their best qualities', polish: 'wydobywać z kogoś to, co najlepsze', russian: 'раскрывать лучшее в ком-то' },
        { term: 'fit in', definition: 'to feel accepted as part of a group', polish: 'pasować do grupy, odnaleźć się', russian: 'вписаться, влиться' },
      ],
      talkAbout: [
        'Which three character traits are the most important in a friend? Explain why.',
        'Is it better to be stubborn or easy-going? Give examples from your own life.',
      ],
    },
    {
      id: 'czl-txt-3',
      title: 'A rollercoaster of emotions',
      subtopic: 'Feelings, emotions and body language',
      level: 'R',
      image: {
        src: '/images/vocab/czlowiek-3-emotions.png',
        alt: 'A student opening an envelope with exam results in a school corridor while friends wait with anxious and happy faces.',
      },
      paragraphs: [
        'The morning the exam results arrived, Marek was so **apprehensive** that he could not eat breakfast. He sat at the kitchen table with his **arms folded**, **frowning** at the envelope as if it might bite him. His mother tried to make small talk, but he just **shrugged**.',
        'When he finally opened it, he **burst into tears**, and for a moment his mother was convinced the news was bad. In fact, he was **ecstatic**: he had passed with the highest mark in his year. Relief and joy came all at once, and he felt completely **overwhelmed**.',
        'His sister, who had been **down in the dumps** all week after a quarrel with her boyfriend, **blushed** when he hugged her. "I told you so," she said. For once, the two of them **saw eye to eye**.',
      ],
      glossary: [
        { term: 'apprehensive', definition: 'worried that something bad might happen', polish: 'pełen obaw, zaniepokojony', russian: 'встревоженный, опасающийся' },
        { term: 'fold your arms', definition: 'to cross your arms in front of your chest', polish: 'skrzyżować ramiona', russian: 'скрестить руки' },
        { term: 'frown', definition: 'to bring your eyebrows together because you are angry or worried', polish: 'marszczyć brwi', russian: 'хмуриться' },
        { term: 'shrug', definition: 'to raise your shoulders to show you do not know or do not care', polish: 'wzruszyć ramionami', russian: 'пожать плечами' },
        { term: 'burst into tears', definition: 'to suddenly start crying', polish: 'wybuchnąć płaczem', russian: 'расплакаться' },
        { term: 'ecstatic', definition: 'extremely happy', polish: 'zachwycony, w ekstazie', russian: 'в восторге' },
        { term: 'overwhelmed', definition: 'feeling such strong emotion that you do not know how to react', polish: 'przytłoczony (emocjami)', russian: 'переполненный чувствами' },
        { term: 'down in the dumps', definition: 'sad and without hope (informal)', polish: 'przygnębiony', russian: 'в унынии' },
        { term: 'blush', definition: 'to become red in the face because you are embarrassed', polish: 'rumienić się', russian: 'краснеть' },
        { term: 'see eye to eye', definition: 'to agree with someone', polish: 'zgadzać się z kimś', russian: 'сходиться во мнениях' },
      ],
      talkAbout: [
        'Describe a moment when you felt overwhelmed. What happened and how did you react?',
        'How can you tell what someone is feeling from their body language? Give three examples.',
      ],
    },
    {
      id: 'czl-txt-4',
      title: 'Stages of life',
      subtopic: 'Personal details and stages of life',
      level: 'P',
      image: {
        src: '/images/vocab/czlowiek-4-stages.png',
        alt: 'A family timeline: a toddler, a teenager, a woman in her thirties with a baby, and an elderly man in a garden.',
      },
      paragraphs: [
        'My grandfather likes to say that life is a staircase, and every step has its own view. As a **toddler**, he was **brought up** on a farm with five brothers. His **adolescence** was difficult: money was short and he left school at sixteen. He **came of age** in a city, where he worked, studied in the evenings and met my grandmother.',
        'By the time he was **in his early thirties**, he had two children and a small flat. He describes being **middle-aged** as the busiest period of his life, with teenagers at home and a demanding job. He **retired** at sixty-five and says that the **elderly** are often happier than young people imagine.',
        'Every family has its **milestones**: a first day at school, a graduation, a wedding. "You never stop **growing up**," my grandfather says. "You just get better at it."',
      ],
      glossary: [
        { term: 'toddler', definition: 'a very young child who is learning to walk', polish: 'małe dziecko, berbeć', russian: 'малыш (1–3 года)' },
        { term: 'bring up', definition: 'to look after a child until it is an adult', polish: 'wychowywać', russian: 'воспитывать' },
        { term: 'adolescence', definition: 'the period between being a child and being an adult', polish: 'okres dojrzewania', russian: 'подростковый возраст' },
        { term: 'come of age', definition: 'to reach the age when you are legally an adult', polish: 'osiągnąć pełnoletność', russian: 'достичь совершеннолетия' },
        { term: 'in his early thirties', definition: 'about 30 to 33 years old', polish: 'po trzydziestce', russian: 'в начале четвёртого десятка' },
        { term: 'middle-aged', definition: 'roughly between 45 and 65 years old', polish: 'w średnim wieku', russian: 'среднего возраста' },
        { term: 'retire', definition: 'to stop working because of age', polish: 'przejść na emeryturę', russian: 'выйти на пенсию' },
        { term: 'the elderly', definition: 'old people (polite)', polish: 'osoby starsze', russian: 'пожилые люди' },
        { term: 'milestone', definition: 'an important event in the development of something', polish: 'kamień milowy', russian: 'веха' },
        { term: 'grow up', definition: 'to change from a child into an adult', polish: 'dorastać', russian: 'взрослеть' },
      ],
      talkAbout: [
        'Which stage of life do you think is the most difficult? Why?',
        'Talk about an important milestone in your family and how you celebrated it.',
      ],
    },
    {
      id: 'czl-txt-5',
      title: 'Who do you look up to?',
      subtopic: 'Interests, skills and role models',
      level: 'P',
      image: {
        src: '/images/vocab/czlowiek-5-role-models.png',
        alt: 'A teenage girl at a workbench building a robot, with a poster of a famous woman scientist on the wall behind her.',
      },
      paragraphs: [
        'A **role model** does not have to be famous. When I was twelve, I **looked up to** my science teacher, Mrs Nowak, more than to any celebrity. She was **dedicated**, endlessly patient, and she **inspired** half the class to **take up** robotics as a hobby.',
        'I **admired** the way she treated mistakes as part of learning. Thanks to her, I learned that an **achievement** is rarely the result of **talent** alone; it usually comes from practice and persistence. Today I try to **emulate** her attitude whenever I help younger students.',
        'Celebrities can have a huge **influence** on young people, but in my opinion the people we meet every day shape us far more. Who **pursues** their passion in your neighbourhood? That person may be a better hero than anyone on television.',
      ],
      glossary: [
        { term: 'role model', definition: 'a person whose behaviour is a good example for others', polish: 'wzór do naśladowania', russian: 'образец для подражания' },
        { term: 'look up to', definition: 'to admire and respect someone', polish: 'podziwiać, szanować', russian: 'равняться на' },
        { term: 'dedicated', definition: 'giving a lot of time and energy to something you believe in', polish: 'oddany, zaangażowany', russian: 'преданный делу' },
        { term: 'inspire', definition: 'to make someone want to do something good', polish: 'inspirować', russian: 'вдохновлять' },
        { term: 'take up', definition: 'to start doing a new hobby or activity', polish: 'zacząć uprawiać (hobby)', russian: 'заняться (хобби)' },
        { term: 'admire', definition: 'to respect someone for what they do or how they are', polish: 'podziwiać', russian: 'восхищаться' },
        { term: 'achievement', definition: 'something good that you succeed in doing with effort', polish: 'osiągnięcie', russian: 'достижение' },
        { term: 'talent', definition: 'a natural ability to do something well', polish: 'talent', russian: 'талант' },
        { term: 'emulate', definition: 'to try to be like someone you admire', polish: 'naśladować, wzorować się na', russian: 'подражать' },
        { term: 'influence', definition: 'the power to affect how someone thinks or behaves', polish: 'wpływ', russian: 'влияние' },
        { term: 'pursue', definition: 'to follow an interest or a goal over time', polish: 'realizować, dążyć do', russian: 'заниматься, стремиться к' },
      ],
      talkAbout: [
        'Who is your role model and what have you learned from this person?',
        'Do celebrities make good role models for teenagers? Give arguments for and against.',
      ],
    },
  ],

  'miejsce-zamieszkania': [
    {
      id: 'dom-txt-1',
      title: 'Moving out',
      subtopic: 'Types of housing, rooms and the neighbourhood',
      level: 'P',
      image: {
        src: '/images/vocab/miejsce-zamieszkania-1-flat.png',
        alt: 'A young woman carrying a box into a small bright attic flat with a sloping ceiling and a view of city rooftops.',
      },
      paragraphs: [
        'Last month I moved into my first **rented** flat. It is a tiny **attic** apartment in a **terraced house** near the university, and the **rent** takes almost half of my student budget. Still, I love it: the living room is **cosy**, the kitchen is **well-equipped**, and there is even a small **balcony** overlooking the courtyard.',
        'The **neighbourhood** is lively, with a bakery, a tram stop and a park **within walking distance**. The only drawback is the **landlord**, who insists on inspecting the flat every month. My parents keep asking whether I do the **household chores**. I tell them the truth: I **do the washing-up** every evening, but **vacuuming** happens only when guests are expected.',
      ],
      glossary: [
        { term: 'rented', definition: 'paid for monthly, not owned', polish: 'wynajmowany', russian: 'арендуемый' },
        { term: 'attic', definition: 'the space or room directly under the roof', polish: 'poddasze', russian: 'мансарда' },
        { term: 'terraced house', definition: 'a house joined to other houses on both sides', polish: 'dom szeregowy', russian: 'таунхаус' },
        { term: 'rent', definition: 'the money you pay regularly to live in a flat you do not own', polish: 'czynsz', russian: 'арендная плата' },
        { term: 'cosy', definition: 'small, warm and comfortable', polish: 'przytulny', russian: 'уютный' },
        { term: 'well-equipped', definition: 'having all the necessary appliances and furniture', polish: 'dobrze wyposażony', russian: 'хорошо оборудованный' },
        { term: 'neighbourhood', definition: 'the area of a town where you live', polish: 'okolica, dzielnica', russian: 'район' },
        { term: 'within walking distance', definition: 'close enough to walk to', polish: 'w zasięgu spaceru', russian: 'в пешей доступности' },
        { term: 'landlord', definition: 'the person who owns the flat you rent', polish: 'właściciel mieszkania', russian: 'арендодатель' },
        { term: 'household chores', definition: 'regular jobs at home, such as cleaning and cooking', polish: 'obowiązki domowe', russian: 'домашние обязанности' },
        { term: 'do the washing-up', definition: 'to wash the dishes', polish: 'zmywać naczynia', russian: 'мыть посуду' },
        { term: 'vacuum', definition: 'to clean a floor with a vacuum cleaner', polish: 'odkurzać', russian: 'пылесосить' },
      ],
      talkAbout: [
        'Describe your dream flat or house. Where is it and what does it look like inside?',
        'Which household chores do you enjoy and which do you avoid? Why?',
      ],
    },
  ],

  edukacja: [
    {
      id: 'edu-txt-1',
      title: 'Exam season',
      subtopic: 'School life, exams and assessment',
      level: 'P',
      image: {
        src: '/images/vocab/edukacja-1-exams.png',
        alt: 'A school library in the evening: students revising with notes, laptops and coffee cups, one of them yawning.',
      },
      paragraphs: [
        'Every May the school library turns into a battlefield. Final-year students **revise** for their **leaving exams**, first-years **cram** for end-of-term tests, and the teachers remind everyone that **cheating** will not be tolerated. I am a reasonably **hard-working** student, but I still find it hard to **keep up with** the **curriculum** in physics.',
        'This year our school introduced **continuous assessment**, so **coursework** counts as much as the final paper. Some pupils complain, but I prefer it: one bad day no longer ruins your **grade**. My form **tutor** says the secret is simple: **attend** every lesson, **hand in** homework on time and ask questions when you do not understand. Easier said than done.',
      ],
      glossary: [
        { term: 'revise', definition: 'to study again before an exam', polish: 'powtarzać materiał', russian: 'повторять (к экзамену)' },
        { term: 'leaving exam', definition: 'the final exam at the end of secondary school', polish: 'egzamin maturalny', russian: 'выпускной экзамен' },
        { term: 'cram', definition: 'to try to learn a lot in a short time before a test', polish: 'wkuwać', russian: 'зубрить' },
        { term: 'cheat', definition: 'to behave dishonestly in an exam', polish: 'ściągać', russian: 'списывать' },
        { term: 'hard-working', definition: 'putting a lot of effort into your work', polish: 'pracowity', russian: 'трудолюбивый' },
        { term: 'keep up with', definition: 'to learn as fast as the rest of the group', polish: 'nadążać za', russian: 'успевать за' },
        { term: 'curriculum', definition: 'the subjects and content taught at school', polish: 'program nauczania', russian: 'учебная программа' },
        { term: 'continuous assessment', definition: 'grading based on work done during the whole course', polish: 'ocenianie ciągłe', russian: 'текущая оценка знаний' },
        { term: 'coursework', definition: 'written or practical work done during a course', polish: 'prace zaliczeniowe', russian: 'курсовые задания' },
        { term: 'grade', definition: 'a mark that shows how good your work is', polish: 'ocena', russian: 'оценка' },
        { term: 'tutor', definition: 'a teacher responsible for a class or an individual student', polish: 'wychowawca, opiekun', russian: 'куратор, классный руководитель' },
        { term: 'attend', definition: 'to go to a lesson or an event', polish: 'uczęszczać', russian: 'посещать' },
        { term: 'hand in', definition: 'to give work to a teacher', polish: 'oddać (pracę)', russian: 'сдать (работу)' },
      ],
      talkAbout: [
        'How do you prepare for important exams? Describe your typical revision day.',
        'Is continuous assessment fairer than one final exam? Give your opinion.',
      ],
    },
  ],

  praca: [
    {
      id: 'praca-txt-1',
      title: 'The interview',
      subtopic: 'Job hunting, working conditions and careers',
      level: 'R',
      image: {
        src: '/images/vocab/praca-1-interview.png',
        alt: 'A nervous young man in a suit waiting outside a glass office, holding a folder with his CV.',
      },
      paragraphs: [
        'After sending out thirty **applications**, Piotr finally got an **interview** for an **entry-level** position at a marketing agency. He updated his **CV**, rehearsed answers about his **strengths and weaknesses** and arrived twenty minutes early, which turned out to be a mistake: he spent them in reception, sweating in a borrowed suit.',
        'The questions were tougher than expected. Why did he want the job? Could he **work under pressure**? Was he prepared to **do overtime**? He answered honestly, admitting that he had little experience but was keen to learn. Two days later he was offered the position, with a modest **salary**, a **probation period** of three months and the promise of **flexible hours** once he had **settled in**. It was not his dream job, but it was a start, and in a **competitive** job market a start is everything.',
      ],
      glossary: [
        { term: 'application', definition: 'a formal request for a job', polish: 'podanie o pracę', russian: 'заявка (на работу)' },
        { term: 'interview', definition: 'a meeting where an employer asks a candidate questions', polish: 'rozmowa kwalifikacyjna', russian: 'собеседование' },
        { term: 'entry-level', definition: 'suitable for someone starting a career', polish: 'dla początkujących', russian: 'начального уровня' },
        { term: 'CV', definition: 'a document listing your education and experience', polish: 'życiorys', russian: 'резюме' },
        { term: 'strengths and weaknesses', definition: 'the things you are good and bad at', polish: 'mocne i słabe strony', russian: 'сильные и слабые стороны' },
        { term: 'work under pressure', definition: 'to work well when there is stress and little time', polish: 'pracować pod presją', russian: 'работать под давлением' },
        { term: 'do overtime', definition: 'to work extra hours beyond the normal day', polish: 'pracować w nadgodzinach', russian: 'работать сверхурочно' },
        { term: 'salary', definition: 'the money you receive for your job, usually monthly', polish: 'pensja', russian: 'зарплата' },
        { term: 'probation period', definition: 'a trial period at the start of a new job', polish: 'okres próbny', russian: 'испытательный срок' },
        { term: 'flexible hours', definition: 'working time that you can partly choose yourself', polish: 'elastyczne godziny pracy', russian: 'гибкий график' },
        { term: 'settle in', definition: 'to become comfortable in a new place or job', polish: 'zaaklimatyzować się', russian: 'освоиться' },
        { term: 'competitive', definition: 'with many people trying to get the same thing', polish: 'konkurencyjny', russian: 'конкурентный' },
      ],
      talkAbout: [
        'What is your dream job and what qualifications do you need for it?',
        'Would you accept a boring, well-paid job or an interesting, badly paid one? Why?',
      ],
    },
  ],

  'zycie-prywatne': [
    {
      id: 'zp-txt-1',
      title: 'A family celebration',
      subtopic: 'Family, relationships and celebrations',
      level: 'P',
      image: {
        src: '/images/vocab/zycie-prywatne-1-celebration.png',
        alt: 'Three generations of a family around a long table in a garden celebrating a grandmother\'s birthday.',
      },
      paragraphs: [
        'Last Saturday we celebrated my grandmother\'s eightieth birthday. All my **relatives** came, including my **cousins** from Gdańsk, whom I **get on well with**, and my uncle, whom I had **fallen out with** years ago over something neither of us remembers. We **made up** over a plate of cake, which is the usual way in our family.',
        'My parents had organised everything: the garden was decorated, the food was home-made, and my little **nephew** performed a song he had learned at nursery. Grandma, who was **brought up** in a village and **got married** at nineteen, told stories about her childhood. She has been a **widow** for ten years but says she has never felt lonely, because the family keeps **in touch** every single day.',
      ],
      glossary: [
        { term: 'relatives', definition: 'members of your family', polish: 'krewni', russian: 'родственники' },
        { term: 'cousin', definition: 'the child of your aunt or uncle', polish: 'kuzyn, kuzynka', russian: 'двоюродный брат / сестра' },
        { term: 'get on well with', definition: 'to have a good relationship with someone', polish: 'dobrze się z kimś dogadywać', russian: 'ладить с' },
        { term: 'fall out with', definition: 'to have an argument and stop being friendly', polish: 'pokłócić się z', russian: 'поссориться с' },
        { term: 'make up', definition: 'to become friends again after an argument', polish: 'pogodzić się', russian: 'помириться' },
        { term: 'nephew', definition: 'the son of your brother or sister', polish: 'siostrzeniec, bratanek', russian: 'племянник' },
        { term: 'bring up', definition: 'to look after a child until it is an adult', polish: 'wychowywać', russian: 'воспитывать' },
        { term: 'get married', definition: 'to become someone\'s husband or wife', polish: 'wziąć ślub', russian: 'пожениться' },
        { term: 'widow', definition: 'a woman whose husband has died', polish: 'wdowa', russian: 'вдова' },
        { term: 'keep in touch', definition: 'to continue communicating with someone', polish: 'utrzymywać kontakt', russian: 'поддерживать связь' },
      ],
      talkAbout: [
        'Describe a family celebration you remember well. Who was there and what happened?',
        'Which relative do you get on with best? What do you have in common?',
      ],
    },
  ],

  zywienie: [
    {
      id: 'zyw-txt-1',
      title: 'Eating well on a budget',
      subtopic: 'Food, diets and eating habits',
      level: 'P',
      image: {
        src: '/images/vocab/zywienie-1-cooking.png',
        alt: 'A student kitchen with a pot of vegetable soup on the stove, a chopping board with fresh vegetables and a shopping list.',
      },
      paragraphs: [
        'When I started university, I lived on **takeaways** and instant noodles. Within a month I felt tired all the time, so I decided to change my **eating habits**. The rule is simple: cook at home at least five times a week and keep **junk food** for the weekend.',
        'A **wholesome** meal does not have to be expensive. A pot of vegetable soup made from **seasonal** produce costs less than one pizza and lasts three days. I try to buy **free-range** eggs, avoid **processed** meat and read the **nutrition label** before putting anything in the basket. I am not **on a diet**, and I am certainly not a **fussy eater**, but I have learned that a **balanced diet** makes revision much easier.',
      ],
      glossary: [
        { term: 'takeaway', definition: 'a meal you buy ready-made and eat somewhere else', polish: 'jedzenie na wynos', russian: 'еда навынос' },
        { term: 'eating habits', definition: 'the way you usually eat', polish: 'nawyki żywieniowe', russian: 'пищевые привычки' },
        { term: 'junk food', definition: 'food that is quick to eat but unhealthy', polish: 'śmieciowe jedzenie', russian: 'вредная еда' },
        { term: 'wholesome', definition: 'good for your health', polish: 'zdrowy, pożywny', russian: 'полезный, здоровый' },
        { term: 'seasonal', definition: 'available only at a particular time of year', polish: 'sezonowy', russian: 'сезонный' },
        { term: 'free-range', definition: 'from animals that can move around freely', polish: 'z wolnego wybiegu', russian: 'от кур свободного выгула' },
        { term: 'processed', definition: 'changed and preserved in a factory', polish: 'przetworzony', russian: 'переработанный' },
        { term: 'nutrition label', definition: 'the information on a packet about what the food contains', polish: 'etykieta z wartościami odżywczymi', russian: 'этикетка с пищевой ценностью' },
        { term: 'be on a diet', definition: 'to eat less or differently in order to lose weight', polish: 'być na diecie', russian: 'быть на диете' },
        { term: 'fussy eater', definition: 'a person who refuses to eat many kinds of food', polish: 'niejadek, wybredny', russian: 'привередливый в еде' },
        { term: 'balanced diet', definition: 'a diet with the right amount of different kinds of food', polish: 'zbilansowana dieta', russian: 'сбалансированное питание' },
      ],
      talkAbout: [
        'Describe your eating habits during a typical school week. What would you like to change?',
        'Is it possible to eat healthily without spending a lot of money? How?',
      ],
    },
  ],

  zakupy: [
    {
      id: 'zak-txt-1',
      title: 'Click or walk?',
      subtopic: 'Shops, online shopping and consumer rights',
      level: 'R',
      image: {
        src: '/images/vocab/zakupy-1-online.png',
        alt: 'Split scene: on the left a woman shops online on a sofa surrounded by parcels, on the right a man tries on a jacket in a small high-street shop.',
      },
      paragraphs: [
        'My sister and I could not be more different as shoppers. She is a **bargain hunter** who spends hours comparing prices online, waits for the **sales** and never pays the full **retail price**. Last week she bought a winter coat with a 60% **discount**, and when the colour turned out to be wrong, she simply sent it back for a **refund** under the thirty-day **returns policy**.',
        'I prefer the **high street**. I like to try things on, ask the **shop assistant** for advice and leave with the product in my hand instead of waiting for a **courier**. Yes, I probably pay more, and I have been **ripped off** once or twice, but I rarely regret a purchase. My sister says I am old-fashioned. I say that at least nobody **spams** me with adverts for things I have already bought.',
      ],
      glossary: [
        { term: 'bargain hunter', definition: 'a person who looks for things at very low prices', polish: 'łowca okazji', russian: 'охотник за скидками' },
        { term: 'sales', definition: 'a period when shops sell goods at lower prices', polish: 'wyprzedaże', russian: 'распродажа' },
        { term: 'retail price', definition: 'the price paid by customers in shops', polish: 'cena detaliczna', russian: 'розничная цена' },
        { term: 'discount', definition: 'a reduction in the usual price', polish: 'zniżka, rabat', russian: 'скидка' },
        { term: 'refund', definition: 'money given back when you return a product', polish: 'zwrot pieniędzy', russian: 'возврат денег' },
        { term: 'returns policy', definition: 'a shop\'s rules about giving products back', polish: 'zasady zwrotów', russian: 'правила возврата' },
        { term: 'high street', definition: 'the main shopping street of a town (British)', polish: 'główna ulica handlowa', russian: 'торговая улица' },
        { term: 'shop assistant', definition: 'a person who serves customers in a shop', polish: 'sprzedawca', russian: 'продавец-консультант' },
        { term: 'courier', definition: 'a company or person that delivers parcels', polish: 'kurier', russian: 'курьер' },
        { term: 'rip off', definition: 'to charge someone far too much money (informal)', polish: 'naciągnąć, zedrzeć z kogoś', russian: 'обдирать, обманывать' },
        { term: 'spam', definition: 'to send unwanted advertising messages', polish: 'spamować', russian: 'рассылать спам' },
      ],
      talkAbout: [
        'Do you prefer shopping online or in traditional shops? Give three reasons.',
        'Have you ever returned a product? Describe what happened.',
      ],
    },
  ],

  podroze: [
    {
      id: 'pod-txt-1',
      title: 'Off the beaten track',
      subtopic: 'Travel, accommodation and sightseeing',
      level: 'R',
      image: {
        src: '/images/vocab/podroze-1-backpacking.png',
        alt: 'Two backpackers consulting a paper map at a mountain crossroads, with a small village and a lake in the valley below.',
      },
      paragraphs: [
        'Our plan for the summer was ambitious: three weeks in the Balkans with nothing but **backpacks**, a paper map and a very small budget. We skipped the **package holidays** and **tourist traps** and looked for places **off the beaten track**. Instead of hotels we stayed in **hostels** and, twice, in a **guesthouse** run by a family who refused to let us leave without breakfast.',
        'Not everything went smoothly. We **missed** a connecting bus in Sarajevo, **got lost** in the hills above Kotor and spent one night at a **border crossing** because of a problem with my friend\'s passport. Yet these are the moments we talk about most. A **sightseeing tour** shows you the monuments; a **detour** shows you the country.',
      ],
      glossary: [
        { term: 'backpack', definition: 'a large bag carried on your back when travelling', polish: 'plecak', russian: 'рюкзак' },
        { term: 'package holiday', definition: 'a holiday where travel and hotel are sold together', polish: 'wczasy zorganizowane', russian: 'пакетный тур' },
        { term: 'tourist trap', definition: 'a place that attracts tourists but is overpriced', polish: 'pułapka na turystów', russian: 'ловушка для туристов' },
        { term: 'off the beaten track', definition: 'far from the places most people visit', polish: 'z dala od utartych szlaków', russian: 'вдали от проторённых дорог' },
        { term: 'hostel', definition: 'cheap accommodation, often with shared rooms', polish: 'hostel', russian: 'хостел' },
        { term: 'guesthouse', definition: 'a small private hotel', polish: 'pensjonat', russian: 'гостевой дом' },
        { term: 'miss', definition: 'to arrive too late for a bus, train or plane', polish: 'spóźnić się na', russian: 'опоздать на' },
        { term: 'get lost', definition: 'to not know where you are', polish: 'zgubić się', russian: 'заблудиться' },
        { term: 'border crossing', definition: 'the place where you pass from one country to another', polish: 'przejście graniczne', russian: 'пограничный переход' },
        { term: 'sightseeing tour', definition: 'an organised trip to see famous places', polish: 'wycieczka krajoznawcza', russian: 'экскурсия' },
        { term: 'detour', definition: 'a longer way to a place, chosen on purpose or by accident', polish: 'objazd, nadłożenie drogi', russian: 'крюк, объезд' },
      ],
      talkAbout: [
        'Describe the most memorable trip you have been on. What went wrong and what went right?',
        'Package holiday or independent travel: which would you choose and why?',
      ],
    },
  ],

  kultura: [
    {
      id: 'kul-txt-1',
      title: 'A night at the festival',
      subtopic: 'Music, film, theatre and the arts',
      level: 'R',
      image: {
        src: '/images/vocab/kultura-1-festival.png',
        alt: 'An open-air music festival at dusk: a stage with lights, a crowd with raised hands and festival tents in the background.',
      },
      paragraphs: [
        'The festival opened with a **gig** by a band I had never heard of, and by the second song the whole **crowd** was singing the **chorus**. That is what I love about live music: no **recording** can match the energy of a real **performance**. Later, a documentary about street artists was **screened** in a tent, and I found myself more moved than by any Hollywood **blockbuster**.',
        'The next day I went to see a **contemporary** play at the festival theatre. The **critics** had **panned** it, calling the **plot** confusing, but the **cast** was outstanding and the audience gave them a **standing ovation**. Culture, I decided, is not about reading reviews. It is about being there.',
      ],
      glossary: [
        { term: 'gig', definition: 'a live music performance, especially by a band', polish: 'koncert', russian: 'концерт' },
        { term: 'crowd', definition: 'a large group of people in one place', polish: 'tłum', russian: 'толпа' },
        { term: 'chorus', definition: 'the part of a song that is repeated', polish: 'refren', russian: 'припев' },
        { term: 'recording', definition: 'music or sound stored so that it can be played again', polish: 'nagranie', russian: 'запись' },
        { term: 'performance', definition: 'the act of playing music or acting in front of an audience', polish: 'występ', russian: 'выступление' },
        { term: 'screen', definition: 'to show a film', polish: 'wyświetlać (film)', russian: 'показывать (фильм)' },
        { term: 'blockbuster', definition: 'a very successful, big-budget film', polish: 'hit kinowy', russian: 'блокбастер' },
        { term: 'contemporary', definition: 'modern, belonging to the present time', polish: 'współczesny', russian: 'современный' },
        { term: 'critic', definition: 'a person whose job is to give opinions about art', polish: 'krytyk', russian: 'критик' },
        { term: 'pan', definition: 'to criticise a performance very strongly (informal)', polish: 'zjechać (recenzja)', russian: 'разгромить (в рецензии)' },
        { term: 'plot', definition: 'the story of a book, film or play', polish: 'fabuła', russian: 'сюжет' },
        { term: 'cast', definition: 'all the actors in a play or film', polish: 'obsada', russian: 'актёрский состав' },
        { term: 'standing ovation', definition: 'when the audience stands up and claps for a long time', polish: 'owacja na stojąco', russian: 'овация стоя' },
      ],
      talkAbout: [
        'Describe a concert, play or film that made a strong impression on you.',
        'Do reviews influence what you watch or listen to? Why or why not?',
      ],
    },
  ],

  sport: [
    {
      id: 'sp-txt-1',
      title: 'The last kilometre',
      subtopic: 'Sports, training and competitions',
      level: 'P',
      image: {
        src: '/images/vocab/sport-1-marathon.png',
        alt: 'A city half-marathon: a tired runner near the finish line cheered on by spectators holding signs, with a clock above the finish.',
      },
      paragraphs: [
        'Six months ago I could not run for ten minutes without stopping. Yesterday I **took part in** my first half-marathon. I did not **win** anything, of course; my goal was simply to **finish**, and I did, in just over two hours. My **personal best** on a training run had been slower, so I was delighted.',
        'The **course** went through the old town and along the river, and **spectators** lined the streets, cheering and handing out water. Around kilometre eighteen I **hit the wall**: my legs felt like stone and I was tempted to **drop out**. A **fellow runner** slowed down beside me and said, "Breathe, one kilometre at a time." That is why I love **amateur** sport: nobody is your **opponent**; everyone is on the same team.',
      ],
      glossary: [
        { term: 'take part in', definition: 'to be one of the people doing an activity', polish: 'brać udział w', russian: 'принимать участие в' },
        { term: 'win', definition: 'to be the best or first in a competition', polish: 'wygrać', russian: 'выиграть' },
        { term: 'finish', definition: 'to complete a race', polish: 'ukończyć (bieg)', russian: 'финишировать' },
        { term: 'personal best', definition: 'the best result you have ever achieved', polish: 'rekord życiowy', russian: 'личный рекорд' },
        { term: 'course', definition: 'the route of a race', polish: 'trasa', russian: 'трасса' },
        { term: 'spectator', definition: 'a person who watches a sports event', polish: 'widz, kibic', russian: 'зритель' },
        { term: 'hit the wall', definition: 'to suddenly have no energy left during a long race', polish: 'złapać ścianę', russian: 'упереться в стену (на дистанции)' },
        { term: 'drop out', definition: 'to stop doing a race or activity before the end', polish: 'wycofać się', russian: 'сойти с дистанции' },
        { term: 'fellow runner', definition: 'another runner in the same race', polish: 'inny biegacz, towarzysz biegu', russian: 'другой бегун' },
        { term: 'amateur', definition: 'done for pleasure, not as a job', polish: 'amatorski', russian: 'любительский' },
        { term: 'opponent', definition: 'the person you compete against', polish: 'przeciwnik', russian: 'соперник' },
      ],
      talkAbout: [
        'Which sport do you do or would you like to take up? Why?',
        'Is it more important to take part or to win? Give your opinion with examples.',
      ],
    },
  ],

  zdrowie: [
    {
      id: 'zd-txt-1',
      title: 'Just a cold?',
      subtopic: 'Illnesses, symptoms and a healthy lifestyle',
      level: 'P',
      image: {
        src: '/images/vocab/zdrowie-1-doctor.png',
        alt: 'A doctor\'s surgery: a teenage boy with a scarf and a thermometer talking to a friendly doctor at a desk.',
      },
      paragraphs: [
        'It started with a **sore throat** on Monday. By Tuesday I had a **runny nose**, a **cough** and a **temperature** of 38.5. "Just a cold," my dad said, "drink tea and **get some rest**." On Thursday I could hardly get out of bed, so my mum **made an appointment** with our **GP**.',
        'The doctor **examined** me, listened to my chest and said it was the flu, not a cold, and that I had been right to come in. She **prescribed** some medicine, told me to **stay in bed** for a week and gave me a **sick note** for school. "Next year," she added, "get a **flu jab** in October." I am not keen on needles, but I am even less keen on another week like this one.',
      ],
      glossary: [
        { term: 'sore throat', definition: 'pain in your throat', polish: 'ból gardła', russian: 'боль в горле' },
        { term: 'runny nose', definition: 'a nose that produces a lot of liquid', polish: 'katar', russian: 'насморк' },
        { term: 'cough', definition: 'a sudden noise from your throat because of an illness', polish: 'kaszel', russian: 'кашель' },
        { term: 'temperature', definition: 'a higher body heat than normal; a fever', polish: 'gorączka', russian: 'температура' },
        { term: 'get some rest', definition: 'to relax or sleep in order to recover', polish: 'odpocząć', russian: 'отдохнуть' },
        { term: 'make an appointment', definition: 'to arrange a time to see a doctor', polish: 'umówić wizytę', russian: 'записаться на приём' },
        { term: 'GP', definition: 'a general practitioner, a family doctor', polish: 'lekarz rodzinny', russian: 'терапевт' },
        { term: 'examine', definition: 'to look at a patient carefully to find out what is wrong', polish: 'zbadać', russian: 'осмотреть' },
        { term: 'prescribe', definition: 'to say officially which medicine a patient should take', polish: 'przepisać (lek)', russian: 'выписать (лекарство)' },
        { term: 'stay in bed', definition: 'to remain in bed because you are ill', polish: 'leżeć w łóżku', russian: 'соблюдать постельный режим' },
        { term: 'sick note', definition: 'a doctor\'s letter saying you are too ill to work or study', polish: 'zwolnienie lekarskie', russian: 'больничный' },
        { term: 'flu jab', definition: 'an injection that protects you against flu (informal)', polish: 'szczepionka na grypę', russian: 'прививка от гриппа' },
      ],
      talkAbout: [
        'Describe the last time you were ill. What were the symptoms and what did you do?',
        'What do you do to stay healthy? Which habits would you like to change?',
      ],
    },
  ],

  'nauka-technika': [
    {
      id: 'nt-txt-1',
      title: 'Digital detox',
      subtopic: 'Computers, the internet and new technologies',
      level: 'R',
      image: {
        src: '/images/vocab/nauka-technika-1-detox.png',
        alt: 'A teenager putting a smartphone into a drawer, with a desk lamp, a paper notebook and a window with a sunset behind.',
      },
      paragraphs: [
        'According to the **screen-time** report on my phone, I spend five hours a day online. Most of it is not **browsing** for school; it is **scrolling** through short videos and checking **notifications** that nobody needs. So I decided to try a one-week **digital detox**: no **social media**, no games, and the phone **switched off** after nine in the evening.',
        'The first two days were awful. I kept reaching for a **device** that was not there. By the fourth day, however, I had read half a novel and slept better than I had in months. I am not against **cutting-edge** technology; **artificial intelligence** helps me with my maths homework and a **search engine** is still the fastest way to learn anything. The question is who controls whom. For one week, at least, it was me.',
      ],
      glossary: [
        { term: 'screen time', definition: 'the time you spend using a phone, computer or TV', polish: 'czas przed ekranem', russian: 'экранное время' },
        { term: 'browse', definition: 'to look through websites or pages', polish: 'przeglądać (strony)', russian: 'просматривать (сайты)' },
        { term: 'scroll', definition: 'to move text or images up and down on a screen', polish: 'przewijać', russian: 'листать, скроллить' },
        { term: 'notification', definition: 'a message that an app shows to get your attention', polish: 'powiadomienie', russian: 'уведомление' },
        { term: 'digital detox', definition: 'a period when you stop using digital devices', polish: 'cyfrowy detoks', russian: 'цифровой детокс' },
        { term: 'social media', definition: 'websites and apps where people share content and chat', polish: 'media społecznościowe', russian: 'социальные сети' },
        { term: 'switch off', definition: 'to turn a device off', polish: 'wyłączyć', russian: 'выключить' },
        { term: 'device', definition: 'a piece of electronic equipment', polish: 'urządzenie', russian: 'устройство' },
        { term: 'cutting-edge', definition: 'the most modern and advanced', polish: 'najnowocześniejszy', russian: 'передовой' },
        { term: 'artificial intelligence', definition: 'computer systems that can learn and make decisions', polish: 'sztuczna inteligencja', russian: 'искусственный интеллект' },
        { term: 'search engine', definition: 'a program that finds information on the internet', polish: 'wyszukiwarka', russian: 'поисковая система' },
      ],
      talkAbout: [
        'How much time do you spend online every day? Is it too much?',
        'Could you live without a smartphone for a week? What would be the hardest part?',
      ],
    },
  ],

  przyroda: [
    {
      id: 'prz-txt-1',
      title: 'Why the bees matter',
      subtopic: 'Nature, climate and environmental protection',
      level: 'R',
      image: {
        src: '/images/vocab/przyroda-1-bees.png',
        alt: 'A wildflower meadow at the edge of a town with beehives, a beekeeper in a white suit and wind turbines on the horizon.',
      },
      paragraphs: [
        'My aunt keeps bees on the edge of town, and last summer I helped her with the **hives**. I expected honey; I did not expect a lecture on **biodiversity**. One third of the food we eat, she explained, depends on **pollination**, and bee numbers have been falling for years because of **pesticides**, **habitat loss** and a changing **climate**.',
        'The good news is that small things help. The town council has stopped mowing the **meadow** by the river, local farmers have agreed to plant **wildflowers** along their fields, and my school has joined a project to **monitor** **endangered species**. **Global warming** will not be stopped by a few flowers, but as my aunt says, "You **protect** what you know." Now I know the bees.',
      ],
      glossary: [
        { term: 'hive', definition: 'a box where bees live and make honey', polish: 'ul', russian: 'улей' },
        { term: 'biodiversity', definition: 'the variety of plants and animals in a place', polish: 'bioróżnorodność', russian: 'биоразнообразие' },
        { term: 'pollination', definition: 'the process by which insects help plants produce seeds', polish: 'zapylanie', russian: 'опыление' },
        { term: 'pesticide', definition: 'a chemical used to kill insects on crops', polish: 'pestycyd', russian: 'пестицид' },
        { term: 'habitat loss', definition: 'the destruction of places where animals live', polish: 'utrata siedlisk', russian: 'утрата среды обитания' },
        { term: 'climate', definition: 'the usual weather conditions of a region', polish: 'klimat', russian: 'климат' },
        { term: 'meadow', definition: 'a field of grass and wild flowers', polish: 'łąka', russian: 'луг' },
        { term: 'wildflower', definition: 'a flower that grows naturally, not in a garden', polish: 'dziki kwiat', russian: 'полевой цветок' },
        { term: 'monitor', definition: 'to watch and check something regularly', polish: 'monitorować', russian: 'наблюдать, отслеживать' },
        { term: 'endangered species', definition: 'animals or plants that may soon disappear', polish: 'gatunki zagrożone', russian: 'вымирающие виды' },
        { term: 'global warming', definition: 'the rise in the Earth\'s temperature', polish: 'globalne ocieplenie', russian: 'глобальное потепление' },
        { term: 'protect', definition: 'to keep something safe from harm', polish: 'chronić', russian: 'защищать' },
      ],
      talkAbout: [
        'What can an ordinary teenager do to protect the environment? Suggest three things.',
        'Describe a natural place near your home. Has it changed in recent years?',
      ],
    },
  ],

  'panstwo-spoleczenstwo': [
    {
      id: 'pan-txt-1',
      title: 'First time at the ballot box',
      subtopic: 'Politics, elections and civic engagement',
      level: 'R',
      image: {
        src: '/images/vocab/panstwo-spoleczenstwo-1-election.png',
        alt: 'A polling station in a school gym: an eighteen-year-old putting a ballot into a box while volunteers check lists at a table.',
      },
      paragraphs: [
        'I turned eighteen in March, which means that this autumn I will **vote** for the first time. Many of my friends say they will not bother. "One **ballot** changes nothing," they argue, and **turnout** among young people has indeed been low for years. I disagree. A **democracy** works only if **citizens** take part, and that is why I have been reading the **manifestos** of the main **parties** instead of relying on memes.',
        'It is not only about **elections**. Last year my class organised a **petition** for a safer crossing near the school and collected a thousand signatures; six months later the **local council** built it. That is **civic engagement** in practice. Nobody is born a **politician**, but everybody can be an active citizen, and that, in the long run, matters more.',
      ],
      glossary: [
        { term: 'vote', definition: 'to choose a person or party in an election', polish: 'głosować', russian: 'голосовать' },
        { term: 'ballot', definition: 'a piece of paper on which you mark your choice in an election', polish: 'karta do głosowania', russian: 'бюллетень' },
        { term: 'turnout', definition: 'the number of people who vote in an election', polish: 'frekwencja', russian: 'явка' },
        { term: 'democracy', definition: 'a system in which people choose their government', polish: 'demokracja', russian: 'демократия' },
        { term: 'citizen', definition: 'a person who legally belongs to a country', polish: 'obywatel', russian: 'гражданин' },
        { term: 'manifesto', definition: 'a written statement of a party\'s aims and plans', polish: 'program wyborczy', russian: 'предвыборная программа' },
        { term: 'party', definition: 'an organisation of people with the same political ideas', polish: 'partia', russian: 'партия' },
        { term: 'election', definition: 'the process of choosing people for public office by voting', polish: 'wybory', russian: 'выборы' },
        { term: 'petition', definition: 'a document signed by many people asking for a change', polish: 'petycja', russian: 'петиция' },
        { term: 'local council', definition: 'the group of people who govern a town or district', polish: 'rada gminy / miasta', russian: 'местный совет' },
        { term: 'civic engagement', definition: 'taking an active part in the life of your community', polish: 'zaangażowanie obywatelskie', russian: 'гражданская активность' },
        { term: 'politician', definition: 'a person whose job is in politics', polish: 'polityk', russian: 'политик' },
      ],
      talkAbout: [
        'Should voting be compulsory? Give arguments for and against.',
        'Describe a problem in your town that young people could help to solve. How?',
      ],
    },
  ],
};
