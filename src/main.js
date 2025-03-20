import './style.css';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

document.querySelector('#app').innerHTML = 
`
  <div class="w-full h-screen flex flex-col justify-center items-center bg-[#f0f0f0] overflow-hidden gap-y-4">
    <div class="max-h-[70vh] flex flex-col justify-center items-center border-2 border-red-500">
      <div class="relative w-full h-full flex justify-center items-center border-2 border-emerald-900">

        <img src="/player/player.png" alt="player" class="relative max-h-full max-w-full object-contain z-0 border-2 border-amber-500" />

        <img id="record" src="/player/oh-dirty-fingers.png" alt="record" class="absolute max-h-[95%] max-w-full object-contain border-2 border-amber-500" />

        <img id="needle" src="/player/needle.png" alt="needle" class="relative max-h-full max-w-full object-contain border-2 border-amber-500" />

      </div>
    </div>
    <button id="playBtn" class="px-4 py-2 bg-cyan-500 text-white rounded-lg cursor-pointer">Play</button>
  </div>
`

document.addEventListener('DOMContentLoaded', () => {
  const needle = document.getElementById('needle');
  const playButton = document.getElementById('playBtn');
  const record = document.getElementById('record');
  
  let isPlaying = false;
  const playerPosition = { x: -80, y: 0 }; // Position over the player
  const tolerance = 10; // Adjust this value as needed

  // Set the pivot point for the needle
  gsap.set(needle, { transformOrigin: "50% 20%" });

  gsap.set(record, { x: -1250, y: 0 });

  // Make the record draggable with snapping
  Draggable.create(record, {
    type: "x,y",
    bounds: document.querySelector('#app'),
    onDragEnd: function() {
      const leftPosition = { x: -1000, y: 0 }; // Left side position (half hidden)
      const threshold = 550; // Distance threshold to snap

      const distanceToPlayer = Math.hypot(this.x - playerPosition.x, this.y - playerPosition.y);
      const distanceToLeft = Math.hypot(this.x - leftPosition.x, this.y - leftPosition.y);

      // Snap to the player or left side
      if (distanceToPlayer < threshold) {
        gsap.to(record, { x: playerPosition.x, y: playerPosition.y, duration: 0.5 });
      } else if (distanceToLeft < threshold) {
        gsap.to(record, { x: leftPosition.x, y: leftPosition.y, duration: 0.5 });
      }
    }
  });
  
  // Play and stop the record
  playButton.addEventListener('click', () => {

    if (!isPlaying) {
      gsap.to(needle, {
        rotation: 30,
        duration: 0.8,
        ease: "power2.out"
      });
      playButton.textContent = "Stop";
      Draggable.get(record).disable();
    } else {
      gsap.to(needle, {
        rotation: 0,
        duration: 0.5,
        ease: "power2.out"
      });
      playButton.textContent = "Play";
      Draggable.get(record).enable();
    }
    isPlaying = !isPlaying;
  });
});