import { Theme } from "../../theme/interfaces/theme.interface";
import { ScreenScale, ScreenScroll } from "@workspace/interfaces";

import { LS_SCREEN_SCALE, LS_SCREEN_SCROLL, LS_THEME } from "../constants";

export interface LocalStoragePairs {
  [LS_THEME]: Theme;

  [LS_SCREEN_SCROLL]: ScreenScroll;
  [LS_SCREEN_SCALE]: ScreenScale;
}

export type LocalStorageKey = keyof LocalStoragePairs;
