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
    scale: ScreenScale
  ) {
    this.context.beginPath();

    this.context.lineWidth = drawing.strokeWidth * scale;
    this.context.strokeStyle = drawing.strokeColor;

    const points = drawing.points;

    for (let i = 0; i < points.length; i++) {
      const point = points[i];

      const x = point.x + scroll.x;
      const y = point.y + scroll.y;

      if (i === 0) {
        this.context.moveTo(x * scale, y * scale);
      } else {
        this.context.lineTo(x * scale, y * scale);
      }
    }

    this.context.stroke();

    this.context.closePath();
  }
}
