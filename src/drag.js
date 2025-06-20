import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { setCurrentDraggedRecord, clearCurrentDraggedRecord, getSnappedRecord, records, metaOf } from './constants';

gsap.registerPlugin(Draggable);

const draggables = [];
const app = document.querySelector('#app');

// Too overhead, possibly to write shorter?
let bounds = computeBounds();

window.addEventListener('resize', () => {
  bounds = computeBounds();
});

function computeBounds() {
  return {
    left: 0,
    top: 0,
    width: app.clientWidth,
    height: app.clientHeight,
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

    onPress() {
      clearDragFlags();
      const meta = metaOf(this.target);
      meta.initDragged = meta.isInInitArea;
      meta.readyDragged = meta.isInReadyArea;
      setCurrentDraggedRecord(this.target);

      // Scales up an init dragged record for visual distinction
      if (getSnappedRecord() !== this.target) {
        gsap.to(this.target, { scale: 1.2, duration: 0.3, ease: 'power2.out' });
      }
    },

    onRelease() {
      const meta = metaOf(this.target);

      const justClickedInInit = meta.isInInitArea && !this.hasMoved && getSnappedRecord() !== this.target;

      if (justClickedInInit) {
        gsap.to(this.target, { scale: 1, duration: 0.3, ease: 'power2.out' });
        this.target.style.zIndex = this.target.dataset.initZ;
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

      gsap.killTweensOf(this.target);
      gsap.set(this.target, { x: this.x, y: this.y });

      const meta = metaOf(this.target);
      const snapped = getSnappedRecord();

      if (meta.isInInitArea && snapped !== this.target) {
        this.target.style.zIndex = this.target.dataset.initZ;
      }
    },
  })[0];

  draggables.push(draggable);
  draggable.update(true);
  gsap.delayedCall(0, () => draggable.update(true));
}
