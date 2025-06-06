import { gsap } from 'gsap';
import { setRecordSpin, getRecordSpin } from './constants';

const needle = document.getElementById('needle');
gsap.set(needle, { transformOrigin: '50% 20%' });

export function updateNeedle(audio, needle) {
  const ratio = audio.currentTime / audio.duration;
  const needleRotation = 30 + (45 - 30) * ratio;
  gsap.set(needle, { rotation: needleRotation });

  if (!audio.paused) {
    requestAnimationFrame(() => updateNeedle(audio, needle));
  }
}

export function createRecordSpin(record) {
  const existing = getRecordSpin();
  if (existing?.isActive()) return;
  existing?.kill();

  const spin = gsap.to(record, {
    rotation: '+=360',
    duration: 10,
    ease: 'none',
    repeat: -1,
    paused: true,
  });

  setRecordSpin(spin);
}

export function fadeInRecordInfo(meta) {
  const titleEl = document.getElementById('record-title');
  const descEl = document.getElementById('record-description');
  const bgElem = document.getElementById('ready-area-background');
  if (!titleEl || !descEl || !bgElem) return;

  const isLargeScreen = window.innerWidth >= 1024;

  // Prepare: hide the texts, reset opacities
  titleEl.classList.add('hidden');
  descEl.classList.add('hidden');
  gsap.set([titleEl, descEl, bgElem], { opacity: 0 });

  const tl = gsap.timeline();
  // 1) fade‐out old BG
  tl.to(bgElem, { opacity: 0, duration: 0.5 })

    // 2) swap in new text + background image
    .add(() => {
      titleEl.textContent = meta.title;
      descEl.textContent = meta.description;
      bgElem.style.backgroundImage = `url(${meta.background})`;
    })

    // 3) fade‐in BG, then reveal + fade‐in text
    .to(bgElem, { opacity: 0.2, duration: 0.5 }, '>')

    .to(
      [titleEl],
      {
        opacity: 1,
        duration: 0.5,
        onStart: () => {
          titleEl.classList.remove('hidden');
        },
      },
      '<',
    );

  if (isLargeScreen) {
    tl.to(
      [descEl],
      {
        opacity: 1,
        duration: 0.5,
        onStart: () => {
          descEl.classList.remove('hidden');
        },
      },
      '<',
    );
  }
}

export function fadeOutRecordInfo() {
  const titleEl = document.getElementById('record-title');
  const descEl = document.getElementById('record-description');
  const bgElem = document.getElementById('ready-area-background');
  if (!titleEl || !descEl || !bgElem) return;

  // fade everything out
  gsap.to([bgElem, titleEl, descEl], {
    opacity: 0,
    duration: 0.5,
    onComplete: () => {
      // then clear + hide text again
      titleEl.classList.add('hidden');
      descEl.classList.add('hidden');
      titleEl.textContent = '';
      descEl.textContent = '';
      // clear BG override so default CSS tiling shows
      bgElem.style.backgroundImage = '';
    },
  });
}
