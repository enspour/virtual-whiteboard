import { Drawing, Point } from "@workspace/interfaces";

import { isPointOnCoordinates } from "./point-on-coordinates.util";
import { isPointOnDrawing } from "./point-on-drawing.util";

export const isPointOnDrawingCoordinates = (point: Point, drawing: Drawing) => {
  switch (drawing.type) {
    case "brush":
    case "rectangle":
    case "ellipse":
    case "text": {
      const { coordinates } = drawing;

      return isPointOnCoordinates(point, coordinates);
    }
    case "arrow": {
      if (isPointOnDrawing(point, drawing)) {
        return true;
      }

      return false;
    }
  }
};
