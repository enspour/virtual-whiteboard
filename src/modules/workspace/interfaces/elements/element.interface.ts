import { Drawing, Point, ResizeDirection } from "@workspace/interfaces";

export interface ElementDrawing {
  type: "drawing";
  drawing: Drawing;
}

export interface ElementSelection {
  type: "selection";
}

export interface ElementSelectionBorder {
  type: "selection-border";
  border: { direction: ResizeDirection };
}

export interface ElementMoverAnchor {
  type: "mover-anchor";
  anchor: Point;
}

export interface ElementResizerAnchor {
  type: "resizer-anchor";
  anchor: Point & { direction: ResizeDirection };
}

export type Element =
  | ElementDrawing
  | ElementMoverAnchor
  | ElementResizerAnchor
  | ElementSelection
  | ElementSelectionBorder;
