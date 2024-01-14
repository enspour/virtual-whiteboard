import { Coordinates, Drawing } from "@workspace/interfaces";

import { resizeDrawings } from "./drawings-resize.util";

export const moveDrawingsCoordinates = (
  coordinates: Coordinates,
  drawings: Drawing[],
  drawingsCoordinates: Coordinates
) => resizeDrawings(coordinates, drawings, drawingsCoordinates);
