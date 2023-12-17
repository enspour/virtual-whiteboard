import {
  DrawingArrow,
  DrawingPainter,
  ScreenScale,
  ScreenScroll,
  ScreenSizes,
} from "@workspace/interfaces";

export class DrawingArrowPainter implements DrawingPainter {
  private context: CanvasRenderingContext2D;

  constructor(context: CanvasRenderingContext2D) {
    this.context = context;
  }

  public paint(
    drawing: DrawingArrow,
    scroll: ScreenScroll,
    sizes: ScreenSizes,
    scale: ScreenScale,
    inTrash: boolean
  ) {}
}
