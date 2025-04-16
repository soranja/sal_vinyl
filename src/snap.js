import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { getCenterOfElement, getCenterDistance } from './trackers.js';
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
} from './constants.js';

gsap.registerPlugin(Draggable);

// Helpers
function getSnapAreas(recordCenter, playerCenter) {
  const totalDistance = getCenterDistance(recordCenter, playerCenter);
  const halfway = totalDistance / 2;
  return { initArea: halfway, readyArea: halfway };
}

function snapToTarget(record, targetCenter, scaleUp = false, resetZ = false, playerSnap = false) {
  const recordCenter = getCenterOfElement(record);
  const offsetX = targetCenter.x - recordCenter.x;
  const offsetY = targetCenter.y - recordCenter.y;
  const currentX = gsap.getProperty(record, 'x');
  const currentY = gsap.getProperty(record, 'y');

  gsap.to(record, {
    x: currentX + offsetX,
    y: currentY + offsetY,
    scale: scaleUp ? 4 : 1,
    duration: 0.8,
    ease: 'power3.out',
    overwrite: 'auto',
    onStart: () => {
      if (playerSnap) {
        record.style.zIndex = 30;
        const needle = document.getElementById('needle');
        if (needle) needle.style.zIndex = 40;
      }
      if (resetZ && record.dataset.initZ) {
        record.style.zIndex = record.dataset.initZ;
      }
    },
  });
}

function unsnapRecord(record, initCenter) {
  snapToTarget(record, initCenter, false, true, false);

  const audio = getCurrentAudio();
  const barFill = document.getElementById('progress-bar-fill');
  const pointer = document.getElementById('progress-bar-pointer');
  const vinylWrapper = record.querySelector('#vinyl-wrapper');

  gsap.to(vinylWrapper, { rotation: 0, duration: 0.4, ease: 'power2.out' });
  gsap.to(record, { rotation: 0, duration: 0.4, ease: 'power2.out' });

  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }

  if (barFill && pointer) {
    gsap.set(barFill, { width: 0 });
    gsap.set(pointer, { x: 0 });
  }

  getRecordSpin().pause().kill();
  setRecordSpin(null);
  clearSnappedRecord();
  setRecordReady(false);
}

// Main Proximity Snap
export function initProximitySnap(record, player, audio) {
  const initCenter = getCenterOfElement(record);
  const playerCenter = getCenterOfElement(player);
  record.dataset.initCenter = JSON.stringify(initCenter);

  function updateProximity() {
    const recordCenter = getCenterOfElement(record);
    const distanceToPlayer = getCenterDistance(recordCenter, playerCenter);
    const distanceToInit = getCenterDistance(recordCenter, initCenter);

    const { initArea, readyArea } = getSnapAreas(initCenter, playerCenter);

    const draggedRecord = getCurrentDraggedRecord();
    const snappedRecord = getSnappedRecord();
    const isDragged = draggedRecord === record;
    // const isSnapped = snappedRecord === record;

    if (isDragged) {
      record.style.zIndex = 30;
      const needle = document.getElementById('needle');
      if (needle) needle.style.zIndex = 20;

      if (distanceToPlayer < readyArea) {
        if (snappedRecord && snappedRecord !== record) {
          const init = JSON.parse(snappedRecord.dataset.initCenter);
          snapToTarget(snappedRecord, init, false, true, false);
          clearSnappedRecord();
          setRecordReady(false);
        }
      }
    } else {
      if (snappedRecord === record) {
        if (distanceToPlayer > readyArea) {
          unsnapRecord(record, initCenter);
        } else {
          snapToTarget(record, playerCenter, true, false, true);
        }
      } else {
        if (distanceToPlayer < readyArea) {
          if (snappedRecord && snappedRecord !== record) {
            const prevInit = JSON.parse(snappedRecord.dataset.initCenter);
            snapToTarget(snappedRecord, prevInit, false, true, false);
          }

          // Overwrite snapped state no matter what
          setSnappedRecord(record);
          setCurrentAudio(audio);
          setCurrentRecord(record);
          setRecordReady(true);
          snapToTarget(record, playerCenter, true, false, true);
        } else if (distanceToInit < initArea) {
          snapToTarget(record, initCenter, false, true, false);
        }
      }
    }

    requestAnimationFrame(updateProximity);
  }

  updateProximity();

  Draggable.get(record)?.addEventListener('dragend', () => {
    const draggedRecord = getCurrentDraggedRecord();
    const snappedRecord = getSnappedRecord();
    if (draggedRecord) return; // another record still being dragged
    if (snappedRecord && snappedRecord !== record) return; // this record is not the snapped one

    const recordCenter = getCenterOfElement(record);
    const distanceToPlayer = getCenterDistance(recordCenter, playerCenter);
    const distanceToInit = getCenterDistance(recordCenter, initCenter);

    const { initArea, readyArea } = getSnapAreas(initCenter, playerCenter);

    if (distanceToPlayer > readyArea && distanceToInit > initArea) {
      const init = JSON.parse(record.dataset.initCenter);
      snapToTarget(record, init, false, true, false);
    }
  });
}
