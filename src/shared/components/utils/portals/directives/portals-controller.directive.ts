import { Directive, signal } from "@angular/core";

import { produce } from "immer";

import { Portal, PortalsController } from "../interfaces";

import { portalsControllerToken } from "../tokens/portals-controller.token";

@Directive({
  selector: "[appPortalsController]",
  standalone: true,
  providers: [
    { provide: portalsControllerToken, useClass: PortalsControllerDirective },
  ],
})
export class PortalsControllerDirective implements PortalsController {
  private _portals = signal<Map<string, Portal[]>>(new Map());
  public portals = this._portals.asReadonly();

  public openPortal(id: string, portal: Portal): void {
    this._portals.update((map) => {
      const portals = [...(map.get(id) || []), portal];
      return produce(map, (draft) => draft.set(id, portals));
    });
  }

  public closePortal(id: string, portal: Portal): void {
    this._portals.update((map) => {
      const portals = (map.get(id) || []).filter((item) => item !== portal);
      return produce(map, (draft) => draft.set(id, portals));
    });
  }
}
