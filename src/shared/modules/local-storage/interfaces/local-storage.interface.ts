import { Theme } from "../../theme/interfaces/theme.interface";
import {
  Drawing,
  HistoryStorageData,
  ScreenScale,
  ScreenScroll,
  Tool,
} from "@workspace/interfaces";

import {
  LS_DRAWINGS,
  LS_HISTORY_COMMANDS,
  LS_HISTORY_POSITION,
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

  [LS_DRAWINGS]: Drawing[];

  [LS_HISTORY_COMMANDS]: HistoryStorageData["commands"];
  [LS_HISTORY_POSITION]: HistoryStorageData["position"];
}

export type LocalStorageKey = keyof LocalStoragePairs;
