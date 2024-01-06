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

import { SharedModule, ThemePalette, ThemePaletteToken } from "@shared";

import { DestroyService, ToolsService } from "@workspace/services";

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
    private toolsService: ToolsService
  ) {
    const bg = `var(--theme-${palette}-bg)`;
    this.elementRef.nativeElement.style.setProperty("--bg", bg);
  }

  ngOnInit(): void {
    this.toolsService.executedTool$
      .pipe(takeUntil(this.destroy$))
      .subscribe((tool) => {
        this.disabled = !!tool;
        this.cdRef.detectChanges();
      });
  }
}
