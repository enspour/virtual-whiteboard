export interface Painter {
  setContext(context: CanvasRenderingContext2D): void;
  paint(): void;
}
