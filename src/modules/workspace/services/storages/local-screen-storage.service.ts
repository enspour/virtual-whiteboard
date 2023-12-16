import { Injectable } from "@angular/core";

import { ScreenScale, ScreenScroll } from "@workspace/interfaces";
import { ScreenStorage } from "@workspace/interfaces";

import {
  LS_SCREEN_SCALE,
  LS_SCREEN_SCROLL,
  LocalStorageService,
} from "@local-storage";

@Injectable()
export class LocalScreenStorageService implements ScreenStorage {
  constructor(private localStorageService: LocalStorageService) {}

  public async getScroll() {
    return this.localStorageService.get(LS_SCREEN_SCROLL);
  }

  public async getScale() {
    return this.localStorageService.get(LS_SCREEN_SCALE);
  }

  public async setScroll(scroll: ScreenScroll) {
    this.localStorageService.set(LS_SCREEN_SCROLL, scroll);
  }

  public async setScale(scale: ScreenScale) {
    this.localStorageService.set(LS_SCREEN_SCALE, scale);
  }
}
