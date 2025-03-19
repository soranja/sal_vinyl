import './style.css'

document.querySelector('#app').innerHTML = 
`
  <div class="w-full h-screen flex flex-col justify-center items-center bg-[#f0f0f0] overflow-hidden">
    <div class="max-h-[70vh] flex flex-col justify-center items-center">
      <div class="relative w-full h-full flex justify-center items-center">
        <img src="/player/player.png" alt="player" class="relative max-h-full max-w-full object-contain z-0 border-2 border-amber-500" />
        <img src="/player/oh-dirty-fingers.png" alt="record" class="absolute max-h-full max-w-full object-contain z-10 transform -translate-x-[13%] border-2 border-amber-500 opacity-20" />
        <img src="/player/needle.png" alt="needle" class="max-h-full max-w-full object-contain z-20 border-2 border-amber-500" />
      </div>
    </div>
  </div>
`