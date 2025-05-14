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
