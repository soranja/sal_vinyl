// Record State
const recordState = {
  snappedRecord: null,
  spinningInstance: null,
  isRecordReady: false,
  currentDraggedRecord: null,
};

// Audio State
const audioState = {
  audio: null,
  record: null,
  isPlayed: false,
};

// Getters
export function getSnappedRecord() {
  return recordState.snappedRecord;
}
export function isAnyRecordSnapped() {
  return recordState.snappedRecord !== null;
}
export function isRecordReady() {
  return recordState.isRecordReady;
}
export function isPlayed() {
  return audioState.isPlayed;
}
export function getCurrentDraggedRecord() {
  return recordState.currentDraggedRecord;
}
export function getRecordSpin() {
  return recordState.spinningInstance;
}
export function getCurrentAudio() {
  return audioState.audio;
}
export function getCurrentRecord() {
  return audioState.record;
}

// Setters
export function setSnappedRecord(record) {
  recordState.snappedRecord = record;
}
export function setRecordReady(value) {
  recordState.isRecordReady = value;
}
export function setCurrentDraggedRecord(record) {
  recordState.currentDraggedRecord = record;
}
export function setRecordSpin(spin) {
  recordState.spinningInstance = spin;
}
export function setCurrentAudio(audio) {
  audioState.audio = audio;
}
export function setCurrentRecord(record) {
  audioState.record = record;
}
export function setPlayState(state) {
  audioState.isPlayed = state;
}

// Clearers
export function clearCurrentDraggedRecord() {
  recordState.currentDraggedRecord = null;
}
export function clearSnappedRecord() {
  recordState.snappedRecord = null;
}

// Record List
export const records = [
  {
    id: 'blade',
    title: 'RZA — Fatal',
    audio: '/audio/fatal.mp3',
    cover: '/covers/blade/blade.png',
    videoCover: '/covers/blade/fatal.webm',
    background: '/posters/blade-trinity.webp',
    description: 'RZA, a founding member of the Wu-Tang Clan, composed this track for Blade: Trinity (2004).',

    initPos: { x: 0, y: 0 },

    isInInitArea: true,
    isInInitSnapZone: true,
    isReadyForInitSnap: false,
    initSnapped: true,
    initDragged: false,

    isInReadyArea: false,
    isInReadySnapZone: false,
    isReadyForReadySnap: false,
    readyDragged: false,
    readySnapped: false,

    currentPos: { x: 0, y: 0 },
    frozen: false,
  },
  {
    id: 'ameli',
    title: "Yann Tiersen — \nLa Valse d'Amélie",
    audio: '/audio/amelie.mp3',
    cover: '/covers/ameli.png',
    videoCover: null,
    background: '/posters/amelie.webp',
    description:
      "Yann Tiersen, known for his minimalist compositions, composed this piece for the 2001 French film Le Fabuleux Destin d'Amélie Poulain. It has become iconic, often associated with romantic scenes.",

    initPos: { x: 0, y: 0 },

    isInInitArea: true,
    isInInitSnapZone: true,
    isReadyForInitSnap: false,
    initSnapped: true,
    initDragged: false,

    isInReadyArea: false,
    isInReadySnapZone: false,
    isReadyForReadySnap: false,
    readyDragged: false,
    readySnapped: false,

    currentPos: { x: 0, y: 0 },
    frozen: false,
  },
  {
    id: 'banlieue-13',
    title: 'Da Octopuss — Motors',
    audio: '/audio/motors.mp3',
    cover: '/covers/banlieue-13.png',
    videoCover: null,
    background: '/posters/b-13.webp',
    description:
      'Da Octopuss, a French DJ duo, heavily contributed to the soundtrack of Banlieue 13. The film itself is renowned for its parkour sequences and high-octane action.',

    initPos: { x: 0, y: 0 },

    isInInitArea: true,
    isInInitSnapZone: true,
    isReadyForInitSnap: false,
    initSnapped: true,
    initDragged: false,

    isInReadyArea: false,
    isInReadySnapZone: false,
    isReadyForReadySnap: false,
    readyDragged: false,
    readySnapped: false,

    currentPos: { x: 0, y: 0 },
    frozen: false,
  },
  {
    id: 'big-bad-wolf',
    title: 'Duck Sauce — \nBig Bad Wolf',
    audio: '/audio/big-bad-wolf.mp3',
    cover: '/covers/big-bad-wolf.png',
    videoCover: null,
    background: '/posters/big-bad-wolf.webp',
    description:
      'Duck Sauce, a collaboration between DJs A-Trak and Armand Van Helden, released this single in 2011. The track went viral due to its quirky video and catchy “howling” hook.',

    initPos: { x: 0, y: 0 },

    isInInitArea: true,
    isInInitSnapZone: true,
    isReadyForInitSnap: false,
    initSnapped: true,
    initDragged: false,

    isInReadyArea: false,
    isInReadySnapZone: false,
    isReadyForReadySnap: false,
    readyDragged: false,
    readySnapped: false,

    currentPos: { x: 0, y: 0 },
    frozen: false,
  },
  {
    id: 'glukoza',
    title: 'Glukoza — \nМалыш',
    audio: '/audio/malish.mp3',
    cover: '/covers/glukoza.png',
    videoCover: null,
    background: '/posters/glukoza.webp',
    description:
      'Glukoza, a Russian pop singer who rose to fame in the early 2000s, captivated audiences with her animated “girl with Doberman” character.',

    initPos: { x: 0, y: 0 },

    isInInitArea: true,
    isInInitSnapZone: true,
    isReadyForInitSnap: false,
    initSnapped: true,
    initDragged: false,

    isInReadyArea: false,
    isInReadySnapZone: false,
    isReadyForReadySnap: false,
    readyDragged: false,
    readySnapped: false,

    currentPos: { x: 0, y: 0 },
    frozen: false,
  },
  {
    id: 'oh-dirty-fingers',
    title: 'Oh Dirty Fingers — \n歌声与微笑',
    audio: '/audio/oh-dirty-fingers.mp3',
    cover: '/covers/oh-dirty-fingers.png',
    videoCover: null,
    background: '/posters/oh-dirty-fingers.webp',
    description:
      'Oh Dirty Fingers, a garage-punk band from Shanghai, covered the children’s song “Singing and Smiling,” released on Chinese TV in 1989. The song conveys a message about sharing and spreading happiness.',

    initPos: { x: 0, y: 0 },

    isInInitArea: true,
    isInInitSnapZone: true,
    isReadyForInitSnap: false,
    initSnapped: true,
    initDragged: false,

    isInReadyArea: false,
    isInReadySnapZone: false,
    isReadyForReadySnap: false,
    readyDragged: false,
    readySnapped: false,

    currentPos: { x: 0, y: 0 },
    frozen: false,
  },
  {
    id: 'shadowax',
    title: 'Shadowax — \nA+B',
    audio: '/audio/a-b.mp3',
    cover: '/covers/shadowax.png',
    videoCover: null,
    background: '/posters/shadowax.webp',
    description:
      'Shadowax is the techno alias of Russian electronic musician Mirabella Karayanova, who is also known for her ambient project Ishome.',

    initPos: { x: 0, y: 0 },

    isInInitArea: true,
    isInInitSnapZone: true,
    isReadyForInitSnap: false,
    initSnapped: true,
    initDragged: false,

    isInReadyArea: false,
    isInReadySnapZone: false,
    isReadyForReadySnap: false,
    readyDragged: false,
    readySnapped: false,

    currentPos: { x: 0, y: 0 },
    frozen: false,
  },
  {
    id: 'starcardigan',
    title: 'Starcardigan — \nRaw',
    audio: '/audio/raw.mp3',
    cover: '/covers/starcardigan.png',
    videoCover: null,
    background: '/posters/starcardigan.webp',
    description:
      'Starcardigan is a Russian band from Vladivostok known for blending electronic and indie-pop elements.',

    initPos: { x: 0, y: 0 },

    isInInitArea: true,
    isInInitSnapZone: true,
    isReadyForInitSnap: false,
    initSnapped: true,
    initDragged: false,

    isInReadyArea: false,
    isInReadySnapZone: false,
    isReadyForReadySnap: false,
    readyDragged: false,
    readySnapped: false,

    currentPos: { x: 0, y: 0 },
    frozen: false,
  },
  {
    id: 'wasabi',
    title: 'Maïdi Roth & Franck Pilant — \nTechno Metal',
    audio: '/audio/techno-metal.mp3',
    cover: '/covers/wasabi.png',
    videoCover: null,
    background: '/posters/wasabi.webp',
    description:
      'Maïdi Roth, a French singer-songwriter, and Franck Pilant, a film composer, performed the track “Techno Metal” featured in the 2001 French action-comedy Wasabi.',

    initPos: { x: 0, y: 0 },

    isInInitArea: true,
    isInInitSnapZone: true,
    isReadyForInitSnap: false,
    initSnapped: true,
    initDragged: false,

    isInReadyArea: false,
    isInReadySnapZone: false,
    isReadyForReadySnap: false,
    readyDragged: false,
    readySnapped: false,

    currentPos: { x: 0, y: 0 },
    frozen: false,
  },
];

export function metaOf(wrapper) {
  return records.find((r) => r.audio === wrapper.dataset.name);
}

export const readyPos = { x: 0, y: 0 };
