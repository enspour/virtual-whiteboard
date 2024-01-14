import {
  ToolArrow,
  ToolBrush,
  ToolEllipse,
  ToolEraser,
  ToolHand,
  ToolRectangle,
  ToolSelection,
  ToolSelectionClick,
  ToolSelectionMoveCoordinates,
  ToolSelectionMovePoints,
  ToolSelectionResize,
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
  | ToolSelectionMoveCoordinates
  | ToolSelectionMovePoints
  | ToolSelectionClick
  | ToolSelectionResize
  | ToolTextCreate
  | ToolTextEdit;
