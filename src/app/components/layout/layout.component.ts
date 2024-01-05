import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
} from "@angular/core";

import { AppService, AppSizes, SharedModule } from "@shared";

@Component({
  selector: "app-layout",
  templateUrl: "./layout.component.html",
  styleUrl: "./layout.component.scss",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SharedModule],
})
export class LayoutComponent {
  constructor(private appService: AppService) {}

  @HostListener("window:mousedown", ["$event"])
  mousedown(event: MouseEvent) {
    this.appService.emitMouseDown(event);
  }

  @HostListener("window:keydown", ["$event"])
  keydown(event: KeyboardEvent) {
    if (event.code === "Escape") {
      return this.appService.emitEscape(event);
    }

    if (event.code === "Delete") {
      return this.appService.emitDelete(event);
    }

    if (event.ctrlKey && event.shiftKey && event.code === "KeyZ") {
      return this.appService.emitRedo(event);
    }

    if (event.ctrlKey && event.code === "KeyZ") {
      return this.appService.emitUndo(event);
    }
  }

  onSizesChange(sizes: AppSizes) {
    this.appService.setSizes(sizes);
  }
}
