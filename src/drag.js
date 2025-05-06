import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { setCurrentDraggedRecord, clearCurrentDraggedRecord, getSnappedRecord, records, metaOf } from './constants';

gsap.registerPlugin(Draggable);

const draggables = [];
const app = document.querySelector('#app');
const padding = 20;

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

function clearDragFlags() {
  records.forEach((r) => {
    r.initDragged = false;
    r.readyDragged = false;
  });
}

export function disableAllDraggables() {
  draggables.forEach((draggable) => draggable.disable());
}
export function enableAllDraggables() {
  draggables.forEach((draggable) => draggable.enable());
}

export function initRecordDragging(recordWrapper) {
  const draggable = Draggable.create(recordWrapper, {
    type: 'x,y',
    bounds,
    allowNativeTouchScrolling: false,

    onPress() {
      clearDragFlags();
      const meta = metaOf(this.target);
      meta.initDragged = meta.isInInitArea;
      meta.readyDragged = meta.isInReadyArea;
      setCurrentDraggedRecord(this.target);

      if (getSnappedRecord() !== this.target) {
        gsap.to(this.target, { scale: 1.5, duration: 0.3, ease: 'power2.out' });
      }
    },

    onRelease() {
      if (getSnappedRecord() !== this.target) {
        gsap.to(this.target, { scale: 1, duration: 0.3, ease: 'power2.out' });
      }
    },

    onDrag() {
      const meta = metaOf(this.target);
      meta.currentPos = { x: this.x, y: this.y };

      if (meta.isInInitArea) meta.initDragged = true;
      if (meta.isInReadyArea) meta.readyDragged = true;
    },

    onDragEnd() {
      clearCurrentDraggedRecord();
      enableAllDraggables();

      gsap.killTweensOf(this.target);
      gsap.set(this.target, { x: this.x, y: this.y });
      if (getSnappedRecord() !== this.target) {
        gsap.to(this.target, { scale: 1, duration: 0.4, ease: 'power2.out' });
      }
    },
  })[0];

  draggables.push(draggable);
  draggable.update(true);
  gsap.delayedCall(0, () => draggable.update(true));
}
