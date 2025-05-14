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
    title: 'RZA - Fatal (Blade Trinity OST)',
    audio: '/audio/fatal.mp3',
    cover: '/covers/blade/blade.png',
    videoCover: '/covers/blade/fatal.webm',
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
    title: "Yann Tiersen - La Valse d'Amélie (Amélie OST)",
    audio: '/audio/amelie.mp3',
    cover: '/covers/ameli.png',
    videoCover: null,
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
    title: 'Da Octopuss - Motors (Banlieue 13)',
    audio: '/audio/motors.mp3',
    cover: '/covers/banlieue-13.png',
    videoCover: null,
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
    title: 'Duck Sauce - Big Bad Wolf',
    audio: '/audio/big-bad-wolf.mp3',
    cover: '/covers/big-bad-wolf.png',
    videoCover: null,
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
    title: 'Glukoza - Малыш',
    audio: '/audio/malish.mp3',
    cover: '/covers/glukoza.png',
    videoCover: null,
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
    title: 'Oh Dirty Fingers - 歌声与微笑',
    audio: '/audio/oh-dirty-fingers.mp3',
    cover: '/covers/oh-dirty-fingers.png',
    videoCover: null,
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
    title: 'Shadowax - A-B',
    audio: '/audio/a-b.mp3',
    cover: '/covers/shadowax.png',
    videoCover: null,
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
    title: 'Starcardigan - Raw',
    audio: '/audio/raw.mp3',
    cover: '/covers/starcardigan.png',
    videoCover: null,
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
    title: 'Exhibition - Techno Metal (Wasabi OST)',
    audio: '/audio/techno-metal.mp3',
    cover: '/covers/wasabi.png',
    videoCover: null,
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
