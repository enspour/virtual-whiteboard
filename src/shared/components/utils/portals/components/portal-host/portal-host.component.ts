import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  computed,
} from "@angular/core";

import { PortalsController } from "../../interfaces";

import { portalsControllerToken } from "../../tokens/portals-controller.token";

@Component({
  selector: "app-portal-host",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./portal-host.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortalHostComponent {
  @Input({ required: true }) id!: string;

  public portals = computed(() => {
    return this.portalsController.portals().get(this.id) || [];
  });

  constructor(
    @Inject(portalsControllerToken) private portalsController: PortalsController
  ) {}
}
