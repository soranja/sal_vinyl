// GSAP
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';

// Player Bar
import { initProgressBar } from './player.js';

// Trackers
import { createCenterMarker, trackAndUpdateCenter, initElementPositionUI, logRecordState } from './trackers.js';
import { initProximitySnap, isRecordSnapped } from './snap.js';

// Audio
const audio = new Audio('/audio/oh-dirty-fingers.mp3');
audio.loop = false;
audio.volume = 0.5;

gsap.registerPlugin(Draggable);

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#player-container').innerHTML = `
  <img id="player" src="/player/player.png" alt="player" class="relative max-h-full max-w-full select-none object-contain z-0 drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]" />
  <div id="record-wrapper" class="absolute aspect-square w-[75%]">
    <img id="record" src="/player/oh-dirty-fingers.png" alt="record" class="w-full h-full object-contain pointer-events-none drop-shadow-[0_6px_12px_rgba(0,0,0,0.6)]" />
  </div>
  <img id="needle" src="/player/needle.png" alt="needle" class="relative max-h-full max-w-full select-none object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]" />
`;

  const app = document.getElementById('app');
  const recordWrapper = document.getElementById('record-wrapper');
  const record = document.getElementById('record');
  const player = document.getElementById('player');
  const needle = document.getElementById('needle');
  const playButton = document.getElementById('play-button');

  const recordMarker = createCenterMarker('R', 'bg-yellow-700');
  const playerMarker = createCenterMarker('P', 'bg-purple-500');

  trackAndUpdateCenter(recordWrapper, recordMarker);
  trackAndUpdateCenter(player, playerMarker);

  initElementPositionUI([
    { id: 'record', el: recordWrapper },
    { id: 'player', el: player },
  ]);

  initProximitySnap(recordWrapper, player);

  let isPlaying = false;

  gsap.set(needle, { transformOrigin: '50% 20%' });
  gsap.set(recordWrapper, { x: -window.innerWidth - 0.45, y: 0 });
  gsap.set(record, { transformOrigin: '50% 50%' });

  let recordSpin = null;

  function createRecordSpin() {
    if (recordSpin) return;

    recordSpin = gsap.to(record, {
      rotation: 360,
      duration: 10,
      ease: 'none',
      repeat: -1,
      paused: true,
    });
  }
  createRecordSpin();

  initProgressBar(audio, record, recordSpin);

  Draggable.create(recordWrapper, {
    type: 'x,y',
    bounds: document.querySelector('#app'),
    onDragEnd: function () {
      logRecordState('🖱 Drag End');
      gsap.set(this.target, { x: this.x, y: this.y });

      if (!isRecordSnapped()) {
        recordSpin.pause();
        gsap.to(record, {
          rotation: 0,
          duration: 0.6,
          ease: 'power2.out',
          onComplete: () => {
            gsap.set(record, { rotation: 0 });
            recordSpin.kill();
            recordSpin = null;
            createRecordSpin();
          },
        });

        audio.pause();
        audio.currentTime = 0;
        isPlaying = false;
      }
    },
  });

  playButton.addEventListener('click', () => {
    logRecordState(isPlaying ? '🛑 Stop Click' : '▶️ Play Click');
    if (!isPlaying) {
      gsap.to(needle, { rotation: 30, duration: 0.8, ease: 'power2.out' });
      playButton.textContent = 'Stop';
      Draggable.get(recordWrapper).disable();

      if (isRecordSnapped()) {
        audio.play();
        createRecordSpin();
        recordSpin.play();
      }
    } else {
      gsap.to(needle, { rotation: 0, duration: 0.5, ease: 'power2.out' });
      playButton.textContent = 'Play';
      Draggable.get(recordWrapper).enable();

      audio.pause();
      recordSpin.pause();
    }
    isPlaying = !isPlaying;
  });

  audio.addEventListener('ended', () => {
    recordSpin.pause();
    gsap.to(needle, { rotation: 0, duration: 0.5, ease: 'power2.out' });
    playButton.textContent = 'Play';
    Draggable.get(recordWrapper).enable();
    isPlaying = false;
  });
});
