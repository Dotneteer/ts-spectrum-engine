// --- Button IDs and selectors
export const START = "#start";
export const PAUSE = "#pause";
export const STOP = "#stop";
export const RESTART = "#restart";
export const TEST_IT = "#test-it";
export const LOAD_MODE = "#load-mode";
export const PACMAN = "#pac-man";
export const JETSET = "#jet-set";

export const BUTTON_NAMES = [
    START, PAUSE, STOP, RESTART
];
export const BUTTON_IDS = BUTTON_NAMES.join(',');
export const DIS_BUTTON_IDS = BUTTON_NAMES.map(name => `${name}-disabled`).join(',');
export const ALL_BUTTON_IDS = `${BUTTON_IDS},${DIS_BUTTON_IDS}`;

export const SHADOW_SCREEN = "#shadowscreen";
export const SCREEN = "#screen";
export const EMULATOR_COLUMN = "#emulator-column";
export const PLAY_OVERLAY = "#play-overlay";
export const OVERLAY_TEXT = "#overlay-text";
