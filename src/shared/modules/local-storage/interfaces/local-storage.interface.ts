import { Theme } from "../../theme/interfaces/theme.interface";
import { ScreenScale, ScreenScroll, Tool } from "@workspace/interfaces";

import {
  LS_SCREEN_SCALE,
  LS_SCREEN_SCROLL,
  LS_SELECTED_TOOL,
  LS_THEME,
  LS_TOOLKIT,
} from "../constants";

export interface LocalStoragePairs {
  [LS_THEME]: Theme;

  [LS_SCREEN_SCROLL]: ScreenScroll;
  [LS_SCREEN_SCALE]: ScreenScale;

  [LS_TOOLKIT]: Tool[];
  [LS_SELECTED_TOOL]: Tool["name"];
}

export type LocalStorageKey = keyof LocalStoragePairs;
