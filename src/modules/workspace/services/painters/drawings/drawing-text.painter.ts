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

    const { text, textColor, textFamily, coordinates } = drawing;

    const textSize = drawing.textSize * scale;
    const lineHeight = drawing.lineHeight * scale;

    this.context.font = `${textSize}px ${textFamily}`;
    this.context.textBaseline = "middle";

    if (inTrash) {
      this.context.fillStyle = textColor + "4d";
    } else {
      this.context.fillStyle = textColor;
    }

    const lines = text.split("\n");

    const startX = (coordinates.startX + scroll.x) * scale;
    const startY = (coordinates.startY + scroll.y) * scale;

    const alignmentY = lineHeight / 2;

    for (let i = 0; i < lines.length; i++) {
      const x = startX;
      const y = startY + lineHeight * i + alignmentY;

      this.context.fillText(lines[i], x, y);
    }

    this.context.stroke();
  }
}
