import { Tool, ToolCursors, ToolIcons, ToolTips } from "@workspace/interfaces";

export const TOOLKIT: Tool[] = [
  { name: "hand" },
  { name: "selection" },
  {
    name: "brush",
    strokeColor: "#000000",
    strokeWidth: 6,
  },
  {
    name: "rectangle",
    roundness: 16,
    strokeColor: "#000000",
    strokeWidth: 6,
  },
  {
    name: "ellipse",
    strokeColor: "#000000",
    strokeWidth: 6,
  },
  { name: "arrow", strokeColor: "#000000", strokeWidth: 6 },
  { name: "text" },
  { name: "eraser" },
];

export const TOOL_ICONS: ToolIcons = {
  hand: "assets/icons/hand.svg",
  selection: "assets/icons/selection.svg",
  brush: "assets/icons/brush.svg",
  rectangle: "assets/icons/rectangle.svg",
  ellipse: "assets/icons/circle.svg",
  arrow: "assets/icons/arrow.svg",
  text: "assets/icons/text.svg",
  eraser: "assets/icons/eraser.svg",
};

export const TOOL_CURSOR: ToolCursors = {
  hand: "grab",
  "executed--hand": "grabbing",

  selection: "auto",
  "executed--selection": "auto",

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

  eraser: "crosshair",
  "executed--eraser": "crosshair",
};

export const TOOL_TIP: ToolTips = {
  hand: "Hand",
  selection: "Selection",
  brush: "Brush",
  rectangle: "Rectangle",
  ellipse: "Circle",
  arrow: "Arrow",
  text: "Text",
  eraser: "Eraser",
};
