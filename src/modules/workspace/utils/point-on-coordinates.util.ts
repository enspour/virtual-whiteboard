import { Coordinates, Point } from "@workspace/interfaces";

export const isPointOnCoordinates = (
  point: Point,
  coordinates: Coordinates
) => {
  if (
    coordinates.startX <= point.x &&
    coordinates.startY <= point.y &&
    coordinates.endX >= point.x &&
    coordinates.endY >= point.y
  ) {
    return true;
  }

  return false;
};
