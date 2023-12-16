import { Injectable } from "@angular/core";

import { Drawing, DrawingStorage } from "@workspace/interfaces";

import { LS_DRAWINGS, LocalStorageService } from "@local-storage";

@Injectable()
export class LocalDrawingStorageService implements DrawingStorage {
  constructor(private localStorageService: LocalStorageService) {}

  public async getAll(): Promise<Drawing[]> {
    return this.localStorageService.get(LS_DRAWINGS);
  }

  public async set(drawings: Drawing[]): Promise<void> {
    this.localStorageService.set(LS_DRAWINGS, drawings);
  }
}
