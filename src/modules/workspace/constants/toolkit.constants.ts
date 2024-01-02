import {
  ExecutableTool,
  Tool,
  ToolCursors,
  ToolIcons,
  ToolTips,
} from "@workspace/interfaces";

export const TOOLKIT: Tool[] = [
  { name: "hand", isMutation: false },
  { name: "selection", isMutation: false },
  {
    name: "brush",
    strokeColor: "#eeeeee",
    strokeWidth: 2,
    isMutation: true,
  },
  {
    name: "rectangle",
    roundness: 16,
    strokeColor: "#eeeeee",
    strokeWidth: 2,
    isMutation: true,
  },
  {
    name: "ellipse",
    strokeColor: "#eeeeee",
    strokeWidth: 2,
    isMutation: true,
  },
  {
    name: "arrow",
    strokeColor: "#eeeeee",
    strokeWidth: 2,
    isMutation: true,
  },
  {
    name: "text",
    textColor: "#eeeeee",
    textSize: 20,
    textFamily: "Roboto",
    lineHeight: 20,
    isMutation: true,
  },
  { name: "eraser", isMutation: true },
];

export const EXECUTABLE_TOOLS: ExecutableTool[] = [
  ...TOOLKIT,
  {
    name: "selection-select",
    isMutation: false,
  },
  {
    name: "selection-move",
    isMutation: false,
  },
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

  "selection-select": "auto",
  "executed--selection-select": "auto",

  "selection-move": "move",
  "executed--selection-move": "move",

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
  ellipse: "Ellipse",
  arrow: "Arrow",
  text: "Text",
  eraser: "Eraser",
};
