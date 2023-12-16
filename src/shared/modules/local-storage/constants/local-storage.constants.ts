import { LocalStoragePairs } from "../interfaces";

export const LS_THEME = "__v1/theme";

export const LS_SCREEN_SCROLL = "__v1/screen/scroll";
export const LS_SCREEN_SCALE = "__v1/screen/scale";

export const LS_DEFAULTS: LocalStoragePairs = {
  [LS_THEME]: "light",

  [LS_SCREEN_SCALE]: 1,
  [LS_SCREEN_SCROLL]: {
    x: 0,
    y: 0,
  },
};
