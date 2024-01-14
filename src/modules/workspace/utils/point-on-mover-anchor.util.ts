import { ScreenService, WorkspaceInjector } from "@workspace/services";

import { Point } from "@workspace/interfaces";

import { MOVER_ANCHOR_RADIUS } from "@workspace/constants";

let screenService: ScreenService | null = null;

export const isPointOnMoverAnchor = (point: Point, anchor: Point) => {
  if (!screenService) {
    screenService = WorkspaceInjector.get(ScreenService);
  }

  const scale = screenService.Scale;

  const radius = MOVER_ANCHOR_RADIUS / scale;

  return (
    Math.pow(point.x - anchor.x, 2) + Math.pow(point.y - anchor.y, 2) <
    Math.pow(radius, 2)
  );
};
