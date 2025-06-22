import gsap from 'gsap';

export function createVinylWrapper(record, wrapperSize, index) {
  const recordWrapper = document.createElement('div');
  recordWrapper.className = 'relative flex justify-center items-center';
  recordWrapper.style.width = `${wrapperSize}px`;
  recordWrapper.style.height = `${wrapperSize}px`;

  gsap.set(recordWrapper, { x: 0, y: 0, z: 0, force3D: true });

  if (window.innerWidth >= 1024) {
    recordWrapper.style.marginTop = `${index === 0 ? 0 : wrapperSize * -0.4}px`;
  } else {
    recordWrapper.style.marginLeft = `${index === 0 ? 0 : wrapperSize * -0.4}px`;
  }

  recordWrapper.dataset.index = `${index + 1}`;
  recordWrapper.dataset.initZ = `${index + 1}`;
  recordWrapper.dataset.name = record.audio;

  const cover1x = record.cover;
  const cover2x = cover1x.replace(/(\.\w+)$/, '@2x$1');
  const coverDim = Math.round(wrapperSize * 0.3);

  recordWrapper.innerHTML = `
    <div id="vinyl-wrapper"
         class="relative max-w-[90%] max-h-[90%] flex flex-col justify-center items-center">

      <img id="vinyl"
           src="/player/record.png"
           alt="Vinyl"
           class="w-full h-full pointer-events-none select-none drop-shadow-[0_6px_12px_rgba(0,0,0,0.6)]"
           style="transform-origin:50% 50%;" />

      <img id="cover"
           src="${cover1x}"
           srcset="${cover1x} 1x, ${cover2x} 2x"
           sizes="${coverDim}px"
           width="${coverDim}"
           height="${coverDim}"
           alt="Cover"
           class="absolute top-[50%] left-[51%] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
           style="width:${coverDim}px; height:${coverDim}px;" />
    </div>
  `;

  const vinylWrapper = recordWrapper.querySelector('#vinyl-wrapper');
  const vinyl = recordWrapper.querySelector('#vinyl');
  gsap.set(vinyl, { transformOrigin: '50% 50%' });

  return { recordWrapper, vinylWrapper, vinyl };
}
