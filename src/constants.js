// Record State
const recordState = {
  snappedRecord: null,
  spinningInstance: null,
  isReadyToPlay: false,
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
  return recordState.isReadyToPlay;
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
  recordState.isReadyToPlay = value;
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
    title: 'Blade',
    audio: '/audio/fatal.mp3',
    cover: '/covers/blade/blade.png',
    videoCover: '/covers/blade/fatal.webm',
  },
  {
    id: 'ameli',
    title: 'Amélie',
    audio: '/audio/amelie.mp3',
    cover: '/covers/ameli.png',
  },
  {
    id: 'banlieue-13',
    title: 'Banlieue 13',
    audio: '/audio/motors.mp3',
    cover: '/covers/banlieue-13.png',
  },
  {
    id: 'big-bad-wolf',
    title: 'Big Bad Wolf',
    audio: '/audio/big-bad-wolf.mp3',
    cover: '/covers/big-bad-wolf.png',
  },
  {
    id: 'glukoza',
    title: 'Glukoza',
    audio: '/audio/malish.mp3',
    cover: '/covers/glukoza.png',
  },
  {
    id: 'oh-dirty-fingers',
    title: 'Oh Dirty Fingers',
    audio: '/audio/oh-dirty-fingers.mp3',
    cover: '/covers/oh-dirty-fingers.png',
  },
  {
    id: 'shadowax',
    title: 'Shadowax',
    audio: '/audio/a-b.mp3',
    cover: '/covers/shadowax.png',
  },
  {
    id: 'starcardigan',
    title: 'Starcardigan',
    audio: '/audio/raw.mp3',
    cover: '/covers/starcardigan.png',
  },
  {
    id: 'wasabi',
    title: 'Wasabi',
    audio: '/audio/techno-metal.mp3',
    cover: '/covers/wasabi.png',
  },
];
