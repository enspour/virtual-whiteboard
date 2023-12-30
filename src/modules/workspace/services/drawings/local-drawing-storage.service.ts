import { Injectable } from "@angular/core";

import {
  Drawing,
  DrawingStorage,
  DrawingStorageData,
} from "@workspace/interfaces";

import { LS_DRAWINGS, LocalStorageService } from "@local-storage";

@Injectable()
export class LocalDrawingStorageService implements DrawingStorage {
  constructor(private localStorageService: LocalStorageService) {}

  public async restore(): Promise<DrawingStorageData> {
    const drawings = this.localStorageService.get(LS_DRAWINGS);

    return {
      drawings,
    };
  }

  public async setDrawings(drawings: Drawing[]): Promise<void> {
    this.localStorageService.set(LS_DRAWINGS, drawings);
  }
}
