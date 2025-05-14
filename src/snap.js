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

// gsap.registerPlugin();

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
  });
}

function unsnapToInit(record, meta) {
  snapTween(record, meta.initPos, { resetZ: true });

  meta.readySnapped = false;
  meta.initSnapped = true;
  meta.readyDragged = false;

  const audio = getCurrentAudio();
  const vinylWrapper = record.querySelector('#vinyl-wrapper');
  const progressBarFill = document.getElementById('progress-bar-fill');
  const progressBarPointer = document.getElementById('progress-bar-pointer');

  // Conflicts with rotationSpin?
  gsap.to(vinylWrapper, { rotation: 0, duration: 0.4, ease: 'power2.out' });
  gsap.to(record, { rotation: 0, duration: 0.4, ease: 'power2.out' });

  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
  if (progressBarFill && progressBarPointer) {
    gsap.set(progressBarFill, { width: 0 });
    gsap.set(progressBarPointer, { x: 0 });
  }

  // getRecordSpin()?.pause().kill();
  // setRecordSpin(null);
  // ??

  clearSnappedRecord();
  setRecordReady(false);
}

export function initProximitySnap(record, audio) {
  function loop() {
    const meta = records.find((r) => r.audio === record.dataset.name);
    if (!meta) return;

    const c = getCenterOfElement(record);
    meta.currentPos = { x: c.x, y: c.y };

    const fullInitRect = document.getElementById('init-area')?.getBoundingClientRect();
    const fullReadyRect = document.getElementById('ready-area')?.getBoundingClientRect();
    const initThreshRect = document.getElementById('init-area-threshold')?.getBoundingClientRect();
    const readyThreshRect = document.getElementById('ready-area-threshold')?.getBoundingClientRect();

    const inside = (r) => r && c.x >= r.left && c.x <= r.right && c.y >= r.top && c.y <= r.bottom;

    meta.isInInitArea = inside(fullInitRect);
    meta.isInReadyArea = inside(fullReadyRect);
    meta.isInInitSnapZone = inside(initThreshRect);
    meta.isInReadySnapZone = inside(readyThreshRect);

    meta.isReadyForInitSnap = meta.initDragged && meta.isInInitSnapZone;
    meta.isReadyForReadySnap = meta.readyDragged && meta.isInReadySnapZone;

    const dragged = getCurrentDraggedRecord();
    const snapped = getSnappedRecord();
    const isDragged = dragged === record;

    if (isDragged) {
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

    if (snapped === record) {
      if (!meta.isInReadySnapZone) {
        unsnapToInit(record, meta);
      } else {
        snapTween(record, readyPos, { scaleUp: true, playerSnap: true });
      }
    } else {
      if (meta.isReadyForReadySnap) {
        if (snapped && snapped !== record) {
          const prev = records.find((r) => r.audio === snapped.dataset.name);
          snapTween(snapped, prev.initPos, { resetZ: true });
          prev.readySnapped = false;
          prev.initSnapped = true;
        }

        setSnappedRecord(record);
        records.forEach((r) => (r.readySnapped = false));
        meta.readySnapped = true;
        meta.initSnapped = false;

        setCurrentAudio(audio);
        setCurrentRecord(record);
        setRecordReady(true);
        snapTween(record, readyPos, { scaleUp: true, playerSnap: true });

        meta.readyDragged = false;
        meta.initDragged = false;
      } else if (meta.isReadyForInitSnap) {
        snapTween(record, meta.initPos, { resetZ: true });
        meta.initSnapped = true;
        meta.readySnapped = false;
        meta.readyDragged = false;
        meta.initDragged = false;
      }
    }

    requestAnimationFrame(loop);
  }

  loop();
}
