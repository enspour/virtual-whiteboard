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

    const length = drawing.points.length;

    const p1 = drawing.points[length - 2];
    const p2 = drawing.points[length - 1];

    const dX = p2.x - p1.x;
    const dY = p2.y - p1.y;

    const angle = Math.atan2(dY, dX);

    const arrowAngle = (30 * Math.PI) / 180;

    const x = (p2.x + scroll.x) * scale;
    const y = (p2.y + scroll.y) * scale;

    const strokeWidth = drawing.strokeWidth * scale * 3;

    this.context.moveTo(
      x - strokeWidth * Math.cos(angle - arrowAngle),
      y - strokeWidth * Math.sin(angle - arrowAngle)
    );

    this.context.lineTo(x, y);

    this.context.lineTo(
      x - strokeWidth * Math.cos(angle + arrowAngle),
      y - strokeWidth * Math.sin(angle + arrowAngle)
    );

    this.context.stroke();

    this.context.closePath();
  }
}
