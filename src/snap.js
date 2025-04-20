import gsap from 'gsap';
import { getCenterOfElement } from './debug';
import {
  setSnappedRecord,
  clearSnappedRecord,
  setRecordReady,
  setCurrentAudio,
  setCurrentRecord,
  setRecordSpin,
  getSnappedRecord,
  getCurrentDraggedRecord,
  getCurrentAudio,
  getRecordSpin,
  readyPos,
  records,
} from './constants';

gsap.registerPlugin();

function snapTween(record, target, opts = {}) {
  if (record.dataset.frozen === 'true') return;
  const here = getCenterOfElement(record);
  const curX = gsap.getProperty(record, 'x');
  const curY = gsap.getProperty(record, 'y');

  gsap.to(record, {
    x: curX + (target.x - here.x),
    y: curY + (target.y - here.y),
    scale: opts.scaleUp ? 3.5 : 1,
    duration: 0.8,
    ease: 'power3.out',
    overwrite: 'auto',
    onStart() {
      if (opts.playerSnap) {
        record.style.zIndex = 30;
        document.getElementById('needle')?.style.setProperty('z-index', 40);
      }
      if (opts.resetZ && record.dataset.initZ) {
        record.style.zIndex = record.dataset.initZ;
      }
    },
  });
}

function unsnapToInit(record, meta) {
  // identical to before…
  snapTween(record, meta.initPos, { resetZ: true });
  meta.readySnapped = false;
  meta.initSnapped = true;
  meta.readyDragged = false;

  const audio = getCurrentAudio();
  const fill = document.getElementById('progress-bar-fill');
  const ptr = document.getElementById('progress-bar-pointer');
  const vinyl = record.querySelector('#vinyl-wrapper');

  gsap.to(vinyl, { rotation: 0, duration: 0.4, ease: 'power2.out' });
  gsap.to(record, { rotation: 0, duration: 0.4, ease: 'power2.out' });

  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
  if (fill && ptr) {
    gsap.set(fill, { width: 0 });
    gsap.set(ptr, { x: 0 });
  }

  getRecordSpin()?.pause().kill();
  setRecordSpin(null);

  clearSnappedRecord();
  setRecordReady(false);
}

export function initProximitySnap(record, playerEl, audio) {
  function loop() {
    const meta = records.find((r) => r.audio === record.dataset.name);
    if (!meta) return;

    // --- 1) update position
    const c = getCenterOfElement(record);
    meta.currentPos = { x: c.x, y: c.y };

    // --- 2) compute area vs threshold
    const fullInitRect = document.getElementById('init-area')?.getBoundingClientRect();
    const fullReadyRect = document.getElementById('ready-area')?.getBoundingClientRect();
    const initThreshRect = document.getElementById('init-area-threshold')?.getBoundingClientRect();
    const readyThreshRect = document.getElementById('ready-area-threshold')?.getBoundingClientRect();

    const inside = (r) => r && c.x >= r.left && c.x <= r.right && c.y >= r.top && c.y <= r.bottom;

    meta.isInInitArea = inside(fullInitRect);
    meta.isInReadyArea = inside(fullReadyRect);
    meta.isInInitSnapZone = inside(initThreshRect);
    meta.isInReadySnapZone = inside(readyThreshRect);

    // --- 3) ready‑to‑snap flags (unchanged)
    meta.isReadyForInitSnap = meta.initDragged && meta.isInInitSnapZone;
    meta.isReadyForReadySnap = meta.readyDragged && meta.isInReadySnapZone;

    const dragged = getCurrentDraggedRecord();
    const snapped = getSnappedRecord();
    const isDragged = dragged === record;

    // --- 4) while dragging: break early
    if (isDragged) {
      record.style.zIndex = 30;
      document.getElementById('needle')?.style.setProperty('z-index', 20);

      // if you hover a new one over the player → boot old
      if (meta.isReadyForReadySnap && snapped && snapped !== record) {
        const prev = records.find((r) => r.audio === snapped.dataset.name);
        snapTween(snapped, prev.initPos, { resetZ: true });
        prev.readySnapped = false;
        prev.initSnapped = true;
        clearSnappedRecord();
        setRecordReady(false);
      }

      requestAnimationFrame(loop);
      return;
    }

    // --- 5) on release: maintain or change snap state
    if (snapped === record) {
      // already snapped → either stay snapped or unsnap
      if (!meta.isInReadySnapZone) {
        unsnapToInit(record, meta);
      } else {
        snapTween(record, readyPos, { scaleUp: true, playerSnap: true });
      }
    } else {
      // not snapped → see if we need to snap
      if (meta.isReadyForReadySnap) {
        // hand‑off old snapped
        if (snapped && snapped !== record) {
          const prev = records.find((r) => r.audio === snapped.dataset.name);
          snapTween(snapped, prev.initPos, { resetZ: true });
          prev.readySnapped = false;
          prev.initSnapped = true;
        }

        // snap this one
        setSnappedRecord(record);
        records.forEach((r) => (r.readySnapped = false));
        meta.readySnapped = true;
        meta.initSnapped = false;

        setCurrentAudio(audio);
        setCurrentRecord(record);
        setRecordReady(true);
        snapTween(record, readyPos, { scaleUp: true, playerSnap: true });

        // ← **clear your drag flags** now that the snap has happened
        meta.readyDragged = false;
        meta.initDragged = false;
      } else if (meta.isReadyForInitSnap) {
        // snap back to init
        snapTween(record, meta.initPos, { resetZ: true });
        meta.initSnapped = true;
        meta.readySnapped = false;

        // ← **clear your drag flags** once we’ve snapped home
        meta.readyDragged = false;
        meta.initDragged = false;
      }
    }

    requestAnimationFrame(loop);
  }

  loop();
}
