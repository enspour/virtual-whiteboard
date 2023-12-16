import { Tool, ToolCursors, ToolIcons } from "@workspace/interfaces";

export const TOOLKIT: Tool[] = [
  { name: "hand" },
  { name: "selection" },
  {
    name: "brush",
    strokeColor: "#000000",
    strokeWidth: 4,
  },
  {
    name: "rectangle",
    roundness: 0,
  },
  {
    name: "ellipse",
  },
  { name: "arrow" },
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
  selection: "auto",
  brush: "crosshair",
  rectangle: "crosshair",
  ellipse: "crosshair",
  arrow: "crosshair",
  text: "text",
  eraser: "crosshair",
};
