import { Coordinates, Point, ResizeDirection } from "@workspace/interfaces";

export const resizeCoordinates = (
  direction: ResizeDirection,
  currentCoordinates: Coordinates,
  initialCoordinates: Coordinates,
  point: Point
) => {
  const coordinates = { ...currentCoordinates };

  resize(direction, coordinates, initialCoordinates, point);

  return coordinates;
};

const resize = (
  direction: ResizeDirection,
  currentCoordinates: Coordinates,
  initialCoordinates: Coordinates,
  point: Point
) => {
  switch (direction) {
    case "ns":
      currentCoordinates.startY = point.y;
      currentCoordinates.endY = initialCoordinates.endY;
      return;
    case "sn":
      currentCoordinates.startY = initialCoordinates.startY;
      currentCoordinates.endY = point.y;
      return;
    case "we":
      currentCoordinates.startX = point.x;
      currentCoordinates.endX = initialCoordinates.endX;
      return;
    case "ew":
      currentCoordinates.startX = initialCoordinates.startX;
      currentCoordinates.endX = point.x;
      return;
    default: {
      const directionX = (direction[1] + direction[3]) as ResizeDirection;
      const directionY = (direction[0] + direction[2]) as ResizeDirection;
      resize(directionX, currentCoordinates, initialCoordinates, point);
      resize(directionY, currentCoordinates, initialCoordinates, point);
      return;
    }
  }
};
