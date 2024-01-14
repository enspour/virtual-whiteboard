import {
  ExecutableTool,
  SelectableTool,
  ToolIcons,
  ToolTips,
} from "@workspace/interfaces";

export const EXECUTABLE_TOOLS: ExecutableTool[] = [
  { name: "selection-select" },
  { name: "selection-move-coordinates" },
  { name: "selection-click" },
  { name: "selection-resize-ew" },
  { name: "selection-resize-we" },
  { name: "selection-resize-ns" },
  { name: "selection-resize-sn" },
  { name: "selection-resize-nesw" },
  { name: "selection-resize-swne" },
  { name: "selection-resize-nwse" },
  { name: "selection-resize-senw" },
  { name: "text-create" },
  { name: "text-edit" },
];

export const SELECTABLE_TOOLS: SelectableTool[] = [
  { name: "hand" },
  { name: "selection" },

  {
    name: "brush",
    strokeColor: "#eeeeee",
    strokeWidth: 2,
  },
  {
    name: "rectangle",
    roundness: 16,
    strokeColor: "#eeeeee",
    strokeWidth: 2,
  },
  {
    name: "ellipse",
    strokeColor: "#eeeeee",
    strokeWidth: 2,
  },
  {
    name: "arrow",
    strokeColor: "#eeeeee",
    strokeWidth: 2,
  },

  {
    name: "text",
    textColor: "#eeeeee",
    textSize: 20,
    textFamily: "Roboto",
    lineHeight: 28,
  },
  { name: "eraser" },
];

export const TOOLS: (ExecutableTool | SelectableTool)[] = [
  ...EXECUTABLE_TOOLS,
  ...SELECTABLE_TOOLS,
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
