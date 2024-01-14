import { Point } from "@workspace/interfaces";

export const distance = (A: Point, B: Point): number => {
  return Math.sqrt(Math.pow(A.x - B.x, 2) + Math.pow(A.y - B.y, 2));
};
