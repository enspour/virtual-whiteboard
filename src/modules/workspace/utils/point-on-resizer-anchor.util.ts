import { ScreenService, WorkspaceInjector } from "@workspace/services";

import { isPointOnCoordinates } from "@workspace/utils";

import { Point } from "@workspace/interfaces";

import {
  RESIZER_ANCHOR_HEIGHT,
  RESIZER_ANCHOR_WIDTH,
} from "@workspace/constants";

let screenService: ScreenService | null = null;

export const isPointOnResizerAnchor = (point: Point, anchor: Point) => {
  if (!screenService) {
    screenService = WorkspaceInjector.get(ScreenService);
  }

  const scale = screenService.Scale;

  const width = RESIZER_ANCHOR_WIDTH / scale;
  const height = RESIZER_ANCHOR_HEIGHT / scale;

  const coordinates = {
    startX: anchor.x - width / 2,
    endX: anchor.x + width / 2,
    startY: anchor.y - height / 2,
    endY: anchor.y + height / 2,
  };

  if (isPointOnCoordinates(point, coordinates)) {
    return true;
  }

  return false;
};
