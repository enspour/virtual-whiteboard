import { DrawingArrow } from "@workspace/interfaces";

export const isDrawingArrow = (drawing: unknown): drawing is DrawingArrow => {
  if (
    drawing &&
    typeof drawing === "object" &&
    "type" in drawing &&
    typeof drawing.type === "string" &&
    drawing.type === "arrow"
  ) {
    return true;
  }

  return false;
};
