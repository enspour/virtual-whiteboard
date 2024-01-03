import { ToolArrow } from "./tools/tool-arrow.interface";
import { ToolBrush } from "./tools/tool-brush.interface";
import { ToolEllipse } from "./tools/tool-ellipse.interface";
import { ToolEraser } from "./tools/tool-eraser.interface";
import { ToolHand } from "./tools/tool-hand.interface";
import { ToolRectangle } from "./tools/tool-rectangle.interface";
import { ToolSelectionMove } from "./tools/tool-selection-move.interface";
import { ToolSelectionSelect } from "./tools/tool-selection-select.interface";
import { ToolSelection } from "./tools/tool-selection.interface";
import { ToolText } from "./tools/tool-text.interface";

export type SelectableTool =
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
