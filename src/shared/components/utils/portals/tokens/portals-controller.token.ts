import { InjectionToken } from "@angular/core";

import { PortalsController } from "../interfaces";

export const portalsControllerToken = new InjectionToken<PortalsController>(
  "__portals/controller"
);
