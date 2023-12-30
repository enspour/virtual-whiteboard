import { ScreenScale, ScreenScroll } from "./screen.interfaces";

export interface ScreenStorageData {
  scroll: ScreenScroll;
  scale: ScreenScale;
}

export interface ScreenStorage {
  restore(): Promise<ScreenStorageData>;

  setScroll(scroll: ScreenScroll): Promise<void>;
  setScale(scale: ScreenScale): Promise<void>;
}
