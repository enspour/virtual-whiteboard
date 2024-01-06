import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

import { ScreenService, WorkspaceService } from "@workspace/services";

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
    private workspaceService: WorkspaceService,
    private screenService: ScreenService
  ) {
    this.screenService.sizes$
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateSizes());
  }

  ngOnInit(): void {
    this.updateSizes();
    this.updateCanvas();
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

  private updateCanvas() {
    const canvas = this.canvas?.nativeElement;

    if (!canvas) {
      return;
    }

    this.workspaceService.setCanvas(canvas);
  }
}
