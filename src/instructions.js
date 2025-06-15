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

  // Extract Safari version (if available)
  const safariMatch = ua.match(/Version\/(\d+)\./);
  const safariVersion = safariMatch ? parseInt(safariMatch[1], 10) : 0;

  const supported = isRealSafari && isApple && safariVersion >= 13;

  // Console and UI debug
  console.log(`[HEVC Alpha Detection]
  ua: ${ua}
  isRealSafari: ${isRealSafari}
  isAppleDevice: ${isApple}
  safariVersion: ${safariVersion}
  HEVC alpha supported: ${supported}
  `);

  const debugDiv = document.createElement('div');
  debugDiv.textContent = `[HEVC Detect] ${supported ? '✅ Supported' : '❌ Not Supported'} | UA: ${ua}`;
  debugDiv.style.cssText = `
    position: fixed; bottom: 0; left: 0;
    background: rgba(0,0,0,0.85); color: white;
    font-size: 10px; padding: 5px 8px; z-index: 99999;
    max-width: 100vw; overflow: hidden; white-space: nowrap;
  `;
  document.body.appendChild(debugDiv);

  return supported;
}

export function showDragInstruction() {
  const wrapper = document.getElementById('record-info-wrapper');
  const title = document.getElementById('record-title');
  const desc = document.getElementById('record-description');
  if (!wrapper || instructionVideo) return;

  const videoSrc = isSafariWithHEVCAlphaSupport() ? '/instructions/drag-ios.mov' : '/instructions/drag.webm';

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
          src="/instructions/drag-ios.mov"
          autoplay
          loop
          muted
          playsinline
          class="max-w-[500px] w-full opacity-0 transition-opacity duration-300 ease-in fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:static lg:left-auto lg:top-auto lg:translate-x-0 lg:translate-y-0 z-[100]"
          style="background-color: transparent; mix-blend-mode: normal; isolation: isolate;"
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
