import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnInit,
  inject,
} from "@angular/core";

import { takeUntil } from "rxjs";

import { SharedModule } from "@shared/shared.module";

import { DestroyService } from "@workspace/services/destroy.service";
import { ScreenService } from "@workspace/services/screen/screen.service";
import { ToolkitService } from "@workspace/services/toolkit/toolkit.service";

import { ThemePalette, ThemePaletteToken } from "@theme";

@Component({
  selector: "app-footer-scale",
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: "./footer-scale.component.html",
  styleUrl: "./footer-scale.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterScaleComponent implements OnInit {
  public scale!: number;

  public disabled = false;

  private destroy$ = inject(DestroyService);

  constructor(
    @Inject(ThemePaletteToken) palette: ThemePalette,
    private cdRef: ChangeDetectorRef,
    private elementRef: ElementRef<HTMLElement>,
    private screenService: ScreenService,
    private toolkitService: ToolkitService
  ) {
    const bg = `var(--theme-${palette}-bg)`;
    this.elementRef.nativeElement.style.setProperty("--bg", bg);
  }

  ngOnInit(): void {
    this.screenService.scale$
      .pipe(takeUntil(this.destroy$))
      .subscribe((scale) => {
        this.scale = scale;
        this.cdRef.detectChanges();
      });

    this.toolkitService.executedTool$
      .pipe(takeUntil(this.destroy$))
      .subscribe((tool) => {
        this.disabled = !!tool;
        this.cdRef.detectChanges();
      });
  }

  public onScaleIn() {
    const sizes = this.screenService.Sizes;

    const center = {
      x: sizes.width / 2,
      y: sizes.height / 2,
    };

    this.screenService.scaleIn(center);
  }

  public onScaleOut() {
    const sizes = this.screenService.Sizes;

    const center = {
      x: sizes.width / 2,
      y: sizes.height / 2,
    };

    this.screenService.scaleOut(center);
  }

  public onScaleToDefault() {
    this.screenService.scaleTo(1);
  }
}