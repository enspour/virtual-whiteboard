import {
  DrawingPainter,
  DrawingRectangle,
  ScreenScale,
  ScreenScroll,
  ScreenSizes,
} from "@workspace/interfaces";

export class DrawingRectanglePainter implements DrawingPainter {
  private context: CanvasRenderingContext2D;

  constructor(context: CanvasRenderingContext2D) {
    this.context = context;
  }

  public paint(
    drawing: DrawingRectangle,
    scroll: ScreenScroll,
    sizes: ScreenSizes,
    scale: ScreenScale,
    inTrash: boolean
  ) {}
}
