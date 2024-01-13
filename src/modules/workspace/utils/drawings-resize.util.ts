import { Coordinates, Drawing, Point } from "@workspace/interfaces";

export const resizeDrawings = (
  coordinates: Coordinates,
  drawings: Drawing[],
  drawingsCoordinates: Coordinates
) => {
  for (const drawing of drawings) {
    const width = drawingsCoordinates.endX - drawingsCoordinates.startX;
    const height = drawingsCoordinates.endY - drawingsCoordinates.startY;

    const newWidth = coordinates.endX - coordinates.startX;
    const newHeight = coordinates.endY - coordinates.startY;

    const ratio = {
      x: newWidth / width,
      y: newHeight / height,
    };

    if (newWidth > 0.05) {
      resizeByX(coordinates, drawing, drawingsCoordinates, ratio);
    }

    if (newHeight > 0.05) {
      resizeByY(coordinates, drawing, drawingsCoordinates, ratio);
    }
  }
};

const resizeByX = (
  coordinates: Coordinates,
  drawing: Drawing,
  drawingsCoordinates: Coordinates,
  ratio: Point
) => {
  const left = drawing.coordinates.startX - drawingsCoordinates.startX;
  const right = drawingsCoordinates.endX - drawing.coordinates.endX;

  const startX = coordinates.startX + left * ratio.x;
  const endX = coordinates.endX - right * ratio.x;

  const newWidth = endX - startX;

  switch (drawing.type) {
    case "arrow":
    case "brush": {
      for (const point of drawing.points) {
        const left = point.x - drawing.coordinates.startX;
        point.x = startX + left * ratio.x;
      }
      break;
    }
    case "text": {
      const width = drawing.coordinates.endX - drawing.coordinates.startX;

      drawing.textSize *= newWidth / width;
      drawing.lineHeight *= newWidth / width;
      break;
    }
  }

  drawing.coordinates.startX = startX;
  drawing.coordinates.endX = endX;

  drawing.width = newWidth;
};

const resizeByY = (
  coordinates: Coordinates,
  drawing: Drawing,
  drawingsCoordinates: Coordinates,
  ratio: Point
) => {
  const top = drawing.coordinates.startY - drawingsCoordinates.startY;
  const bottom = drawingsCoordinates.endY - drawing.coordinates.endY;

  const startY = coordinates.startY + top * ratio.y;
  const endY = coordinates.endY - bottom * ratio.y;

  const newHeight = endY - startY;

  switch (drawing.type) {
    case "arrow":
    case "brush": {
      for (const point of drawing.points) {
        const top = point.y - drawing.coordinates.startY;
        point.y = startY + top * ratio.y;
      }
      break;
    }
  }

  drawing.coordinates.startY = startY;
  drawing.coordinates.endY = endY;

  drawing.height = newHeight;
};
