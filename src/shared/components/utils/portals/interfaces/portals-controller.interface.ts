import { Signal } from "@angular/core";

import { Portal } from "./portal.interface";

export interface PortalsController {
  getPortals(hostId: string): Signal<Portal[]>;
  openPortal(hostId: string, portal: Portal): void;
  closePortal(hostId: string, portal: Portal): void;
}
