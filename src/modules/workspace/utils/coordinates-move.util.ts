import { Coordinates, Point } from "@workspace/interfaces";

export const moveCoordinates = (coordinates: Coordinates, start: Point) => {
  const newCoordinates = { ...coordinates };

  move(newCoordinates, start);

  return newCoordinates;
};

const move = (coordinates: Coordinates, start: Point) => {
  const width = coordinates.endX - coordinates.startX;
  const height = coordinates.endY - coordinates.startY;

  coordinates.startX = start.x;
  coordinates.startY = start.y;
  coordinates.endX = coordinates.startX + width;
  coordinates.endY = coordinates.startY + height;
};
