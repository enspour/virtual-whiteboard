import { InjectionToken } from "@angular/core";

import { ScreenStorage } from "@workspace/interfaces";

export const ScreenStorageToken = new InjectionToken<ScreenStorage>(
  "__tokens/screen-storage"
);
