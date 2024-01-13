import { isPointOnCoordinates, isPointOnDrawing } from "@workspace/utils";

import { Drawing, Point } from "@workspace/interfaces";

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
