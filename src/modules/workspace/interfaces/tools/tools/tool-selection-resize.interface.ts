import { ResizeDirection, ToolBase } from "@workspace/interfaces";

export interface ToolSelectionResize extends ToolBase {
  name: `selection-resize-${ResizeDirection}`;
}
