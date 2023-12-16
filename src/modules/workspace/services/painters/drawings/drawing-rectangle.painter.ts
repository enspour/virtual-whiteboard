import { DrawingPainter, DrawingRectangle } from "@workspace/interfaces";

export class DrawingRectanglePainter implements DrawingPainter {
  private context: CanvasRenderingContext2D;

  constructor(context: CanvasRenderingContext2D) {
    this.context = context;
  }

  public paint(drawing: DrawingRectangle) {}
}
