import { isPointOnMoverAnchor } from "@workspace/utils";

import { Drawing, Point } from "@workspace/interfaces";

export const isPointOnMoverAnchorByDrawing = (
  point: Point,
  drawing: Drawing
) => {
  switch (drawing.type) {
    case "arrow": {
      const anchor = drawing.points.find((anchor) =>
        isPointOnMoverAnchor(point, anchor)
      );

      return !!anchor;
    }
  }

  return false;
};
