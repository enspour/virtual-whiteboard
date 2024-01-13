import { Coordinates, Point } from "@workspace/interfaces";

export const findReflection = (
  currentCoordinates: Coordinates,
  initialCoordinates: Coordinates
): Point => {
  if (
    initialCoordinates.startX > currentCoordinates.endX &&
    initialCoordinates.startY > currentCoordinates.endY
  ) {
    return { x: -1, y: 1 };
  }

  if (
    initialCoordinates.endX < currentCoordinates.startX &&
    initialCoordinates.endY < currentCoordinates.startY
  ) {
    return { x: 1, y: -1 };
  }

  if (
    initialCoordinates.endX < currentCoordinates.startX &&
    initialCoordinates.startY > currentCoordinates.endY
  ) {
    return { x: 1, y: 1 };
  }

  if (
    initialCoordinates.startX > currentCoordinates.endX &&
    initialCoordinates.endY < currentCoordinates.startY
  ) {
    return { x: -1, y: -1 };
  }

  if (
    initialCoordinates.startX > currentCoordinates.endX &&
    initialCoordinates.startY < currentCoordinates.endY &&
    initialCoordinates.endY > currentCoordinates.startY
  ) {
    return { x: -1, y: 0 };
  }

  if (
    initialCoordinates.endX < currentCoordinates.startX &&
    initialCoordinates.startY < currentCoordinates.endY &&
    initialCoordinates.endY > currentCoordinates.startY
  ) {
    return { x: 1, y: 0 };
  }

  if (
    initialCoordinates.startY > currentCoordinates.endY &&
    initialCoordinates.startX < currentCoordinates.endX &&
    initialCoordinates.endX > currentCoordinates.startX
  ) {
    return { x: 0, y: 1 };
  }

  if (
    initialCoordinates.endY < currentCoordinates.startY &&
    initialCoordinates.startX < currentCoordinates.endX &&
    initialCoordinates.endX > currentCoordinates.startX
  ) {
    return { x: 0, y: -1 };
  }

  return { x: 0, y: 0 };
};
