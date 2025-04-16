import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { setCurrentDraggedRecord, clearCurrentDraggedRecord, getSnappedRecord } from './constants';

gsap.registerPlugin(Draggable);

const draggables = [];
const app = document.querySelector('#app');
const padding = 20;

const bounds = {
  left: padding,
  top: padding,
  width: app.clientWidth - padding * 2,
  height: app.clientHeight - padding * 2,
};

// Disable/Enable Helpers
export function disableAllDraggables() {
  draggables.forEach((draggable) => draggable.disable());
}

export function enableAllDraggables() {
  draggables.forEach((draggable) => draggable.enable());
}

// Main
export function initRecordDragging(recordWrapper, recordImg) {
  const draggable = Draggable.create(recordWrapper, {
    type: 'x,y',
    bounds: bounds,
    allowNativeTouchScrolling: false,

    onPress: function () {
      gsap.to(this.target, { scale: 1.1, duration: 0.3, ease: 'power2.out' });
    },

    onDragStart: function () {
      setCurrentDraggedRecord(this.target);

      const snapped = getSnappedRecord(); // ✅ dynamic reference
      if (snapped === this.target) {
        gsap.killTweensOf(this.target); // prevent tug-of-war with snap
      }

      draggables.forEach((instance) => {
        if (instance.target !== this.target) {
          instance.disable();
        }
      });

      this.target.style.zIndex = 40;
    },

    onDrag: function () {
      const snapped = getSnappedRecord();
      if (snapped !== this.target) {
        gsap.to(this.target, { scale: 1.3, duration: 0.3, ease: 'power2.out' });
      }
    },

    onDragEnd: function () {
      const snapped = getSnappedRecord();
      clearCurrentDraggedRecord();
      enableAllDraggables();
      gsap.killTweensOf(this.target);
      gsap.set(this.target, { x: this.x, y: this.y });

      if (snapped !== this.target) {
        gsap.to(this.target, { scale: 1, duration: 0.4, ease: 'power2.out' });
      }
    },

    onRelease: function () {
      const snapped = getSnappedRecord();
      clearCurrentDraggedRecord();
      enableAllDraggables();

      if (snapped !== this.target) {
        gsap.to(this.target, { scale: 1, duration: 0.4, ease: 'power2.out' });
      }
    },
  })[0];

  draggables.push(draggable);

  draggable.update(true);
  gsap.delayedCall(0, () => {
    draggable.update(true);
  });
}
