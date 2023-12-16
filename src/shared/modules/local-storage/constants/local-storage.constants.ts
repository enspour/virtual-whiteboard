import { LocalStoragePairs } from "../interfaces";

import { TOOLKIT } from "@workspace/constants";

export const LS_THEME = "__v1/theme";

export const LS_SCREEN_SCROLL = "__v1/screen/scroll";
export const LS_SCREEN_SCALE = "__v1/screen/scale";

export const LS_TOOLKIT = "__v1/toolkit";
export const LS_SELECTED_TOOL = "__v1/toolkit/selected";

export const LS_DEFAULTS: LocalStoragePairs = {
  [LS_THEME]: "light",

  [LS_SCREEN_SCALE]: 1,
  [LS_SCREEN_SCROLL]: {
    x: 0,
    y: 0,
  },

  [LS_TOOLKIT]: TOOLKIT,
  [LS_SELECTED_TOOL]: TOOLKIT[0].name,
};
