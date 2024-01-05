import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

import {
  EventsService,
  PainterService,
  ScreenService,
} from "@workspace/services";

@Component({
  selector: "app-canvas",
  templateUrl: "./canvas.component.html",
  styleUrl: "./canvas.component.scss",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CanvasComponent implements OnInit {
  @ViewChild("canvas", { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  constructor(
    private screenService: ScreenService,
    private eventsService: EventsService,
    private painterService: PainterService
  ) {
    this.screenService.sizes$
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateSizes());
  }

  ngOnInit(): void {
    this.updateSizes();
    this.updateServices();
  }

  private updateSizes() {
    const canvas = this.canvas?.nativeElement;

    if (!canvas) {
      return;
    }

    const { width, height } = this.screenService.Sizes;

    canvas.width = width;
    canvas.height = height;
  }

  private updateServices() {
    const canvas = this.canvas?.nativeElement;

    if (!canvas) {
      return;
    }

    this.eventsService.setCanvas(canvas);

    const context = canvas.getContext("2d");

    if (context) {
      this.painterService.setContext(context);
    }
  }
}
