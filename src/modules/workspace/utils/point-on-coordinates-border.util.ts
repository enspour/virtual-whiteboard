import { distance } from "@workspace/utils";

import { Coordinates, Point } from "@workspace/interfaces";

export const isPointOnCoordinatesBorder = (
  point: Point,
  coordinates: Coordinates
) => {
  const { startX, startY, endX, endY } = coordinates;

  const leftUpCorner = {
    x: startX,
    y: startY,
  };

  const rightUpCorner = {
    x: endX,
    y: startY,
  };

  const rightDownCorner = {
    x: endX,
    y: endY,
  };

  const leftDownCorner = {
    x: startX,
    y: endY,
  };

  if (
    distance(leftUpCorner, point) + distance(point, rightUpCorner) <=
      distance(leftUpCorner, rightUpCorner) + 1 ||
    distance(rightUpCorner, point) + distance(point, rightDownCorner) <=
      distance(rightUpCorner, rightDownCorner) + 1 ||
    distance(rightDownCorner, point) + distance(point, leftDownCorner) <=
      distance(rightDownCorner, leftDownCorner) + 1 ||
    distance(leftDownCorner, point) + distance(point, leftUpCorner) <=
      distance(leftDownCorner, leftUpCorner) + 1
  ) {
    return true;
  }

  return false;
};
