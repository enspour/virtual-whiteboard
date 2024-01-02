import {
  DrawingPainter,
  DrawingText,
  ScreenScale,
  ScreenScroll,
  ScreenSizes,
} from "@workspace/interfaces";

export class DrawingTextPainter implements DrawingPainter {
  private context: CanvasRenderingContext2D;

  constructor(context: CanvasRenderingContext2D) {
    this.context = context;
  }

  public paint(
    drawing: DrawingText,
    scroll: ScreenScroll,
    sizes: ScreenSizes,
    scale: ScreenScale,
    inTrash: boolean
  ) {
    this.context.beginPath();

    const { text, textColor, textSize, textFamily, lineHeight, coordinates } =
      drawing;

    this.context.font = `${textSize * scale}px ${textFamily}`;

    if (inTrash) {
      this.context.fillStyle = textColor + "4d";
    } else {
      this.context.fillStyle = textColor;
    }

    const yMeasurementError = (-lineHeight * scale) / 6;

    const startX = (coordinates.startX + scroll.x) * scale;
    const startY =
      (coordinates.startY + scroll.y + lineHeight) * scale + yMeasurementError;

    const splitted = text.replaceAll("\n\n", "\n").split("\n");

    for (let i = 0; i < splitted.length; i++) {
      this.context.fillText(
        splitted[i],
        startX,
        startY + lineHeight * scale * i
      );
    }

    this.context.stroke();
  }
}
