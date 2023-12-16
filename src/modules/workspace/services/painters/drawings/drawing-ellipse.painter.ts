import { DrawingEllipse, DrawingPainter } from "@workspace/interfaces";

export class DrawingEllipsePainter implements DrawingPainter {
  private context: CanvasRenderingContext2D;

  constructor(context: CanvasRenderingContext2D) {
    this.context = context;
  }

  public paint(drawing: DrawingEllipse) {}
}
