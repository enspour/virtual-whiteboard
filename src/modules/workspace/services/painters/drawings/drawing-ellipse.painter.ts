import {
  DrawingEllipse,
  DrawingPainter,
  ScreenScale,
  ScreenScroll,
  ScreenSizes,
} from "@workspace/interfaces";

export class DrawingEllipsePainter implements DrawingPainter {
  private context: CanvasRenderingContext2D;

  constructor(context: CanvasRenderingContext2D) {
    this.context = context;
  }

  public paint(
    drawing: DrawingEllipse,
    scroll: ScreenScroll,
    sizes: ScreenSizes,
    scale: ScreenScale,
    inTrash: boolean
  ) {
    this.context.beginPath();

    this.context.lineWidth = drawing.strokeWidth * scale;

    if (inTrash) {
      this.context.strokeStyle = drawing.strokeColor + "4d";
    } else {
      this.context.strokeStyle = drawing.strokeColor;
    }

    const startX = (drawing.coordinates.startX + scroll.x) * scale;
    const startY = (drawing.coordinates.startY + scroll.y) * scale;

    const width = drawing.width * scale;
    const height = drawing.height * scale;

    const radiusX = width / 2;
    const radiusY = height / 2;

    const rotation = 0;

    const startAngle = 0;
    const endAngle = Math.PI * 2;

    this.context.ellipse(
      startX + radiusX,
      startY + radiusY,
      radiusX,
      radiusY,
      rotation,
      startAngle,
      endAngle
    );

    this.context.stroke();
  }
}
