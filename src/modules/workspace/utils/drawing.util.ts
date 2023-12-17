import { Drawing, Point } from "@workspace/interfaces";

export const handleAddedDrawingPoint = (drawing: Drawing, point: Point) => {
  const { x, y } = point;

  const { coordinates } = drawing;

  coordinates.startX = Math.min(coordinates.startX, x);
  coordinates.startY = Math.min(coordinates.startY, y);

  coordinates.endX = Math.max(coordinates.endX, x);
  coordinates.endY = Math.max(coordinates.endY, y);

  drawing.width = Math.abs(coordinates.endX - coordinates.startX);
  drawing.height = Math.abs(coordinates.endY - coordinates.startY);
};
