import {
  Cursor,
  ElementCursors,
  ResizeDirection,
  ToolCursors,
} from "@workspace/interfaces";

export const RESIZER_CURSOR: Record<ResizeDirection, Cursor> = {
  ew: "ew-resize",
  we: "ew-resize",
  ns: "ns-resize",
  sn: "ns-resize",
  nesw: "nesw-resize",
  swne: "nesw-resize",
  nwse: "nwse-resize",
  senw: "nwse-resize",
};

export const TOOL_CURSOR: ToolCursors = {
  hand: "grab",
  "executed--hand": "grabbing",

  selection: "default",
  "executed--selection": "default",
  "executed--selection-select": "default",
  "executed--selection-move": "move",
  "executed--selection-click": "auto",
  "executed--selection-resize-ew": "ew-resize",
  "executed--selection-resize-we": "ew-resize",
  "executed--selection-resize-ns": "ns-resize",
  "executed--selection-resize-sn": "ns-resize",
  "executed--selection-resize-nesw": "nesw-resize",
  "executed--selection-resize-swne": "nesw-resize",
  "executed--selection-resize-nwse": "nwse-resize",
  "executed--selection-resize-senw": "nwse-resize",

  brush: "crosshair",
  "executed--brush": "crosshair",

  rectangle: "crosshair",
  "executed--rectangle": "crosshair",

  ellipse: "crosshair",
  "executed--ellipse": "crosshair",

  arrow: "crosshair",
  "executed--arrow": "crosshair",

  text: "text",
  "executed--text": "text",
  "executed--text-create": "auto",
  "executed--text-edit": "auto",

  eraser: "crosshair",
  "executed--eraser": "crosshair",
};

export const ELEMENT_CURSOR: ElementCursors = {
  drawing: "move",
  selection: "move",
  "selection-border": "auto",
  "resizer-anchor": "auto",
  "mover-anchor": "pointer",
};
