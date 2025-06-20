import gsap from 'gsap';
import { getCenterOfElement } from './debug';
import { fadeInRecordInfo, fadeOutRecordInfo } from './animations.js';
import {
  setSnappedRecord,
  clearSnappedRecord,
  setRecordReady,
  setCurrentAudio,
  setCurrentRecord,
  getSnappedRecord,
  getCurrentDraggedRecord,
  getCurrentAudio,
  readyPos,
  records,
} from './constants';
import { showDragInstruction, hideDragInstruction, updatePlayerWrapperOpacity } from './instructions.js';

function snapTween(record, target, opts = {}) {
  if (record.dataset.frozen === 'true') return;
  const here = getCenterOfElement(record);
  const curX = gsap.getProperty(record, 'x');
  const curY = gsap.getProperty(record, 'y');

  const isMobile = window.innerWidth < 768;
  const scaleValue = opts.scaleUp ? (isMobile ? 5.5 : 3.5) : 1;

  gsap.to(record, {
    x: curX + (target.x - here.x),
    y: curY + (target.y - here.y),
    scale: scaleValue,
    duration: 0.8,
    ease: 'power3.out',
    overwrite: 'auto',
  });
}

function unsnapToInit(record, meta) {
  snapTween(record, meta.initPos, { resetZ: true });
  record.style.zIndex = record.dataset.initZ;

  meta.readySnapped = false;
  meta.initSnapped = true;
  meta.readyDragged = false;

  const audio = getCurrentAudio();
  const vinylWrapper = record.querySelector('#vinyl-wrapper');
  const progressBarFill = document.getElementById('progress-bar-fill');
  const progressBarPointer = document.getElementById('progress-bar-pointer');

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

  clearSnappedRecord();
  setRecordReady(false);
  fadeOutRecordInfo();
  showDragInstruction();
  updatePlayerWrapperOpacity();
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
        snapped.style.zIndex = snapped.dataset.initZ;
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
          // 👇 This is the missing part if you didn't include it already
          snapped.style.zIndex = snapped.dataset.initZ;
        }

        setSnappedRecord(record);
        records.forEach((r) => (r.readySnapped = false));
        meta.readySnapped = true;
        meta.initSnapped = false;

        setCurrentAudio(audio);
        setCurrentRecord(record);
        setRecordReady(true);
        hideDragInstruction();
        fadeInRecordInfo(meta);
        updatePlayerWrapperOpacity();

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
