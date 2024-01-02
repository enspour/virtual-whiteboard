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
import { HistoryService } from "@workspace/services/history/history.service";
import { ToolkitService } from "@workspace/services/toolkit/toolkit.service";

import { ThemePalette, ThemePaletteToken } from "@theme";

@Component({
  selector: "app-footer-history",
  standalone: true,
  imports: [SharedModule],
  templateUrl: "./footer-history.component.html",
  styleUrl: "./footer-history.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterHistoryComponent implements OnInit {
  public disabled = false;

  private destroy$ = inject(DestroyService);

  constructor(
    @Inject(ThemePaletteToken) palette: ThemePalette,
    private cdRef: ChangeDetectorRef,
    private elementRef: ElementRef<HTMLElement>,
    private historyService: HistoryService,
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

  public onUndo() {
    this.historyService.undo();
  }

  public onRedo() {
    this.historyService.redo();
  }
}
