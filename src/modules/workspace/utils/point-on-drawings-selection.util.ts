import { Coordinates, Drawing, Point } from "@workspace/interfaces";

import { isPointOnCoordinates } from "./point-on-coordinates.util";
import { isPointOnDrawingCoordinates } from "./point-on-drawing-coordinates.util";

export const isPointOnDrawingsSelection = (
  point: Point,
  drawings: Drawing[],
  coordinates: Coordinates | null
) => {
  if (!coordinates) {
    return false;
  }

  if (drawings.length === 1) {
    if (isPointOnDrawingCoordinates(point, drawings[0])) {
      return true;
    }

    return false;
  } else {
    if (isPointOnCoordinates(point, coordinates)) {
      return true;
    }

    return false;
  }
};
