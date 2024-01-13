import { Coordinates } from "@workspace/interfaces";

export const isSameCoordinates = (A: Coordinates, B: Coordinates) => {
  if (
    A.startX === B.startX &&
    A.startY === B.startY &&
    A.endX === B.endX &&
    A.endY === B.endY
  ) {
    return true;
  }

  return false;
};
