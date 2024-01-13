import { Coordinates } from "@workspace/interfaces";

export const validateCoordinates = (coordinates: Coordinates) => {
  const value = { ...coordinates };

  if (value.startX > value.endX) {
    [value.startX, value.endX] = [value.endX, value.startX];
  }

  if (value.startY > value.endY) {
    [value.startY, value.endY] = [value.endY, value.startY];
  }

  return value;
};
