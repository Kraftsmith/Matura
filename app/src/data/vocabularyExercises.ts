import type { VocabularyExercise } from '../types';

/**
 * Gap-fill practice for the "Słownictwo" texts, keyed by text id (see vocabularyTexts.ts).
 * Every sentence has exactly one gap, written as ___, and the answer is a key word or phrase
 * from the glossary of that text, in the form the sentence needs.
 * Answers are compared case-insensitively; hyphens and extra spaces are ignored.
 */
export const vocabularyExercisesByText: Record<string, VocabularyExercise> = {
  // Człowiek
  'czl-txt-1': {
    items: [
      { sentence: 'He goes to the gym every day, so he is very ___.', answer: 'well-built', alternatives: ['broad-shouldered'] },
      { sentence: "My dad's hair started ___ when he was only thirty.", answer: 'going grey', alternatives: ['to go grey'] },
      { sentence: "You can't come to the wedding in that ___ old jacket!", answer: 'scruffy' },
      { sentence: 'Everyone says I ___ my mother: we have the same eyes and the same laugh.', answer: 'take after' },
      { sentence: 'She spends a lot of time in the sun, so she has lots of ___ on her nose.', answer: 'freckles' },
      { sentence: 'The ___ between the two brothers is amazing; people often think they are twins.', answer: 'resemblance' },
    ],
  },
  'czl-txt-2': {
    items: [
      { sentence: "You can tell Anna anything; she never repeats a secret. She's completely ___.", answer: 'trustworthy' },
      { sentence: "Once Marek decides something, nobody can change his mind. He's so ___.", answer: 'stubborn' },
      { sentence: "My brother never worries about anything; he's really ___.", answer: 'easy-going' },
      { sentence: 'Piotr always ___ in front of the girls, showing them his new phone.', answer: 'shows off' },
      { sentence: "It's ___ to criticise people for things you do yourself.", answer: 'hypocritical' },
      { sentence: 'It took me a few weeks to ___ at my new school.', answer: 'fit in' },
    ],
  },
  'czl-txt-3': {
    items: [
      { sentence: "I was so ___ before the interview that I couldn't sleep.", answer: 'apprehensive' },
      { sentence: "When she heard the news, she ___ and couldn't stop crying.", answer: 'burst into tears' },
      { sentence: 'He was ___ when he won the competition; he was jumping up and down.', answer: 'ecstatic' },
      { sentence: 'When I asked him where the keys were, he just ___ his shoulders.', answer: 'shrugged' },
      { sentence: 'She has been ___ since her best friend moved abroad.', answer: 'down in the dumps' },
      { sentence: 'My parents rarely ___ about my future; they always argue.', answer: 'see eye to eye' },
    ],
  },
  'czl-txt-4': {
    items: [
      { sentence: 'A ___ needs constant attention because it can fall at any moment.', answer: 'toddler' },
      { sentence: 'My grandparents ___ me while my parents worked abroad.', answer: 'brought up' },
      { sentence: 'In Poland you ___ at eighteen and can vote.', answer: 'come of age' },
      { sentence: 'After forty years at the factory, he ___ last spring.', answer: 'retired' },
      { sentence: "Passing the matura exam is an important ___ in every student's life.", answer: 'milestone' },
      { sentence: 'Many of ___ need help with shopping and housework.', answer: 'the elderly' },
    ],
  },
  'czl-txt-5': {
    items: [
      { sentence: 'My older sister is my ___: I want to be just like her.', answer: 'role model' },
      { sentence: 'I have always ___ my grandfather for his patience.', answer: 'looked up to', alternatives: ['admired'] },
      { sentence: 'Her speech ___ hundreds of students to volunteer.', answer: 'inspired' },
      { sentence: 'Last year I ___ chess as a hobby and now I play every day.', answer: 'took up' },
      { sentence: 'Winning the national competition was her greatest ___.', answer: 'achievement' },
      { sentence: 'Social media has a huge ___ on how teenagers see themselves.', answer: 'influence' },
    ],
  },
  'czl-txt-6': {
    items: [
      { sentence: 'My grandmother is ___: she never opens an umbrella indoors.', answer: 'superstitious' },
      { sentence: 'The thief entered the bank ___ as a security guard.', answer: 'disguised' },
      { sentence: "I'm quite ___, so I'm happy to listen to opinions I don't share.", answer: 'open-minded' },
      { sentence: 'The ending of the film left everybody completely ___.', answer: 'puzzled' },
      { sentence: 'There is no ___ that the drink improves your memory.', answer: 'scientific evidence' },
      { sentence: 'We ___: we both love old films and hate winter.', answer: 'have something in common', alternatives: ['have a lot in common'] },
    ],
  },

  // Miejsce zamieszkania
  'dom-txt-1': {
    items: [
      { sentence: 'We pay the ___ on the first day of every month.', answer: 'rent' },
      { sentence: 'The ___ wants to raise the rent again next year.', answer: 'landlord' },
      { sentence: 'The flat is small but very ___, with a fireplace and warm lights.', answer: 'cosy', alternatives: ['cozy'] },
      { sentence: 'The supermarket and the tram stop are ___ of our house.', answer: 'within walking distance' },
      { sentence: 'We share the ___ in our flat: I cook and my sister cleans.', answer: 'household chores' },
      { sentence: 'The kitchen is ___: it has a dishwasher, an oven and a microwave.', answer: 'well-equipped' },
    ],
  },

  // Edukacja
  'edu-txt-1': {
    items: [
      { sentence: 'I have to ___ three chapters before the biology test tomorrow.', answer: 'revise' },
      { sentence: "Don't ___ everything the night before; study a little every day.", answer: 'cram' },
      { sentence: 'He was caught trying to ___ in the maths exam.', answer: 'cheat' },
      { sentence: "I missed two weeks of school and now I can't ___ the rest of the class.", answer: 'keep up with' },
      { sentence: 'You must ___ your essay by Friday at the latest.', answer: 'hand in' },
      { sentence: 'My parents pay a private ___ to help me with chemistry.', answer: 'tutor' },
    ],
  },

  // Praca
  'praca-txt-1': {
    items: [
      { sentence: 'Send your ___ and a cover letter to the email address below.', answer: 'CV' },
      { sentence: 'The ___ is low, but the company offers free lunches and a gym.', answer: 'salary' },
      { sentence: 'In my last job I often had to ___ at weekends.', answer: 'do overtime' },
      { sentence: 'The job has ___, so I can start at nine or at eleven.', answer: 'flexible hours' },
      { sentence: 'It took me a month to ___ at the new office.', answer: 'settle in' },
      { sentence: 'The interviewer asked me about my ___.', answer: 'strengths and weaknesses' },
    ],
  },

  // Życie prywatne
  'zp-txt-1': {
    items: [
      { sentence: "My aunt's son is my ___.", answer: 'cousin' },
      { sentence: 'I ___ my sister; we never argue.', answer: 'get on well with' },
      { sentence: "Tomek ___ his best friend over a girl and they haven't spoken since.", answer: 'fell out with' },
      { sentence: 'They argued on Monday but ___ by Friday.', answer: 'made up' },
      { sentence: "My sister's son, my little ___, is three years old.", answer: 'nephew' },
      { sentence: 'We ___ by phone and video calls since she moved to Ireland.', answer: 'keep in touch' },
    ],
  },

  // Żywienie
  'zyw-txt-1': {
    items: [
      { sentence: 'Crisps, sweets and burgers are all ___.', answer: 'junk food' },
      { sentence: 'We ordered a ___ because nobody wanted to cook.', answer: 'takeaway' },
      { sentence: 'Always read the ___ to check how much sugar is in a product.', answer: 'nutrition label' },
      { sentence: 'My little brother is a ___: he refuses to eat anything green.', answer: 'fussy eater' },
      { sentence: 'Strawberries are ___ in Poland: you can only buy good ones in June.', answer: 'seasonal' },
      { sentence: 'A ___ contains vegetables, fruit, protein and some fat.', answer: 'balanced diet' },
    ],
  },

  // Zakupy i usługi
  'zak-txt-1': {
    items: [
      { sentence: 'The shop gave me a full ___ when the headphones stopped working.', answer: 'refund' },
      { sentence: 'Students get a 10% ___ with their student card.', answer: 'discount' },
      { sentence: 'The ___ delivered the parcel while I was at school.', answer: 'courier' },
      { sentence: 'My aunt is a real ___: she never pays the full price for anything.', answer: 'bargain hunter' },
      { sentence: "Twenty złoty for a bottle of water? That's a ___!", answer: 'rip-off', alternatives: ['rip off'] },
      { sentence: "Check the ___ before you buy: some shops don't take clothes back.", answer: 'returns policy' },
    ],
  },

  // Podróżowanie i turystyka
  'pod-txt-1': {
    items: [
      { sentence: 'A ___ is cheaper than a hotel, but you share a room with strangers.', answer: 'hostel' },
      { sentence: 'My parents prefer a ___ where the flights and the hotel are all organised.', answer: 'package holiday' },
      { sentence: 'We wanted to go somewhere ___, far from the crowds.', answer: 'off the beaten track' },
      { sentence: "Without a map it's easy to ___ in the old town.", answer: 'get lost' },
      { sentence: 'That café is a ___: terrible coffee at three times the normal price.', answer: 'tourist trap' },
      { sentence: 'We took a ___ to see the waterfall.', answer: 'detour' },
    ],
  },

  // Kultura
  'kul-txt-1': {
    items: [
      { sentence: 'We went to a ___ by a local band on Saturday.', answer: 'gig' },
      { sentence: 'The ___ of the film was so complicated that I got lost after twenty minutes.', answer: 'plot' },
      { sentence: 'At the end of the play the audience gave the actors a ___.', answer: 'standing ovation' },
      { sentence: 'The ___ includes two famous Polish actors.', answer: 'cast' },
      { sentence: 'Every ___ panned the film, but it still made millions.', answer: 'critic' },
      { sentence: 'The new superhero ___ broke all box-office records.', answer: 'blockbuster' },
    ],
  },

  // Sport
  'sp-txt-1': {
    items: [
      { sentence: 'Over five thousand runners ___ the marathon last year.', answer: 'took part in' },
      { sentence: 'She ran a ___ of 3 hours 40 minutes.', answer: 'personal best' },
      { sentence: 'At the thirtieth kilometre I ___ and could hardly move my legs.', answer: 'hit the wall' },
      { sentence: 'Many runners ___ before the finish line because of the heat.', answer: 'drop out', alternatives: ['dropped out'] },
      { sentence: 'Thousands of ___ cheered along the route.', answer: 'spectators' },
      { sentence: 'In the final she beat her ___ by two points.', answer: 'opponent' },
    ],
  },

  // Zdrowie
  'zd-txt-1': {
    items: [
      { sentence: "I've got a ___; it hurts when I swallow.", answer: 'sore throat' },
      { sentence: "You should ___ with your doctor if the cough doesn't go away.", answer: 'make an appointment' },
      { sentence: 'The doctor ___ antibiotics and told me to stay in bed.', answer: 'prescribed' },
      { sentence: 'I need a ___ for school to explain my absence.', answer: 'sick note' },
      { sentence: 'My grandmother gets a ___ every autumn.', answer: 'flu jab' },
      { sentence: "He's got a high ___, so he's not going to school today.", answer: 'temperature' },
    ],
  },

  // Nauka i technika
  'nt-txt-1': {
    items: [
      { sentence: 'My parents limit my ___ to two hours a day.', answer: 'screen time' },
      { sentence: 'I spent the whole evening ___ through photos on my phone.', answer: 'scrolling' },
      { sentence: 'Every ___ makes me pick up my phone, even in class.', answer: 'notification' },
      { sentence: 'She did a week-long ___: no phone, no laptop, no TV.', answer: 'digital detox' },
      { sentence: "Type the question into a ___ and you'll find the answer in seconds.", answer: 'search engine' },
      { sentence: 'The lab uses ___ technology that no other university has.', answer: 'cutting-edge' },
    ],
  },

  // Świat przyrody
  'prz-txt-1': {
    items: [
      { sentence: 'Bees live in a ___ with one queen.', answer: 'hive' },
      { sentence: 'Farmers spray ___ on their crops to kill insects.', answer: 'pesticides', alternatives: ['pesticide'] },
      { sentence: 'Without ___, many fruit trees would not produce any fruit.', answer: 'pollination' },
      { sentence: 'The panda is an ___ that could disappear within our lifetime.', answer: 'endangered species' },
      { sentence: 'Scientists ___ the number of bees every spring.', answer: 'monitor' },
      { sentence: 'Cutting down forests leads to ___ for thousands of animals.', answer: 'habitat loss' },
    ],
  },

  // Państwo i społeczeństwo
  'pan-txt-1': {
    items: [
      { sentence: 'In Poland you can ___ when you are eighteen.', answer: 'vote' },
      { sentence: 'The ___ was low: only half of the voters went to the polls.', answer: 'turnout' },
      { sentence: 'Each party publishes a ___ with its promises before the election.', answer: 'manifesto' },
      { sentence: 'Over ten thousand people signed the ___ against the new motorway.', answer: 'petition' },
      { sentence: 'The ___ decides about local roads, schools and parks.', answer: 'local council' },
      { sentence: 'Every ___ has the right to vote and to stand for election.', answer: 'citizen' },
    ],
  },
};
