import { Directive, signal } from "@angular/core";

import { Hosts, Portal, PortalsController } from "../interfaces";

import { portalsControllerToken } from "../tokens/portals-controller.token";

@Directive({
  selector: "[appPortalsController]",
  standalone: true,
  providers: [
    { provide: portalsControllerToken, useClass: PortalsControllerDirective },
  ],
})
export class PortalsControllerDirective implements PortalsController {
  private hosts: Hosts = new Map();

  public getPortals(hostId: string) {
    if (this.hosts.has(hostId)) {
      return this.hosts.get(hostId)!;
    }

    const portals = signal<Portal[]>([]);

    this.hosts.set(hostId, portals);

    return portals;
  }

  public openPortal(hostId: string, portal: Portal): void {
    if (this.hosts.has(hostId)) {
      const portals = this.hosts.get(hostId)!;
      portals.update((portals) => [...portals, portal]);
    }
  }

  public closePortal(hostId: string, portal: Portal): void {
    if (this.hosts.has(hostId)) {
      const portals = this.hosts.get(hostId)!;
      portals.update((portals) => portals.filter((item) => item !== portal));
    }
  }
}
