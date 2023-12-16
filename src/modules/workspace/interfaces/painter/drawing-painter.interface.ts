import {
  ScreenScale,
  ScreenScroll,
  ScreenSizes,
} from "../screen/screen.interfaces";

import { Drawing } from "../drawings/drawing.interface";

export interface DrawingPainter {
  paint(
    drawing: Drawing,
    scroll: ScreenScroll,
    sizes: ScreenSizes,
    scale: ScreenScale
  ): void;
}
