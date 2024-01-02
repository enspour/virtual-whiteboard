import {
  DrawingBrush,
  DrawingPainter,
  ScreenScale,
  ScreenScroll,
  ScreenSizes,
} from "@workspace/interfaces";

export class DrawingBrushPainter implements DrawingPainter {
  private context: CanvasRenderingContext2D;

  constructor(context: CanvasRenderingContext2D) {
    this.context = context;
  }

  public paint(
    drawing: DrawingBrush,
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

    const points = drawing.points;

    for (let i = 0; i < points.length; i++) {
      const point = points[i];

      const x = (point.x + scroll.x) * scale;
      const y = (point.y + scroll.y) * scale;

      if (i === 0) {
        this.context.moveTo(x, y);
      } else {
        this.context.lineTo(x, y);
      }
    }

    this.context.stroke();
  }
}
