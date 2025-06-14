import gsap from 'gsap';
import { getSnappedRecord, getCurrentDraggedRecord } from './constants';

let instructionVideo = null;

export function showDragInstruction() {
  const wrapper = document.getElementById('record-info-wrapper');
  const title = document.getElementById('record-title');
  const desc = document.getElementById('record-description');
  if (!wrapper || instructionVideo) return;

  // Fade out title and description
  gsap.to([title, desc], {
    opacity: 0,
    duration: 0.3,
    onComplete: () => {
      title.classList.add('hidden');
      desc.classList.add('hidden');

      // Create video
      wrapper.innerHTML += `
        <video
          src="public/instructions/drag.webm"
          autoplay
          loop
          muted
          playsinline
          class="max-w-[500px] w-full opacity-0 transition-opacity duration-300 ease-in fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:static lg:left-auto lg:top-auto lg:translate-x-0 lg:translate-y-0 z-[100]"
        ></video>
      `;
      instructionVideo = wrapper.querySelector('video:last-of-type');

      wrapper.appendChild(instructionVideo);

      // Fade in video
      requestAnimationFrame(() => {
        instructionVideo.style.opacity = '0';
        requestAnimationFrame(() => {
          instructionVideo.style.opacity = '1';
        });
      });
    },
  });
}

export function hideDragInstruction() {
  const title = document.getElementById('record-title');
  const desc = document.getElementById('record-description');

  if (!instructionVideo) return;

  // Fade out video
  instructionVideo.style.opacity = '0';
  setTimeout(() => {
    if (instructionVideo && instructionVideo.parentElement) {
      instructionVideo.parentElement.removeChild(instructionVideo);
      instructionVideo = null;

      // Fade in title and description
      title.classList.remove('hidden');
      if (window.innerWidth >= 1024) {
        desc.classList.remove('hidden');
      }

      gsap.to([title, desc], {
        opacity: 1,
        duration: 0.4,
      });
    }
  }, 300);
}

export function updatePlayerWrapperOpacity() {
  const playerWrapper = document.getElementById('player-wrapper');
  if (!playerWrapper) return;

  const isSmallScreen = window.innerWidth < 1024;
  const hasNoSnapped = !getSnappedRecord();
  const isNotDragging = !getCurrentDraggedRecord();

  if (isSmallScreen && hasNoSnapped && isNotDragging) {
    gsap.to(playerWrapper, { opacity: 0.5, duration: 0.4, ease: 'power2.out' });
  } else {
    gsap.to(playerWrapper, { opacity: 1, duration: 0.4, ease: 'power2.out' });
  }
}
