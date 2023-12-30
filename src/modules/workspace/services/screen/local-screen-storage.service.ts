import { Injectable } from "@angular/core";

import {
  ScreenScale,
  ScreenScroll,
  ScreenStorage,
  ScreenStorageData,
} from "@workspace/interfaces";

import {
  LS_SCREEN_SCALE,
  LS_SCREEN_SCROLL,
  LocalStorageService,
} from "@local-storage";

@Injectable()
export class LocalScreenStorageService implements ScreenStorage {
  constructor(private localStorageService: LocalStorageService) {}

  public async restore(): Promise<ScreenStorageData> {
    const scroll = this.localStorageService.get(LS_SCREEN_SCROLL);
    const scale = this.localStorageService.get(LS_SCREEN_SCALE);

    return {
      scroll,
      scale,
    };
  }

  public async setScroll(scroll: ScreenScroll) {
    this.localStorageService.set(LS_SCREEN_SCROLL, scroll);
  }

  public async setScale(scale: ScreenScale) {
    this.localStorageService.set(LS_SCREEN_SCALE, scale);
  }
}
