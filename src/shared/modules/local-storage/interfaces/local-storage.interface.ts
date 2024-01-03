import { Theme } from "../../theme/interfaces/theme.interface";
import {
  Drawing,
  HistoryStorageData,
  ScreenScale,
  ScreenScroll,
  SelectableTool,
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

  [LS_TOOLKIT]: SelectableTool[];
  [LS_SELECTED_TOOL]: SelectableTool["name"];

  [LS_DRAWINGS]: Drawing[];

  [LS_HISTORY_COMMANDS]: HistoryStorageData["commands"];
  [LS_HISTORY_POSITION]: HistoryStorageData["position"];
}

export type LocalStorageKey = keyof LocalStoragePairs;
