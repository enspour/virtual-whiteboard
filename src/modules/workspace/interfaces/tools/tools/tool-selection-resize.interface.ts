import { ToolBase } from "@workspace/interfaces";

export type ResizeDirection =
  | "ew"
  | "we"
  | "ns"
  | "sn"
  | "nesw"
  | "swne"
  | "nwse"
  | "senw";

export interface ToolSelectionResize extends ToolBase {
  name: `selection-resize-${ResizeDirection}`;
}
