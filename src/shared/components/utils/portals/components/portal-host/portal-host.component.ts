import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  OnInit,
  Signal,
} from "@angular/core";

import { Portal, PortalsController } from "../../interfaces";

import { portalsControllerToken } from "../../tokens/portals-controller.token";

@Component({
  selector: "app-portal-host",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./portal-host.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortalHostComponent implements OnInit {
  @Input({ required: true }) id!: string;

  public portals!: Signal<Portal[]>;

  constructor(
    @Inject(portalsControllerToken)
    private portalsController: PortalsController
  ) {}

  ngOnInit(): void {
    this.portals = this.portalsController.getPortals(this.id);
  }
}
