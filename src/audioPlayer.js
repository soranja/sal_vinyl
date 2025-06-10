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

// AUDIO PLAYER LAUNCHER
export function initAudioPlayer() {
  const needle = document.getElementById('needle');
  const playButton = document.getElementById('play-button');
  const barWrapper = document.getElementById('progress-bar-wrapper');
  const barFill = document.getElementById('progress-bar-fill');
  const pointer = document.getElementById('progress-bar-pointer');
  const volumeControl = document.getElementById('volume-control');

  // Updates PROGRESS BAR POINTER visibility
  function updatePointerState() {
    pointer.style.visibility = isRecordReady() ? 'visible' : 'hidden';
    pointer.style.opacity = isRecordReady() ? '1' : '0';
    pointer.style.cursor = isRecordReady() ? 'pointer' : 'default';
  }

  // Updates PROGRESS BAR fill and ITS POINTER POS according to the audio
  function updateProgressBar() {
    const audio = getCurrentAudio();
    if (!audio) return;

    const ratio = audio.currentTime / audio.duration;
    const barWidth = barWrapper.offsetWidth;
    const maxX = barWidth - pointer.offsetWidth;
    const newX = ratio * maxX;

    gsap.set(barFill, { width: newX });
    gsap.set(pointer, { x: newX });

    updatePointerState();
    if (!audio.paused) requestAnimationFrame(updateProgressBar);
  }

  // Resets PROGRESS BAR fill and ITS POINTER POS
  function resetProgressBar() {
    gsap.set(barFill, { width: 0 });
    gsap.set(pointer, { x: 0 });
  }

  // Controls and visualises VOLUME BAR
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

  // Updates PROGRESS BAR DRAG (By Frame)
  requestAnimationFrame(() => {
    const barWidth = barWrapper.offsetWidth;
    const maxX = barWidth - pointer.offsetWidth;

    Draggable.create(pointer, {
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
        gsap.set(record, { rotation: ratio * 360 }); // this and recordSpin relation, conflict?
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

        updatePointerState();
      },
    });

    updatePointerState();
  });

  // PLAY & PAUSE BUTTON CLICK Logic
  playButton.addEventListener('click', () => {
    if (!isRecordReady()) return;

    const currentAudio = getCurrentAudio();
    const currentRecord = getCurrentRecord();
    const vinylWrapper = currentRecord.querySelector('#vinyl-wrapper');
    if (!currentAudio || !currentRecord) return;

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
              // Draggable.get(currentRecord)?.enable();
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
              updatePointerState();
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
    updatePointerState();
  });

  // Natural play? Unnecesary?
  // document.addEventListener(
  //   'play',
  //   () => {
  //     const currentAudio = getCurrentAudio();
  //     if (currentAudio) updateProgressBar();
  //   },
  //   true,
  // );

  // KEY CONTROLS
  document.addEventListener('keydown', (e) => {
    const audio = getCurrentAudio();
    const record = getCurrentRecord();
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
        // Works but stacks with the recordSpin rotation and resets on the end / pause is broken
        // gsap.to(record, {
        //   rotation: '-=10',
        //   duration: 0,
        //   ease: 'power2.out',
        // });
        updateProgressBar();
        break;

      case 'ArrowRight':
        e.preventDefault();
        audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
        // gsap.to(record, {
        //   rotation: '+=10',
        //   duration: 0,
        //   ease: 'power2.out',
        // });
        updateProgressBar();
        break;
    }
  });
} // Rotation not working, needle brakes on arrow keys wind
