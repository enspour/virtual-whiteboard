import { Coordinates, Point } from "@workspace/interfaces";

export const getCoordinatesByPoints = (points: Point[]) => {
  let coordinates: Coordinates | null = null;

  for (const point of points) {
    if (!coordinates) {
      coordinates = {
        startX: point.x,
        startY: point.y,
        endX: point.x,
        endY: point.y,
      };
    } else {
      if (coordinates.startX > point.x) {
        coordinates.startX = point.x;
      }

      if (coordinates.startY > point.y) {
        coordinates.startY = point.y;
      }

      if (coordinates.endX < point.x) {
        coordinates.endX = point.x;
      }

      if (coordinates.endY < point.y) {
        coordinates.endY = point.y;
      }
    }
  }

  return coordinates;
};
