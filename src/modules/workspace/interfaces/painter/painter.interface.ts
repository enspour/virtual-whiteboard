import { ScreenScale, ScreenScroll, ScreenSizes } from "..";

export interface Painter {
  setContext(context: CanvasRenderingContext2D): void;
  paint(scroll: ScreenScroll, sizes: ScreenSizes, scale: ScreenScale): void;
}
