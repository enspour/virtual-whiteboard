import { LocalStoragePairs } from "../interfaces";

import { TOOLKIT } from "@workspace/constants";

export const LS_THEME = "__v1/theme";

export const LS_SCREEN_SCROLL = "__v1/screen/scroll";
export const LS_SCREEN_SCALE = "__v1/screen/scale";

export const LS_TOOLKIT = "__v1/toolkit";
export const LS_SELECTED_TOOL = "__v1/toolkit/selected";

export const LS_DRAWINGS = "__v1/drawings";

export const LS_HISTORY_COMMANDS = "__v1/history/commands";
export const LS_HISTORY_POSITION = "__v1/history/position";

export const LS_DEFAULTS: LocalStoragePairs = {
  [LS_THEME]: "dark",

  [LS_SCREEN_SCALE]: 1,
  [LS_SCREEN_SCROLL]: {
    x: 0,
    y: 0,
  },

  [LS_TOOLKIT]: TOOLKIT,
  [LS_SELECTED_TOOL]: TOOLKIT[0].name,

  [LS_DRAWINGS]: [],

  [LS_HISTORY_COMMANDS]: [],
  [LS_HISTORY_POSITION]: 0,
};
