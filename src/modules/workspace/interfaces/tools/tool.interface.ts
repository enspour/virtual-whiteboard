import {
  ToolArrow,
  ToolBrush,
  ToolEllipse,
  ToolEraser,
  ToolHand,
  ToolRectangle,
  ToolSelection,
  ToolSelectionClick,
  ToolSelectionMove,
  ToolSelectionSelect,
  ToolText,
  ToolTextCreate,
  ToolTextEdit,
} from "..";

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
  | SelectableTool
  | ToolSelectionSelect
  | ToolSelectionMove
  | ToolSelectionClick
  | ToolTextCreate
  | ToolTextEdit;
