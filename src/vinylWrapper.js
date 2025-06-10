import gsap from 'gsap';

export function createVinylWrapper(record, wrapperSize, index) {
  const recordWrapper = document.createElement('div');
  recordWrapper.className = 'relative flex justify-center items-center';
  recordWrapper.style.width = `${wrapperSize}px`;
  recordWrapper.style.height = `${wrapperSize}px`;
  gsap.set(recordWrapper, { x: 0, y: 0 });

  // const rect = recordWrapper.getBoundingClientRect();
  // recordWrapper.dataset.frozenX = rect.left;
  // recordWrapper.dataset.frozenY = rect.top;

  if (window.innerWidth >= 1024) {
    recordWrapper.style.marginTop = `${index === 0 ? 0 : wrapperSize * -0.4}px`;
  } else {
    recordWrapper.style.marginLeft = `${index === 0 ? 0 : wrapperSize * -0.4}px`;
  }

  recordWrapper.dataset.index = `${index + 1}`;
  recordWrapper.dataset.initZ = `${index + 1}`;
  recordWrapper.dataset.name = record.audio;

  const vinylWrapper = document.createElement('div');
  vinylWrapper.className = 'relative max-w-[90%] max-h-[90%] flex flex-col justify-center items-center';
  vinylWrapper.id = 'vinyl-wrapper';

  const vinyl = document.createElement('img');
  vinyl.src = '/player/record.png';
  vinyl.alt = 'Vinyl';
  vinyl.id = 'vinyl';
  vinyl.className = 'w-full h-full pointer-events-none select-none drop-shadow-[0_6px_12px_rgba(0,0,0,0.6)]';
  gsap.set(vinyl, { transformOrigin: '50% 50%' });

  const cover = document.createElement('img');
  cover.src = record.cover;
  cover.alt = 'Cover';
  cover.id = 'cover';
  cover.className = `
    absolute
    top-[50%] left-[51%]
    -translate-x-1/2 -translate-y-1/2
    pointer-events-none
  `;

  const coverSize = wrapperSize * 0.3;
  cover.style.width = `${coverSize}px`;
  cover.style.height = `${coverSize}px`;

  vinylWrapper.appendChild(vinyl);
  vinylWrapper.appendChild(cover);
  recordWrapper.appendChild(vinylWrapper);

  return { recordWrapper, vinylWrapper, vinyl };
}
