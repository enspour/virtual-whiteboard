import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
} from "@angular/core";

import { SvgIconComponent } from "angular-svg-icon";

import { ThemePalette, ThemePaletteToken, ThemeService } from "@shared";

@Component({
  selector: "app-icon",
  templateUrl: "./icon.component.html",
  styleUrl: "./icon.component.scss",
  standalone: true,
  imports: [CommonModule, SvgIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
  @Input({ required: true }) src!: string;

  public fill: string;
  public stroke: string;

  constructor(
    @Inject(ThemePaletteToken) palette: ThemePalette,
    private themeService: ThemeService
  ) {
    this.fill = this.themeService.Properties[`--theme-${palette}-icon`];
    this.stroke = this.themeService.Properties[`--theme-${palette}-icon`];
  }
}
