import { InjectionToken } from "@angular/core";

import { DrawingStorage } from "@workspace/interfaces";

export const DrawingStorageToken = new InjectionToken<DrawingStorage>(
  "__tokens/drawing-storage"
);
