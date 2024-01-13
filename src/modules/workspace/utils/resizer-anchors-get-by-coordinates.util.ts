import { Coordinates } from "@workspace/interfaces";

export const getResizerAnchorsByCoordinates = (coordinates: Coordinates) => {
  const { startX, startY, endX, endY } = coordinates;

  const anchors = [
    { x: startX, y: startY, direction: "nwse" },
    { x: endX, y: startY, direction: "nesw" },
    { x: endX, y: endY, direction: "senw" },
    { x: startX, y: endY, direction: "swne" },
  ] as const;

  return anchors;
};
