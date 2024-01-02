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
  ) {
    this.context.beginPath();

    this.context.lineWidth = drawing.strokeWidth * scale;
    this.context.lineCap = "round";
    this.context.lineJoin = "round";

    if (inTrash) {
      this.context.strokeStyle = drawing.strokeColor + "4d";
    } else {
      this.context.strokeStyle = drawing.strokeColor;
    }

    const startX = (drawing.coordinates.startX + scroll.x) * scale;
    const startY = (drawing.coordinates.startY + scroll.y) * scale;

    const width = drawing.width * scale;
    const height = drawing.height * scale;

    this.context.roundRect(startX, startY, width, height, drawing.roundness);

    this.context.stroke();
  }
}
