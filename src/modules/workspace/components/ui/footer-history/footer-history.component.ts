import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
} from "@angular/core";

import { SharedModule } from "@shared/shared.module";

import { HistoryService } from "@workspace/services/history/history.service";

import { ThemePalette, ThemePaletteToken } from "@theme";

@Component({
  selector: "app-footer-history",
  standalone: true,
  imports: [SharedModule],
  templateUrl: "./footer-history.component.html",
  styleUrl: "./footer-history.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterHistoryComponent {
  constructor(
    @Inject(ThemePaletteToken) palette: ThemePalette,
    private elementRef: ElementRef<HTMLElement>,
    private historyService: HistoryService
  ) {
    const bg = `var(--theme-${palette}-bg)`;
    this.elementRef.nativeElement.style.setProperty("--bg", bg);
  }

  public onUndo() {
    this.historyService.undo();
  }

  public onRedo() {
    this.historyService.redo();
  }
}
