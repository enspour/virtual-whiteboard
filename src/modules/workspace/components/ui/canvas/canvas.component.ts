import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

import { ScreenService } from "@workspace/services/screen.service";

import { ScreenSizes } from "@workspace/interfaces";

@Component({
  selector: "app-canvas",
  templateUrl: "./canvas.component.html",
  styleUrl: "./canvas.component.scss",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CanvasComponent implements OnInit {
  @ViewChild("canvas") canvas!: ElementRef<HTMLCanvasElement>;

  constructor(
    private cdRef: ChangeDetectorRef,
    private screenService: ScreenService
  ) {
    this.screenService.sizes$
      .pipe(takeUntilDestroyed())
      .subscribe((sizes) => this.updateSizes(sizes));
  }

  ngOnInit(): void {
    this.cdRef.detectChanges();
  }

  private updateSizes(sizes: ScreenSizes) {
    const canvas = this.canvas?.nativeElement;

    if (!canvas) {
      return;
    }

    const { width, height } = sizes;

    canvas.width = width;
    canvas.height = height;
  }
}
