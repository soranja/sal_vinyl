import gsap from 'gsap';
import { getSnappedRecord, getCurrentDraggedRecord, readyPos, records } from './constants';

function createDebugPanel() {
  const debugPanel = document.createElement('div');
  debugPanel.className = `
    fixed top-2 right-2 z-[1500] bg-black/80 text-white p-3 rounded space-y-2 text-sm debug-toggleable
  `;
  debugPanel.innerHTML = `
    <label><input type="checkbox" id="toggle-areas" checked />Areas</label><br/>
    <label><input type="checkbox" id="toggle-snap-zones" checked />Snap Zones</label><br/>
    <label><input type="checkbox" id="toggle-dots" checked />Position Dots</label><br/>
    <label><input type="checkbox" id="toggle-state-panel" checked />State Panel</label>
  `;
  document.body.appendChild(debugPanel);
}

function applyDebugVisibility() {
  document.getElementById('toggle-areas').onchange = (e) => {
    const areas = ['init-area', 'ready-area'];
    areas.forEach((area) => {
      const el = document.getElementById(area);
      el.style.outline = e.target.checked ? '2px solid rgba(0, 123, 255, 0.6)' : 'none';
    });
  };

  document.getElementById('toggle-snap-zones').onchange = (e) => {
    const snapZones = ['init-area-threshold', 'ready-area-threshold'];
    snapZones.forEach((id) => {
      const el = document.getElementById(id);
      el.style.outline = e.target.checked ? '2px dashed rgba(0, 255, 0, 0.5)' : 'none';
    });
  };

  document.getElementById('toggle-dots').onchange = (e) => {
    document.querySelectorAll('.debug-dot').forEach((el) => (el.style.display = e.target.checked ? 'block' : 'none'));
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

  // Full list of boolean flags we want to watch in the UI
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

function drawInitCenterDot({ x, y }, label = '', color = '') {
  const marker = document.createElement('div');
  marker.className = `
    fixed w-[10px] h-[10px] ${color} rounded-full z-[2000] 
    pointer-events-none 
    border border-white text-[9px] text-center text-white
    flex items-center justify-center 
    translate-x-[-50%] translate-y-[-50%]
  `.trim();
  marker.style.left = `${x}px`;
  marker.style.top = `${y}px`;
  marker.textContent = label;
  marker.classList.add('debug-dot', 'debug-toggleable');
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
  const player = document.getElementById('player');
  const readyCenter = getCenterOfElement(player);
  readyPos.x = readyCenter.x;
  readyPos.y = readyCenter.y;
  drawInitCenterDot(readyCenter, 'R', 'bg-red-500');

  const allRecords = document.querySelectorAll('#record-list > div');

  gsap.delayedCall(0, () => {
    allRecords.forEach((rec) => {
      const center = getCenterOfElement(rec);
      const idx = +rec.dataset.index - 1;

      records[idx].initPos = center;
      rec.dataset.initCenter = JSON.stringify(center);

      drawInitCenterDot(center, rec.dataset.index, 'bg-blue-500');
    });

    initStatePanel([
      { id: 'R', el: player },
      ...Array.from(allRecords).map((el, i) => ({ id: `${i + 1}`, el, recordData: records[i] })),
    ]);
  });

  createDebugPanel();
  applyDebugVisibility();
}

export function logStates() {
  const dragged = getCurrentDraggedRecord();
  const snapped = getSnappedRecord();
  const allRecords = document.querySelectorAll('#record-list > div');
  const needle = document.getElementById('needle');

  const initSnapped = [];
  const playerSnapped = [];

  allRecords.forEach((record) => {
    const center = record.getBoundingClientRect();
    const playerCenter = document.getElementById('player').getBoundingClientRect();
    const distToPlayer = Math.hypot(center.x - playerCenter.x, center.y - playerCenter.y);

    if (distToPlayer < 150) {
      playerSnapped.push(record);
    } else {
      initSnapped.push(record);
    }
  });

  console.log({
    currentDraggedRecord: dragged
      ? {
          name: dragged.dataset.name,
          index: dragged.dataset.index,
          position: {
            x: gsap.getProperty(dragged, 'x'),
            y: gsap.getProperty(dragged, 'y'),
          },
        }
      : null,

    initSnappedRecords: initSnapped.map((r) => ({ name: r.dataset.name, index: r.dataset.index })),

    playerSnappedRecords: playerSnapped.map((r) => ({ name: r.dataset.name, index: r.dataset.index })),

    allInitialZIndexes: Array.from(allRecords).map((r) => ({
      name: r.dataset.name,
      index: r.dataset.index,
      zIndex: r.style.zIndex,
    })),

    snappedRecordZIndex: snapped
      ? { name: snapped.dataset.name, index: snapped.dataset.index, zIndex: snapped.style.zIndex }
      : null,

    needleZIndex: needle ? window.getComputedStyle(needle).zIndex : null,
  });
}
