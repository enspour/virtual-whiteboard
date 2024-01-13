import { Coordinates, Drawing } from "@workspace/interfaces";

export const reflectDrawingsByX = (
  drawings: Drawing[],
  drawingsCoordinates: Coordinates
) => {
  for (const drawing of drawings) {
    const left = drawing.coordinates.startX - drawingsCoordinates.startX;
    const right = drawingsCoordinates.endX - drawing.coordinates.endX;

    const startX = drawingsCoordinates.startX + right;
    const endX = drawingsCoordinates.endX - left;

    switch (drawing.type) {
      case "arrow":
      case "brush": {
        for (const point of drawing.points) {
          const right = drawing.coordinates.endX - point.x;
          point.x = startX + right;
        }
      }
    }

    drawing.coordinates.startX = startX;
    drawing.coordinates.endX = endX;

    drawing.width = drawing.coordinates.endX - drawing.coordinates.startX;
  }
};

export const reflectDrawingsByY = (
  drawings: Drawing[],
  drawingsCoordinates: Coordinates
) => {
  for (const drawing of drawings) {
    const top = drawing.coordinates.startY - drawingsCoordinates.startY;
    const bottom = drawingsCoordinates.endY - drawing.coordinates.endY;

    const startY = drawingsCoordinates.startY + bottom;
    const endY = drawingsCoordinates.endY - top;

    switch (drawing.type) {
      case "arrow":
      case "brush": {
        for (const point of drawing.points) {
          const bottom = drawing.coordinates.endY - point.y;
          point.y = startY + bottom;
        }
      }
    }

    drawing.coordinates.startY = startY;
    drawing.coordinates.endY = endY;

    drawing.height = drawing.coordinates.endY - drawing.coordinates.startY;
  }
};
