import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
} from "@angular/core";

@Component({
  selector: "app-sortable-item",
  templateUrl: "./sortable-item.component.html",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    draggable: "true",
    "(dragstart)": "handleDragStart()",
    "(dragend)": "handleDragEnd()",
  },
})
export class SortableItemComponent {
  @Input({ required: true }) index!: number;

  constructor(public ref: ElementRef<HTMLElement>) {}

  isDraggable = false;

  handleDragStart() {
    const element = this.ref.nativeElement;

    setTimeout(() => {
      element.style.opacity = "0";
    }, 0);

    this.isDraggable = true;
  }

  handleDragEnd() {
    const element = this.ref.nativeElement;

    element.style.opacity = "1";

    this.isDraggable = false;
  }
}
