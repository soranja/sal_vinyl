import gsap from 'gsap';
import { getSnappedRecord, getCurrentDraggedRecord } from './constants';

let instructionVideo = null;

export function isSafariWithHEVCAlphaSupport() {
  const ua = navigator.userAgent;

  const isApple = /Macintosh|iPhone|iPad|iPod/.test(ua);

  // Detect real Safari, exclude Chrome, Firefox, Edge, etc.
  const isRealSafari =
    ua.includes('Safari') &&
    !ua.includes('Chrome') &&
    !ua.includes('CriOS') &&
    !ua.includes('FxiOS') &&
    !ua.includes('EdgiOS') &&
    !ua.includes('OPiOS') &&
    !ua.includes('SamsungBrowser');

  const safariMatch = ua.match(/Version\/(\d+)\./);
  const safariVersion = safariMatch ? parseInt(safariMatch[1], 10) : 0;
  const supported = isRealSafari && isApple && safariVersion >= 13;

  return supported;
}

export function showDragInstruction() {
  const isLargeScreen = window.innerWidth >= 1024;
  const wrapper = isLargeScreen
    ? document.getElementById('record-info-wrapper')
    : document.getElementById('ready-area-threshold');
  const title = document.getElementById('record-title');
  const titleLg = document.getElementById('record-title-lg');
  const desc = document.getElementById('record-description');
  if (!wrapper || instructionVideo) return;

  const videoSrc = isSafariWithHEVCAlphaSupport() ? '/instructions/drag-ios.mov' : '/instructions/drag.webm';

  // Fade out title and description
  gsap.to([title, desc], {
    opacity: 0,
    duration: 0.5,
    onComplete: () => {
      title.classList.add('hidden');
      titleLg.classList.add('hidden');
      desc.classList.add('hidden');

      // Create video
      wrapper.innerHTML += `
        <video
          src=${videoSrc}
          autoplay
          loop
          muted
          playsinline
          class="max-w-[500px] w-full opacity-0 transition-opacity duration-300 ease-in"
        ></video>
      `;

      instructionVideo = wrapper.querySelector('video:last-of-type');

      if (isLargeScreen) {
        instructionVideo.classList.add('static');
      } else {
        instructionVideo.classList.add('absolute', 'top-1/4');
      }

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

  const hasNoSnapped = !getSnappedRecord();
  const isNotDragging = !getCurrentDraggedRecord();

  if (hasNoSnapped && isNotDragging) {
    gsap.to(playerWrapper, { opacity: 0.5, duration: 0.4, ease: 'power2.out' });
  } else {
    gsap.to(playerWrapper, { opacity: 1, duration: 0.4, ease: 'power2.out' });
  }
}
