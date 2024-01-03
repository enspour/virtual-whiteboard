import { Drawing } from "@workspace/interfaces";

export const updateDrawingCoordinates = (
  drawing: Drawing,
  diffX: number,
  diffY: number
) => {
  const { coordinates } = drawing;

  coordinates.startX += diffX;
  coordinates.startY += diffY;
  coordinates.endX += diffX;
  coordinates.endY += diffY;

  if ("points" in drawing) {
    drawing.points = drawing.points.map((point) => ({
      x: point.x + diffX,
      y: point.y + diffY,
    }));
  }
};
