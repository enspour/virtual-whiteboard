export interface ScreenScaleInEvent {
  type: "scale in";
  event: WheelEvent;
}

export interface ScreenScaleOutEvent {
  type: "scale out";
  event: WheelEvent;
}

export interface ScreenScrollLeft {
  type: "scroll left";
  event: WheelEvent;
}

export interface ScreenScrollRight {
  type: "scroll right";
  event: WheelEvent;
}

export interface ScreenScrollUp {
  type: "scroll up";
  event: WheelEvent;
}

export interface ScreenScrollDown {
  type: "scroll down";
  event: WheelEvent;
}

export type ScreenEvent =
  | ScreenScaleInEvent
  | ScreenScaleOutEvent
  | ScreenScrollLeft
  | ScreenScrollRight
  | ScreenScrollUp
  | ScreenScrollDown;

export type ScreenEventType = ScreenEvent["type"];
