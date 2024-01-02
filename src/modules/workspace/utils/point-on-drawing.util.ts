import {
  Drawing,
  DrawingArrow,
  DrawingBrush,
  DrawingEllipse,
  DrawingRectangle,
  Point,
} from "@workspace/interfaces";

import { distance } from "./point.util";

export const isPointOnDrawing = (point: Point, drawing: Drawing): boolean => {
  const { startX, endX, startY, endY } = drawing.coordinates;

  if (
    startX <= point.x &&
    endX >= point.x &&
    startY <= point.y &&
    endY >= point.y
  ) {
    switch (drawing.type) {
      case "brush":
        return isPointOnDrawingWithPoints(point, drawing);
      case "rectangle":
        return isPointOnRectangleDrawing(point, drawing);
      case "ellipse":
        return isPointOnEllipseDrawing(point, drawing);
      case "arrow":
        return isPointOnDrawingWithPoints(point, drawing);
      case "text":
        return true;
    }
  }

  return false;
};

const isPointOnDrawingWithPoints = (
  point: Point,
  drawing: DrawingBrush | DrawingArrow
): boolean => {
  const { points } = drawing;

  for (let i = 0; i < points.length - 1; i++) {
    const A = points[i];
    const B = points[i + 1];

    if (distance(A, point) + distance(point, B) <= distance(A, B) + 1) {
      return true;
    }
  }

  return false;
};

const isPointOnRectangleDrawing = (
  point: Point,
  drawing: DrawingRectangle
): boolean => {
  const { startX, startY, endX, endY } = drawing.coordinates;

  const leftUpCorner = {
    x: startX,
    y: startY,
  };

  const rightUpCorner = {
    x: endX,
    y: startY,
  };

  const rightDownCorner = {
    x: endX,
    y: endY,
  };

  const leftDownCorner = {
    x: startX,
    y: endY,
  };

  if (
    distance(leftUpCorner, point) + distance(point, rightUpCorner) <=
      distance(leftUpCorner, rightUpCorner) + 1 ||
    distance(rightUpCorner, point) + distance(point, rightDownCorner) <=
      distance(rightUpCorner, rightDownCorner) + 1 ||
    distance(rightDownCorner, point) + distance(point, leftDownCorner) <=
      distance(rightDownCorner, leftDownCorner) + 1 ||
    distance(leftDownCorner, point) + distance(point, leftUpCorner) <=
      distance(leftDownCorner, leftUpCorner) + 1
  ) {
    return true;
  }

  return false;
};

const isPointOnEllipseDrawing = (
  point: Point,
  drawing: DrawingEllipse
): boolean => {
  const radiusX = drawing.width / 2;
  const radiusY = drawing.height / 2;

  const center = {
    x: drawing.coordinates.startX + radiusX,
    y: drawing.coordinates.startY + radiusY,
  };

  const p =
    Math.pow(point.x - center.x, 2) / Math.pow(radiusX, 2) +
    Math.pow(point.y - center.y, 2) / Math.pow(radiusY, 2);

  return 0.95 <= p && p <= 1.05;
};
