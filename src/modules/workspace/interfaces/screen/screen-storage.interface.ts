import { ScreenScale, ScreenScroll } from "./screen.interfaces";

export interface ScreenStorage {
  getScroll(): Promise<ScreenScroll>;
  getScale(): Promise<ScreenScale>;

  setScroll(scroll: ScreenScroll): Promise<void>;
  setScale(scale: ScreenScale): Promise<void>;
}
