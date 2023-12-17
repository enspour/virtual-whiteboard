import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

import { merge } from "rxjs";

import { PainterService } from "@workspace/services/painters/painter.service";
import { ScreenService } from "@workspace/services/screen/screen.service";

import { CanvasComponent } from "../canvas/canvas.component";

@Component({
  selector: "app-canvas-painter",
  templateUrl: "./canvas-painter.component.html",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CanvasPainterComponent implements OnInit {
  @Input({ required: true }) canvas!: CanvasComponent;

  constructor(
    private screenService: ScreenService,
    private painterService: PainterService
  ) {
    merge(
      this.screenService.scroll$,
      this.screenService.sizes$,
      this.screenService.scale$
    )
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.painterService.paint();
      });
  }

  ngOnInit(): void {
    const canvas = this.canvas.canvas?.nativeElement;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    this.painterService.setContext(context);
  }
}
