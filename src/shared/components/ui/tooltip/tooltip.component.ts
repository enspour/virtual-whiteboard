import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Input,
} from "@angular/core";

import { AppService, ThemePalette, ThemePaletteToken } from "@shared";

@Component({
  templateUrl: "./tooltip.component.html",
  styleUrl: "./tooltip.component.scss",
})
export class TooltipComponent implements AfterViewInit {
  @Input({ required: true }) tooltip!: string;
  @Input({ required: true }) rect!: DOMRect;

  private gap = 10;

  constructor(
    @Inject(ThemePaletteToken) palette: ThemePalette,
    private elementRef: ElementRef<HTMLElement>,
    private appService: AppService
  ) {
    const bg = `var(--theme-${palette}-tooltip-bg)`;
    const color = `var(--theme-${palette}-tooltip-color)`;

    this.elementRef.nativeElement.style.setProperty("--bg", bg);
    this.elementRef.nativeElement.style.setProperty("--color", color);
  }

  ngAfterViewInit(): void {
    const element = this.elementRef.nativeElement;

    const sizes = this.appService.Sizes;

    const { height, width } = element.getBoundingClientRect();

    element.style.left = this.rect.x + this.rect.width / 2 - width / 2 + "px";

    const totalHeight = this.rect.y + this.rect.height + height + 2 * this.gap;

    if (sizes.height > totalHeight) {
      element.style.top = this.rect.y + this.rect.height + this.gap + "px";
    } else {
      element.style.top = this.rect.y - height - this.gap + "px";
    }
  }
}
