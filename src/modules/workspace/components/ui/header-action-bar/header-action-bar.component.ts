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
import { ToolkitService } from "@workspace/services/toolkit/toolkit.service";

import { ThemePalette, ThemePaletteToken } from "@theme";

@Component({
  selector: "app-header-action-bar",
  standalone: true,
  imports: [SharedModule],
  templateUrl: "./header-action-bar.component.html",
  styleUrl: "./header-action-bar.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderActionBarComponent implements OnInit {
  public disabled = false;

  private destroy$ = inject(DestroyService);

  constructor(
    @Inject(ThemePaletteToken) palette: ThemePalette,
    private cdRef: ChangeDetectorRef,
    private elementRef: ElementRef<HTMLElement>,
    private toolkitService: ToolkitService
  ) {
    const bg = `var(--theme-${palette}-bg)`;
    this.elementRef.nativeElement.style.setProperty("--bg", bg);
  }

  ngOnInit(): void {
    this.toolkitService.executedTool$
      .pipe(takeUntil(this.destroy$))
      .subscribe((tool) => {
        this.disabled = !!tool;
        this.cdRef.detectChanges();
      });
  }
}
