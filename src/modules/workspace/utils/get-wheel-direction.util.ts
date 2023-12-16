import { WheelDirection } from "@workspace/interfaces";

export const getWheelDirection = (event: WheelEvent): WheelDirection => {
  return event.deltaY < 0 ? "forward" : "back";
};
