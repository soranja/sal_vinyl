import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { setCurrentDraggedRecord, clearCurrentDraggedRecord, getSnappedRecord, records, metaOf } from './constants';

gsap.registerPlugin(Draggable);

const draggables = [];
const app = document.querySelector('#app');
const padding = 20;

// compute draggable bounds and update on resize
let bounds = computeBounds();
window.addEventListener('resize', () => {
  bounds = computeBounds();
});
function computeBounds() {
  return {
    left: padding,
    top: padding,
    width: app.clientWidth - padding * 2,
    height: app.clientHeight - padding * 2,
  };
}

// clear “was dragged” flags for every record
function clearDragFlags() {
  records.forEach((r) => {
    r.initDragged = false;
    r.readyDragged = false;
  });
}

export function disableAllDraggables() {
  draggables.forEach((d) => d.disable());
}
export function enableAllDraggables() {
  draggables.forEach((d) => d.enable());
}

export function initRecordDragging(recordWrapper) {
  if (recordWrapper.dataset.frozen === 'true') return;

  const draggable = Draggable.create(recordWrapper, {
    type: 'x,y',
    bounds,
    allowNativeTouchScrolling: false,

    // 1) prime drag flags immediately
    onPress() {
      clearDragFlags();
      const meta = metaOf(this.target);
      meta.initDragged = meta.isInInitArea;
      meta.readyDragged = meta.isInReadyArea;
      setCurrentDraggedRecord(this.target);

      gsap.to(this.target, { scale: 1.1, duration: 0.3, ease: 'power2.out' });
    },

    // 2) accumulate “entered” flags as you move
    onDrag() {
      const meta = metaOf(this.target);
      meta.currentPos = { x: this.x, y: this.y };

      // once you cross into either full area, mark it
      if (meta.isInInitArea) meta.initDragged = true;
      if (meta.isInReadyArea) meta.readyDragged = true;

      if (getSnappedRecord() !== this.target) {
        gsap.to(this.target, { scale: 1.3, duration: 0.3, ease: 'power2.out' });
      }
    },

    // 3) on release, clear only the dragged‐record state and restore scale
    onDragEnd() {
      clearCurrentDraggedRecord();
      enableAllDraggables();

      gsap.killTweensOf(this.target);
      gsap.set(this.target, { x: this.x, y: this.y });
      if (getSnappedRecord() !== this.target) {
        gsap.to(this.target, { scale: 1, duration: 0.4, ease: 'power2.out' });
      }
    },

    // fallback for touch devices
    onRelease() {
      clearCurrentDraggedRecord();
      enableAllDraggables();
      if (getSnappedRecord() !== this.target) {
        gsap.to(this.target, { scale: 1, duration: 0.4, ease: 'power2.out' });
      }
    },
  })[0];

  draggables.push(draggable);
  draggable.update(true);
  gsap.delayedCall(0, () => draggable.update(true));
}
