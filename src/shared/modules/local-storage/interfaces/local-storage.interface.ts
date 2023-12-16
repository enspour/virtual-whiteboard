import { Theme } from "../../theme/interfaces/theme.interface";

import { LS_THEME } from "../constants";

export interface LocalStoragePairs {
  [LS_THEME]: Theme;
}

export type LocalStorageKey = keyof LocalStoragePairs;
