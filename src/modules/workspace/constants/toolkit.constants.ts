import {
  ExecutableTool,
  SelectableTool,
  ToolCursors,
  ToolIcons,
  ToolTips,
} from "@workspace/interfaces";

export const TOOLKIT: SelectableTool[] = [
  { name: "hand", isRemoveSelection: false },
  { name: "selection", isRemoveSelection: false },
  {
    name: "brush",
    strokeColor: "#eeeeee",
    strokeWidth: 2,
    isRemoveSelection: true,
  },
  {
    name: "rectangle",
    roundness: 16,
    strokeColor: "#eeeeee",
    strokeWidth: 2,
    isRemoveSelection: true,
  },
  {
    name: "ellipse",
    strokeColor: "#eeeeee",
    strokeWidth: 2,
    isRemoveSelection: true,
  },
  {
    name: "arrow",
    strokeColor: "#eeeeee",
    strokeWidth: 2,
    isRemoveSelection: true,
  },
  {
    name: "text",
    textColor: "#eeeeee",
    textSize: 20,
    textFamily: "Roboto",
    lineHeight: 20,
    isRemoveSelection: true,
  },
  { name: "eraser", isRemoveSelection: true },
];

export const EXECUTABLE_TOOLS: ExecutableTool[] = [
  ...TOOLKIT,
  {
    name: "selection-select",
    isRemoveSelection: false,
  },
  {
    name: "selection-move",
    isRemoveSelection: false,
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

  selection: "default",
  "executed--selection": "default",

  "selection-select": "default",
  "executed--selection-select": "default",

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
