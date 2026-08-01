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

// --- Profil-Lightbox (Vollbild-Fotos mit Wisch-Navigation) ---
const lbPhotoClasses = ['thumb-1', 'thumb-2', 'thumb-3', 'thumb-4', 'thumb-5'];
let lbIndex = 0;
let touchStartX = 0;

function openLightbox(index) {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  lbIndex = index;
  renderLightbox();
  lb.classList.add('open');
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
}

function lbNav(dir) {
  lbIndex = (lbIndex + dir + lbPhotoClasses.length) % lbPhotoClasses.length;
  renderLightbox();
}

function renderLightbox() {
  const photo = document.getElementById('lbPhoto');
  photo.className = 'lb-photo ' + lbPhotoClasses[lbIndex];
  const dotsWrap = document.getElementById('lbDots');
  dotsWrap.innerHTML = '';
  lbPhotoClasses.forEach((_, i) => {
    const dot = document.createElement('span');
    if (i === lbIndex) dot.classList.add('active');
    dotsWrap.appendChild(dot);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.chip-group').forEach((group) => {
    const max = parseInt(group.dataset.max || '99', 10);
    group.querySelectorAll('.chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        const selectedInGroup = [...group.querySelectorAll('.chip.selected')];
        if (chip.classList.contains('selected')) {
          chip.classList.remove('selected');
        } else {
          if (max === 1) {
            selectedInGroup.forEach((c) => c.classList.remove('selected'));
          } else if (selectedInGroup.length >= max) {
            selectedInGroup[0].classList.remove('selected');
          }
          chip.classList.add('selected');
          chip.classList.remove('ai-suggested');
        }
      });
    });
  });
});

// --- "Über mich"-Vorschlag: Regenerieren ---
const aboutMeSuggestions = [
  "Kochen mit zu lauter Musik, tiefe Balkongespräche und die Überzeugung, dass jede Reise mit zu viel Gepäck beginnt — das bin so ziemlich ich.",
  "Ich glaube an ehrliche Gespräche, spontane Ausflüge und daran, dass man auch mit 29 noch nicht alles wissen muss.",
  "Zwischen Yoga-Matte und Kochtopf zu Hause, am liebsten mit Musik, die zu laut für die Nachbarn ist."
];
let aboutMeIndex = 0;
function regenerateAboutMe() {
  aboutMeIndex = (aboutMeIndex + 1) % aboutMeSuggestions.length;
  const field = document.getElementById('aboutMeText');
  if (field) field.value = aboutMeSuggestions[aboutMeIndex];
}

document.addEventListener('DOMContentLoaded', () => {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  lb.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; });
  lb.addEventListener('touchend', (e) => {
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (diff > 50) lbNav(-1);
    else if (diff < -50) lbNav(1);
  });
  lb.addEventListener('click', (e) => {
    if (e.target === lb) closeLightbox();
  });
});
