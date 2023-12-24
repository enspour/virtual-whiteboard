import { Signal } from "@angular/core";

import { Portal } from "./portal.interface";

export interface PortalsController {
  portals: Signal<Map<string, Portal[]>>;
  openPortal(id: string, portal: Portal): void;
  closePortal(id: string, portal: Portal): void;
}
