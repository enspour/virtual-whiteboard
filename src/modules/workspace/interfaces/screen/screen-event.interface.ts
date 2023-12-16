export type ScreenEvent = {
  type:
    | "scale in"
    | "scale out"
    | "scroll left"
    | "scroll right"
    | "scroll up"
    | "scroll down";

  event: WheelEvent;
};

export type ScreenEventType = ScreenEvent["type"];

export type ScreenEventHandler = (event: ScreenEvent) => void;
export type ScreenEventHandlers = Record<ScreenEventType, ScreenEventHandler>;
