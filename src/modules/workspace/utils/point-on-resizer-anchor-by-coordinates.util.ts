import {
  getResizerAnchorsByCoordinates,
  isPointOnResizerAnchor,
} from "@workspace/utils";

import { Coordinates, Point } from "@workspace/interfaces";

export const isPointOnResizerAnchorByCoordinates = (
  point: Point,
  coordinates: Coordinates
) => {
  const anchors = getResizerAnchorsByCoordinates(coordinates);

  const anchor = anchors.find((anchor) =>
    isPointOnResizerAnchor(point, anchor)
  );

  return !!anchor;
};
