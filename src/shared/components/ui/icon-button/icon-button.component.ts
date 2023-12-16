import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  Output,
} from "@angular/core";

import { ThemePalette, ThemePaletteToken } from "@theme";

import { IconComponent } from "../icon/icon.component";

@Component({
  selector: "app-icon-button",
  templateUrl: "./icon-button.component.html",
  styleUrl: "./icon-button.component.scss",
  standalone: true,
  imports: [CommonModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[class.active]": "isActive",
    "(click)": "handleClick($event)",
  },
})
export class IconButtonComponent {
  @Input({ required: true }) src!: string;

  @Input() isActive = false;

  @Output() buttonClick = new EventEmitter<Event>();

  constructor(
    @Inject(ThemePaletteToken) palette: ThemePalette,
    private elementRef: ElementRef<HTMLElement>
  ) {
    const hover = `var(--theme-${palette}-bg--hover)`;
    this.elementRef.nativeElement.style.setProperty("--hover", hover);
  }

  handleClick(e: Event) {
    this.buttonClick.emit(e);
  }
}
