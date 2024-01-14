import { Point } from "@workspace/interfaces";

export const isSamePoints = (A: Point, B: Point) => {
  return A.x === B.x && A.y === B.y;
};
