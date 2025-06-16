import { showDragInstruction, isSafariWithHEVCAlphaSupport } from './instructions.js';
import { getSnappedRecord } from './constants.js';

const MODAL_STORAGE_KEY = 'welcomeModalShown';

export function showWelcomeModal() {
  if (localStorage.getItem(MODAL_STORAGE_KEY)) return;

  const welcomeVideoSrc = isSafariWithHEVCAlphaSupport()
    ? '/instructions/welcome-ios.mov'
    : '/instructions/welcome.webm';

  const overlay = document.createElement('div');
  overlay.id = 'welcome-modal-overlay';
  overlay.innerHTML = `
    <div class="bg-[#111] text-white p-8 rounded-xl max-w-[90vw] max-h-[80vh] shadow-2xl text-center flex flex-col items-center">
      <div class="relative inline-block w-full max-w-[200px] lg:max-w-[300px]">
        <video autoplay muted loop playsinline nocontrols
          src="${welcomeVideoSrc}"
          class="bg-transparent mix-blend-normal isolate w-full h-auto rounded-lg">
        </video>
      </div>
      <p class="text-sm lg:text-base mb-2 mt-4 pointer-events-none max-w-xs lg:max-w-xl">
        This project includes a small collection of music just for testing purposes. <br/> All rights belong to the artists and their labels.
      </p>
      <p class="text-xs lg:text-sm italic mt-2 mb-6 text-gray-600 pointer-events-none">
        This is a one-time message.
      </p>
      <button id="welcome-modal-close" class="px-4 py-2 bg-yellow-500 text-black font-bold rounded hover:bg-yellow-400 transition cursor-pointer">
        Okay!
      </button>
    </div>
  `;
  overlay.className = 'fixed inset-0 bg-black/85 flex justify-center items-center z-[9999]';
  const modalBox = overlay.firstElementChild;

  overlay.appendChild(modalBox);
  document.body.appendChild(overlay);

  document.getElementById('welcome-modal-close').addEventListener('click', () => {
    localStorage.setItem(MODAL_STORAGE_KEY, 'true');
    document.body.removeChild(overlay);
    if (!getSnappedRecord()) showDragInstruction();
  });
}
