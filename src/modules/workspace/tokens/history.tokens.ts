import { InjectionToken } from "@angular/core";

import { HistoryStorage } from "@workspace/interfaces";

export const HistoryStorageToken = new InjectionToken<HistoryStorage>(
  "__tokens/history-storage"
);
