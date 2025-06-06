const MODAL_STORAGE_KEY = 'welcomeModalShown';

export function showWelcomeModal() {
  if (localStorage.getItem(MODAL_STORAGE_KEY)) return;

  const overlay = document.createElement('div');
  overlay.id = 'welcome-modal-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
  overlay.style.display = 'flex';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  overlay.style.zIndex = '9999';

  const modalBox = document.createElement('div');
  modalBox.style.background = '#111';
  modalBox.style.color = '#fff';
  modalBox.style.padding = '2rem';
  modalBox.style.borderRadius = '1rem';
  modalBox.style.maxWidth = '90vw';
  modalBox.style.maxHeight = '80vh';
  modalBox.style.boxShadow = '0 0 30px rgba(0,0,0,0.6)';
  modalBox.style.textAlign = 'center';
  modalBox.innerHTML = `
    <h2 class="text-2xl mb-4">Welcome to Soranja Records!</h2>
    <p class="text-base mb-6 italic">This project includes a small collection of music just for testing purposes. </br> All rights belong to the artists and their labels.</p>
    <button id="welcome-modal-close" class="px-4 py-2 bg-yellow-500 text-black font-bold rounded hover:bg-yellow-400 transition cursor-pointer">
      Okay!
    </button>
  `;

  overlay.appendChild(modalBox);
  document.body.appendChild(overlay);

  document.getElementById('welcome-modal-close').addEventListener('click', () => {
    localStorage.setItem(MODAL_STORAGE_KEY, 'true');
    document.body.removeChild(overlay);
  });
}
