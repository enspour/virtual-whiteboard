import { ToolArrow } from "./tool-arrow.interface";
import { ToolBrush } from "./tool-brush.interface";
import { ToolEllipse } from "./tool-ellipse.interface";
import { ToolEraser } from "./tool-eraser.interface";
import { ToolHand } from "./tool-hand.interface";
import { ToolRectangle } from "./tool-rectangle.interface";
import { ToolSelectionMove } from "./tool-selection-move.interface";
import { ToolSelectionSelect } from "./tool-selection-select.interface";
import { ToolSelection } from "./tool-selection.interface";
import { ToolText } from "./tool-text.interface";

export type Tool =
  | ToolSelection
  | ToolHand
  | ToolBrush
  | ToolRectangle
  | ToolEllipse
  | ToolArrow
  | ToolText
  | ToolEraser;

export type ExecutableTool =
  | ToolSelection
  | ToolSelectionSelect
  | ToolSelectionMove
  | ToolHand
  | ToolBrush
  | ToolRectangle
  | ToolEllipse
  | ToolArrow
  | ToolText
  | ToolEraser;
