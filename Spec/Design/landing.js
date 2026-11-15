'use strict';

// This standalone preview stores nothing and makes no API requests.
const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
function setMenu(open, returnFocus = false) {
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Zamknij menu' : 'Otwórz menu');
  mobileNav.hidden = !open;
  if (returnFocus) menuButton.focus();
}
menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
mobileNav.addEventListener('click', (event) => { if (event.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !mobileNav.hidden) setMenu(false, true); });
matchMedia('(min-width: 851px)').addEventListener('change', (event) => { if (event.matches) setMenu(false); });

const questions = [
  { before: 'I ', after: ' what you mean.', options: ['am understanding', 'understand', 'understanding'], correct: 1, explanation: '"Understand" opisuje stan, nie czynność. W tym zdaniu używamy Present Simple.' },
  { before: 'Look! They ', after: ' for the bus.', options: ['run', 'are running', 'runs'], correct: 1, explanation: '"Look!" wskazuje na czynność dziejącą się teraz. Używamy Present Continuous: are + running.' },
  { before: 'She has lived here ', after: ' 2020.', options: ['for', 'during', 'since'], correct: 2, explanation: '"Since" wskazuje początek okresu: since 2020. "For" stosujemy z długością okresu, np. for six years.' },
];
const form = document.querySelector('#exercise-demo');
const options = document.querySelector('#answer-options');
const feedback = document.querySelector('#answer-feedback');
const checkButton = document.querySelector('#check-answer');
const hint = document.querySelector('#exercise-hint');
let questionIndex = 0;
let checked = false;

function loadQuestion() {
  checked = false;
  const question = questions[questionIndex];
  const sentence = document.querySelector('#exercise-sentence');
  sentence.replaceChildren(document.createTextNode(question.before));
  const blank = document.createElement('span');
  blank.className = 'blank';
  blank.textContent = '...';
  sentence.append(blank, document.createTextNode(question.after));
  options.replaceChildren();
  question.options.forEach((text, index) => {
    const label = document.createElement('label');
    label.className = 'answer-option';
    const input = document.createElement('input');
    input.type = 'radio'; input.name = 'answer'; input.value = String(index); input.required = true;
    const letter = document.createElement('span'); letter.className = 'option-letter'; letter.textContent = String.fromCharCode(65 + index);
    const content = document.createElement('span'); content.lang = 'en'; content.textContent = text;
    const mark = document.createElement('span'); mark.className = 'answer-mark'; mark.setAttribute('aria-hidden', 'true');
    label.append(input, letter, content, mark); options.append(label);
  });
  document.querySelector('#exercise-count').textContent = `Przykład ${questionIndex + 1} z ${questions.length}`;
  document.querySelectorAll('.progress-dots i').forEach((dot, index) => dot.classList.toggle('active', index === questionIndex));
  feedback.hidden = true; feedback.replaceChildren();
  hint.textContent = 'Wybierz odpowiedź i sprawdź.';
  checkButton.innerHTML = 'Sprawdź <svg class="icon" aria-hidden="true"><use href="#i-check"/></svg>';
  options.querySelector('input').focus({ preventScroll: true });
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (checked) { questionIndex = (questionIndex + 1) % questions.length; loadQuestion(); return; }
  const selected = options.querySelector('input:checked');
  if (!selected) { hint.textContent = 'Najpierw wybierz odpowiedź.'; return; }
  const question = questions[questionIndex];
  const correct = Number(selected.value) === question.correct;
  options.querySelectorAll('label').forEach((label, index) => {
    const input = label.querySelector('input'); input.disabled = true;
    if (index === question.correct) { label.classList.add('is-correct'); label.querySelector('.answer-mark').textContent = '✓'; }
    else if (input.checked) { label.classList.add('is-wrong'); label.querySelector('.answer-mark').textContent = '×'; }
  });
  const title = document.createElement('strong');
  title.textContent = correct ? 'Dobrze! Wiesz też dlaczego?' : `Poprawna odpowiedź: ${String.fromCharCode(65 + question.correct)}. ${question.options[question.correct]}`;
  const description = document.createElement('span'); description.textContent = question.explanation;
  feedback.replaceChildren(title, description); feedback.hidden = false;
  hint.textContent = questionIndex === 2 ? 'To wszystkie przykłady. Spróbuj całego tematu.' : 'Mały krok. Konkretna reguła.';
  checkButton.innerHTML = (questionIndex === 2 ? 'Od początku' : 'Następne') + ' <svg class="icon" aria-hidden="true"><use href="#i-arrow"/></svg>';
  checked = true;
});

const flashButton = document.querySelector('.flash-demo');
flashButton.addEventListener('click', () => {
  const flipped = flashButton.getAttribute('aria-pressed') !== 'true';
  flashButton.setAttribute('aria-pressed', String(flipped));
  flashButton.setAttribute('aria-label', flipped ? 'Pokaż angielskie słowo' : 'Pokaż znaczenie słowa trustworthy');
  document.querySelector('#flash-label').textContent = flipped ? 'Znaczenie po polsku' : 'Cechy charakteru';
  const word = document.querySelector('#flash-word'); word.textContent = flipped ? 'godny zaufania' : 'trustworthy'; word.lang = flipped ? 'pl' : 'en';
  document.querySelector('#flash-example').textContent = flipped ? 'A trustworthy friend always keeps a promise.' : 'Someone you can always rely on.';
  document.querySelector('#flash-action').textContent = flipped ? 'Kliknij, aby wrócić do słowa' : 'Kliknij, aby odwrócić';
});

const moreTopics = [
  ['zycie-prywatne', 'Życie prywatne'], ['zywienie', 'Żywienie'], ['zakupy', 'Zakupy i usługi'],
  ['podroze', 'Podróżowanie i turystyka'], ['kultura', 'Kultura'], ['sport', 'Sport'],
  ['zdrowie', 'Zdrowie'], ['nauka-technika', 'Nauka i technika'], ['przyroda', 'Świat przyrody'], ['panstwo-spoleczenstwo', 'Państwo i społeczeństwo'],
];
const topicContainer = document.querySelector('#extra-topics');
moreTopics.forEach(([id, name], index) => {
  const link = document.createElement('a'); link.href = `https://maturaenglish.pl/tematy/${id}`; link.className = 'topic-tile';
  const top = document.createElement('div'); top.className = 'topic-tile-top'; top.textContent = String(index + 5).padStart(2, '0');
  const heading = document.createElement('h3'); heading.textContent = name;
  const arrow = document.createElement('span'); arrow.className = 'topic-arrow'; arrow.setAttribute('aria-hidden', 'true'); arrow.textContent = '↗';
  link.append(top, heading, arrow); topicContainer.append(link);
});
const topicsToggle = document.querySelector('#topics-toggle'); topicsToggle.hidden = false;
topicsToggle.addEventListener('click', () => {
  const expanded = topicsToggle.getAttribute('aria-expanded') !== 'true';
  topicsToggle.setAttribute('aria-expanded', String(expanded)); topicContainer.hidden = !expanded;
  topicsToggle.innerHTML = expanded ? 'Pokaż mniej tematów <span aria-hidden="true">−</span>' : 'Pokaż wszystkie 14 tematów <span aria-hidden="true">+</span>';
});

// Decorative icons inherit their accessible name from adjacent text.
document.querySelectorAll('svg.icon').forEach((icon) => { icon.setAttribute('aria-hidden', 'true'); icon.setAttribute('focusable', 'false'); });
