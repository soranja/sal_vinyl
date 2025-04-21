import gsap from 'gsap';
import { readyPos, records } from './constants';

let dotsVisible = false;
let debugVisible = false;

const areas = ['init-area', 'ready-area'];
const snapZones = ['init-area-threshold', 'ready-area-threshold'];

function createDebugPanel() {
  const debugPanel = document.createElement('div');
  debugPanel.id = 'debug-panel';
  debugPanel.className = 'fixed top-2 right-2 z-[1500] bg-black/80 text-white p-3 rounded space-y-2 text-sm';
  debugPanel.innerHTML = `
    <label><input type="checkbox" id="toggle-areas"/>Areas</label><br/>
    <label><input type="checkbox" id="toggle-snap-zones"/>Snap Zones</label><br/>
    <label><input type="checkbox" id="toggle-dots"/>Position Dots</label><br/>
    <label><input type="checkbox" id="toggle-state-panel"/>State Panel</label>
  `;
  document.body.appendChild(debugPanel);
}

function applyDebugVisibility() {
  document.getElementById('toggle-areas').onchange = (e) => {
    areas.forEach((area) => {
      const el = document.getElementById(area);
      el.style.outline = e.target.checked ? '2px solid rgba(0, 123, 255, 0.6)' : 'none';
    });
  };

  document.getElementById('toggle-snap-zones').onchange = (e) => {
    snapZones.forEach((id) => {
      const el = document.getElementById(id);
      el.style.outline = e.target.checked ? '2px dashed rgba(0, 255, 0, 0.5)' : 'none';
    });
  };

  document.getElementById('toggle-dots').onchange = (e) => {
    dotsVisible = e.target.checked;
    document.querySelectorAll('.debug-dot').forEach((el) => {
      el.style.display = dotsVisible ? 'block' : 'none';
    });

    updateStaticDots(dotsVisible);
  };

  document.getElementById('toggle-state-panel').onchange = (e) => {
    const statePanel = document.getElementById('state-panel');
    if (statePanel) statePanel.style.display = e.target.checked ? 'block' : 'none';
  };
}

function initStatePanel(elements = []) {
  const statePanel = document.createElement('div');
  statePanel.id = 'state-panel';
  statePanel.className = 'absolute bottom-2 right-2 space-y-1 z-50 text-xs flex flex-col';
  statePanel.classList.add('debug-toggleable');
  statePanel.style.display = 'none';

  statePanel.innerHTML = elements
    .map(({ id }) => `<div id="${id}-pos" class="bg-black/70 text-white px-2 py-1 rounded">${id}: --</div>`)
    .join('');

  document.body.appendChild(statePanel);

  const flagList = [
    'isInInitArea',
    'isInInitSnapZone',
    'isReadyForInitSnap',
    'initSnapped',
    'initDragged',
    'isInReadyArea',
    'isInReadySnapZone',
    'isReadyForReadySnap',
    'readyDragged',
    'readySnapped',
    'frozen',
  ];

  function updateUI() {
    elements.forEach(({ id, el, recordData }) => {
      const posEl = document.getElementById(`${id}-pos`);
      if (!posEl) return;

      const rect = el.getBoundingClientRect();
      const baseText = `${id}: ${Math.round(rect.left)}, ${Math.round(rect.top)}`;

      if (recordData) {
        const activeFlags = flagList.filter((f) => recordData[f]).join(' ');
        posEl.textContent = activeFlags ? `${baseText} | ${activeFlags}` : baseText;
      } else {
        posEl.textContent = baseText;
      }
    });

    requestAnimationFrame(updateUI);
  }

  updateUI();
}

function drawInitCenterDot({ x, y }, label = '', color = '', visibility = false) {
  const marker = document.createElement('div');
  marker.className = `
    fixed w-[13px] h-[13px] ${color} rounded-full z-[2000] 
    pointer-events-none 
    border border-white text-[11px] text-center text-white
    flex items-center justify-center 
    translate-x-[-50%] translate-y-[-50%]
    ${visibility ? 'block' : 'hidden'}
  `.trim();
  marker.classList.add('debug-dot');
  marker.style.left = `${x}px`;
  marker.style.top = `${y}px`;
  marker.textContent = label;

  document.body.appendChild(marker);
  return marker;
}

export function getCenterOfElement(el) {
  const rect = el.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}

export function updateStaticDots() {
  document.querySelectorAll('.debug-dot').forEach((el) => el.remove());

  const player = document.getElementById('player');
  const readyCenter = getCenterOfElement(player);
  readyPos.x = readyCenter.x;
  readyPos.y = readyCenter.y;
  drawInitCenterDot(readyCenter, 'R', 'bg-red-500', dotsVisible);

  const allRecords = document.querySelectorAll('#record-list > div');

  gsap.delayedCall(0, () => {
    allRecords.forEach((rec) => {
      const center = getCenterOfElement(rec);
      const idx = +rec.dataset.index - 1;

      records[idx].initPos = center;
      rec.dataset.initCenter = JSON.stringify(center);

      drawInitCenterDot(center, `I${rec.dataset.index}`, 'bg-purple-500', dotsVisible);
    });

    initStatePanel([
      { id: 'R', el: player },
      ...Array.from(allRecords).map((el, i) => ({ id: `${i + 1}`, el, recordData: records[i] })),
    ]);
  });
}

function initDebugPanel() {
  createDebugPanel();
  applyDebugVisibility();
}

function clearDebugPanel() {
  document.getElementById('debug-panel')?.remove();
  document.querySelectorAll('.debug-toggleable').forEach((el) => el.remove());
  document.querySelectorAll('.debug-dot').forEach((el) => el.remove());

  areas.forEach((area) => {
    const el = document.getElementById(area);
    if (el) el.style.outline = 'none';
  });

  snapZones.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.style.outline = 'none';
  });

  dotsVisible = false;
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'F4') {
    debugVisible = !debugVisible;
    if (debugVisible) {
      initDebugPanel();
      updateStaticDots();
    } else {
      clearDebugPanel();
    }
  }
});
