import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
} from "@angular/core";

import { SharedModule } from "@shared/shared.module";

import { ThemePalette, ThemePaletteToken } from "@theme";

@Component({
  selector: "app-header-action-bar",
  standalone: true,
  imports: [SharedModule],
  templateUrl: "./header-action-bar.component.html",
  styleUrl: "./header-action-bar.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderActionBarComponent {
  constructor(
    @Inject(ThemePaletteToken) palette: ThemePalette,
    private elementRef: ElementRef<HTMLElement>
  ) {
    const bg = `var(--theme-${palette}-bg)`;
    this.elementRef.nativeElement.style.setProperty("--bg", bg);
  }
}
