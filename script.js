// --- Registrierung: einfache Client-seitige Validierung (Demo, kein echtes Backend) ---
function handleRegisterSubmit(e) {
  e.preventDefault();
  const form = e.target;
  let valid = true;

  const birthdate = form.querySelector('#birthdate');
  const birthField = birthdate.closest('.field');
  const age = calcAge(birthdate.value);
  if (!birthdate.value || age < 18) {
    birthField.classList.add('invalid');
    valid = false;
  } else {
    birthField.classList.remove('invalid');
  }

  const terms = form.querySelector('#acceptTerms');
  if (!terms.checked) {
    valid = false;
    terms.closest('.check-row').style.color = '#E8624A';
  }

  if (valid) {
    window.location.href = 'quiz.html';
  }
  return false;
}

function calcAge(dateStr) {
  if (!dateStr) return 0;
  const birth = new Date(dateStr);
  const diff = Date.now() - birth.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}

function handleLoginSubmit(e) {
  e.preventDefault();
  window.location.href = 'profil.html';
  return false;
}

// --- Werte-Quiz ---
const quizSteps = document.querySelectorAll('.quiz-step');
let currentStep = 0;
const selections = {};

function initQuiz() {
  if (!quizSteps.length) return;
  document.querySelectorAll('.option').forEach((opt) => {
    opt.addEventListener('click', () => toggleOption(opt));
  });
  updateProgress();
}

function toggleOption(opt) {
  const group = opt.closest('.quiz-step').dataset.step;
  const max = parseInt(opt.closest('.options').dataset.max || '99', 10);
  selections[group] = selections[group] || [];

  const already = opt.classList.contains('selected');
  if (already) {
    opt.classList.remove('selected');
    selections[group] = selections[group].filter((v) => v !== opt.dataset.value);
  } else {
    if (selections[group].length >= max) {
      const options = [...opt.closest('.options').children];
      const oldest = options.find((o) => o.classList.contains('selected'));
      if (oldest) {
        oldest.classList.remove('selected');
        selections[group] = selections[group].filter((v) => v !== oldest.dataset.value);
      }
    }
    opt.classList.add('selected');
    selections[group].push(opt.dataset.value);
  }
}

function nextStep() {
  if (currentStep < quizSteps.length - 1) {
    quizSteps[currentStep].classList.remove('active');
    currentStep++;
    quizSteps[currentStep].classList.add('active');
    updateProgress();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function prevStep() {
  if (currentStep > 0) {
    quizSteps[currentStep].classList.remove('active');
    currentStep--;
    quizSteps[currentStep].classList.add('active');
    updateProgress();
  }
}

function updateProgress() {
  const fill = document.querySelector('.progress-fill');
  const label = document.querySelector('.quiz-progress-label .current');
  if (fill) fill.style.width = `${((currentStep + 1) / quizSteps.length) * 100}%`;
  if (label) label.textContent = currentStep + 1;
}

document.addEventListener('DOMContentLoaded', initQuiz);
