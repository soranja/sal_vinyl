import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { createRecordSpin, updateNeedle } from './animations';
import { enableAllDraggables, disableAllDraggables } from './drag';
import {
  setRecordSpin,
  setPlayState,
  isRecordReady,
  isPlayed,
  getRecordSpin,
  getCurrentAudio,
  getCurrentRecord,
} from './constants';

gsap.registerPlugin(Draggable);

export function updatePointerVisibility() {
  const pointerWrapper = document.getElementById('progress-pointer-wrapper');

  if (pointerWrapper) {
    gsap.to(pointerWrapper, {
      autoAlpha: isRecordReady() ? 1 : 0,
      duration: 0.3,
      overwrite: 'auto',
    });
  }
}

export function initAudioPlayer() {
  const needle = document.getElementById('needle');
  const barWrapper = document.getElementById('progress-bar-wrapper');
  const barFill = document.getElementById('progress-bar-fill');
  const pointerWrapper = document.getElementById('progress-pointer-wrapper');
  const pointer = document.getElementById('progress-bar-pointer');
  const volumeControl = document.getElementById('volume-control');

  function updateProgressBar() {
    const audio = getCurrentAudio();
    if (!audio) return;

    const ratio = audio.currentTime / audio.duration;
    const barWidth = barWrapper.offsetWidth;
    const maxX = barWidth - pointerWrapper.offsetWidth;
    const newX = ratio * maxX;

    gsap.set(barFill, { width: newX });
    gsap.set(pointerWrapper, { x: newX });

    updatePointerVisibility();
    if (!audio.paused) requestAnimationFrame(updateProgressBar);
  }

  function resetProgressBar() {
    gsap.set(barFill, { width: 0 });
    gsap.set(pointerWrapper, { x: 0 });
    gsap.to(pointer, {
      autoAlpha: isRecordReady() ? 1 : 0,
      duration: 0.3,
    });
  }

  function setVolume(volume) {
    volume = Math.min(1, Math.max(0, volume));
    volumeControl.value = volume.toFixed(2);
    const audio = getCurrentAudio();
    if (audio) audio.volume = volume;
    const cent = Math.round(volume * 100) + '%';
    volumeControl.style.setProperty('--volume-percent', cent);
  }

  setVolume(parseFloat(volumeControl.value) || 0);

  volumeControl.addEventListener('input', () => {
    setVolume(parseFloat(volumeControl.value));
  });

  // PROGRESS BAR DRAG Logic (by frame)
  requestAnimationFrame(() => {
    const barWidth = barWrapper.offsetWidth;
    const maxX = barWidth - pointerWrapper.offsetWidth;

    Draggable.create(pointerWrapper, {
      type: 'x',
      bounds: { minX: 0, maxX },
      allowEventDefault: false,
      onPress(e) {
        e.stopPropagation();
        if (!isRecordReady()) {
          e.preventDefault();
          return false;
        }
      },
      onDragStart: function () {
        if (!isRecordReady()) return false;

        const audio = getCurrentAudio();
        if (audio) audio.pause();

        const recordSpin = getRecordSpin();
        if (recordSpin) recordSpin.pause();
      },
      onDrag: function () {
        if (!isRecordReady()) return;

        const audio = getCurrentAudio();
        const record = getCurrentRecord();

        if (!audio || !record) return;

        const ratio = this.x / maxX;
        audio.currentTime = ratio * audio.duration;

        gsap.set(barFill, { width: this.x });
        gsap.set(record, { rotation: ratio * 360 });
        gsap.set(needle, { rotation: 30 + (45 - 30) * ratio, zIndex: 51 });
      },
      onDragEnd: function () {
        if (!isRecordReady()) return;

        const audio = getCurrentAudio();
        const record = getCurrentRecord();
        const recordSpin = getRecordSpin();

        if (!audio || !record) return;

        const ratio = this.x / maxX;
        audio.currentTime = ratio * audio.duration;

        if (isPlayed()) {
          audio.play();
          if (recordSpin && !recordSpin.isActive()) recordSpin.play();
          updateProgressBar();
        }

        updatePointerVisibility();
      },
    });

    updatePointerVisibility();
  });

  function handlePlayClick() {
    if (!isRecordReady()) return;

    const currentAudio = getCurrentAudio();
    const currentRecord = getCurrentRecord();
    const vinylWrapper = currentRecord.querySelector('#vinyl-wrapper');
    if (!currentAudio || !currentRecord) return;

    if (currentAudio.preload === 'none') {
      currentAudio.preload = 'auto';
      currentAudio.load();
    }

    currentAudio.addEventListener('progress', () => {
      if (!currentAudio.duration || !currentAudio.buffered.length) return;
      const bufferedEnd = currentAudio.buffered.end(currentAudio.buffered.length - 1);
      const pct = (bufferedEnd / currentAudio.duration) * 100;
      document.getElementById('buffer-bar-fill').style.width = pct + '%';
    });

    currentAudio.volume = parseFloat(volumeControl.value);

    if (!isPlayed()) {
      disableAllDraggables();
      needle.style.zIndex = 51;

      const currentSpin = getRecordSpin();
      if (!currentSpin || !currentSpin.isActive()) {
        currentSpin?.kill();
        setRecordSpin(null);
        createRecordSpin(vinylWrapper);
      }

      const targetNeedle = 30 + (45 - 30) * (currentAudio.currentTime / currentAudio.duration);

      gsap.killTweensOf(currentRecord);
      gsap.killTweensOf(vinylWrapper);

      gsap.to(needle, {
        rotation: targetNeedle,
        duration: 0.4,
        ease: 'power2.out',
        onStart: () => {
          document.getElementById('play-icon').src = '/ui/pause.svg';
          Draggable.get(currentRecord)?.disable();
        },
        onComplete: () => {
          currentAudio.play();
          getRecordSpin()?.play();
          updateNeedle(currentAudio, needle);
          updateProgressBar();

          currentAudio.addEventListener(
            'ended',
            () => {
              enableAllDraggables();
              needle.style.zIndex = 5;
              getRecordSpin()?.pause();

              gsap.to(vinylWrapper, { rotation: 0, duration: 1, ease: 'power2.out' });

              gsap.to(needle, {
                rotation: 0,
                duration: 0.5,
                ease: 'power2.out',
                onStart: () => {
                  document.getElementById('play-icon').src = '/ui/play.svg';
                },
              });

              resetProgressBar();
              currentAudio.currentTime = 0;
              setPlayState(false);
              updatePointerVisibility();
            },
            { once: true },
          );
        },
      });
    } else {
      enableAllDraggables();
      needle.style.zIndex = 5;
      currentAudio.pause();
      getRecordSpin()?.pause();

      gsap.to(needle, {
        rotation: 0,
        duration: 0.5,
        ease: 'power2.out',
        onStart: () => {
          document.getElementById('play-icon').src = '/ui/play.svg';
          Draggable.get(currentRecord)?.enable();
        },
      });
    }

    setPlayState(!isPlayed());
    updatePointerVisibility();
  }

  // PLAY & PAUSE Logic (click & keydowns)
  document.body.addEventListener('click', (e) => {
    if (e.target.id === 'play-button') {
      handlePlayClick();
    }
  });

  document.addEventListener('keydown', (e) => {
    const audio = getCurrentAudio();
    const record = getCurrentRecord();
    if (!audio) return;

    switch (e.code) {
      case 'Space':
        handlePlayClick();
        break;

      case 'ArrowUp':
        e.preventDefault();
        setVolume(getCurrentAudio().volume + 0.1);
        break;

      case 'ArrowDown':
        e.preventDefault();
        setVolume(getCurrentAudio().volume - 0.1);
        break;

      case 'ArrowLeft':
        e.preventDefault();
        audio.currentTime = Math.max(0, audio.currentTime - 5);
        gsap.to(record, {
          rotation: '-=10',
          duration: 0,
          ease: 'power2.out',
        });
        updateProgressBar();
        break;

      case 'ArrowRight':
        e.preventDefault();
        audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
        gsap.to(record, {
          rotation: '+=10',
          duration: 0,
          ease: 'power2.out',
        });
        updateProgressBar();
        break;
    }
  });
}
