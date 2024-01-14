import { getCoordinatesByPoints, isSamePoints } from "@workspace/utils";

import { Point, PointDrawing } from "@workspace/interfaces";

export const moveDrawingsPoints = (
  drawings: PointDrawing[],
  target: Point,
  value: Point
) => {
  for (const drawing of drawings) {
    const { points } = drawing;

    for (const point of points) {
      if (isSamePoints(point, target)) {
        point.x = value.x;
        point.y = value.y;
      }
    }

    const coordinates = getCoordinatesByPoints(points);

    if (coordinates) {
      drawing.coordinates = coordinates;

      drawing.width = coordinates.endX - coordinates.startX;
      drawing.height = coordinates.endY - coordinates.startY;
    }
  }
};
