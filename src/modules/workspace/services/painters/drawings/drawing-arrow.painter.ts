import { DrawingArrow, DrawingPainter } from "@workspace/interfaces";

export class DrawingArrowPainter implements DrawingPainter {
  private context: CanvasRenderingContext2D;

  constructor(context: CanvasRenderingContext2D) {
    this.context = context;
  }

  public paint(drawing: DrawingArrow) {}
}
