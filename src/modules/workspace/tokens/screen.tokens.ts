import { InjectionToken } from "@angular/core";

import { ScreenStorage } from "@workspace/interfaces/screen/screen-storage.interface";

export const ScreenStorageToken = new InjectionToken<ScreenStorage>(
  "__tokens/screen-storage"
);
