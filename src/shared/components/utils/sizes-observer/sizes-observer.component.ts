import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  afterNextRender,
} from "@angular/core";

import { debounce } from "@utils";

import { SizesObserverChange } from "./sizes-observer.interface";

@Component({
  selector: "app-sizes-observer",
  templateUrl: "./sizes-observer.component.html",
  styleUrl: "./sizes-observer.component.scss",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SizesObserverComponent implements OnDestroy {
  @Input() delay = 0;

  @Output() sizesChange = new EventEmitter<SizesObserverChange>();

  private observer?: ResizeObserver;

  constructor(private element: ElementRef<HTMLElement>) {
    afterNextRender(() => {
      this.observer = new ResizeObserver(
        debounce(([entry]) => {
          const { width, height } = entry.contentRect;
          this.sizesChange.emit({ width, height });
        }, this.delay)
      );

      this.observe();
    });
  }

  ngOnDestroy(): void {
    this.unobserve();
  }

  private observe() {
    this.observer?.observe(this.element.nativeElement);
  }

  private unobserve() {
    this.observer?.unobserve(this.element.nativeElement);
  }
}
