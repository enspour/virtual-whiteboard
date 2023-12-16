import { InjectionToken } from "@angular/core";

import { DrawingStorage } from "@workspace/interfaces/drawings/drawing-storage.interface";

export const DrawingStorageToken = new InjectionToken<DrawingStorage>(
  "__tokens/drawing-storage"
);
