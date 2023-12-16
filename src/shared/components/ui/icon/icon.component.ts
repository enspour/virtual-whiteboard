import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
} from "@angular/core";

import { SvgIconComponent } from "angular-svg-icon";

import { ThemePalette, ThemePaletteToken } from "@theme";

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

  constructor(@Inject(ThemePaletteToken) palette: ThemePalette) {
    this.fill = `var(--theme-${palette}-icon)`;
  }
}
