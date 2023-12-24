import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
} from "@angular/core";

import { AppService } from "@shared/modules/app/services/app.service";

@Component({
  selector: "app-layout",
  templateUrl: "./layout.component.html",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  constructor(private appService: AppService) {}

  @HostListener("window:mousedown", ["$event"])
  mousedown(event: MouseEvent) {
    this.appService.emitMouseDown(event);
  }
}
