import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { createRecordSpin, updateNeedle } from './animations';
import {
  setRecordSpin,
  setPlayState,
  isRecordReady,
  isPlayed,
  getRecordSpin,
  getCurrentAudio,
  getCurrentRecord,
} from './constants';
import { enableAllDraggables, disableAllDraggables } from './drag';

gsap.registerPlugin(Draggable);

export function initAudioPlayer() {
  const needle = document.getElementById('needle');
  const playButton = document.getElementById('play-button');
  const barWrapper = document.getElementById('progress-bar-wrapper');
  const barFill = document.getElementById('progress-bar-fill');
  const pointer = document.getElementById('progress-bar-pointer');
  const volumeControl = document.getElementById('volume-control');
  const message = document.getElementById('record-message');

  // function showMessage() {
  //   message.classList.remove('opacity-0');
  //   clearTimeout(message._timeout);
  //   message._timeout = setTimeout(() => {
  //     message.classList.add('opacity-0');
  //   }, 2000);
  // }

  function updatePointerState() {
    pointer.style.visibility = isRecordReady() ? 'visible' : 'hidden';
    pointer.style.opacity = isRecordReady() ? '1' : '0';
    pointer.style.cursor = isRecordReady() ? 'pointer' : 'default';
  }

  function updateProgress() {
    const audio = getCurrentAudio();
    if (!audio) return;

    const ratio = audio.currentTime / audio.duration;
    const barWidth = barWrapper.offsetWidth;
    const maxX = barWidth - pointer.offsetWidth;
    const newX = ratio * maxX;

    gsap.set(barFill, { width: newX });
    gsap.set(pointer, { x: newX });

    updatePointerState();
    if (!audio.paused) requestAnimationFrame(updateProgress);
  }

  function resetProgressBar() {
    gsap.set(barFill, { width: 0 });
    gsap.set(pointer, { x: 0 });
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

  requestAnimationFrame(() => {
    const barWidth = barWrapper.offsetWidth;
    const maxX = barWidth - pointer.offsetWidth;

    Draggable.create(pointer, {
      type: 'x',
      bounds: { minX: 0, maxX },
      onPress: () => {
        if (!isRecordReady()) return false;
      },
      onDragStart: function () {
        if (!isRecordReady()) return false;
        const audio = getCurrentAudio();
        const recordSpin = getRecordSpin();
        if (audio) audio.pause();
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
          updateProgress();
        }

        updatePointerState();
      },
    });

    updatePointerState();
  });

  playButton.addEventListener('click', () => {
    if (!isRecordReady()) return;

    const currentAudio = getCurrentAudio();
    const currentRecord = getCurrentRecord();
    const vinylWrapper = currentRecord.querySelector('#vinyl-wrapper');
    if (!currentAudio || !currentRecord) return;

    currentAudio.volume = parseFloat(volumeControl.value);

    if (!isPlayed()) {
      disableAllDraggables();
      const currentSpin = getRecordSpin();
      needle.style.zIndex = 51;

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
          updateProgress();

          currentAudio.addEventListener(
            'ended',
            () => {
              getRecordSpin()?.pause();
              Draggable.get(currentRecord)?.enable();
              enableAllDraggables();
              needle.style.zIndex = 5;
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
              updatePointerState();
            },
            { once: true },
          );
        },
      });
    } else {
      enableAllDraggables();
      currentAudio.pause();
      getRecordSpin()?.pause();
      needle.style.zIndex = 5;

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
    updatePointerState();
  });

  document.addEventListener(
    'play',
    () => {
      const currentAudio = getCurrentAudio();
      if (currentAudio) updateProgress();
    },
    true,
  );

  document.addEventListener('keydown', (e) => {
    const audio = getCurrentAudio();
    if (!audio) return;

    switch (e.code) {
      case 'Space':
        e.preventDefault();
        playButton.click();
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
        updateProgress();
        break;

      case 'ArrowRight':
        e.preventDefault();
        audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
        updateProgress();
        break;
    }
  });
}
