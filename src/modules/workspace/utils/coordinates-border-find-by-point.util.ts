import { distance } from "@workspace/utils";

import { Coordinates, Point, ResizeDirection } from "@workspace/interfaces";

export const findCoordinatesBorderByPoint = (
  point: Point,
  coordinates: Coordinates
): {
  direction: ResizeDirection;
} | null => {
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
    distance(leftUpCorner, rightUpCorner) + 1
  ) {
    return {
      direction: "ns",
    };
  }

  if (
    distance(rightUpCorner, point) + distance(point, rightDownCorner) <=
    distance(rightUpCorner, rightDownCorner) + 1
  ) {
    return {
      direction: "ew",
    };
  }

  if (
    distance(rightDownCorner, point) + distance(point, leftDownCorner) <=
    distance(rightDownCorner, leftDownCorner) + 1
  ) {
    return {
      direction: "sn",
    };
  }

  if (
    distance(leftDownCorner, point) + distance(point, leftUpCorner) <=
    distance(leftDownCorner, leftUpCorner) + 1
  ) {
    return {
      direction: "we",
    };
  }

  return null;
};
