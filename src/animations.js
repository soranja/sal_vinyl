import { gsap } from 'gsap';
import { setRecordSpin, getRecordSpin } from './constants';
import { startMarquee, stopMarquee } from './marquee';

const needle = document.getElementById('needle');
gsap.set(needle, { transformOrigin: '50% 20%' });

export function updateNeedle(audio, needle) {
  const ratio = audio.currentTime / audio.duration;
  const needleRotation = 30 + (45 - 30) * ratio;
  gsap.set(needle, { rotation: needleRotation });
  if (!audio.paused) requestAnimationFrame(() => updateNeedle(audio, needle));
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
  const title = document.getElementById('record-title');
  const titleLg = document.getElementById('record-title-lg');
  const desc = document.getElementById('record-description');
  const bgElem = document.getElementById('ready-area-background');
  const wrapper = document.getElementById('record-title-wrapper');
  if (!title || !titleLg || !desc || !bgElem || !wrapper) return;

  gsap.killTweensOf([title, titleLg, desc, bgElem]);
  stopMarquee(title);

  const isLarge = window.innerWidth >= 1024;
  [title, titleLg, desc].forEach((el) => {
    el.classList.add('hidden');
    gsap.set(el, { opacity: 0 });
  });
  gsap.set(bgElem, { opacity: 0 });

  const tl = gsap.timeline();
  tl.to(bgElem, { opacity: 0, duration: 0.5 })
    .add(() => {
      title.textContent = meta.title;
      titleLg.textContent = meta.title;
      desc.textContent = meta.description;
      bgElem.style.backgroundImage = `url(${meta.background})`;
    })
    .to(bgElem, { opacity: 0.2, duration: 0.5 }, '>');

  if (isLarge) {
    tl.to(titleLg, { opacity: 1, duration: 0.5, onStart: () => titleLg.classList.remove('hidden') }, '<');
    tl.to(desc, { opacity: 1, duration: 0.5, onStart: () => desc.classList.remove('hidden') }, '<');
  } else {
    tl.to(
      title,
      {
        opacity: 1,
        duration: 0.5,
        onStart: () => title.classList.remove('hidden'),
        onComplete: () => startMarquee(title, wrapper),
      },
      '<',
    );
  }
}

export function fadeOutRecordInfo() {
  const title = document.getElementById('record-title');
  const titleLg = document.getElementById('record-title-lg');
  const desc = document.getElementById('record-description');
  const bgElem = document.getElementById('ready-area-background');
  if (!title || !titleLg || !desc || !bgElem) return;

  // stop any marquee in flight
  stopMarquee(title);

  // clear transforms
  title.style.transition = 'none';
  title.style.transform = 'translateX(0)';

  gsap.to([title, titleLg, desc, bgElem], {
    opacity: 0,
    duration: 0.5,
    onComplete: () => {
      title.classList.add('hidden');
      titleLg.classList.add('hidden');
      desc.classList.add('hidden');
      title.textContent = '';
      desc.textContent = '';
      bgElem.style.backgroundImage = '';
    },
  });
}
