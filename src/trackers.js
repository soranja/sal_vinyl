import gsap from 'gsap';

// Track Center Marker
export function createCenterMarker(label = '', color = 'bg-yellow-500') {
  const marker = document.createElement('div');
  marker.className = `
    absolute 
    z-50 w-[15px] h-[15px] 
    ${color} rounded-full border-1 border-white 
    flex items-center justify-center 
    text-[10px] text-white font-bold
    pointer-events-none opacity-60
    translate-x-[-50%] translate-y-[-50%]
  `;
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

export function getCenterDistance(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function trackAndUpdateCenter(el, marker) {
  function updateMarkerPosition() {
    const { x, y } = getCenterOfElement(el);
    marker.style.left = `${x}px`;
    marker.style.top = `${y}px`;
    requestAnimationFrame(updateMarkerPosition);
  }
  updateMarkerPosition();
}

// Track Element Position

export function getElementPosition(el) {
  const rect = el.getBoundingClientRect();
  return {
    topLeft: {
      x: rect.left,
      y: rect.top,
    },
    center: {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    },
  };
}

export function initElementPositionUI(elements = []) {
  const debugContainer = document.createElement('div');
  debugContainer.className = 'absolute top-2 left-2 space-y-1 z-50 text-xs';

  debugContainer.innerHTML = elements
    .map(({ id }) => `<div id="${id}-pos" class="bg-black/70 text-white px-2 py-1 rounded">${id}: --</div>`)
    .join('');

  document.body.appendChild(debugContainer);

  function updateUI() {
    elements.forEach(({ id, el }) => {
      const posEl = document.getElementById(`${id}-pos`);
      if (!posEl) return;

      const rect = el.getBoundingClientRect();
      posEl.textContent = `${id}: ${Math.round(rect.left)}, ${Math.round(rect.top)}`;
    });

    requestAnimationFrame(updateUI);
  }

  updateUI();
}

// Loggers
export function logRecordState(tag = '') {
  const record = document.getElementById('record');
  const rect = record.getBoundingClientRect();
  const x = gsap.getProperty(record, 'x');
  const y = gsap.getProperty(record, 'y');
  const rotation = gsap.getProperty(record, 'rotation');
  const transform = record.style.transform;

  console.log(`🪩 [${tag}]`);
  console.log(`  x: ${x}, y: ${y}, rotation: ${rotation}`);
  console.log(`  top: ${rect.top}, left: ${rect.left}`);
  console.log(`  transform: ${transform}`);
}
