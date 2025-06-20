import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { setCurrentDraggedRecord, clearCurrentDraggedRecord, getSnappedRecord, records, metaOf } from './constants';

gsap.registerPlugin(Draggable);

const draggables = [];
const app = document.querySelector('#app');

function computeBounds() {
  return {
    left: 0,
    top: 0,
    width: app.clientWidth,
    height: app.clientHeight,
  };
}

let bounds = computeBounds();
window.addEventListener('resize', () => {
  bounds = computeBounds();
});

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
      const vinylWrapper = this.target.querySelector('#vinyl-wrapper');

      if (vinylWrapper) {
        gsap.to(vinylWrapper, {
          scale: 1.2,
          duration: 0.3,
          ease: 'power2.out',
          overwrite: true,
        });
      }

      if (meta.isInInitArea) {
        meta.initDragged = true;
        meta.readyDragged = false;
      } else if (meta.isInReadyArea) {
        meta.readyDragged = true;
        meta.initDragged = false;
      } else {
        meta.readyDragged = false;
        meta.initDragged = false;
      }

      setCurrentDraggedRecord(this.target);
    },

    onRelease() {
      const meta = metaOf(this.target);
      const snapped = getSnappedRecord();
      const vinylWrapper = this.target.querySelector('#vinyl-wrapper');

      const justClickedInInit = meta.isInInitArea && !this.hasMoved && snapped !== this.target;

      if (justClickedInInit && vinylWrapper) {
        gsap.to(vinylWrapper, { scale: 1, duration: 0.3, ease: 'power2.out' });
        this.target.style.zIndex = this.target.dataset.initZ;
      }

      if (!this.hasMoved && snapped === this.target) {
        meta.readyDragged = false;
        meta.initDragged = false;
      }
    },

    onDrag() {
      const meta = metaOf(this.target);
      meta.currentPos = { x: this.x, y: this.y };

      if (meta.isInInitArea) {
        meta.initDragged = true;
        meta.readyDragged = false;
      } else if (meta.isInReadyArea) {
        meta.readyDragged = true;
        meta.initDragged = false;
      } else {
        meta.readyDragged = false;
        meta.initDragged = false;
      }
    },

    onDragEnd() {
      clearCurrentDraggedRecord();
      gsap.killTweensOf(this.target);

      const vinylWrapper = this.target.querySelector('#vinyl-wrapper');
      if (vinylWrapper) {
        gsap.killTweensOf(vinylWrapper);
      }

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
